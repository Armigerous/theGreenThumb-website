// app/api/plants/plant_card/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { allFilters } from "@/types/filterData";
import { PlantCardData } from "@/types/plant";

/**
 * Build a Map from each filter category's "id" (like "nc-regions")
 * to its actual Postgres column name ("nc_regions").
 */
function buildFilterIdToDbColumnMap() {
  const map = new Map<string, string>();
  for (const section of allFilters) {
    for (const category of section.categories) {
      map.set(category.id, category.dbColumn);
    }
  }
  return map;
}

export async function GET(request: Request) {
  try {
    // 1) Parse query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.toLowerCase() || "";
    const limit = Number(searchParams.get("limit") || "28");
    const offset = Number(searchParams.get("offset") || "0");
    const filtersParam = searchParams.get("filters") || "";

    // 2) Convert filtersParam into { dbColumn: string[] }
    //    e.g. "nc-regions|Coastal,soil-ph|Neutral (6.0-8.0)"
    const filterMap = buildFilterIdToDbColumnMap();
    const groupedFilters: Record<string, string[]> = {};

    if (filtersParam) {
      const filterPairs = filtersParam.split(",");
      for (const pair of filterPairs) {
        const [filterId, filterValue] = pair.split("|");
        if (!filterId || !filterValue) continue;

        const dbColumn = filterMap.get(filterId);
        if (!dbColumn) {
          console.warn(
            `Warning: Unrecognized filter ID "${filterId}". Skipping.`
          );
          continue;
        }
        if (!groupedFilters[dbColumn]) {
          groupedFilters[dbColumn] = [];
        }
        groupedFilters[dbColumn].push(filterValue);
      }
    }

    // 3) If we have any filters, query plant_full_data first to get matching IDs
    let matchingIds: number[] | null = null;
    if (Object.keys(groupedFilters).length > 0) {
      let supabaseFilterQuery = supabase
        .from("plant_full_data")
        .select("id", { count: "exact" });

      for (const [dbColumn, values] of Object.entries(groupedFilters)) {
        // JSON.stringify(values) converts the JS array into a valid JSON array literal,
        // e.g. [ 'Coastal', 'Mountains' ] becomes '["Coastal","Mountains"]'
        supabaseFilterQuery = supabaseFilterQuery.filter(
          dbColumn,
          "cs",
          JSON.stringify(values)
        );
      }

      // Execute filter query
      const { data: filteredData, error: filterError } =
        await supabaseFilterQuery.returns<{ id: number }[]>();

      // Enhanced error logging
      if (filterError) {
        console.error("Filter query failed:", {
          error: filterError,
          details: filterError.details,
          message: filterError.message,
          hint: filterError.hint,
          code: filterError.code,
        });
        return NextResponse.json(
          { error: filterError.message },
          { status: 500 }
        );
      }

      // If no rows match, return empty
      if (!filteredData || filteredData.length === 0) {
        const emptyResponse = NextResponse.json({ results: [], count: 0 });
        emptyResponse.headers.set(
          "Cache-Control",
          "public, s-maxage=86400, stale-while-revalidate=7200"
        );
        return emptyResponse;
      }

      matchingIds = filteredData.map((row) => row.id);
    }

    // 4) Now query the materialized view "plant_card_data"
    //    - if we have matchingIds, use .in("id", matchingIds)
    //    - apply search if provided
    //    - apply pagination
    let supabaseQuery = supabase
      .from("plant_card_data")
      .select(
        `
          id,
          slug,
          scientific_name,
          description,
          first_common_name,
          first_tag,
          first_image,
          first_image_alt_text
        `,
        { count: "exact" }
      )
      .order("scientific_name", { ascending: true })
      .range(offset, offset + limit - 1);

    if (matchingIds) {
      supabaseQuery = supabaseQuery.in("id", matchingIds);
    }

    // If a search query is provided, apply an OR filter across multiple columns
    if (query) {
      const orFilter = `scientific_name.ilike.%${query}%,first_common_name.ilike.%${query}%,description.ilike.%${query}%`;
      supabaseQuery = supabaseQuery.or(orFilter);
    }

    // Execute final query
    const { data, error, count } =
      await supabaseQuery.returns<PlantCardData[]>();
    if (error) {
      console.error("Supabase query error:", error.details || error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 5) Map the data to the shape the frontend needs
    const plants = (data || []).map((row) => ({
      id: row.id,
      slug: row.slug,
      scientific_name: row.scientific_name,
      description: row.description,
      first_common_name: row.first_common_name,
      first_tag: row.first_tag,
      first_image: row.first_image,
      first_image_alt_text: row.first_image_alt_text,
    }));

    // 6) Return JSON with appropriate caching headers
    const response = NextResponse.json({ results: plants, count });
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=7200"
    );
    return response;
  } catch (err: unknown) {
    console.error("Unexpected error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Server error: " + errorMessage },
      { status: 500 }
    );
  }
}

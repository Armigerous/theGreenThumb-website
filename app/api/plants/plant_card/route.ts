// app/api/plants/plant_card/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { allFilters } from "@/types/filterData";
import {
  PlantCardData,
  PlantCardDataCommon,
  PlantCardDataScientific,
} from "@/types/plant";

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

export const fetchCache = 'force-cache';
export const revalidate = 3600;

// Cache the initial data query results
interface CachedData {
  results: (PlantCardDataCommon | PlantCardDataScientific)[];
  count: number;
}

let cachedInitialData: CachedData | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 3600 * 1000; // 1 hour in milliseconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.toLowerCase() || "";
    const limit = Number(searchParams.get("limit") || "28");
    const offset = Number(searchParams.get("offset") || "0");
    const filtersParam = searchParams.get("filters") || "";
    const nameType = searchParams.get("nameType") || "scientific";

    // For initial load (no query, no filters, first page)
    if (!query && !filtersParam && offset === 0) {
      // Check if we have valid cached data
      const now = Date.now();
      if (cachedInitialData && (now - cacheTimestamp) < CACHE_TTL) {
        return NextResponse.json(cachedInitialData, {
          status: 200,
          headers: {
            'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
        });
      }

      const tableName = nameType === "common" ? "plant_common_card_data" : "plant_card_data";
      const orderColumn = nameType === "common" ? "common_name" : "scientific_name";
      const selectColumns = nameType === "common" ? `
        id,
        slug,
        common_name,
        description,
        scientific_name,
        first_tag,
        first_image,
        first_image_alt_text
      ` : `
        id,
        slug,
        scientific_name,
        description,
        common_name,
        first_tag,
        first_image,
        first_image_alt_text
      `;

      const { data, error, count = 0 } = await supabase
        .from(tableName as "plant_card_data")
        .select(selectColumns, { count: "exact" })
        .order(orderColumn, { ascending: true })
        .range(0, limit - 1);

      if (error) {
        console.error("Supabase query error:", error.details || error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Process the data based on nameType
      const processedData = (data || []).map((row) => {
        if (nameType === "common") {
          const commonRow = row as unknown as {
            id: number;
            slug: string | null;
            common_name: string | null;
            description: string | null;
            scientific_name: string | null;
            first_tag: string | null;
            first_image: string | null;
            first_image_alt_text: string | null;
          };
          return {
            id: commonRow.id,
            slug: commonRow.slug,
            common_name: commonRow.common_name,
            description: commonRow.description,
            scientific_name: commonRow.scientific_name,
            first_tag: commonRow.first_tag,
            first_image: commonRow.first_image,
            first_image_alt_text: commonRow.first_image_alt_text,
          } satisfies PlantCardDataCommon;
        } else {
          const scientificRow = row as unknown as {
            id: number;
            slug: string | null;
            scientific_name: string | null;
            description: string | null;
            common_name: string | null;
            first_tag: string | null;
            first_image: string | null;
            first_image_alt_text: string | null;
          };
          return {
            id: scientificRow.id,
            slug: scientificRow.slug,
            scientific_name: scientificRow.scientific_name,
            description: scientificRow.description,
            common_name: scientificRow.common_name,
            first_tag: scientificRow.first_tag,
            first_image: scientificRow.first_image,
            first_image_alt_text: scientificRow.first_image_alt_text,
          } satisfies PlantCardDataScientific;
        }
      });

      // Cache the results
      cachedInitialData = { results: processedData, count: count ?? 0 };
      cacheTimestamp = now;

      return NextResponse.json(cachedInitialData, {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }

    // Convert filtersParam into { dbColumn: string[] }
    const filterMap = buildFilterIdToDbColumnMap();
    const groupedFilters: Record<string, string[]> = {};

    if (filtersParam) {
      const filterPairs = filtersParam.split(",");
      for (const pair of filterPairs) {
        const [filterId, filterValue] = pair.split("|");
        if (!filterId || !filterValue) continue;

        const dbColumn = filterMap.get(filterId);
        if (!dbColumn) {
          console.warn(`Warning: Unrecognized filter ID "${filterId}". Skipping.`);
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

    // 4) Now query the appropriate materialized view based on nameType
    const tableName =
      nameType === "common" ? "plant_common_card_data" : "plant_card_data";

    let orderColumn: string;
    let selectColumns: string;
    if (nameType === "common") {
      orderColumn = "common_name";
      selectColumns = `
        id,
        slug,
        common_name,
        description,
        scientific_name,
        first_tag,
        first_image,
        first_image_alt_text
      `;
    } else {
      orderColumn = "scientific_name";
      selectColumns = `
        id,
        slug,
        scientific_name,
        description,
        common_name,
        first_tag,
        first_image,
        first_image_alt_text
      `;
    }

    let supabaseQuery = supabase
      .from(tableName as "plant_card_data")
      .select(selectColumns, { count: "exact" })
      .order(orderColumn, { ascending: true })
      .range(offset, offset + limit - 1);

    if (matchingIds) {
      supabaseQuery = supabaseQuery.in("id", matchingIds);
    }

    // Apply search filter across multiple columns
    if (query) {
      let orFilter: string;
      if (nameType === "common") {
        orFilter = `scientific_name.ilike.%${query}%,common_name.ilike.%${query}%,description.ilike.%${query}%`;
      } else {
        orFilter = `scientific_name.ilike.%${query}%,common_name.ilike.%${query}%,description.ilike.%${query}%`;
      }
      supabaseQuery = supabaseQuery.or(orFilter);
    }

    // Execute final query
    const { data, error, count } = await supabaseQuery.returns<PlantCardData[]>();
    
    if (error) {
      console.error("Supabase query error:", error.details || error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 5) Map the data to the shape the frontend needs
    const plants = (data || []).map((row) => {
      if (nameType === "common") {
        const commonRow = row as unknown as {
          id: number;
          slug: string | null;
          common_name: string | null;
          description: string | null;
          scientific_name: string | null;
          first_tag: string | null;
          first_image: string | null;
          first_image_alt_text: string | null;
        };
        return {
          id: commonRow.id,
          slug: commonRow.slug,
          common_name: commonRow.common_name,
          description: commonRow.description,
          scientific_name: commonRow.scientific_name,
          first_tag: commonRow.first_tag,
          first_image: commonRow.first_image,
          first_image_alt_text: commonRow.first_image_alt_text,
        } satisfies PlantCardDataCommon;
      } else {
        const scientificRow = row as unknown as {
          id: number;
          slug: string | null;
          scientific_name: string | null;
          description: string | null;
          common_name: string | null;
          first_tag: string | null;
          first_image: string | null;
          first_image_alt_text: string | null;
        };
        return {
          id: scientificRow.id,
          slug: scientificRow.slug,
          scientific_name: scientificRow.scientific_name,
          description: scientificRow.description,
          common_name: scientificRow.common_name,
          first_tag: scientificRow.first_tag,
          first_image: scientificRow.first_image,
          first_image_alt_text: scientificRow.first_image_alt_text,
        } satisfies PlantCardDataScientific;
      }
    });

    // Create and return the response with appropriate cache headers
    return NextResponse.json({ results: plants, count }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// app/api/plants/plant_card/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import {
  PlantCardDataCommon,
  PlantCardDataScientific,
} from "@/types/plant";

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

// Define a static handler for the initial data load
export async function generateStaticParams() {
  return [{}]; // Generate a single static route with no params
}

// Use a static handler for the initial data
export async function GET(request: Request) {
  try {
    // Use searchParams from context instead of request.url
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
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

    // For dynamic queries, we need to use a dynamic route
    // This will be handled by the dynamic API route
    return NextResponse.json({ 
      error: "This endpoint only supports static initial data. For filtered or paginated data, use the dynamic endpoint." 
    }, { status: 400 });
  } catch (error) {
    console.error("Error in plant_card route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { unstable_cache } from "next/cache";

// Revalidate cache every 24 hours
export const revalidate = 86400;

// Reason: Use Node.js runtime to avoid Edge Runtime compatibility issues with Supabase
export const runtime = "nodejs";

const getPlantSearchResults = unstable_cache(
  async (query: string, nameType: string) => {
    // Set table and columns based on the name type
    const tableName =
      nameType === "common" ? "plant_common_card_data" : "plant_autocomplete";
    let selectColumns: string;
    let searchColumn: string;

    if (nameType === "common") {
      selectColumns = "slug, common_name";
      searchColumn = "common_name";
    } else {
      selectColumns = "slug, scientific_name";
      searchColumn = "scientific_name";
    }

    const { data, error } = await supabase
      .from(tableName)
      .select(selectColumns)
      .ilike(searchColumn, `%${query}%`)
      .order(searchColumn, { ascending: true })
      .limit(7);

    if (error) {
      throw new Error("Failed to fetch plant data");
    }

    if (!data) {
      throw new Error("No plant data found");
    }

    return data;
  },
  ["plant-search"],
  {
    revalidate: 86400, // 24 hours
    tags: ["plants"],
  }
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.toLowerCase() || "";
  // Read the nameType parameter from the URL (default to scientific if not provided)
  const nameType = searchParams.get("nameType") || "scientific";

  try {
    const data = await getPlantSearchResults(query, nameType);

    const response = NextResponse.json({ results: data });
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=7200"
    );

    return response;
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

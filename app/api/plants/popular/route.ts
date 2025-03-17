import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { unstable_cache } from "next/cache";

// Revalidate cache every 24 hours
export const revalidate = 86400;

const getPopularPlants = unstable_cache(
  async (nameType: string, limit: number) => {
    // Set table and columns based on the name type
    const tableName =
      nameType === "common" ? "plant_common_card_data" : "plant_autocomplete";
    let selectColumns: string;
    let orderColumn: string;

    if (nameType === "common") {
      selectColumns = "slug, common_name";
      orderColumn = "common_name";
    } else {
      selectColumns = "slug, scientific_name";
      orderColumn = "scientific_name";
    }

    // Fetch popular plants - this could be improved based on actual popularity metrics
    // Currently just fetching alphabetically as a simple implementation
    const { data, error } = await supabase
      .from(tableName)
      .select(selectColumns)
      .order(orderColumn, { ascending: true })
      .limit(limit);

    if (error) {
      throw new Error("Failed to fetch popular plant data");
    }

    if (!data) {
      throw new Error("No plant data found");
    }

    return data;
  },
  ["popular-plants"],
  {
    revalidate: 86400, // 24 hours
    tags: ["plants"],
  }
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Read the nameType parameter from the URL (default to scientific if not provided)
  const nameType = searchParams.get("nameType") || "scientific";
  // Get limit parameter with default of 7
  const limit = parseInt(searchParams.get("limit") || "7", 10);

  try {
    const data = await getPopularPlants(nameType, limit);

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
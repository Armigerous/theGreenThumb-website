//api/plants/search/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { unstable_cache } from "next/cache";

// Revalidate cache every 24 hours
export const revalidate = 86400;

// Cache the search query function
const getPlantSearchResults = unstable_cache(
  async (query: string) => {
    const { data, error } = await supabase
      .from("plant_autocomplete")
      .select("slug, scientific_name")
      .ilike("scientific_name", `%${query}%`)
      .order("scientific_name", { ascending: true })
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

  try {
    const data = await getPlantSearchResults(query);

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

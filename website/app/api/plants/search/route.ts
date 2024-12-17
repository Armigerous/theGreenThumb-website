import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.toLowerCase() || "";

  try {
    // Query the scientificNames table and join with mainPlantData to get the slug
    const { data, error } = await supabase
      .from("scientificNames")
      .select("scientificName, mainPlantData(slug)")
      .ilike("scientificName", `%${query}%`)
      .limit(7);

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch plant data" },
        { status: 500 }
      );
    }

    // Transform the result to match the expected structure
    const plants = data.map((row) => ({
      scientific_name: row.scientificName,
      slug: row.mainPlantData.slug,
    }));

    return NextResponse.json(plants);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

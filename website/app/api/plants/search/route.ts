// route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { PlantScientificName, PlantScientificNameRow } from "@/types/plant";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.toLowerCase() || "";

  try {
    // Execute the query with proper typing
    const { data, error } = (await supabase
      .from("scientificNames")
      .select(
        `
        scientificName,
        mainPlantData ( slug )
      `
      )
      .ilike("scientificName", `%${query}%`)
      .limit(7)) as { data: PlantScientificNameRow[] | null; error: Error };

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch plant data" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "No plant data found" },
        { status: 404 }
      );
    }

    // Transform the data to match the PlantScientificName type
    const plants: PlantScientificName[] = data.map((row) => ({
      scientificName: row.scientificName,
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

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.toLowerCase() || "";
  const limit = Number(searchParams.get("limit") || 28);
  const offset = Number(searchParams.get("offset") || 0);

  try {
    // Start the query
    let supabaseQuery = supabase
      .from("mainPlantData")
      .select(
        `
        slug,
        description,
        scientificNames!inner ( scientificName ),
        commonNames ( commonName ),
        plantImages ( img, altText, caption, attribution ),
        tagsMapping ( 
          tagId, 
          tagsLookup ( name ) 
        )
        `,
        { count: "exact" } // Fetch the total count of filtered rows
      )
      .range(offset, offset + limit - 1);

    // Add filter for scientific name if query is provided
    if (query) {
      supabaseQuery = supabaseQuery.ilike(
        "scientificNames.scientificName",
        `%${query}%`
      );
    }

    // Execute the query
    const { data, error, count } = await supabaseQuery;

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch plant data" },
        { status: 500 }
      );
    }

    // Transform the data to return the first match for each subfield
    const plants = data.map((plant) => ({
      slug: plant.slug,
      description: plant.description,
      scientificName: plant.scientificNames?.[0]?.scientificName || "Unknown",
      commonName: plant.commonNames?.[0]?.commonName || "N/A",
      tag: plant.tagsMapping?.[0]?.tagsLookup?.name || "N/A", // Fetch only the first tag name
      image: plant.plantImages?.[0]
        ? {
            img: plant.plantImages[0].img,
            altText: plant.plantImages[0].altText,
            caption: plant.plantImages[0].caption,
            attribution: plant.plantImages[0].attribution,
          }
        : {
            img: "/no-plant-image.png",
            altText: "No plant image available",
            caption: "",
            attribution: "",
          },
    }));

    return NextResponse.json({ results: plants, count });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

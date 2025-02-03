// app/api/plants/plant_card/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  // Parse the URL search parameters.
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.toLowerCase() || "";
  const limit = Number(searchParams.get("limit") || "28");
  const offset = Number(searchParams.get("offset") || "0");
  // In this new implementation we assume a single filter value to filter the plant’s primary tag.
  const filtersParam = searchParams.get("filters") || "";

  // Start with a query on the materialized view.
  // Note: We select only the columns that are available in plant_card_data.
  let supabaseQuery = supabase
    .from("plant_card_data")
    .select(
      `
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
    .order("scientific_name", { ascending: true }) // Sort in ascending order
    .range(offset, offset + limit - 1);

  // 1) Apply search filtering on multiple columns if a query is provided.
  if (query) {
    // Supabase allows OR filters by providing a comma-separated string of conditions.
    const orFilter = `scientific_name.ilike.%${query}%,first_common_name.ilike.%${query}%,description.ilike.%${query}%`;
    supabaseQuery = supabaseQuery.or(orFilter);
  }

  // 2) If a filters parameter is provided, apply a filter on the first_tag column.
  if (filtersParam) {
    supabaseQuery = supabaseQuery.ilike("first_tag", `%${filtersParam}%`);
  }

  // 3) Execute the query.
  const { data, error, count } = await supabaseQuery;

  if (error) {
    console.error("Supabase error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 4) Transform each row from the materialized view to the structure expected by your frontend.
  //    Note: The mapping converts:
  //      • scientific_name → scientificName
  //      • first_common_name → commonName
  //      • first_tag → tag
  //      • first_image & first_image_alt_text → image.img & image.altText (with caption and attribution as defaults)
  const plants = (data || []).map((plant) => ({
    slug: plant.slug,
    description: plant.description,
    scientificName: plant.scientific_name,
    commonName: plant.first_common_name,
    tag: plant.first_tag,
    image: {
      img: plant.first_image?.trim() ? plant.first_image : null,
      altText: plant.first_image_alt_text,
      caption: "",
      attribution: "",
    },
  }));

  return NextResponse.json({ results: plants, count });
}

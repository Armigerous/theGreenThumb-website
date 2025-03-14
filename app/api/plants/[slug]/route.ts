import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { unstable_cache } from "next/cache";

// Revalidate cache every 24 hours
export const revalidate = 86400;

const getPlantDetails = unstable_cache(
  async (slug: string) => {
    const { data: plant, error } = await supabase
      .from("plant_full_data")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      throw new Error(`Failed to fetch plant details: ${error.message}`);
    }

    if (!plant) {
      throw new Error("Plant not found");
    }

    return plant;
  },
  ["plant-details"],
  {
    revalidate: 86400, // 24 hours
    tags: ["plants"],
  }
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug;

  try {
    const plant = await getPlantDetails(slug);

    const response = NextResponse.json({ plant });
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=7200"
    );

    return response;
  } catch (error) {
    console.error("Error:", error);
    
    if (error instanceof Error && error.message === "Plant not found") {
      return NextResponse.json(
        { error: "Plant not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
} 
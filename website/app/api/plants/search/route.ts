//api/plants/search/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.toLowerCase() || "";

  try {
    // Query the plant_autocomplete view for matching scientific names
    const { data, error } = await supabase
      .from("plant_autocomplete")
      .select("slug, scientific_name")
      .ilike("scientific_name", `%${query}%`)
      .order("scientific_name", { ascending: true }) // Sort in ascending order
      .limit(7);

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

    return NextResponse.json({ results: data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

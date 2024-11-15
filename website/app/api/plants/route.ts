// app/api/plants/route.ts

import { ApiResponse } from "@/types/plantsList";
import { NextResponse } from "next/server";

const API_URL = "https://plants.ces.ncsu.edu/api/plants/?format=json&limit=28";

export async function GET() {
  try {
    // Fetch data from the external API
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch plant data: ${response.statusText}`);
    }

    // Parse the JSON response and type it as ApiResponse
    const data: ApiResponse = await response.json();

    // Return the structured and typed JSON response
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching plant data:", error);
    return NextResponse.json(
      {
        message: "Failed to retrieve plant data",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

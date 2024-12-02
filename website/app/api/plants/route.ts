// app/api/plants/route.ts
import { NextResponse } from "next/server";
import { fetchAllPlants } from "@/lib/utils";
import { BasicPlantData } from "@/types/plant";

export async function GET(request: Request) {
  console.log(`FUck: ${Request}`);

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.toLowerCase() || "";

  // Fetch all plants
  const plants: BasicPlantData[] = await fetchAllPlants();

  // Filter plants based on the query
  const filteredPlants = plants.filter((plant) =>
    plant.scientific_name.toLowerCase().includes(query)
  );

  return NextResponse.json(filteredPlants);
}

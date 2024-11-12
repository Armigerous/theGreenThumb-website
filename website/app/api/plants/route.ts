// app/api/plants/route.ts

import { ApiResponse, PlantSummary } from '@/types/plantsList';
import { NextResponse } from 'next/server';

const API_URL = 'https://plants.ces.ncsu.edu/api/plants/?format=json&limit=28';

export async function GET(request: Request) {
  try {
    // Parse the incoming request URL
    const url = new URL(request.url);
    const offset = url.searchParams.get('offset') || '0';

    // Construct the API endpoint with the offset
    const apiEndpoint = `${API_URL}&offset=${offset}`;

    // Fetch data from the external API
    const response = await fetch(apiEndpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch plant data: ${response.statusText}`);
    }

    // Parse the JSON response and type it as ApiResponse
    const data: ApiResponse = await response.json();

    // Optionally, you can filter or transform the data as needed
    // For example, selecting specific fields or transforming structures

    // Here, we'll return the entire PlantSummary objects
    const plants: PlantSummary[] = data.results.map((plant) => ({
      id: plant.id,
      slug: plant.slug,
      scientific_name: plant.scientific_name,
      genus: plant.genus,
      species: plant.species,
      description: plant.description,
      wildlife_value: plant.wildlife_value,
      leaf_description: plant.leaf_description,
      stem_description: plant.stem_description,
      fruit_description: plant.fruit_description,
      flower_description: plant.flower_description,
      plantimage_set: plant.plantimage_set,
      commonname_set: plant.commonname_set,
      cultivar_set: plant.cultivar_set,
      synonym_set: plant.synonym_set,
      tags: plant.tags,
    }));

    // Construct the response object with typed data
    const responseBody: ApiResponse = {
      count: data.count,
      next: data.next,
      previous: data.previous,
      results: plants,
    };

    // Return the structured and typed JSON response
    return NextResponse.json(responseBody);
  } catch (error) {
    console.error('Error fetching plant data:', error);
    return NextResponse.json(
      { message: 'Failed to retrieve plant data', error: (error as Error).message },
      { status: 500 }
    );
  }
}

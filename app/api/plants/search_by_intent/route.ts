import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { PlantCardDataCommon, PlantCardDataScientific } from "@/types/plant";

// Define proper types for intent data structure
interface Entity {
  scientific_name?: string;
  plant?: string;
  common_name?: string;
  light_level?: string;
  soil_texture?: string;
  type?: string;
  flower_color?: string;
  wildlife_type?: string;
  [key: string]: string | undefined;
}

interface Intent {
  intent: string;
  entities: Entity;
}

// Reason: Use Node.js runtime to avoid Edge Runtime compatibility issues with Supabase
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { intents } = await request.json();
    
    if (!intents || !Array.isArray(intents) || intents.length === 0) {
      return NextResponse.json(
        { error: "Invalid or missing intents" },
        { status: 400 }
      );
    }

    // Extract plant name if present in any intent
    let plantName = null;
    let isScientificName = false;

    for (const intent of intents) {
      if (intent.entities.scientific_name) {
        plantName = intent.entities.scientific_name;
        isScientificName = true;
        break;
      } else if (intent.entities.plant) {
        plantName = intent.entities.plant;
        break;
      } else if (intent.entities.common_name) {
        plantName = intent.entities.common_name;
        break;
      }
    }

    if (!plantName) {
      // Handle intent-based search without specific plant name
      return await handleIntentBasedSearch(intents);
    }

    // Determine which table to query based on name type
    const tableName = isScientificName ? "plant_card_data" : "plant_common_card_data";
    
    // Build the query - use a simpler approach with select and no filtering
    // We'll filter the results in memory after fetching
    const { data, error } = await supabase
      .from(tableName)
      .select("*", { count: "exact" });
    
    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "Failed to search plants" },
        { status: 500 }
      );
    }
    
    // Filter the results in memory based on the plant name
    const searchColumn = isScientificName ? 'scientific_name' : 'common_name';
    const filteredData = data?.filter(item => {
      const value = item[searchColumn];
      return value && typeof value === 'string' && 
        value.toLowerCase().includes(plantName!.toLowerCase());
    }) || [];
    
    // Process the filtered results
    const results = processResults(filteredData, isScientificName);
    
    return NextResponse.json({ 
      results, 
      count: results.length,
      searchType: isScientificName ? "scientific" : "common",
      query: plantName
    }, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
    
  } catch (error) {
    console.error("Error searching plants by intent:", error);
    return NextResponse.json(
      { error: "Failed to search plants" },
      { status: 500 }
    );
  }
}

// Process results based on the table queried
function processResults(data: Record<string, unknown>[], isScientificName: boolean) {
  if (!data || data.length === 0) return [];
  
  return data.map(row => {
    if (isScientificName) {
      return {
        id: row.id as number,
        slug: row.slug as string | null,
        scientific_name: row.scientific_name as string | null,
        description: row.description as string | null,
        common_name: row.common_name as string | null,
        first_tag: row.first_tag as string | null,
        first_image: row.first_image as string | null,
        first_image_alt_text: row.first_image_alt_text as string | null,
      } satisfies PlantCardDataScientific;
    } else {
      return {
        id: row.id as number,
        slug: row.slug as string | null,
        common_name: row.common_name as string | null,
        description: row.description as string | null,
        scientific_name: row.scientific_name as string | null,
        first_tag: row.first_tag as string | null,
        first_image: row.first_image as string | null,
        first_image_alt_text: row.first_image_alt_text as string | null,
      } satisfies PlantCardDataCommon;
    }
  });
}

// Handle search based on intents without specific plant name
async function handleIntentBasedSearch(intents: Intent[]) {
  // Extract search criteria from intents
  const searchCriteria: Record<string, string> = {};
  
  for (const intent of intents) {
    switch (intent.intent) {
      case "light_requirements":
        if (intent.entities.light_level) {
          searchCriteria.light_requirements = intent.entities.light_level;
        }
        break;
      case "soil_texture":
        if (intent.entities.soil_texture) {
          searchCriteria.soil_texture = intent.entities.soil_texture;
        }
        break;
      case "plant_type":
        if (intent.entities.type) {
          searchCriteria.plant_types = intent.entities.type;
        }
        break;
      case "flower_color":
        if (intent.entities.flower_color) {
          searchCriteria.flower_colors = intent.entities.flower_color;
        }
        break;
      case "attracts":
        if (intent.entities.wildlife_type) {
          searchCriteria.attracts = intent.entities.wildlife_type;
        }
        break;
      // Add more mappings as needed
    }
  }
  
  if (Object.keys(searchCriteria).length === 0) {
    return NextResponse.json(
      { error: "No searchable criteria found in intents" },
      { status: 400 }
    );
  }
  
  // Query the plant_full_data table which contains all the detailed attributes
  let query = supabase.from("plant_full_data").select("id");
  
  // Apply filters based on search criteria
  for (const [key, value] of Object.entries(searchCriteria)) {
    // For JSONB columns, we need to use containment operators
    query = query.filter(key, "cs", JSON.stringify([value]));
  }
  
  const { data: matchingIds, error: matchingError } = await query;
  
  if (matchingError) {
    console.error("Error finding matching plants:", matchingError);
    return NextResponse.json(
      { error: "Failed to search plants by criteria" },
      { status: 500 }
    );
  }
  
  if (!matchingIds || matchingIds.length === 0) {
    return NextResponse.json({ results: [], count: 0 });
  }
  
  // Get the full plant data for the matching IDs
  const ids = matchingIds.map(item => item.id);
  
  const { data: plants, error: plantsError, count } = await supabase
    .from("plant_card_data")
    .select("*", { count: "exact" })
    .in("id", ids)
    .limit(20);
  
  if (plantsError) {
    console.error("Error fetching plant details:", plantsError);
    return NextResponse.json(
      { error: "Failed to fetch plant details" },
      { status: 500 }
    );
  }
  
  const results = processResults(plants || [], true);
  
  return NextResponse.json({ 
    results, 
    count,
    searchType: "intent",
    criteria: searchCriteria
  }, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
} 
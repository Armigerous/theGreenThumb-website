import { db } from "@/lib/db";
import { plantFullData } from "@/lib/db/migrations/schema";
import { auth } from "@clerk/nextjs/server";
import { and, sql, notInArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { gardenData, relatedPlants = [] } = await req.json();
    
    if (!gardenData) {
      return NextResponse.json({ error: "Garden data is required" }, { status: 400 });
    }
    
    // Build query conditions based on user garden data
    const conditions = [];
    
    // Helper function to safely convert IDs to integers
    const safeIntArray = (arr: string[]) => {
      if (!arr || !Array.isArray(arr)) return [];
      return arr.map(id => {
        const parsed = parseInt(id, 10);
        return isNaN(parsed) ? null : parsed;
      }).filter(id => id !== null) as number[];
    };
    
    // USDA Zones
    if (gardenData.usda_zones_ids && gardenData.usda_zones_ids.length > 0) {
      const zoneIds = safeIntArray(gardenData.usda_zones_ids);
      if (zoneIds.length > 0) {
        conditions.push(
          sql`jsonb_array_length(${plantFullData.usdaZones}) > 0 AND EXISTS (
            SELECT 1 FROM jsonb_array_elements_text(${plantFullData.usdaZones}) AS zone
            WHERE zone = ${zoneIds[0].toString()}
          )`
        );
      }
    }
    
    // Light requirements
    if (gardenData.sunlightIds && gardenData.sunlightIds.length > 0) {
      const lightIds = safeIntArray(gardenData.sunlightIds);
      if (lightIds.length > 0) {
        conditions.push(
          sql`jsonb_array_length(${plantFullData.lightRequirements}) > 0 AND EXISTS (
            SELECT 1 FROM jsonb_array_elements_text(${plantFullData.lightRequirements}) AS light
            WHERE light = ${lightIds[0].toString()}
          )`
        );
      }
    }
    
    // Soil type
    if (gardenData.soilTextureIds && gardenData.soilTextureIds.length > 0) {
      const soilTextureIds = safeIntArray(gardenData.soilTextureIds);
      if (soilTextureIds.length > 0) {
        conditions.push(
          sql`jsonb_array_length(${plantFullData.soilTexture}) > 0 AND EXISTS (
            SELECT 1 FROM jsonb_array_elements_text(${plantFullData.soilTexture}) AS soil
            WHERE soil = ${soilTextureIds[0].toString()}
          )`
        );
      }
    }
    
    // Soil pH
    if (gardenData.soilPhIds && gardenData.soilPhIds.length > 0) {
      const soilPhIds = safeIntArray(gardenData.soilPhIds);
      if (soilPhIds.length > 0) {
        conditions.push(
          sql`jsonb_array_length(${plantFullData.soilPh}) > 0 AND EXISTS (
            SELECT 1 FROM jsonb_array_elements_text(${plantFullData.soilPh}) AS ph
            WHERE ph = ${soilPhIds[0].toString()}
          )`
        );
      }
    }
    
    // Soil drainage
    if (gardenData.soilDrainageIds && gardenData.soilDrainageIds.length > 0) {
      const drainageIds = safeIntArray(gardenData.soilDrainageIds);
      if (drainageIds.length > 0) {
        conditions.push(
          sql`jsonb_array_length(${plantFullData.soilDrainage}) > 0 AND EXISTS (
            SELECT 1 FROM jsonb_array_elements_text(${plantFullData.soilDrainage}) AS drainage
            WHERE drainage = ${drainageIds[0].toString()}
          )`
        );
      }
    }
    
    // Garden themes
    if (gardenData.gardenThemeIds && gardenData.gardenThemeIds.length > 0) {
      const themeIds = safeIntArray(gardenData.gardenThemeIds);
      if (themeIds.length > 0) {
        conditions.push(
          sql`jsonb_array_length(${plantFullData.landscapeTheme}) > 0 AND EXISTS (
            SELECT 1 FROM jsonb_array_elements_text(${plantFullData.landscapeTheme}) AS theme
            WHERE theme = ${themeIds[0].toString()}
          )`
        );
      }
    }
    
    // Wildlife attraction
    if (gardenData.wildlifeAttractionIds && gardenData.wildlifeAttractionIds.length > 0) {
      const wildlifeIds = safeIntArray(gardenData.wildlifeAttractionIds);
      if (wildlifeIds.length > 0) {
        conditions.push(
          sql`jsonb_array_length(${plantFullData.attracts}) > 0 AND EXISTS (
            SELECT 1 FROM jsonb_array_elements_text(${plantFullData.attracts}) AS wildlife
            WHERE wildlife = ${wildlifeIds[0].toString()}
          )`
        );
      }
    }
    
    // Resistance to challenges
    if (gardenData.resistanceChallengeIds && gardenData.resistanceChallengeIds.length > 0) {
      const resistanceIds = safeIntArray(gardenData.resistanceChallengeIds);
      if (resistanceIds.length > 0) {
        conditions.push(
          sql`jsonb_array_length(${plantFullData.resistanceToChallenges}) > 0 AND EXISTS (
            SELECT 1 FROM jsonb_array_elements_text(${plantFullData.resistanceToChallenges}) AS resistance
            WHERE resistance = ${resistanceIds[0].toString()}
          )`
        );
      }
    }
    
    // Plant types
    if (gardenData.plantTypeIds && gardenData.plantTypeIds.length > 0) {
      const plantTypeIds = safeIntArray(gardenData.plantTypeIds);
      if (plantTypeIds.length > 0) {
        conditions.push(
          sql`jsonb_array_length(${plantFullData.plantTypes}) > 0 AND EXISTS (
            SELECT 1 FROM jsonb_array_elements_text(${plantFullData.plantTypes}) AS plant_type
            WHERE plant_type = ${plantTypeIds[0].toString()}
          )`
        );
      }
    }
    
    // Flower colors
    if (gardenData.flowerColorIds && gardenData.flowerColorIds.length > 0) {
      const colorIds = safeIntArray(gardenData.flowerColorIds);
      if (colorIds.length > 0) {
        conditions.push(
          sql`jsonb_array_length(${plantFullData.flowerColors}) > 0 AND EXISTS (
            SELECT 1 FROM jsonb_array_elements_text(${plantFullData.flowerColors}) AS color
            WHERE color = ${colorIds[0].toString()}
          )`
        );
      }
    }
    
    // If we have related plants from the query, prioritize plants that are similar
    // but still match the garden conditions
    let query;
    
    if (relatedPlants && relatedPlants.length > 0) {
      // First, try to find plants that match both garden conditions and are related to query results
      const relatedConditions = [...conditions];
      
      // Convert relatedPlants to an array of integers
      const relatedPlantIds = relatedPlants
        .filter((id: unknown): id is string | number => 
          id !== null && id !== undefined && (typeof id === 'string' || typeof id === 'number')
        )
        .map((id: string | number) => {
          const parsed = parseInt(id.toString(), 10);
          return isNaN(parsed) ? null : parsed;
        })
        .filter((id: number | null): id is number => id !== null);
      
      // Add a condition to exclude the exact plants from the original query
      if (relatedPlantIds.length > 0) {
        relatedConditions.push(
          notInArray(plantFullData.id, relatedPlantIds)
        );
      }
      
      // Add conditions to find plants with similar characteristics
      // This could be plants in the same family, genus, or with similar tags
      const relatedQuery = db
        .select({
          id: plantFullData.id,
          slug: plantFullData.slug,
          scientificName: plantFullData.scientificName,
          commonNames: plantFullData.commonNames,
          description: plantFullData.description,
          firstImage: sql`(${plantFullData.images}->0->>'img')`,
          firstImageAltText: sql`(${plantFullData.images}->0->>'alt_text')`,
          firstTag: sql`${plantFullData.tags}->0`,
        })
        .from(plantFullData)
        .limit(10);
      
      // Add conditions if any
      if (relatedConditions.length > 0) {
        query = relatedQuery.where(and(...relatedConditions));
      } else {
        query = relatedQuery;
      }
    } else {
      // If no related plants, just use the garden conditions
      query = db
        .select({
          id: plantFullData.id,
          slug: plantFullData.slug,
          scientificName: plantFullData.scientificName,
          commonNames: plantFullData.commonNames,
          description: plantFullData.description,
          firstImage: sql`(${plantFullData.images}->0->>'img')`,
          firstImageAltText: sql`(${plantFullData.images}->0->>'alt_text')`,
          firstTag: sql`${plantFullData.tags}->0`,
        })
        .from(plantFullData)
        .limit(10);
      
      // Add conditions if any
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
    }
    
    const results = await query;
    
    // Format the results
    const formattedResults = results.map(plant => ({
      id: plant.id,
      slug: plant.slug,
      scientific_name: plant.scientificName,
      common_name: plant.commonNames?.[0] || "",
      description: plant.description,
      first_image: plant.firstImage,
      first_image_alt_text: plant.firstImageAltText,
      first_tag: plant.firstTag,
    }));
    
    return NextResponse.json({
      recommendations: formattedResults,
    });
  } catch (error) {
    console.error("Error generating garden recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate garden recommendations" },
      { status: 500 }
    );
  }
} 
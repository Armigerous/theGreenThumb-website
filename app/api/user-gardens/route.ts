import { db } from "@/lib/db";
import {
  attractsLookup, availableSpaceToPlantLookup, designFeatureLookup, flowerBloomTimeLookup, flowerColorLookup, flowerValueToGardenerLookup, habitLookup, landscapeLocationLookup, landscapeThemeLookup, leafColorLookup, leafFallColorLookup,
  leafValueToGardenerLookup, lightLookup, ncRegionLookup, plantTypesLookup, problemsLookup, resistanceToChallengesLookup, soilDrainageLookup,
  soilPhLookup, soilTextureLookup, leafFeelLookup, usdaZoneLookup, userGardens
} from "@/lib/db/migrations/schema"; // Import the table schema
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Route Segment Config
export const dynamic = 'force-dynamic'; // Always fetch fresh data for user-specific content
export const revalidate = 0; // Disable static caching

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const settings = await db.query.userGardens.findFirst({
      where: (settings, { eq }) => eq(settings.userId, userId),
    });

    if (!settings) {
      return NextResponse.json({ settings: null });
    }

    // Fetch all lookup tables to map IDs back to string values
    const locationLookups = await db.select().from(landscapeLocationLookup);
    const spaceAvailableLookups = await db.select().from(availableSpaceToPlantLookup);
    const soilPhLookups = await db.select().from(soilPhLookup);
    const soilTextureLookups = await db.select().from(soilTextureLookup);
    const soilDrainageLookups = await db.select().from(soilDrainageLookup);
    const sunlightLookups = await db.select().from(lightLookup);
    const usdaZonesLookups = await db.select().from(usdaZoneLookup);
    const ncRegionsLookups = await db.select().from(ncRegionLookup);
    const gardenThemeLookups = await db.select().from(landscapeThemeLookup);
    const wildlifeAttractionLookups = await db.select().from(attractsLookup);
    const resistanceChallengeLookups = await db.select().from(resistanceToChallengesLookup);
    const problemsToExcludeLookups = await db.select().from(problemsLookup);
    const habitFormLookups = await db.select().from(habitLookup);
    const plantTypeLookups = await db.select().from(plantTypesLookup);
    const flowerColorLookups = await db.select().from(flowerColorLookup);
    const flowerBloomTimeLookups = await db.select().from(flowerBloomTimeLookup);
    const flowerValueLookups = await db.select().from(flowerValueToGardenerLookup);
    const leafFeelLookups = await db.select().from(leafFeelLookup);
    const leafColorLookups = await db.select().from(leafColorLookup);
    const leafValueLookups = await db.select().from(leafValueToGardenerLookup);
    const fallColorLookups = await db.select().from(leafFallColorLookup);
    const designFeatureLookups = await db.select().from(designFeatureLookup);

    // Helper function to map IDs to string values
    const mapIdsToStrings = (ids: number[] | null, lookupTable: { id: number, name: string | null }[]) => {
      if (!ids || !Array.isArray(ids) || ids.length === 0) return [];
      
      return ids.map(id => {
        const match = lookupTable.find(item => item.id === id);
        return match?.name || null;
      }).filter(name => name !== null) as string[];
    };

    // Map all IDs to their string values
    const transformedSettings = {
      ...settings,
      // Map to the frontend expected field name and convert IDs to strings
      usda_zones_ids: mapIdsToStrings(settings.usdaZonesIds as number[], usdaZonesLookups),
      ncRegionsIds: mapIdsToStrings(settings.ncRegionsIds as number[], ncRegionsLookups),
      locationIds: mapIdsToStrings(settings.locationIds as number[], locationLookups),
      spaceAvailableIds: mapIdsToStrings(settings.spaceAvailableIds as number[], spaceAvailableLookups),
      sunlightIds: mapIdsToStrings(settings.sunlightIds as number[], sunlightLookups),
      soilTextureIds: mapIdsToStrings(settings.soilTextureIds as number[], soilTextureLookups),
      soilPhIds: mapIdsToStrings(settings.soilPhIds as number[], soilPhLookups),
      soilDrainageIds: mapIdsToStrings(settings.soilDrainageIds as number[], soilDrainageLookups),
      gardenThemeIds: mapIdsToStrings(settings.gardenThemeIds as number[], gardenThemeLookups),
      wildlifeAttractionIds: mapIdsToStrings(settings.wildlifeAttractionIds as number[], wildlifeAttractionLookups),
      resistanceChallengeIds: mapIdsToStrings(settings.resistanceChallengeIds as number[], resistanceChallengeLookups),
      problemsToExcludeIds: mapIdsToStrings(settings.problemsToExcludeIds as number[], problemsToExcludeLookups),
      habitFormIds: mapIdsToStrings(settings.habitFormIds as number[], habitFormLookups),
      plantTypeIds: mapIdsToStrings(settings.plantTypeIds as number[], plantTypeLookups),
      flowerColorIds: mapIdsToStrings(settings.flowerColorIds as number[], flowerColorLookups),
      flowerBloomTimeIds: mapIdsToStrings(settings.flowerBloomTimeIds as number[], flowerBloomTimeLookups),
      flowerValueIds: mapIdsToStrings(settings.flowerValueIds as number[], flowerValueLookups),
      leafFeelIds: mapIdsToStrings(settings.leafFeelIds as number[], leafFeelLookups),
      leafColorIds: mapIdsToStrings(settings.leafColorIds as number[], leafColorLookups),
      leafValueIds: mapIdsToStrings(settings.leafValueIds as number[], leafValueLookups),
      fallColorIds: mapIdsToStrings(settings.fallColorIds as number[], fallColorLookups),
      designFeatureIds: mapIdsToStrings(settings.designFeatureIds as number[], designFeatureLookups),
    };
    
    return NextResponse.json({ settings: transformedSettings }, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error("Error fetching user gardens:", error);
    return NextResponse.json(
      { error: "Failed to fetch user gardens" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Log the received data for debugging
    console.log("Received user gardens data:", data);
    
    // Check if settings already exist for this user
    const existingSettings = await db.query.userGardens.findFirst({
      where: (settings, { eq }) => eq(settings.userId, userId),
    });
    
    // Fetch all lookup tables to map string values to their corresponding IDs
    const locationLookups = await db.select().from(landscapeLocationLookup);
    const spaceAvailableLookups = await db.select().from(availableSpaceToPlantLookup);
    const soilPhLookups = await db.select().from(soilPhLookup);
    const soilTextureLookups = await db.select().from(soilTextureLookup);
    const soilDrainageLookups = await db.select().from(soilDrainageLookup);
    const sunlightLookups = await db.select().from(lightLookup);
    const usdaZonesLookups = await db.select().from(usdaZoneLookup);
    const ncRegionsLookups = await db.select().from(ncRegionLookup);
    const gardenThemeLookups = await db.select().from(landscapeThemeLookup);
    const wildlifeAttractionLookups = await db.select().from(attractsLookup);
    const resistanceChallengeLookups = await db.select().from(resistanceToChallengesLookup);
    const problemsToExcludeLookups = await db.select().from(problemsLookup);
    const habitFormLookups = await db.select().from(habitLookup);
    const plantTypeLookups = await db.select().from(plantTypesLookup);
    const flowerColorLookups = await db.select().from(flowerColorLookup);
    const flowerBloomTimeLookups = await db.select().from(flowerBloomTimeLookup);
    const flowerValueLookups = await db.select().from(flowerValueToGardenerLookup);
    const leafFeelLookups = await db.select().from(leafFeelLookup);
    const leafColorLookups = await db.select().from(leafColorLookup);
    const leafValueLookups = await db.select().from(leafValueToGardenerLookup);
    const fallColorLookups = await db.select().from(leafFallColorLookup);
    const designFeatureLookups = await db.select().from(designFeatureLookup);
    
    // Helper function to map string values to IDs
    const mapToIds = (values: string[], lookupTable: { id: number, name: string | null }[]) => {
      if (!Array.isArray(values)) return [];
      
      return values.map(value => {
        // If the value is already a number (ID), return it directly
        if (!isNaN(Number(value))) {
          return Number(value);
        }
        
        // Otherwise, look up the ID by name
        const match = lookupTable.find(item => item.name === value);
        return match ? match.id : null;
      }).filter(id => id !== null) as number[];
    };
    
    // Map frontend field names to database column names based on the Drizzle schema
    const gardenData = {
      userId: userId,
      name: data.name || "Default Garden",
      
      // Convert string values to IDs
      locationIds: mapToIds(data.locationIds, locationLookups),
      spaceAvailableIds: mapToIds(data.spaceAvailableIds, spaceAvailableLookups),
      soilPhIds: mapToIds(data.soilPhIds, soilPhLookups),
      soilTextureIds: mapToIds(data.soilTextureIds, soilTextureLookups),
      soilDrainageIds: mapToIds(data.soilDrainageIds, soilDrainageLookups),
      usdaZonesIds: mapToIds(data.usda_zones_ids, usdaZonesLookups),
      ncRegionsIds: mapToIds(data.ncRegionsIds, ncRegionsLookups),
      sunlightIds: mapToIds(data.sunlightIds, sunlightLookups),
      gardenThemeIds: mapToIds(data.gardenThemeIds, gardenThemeLookups),
      wildlifeAttractionIds: mapToIds(data.wildlifeAttractionIds, wildlifeAttractionLookups),
      resistanceChallengeIds: mapToIds(data.resistanceChallengeIds, resistanceChallengeLookups),
      problemsToExcludeIds: mapToIds(data.problemsToExcludeIds, problemsToExcludeLookups),
      growthRateId: data.growthRateId || null,
      maintenanceLevelId: data.maintenanceLevelId || null,
      texturePreferenceId: data.texturePreferenceId || null,
      specificPlantIds: data.specificPlantIds || [],
      wantsRecommendations: data.wantsRecommendations ?? true,
      // Additional fields
      habitFormIds: mapToIds(data.habitFormIds, habitFormLookups),
      plantTypeIds: mapToIds(data.plantTypeIds, plantTypeLookups),
      yearRoundInterest: data.yearRoundInterest ?? false,
      flowerColorIds: mapToIds(data.flowerColorIds, flowerColorLookups),
      flowerBloomTimeIds: mapToIds(data.flowerBloomTimeIds, flowerBloomTimeLookups),
      flowerValueIds: mapToIds(data.flowerValueIds, flowerValueLookups),
      leafFeelIds: mapToIds(data.leafFeelIds, leafFeelLookups),
      leafColorIds: mapToIds(data.leafColorIds, leafColorLookups),
      leafValueIds: mapToIds(data.leafValueIds, leafValueLookups),
      fallColorIds: mapToIds(data.fallColorIds, fallColorLookups),
      designFeatureIds: mapToIds(data.designFeatureIds, designFeatureLookups),
      updatedAt: new Date().toISOString(),
    };
    
    if (existingSettings) {
      // Update existing settings
      await db.update(userGardens)
        .set(gardenData)
        .where(eq(userGardens.userId, userId));
      
      console.log("Updated user gardens for user:", userId);
    } else {
      // Create new settings
      await db.insert(userGardens).values({
        ...gardenData,
        createdAt: new Date().toISOString(),
      });
      
      console.log("Created new user gardens for user:", userId);
    }
    
    // Revalidate the user gardens path
    revalidatePath('/api/user-gardens');
    
    return NextResponse.json({ success: true }, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error("Error saving user gardens:", error);
    return NextResponse.json(
      { error: "Failed to save user gardens" },
      { status: 500 }
    );
  }
} 
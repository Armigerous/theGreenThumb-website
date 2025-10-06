import { prisma } from "@/lib/db/prisma"
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

// Route Segment Config
export const dynamic = 'force-dynamic' // Always fetch fresh data for user-specific content
export const revalidate = 0 // Disable static caching

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const settings = await prisma.userGardens.findFirst({
      where: { userId },
      include: {
        userPlants: true,
      }
    })

    if (!settings) {
      return NextResponse.json({ settings: null })
    }

    // Note: For Prisma, we'll return the raw data and handle ID-to-string mapping on the frontend
    // This is more efficient than fetching all lookup tables
    return NextResponse.json({ settings }, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error("Error fetching user gardens:", error)
    return NextResponse.json(
      { error: "Failed to fetch user gardens" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const data = await request.json()
    
    // Log the received data for debugging
    console.log("Received user gardens data:", data)
    
    // Check if settings already exist for this user
    const existingSettings = await prisma.userGardens.findFirst({
      where: { userId }
    })
    
    // Prepare garden data - Prisma will handle the JSON fields automatically
    const gardenData = {
      userId: userId,
      name: data.name || "Default Garden",
      
      // Store as JSON arrays - frontend should send the correct format
      locationIds: data.locationIds || [],
      spaceAvailableIds: data.spaceAvailableIds || [],
      soilPhIds: data.soilPhIds || [],
      soilTextureIds: data.soilTextureIds || [],
      soilDrainageIds: data.soilDrainageIds || [],
      usdaZonesIds: data.usda_zones_ids || [],
      ncRegionsIds: data.ncRegionsIds || [],
      sunlightIds: data.sunlightIds || [],
      gardenThemeIds: data.gardenThemeIds || [],
      wildlifeAttractionIds: data.wildlifeAttractionIds || [],
      resistanceChallengeIds: data.resistanceChallengeIds || [],
      problemsToExcludeIds: data.problemsToExcludeIds || [],
      growthRateId: data.growthRateId || null,
      maintenanceLevelId: data.maintenanceLevelId || null,
      texturePreferenceId: data.texturePreferenceId || null,
      userPlantsId: data.specificPlantIds || [],
      wantsRecommendations: data.wantsRecommendations ?? true,
      // Additional fields
      habitFormIds: data.habitFormIds || [],
      plantTypeIds: data.plantTypeIds || [],
      yearRoundInterest: data.yearRoundInterest ?? false,
      flowerColorIds: data.flowerColorIds || [],
      flowerBloomTimeIds: data.flowerBloomTimeIds || [],
      flowerValueIds: data.flowerValueIds || [],
      leafFeelIds: data.leafFeelIds || [],
      leafColorIds: data.leafColorIds || [],
      leafValueIds: data.leafValueIds || [],
      fallColorIds: data.fallColorIds || [],
      designFeatureIds: data.designFeatureIds || [],
    }
    
    if (existingSettings) {
      // Update existing settings
      await prisma.userGardens.update({
        where: { id: existingSettings.id },
        data: gardenData
      })
      
      console.log("Updated user gardens for user:", userId)
    } else {
      // Create new settings
      await prisma.userGardens.create({
        data: gardenData
      })
      
      console.log("Created new user gardens for user:", userId)
    }
    
    // Revalidate the user gardens path
    revalidatePath('/api/user-gardens')
    
    return NextResponse.json({ success: true }, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error("Error saving user gardens:", error)
    return NextResponse.json(
      { error: "Failed to save user gardens" },
      { status: 500 }
    )
  }
}

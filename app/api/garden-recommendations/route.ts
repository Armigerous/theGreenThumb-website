import { prisma } from "@/lib/db/prisma"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { gardenData, relatedPlants = [] } = await req.json()
    
    if (!gardenData) {
      return NextResponse.json({ error: "Garden data is required" }, { status: 400 })
    }
    
    // Reason: Build Prisma where conditions based on user garden data
    
    // Helper function to safely convert IDs to integers
    const safeIntArray = (arr: string[]) => {
      if (!arr || !Array.isArray(arr)) return []
      return arr.map(id => {
        const parsed = parseInt(id, 10)
        return isNaN(parsed) ? null : parsed
      }).filter(id => id !== null) as number[]
    }
    
    // Reason: Build conditions for garden recommendations
    // Note: For complex JSON array searches, we'd need raw SQL in production
    // This is a simplified approach using basic text matching
    
    const conditions: Array<{ scientificName: { contains: string; mode: 'insensitive' } }> = []
    
    // USDA Zones - simplified search
    if (gardenData.usda_zones_ids && gardenData.usda_zones_ids.length > 0) {
      const zoneIds = safeIntArray(gardenData.usda_zones_ids)
      if (zoneIds.length > 0) {
        conditions.push({
          scientificName: {
            contains: zoneIds[0].toString(),
            mode: 'insensitive'
          }
        })
      }
    }
    
    // Light requirements - simplified search
    if (gardenData.sunlightIds && gardenData.sunlightIds.length > 0) {
      const lightIds = safeIntArray(gardenData.sunlightIds)
      if (lightIds.length > 0) {
        conditions.push({
          scientificName: {
            contains: lightIds[0].toString(),
            mode: 'insensitive'
          }
        })
      }
    }
    
    // Soil type - simplified search
    if (gardenData.soilTextureIds && gardenData.soilTextureIds.length > 0) {
      const soilTextureIds = safeIntArray(gardenData.soilTextureIds)
      if (soilTextureIds.length > 0) {
        conditions.push({
          scientificName: {
            contains: soilTextureIds[0].toString(),
            mode: 'insensitive'
          }
        })
      }
    }
    
    // Soil pH - simplified search
    if (gardenData.soilPhIds && gardenData.soilPhIds.length > 0) {
      const soilPhIds = safeIntArray(gardenData.soilPhIds)
      if (soilPhIds.length > 0) {
        conditions.push({
          scientificName: {
            contains: soilPhIds[0].toString(),
            mode: 'insensitive'
          }
        })
      }
    }
    
    // Soil drainage - simplified search
    if (gardenData.soilDrainageIds && gardenData.soilDrainageIds.length > 0) {
      const drainageIds = safeIntArray(gardenData.soilDrainageIds)
      if (drainageIds.length > 0) {
        conditions.push({
          scientificName: {
            contains: drainageIds[0].toString(),
            mode: 'insensitive'
          }
        })
      }
    }
    
    // Garden themes - simplified search
    if (gardenData.gardenThemeIds && gardenData.gardenThemeIds.length > 0) {
      const themeIds = safeIntArray(gardenData.gardenThemeIds)
      if (themeIds.length > 0) {
        conditions.push({
          scientificName: {
            contains: themeIds[0].toString(),
            mode: 'insensitive'
          }
        })
      }
    }
    
    // Wildlife attraction - simplified search
    if (gardenData.wildlifeAttractionIds && gardenData.wildlifeAttractionIds.length > 0) {
      const wildlifeIds = safeIntArray(gardenData.wildlifeAttractionIds)
      if (wildlifeIds.length > 0) {
        conditions.push({
          scientificName: {
            contains: wildlifeIds[0].toString(),
            mode: 'insensitive'
          }
        })
      }
    }
    
    // Resistance to challenges - simplified search
    if (gardenData.resistanceChallengeIds && gardenData.resistanceChallengeIds.length > 0) {
      const resistanceIds = safeIntArray(gardenData.resistanceChallengeIds)
      if (resistanceIds.length > 0) {
        conditions.push({
          scientificName: {
            contains: resistanceIds[0].toString(),
            mode: 'insensitive'
          }
        })
      }
    }
    
    // Plant types - simplified search
    if (gardenData.plantTypeIds && gardenData.plantTypeIds.length > 0) {
      const plantTypeIds = safeIntArray(gardenData.plantTypeIds)
      if (plantTypeIds.length > 0) {
        conditions.push({
          scientificName: {
            contains: plantTypeIds[0].toString(),
            mode: 'insensitive'
          }
        })
      }
    }
    
    // Flower colors - simplified search
    if (gardenData.flowerColorIds && gardenData.flowerColorIds.length > 0) {
      const colorIds = safeIntArray(gardenData.flowerColorIds)
      if (colorIds.length > 0) {
        conditions.push({
          scientificName: {
            contains: colorIds[0].toString(),
            mode: 'insensitive'
          }
        })
      }
    }
    
    // Reason: Handle related plants exclusion
    let excludeIds: number[] = []
    if (relatedPlants && relatedPlants.length > 0) {
      excludeIds = relatedPlants
        .filter((id: unknown): id is string | number => 
          id !== null && id !== undefined && (typeof id === 'string' || typeof id === 'number')
        )
        .map((id: string | number) => {
          const parsed = parseInt(id.toString(), 10)
          return isNaN(parsed) ? null : parsed
        })
        .filter((id: number | null): id is number => id !== null)
    }
    
    // Reason: Build final where clause
    const whereClause: Record<string, unknown> = {}
    
    if (conditions.length > 0) {
      whereClause.OR = conditions
    }
    
    if (excludeIds.length > 0) {
      whereClause.id = {
        notIn: excludeIds
      }
    }
    
    // Reason: Execute query with Prisma
    const results = await prisma.mainPlantData.findMany({
      where: whereClause,
      take: 10,
      include: {
        plantImages: true,
        cultivars: true,
      },
      orderBy: {
        scientificName: 'asc'
      }
    })
    
    // Reason: Format the results to match expected structure
    const formattedResults = results.map(plant => ({
      id: plant.id,
      slug: plant.slug,
      scientific_name: plant.scientificName,
      common_name: Array.isArray(plant.commonNames) ? plant.commonNames[0] : plant.commonNames || "",
      description: plant.description,
      first_image: plant.plantImages?.[0]?.img || null,
      first_image_alt_text: plant.plantImages?.[0]?.altText || null,
      first_tag: null, // Would need to resolve from tagsIds
    }))
    
    return NextResponse.json({
      recommendations: formattedResults,
    })
  } catch (error) {
    console.error("Error generating garden recommendations:", error)
    return NextResponse.json(
      { error: "Failed to generate garden recommendations" },
      { status: 500 }
    )
  }
}

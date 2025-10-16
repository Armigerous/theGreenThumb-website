import { prisma } from '@/lib/db/prisma'
import { Prisma } from '@/lib/generated/prisma'
import { revalidatePath } from 'next/cache'

/**
 * Plant Service
 * 
 * Reason: Centralized business logic for plant operations
 * Separates concerns between API routes and database operations
 */
export class PlantService {
  /**
   * Get user plants across all gardens
   */
  static async getUserPlants(userId: string, gardenId?: number) {
    let gardens = []
    
    if (gardenId) {
      // If gardenId is provided, only fetch that specific garden
      const garden = await prisma.user_gardens.findFirst({
        where: {
          user_id: userId,
          id: gardenId
        },
        include: {
          user_plants: true
        }
      })
      
      if (!garden) {
        throw new Error('Garden not found')
      }
      
      gardens = [garden]
    } else {
      // Otherwise fetch all gardens
      gardens = await prisma.user_gardens.findMany({
        where: { user_id: userId },
        include: {
          user_plants: true
        }
      })
    }
    
    if (!gardens.length) {
      return { gardens: [], plants: [] }
    }
    
    // Flatten all plants from all gardens with proper type safety
    const plants = gardens.flatMap(garden => 
      garden.user_plants.map(plant => {
        const rawCareLogs = plant.care_logs as unknown
        const careLogs = Array.isArray(rawCareLogs)
          ? (rawCareLogs as Record<string, unknown>[])
          : []

        const rawImages = plant.images as unknown
        const images = Array.isArray(rawImages)
          ? (rawImages as Array<{ url: string; altText?: string }>)
          : []

        return {
          id: plant.id,
          gardenId: plant.garden_id,
          customName: plant.nickname, // Use nickname as customName
          botanicalName: "Unknown", // TODO: Get from main_plant_data relation
          status: "healthy", // TODO: Calculate from care_logs
          careLogs,
          images,
          locationTags: [], // TODO: Get from garden preferences
          createdAt: plant.created_at.toISOString(),
          updatedAt: plant.updated_at.toISOString(),
        }
      })
    )
    
    return {
      gardens,
      plants
    }
  }

  /**
   * Add plant to garden
   */
  static async addPlantToGarden(gardenId: number, plantId: string, userId: string) {
    // Verify garden ownership
    const garden = await prisma.user_gardens.findFirst({
      where: {
        user_id: userId,
        id: gardenId
      }
    })
    
    if (!garden) {
      throw new Error('Garden not found')
    }
    
    // Check if plant already exists in garden
    const existingPlant = await prisma.user_plants.findFirst({
      where: {
        garden_id: gardenId,
        plant_id: parseInt(plantId)
      }
    })
    
    if (existingPlant) {
      return { message: "Plant already in garden", plant: existingPlant }
    }
    
    // Add plant to the garden by creating a new user_plants record
    const newPlant = await prisma.user_plants.create({
      data: {
        id: crypto.randomUUID(), // Generate UUID for the id field
        garden_id: gardenId,
        plant_id: parseInt(plantId),
        nickname: `Plant ${plantId}`, // Default nickname
      }
    })
    
    revalidatePath('/api/user-plants')
    
    return { plant: newPlant }
  }

  /**
   * Remove plant from garden
   */
  static async removePlantFromGarden(gardenId: number, plantId: string, userId: string) {
    // Verify garden ownership
    const garden = await prisma.user_gardens.findFirst({
      where: {
        user_id: userId,
        id: gardenId
      }
    })
    
    if (!garden) {
      throw new Error('Garden not found')
    }
    
    // Remove plant from the garden by deleting the user_plants record
    const deletedPlant = await prisma.user_plants.deleteMany({
      where: {
        garden_id: gardenId,
        plant_id: parseInt(plantId)
      }
    })
    
    revalidatePath('/api/user-plants')
    
    return { deleted: deletedPlant.count > 0 }
  }

  /**
   * Update all plants in garden (replace entire array)
   */
  static async updateGardenPlants(gardenId: number, plantIds: string[], userId: string) {
    // Verify garden ownership
    const garden = await prisma.user_gardens.findFirst({
      where: {
        user_id: userId,
        id: gardenId
      }
    })
    
    if (!garden) {
      throw new Error('Garden not found')
    }
    
    // Update garden plants by replacing all user_plants records
    // First, delete all existing plants in the garden
    await prisma.user_plants.deleteMany({
      where: { garden_id: gardenId }
    })
    
    // Then, create new plant records
    const newPlants = await Promise.all(
      plantIds.map(plantId => 
        prisma.user_plants.create({
          data: {
            id: crypto.randomUUID(), // Generate UUID for the id field
            garden_id: gardenId,
            plant_id: parseInt(plantId),
            nickname: `Plant ${plantId}`, // Default nickname
          }
        })
      )
    )
    
    revalidatePath('/api/user-plants')
    
    return { plants: newPlants }
  }

  /**
   * Get plant recommendations for a garden
   */
  static async getGardenRecommendations(gardenId: number, userId: string) {
    // Fetch garden configuration and existing plants
    const garden = await prisma.user_gardens.findFirst({
      where: {
        id: gardenId,
        user_id: userId, // Ensure user owns this garden
      },
      include: {
        user_plants: {
          select: {
            nickname: true, // Use nickname instead of botanicalName
          },
        },
      },
    })
    
    if (!garden) {
      throw new Error('Garden not found')
    }
    
    // Get existing plant names to exclude from recommendations
    const existingPlantNames = garden.user_plants.map(plant => plant.nickname)
    
    // Build recommendation query based on garden preferences
    const whereConditions: Prisma.main_plant_dataWhereInput[] = []
    
    // Exclude plants already in the garden
    if (existingPlantNames.length > 0) {
      whereConditions.push({
        scientific_name: {
          notIn: existingPlantNames,
        },
      })
    }
    
    // Add conditions based on garden preferences
    // Note: This is a simplified approach. In production, you'd want more sophisticated matching
    
    // Type-safe handling of JSON arrays from Prisma
    const usdaZonesIds = Array.isArray(garden.usda_zone_ids) ? garden.usda_zone_ids as string[] : []
    const sunlightIds = garden.light_id ? [garden.light_id.toString()] : [] // Convert BigInt to string array
    const soilTextureIds = garden.soil_texture_id ? [garden.soil_texture_id.toString()] : [] // Convert BigInt to string array
    
    // USDA Zones
    if (usdaZonesIds.length > 0) {
      // For now, we'll do a simple text search
      // In production, you'd want to properly match zone data
      whereConditions.push({
        OR: usdaZonesIds.map((zoneId: string) => ({
          scientific_name: {
            contains: zoneId,
            mode: 'insensitive' as const,
          },
        })),
      })
    }
    
    // Light requirements
    if (sunlightIds.length > 0) {
      whereConditions.push({
        OR: sunlightIds.map((lightId: string) => ({
          scientific_name: {
            contains: lightId,
            mode: 'insensitive' as const,
          },
        })),
      })
    }
    
    // Soil preferences
    if (soilTextureIds.length > 0) {
      whereConditions.push({
        OR: soilTextureIds.map((soilId: string) => ({
          scientific_name: {
            contains: soilId,
            mode: 'insensitive' as const,
          },
        })),
      })
    }
    
    // Execute recommendation query
    const recommendations = await prisma.main_plant_data.findMany({
      where: {
        AND: whereConditions,
      },
      take: 12, // Limit to 12 recommendations
      include: {
        plant_images: {
          take: 1, // Only get the first image
        },
      },
      orderBy: {
        scientific_name: 'asc',
      },
    })
    
    // Format recommendations for frontend with proper type safety
    const formattedRecommendations = recommendations.map(plant => ({
      id: plant.id,
      slug: plant.slug,
      scientificName: plant.scientific_name,
      commonName: Array.isArray(plant.common_names) 
        ? String(plant.common_names[0] || "")
        : String(plant.common_names || ""),
      description: plant.description,
      image: plant.plant_images?.[0]?.img || null,
      imageAlt: plant.plant_images?.[0]?.alt_text || null,
    }))
    
    return {
      recommendations: formattedRecommendations,
      gardenName: garden.name,
    }
  }
}

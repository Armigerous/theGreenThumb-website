import { prisma } from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'

/**
 * Garden Service
 * 
 * Reason: Centralized business logic for garden operations
 * Separates concerns between API routes and database operations
 */
export class GardenService {
  /**
   * Get garden by ID with ownership verification
   */
  static async getGardenById(gardenId: number, userId: string) {
    const garden = await prisma.user_gardens.findFirst({
      where: {
        id: gardenId,
        user_id: userId, // Ensure user owns this garden
      },
      include: {
        user_plants: {
          orderBy: { created_at: 'desc' },
        },
      },
    })

    if (!garden) {
      throw new Error('Garden not found')
    }

    return garden
  }

  /**
   * Get garden with detailed plant information
   */
  static async getGardenWithPlants(gardenId: number, userId: string) {
    const garden = await prisma.user_gardens.findFirst({
      where: {
        id: gardenId,
        user_id: userId,
      },
      include: {
        user_plants: {
          orderBy: { created_at: 'desc' },
          include: {
            main_plant_data: {
              select: {
                scientific_name: true,
                common_names: true,
                plant_images: {
                  select: {
                    img: true,
                    alt_text: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    })

    if (!garden) {
      throw new Error('Garden not found')
    }

    return garden
  }

  /**
   * Calculate garden statistics
   */
  static calculateGardenStatistics(plants: Array<{ care_logs: unknown }>) {
    const totalPlants = plants.length
    const healthyPlants = totalPlants // Default assumption; refine via care logs later
    const warningPlants = 0
    const criticalPlants = 0

    const plantsNeedingCare = plants.filter((plant) => {
      const rawCareLogs = plant.care_logs as unknown
      const careLogs = Array.isArray(rawCareLogs)
        ? (rawCareLogs as Array<{ date: string; type: string }>)
        : []
      if (careLogs.length === 0) return true
      
      const lastCareDate = new Date(
        Math.max(...careLogs.map((log) => new Date(log.date).getTime()))
      )
      const daysSinceLastCare =
        (Date.now() - lastCareDate.getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceLastCare > 7
    }).length

    return {
      totalPlants,
      healthyPlants,
      warningPlants,
      criticalPlants,
      plantsNeedingCare,
    }
  }

  /**
   * Update garden configuration
   */
  static async updateGarden(
    gardenId: number,
    userId: string,
    data: {
      name?: string
      locationIds?: string[]
      soilDrainageIds?: string[]
      soilPhIds?: string[]
      gardenThemeIds?: string[]
      wildlifeAttractionIds?: string[]
      resistanceChallengeIds?: string[]
      problemsToExcludeIds?: string[]
      maintenanceLevelId?: number
      texturePreferenceId?: number
      wantsRecommendations?: boolean
      ncRegionsIds?: string[]
      usdaZonesIds?: string[]
      flowerColorIds?: string[]
      flowerBloomTimeIds?: string[]
      flowerValueIds?: string[]
      leafColorIds?: string[]
      leafFeelIds?: string[]
      leafValueIds?: string[]
      fallColorIds?: string[]
      habitFormIds?: string[]
      plantTypeIds?: string[]
      designFeatureIds?: string[]
      sunlightIds?: string[]
      soilTextureIds?: string[]
    }
  ) {
    // Verify garden ownership
    const existingGarden = await prisma.user_gardens.findFirst({
      where: {
        id: gardenId,
        user_id: userId,
      },
    })

    if (!existingGarden) {
      throw new Error('Garden not found')
    }

    // Update garden with new data
    const updatedGarden = await prisma.user_gardens.update({
      where: { id: gardenId },
      data: {
        name: data.name,
        landscape_location_ids: data.locationIds,
        soil_drainage_ids: data.soilDrainageIds,
        soil_ph_ids: data.soilPhIds,
        landscape_theme_ids: data.gardenThemeIds,
        attracts_ids: data.wildlifeAttractionIds,
        resistance_to_challenges_ids: data.resistanceChallengeIds,
        problems_ids: data.problemsToExcludeIds,
        maintenance_id: data.maintenanceLevelId,
        texture_id: data.texturePreferenceId,
        wants_recommendations: data.wantsRecommendations,
        nc_region_ids: data.ncRegionsIds,
        usda_zone_ids: data.usdaZonesIds,
        flower_color_ids: data.flowerColorIds,
        flower_bloom_time_ids: data.flowerBloomTimeIds,
        flower_value_to_gardener_ids: data.flowerValueIds,
        leaf_color_ids: data.leafColorIds,
        leaf_feel_ids: data.leafFeelIds,
        leaf_value_ids: data.leafValueIds,
        fall_color_ids: data.fallColorIds,
        habit_form_ids: data.habitFormIds,
        plant_type_ids: data.plantTypeIds,
        design_feature_ids: data.designFeatureIds,
        light_id: data.sunlightIds?.[0] ? parseInt(data.sunlightIds[0]) : undefined, // Convert array to single ID for now
        soil_texture_id: data.soilTextureIds?.[0] ? parseInt(data.soilTextureIds[0]) : undefined, // Convert array to single ID for now
      },
      include: {
        user_plants: true,
      },
    })

    // Revalidate cache
    revalidatePath('/api/gardens/overview')
    revalidatePath(`/api/gardens/${gardenId}`)

    return updatedGarden
  }

  /**
   * Delete garden and all its plants
   */
  static async deleteGarden(gardenId: number, userId: string) {
    // Verify garden ownership
    const existingGarden = await prisma.user_gardens.findFirst({
      where: {
        id: gardenId,
        user_id: userId,
      },
    })

    if (!existingGarden) {
      throw new Error('Garden not found')
    }

    // Delete all plants in the garden first, then the garden
    await prisma.user_plants.deleteMany({
      where: { garden_id: gardenId },
    })

    await prisma.user_gardens.delete({
      where: { id: gardenId },
    })

    // Revalidate cache
    revalidatePath('/api/gardens/overview')

    return { success: true }
  }

  /**
   * Get all user gardens with statistics
   */
  static async getUserGardensWithStats(userId: string) {
    const gardens = await prisma.user_gardens.findMany({
      where: { user_id: userId },
      include: {
        user_plants: {
          select: {
            id: true,
            care_logs: true,
            updated_at: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    })

    // Calculate statistics for each garden
    return gardens.map(garden => {
      const statistics = this.calculateGardenStatistics(garden.user_plants)
      return {
        ...garden,
        statistics,
      }
    })
  }

  /**
   * Get garden overview statistics
   */
  static async getGardenOverviewStats(userId: string) {
    const gardens = await prisma.user_gardens.findMany({
      where: { user_id: userId },
      include: {
        user_plants: {
          select: {
            id: true,
            care_logs: true,
            updated_at: true,
          },
        },
      },
    })

    const allPlants = gardens.flatMap(garden => garden.user_plants)
    const totalGardens = gardens.length
    const totalPlants = allPlants.length
    const healthyPlants = totalPlants // Default all plants as healthy
    const warningPlants = 0 // TODO: Calculate from care_logs
    const criticalPlants = 0 // TODO: Calculate from care_logs
    
    // Calculate plants needing care
    const plantsNeedingCare = allPlants.filter(plant => {
      const rawCareLogs = plant.care_logs as unknown
      const careLogs = Array.isArray(rawCareLogs)
        ? (rawCareLogs as Array<{ date: string; type: string }>)
        : []
      if (careLogs.length === 0) return true
      
      const lastCareDate = new Date(Math.max(...careLogs.map(log => new Date(log.date).getTime())))
      const daysSinceLastCare = (Date.now() - lastCareDate.getTime()) / (1000 * 60 * 60 * 24)
      
      return daysSinceLastCare > 7
    }).length

    return {
      totalGardens,
      totalPlants,
      healthyPlants,
      warningPlants,
      criticalPlants,
      plantsNeedingCare,
    }
  }
}

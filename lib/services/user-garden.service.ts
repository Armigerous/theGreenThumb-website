import { prisma } from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'

/**
 * User Garden Service
 * 
 * Reason: Centralized business logic for user garden settings
 * Separates concerns between API routes and database operations
 */
export class UserGardenService {
  /**
   * Get user garden settings
   */
  static async getUserGardenSettings(userId: string) {
    const settings = await prisma.user_gardens.findFirst({
      where: { user_id: userId },
      include: {
        user_plants: true,
      }
    })

    return settings
  }

  /**
   * Create or update user garden settings
   */
  static async saveUserGardenSettings(userId: string, data: {
    name?: string
    locationIds?: string[]
    soilPhIds?: string[]
    soilTextureIds?: string[]
    soilDrainageIds?: string[]
    usda_zones_ids?: string[]
    ncRegionsIds?: string[]
    sunlightIds?: string[]
    gardenThemeIds?: string[]
    wildlifeAttractionIds?: string[]
    resistanceChallengeIds?: string[]
    problemsToExcludeIds?: string[]
    growthRateId?: string
    maintenanceLevelId?: number
    texturePreferenceId?: number
    wantsRecommendations?: boolean
    habitFormIds?: string[]
    plantTypeIds?: string[]
    flowerColorIds?: string[]
    flowerBloomTimeIds?: string[]
    flowerValueIds?: string[]
    leafFeelIds?: string[]
    leafColorIds?: string[]
    leafValueIds?: string[]
    fallColorIds?: string[]
    designFeatureIds?: string[]
  }) {
    // Log the received data for debugging
    console.log("Received user gardens data:", data)
    
    // Check if settings already exist for this user
    const existingSettings = await prisma.user_gardens.findFirst({
      where: { user_id: userId }
    })
    
    // Prepare garden data - Prisma will handle the JSON fields automatically
    const gardenData = {
      user_id: userId,
      name: data.name || "Default Garden",
      
      // Store as JSON arrays - frontend should send the correct format
      landscape_location_ids: data.locationIds || [],
      soil_ph_ids: data.soilPhIds || [],
      soil_texture_id: BigInt(data.soilTextureIds?.[0] || 1), // Convert array to single ID
      soil_drainage_ids: data.soilDrainageIds || [],
      usda_zone_ids: data.usda_zones_ids || [],
      nc_region_ids: data.ncRegionsIds || [],
      light_id: BigInt(data.sunlightIds?.[0] || 1), // Convert array to single ID
      available_space_to_plant_id: BigInt(1), // Default value
      landscape_theme_ids: data.gardenThemeIds || [],
      attracts_ids: data.wildlifeAttractionIds || [],
      resistance_to_challenges_ids: data.resistanceChallengeIds || [],
      problems_ids: data.problemsToExcludeIds || [],
      growth_rate_ids: data.growthRateId ? [data.growthRateId] : [],
      maintenance_id: BigInt(data.maintenanceLevelId || 1),
      texture_id: data.texturePreferenceId ? BigInt(data.texturePreferenceId) : null,
      wants_recommendations: data.wantsRecommendations ?? true,
      // Additional fields
      habit_form_ids: data.habitFormIds || [],
      plant_type_ids: data.plantTypeIds || [],
      flower_color_ids: data.flowerColorIds || [],
      flower_bloom_time_ids: data.flowerBloomTimeIds || [],
      flower_value_to_gardener_ids: data.flowerValueIds || [],
      leaf_feel_ids: data.leafFeelIds || [],
      leaf_color_ids: data.leafColorIds || [],
      leaf_value_ids: data.leafValueIds || [],
      fall_color_ids: data.fallColorIds || [],
      design_feature_ids: data.designFeatureIds || [],
    }
    
    if (existingSettings) {
      // Update existing settings
      await prisma.user_gardens.update({
        where: { id: existingSettings.id },
        data: gardenData
      })
      
      console.log("Updated user gardens for user:", userId)
    } else {
      // Create new settings
      await prisma.user_gardens.create({
        data: gardenData
      })
      
      console.log("Created new user gardens for user:", userId)
    }
    
    // Revalidate the user gardens path
    revalidatePath('/api/user-gardens')
    
    return { success: true }
  }
}

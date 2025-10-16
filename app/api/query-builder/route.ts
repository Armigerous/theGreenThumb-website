import { prisma } from "@/lib/db/prisma"
import { NextResponse } from "next/server"

// Reason: Simplified validation schemas for core plant search functionality

// Type for query filters
type QueryFilter = {
  intent: string
  entities: Record<string, string>
}

// Reason: Helper function to validate entities (removed as not currently used)

// Reason: Build Prisma where conditions for plant search
const buildPlantSearchConditions = (filters: QueryFilter[]) => {
  const conditions: Array<{ scientificName?: { contains: string; mode: 'insensitive' }; OR?: Array<{ scientificName?: { contains: string; mode: 'insensitive' }; genus?: { contains: string; mode: 'insensitive' }; species?: { contains: string; mode: 'insensitive' }; family?: { contains: string; mode: 'insensitive' } }> }> = []

  for (const filter of filters) {
    try {
      switch (filter.intent) {
        case 'light_requirements':
          if (filter.entities.light_level) {
            // Note: For JSON array searches, we'd need raw SQL in production
            // This is a simplified approach
            conditions.push({
              scientificName: {
                contains: filter.entities.light_level,
                mode: 'insensitive'
              }
            })
          }
          break

        case 'soil_texture':
          if (filter.entities.soil_texture) {
            conditions.push({
              scientificName: {
                contains: filter.entities.soil_texture,
                mode: 'insensitive'
              }
            })
          }
          break

        case 'soil_ph':
          if (filter.entities.soil_ph_value) {
            conditions.push({
              scientificName: {
                contains: filter.entities.soil_ph_value,
                mode: 'insensitive'
              }
            })
          }
          break

        case 'soil_drainage':
          if (filter.entities.soil_drainage_type) {
            conditions.push({
              scientificName: {
                contains: filter.entities.soil_drainage_type,
                mode: 'insensitive'
              }
            })
          }
          break

        case 'available_space':
          if (filter.entities.space_requirement) {
            conditions.push({
              scientificName: {
                contains: filter.entities.space_requirement,
                mode: 'insensitive'
              }
            })
          }
          break

        case 'nc_regions':
          if (filter.entities.region) {
            conditions.push({
              scientificName: {
                contains: filter.entities.region,
                mode: 'insensitive'
              }
            })
          }
          break

        case 'usda_zones':
          if (filter.entities.usda_zone) {
            conditions.push({
              scientificName: {
                contains: filter.entities.usda_zone,
                mode: 'insensitive'
              }
            })
          }
          break

        case 'general_description':
        case 'unknown':
          // For general searches, use plant name if provided
          if (filter.entities.plant) {
            conditions.push({
              OR: [
                {
                  scientificName: {
                    contains: filter.entities.plant,
                    mode: 'insensitive'
                  }
                },
                {
                  genus: {
                    contains: filter.entities.plant,
                    mode: 'insensitive'
                  }
                },
                {
                  species: {
                    contains: filter.entities.plant,
                    mode: 'insensitive'
                  }
                },
                {
                  family: {
                    contains: filter.entities.plant,
                    mode: 'insensitive'
                  }
                }
              ]
            })
          }
          break

        default:
          console.warn(`Unsupported intent: ${filter.intent}`)
          break
      }
    } catch (error) {
      console.warn(`Error processing filter ${filter.intent}:`, error)
    }
  }

  return conditions
}

// Reason: Execute plant search using Prisma
const executePlantSearch = async (filters: QueryFilter[]) => {
  const conditions = buildPlantSearchConditions(filters)
  
  if (conditions.length === 0) {
    // Return some default plants if no specific filters
    return await prisma.main_plant_data.findMany({
      take: 6,
      include: {
        plant_images: true,
        cultivars: true,
      },
      orderBy: {
        scientific_name: 'asc'
      }
    })
  }

  // Combine conditions with OR logic for multiple filters
  const whereClause = conditions.length > 1 ? { OR: conditions } : conditions[0]

  return await prisma.main_plant_data.findMany({
    where: whereClause,
    take: 6,
    include: {
      plant_images: true,
      cultivars: true,
    },
    orderBy: {
      scientific_name: 'asc'
    }
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Handle both formats
    let intents: unknown[]
    let userGarden: unknown
    
    if (Array.isArray(body)) {
      // Old format - just an array of intents
      intents = body
    } else {
      // New format - object with intents and userGarden
      intents = body.intents
      userGarden = body.userGarden
    }

    // Ensure intents is an array
    if (!intents) {
      console.error("Invalid request format, missing intents:", body)
      return NextResponse.json(
        { error: "Invalid request format. Expected an array of intents." },
        { status: 400 }
      )
    }

    // Convert to array if it's not already
    if (!Array.isArray(intents)) {
      const intentObj = intents as Record<string, unknown>
      if ('intents' in intentObj && Array.isArray(intentObj.intents)) {
        intents = intentObj.intents as unknown[]
      } else {
        intents = [intents]
      }
    }

    // Validate intents format
    if (!intents.every((filter: unknown) => filter && typeof filter === 'object' && 'intent' in (filter as Record<string, unknown>))) {
      console.error("Invalid filter format:", intents)
      return NextResponse.json(
        { error: "Invalid filter format. Each intent must have an 'intent' property." },
        { status: 400 }
      )
    }

    // Convert intents to QueryFilter format
    const filters: QueryFilter[] = intents.map((intent: unknown) => {
      const intentObj = intent as Record<string, unknown>
      return {
        intent: intentObj.intent as string,
        entities: (intentObj.entities as Record<string, string>) || {},
      }
    })

    // Add garden-specific filters if available
    if (userGarden) {
      addGardenFilters(filters, userGarden as Record<string, unknown>)
    }

    try {
      const result = await executePlantSearch(filters)
      
      // Transform result to match expected format
      const transformedResult = result.map(plant => ({
        scientific_name: plant.scientific_name,
        common_name: Array.isArray(plant.common_names) ? plant.common_names[0] : plant.common_names,
        slug: plant.slug,
        first_tag: null, // Would need to resolve from tagsIds
        first_image: plant.plant_images?.[0]?.img || null,
        first_image_alt_text: plant.plant_images?.[0]?.alt_text || null,
        description: plant.description,
      }))

      return NextResponse.json({
        query: "Plant search based on filters",
        data: transformedResult,
      })
    } catch (queryError) {
      console.error("Error executing query:", queryError)
      return NextResponse.json(
        { error: "Failed to execute query", details: String(queryError) },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json(
      { error: "Failed to process request", details: String(error) },
      { status: 500 }
    )
  }
}

// Reason: Helper function to add garden-specific filters
function addGardenFilters(filters: QueryFilter[], userGarden: Record<string, unknown>) {
  const hasExplicitFilters = new Set(filters.map(f => f.intent))
  
  // Add region filter
  const ncRegionsIds = userGarden.ncRegionsIds as string[] | undefined
  if (Array.isArray(ncRegionsIds) && ncRegionsIds.length > 0) {
    if (!hasExplicitFilters.has('nc_regions')) {
      filters.push({
        intent: 'nc_regions',
        entities: { region: ncRegionsIds[0] }
      })
    }
  }
  
  // Add USDA zone filter
  const usda_zones_ids = userGarden.usda_zones_ids as string[] | undefined
  if (Array.isArray(usda_zones_ids) && usda_zones_ids.length > 0) {
    if (!hasExplicitFilters.has('usda_zones')) {
      filters.push({
        intent: 'usda_zones',
        entities: { usda_zone: usda_zones_ids[0] }
      })
    }
  }
  
  // Add light requirements filter
  const sunlightIds = userGarden.sunlightIds as string[] | undefined
  if (Array.isArray(sunlightIds) && sunlightIds.length > 0) {
    if (!hasExplicitFilters.has('light_requirements')) {
      filters.push({
        intent: 'light_requirements',
        entities: { light_level: sunlightIds[0] }
      })
    }
  }
  
  // Add soil texture filter
  const soilTextureIds = userGarden.soilTextureIds as string[] | undefined
  if (Array.isArray(soilTextureIds) && soilTextureIds.length > 0) {
    if (!hasExplicitFilters.has('soil_texture')) {
      filters.push({
        intent: 'soil_texture',
        entities: { soil_texture: soilTextureIds[0] }
      })
    }
  }
  
  // Add soil pH filter
  const soilPhIds = userGarden.soilPhIds as string[] | undefined
  if (Array.isArray(soilPhIds) && soilPhIds.length > 0) {
    if (!hasExplicitFilters.has('soil_ph')) {
      filters.push({
        intent: 'soil_ph',
        entities: { soil_ph_value: soilPhIds[0] }
      })
    }
  }
  
  // Add soil drainage filter
  const soilDrainageIds = userGarden.soilDrainageIds as string[] | undefined
  if (Array.isArray(soilDrainageIds) && soilDrainageIds.length > 0) {
    if (!hasExplicitFilters.has('soil_drainage')) {
      filters.push({
        intent: 'soil_drainage',
        entities: { soil_drainage_type: soilDrainageIds[0] }
      })
    }
  }
  
  // Add available space filter
  const spaceAvailableIds = userGarden.spaceAvailableIds as string[] | undefined
  if (Array.isArray(spaceAvailableIds) && spaceAvailableIds.length > 0) {
    if (!hasExplicitFilters.has('available_space')) {
      filters.push({
        intent: 'available_space',
        entities: { space_requirement: spaceAvailableIds[0] }
      })
    }
  }
}

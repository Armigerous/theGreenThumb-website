import { prisma } from './prisma'
import { PlantCardData, PlantCardDataScientific, PlantImage } from '@/types/plant'

// Reason: Interface for plant identification results that includes database matches
export interface PlantIdentificationResult {
  id: string
  name: string
  scientific_name: string
  confidence: number
  description: string
  image?: string
  careInstructions?: string
  common_names?: string[]
  // Database-specific fields
  databaseMatch?: boolean
  plantId?: number
  slug?: string
  fullDescription?: string
  family?: string
  genus?: string
  species?: string
  height_min?: number
  height_max?: number
  width_min?: number
  width_max?: number
  origin?: string
  distribution?: string
  uses?: string
  wildlife_value?: string
  edibility?: string
  flower_description?: string
  leaf_description?: string
  fruit_description?: string
  stem_description?: string
  bark_description?: string
  poison_symptoms?: string
  poison_toxic_principle?: string
  fireRisk?: string
  flowerSize?: string
  fruitLength?: string
  fruitWidth?: string
  gardenSpaces?: string
  growthRate?: string
  leafHairsPresent?: string
  leafLength?: string
  leafWidth?: string
  poisonDermatitis?: string
  poisonSeverity?: string
  stemAromatic?: string
  stemBudScale?: string
  stemBudTerminal?: string
  stemBuds?: string
  stemCrossSection?: string
  stemForm?: string
  stemLeafScarShape?: string
  stemLenticels?: string
  stemPith?: string
  stemSurface?: string
  texture?: string
  attracts?: string[]
  availableSpaceToPlant?: string[]
  barkAttachment?: string[]
  barkColor?: string[]
  barkPlateShape?: string[]
  designFeatures?: string[]
  flowerBloomTime?: string[]
  flowerColor?: string[]
  flowerInflorescence?: string[]
  flowerPetals?: string[]
  flowerShape?: string[]
  flowerValueToGardener?: string[]
  fruitColor?: string[]
  fruitDisplayHarvestTime?: string[]
  fruitType?: string[]
  fruitValueToGardener?: string[]
  habit?: string[]
  landscapeLocation?: string[]
  landscapeTheme?: string[]
  leafArrangement?: string[]
  leafCharacteristics?: string[]
  leafColor?: string[]
  leafFallColor?: string[]
  leafFeel?: string[]
  leafMargin?: string[]
  leafShape?: string[]
  leafType?: string[]
  leafValueToGardener?: string[]
  lifeCycle?: string[]
  light?: string[]
  maintenance?: string[]
  ncRegion?: string[]
  plantTypes?: string[]
  poisonPart?: string[]
  problems?: string[]
  propagation?: string[]
  resistanceToChallenges?: string[]
  soilDrainage?: string[]
  soilPh?: string[]
  soilTexture?: string[]
  stemColor?: string[]
  tags?: string[]
  usdaZones?: string[]
  lightRequirements?: string
  waterRequirements?: string
  usdaHardinessZones?: string
  images?: PlantImage[]
  // Reason: PlantCardData for database matches to use existing PlantCard component
  plantCardData?: PlantCardData
}

// Reason: Search database for plants matching AI identification results using Prisma
export async function searchDatabaseForPlant(
  plantName: string,
  scientific_name: string,
  common_names?: string[]
): Promise<PlantIdentificationResult | null> {
  try {
    // Reason: Try multiple search strategies to find the best match
    const searchTerms = [
      plantName.toLowerCase(),
      scientific_name.toLowerCase(),
      ...(common_names || []).map(name => name.toLowerCase())
    ]

    // Reason: Search by scientific name first (most accurate)
    let plant = await prisma.main_plant_data.findFirst({
      where: {
        scientific_name: {
          contains: scientific_name,
          mode: 'insensitive',
        },
      },
      include: {
        plant_images: true,
        cultivars: true,
      },
    })

    // Reason: If no scientific match, try common names
    if (!plant) {
      for (const term of searchTerms) {
        // Note: For complex JSON array searches, we might need raw SQL
        // This is a simplified approach - for production, consider using raw queries
        const plants = await prisma.main_plant_data.findMany({
          where: {
            OR: [
              { scientific_name: { contains: term, mode: 'insensitive' } },
              { genus: { contains: term, mode: 'insensitive' } },
              { species: { contains: term, mode: 'insensitive' } },
            ],
          },
          include: {
            plant_images: true,
            cultivars: true,
          },
          take: 1,
        })

        if (plants.length > 0) {
          plant = plants[0]
          break
        }
      }
    }

    // Reason: If still no match, try partial matches on scientific name
    if (!plant) {
      const scientificParts = scientific_name.toLowerCase().split(' ')
      for (const part of scientificParts) {
        if (part.length > 3) { // Reason: Only search for meaningful parts
          const plants = await prisma.main_plant_data.findMany({
            where: {
              scientific_name: {
                contains: part,
                mode: 'insensitive',
              },
            },
            include: {
              plant_images: true,
              cultivars: true,
            },
            take: 1,
          })

          if (plants.length > 0) {
            plant = plants[0]
            break
          }
        }
      }
    }

    if (!plant) {
      return null
    }

    // Reason: Convert database plant to identification result format with PlantCardData
    return {
      id: plant.slug || plant.id?.toString() || 'unknown',
      name: (Array.isArray(plant.common_names) ? String(plant.common_names[0] || '') : String(plant.common_names || '')) || plant.scientific_name || 'Unknown Plant',
      scientific_name: plant.scientific_name || 'Unknown',
      confidence: 0.9, // Reason: High confidence for database matches
      description: plant.description || 'No description available',
      image: plant.plant_images?.[0]?.img || undefined,
      careInstructions: generateCareInstructions(),
      common_names: Array.isArray(plant.common_names) ? plant.common_names.map(String) : (plant.common_names ? [String(plant.common_names)] : []),
      databaseMatch: true,
      plantId: plant.id || undefined,
      slug: plant.slug || undefined,
      fullDescription: plant.description || undefined,
      family: plant.family || undefined,
      genus: plant.genus || undefined,
      species: plant.species || undefined,
      height_min: plant.height_min || undefined,
      height_max: plant.height_max || undefined,
      width_min: plant.width_min || undefined,
      width_max: plant.width_max || undefined,
      origin: plant.origin || undefined,
      distribution: plant.distribution || undefined,
      uses: plant.uses || undefined,
      wildlife_value: plant.wildlife_value || undefined,
      edibility: plant.edibility || undefined,
      flower_description: plant.flower_description || undefined,
      leaf_description: plant.leaf_description || undefined,
      fruit_description: plant.fruit_description || undefined,
      stem_description: plant.stem_description || undefined,
      bark_description: plant.bark_description || undefined,
      poison_symptoms: plant.poison_symptoms || undefined,
      poison_toxic_principle: plant.poison_toxic_principle || undefined,
      images: plant.plant_images?.map(img => ({
        id: img.id,
        img: img.img || '',
        alt_text: img.alt_text || '',
        caption: img.caption || '',
        attribution: img.attribution || '',
      })) || undefined,
      // Reason: Add PlantCardData for database matches
      plantCardData: {
        id: plant.id,
        slug: plant.slug,
        scientific_name: plant.scientific_name,
        description: plant.description,
        common_name: Array.isArray(plant.common_names) ? plant.common_names[0] : plant.common_names,
        first_tag: null, // Would need to resolve from tagsIds
        first_image: plant.plant_images?.[0]?.img || null,
        first_image_alt_text: plant.plant_images?.[0]?.alt_text || null,
      } as PlantCardDataScientific,
    }
  } catch (error) {
    console.error('Database search error:', error)
    return null
  }
}

// Reason: Generate care instructions from database plant data
function generateCareInstructions(): string {
  const instructions: string[] = []

  // Reason: Add light requirements (would need to resolve from lightIds)
  // Note: This is simplified - in production, you'd resolve the lookup IDs

  // Reason: Add soil requirements (would need to resolve from soilIds)
  // Note: This is simplified - in production, you'd resolve the lookup IDs

  // Reason: Add maintenance info (would need to resolve from maintenanceIds)
  // Note: This is simplified - in production, you'd resolve the lookup IDs

  return instructions.join('. ') + (instructions.length > 0 ? '.' : '')
}

// Reason: Search for similar plants in database based on characteristics using Prisma
export async function findSimilarPlants(
  plantData: Partial<PlantIdentificationResult>,
  limit: number = 5
): Promise<PlantIdentificationResult[]> {
  try {
    const searchTerms: string[] = []

    // Reason: Build search terms from available plant data
    if (plantData.family) searchTerms.push(plantData.family)
    if (plantData.genus) searchTerms.push(plantData.genus)
    if (plantData.leafShape && plantData.leafShape.length > 0) {
      searchTerms.push(...plantData.leafShape)
    }
    if (plantData.flowerColor && plantData.flowerColor.length > 0) {
      searchTerms.push(...plantData.flowerColor)
    }
    if (plantData.habit && plantData.habit.length > 0) {
      searchTerms.push(...plantData.habit)
    }

    if (searchTerms.length === 0) {
      return []
    }

    // Reason: Search for plants with similar characteristics
    const plants = await prisma.main_plant_data.findMany({
      where: {
        OR: [
          ...searchTerms.map(term => ({
            scientific_name: { contains: term, mode: 'insensitive' as const },
          })),
          ...searchTerms.map(term => ({
            family: { contains: term, mode: 'insensitive' as const },
          }))
        ],
      },
      include: {
        plant_images: true,
        cultivars: true,
      },
      take: limit,
    })

    if (!plants || plants.length === 0) {
      return []
    }

    // Reason: Convert database results to identification format - these are similar plants, not direct matches
    return plants.map(plant => ({
      id: plant.slug || plant.id?.toString() || 'unknown',
      name: (Array.isArray(plant.common_names) ? String(plant.common_names[0] || '') : String(plant.common_names || '')) || plant.scientific_name || 'Unknown Plant',
      scientific_name: plant.scientific_name || 'Unknown',
      confidence: 0.7, // Reason: Lower confidence for similar plants
      description: plant.description || 'No description available',
      image: plant.plant_images?.[0]?.img || undefined,
      careInstructions: generateCareInstructions(),
      common_names: Array.isArray(plant.common_names) ? plant.common_names.map(String) : (plant.common_names ? [String(plant.common_names)] : []),
      databaseMatch: true, // Reason: Will be overridden in API to false for similar plants
      plantId: plant.id || undefined,
      slug: plant.slug || undefined,
      fullDescription: plant.description || undefined,
      family: plant.family || undefined,
      genus: plant.genus || undefined,
      species: plant.species || undefined,
    } as PlantIdentificationResult))
  } catch (error) {
    console.error('Similar plants search error:', error)
    return []
  }
}

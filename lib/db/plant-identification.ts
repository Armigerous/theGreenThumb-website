import { prisma } from './prisma'
import { PlantCardData, PlantCardDataScientific, PlantImage } from '@/types/plant'

// Reason: Interface for plant identification results that includes database matches
export interface PlantIdentificationResult {
  id: string
  name: string
  scientificName: string
  confidence: number
  description: string
  image?: string
  careInstructions?: string
  commonNames?: string[]
  // Database-specific fields
  databaseMatch?: boolean
  plantId?: number
  slug?: string
  fullDescription?: string
  family?: string
  genus?: string
  species?: string
  heightMin?: number
  heightMax?: number
  widthMin?: number
  widthMax?: number
  origin?: string
  distribution?: string
  uses?: string
  wildlifeValue?: string
  edibility?: string
  flowerDescription?: string
  leafDescription?: string
  fruitDescription?: string
  stemDescription?: string
  barkDescription?: string
  poisonSymptoms?: string
  poisonToxicPrinciple?: string
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
  scientificName: string,
  commonNames?: string[]
): Promise<PlantIdentificationResult | null> {
  try {
    // Reason: Try multiple search strategies to find the best match
    const searchTerms = [
      plantName.toLowerCase(),
      scientificName.toLowerCase(),
      ...(commonNames || []).map(name => name.toLowerCase())
    ]

    // Reason: Search by scientific name first (most accurate)
    let plant = await prisma.mainPlantData.findFirst({
      where: {
        scientificName: {
          contains: scientificName,
          mode: 'insensitive',
        },
      },
      include: {
        plantImages: true,
        cultivars: true,
      },
    })

    // Reason: If no scientific match, try common names
    if (!plant) {
      for (const term of searchTerms) {
        // Note: For complex JSON array searches, we might need raw SQL
        // This is a simplified approach - for production, consider using raw queries
        const plants = await prisma.mainPlantData.findMany({
          where: {
            OR: [
              { scientificName: { contains: term, mode: 'insensitive' } },
              { genus: { contains: term, mode: 'insensitive' } },
              { species: { contains: term, mode: 'insensitive' } },
            ],
          },
          include: {
            plantImages: true,
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
      const scientificParts = scientificName.toLowerCase().split(' ')
      for (const part of scientificParts) {
        if (part.length > 3) { // Reason: Only search for meaningful parts
          const plants = await prisma.mainPlantData.findMany({
            where: {
              scientificName: {
                contains: part,
                mode: 'insensitive',
              },
            },
            include: {
              plantImages: true,
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
      name: (Array.isArray(plant.commonNames) ? String(plant.commonNames[0] || '') : String(plant.commonNames || '')) || plant.scientificName || 'Unknown Plant',
      scientificName: plant.scientificName || 'Unknown',
      confidence: 0.9, // Reason: High confidence for database matches
      description: plant.description || 'No description available',
      image: plant.plantImages?.[0]?.img || undefined,
      careInstructions: generateCareInstructions(),
      commonNames: Array.isArray(plant.commonNames) ? plant.commonNames.map(String) : (plant.commonNames ? [String(plant.commonNames)] : []),
      databaseMatch: true,
      plantId: plant.id || undefined,
      slug: plant.slug || undefined,
      fullDescription: plant.description || undefined,
      family: plant.family || undefined,
      genus: plant.genus || undefined,
      species: plant.species || undefined,
      heightMin: plant.heightMin || undefined,
      heightMax: plant.heightMax || undefined,
      widthMin: plant.widthMin || undefined,
      widthMax: plant.widthMax || undefined,
      origin: plant.origin || undefined,
      distribution: plant.distribution || undefined,
      uses: plant.uses || undefined,
      wildlifeValue: plant.wildlifeValue || undefined,
      edibility: plant.edibility || undefined,
      flowerDescription: plant.flowerDescription || undefined,
      leafDescription: plant.leafDescription || undefined,
      fruitDescription: plant.fruitDescription || undefined,
      stemDescription: plant.stemDescription || undefined,
      barkDescription: plant.barkDescription || undefined,
      poisonSymptoms: plant.poisonSymptoms || undefined,
      poisonToxicPrinciple: plant.poisonToxicPrinciple || undefined,
      images: plant.plantImages?.map(img => ({
        id: img.id,
        img: img.img || '',
        alt_text: img.altText || '',
        caption: img.caption || '',
        attribution: img.attribution || '',
      })) || undefined,
      // Reason: Add PlantCardData for database matches
      plantCardData: {
        id: plant.id,
        slug: plant.slug,
        scientific_name: plant.scientificName,
        description: plant.description,
        common_name: Array.isArray(plant.commonNames) ? plant.commonNames[0] : plant.commonNames,
        first_tag: null, // Would need to resolve from tagsIds
        first_image: plant.plantImages?.[0]?.img || null,
        first_image_alt_text: plant.plantImages?.[0]?.altText || null,
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
    const plants = await prisma.mainPlantData.findMany({
      where: {
        OR: [
          ...searchTerms.map(term => ({
            scientificName: { contains: term, mode: 'insensitive' as const },
          })),
          ...searchTerms.map(term => ({
            family: { contains: term, mode: 'insensitive' as const },
          }))
        ],
      },
      include: {
        plantImages: true,
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
      name: (Array.isArray(plant.commonNames) ? String(plant.commonNames[0] || '') : String(plant.commonNames || '')) || plant.scientificName || 'Unknown Plant',
      scientificName: plant.scientificName || 'Unknown',
      confidence: 0.7, // Reason: Lower confidence for similar plants
      description: plant.description || 'No description available',
      image: plant.plantImages?.[0]?.img || undefined,
      careInstructions: generateCareInstructions(),
      commonNames: Array.isArray(plant.commonNames) ? plant.commonNames.map(String) : (plant.commonNames ? [String(plant.commonNames)] : []),
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

import { supabase } from "@/lib/supabaseClient";
import { PlantCardData, PlantCardDataScientific, PlantImage } from "@/types/plant";

// Reason: Interface for plant identification results that includes database matches
export interface PlantIdentificationResult {
  id: string;
  name: string;
  scientificName: string;
  confidence: number;
  description: string;
  image?: string;
  careInstructions?: string;
  commonNames?: string[];
  // Database-specific fields
  databaseMatch?: boolean;
  plantId?: number;
  slug?: string;
  fullDescription?: string;
  family?: string;
  genus?: string;
  species?: string;
  heightMin?: number;
  heightMax?: number;
  widthMin?: number;
  widthMax?: number;
  origin?: string;
  distribution?: string;
  uses?: string;
  wildlifeValue?: string;
  edibility?: string;
  flowerDescription?: string;
  leafDescription?: string;
  fruitDescription?: string;
  stemDescription?: string;
  barkDescription?: string;
  poisonSymptoms?: string;
  poisonToxicPrinciple?: string;
  fireRisk?: string;
  flowerSize?: string;
  fruitLength?: string;
  fruitWidth?: string;
  gardenSpaces?: string;
  growthRate?: string;
  leafHairsPresent?: string;
  leafLength?: string;
  leafWidth?: string;
  poisonDermatitis?: string;
  poisonSeverity?: string;
  stemAromatic?: string;
  stemBudScale?: string;
  stemBudTerminal?: string;
  stemBuds?: string;
  stemCrossSection?: string;
  stemForm?: string;
  stemLeafScarShape?: string;
  stemLenticels?: string;
  stemPith?: string;
  stemSurface?: string;
  texture?: string;
  attracts?: string[];
  availableSpaceToPlant?: string[];
  barkAttachment?: string[];
  barkColor?: string[];
  barkPlateShape?: string[];
  designFeatures?: string[];
  flowerBloomTime?: string[];
  flowerColor?: string[];
  flowerInflorescence?: string[];
  flowerPetals?: string[];
  flowerShape?: string[];
  flowerValueToGardener?: string[];
  fruitColor?: string[];
  fruitDisplayHarvestTime?: string[];
  fruitType?: string[];
  fruitValueToGardener?: string[];
  habit?: string[];
  landscapeLocation?: string[];
  landscapeTheme?: string[];
  leafArrangement?: string[];
  leafCharacteristics?: string[];
  leafColor?: string[];
  leafFallColor?: string[];
  leafFeel?: string[];
  leafMargin?: string[];
  leafShape?: string[];
  leafType?: string[];
  leafValueToGardener?: string[];
  lifeCycle?: string[];
  light?: string[];
  maintenance?: string[];
  ncRegion?: string[];
  plantTypes?: string[];
  poisonPart?: string[];
  problems?: string[];
  propagation?: string[];
  resistanceToChallenges?: string[];
  soilDrainage?: string[];
  soilPh?: string[];
  soilTexture?: string[];
  stemColor?: string[];
  tags?: string[];
  usdaZones?: string[];
  lightRequirements?: string;
  waterRequirements?: string;
  usdaHardinessZones?: string;
  images?: PlantImage[];
  // Reason: PlantCardData for database matches to use existing PlantCard component
  plantCardData?: PlantCardData;
}

// Reason: Search database for plants matching AI identification results
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
    ];

    // Reason: Search by scientific name first (most accurate)
    const { data: initialMatch, error: scientificError } = await supabase
      .from('plant_full_data')
      .select('*')
      .ilike('scientific_name', `%${scientificName.toLowerCase()}%`)
      .limit(1);

    let scientificMatch = initialMatch;

    if (scientificError) {
      console.error('Scientific name search error:', scientificError);
    }

    // Reason: If no scientific match, try common names using ANY for array search
    if (!scientificMatch || scientificMatch.length === 0) {
      for (const term of searchTerms) {
        const { data: commonMatch, error: commonError } = await supabase
          .from('plant_full_data')
          .select('*')
          .filter('common_names', 'cs', `{${term}}`)
          .limit(1);

        if (commonError) {
          console.error('Common name search error:', commonError);
          continue;
        }

        if (commonMatch && commonMatch.length > 0) {
          scientificMatch = commonMatch;
          break;
        }
      }
    }

    // Reason: If still no match, try partial matches on scientific name
    if (!scientificMatch || scientificMatch.length === 0) {
      const scientificParts = scientificName.toLowerCase().split(' ');
      for (const part of scientificParts) {
        if (part.length > 3) { // Reason: Only search for meaningful parts
          const { data: partialMatch, error: partialError } = await supabase
            .from('plant_full_data')
            .select('*')
            .ilike('scientific_name', `%${part}%`)
            .limit(1);

          if (partialError) {
            console.error('Partial search error:', partialError);
            continue;
          }

          if (partialMatch && partialMatch.length > 0) {
            scientificMatch = partialMatch;
            break;
          }
        }
      }
    }

    if (!scientificMatch || scientificMatch.length === 0) {
      return null;
    }

    const plant = scientificMatch[0];
    
    // Reason: Convert database plant to identification result format with PlantCardData
    return {
      id: plant.slug || plant.id?.toString() || 'unknown',
      name: (Array.isArray(plant.common_names) ? plant.common_names[0] : plant.common_names) || plant.scientific_name || 'Unknown Plant',
      scientificName: plant.scientific_name || 'Unknown',
      confidence: 0.9, // Reason: High confidence for database matches
      description: plant.description || 'No description available',
      image: (Array.isArray(plant.images) && plant.images.length > 0 && plant.images[0] && typeof plant.images[0] === 'object' && plant.images[0] !== null && 'img' in plant.images[0]) 
        ? (plant.images[0] as unknown as PlantImage).img || undefined
        : undefined,
      careInstructions: generateCareInstructions(plant),
      commonNames: Array.isArray(plant.common_names) ? plant.common_names : (plant.common_names ? [plant.common_names] : []),
      databaseMatch: true,
      plantId: plant.id || undefined,
      slug: plant.slug || undefined,
      fullDescription: plant.description || undefined,
      family: plant.family || undefined,
      genus: plant.genus || undefined,
      species: plant.species || undefined,
      heightMin: plant.height_min || undefined,
      heightMax: plant.height_max || undefined,
      widthMin: plant.width_min || undefined,
      widthMax: plant.width_max || undefined,
      origin: plant.origin || undefined,
      distribution: plant.distribution || undefined,
      uses: plant.uses || undefined,
      wildlifeValue: plant.wildlife_value || undefined,
      edibility: plant.edibility || undefined,
      flowerDescription: plant.flower_description || undefined,
      leafDescription: plant.leaf_description || undefined,
      fruitDescription: plant.fruit_description || undefined,
      stemDescription: plant.stem_description || undefined,
      barkDescription: plant.bark_description || undefined,
      poisonSymptoms: plant.poison_symptoms || undefined,
      poisonToxicPrinciple: plant.poison_toxic_principle || undefined,
      fireRisk: plant.fire_risk || undefined,
      flowerSize: plant.flower_size || undefined,
      fruitLength: plant.fruit_length || undefined,
      fruitWidth: plant.fruit_width || undefined,
      gardenSpaces: plant.garden_spaces || undefined,
      growthRate: plant.growth_rate || undefined,
      leafHairsPresent: plant.leaf_hairs_present || undefined,
      leafLength: plant.leaf_length || undefined,
      leafWidth: plant.leaf_width || undefined,
      poisonDermatitis: plant.poison_dermatitis || undefined,
      poisonSeverity: plant.poison_severity || undefined,
      stemAromatic: plant.stem_aromatic || undefined,
      stemBudScale: plant.stem_bud_scale || undefined,
      stemBudTerminal: plant.stem_bud_terminal || undefined,
      stemBuds: plant.stem_buds || undefined,
      stemCrossSection: plant.stem_cross_section || undefined,
      stemForm: plant.stem_form || undefined,
      stemLeafScarShape: plant.stem_leaf_scar_shape || undefined,
      stemLenticels: plant.stem_lenticels || undefined,
      stemPith: plant.stem_pith || undefined,
      stemSurface: plant.stem_surface || undefined,
      texture: plant.texture || undefined,
      attracts: Array.isArray(plant.attracts) ? plant.attracts as string[] : undefined,
      availableSpaceToPlant: Array.isArray(plant.available_space_to_plant) ? plant.available_space_to_plant as string[] : undefined,
      barkAttachment: Array.isArray(plant.bark_attachment) ? plant.bark_attachment as string[] : undefined,
      barkColor: Array.isArray(plant.bark_color) ? plant.bark_color as string[] : undefined,
      barkPlateShape: Array.isArray(plant.bark_plate_shape) ? plant.bark_plate_shape as string[] : undefined,
      designFeatures: Array.isArray(plant.design_feature) ? plant.design_feature as string[] : undefined,
      flowerBloomTime: Array.isArray(plant.flower_bloom_time) ? plant.flower_bloom_time as string[] : undefined,
      flowerColor: Array.isArray(plant.flower_colors) ? plant.flower_colors as string[] : undefined,
      flowerInflorescence: Array.isArray(plant.flower_inflorescence) ? plant.flower_inflorescence as string[] : undefined,
      flowerPetals: Array.isArray(plant.flower_petals) ? plant.flower_petals as string[] : undefined,
      flowerShape: Array.isArray(plant.flower_shape) ? plant.flower_shape as string[] : undefined,
      flowerValueToGardener: Array.isArray(plant.flower_value_to_gardener) ? plant.flower_value_to_gardener as string[] : undefined,
      fruitColor: Array.isArray(plant.fruit_color) ? plant.fruit_color as string[] : undefined,
      fruitDisplayHarvestTime: Array.isArray(plant.fruit_display_harvest_time) ? plant.fruit_display_harvest_time as string[] : undefined,
      fruitType: Array.isArray(plant.fruit_type) ? plant.fruit_type as string[] : undefined,
      fruitValueToGardener: Array.isArray(plant.fruit_value_to_gardener) ? plant.fruit_value_to_gardener as string[] : undefined,
      habit: Array.isArray(plant.plant_habit) ? plant.plant_habit as string[] : undefined,
      landscapeLocation: Array.isArray(plant.landscape_location) ? plant.landscape_location as string[] : undefined,
      landscapeTheme: Array.isArray(plant.landscape_theme) ? plant.landscape_theme as string[] : undefined,
      leafArrangement: Array.isArray(plant.leaf_arrangement) ? plant.leaf_arrangement as string[] : undefined,
      leafCharacteristics: Array.isArray(plant.leaf_characteristics) ? plant.leaf_characteristics as string[] : undefined,
      leafColor: Array.isArray(plant.leaf_color) ? plant.leaf_color as string[] : undefined,
      leafFallColor: Array.isArray(plant.leaf_fall_color) ? plant.leaf_fall_color as string[] : undefined,
      leafFeel: Array.isArray(plant.leaf_feel) ? plant.leaf_feel as string[] : undefined,
      leafMargin: Array.isArray(plant.leaf_margin) ? plant.leaf_margin as string[] : undefined,
      leafShape: Array.isArray(plant.leaf_shape) ? plant.leaf_shape as string[] : undefined,
      leafType: Array.isArray(plant.leaf_type) ? plant.leaf_type as string[] : undefined,
      leafValueToGardener: Array.isArray(plant.leaf_value_to_gardener) ? plant.leaf_value_to_gardener as string[] : undefined,
      lifeCycle: Array.isArray(plant.life_cycle) ? plant.life_cycle as string[] : undefined,
      light: Array.isArray(plant.light_requirements) ? plant.light_requirements as string[] : undefined,
      maintenance: Array.isArray(plant.maintenance) ? plant.maintenance as string[] : undefined,
      ncRegion: Array.isArray(plant.nc_regions) ? plant.nc_regions as string[] : undefined,
      plantTypes: Array.isArray(plant.plant_types) ? plant.plant_types as string[] : undefined,
      poisonPart: Array.isArray(plant.poison_parts) ? plant.poison_parts as string[] : undefined,
      problems: Array.isArray(plant.problems) ? plant.problems as string[] : undefined,
      propagation: Array.isArray(plant.propagation) ? plant.propagation as string[] : undefined,
      resistanceToChallenges: Array.isArray(plant.resistance_to_challenges) ? plant.resistance_to_challenges as string[] : undefined,
      soilDrainage: Array.isArray(plant.soil_drainage) ? plant.soil_drainage as string[] : undefined,
      soilPh: Array.isArray(plant.soil_ph) ? plant.soil_ph as string[] : undefined,
      soilTexture: Array.isArray(plant.soil_texture) ? plant.soil_texture as string[] : undefined,
      stemColor: Array.isArray(plant.stem_color) ? plant.stem_color as string[] : undefined,
      tags: Array.isArray(plant.tags) ? plant.tags as string[] : undefined,
      usdaZones: Array.isArray(plant.usda_zones) ? plant.usda_zones as string[] : undefined,
      lightRequirements: Array.isArray(plant.light_requirements) ? plant.light_requirements.join(', ') : (plant.light_requirements as string) || undefined,
      waterRequirements: 'water_requirements' in plant ? (plant as { water_requirements: string }).water_requirements : undefined,
      usdaHardinessZones: 'usda_hardiness_zones' in plant ? (plant as { usda_hardiness_zones: string }).usda_hardiness_zones : undefined,
      images: Array.isArray(plant.images) ? plant.images as unknown as PlantImage[] : undefined,
      // Reason: Add PlantCardData for database matches
      plantCardData: {
        id: plant.id,
        slug: plant.slug,
        scientific_name: plant.scientific_name,
        description: plant.description,
        common_name: Array.isArray(plant.common_names) ? plant.common_names[0] : plant.common_names,
        first_tag: (Array.isArray(plant.tags) && plant.tags.length > 0) ? (plant.tags[0] as string) : null,
        first_image: (Array.isArray(plant.images) && plant.images.length > 0 && plant.images[0] && typeof plant.images[0] === 'object' && plant.images[0] !== null && 'img' in plant.images[0]) 
          ? (plant.images[0] as unknown as PlantImage).img
          : null,
        first_image_alt_text: (Array.isArray(plant.images) && plant.images.length > 0 && plant.images[0] && typeof plant.images[0] === 'object' && plant.images[0] !== null && 'alt_text' in plant.images[0]) 
          ? (plant.images[0] as unknown as PlantImage).alt_text
          : null,
      } as PlantCardDataScientific,
    };
  } catch (error) {
    console.error('Database search error:', error);
    return null;
  }
}

// Reason: Generate care instructions from database plant data
function generateCareInstructions(plant: Record<string, unknown>): string {
  const instructions: string[] = [];

  // Reason: Add light requirements
  if (plant.light_requirements) {
    instructions.push(`Light: ${plant.light_requirements}`);
  } else if (Array.isArray(plant.light) && plant.light.length > 0) {
    instructions.push(`Light: ${plant.light.join(', ')}`);
  }

  // Reason: Add water requirements
  if (plant.water_requirements) {
    instructions.push(`Water: ${plant.water_requirements}`);
  }

  // Reason: Add soil requirements
  if (Array.isArray(plant.soil_drainage) && plant.soil_drainage.length > 0) {
    instructions.push(`Soil drainage: ${plant.soil_drainage.join(', ')}`);
  }
  if (Array.isArray(plant.soil_ph) && plant.soil_ph.length > 0) {
    instructions.push(`Soil pH: ${plant.soil_ph.join(', ')}`);
  }

  // Reason: Add USDA zones
  if (Array.isArray(plant.usda_zones) && plant.usda_zones.length > 0) {
    instructions.push(`USDA zones: ${plant.usda_zones.join(', ')}`);
  }

  // Reason: Add maintenance info
  if (Array.isArray(plant.maintenance) && plant.maintenance.length > 0) {
    instructions.push(`Maintenance: ${plant.maintenance.join(', ')}`);
  }

  // Reason: Add propagation info
  if (Array.isArray(plant.propagation) && plant.propagation.length > 0) {
    instructions.push(`Propagation: ${plant.propagation.join(', ')}`);
  }

  return instructions.join('. ') + (instructions.length > 0 ? '.' : '');
}

// Reason: Search for similar plants in database based on characteristics
export async function findSimilarPlants(
  plantData: Partial<PlantIdentificationResult>,
  limit: number = 5
): Promise<PlantIdentificationResult[]> {
  try {
    const searchTerms: string[] = [];

    // Reason: Build search terms from available plant data
    if (plantData.family) searchTerms.push(plantData.family);
    if (plantData.genus) searchTerms.push(plantData.genus);
    if (plantData.leafShape && plantData.leafShape.length > 0) {
      searchTerms.push(...plantData.leafShape);
    }
    if (plantData.flowerColor && plantData.flowerColor.length > 0) {
      searchTerms.push(...plantData.flowerColor);
    }
    if (plantData.habit && plantData.habit.length > 0) {
      searchTerms.push(...plantData.habit);
    }

    if (searchTerms.length === 0) {
      return [];
    }

    // Reason: Search for plants with similar characteristics using proper array handling
    const { data, error } = await supabase
      .from('plant_full_data')
      .select('*')
      .or(searchTerms.map(term => `scientific_name.ilike.%${term}%,family.ilike.%${term}%`).join(','))
      .limit(limit);

    if (error) {
      console.error('Similar plants search error:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Reason: Convert database results to identification format - these are similar plants, not direct matches
    return data.map(plant => ({
      id: plant.slug || plant.id?.toString() || 'unknown',
      name: (Array.isArray(plant.common_names) ? plant.common_names[0] : plant.common_names) || plant.scientific_name || 'Unknown Plant',
      scientificName: plant.scientific_name || 'Unknown',
      confidence: 0.7, // Reason: Lower confidence for similar plants
      description: plant.description || 'No description available',
      image: (Array.isArray(plant.images) && plant.images.length > 0 && plant.images[0] && typeof plant.images[0] === 'object' && plant.images[0] !== null && 'img' in plant.images[0]) 
        ? (plant.images[0] as unknown as PlantImage).img || undefined
        : undefined,
      careInstructions: generateCareInstructions(plant),
      commonNames: Array.isArray(plant.common_names) ? plant.common_names : (plant.common_names ? [plant.common_names] : []),
      databaseMatch: true, // Reason: Will be overridden in API to false for similar plants
      plantId: plant.id || undefined,
      slug: plant.slug || undefined,
      fullDescription: plant.description || undefined,
      family: plant.family || undefined,
      genus: plant.genus || undefined,
      species: plant.species || undefined,
    } as PlantIdentificationResult));
  } catch (error) {
    console.error('Similar plants search error:', error);
    return [];
  }
}

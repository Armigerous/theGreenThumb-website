import { allFilters } from "./filterData";

export interface UserGardens {
  // System Fields
  id?: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;

  // 1. Basic Garden Information
  name: string;
  
  // Region & Zone
  ncRegionsIds: string[]; // Coastal / Mountains / Piedmont
  usda_zones_ids: string[]; // 1a–13b
  
  // Light Requirements
  sunlightIds: string[]; // Full Sun, Partial Shade, Dappled Sunlight, Deep Shade
  
  // Soil Profile
  soilTypeIds: string[]; // Clay, Loam, Sand, etc.
  soilPhIds: string[]; // Acid, Neutral, Alkaline
  soilDrainageIds: string[]; // Good Drainage, Occasional Flooding, Very Dry, etc.
  
  // Available Space
  spaceAvailableIds: string[]; // Less than 12 inches, 12 inches–3 ft, etc.
  
  // 2. Landscape & Style
  locationIds: string[]; // Container, Patio, Slope/Bank, Woodland, Meadow, etc.
  gardenThemeIds: string[]; // Butterfly Garden, Drought Tolerant, Native Garden, etc.
  designFeatureIds: string[]; // Accent, Border, Mass Planting, Screen/Privacy, etc.
  
  // 3. Wildlife & Resistance
  wildlifeAttractionIds: string[]; // Bees, Butterflies, Songbirds, Hummingbirds, etc.
  resistanceChallengeIds: string[]; // Deer, Drought, Erosion, Salt, Wind, etc.
  problemsToExcludeIds: string[]; // Poisonous to Humans, Invasive, Messy, Spines/Thorns, etc.
  
  // 4. Whole Plant Traits
  growthRateId?: number; // Slow / Medium / Rapid
  maintenanceLevelId?: number; // Low / Medium / High
  texturePreferenceId?: number; // Fine / Medium / Coarse
  habitFormIds?: string[]; // Optional: Columnar, Creeping, Mounding, Weeping, etc.
  plantTypeIds?: string[]; // Optional: Perennial, Shrub, Tree, Vine, Houseplant, etc.
  
  // 5. Flower & Foliage Details
  flowerColorIds?: string[]; // Blue, White, Red/Burgundy, Gold/Yellow, etc.
  flowerBloomTimeIds?: string[]; // Spring, Summer, Fall, Winter
  flowerValueIds?: string[]; // Edible, Fragrant, Showy, Good Cut, etc.
  leafFeelIds?: string[]; // Fleshy, Glossy, Leathery, etc.
  leafColorIds?: string[]; // Green, Variegated, Purple/Lavender, etc.
  leafValueIds?: string[]; // Fragrant, Showy, Long-lasting, etc.
  fallColorIds?: string[]; // Red/Burgundy, Gold/Yellow, Orange, etc.
  yearRoundInterest: boolean;
  
  // 6. Specific Plants & Recommendations
  userPlantsId: string[]; // References to user's plants in user_plants table
  wantsRecommendations: boolean; // Toggle for recommendations
}

export const defaultUserGardens: UserGardens = {
  // 1. Basic Garden Information
  name: "",
  
  // Region & Zone
  ncRegionsIds: [],
  usda_zones_ids: [],
  
  // Light Requirements
  sunlightIds: [],
  
  // Soil Profile
  soilTypeIds: [],
  soilPhIds: [],
  soilDrainageIds: [],
  
  // Available Space
  spaceAvailableIds: [],
  
  // 2. Landscape & Style
  locationIds: [],
  gardenThemeIds: [],
  designFeatureIds: [],
  
  // 3. Wildlife & Resistance
  wildlifeAttractionIds: [],
  resistanceChallengeIds: [],
  problemsToExcludeIds: [],
  
  // 4. Whole Plant Traits
  // growthRateId, maintenanceLevelId, and texturePreferenceId are optional
  
  // 5. Flower & Foliage Details
  flowerColorIds: [],
  flowerBloomTimeIds: [],
  flowerValueIds: [],
  leafColorIds: [],
  leafValueIds: [],
  leafFeelIds: [],
  fallColorIds: [],
  yearRoundInterest: false,
  
  // 6. Specific Plants & Recommendations
  userPlantsId: [],
  wantsRecommendations: true,
};

// Helper function to get options from filterData
export const getFilterOptions = (categoryId: string): string[] => {
  for (const section of allFilters) {
    for (const category of section.categories) {
      if (category.id === categoryId) {
        return category.options;
      }
    }
  }
  return [];
};

export interface userPlants {
  id: string;
  gardenId: number;  // Links to UserGardens.id
  customName: string;
  botanicalName: string;
  status: 'healthy' | 'warning' | 'critical' | 'dormant';
  careLogs: CareLogEntry[];
  images: PlantImage[];
  locationTags: string[];  // Matches garden zone mapping
  createdAt: Date;
  updatedAt: Date;
}

export interface CareLogEntry {
  date: Date;
  type: 'water' | 'fertilize' | 'prune' | 'treatment';
  notes: string;
  images?: string[];  // URLs of uploaded images
}

export interface PlantImage {
  url: string;
  isPrimary: boolean;
  uploadedAt: Date;
}

// Add to existing allFilters constant
export const plantStatusFilters = [
  { id: 'health', name: 'Health Status' },
  { id: 'care-needed', name: 'Care Needed' }
]; 
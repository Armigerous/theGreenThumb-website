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
  soilTextureIds: string[]; // Clay, Loam, Sand, etc.
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
  soilTextureIds: [],
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
  // Reason: Database field names for compatibility with Prisma schema
  garden_id?: number;
  nickname?: string;
  plant_id?: number;
  care_logs?: any;
  created_at?: Date;
  updated_at?: Date;
  main_plant_data?: {
    scientific_name?: string;
    common_names?: string | string[];
    plant_images?: Array<{
      img?: string;
      alt_text?: string;
    }>;
  };
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

// Reason: Extended types for My Garden page functionality
export interface GardenStatistics {
  totalPlants: number;
  healthyPlants: number;
  warningPlants: number;
  criticalPlants: number;
  plantsNeedingCare: number;
}

export interface GardenWithStats extends UserGardens {
  statistics: GardenStatistics;
}

export interface OverallGardenStatistics {
  totalGardens: number;
  totalPlants: number;
  healthyPlants: number;
  warningPlants: number;
  criticalPlants: number;
  plantsNeedingCare: number;
}

export interface PlantWithGarden extends userPlants {
  gardenName: string;
}

export interface PlantRecommendation {
  id: number;
  slug: string;
  scientificName: string;
  commonName: string;
  description: string | null;
  image: string | null;
  imageAlt: string | null;
}

export interface GardenRecommendationsResponse {
  recommendations: PlantRecommendation[];
  gardenName: string;
}

// Reason: API response types for My Garden page
export interface GardenOverviewResponse {
  gardens: GardenWithStats[];
  statistics: OverallGardenStatistics;
  plantsNeedingCare: PlantWithGarden[];
}

export interface GardenDetailResponse extends UserGardens {
  statistics: GardenStatistics;
  userPlants: userPlants[];
}

// Reason: Plant management action types
export type PlantStatus = 'healthy' | 'warning' | 'critical' | 'dormant';
export type CareLogType = 'water' | 'fertilize' | 'prune' | 'treatment';

export interface PlantManagementAction {
  type: 'archive' | 'delete' | 'update';
  plantId: string;
  data?: Partial<userPlants>;
}

// Reason: Care task types (since we don't have a separate plant_tasks table)
export interface CareTask {
  id: string;
  plantId: string;
  type: CareLogType;
  dueDate: Date;
  completed: boolean;
  completedAt?: Date;
  notes?: string;
}

// Reason: Helper function to determine if a plant needs care
export const needsCare = (plant: userPlants): boolean => {
  const careLogs = plant.careLogs as CareLogEntry[];
  if (!careLogs || careLogs.length === 0) return true;
  
  const lastCareDate = new Date(Math.max(...careLogs.map(log => new Date(log.date).getTime())));
  const daysSinceLastCare = (Date.now() - lastCareDate.getTime()) / (1000 * 60 * 60 * 24);
  
  return daysSinceLastCare > 7;
};

// Reason: Helper function to get care status badge color
export const getCareStatusColor = (plant: userPlants): string => {
  if (plant.status === 'critical') return 'text-red-600 bg-red-50';
  if (plant.status === 'warning') return 'text-yellow-600 bg-yellow-50';
  if (needsCare(plant)) return 'text-orange-600 bg-orange-50';
  return 'text-green-600 bg-green-50';
};

// Reason: Helper function to get care status text
export const getCareStatusText = (plant: userPlants): string => {
  if (plant.status === 'critical') return 'Critical';
  if (plant.status === 'warning') return 'Warning';
  if (needsCare(plant)) return 'Needs Care';
  return 'Healthy';
}; 
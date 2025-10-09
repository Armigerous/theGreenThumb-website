// types/plant-redesign.ts
// TypeScript types for the redesigned Plant database schema
// These types correspond to the Prisma models in prisma/schema.prisma

// ========================================
// ENUMS
// ========================================

export enum SymbiosisType {
  MUTUALISTIC = "MUTUALISTIC",
  COMMENSALISTIC = "COMMENSALISTIC",
  PROTECTIVE = "PROTECTIVE",
  NUTRITIVE = "NUTRITIVE",
  SPACE_SHARING = "SPACE_SHARING",
  PEST_CONTROL = "PEST_CONTROL",
  AESTHETIC = "AESTHETIC",
}

export enum HealthIssueType {
  DISEASE = "DISEASE",
  PEST = "PEST",
  NUTRITIONAL = "NUTRITIONAL",
  ENVIRONMENTAL = "ENVIRONMENTAL",
  PHYSICAL_DAMAGE = "PHYSICAL_DAMAGE",
  ROOT_ISSUE = "ROOT_ISSUE",
  LEAF_ISSUE = "LEAF_ISSUE",
  FLOWER_ISSUE = "FLOWER_ISSUE",
  FRUIT_ISSUE = "FRUIT_ISSUE",
}

export enum IssueSeverity {
  MILD = "MILD",
  MODERATE = "MODERATE",
  SEVERE = "SEVERE",
  CRITICAL = "CRITICAL",
}

export enum CareLogType {
  WATER = "WATER",
  FERTILIZE = "FERTILIZE",
  PRUNE = "PRUNE",
  REPOT = "REPOT",
  TREATMENT = "TREATMENT",
  OBSERVATION = "OBSERVATION",
  PHOTO = "PHOTO",
  HEALTH_CHECK = "HEALTH_CHECK",
  PEST_CONTROL = "PEST_CONTROL",
  DISEASE_TREATMENT = "DISEASE_TREATMENT",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

// ========================================
// NESTED JSON STRUCTURES
// ========================================

/**
 * Visual cues for AI training data in health issue identification
 * Stored as JSON in PlantHealthIssue.visualCues
 */
export interface HealthIssueVisualCues {
  leaf_spots?: {
    color?: string[];
    size?: string;
    pattern?: string;
  };
  discoloration?: {
    location?: string[];
    color?: string[];
    progression?: string;
  };
  deformities?: {
    type?: string[];
    severity?: string;
  };
  pests?: {
    visible?: boolean;
    location?: string[];
    type?: string[];
  };
  [key: string]: unknown; // Allow additional custom properties
}

/**
 * Structured care task instructions
 * Stored as JSON in PlantCareTask.instructions
 */
export interface CareTaskInstructions {
  steps: string[];
  tools_needed?: string[];
  time_estimate?: string;
  difficulty?: "easy" | "moderate" | "difficult";
  warnings?: string[];
  tips?: string[];
}

/**
 * Detailed propagation instructions
 * Stored as JSON in PlantPropagationInfo.propagationInstructions
 */
export interface PropagationInstructions {
  method: string;
  steps: string[];
  timing?: string;
  success_rate?: string;
  time_to_root?: string;
  special_requirements?: string[];
}

// ========================================
// CORE PLANT MODELS
// ========================================

/**
 * Core plant table - essential information only
 */
export interface Plant {
  id: number;
  slug: string;
  scientificName: string;
  commonNames: string[]; // Max 10 items
  family: string | null;
  genus: string | null;
  species: string | null;
  cultivar: string | null;
  variety: string | null;

  // Basic plant information
  description: string | null;
  origin: string | null;
  distribution: string | null;

  // Essential environmental requirements (denormalized for performance)
  lightRequirements: string[]; // Max 5 items
  waterNeeds: string[]; // Max 5 items
  soilTypes: string[]; // Max 8 items
  hardinessZones: string[]; // Max 10 items

  // Media
  profileVideo: string | null;
  soundFile: string | null;

  // AI and data quality
  dataCompleteness: number; // 0-1 score
  lastAiUpdate: Date | null;
  aiConfidence: number | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Physical characteristics of the plant
 */
export interface PlantPhysicalTraits {
  id: number;
  plantId: number;

  // Size information
  heightMin: number | null; // cm
  heightMax: number | null; // cm
  widthMin: number | null; // cm
  widthMax: number | null; // cm

  // Growth characteristics
  growthRate: string | null; // "slow", "moderate", "fast"
  lifeSpan: string | null; // "annual", "perennial", "biennial"
  habit: string | null; // "upright", "spreading", "climbing", "prostrate"

  // Plant structure
  stemType: string | null; // "woody", "herbaceous", "succulent"
  rootType: string | null; // "taproot", "fibrous", "shallow"

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Detailed environmental requirements
 */
export interface PlantEnvironmentalRequirements {
  id: number;
  plantId: number;

  // Soil requirements
  soilPh: number[]; // pH range [min, max]
  soilDrainage: string[]; // "well_drained", "poorly_drained"
  soilFertility: string | null; // "low", "moderate", "high"

  // Temperature requirements
  temperatureMin: number | null; // Celsius
  temperatureMax: number | null; // Celsius
  frostTolerance: string | null; // "none", "light", "moderate", "heavy"

  // Humidity requirements
  humidityMin: number | null; // Percentage
  humidityMax: number | null; // Percentage
  humidityPreference: string | null; // "low", "moderate", "high"

  // Wind and exposure
  windTolerance: string | null; // "low", "moderate", "high"
  saltTolerance: string | null; // "none", "low", "moderate", "high"

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Plant characteristics (flower, foliage, wildlife, toxicity, aesthetics)
 */
export interface PlantCharacteristics {
  id: number;
  plantId: number;

  // Flower characteristics
  flowerColor: string[]; // Max 10 items
  flowerSize: string | null; // "small", "medium", "large"
  flowerShape: string | null;
  bloomTime: string[]; // Max 4 items: "spring", "summer", "fall", "winter"
  bloomDuration: string | null; // "brief", "extended", "continuous"
  fragrance: string | null; // "none", "mild", "strong", "sweet", "spicy"

  // Foliage characteristics
  foliageColor: string[]; // Max 10 items
  foliageTexture: string | null; // "smooth", "rough", "hairy", "waxy"
  foliageShape: string | null; // "ovate", "lanceolate", "round", "needle"
  foliageSize: string | null; // "small", "medium", "large"
  evergreen: boolean | null;
  deciduous: boolean | null;

  // Fruit/seed characteristics
  fruitColor: string[]; // Max 8 items
  fruitSize: string | null;
  fruitEdible: boolean | null;
  seedSize: string | null; // "small", "medium", "large"

  // Wildlife interactions
  attractsBirds: boolean | null;
  attractsBees: boolean | null;
  attractsButterflies: boolean | null;
  attractsHummingbirds: boolean | null;

  // Resistance characteristics
  deerResistant: boolean | null;
  rabbitResistant: boolean | null;
  droughtResistant: boolean | null;
  diseaseResistant: string[]; // Max 20 items

  // Aesthetic characteristics
  aestheticStyle: string[]; // Max 5 items
  colorScheme: string[]; // Max 3 items
  primaryColors: string[]; // Max 5 items
  textureProfile: string[]; // Max 5 items
  sizeCategory: string | null; // "statement", "filler", "trailing", "upright"
  seasonalInterest: string[]; // Max 8 items

  // Toxicity information
  toxicToHumans: string | null; // "none", "mild", "moderate", "severe"
  toxicToPets: string | null; // "none", "mild", "moderate", "severe"
  toxicParts: string[]; // Max 8 items
  toxicityNotes: string | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Detailed care instructions
 */
export interface PlantCareInstructions {
  id: number;
  plantId: number;

  // Watering instructions
  wateringFrequency: string | null; // "daily", "weekly", "biweekly", "monthly"
  wateringAmount: string | null; // "light", "moderate", "heavy"
  wateringMethod: string | null; // "overhead", "soil_level", "drip"
  winterWatering: string | null; // "reduce", "stop", "same"

  // Fertilizing instructions
  fertilizingFrequency: string | null; // "monthly", "seasonal", "yearly"
  fertilizerType: string | null; // "balanced", "high_nitrogen", "high_phosphorus"
  fertilizingSeason: string | null; // "spring", "summer", "fall", "all_year"

  // Pruning instructions
  pruningTime: string | null; // "late_winter", "spring", "summer", "fall"
  pruningType: string | null; // "light", "moderate", "heavy", "deadhead"
  pruningNotes: string | null;

  // Repotting/transplanting
  repottingFrequency: string | null; // "yearly", "biyearly", "when_needed"
  transplantingTime: string | null; // "spring", "fall", "dormant_season"

  // Special care requirements
  specialCare: string | null;
  careNotes: string | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Propagation information
 */
export interface PlantPropagationInfo {
  id: number;
  plantId: number;

  // Propagation methods
  propagationMethods: string[]; // "seeds", "cuttings", "division", "layering"
  propagationDifficulty: string | null; // "easy", "moderate", "difficult"

  // Seed information
  seedGerminationTime: string | null; // "1_2_weeks", "2_4_weeks", "1_2_months"
  seedDepth: string | null; // "surface", "shallow", "deep"
  seedSpacing: string | null; // "close", "moderate", "wide"
  seedStratification: boolean | null;

  // Cutting information
  cuttingType: string | null; // "softwood", "hardwood", "semi_hardwood", "root"
  cuttingTime: string | null; // "spring", "summer", "fall", "winter"
  rootingHormone: boolean | null;

  // Division information
  divisionTime: string | null; // "spring", "fall"
  divisionFrequency: string | null; // "yearly", "biyearly", "when_needed"

  // Propagation instructions
  propagationInstructions: PropagationInstructions | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ========================================
// RELATIONSHIP MODELS
// ========================================

/**
 * Plant image information
 */
export interface PlantImage {
  id: number;
  plantId: number;
  url: string;
  altText: string | null;
  caption: string | null;
  attribution: string | null;
  isPrimary: boolean;
  sortOrder: number;

  // Image metadata for AI processing
  imageType: string | null; // "flower", "foliage", "fruit", "seed", "bark", "root"
  season: string | null; // "spring", "summer", "fall", "winter"
  healthStatus: string | null; // "healthy", "diseased", "pest_damage"
}

/**
 * Plant similarity relationships
 */
export interface PlantSimilarity {
  id: number;
  plantId: number;
  similarPlantId: number;
  similarityScore: number;
  similarityType: string; // "visual", "care", "habitat"
}

/**
 * Symbiotic relationships between plants
 */
export interface PlantSymbiosis {
  id: number;
  plantId: number;
  symbioticPlantId: number;

  // Relationship details
  relationshipType: SymbiosisType;
  benefitToPlant: string;
  benefitToSymbiotic: string;
  distance: number | null; // Optimal distance in cm
  notes: string | null;

  // Scientific backing
  researchSource: string | null;
  confidence: number; // 0-1 confidence score

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Aesthetic plant pairings
 */
export interface PlantAestheticPairing {
  id: number;
  plantId: number;
  companionPlantId: number;

  // V1 ESSENTIALS
  pairingType: string; // "color_harmony", "texture_contrast", "size_complement"
  aestheticReason: string;
  containerSuitable: boolean;
  confidence: number; // 0-1 confidence score

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ========================================
// AI/FEATURE MODELS
// ========================================

/**
 * Plant health issues and diseases
 */
export interface PlantHealthIssue {
  id: string;
  plantId: number;

  // Issue identification
  issueType: HealthIssueType;
  issueName: string;
  severity: IssueSeverity;

  // Symptoms and diagnosis
  symptoms: string[]; // Max 20 items
  description: string | null;
  causes: string[]; // Max 15 items

  // Treatment and prevention
  prevention: string[]; // Max 20 items
  treatment: string[]; // Max 25 items
  organicTreatment: string[]; // Max 15 items
  chemicalTreatment: string[]; // Max 15 items

  // Visual identification
  visualCues: HealthIssueVisualCues | null;

  // AI confidence and sources
  aiConfidence: number | null;
  researchSource: string | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Plant care task templates
 */
export interface PlantCareTask {
  id: number;
  plantId: number;

  // Task details
  taskType: CareLogType;
  title: string;
  description: string | null;
  priority: TaskPriority;

  // Automated scheduling
  frequency: string; // "daily", "weekly", "monthly", "seasonal"
  season: string | null; // "spring", "summer", "fall", "winter", null for all seasons
  conditions: Record<string, unknown> | null;

  // Task instructions
  instructions: CareTaskInstructions;

  // AI-generated task
  aiGenerated: boolean;
  aiConfidence: number | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Plant embeddings for semantic search
 */
export interface PlantEmbedding {
  id: string;
  plantId: number;

  // Embedding data
  content: string;
  embedding: unknown; // pgvector type

  // Metadata
  model: string;
  createdAt: Date;
}

// ========================================
// COMPOSITE TYPES
// ========================================

/**
 * Plant with images array - useful for card displays
 */
export interface PlantWithImages extends Plant {
  images: PlantImage[];
}

/**
 * Complete plant data with all sub-tables and relations
 */
export interface PlantComplete extends Plant {
  images: PlantImage[];
  similarPlants: PlantSimilarity[];
  symbioticRelationships: PlantSymbiosis[];
  aestheticPairings: PlantAestheticPairing[];
  healthIssues: PlantHealthIssue[];
  careTasks: PlantCareTask[];
  embeddings: PlantEmbedding[];

  // Modular sub-objects
  physicalTraits: PlantPhysicalTraits | null;
  environmentalRequirements: PlantEnvironmentalRequirements | null;
  characteristics: PlantCharacteristics | null;
  careInstructions: PlantCareInstructions | null;
  propagationInfo: PlantPropagationInfo | null;
}

/**
 * Optimized plant data for search results
 */
export interface PlantForSearch {
  id: number;
  slug: string;
  scientificName: string;
  commonNames: string[];
  description: string | null;
  lightRequirements: string[];
  waterNeeds: string[];
  hardinessZones: string[];
  dataCompleteness: number;

  // Primary image for display
  primaryImage?: PlantImage;

  // Key characteristics for filtering
  characteristics?: {
    flowerColor?: string[];
    bloomTime?: string[];
    attractsBees?: boolean;
    deerResistant?: boolean;
  };
}

/**
 * Minimal plant data for card display
 */
export interface PlantForCard {
  id: number;
  slug: string;
  scientificName: string;
  commonNames: string[];
  description: string | null;
  primaryImage?: {
    url: string;
    altText: string | null;
  };
  lightRequirements: string[];
  waterNeeds: string[];
}


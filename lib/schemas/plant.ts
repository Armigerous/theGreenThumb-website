// lib/schemas/plant.ts
// Zod validation schemas for the redesigned Plant database schema
// These schemas enforce array size limits, string validations, and business logic

import { z } from "zod";

// ========================================
// ENUMS
// ========================================

export const SymbiosisTypeSchema = z.enum([
  "MUTUALISTIC",
  "COMMENSALISTIC",
  "PROTECTIVE",
  "NUTRITIVE",
  "SPACE_SHARING",
  "PEST_CONTROL",
  "AESTHETIC",
]);

export const HealthIssueTypeSchema = z.enum([
  "DISEASE",
  "PEST",
  "NUTRITIONAL",
  "ENVIRONMENTAL",
  "PHYSICAL_DAMAGE",
  "ROOT_ISSUE",
  "LEAF_ISSUE",
  "FLOWER_ISSUE",
  "FRUIT_ISSUE",
]);

export const IssueSeveritySchema = z.enum([
  "MILD",
  "MODERATE",
  "SEVERE",
  "CRITICAL",
]);

export const CareLogTypeSchema = z.enum([
  "WATER",
  "FERTILIZE",
  "PRUNE",
  "REPOT",
  "TREATMENT",
  "OBSERVATION",
  "PHOTO",
  "HEALTH_CHECK",
  "PEST_CONTROL",
  "DISEASE_TREATMENT",
]);

export const TaskPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

// ========================================
// NESTED JSON STRUCTURES
// ========================================

/**
 * Visual cues schema for health issue identification
 * Validates the structure of PlantHealthIssue.visualCues JSON field
 */
export const HealthIssueVisualCuesSchema = z.object({
  leaf_spots: z
    .object({
      color: z.array(z.string()).max(10).optional(),
      size: z.string().optional(),
      pattern: z.string().optional(),
    })
    .optional(),
  discoloration: z
    .object({
      location: z.array(z.string()).max(10).optional(),
      color: z.array(z.string()).max(10).optional(),
      progression: z.string().optional(),
    })
    .optional(),
  deformities: z
    .object({
      type: z.array(z.string()).max(10).optional(),
      severity: z.string().optional(),
    })
    .optional(),
  pests: z
    .object({
      visible: z.boolean().optional(),
      location: z.array(z.string()).max(10).optional(),
      type: z.array(z.string()).max(10).optional(),
    })
    .optional(),
});

/**
 * Care task instructions schema
 * Validates the structure of PlantCareTask.instructions JSON field
 */
export const CareTaskInstructionsSchema = z.object({
  steps: z.array(z.string()).min(1, "At least one step is required"),
  tools_needed: z.array(z.string()).max(20).optional(),
  time_estimate: z.string().optional(),
  difficulty: z.enum(["easy", "moderate", "difficult"]).optional(),
  warnings: z.array(z.string()).max(10).optional(),
  tips: z.array(z.string()).max(10).optional(),
});

/**
 * Propagation instructions schema
 * Validates the structure of PlantPropagationInfo.propagationInstructions JSON field
 */
export const PropagationInstructionsSchema = z.object({
  method: z.string(),
  steps: z.array(z.string()).min(1, "At least one step is required"),
  timing: z.string().optional(),
  success_rate: z.string().optional(),
  time_to_root: z.string().optional(),
  special_requirements: z.array(z.string()).max(10).optional(),
});

// ========================================
// CORE PLANT SCHEMAS
// ========================================

/**
 * Core plant validation schema
 * Enforces array size limits and required fields
 */
export const PlantSchema = z.object({
  id: z.number().int().positive(),
  slug: z.string().min(1).max(255),
  scientificName: z.string().min(1).max(255),
  commonNames: z
    .array(z.string())
    .max(10, "Maximum 10 common names allowed")
    .default([]),
  family: z.string().max(255).nullable(),
  genus: z.string().max(255).nullable(),
  species: z.string().max(255).nullable(),
  cultivar: z.string().max(255).nullable(),
  variety: z.string().max(255).nullable(),

  // Basic plant information
  description: z.string().nullable(),
  origin: z.string().nullable(),
  distribution: z.string().nullable(),

  // Essential environmental requirements (denormalized for performance)
  lightRequirements: z
    .array(z.string())
    .max(5, "Maximum 5 light requirements allowed")
    .default([]),
  waterNeeds: z
    .array(z.string())
    .max(5, "Maximum 5 water needs allowed")
    .default([]),
  soilTypes: z
    .array(z.string())
    .max(8, "Maximum 8 soil types allowed")
    .default([]),
  hardinessZones: z
    .array(z.string())
    .max(10, "Maximum 10 hardiness zones allowed")
    .default([]),

  // Media
  profileVideo: z.string().url().nullable(),
  soundFile: z.string().url().nullable(),

  // AI and data quality
  dataCompleteness: z.number().min(0).max(1).default(0.0),
  lastAiUpdate: z.date().nullable(),
  aiConfidence: z.number().min(0).max(1).nullable(),

  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Physical traits validation schema
 */
export const PlantPhysicalTraitsSchema = z.object({
  id: z.number().int().positive(),
  plantId: z.number().int().positive(),

  // Size information (in cm)
  heightMin: z.number().int().positive().nullable(),
  heightMax: z.number().int().positive().nullable(),
  widthMin: z.number().int().positive().nullable(),
  widthMax: z.number().int().positive().nullable(),

  // Growth characteristics
  growthRate: z.enum(["slow", "moderate", "fast"]).nullable(),
  lifeSpan: z.enum(["annual", "perennial", "biennial"]).nullable(),
  habit: z
    .enum(["upright", "spreading", "climbing", "prostrate"])
    .nullable(),

  // Plant structure
  stemType: z.enum(["woody", "herbaceous", "succulent"]).nullable(),
  rootType: z.enum(["taproot", "fibrous", "shallow"]).nullable(),

  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Environmental requirements validation schema
 */
export const PlantEnvironmentalRequirementsSchema = z.object({
  id: z.number().int().positive(),
  plantId: z.number().int().positive(),

  // Soil requirements
  soilPh: z.array(z.number().min(0).max(14)).max(2).default([]), // pH range [min, max]
  soilDrainage: z
    .array(z.enum(["well_drained", "poorly_drained", "moderately_drained"]))
    .max(3)
    .default([]),
  soilFertility: z.enum(["low", "moderate", "high"]).nullable(),

  // Temperature requirements (Celsius)
  temperatureMin: z.number().nullable(),
  temperatureMax: z.number().nullable(),
  frostTolerance: z
    .enum(["none", "light", "moderate", "heavy"])
    .nullable(),

  // Humidity requirements (Percentage)
  humidityMin: z.number().min(0).max(100).nullable(),
  humidityMax: z.number().min(0).max(100).nullable(),
  humidityPreference: z.enum(["low", "moderate", "high"]).nullable(),

  // Wind and exposure
  windTolerance: z.enum(["low", "moderate", "high"]).nullable(),
  saltTolerance: z.enum(["none", "low", "moderate", "high"]).nullable(),

  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Plant characteristics validation schema
 * Includes extensive array size limits
 */
export const PlantCharacteristicsSchema = z.object({
  id: z.number().int().positive(),
  plantId: z.number().int().positive(),

  // Flower characteristics
  flowerColor: z
    .array(z.string())
    .max(10, "Maximum 10 flower colors allowed")
    .default([]),
  flowerSize: z.enum(["small", "medium", "large"]).nullable(),
  flowerShape: z.string().nullable(),
  bloomTime: z
    .array(z.enum(["spring", "summer", "fall", "winter"]))
    .max(4, "Maximum 4 bloom times allowed")
    .default([]),
  bloomDuration: z
    .enum(["brief", "extended", "continuous"])
    .nullable(),
  fragrance: z
    .enum(["none", "mild", "strong", "sweet", "spicy"])
    .nullable(),

  // Foliage characteristics
  foliageColor: z
    .array(z.string())
    .max(10, "Maximum 10 foliage colors allowed")
    .default([]),
  foliageTexture: z
    .enum(["smooth", "rough", "hairy", "waxy"])
    .nullable(),
  foliageShape: z
    .enum(["ovate", "lanceolate", "round", "needle"])
    .nullable(),
  foliageSize: z.enum(["small", "medium", "large"]).nullable(),
  evergreen: z.boolean().nullable(),
  deciduous: z.boolean().nullable(),

  // Fruit/seed characteristics
  fruitColor: z
    .array(z.string())
    .max(8, "Maximum 8 fruit colors allowed")
    .default([]),
  fruitSize: z.string().nullable(),
  fruitEdible: z.boolean().nullable(),
  seedSize: z.enum(["small", "medium", "large"]).nullable(),

  // Wildlife interactions
  attractsBirds: z.boolean().nullable(),
  attractsBees: z.boolean().nullable(),
  attractsButterflies: z.boolean().nullable(),
  attractsHummingbirds: z.boolean().nullable(),

  // Resistance characteristics
  deerResistant: z.boolean().nullable(),
  rabbitResistant: z.boolean().nullable(),
  droughtResistant: z.boolean().nullable(),
  diseaseResistant: z
    .array(z.string())
    .max(20, "Maximum 20 disease resistances allowed")
    .default([]),

  // Aesthetic characteristics
  aestheticStyle: z
    .array(z.string())
    .max(5, "Maximum 5 aesthetic styles allowed")
    .default([]),
  colorScheme: z
    .array(z.string())
    .max(3, "Maximum 3 color schemes allowed")
    .default([]),
  primaryColors: z
    .array(z.string())
    .max(5, "Maximum 5 primary colors allowed")
    .default([]),
  textureProfile: z
    .array(z.string())
    .max(5, "Maximum 5 texture profiles allowed")
    .default([]),
  sizeCategory: z
    .enum(["statement", "filler", "trailing", "upright"])
    .nullable(),
  seasonalInterest: z
    .array(z.string())
    .max(8, "Maximum 8 seasonal interests allowed")
    .default([]),

  // Toxicity information
  toxicToHumans: z.enum(["none", "mild", "moderate", "severe"]).nullable(),
  toxicToPets: z.enum(["none", "mild", "moderate", "severe"]).nullable(),
  toxicParts: z
    .array(z.string())
    .max(8, "Maximum 8 toxic parts allowed")
    .default([]),
  toxicityNotes: z.string().nullable(),

  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Care instructions validation schema
 */
export const PlantCareInstructionsSchema = z.object({
  id: z.number().int().positive(),
  plantId: z.number().int().positive(),

  // Watering instructions
  wateringFrequency: z
    .enum(["daily", "weekly", "biweekly", "monthly"])
    .nullable(),
  wateringAmount: z.enum(["light", "moderate", "heavy"]).nullable(),
  wateringMethod: z
    .enum(["overhead", "soil_level", "drip"])
    .nullable(),
  winterWatering: z.enum(["reduce", "stop", "same"]).nullable(),

  // Fertilizing instructions
  fertilizingFrequency: z
    .enum(["monthly", "seasonal", "yearly"])
    .nullable(),
  fertilizerType: z
    .enum(["balanced", "high_nitrogen", "high_phosphorus"])
    .nullable(),
  fertilizingSeason: z
    .enum(["spring", "summer", "fall", "all_year"])
    .nullable(),

  // Pruning instructions
  pruningTime: z
    .enum(["late_winter", "spring", "summer", "fall"])
    .nullable(),
  pruningType: z
    .enum(["light", "moderate", "heavy", "deadhead"])
    .nullable(),
  pruningNotes: z.string().nullable(),

  // Repotting/transplanting
  repottingFrequency: z
    .enum(["yearly", "biyearly", "when_needed"])
    .nullable(),
  transplantingTime: z
    .enum(["spring", "fall", "dormant_season"])
    .nullable(),

  // Special care requirements
  specialCare: z.string().nullable(),
  careNotes: z.string().nullable(),

  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Propagation info validation schema
 */
export const PlantPropagationInfoSchema = z.object({
  id: z.number().int().positive(),
  plantId: z.number().int().positive(),

  // Propagation methods
  propagationMethods: z
    .array(z.enum(["seeds", "cuttings", "division", "layering"]))
    .max(4)
    .default([]),
  propagationDifficulty: z.enum(["easy", "moderate", "difficult"]).nullable(),

  // Seed information
  seedGerminationTime: z
    .enum(["1_2_weeks", "2_4_weeks", "1_2_months"])
    .nullable(),
  seedDepth: z.enum(["surface", "shallow", "deep"]).nullable(),
  seedSpacing: z.enum(["close", "moderate", "wide"]).nullable(),
  seedStratification: z.boolean().nullable(),

  // Cutting information
  cuttingType: z
    .enum(["softwood", "hardwood", "semi_hardwood", "root"])
    .nullable(),
  cuttingTime: z
    .enum(["spring", "summer", "fall", "winter"])
    .nullable(),
  rootingHormone: z.boolean().nullable(),

  // Division information
  divisionTime: z.enum(["spring", "fall"]).nullable(),
  divisionFrequency: z
    .enum(["yearly", "biyearly", "when_needed"])
    .nullable(),

  // Propagation instructions
  propagationInstructions: PropagationInstructionsSchema.nullable(),

  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ========================================
// RELATIONSHIP SCHEMAS
// ========================================

/**
 * Plant image validation schema
 */
export const PlantImageSchema = z.object({
  id: z.number().int().positive(),
  plantId: z.number().int().positive(),
  url: z.string().url(),
  altText: z.string().nullable(),
  caption: z.string().nullable(),
  attribution: z.string().nullable(),
  isPrimary: z.boolean().default(false),
  sortOrder: z.number().int().default(0),

  // Image metadata
  imageType: z
    .enum(["flower", "foliage", "fruit", "seed", "bark", "root"])
    .nullable(),
  season: z.enum(["spring", "summer", "fall", "winter"]).nullable(),
  healthStatus: z
    .enum(["healthy", "diseased", "pest_damage"])
    .nullable(),
});

/**
 * Plant similarity validation schema
 */
export const PlantSimilaritySchema = z.object({
  id: z.number().int().positive(),
  plantId: z.number().int().positive(),
  similarPlantId: z.number().int().positive(),
  similarityScore: z.number().min(0).max(1).default(0.0),
  similarityType: z.enum(["visual", "care", "habitat"]),
});

/**
 * Plant symbiosis validation schema
 */
export const PlantSymbiosisSchema = z.object({
  id: z.number().int().positive(),
  plantId: z.number().int().positive(),
  symbioticPlantId: z.number().int().positive(),

  // Relationship details
  relationshipType: SymbiosisTypeSchema,
  benefitToPlant: z.string().min(1),
  benefitToSymbiotic: z.string().min(1),
  distance: z.number().int().positive().nullable(), // cm
  notes: z.string().nullable(),

  // Scientific backing
  researchSource: z.string().nullable(),
  confidence: z.number().min(0).max(1).default(0.0),

  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Plant aesthetic pairing validation schema
 */
export const PlantAestheticPairingSchema = z.object({
  id: z.number().int().positive(),
  plantId: z.number().int().positive(),
  companionPlantId: z.number().int().positive(),

  // V1 ESSENTIALS
  pairingType: z.enum([
    "color_harmony",
    "texture_contrast",
    "size_complement",
  ]),
  aestheticReason: z.string().min(1),
  containerSuitable: z.boolean().default(false),
  confidence: z.number().min(0).max(1).default(0.0),

  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ========================================
// AI/FEATURE SCHEMAS
// ========================================

/**
 * Plant health issue validation schema
 */
export const PlantHealthIssueSchema = z.object({
  id: z.string().uuid(),
  plantId: z.number().int().positive(),

  // Issue identification
  issueType: HealthIssueTypeSchema,
  issueName: z.string().min(1),
  severity: IssueSeveritySchema.default("MILD"),

  // Symptoms and diagnosis
  symptoms: z
    .array(z.string())
    .max(20, "Maximum 20 symptoms allowed")
    .default([]),
  description: z.string().nullable(),
  causes: z
    .array(z.string())
    .max(15, "Maximum 15 causes allowed")
    .default([]),

  // Treatment and prevention
  prevention: z
    .array(z.string())
    .max(20, "Maximum 20 prevention methods allowed")
    .default([]),
  treatment: z
    .array(z.string())
    .max(25, "Maximum 25 treatment options allowed")
    .default([]),
  organicTreatment: z
    .array(z.string())
    .max(15, "Maximum 15 organic treatments allowed")
    .default([]),
  chemicalTreatment: z
    .array(z.string())
    .max(15, "Maximum 15 chemical treatments allowed")
    .default([]),

  // Visual identification
  visualCues: HealthIssueVisualCuesSchema.nullable(),

  // AI confidence and sources
  aiConfidence: z.number().min(0).max(1).nullable(),
  researchSource: z.string().nullable(),

  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Plant care task validation schema
 */
export const PlantCareTaskSchema = z.object({
  id: z.number().int().positive(),
  plantId: z.number().int().positive(),

  // Task details
  taskType: CareLogTypeSchema,
  title: z.string().min(1),
  description: z.string().nullable(),
  priority: TaskPrioritySchema.default("MEDIUM"),

  // Automated scheduling
  frequency: z.enum(["daily", "weekly", "monthly", "seasonal"]),
  season: z.enum(["spring", "summer", "fall", "winter"]).nullable(),
  conditions: z.record(z.unknown()).nullable(),

  // Task instructions
  instructions: CareTaskInstructionsSchema,

  // AI-generated task
  aiGenerated: z.boolean().default(false),
  aiConfidence: z.number().min(0).max(1).nullable(),

  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Plant embedding validation schema
 */
export const PlantEmbeddingSchema = z.object({
  id: z.string().uuid(),
  plantId: z.number().int().positive(),

  // Embedding data
  content: z.string().min(1),
  embedding: z.unknown(), // pgvector type

  // Metadata
  model: z.string().min(1),
  createdAt: z.date(),
});

// ========================================
// INPUT SCHEMAS FOR API OPERATIONS
// ========================================

/**
 * Create plant input schema
 */
export const CreatePlantInputSchema = PlantSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial({
  commonNames: true,
  lightRequirements: true,
  waterNeeds: true,
  soilTypes: true,
  hardinessZones: true,
  dataCompleteness: true,
});

/**
 * Update plant input schema
 */
export const UpdatePlantInputSchema = CreatePlantInputSchema.partial();

/**
 * Plant search filters schema
 */
export const PlantSearchFiltersSchema = z.object({
  // Text search
  query: z.string().optional(),

  // Array filters
  lightRequirements: z.array(z.string()).max(5).optional(),
  waterNeeds: z.array(z.string()).max(5).optional(),
  soilTypes: z.array(z.string()).max(8).optional(),
  hardinessZones: z.array(z.string()).max(10).optional(),

  // Characteristic filters
  attractsBees: z.boolean().optional(),
  attractsButterflies: z.boolean().optional(),
  deerResistant: z.boolean().optional(),
  droughtResistant: z.boolean().optional(),

  // Size filters
  heightMin: z.number().int().positive().optional(),
  heightMax: z.number().int().positive().optional(),

  // Toxicity filters
  toxicToPets: z.enum(["none", "mild", "moderate", "severe"]).optional(),

  // Pagination
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),

  // Sorting
  sortBy: z
    .enum([
      "scientificName",
      "commonName",
      "dataCompleteness",
      "createdAt",
    ])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});


import { db } from "@/lib/db";
import { plantFullData } from "@/lib/db/migrations/schema";
import { and, ilike, or, sql, SQL } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

// Validation schemas for entities
const EntityValidation = {
  light_level: z
    .enum([
      "Dappled Sunlight (Shade through upper canopy all day)",
      "Deep shade (Less than 2 hours to no direct sunlight)",
      "Full Sun (6 or more hours of direct sunlight a day)",
      "Partial Shade (2-6 hours of direct sunlight)",
    ])
    .optional(),
  soil_texture: z
    .enum([
      "Clay",
      "Loam (Silt)",
      "Sand",
      "High Organic Matter",
      "Shallow Rocky",
    ])
    .optional(),
  soil_ph_value: z
    .enum(["Acid (<6.0)", "Neutral (6.0-8.0)", "Alkaline (>8.0)"])
    .optional(),
  soil_drainage_type: z
    .enum([
      "Frequent Standing Water",
      "Good Drainage",
      "Moist",
      "Occasional Flooding",
      "Occasionally Dry",
      "Occasionally Wet",
      "Very Dry",
    ])
    .optional(),
  space_requirement: z
    .enum([
      "Less than 12 inches",
      "12 inches-3 feet",
      "3 feet-6 feet",
      "6 feet-12 feet",
      "12-24 feet",
      "24-60 feet",
      "more than 60 feet",
    ])
    .optional(),
  region: z.enum(["Coastal", "Mountains", "Piedmont"]).optional(),
  usda_zone: z
    .enum([
      "1a",
      "1b",
      "2a",
      "2b",
      "3a",
      "3b",
      "4a",
      "4b",
      "5a",
      "5b",
      "6a",
      "6b",
      "7a",
      "7b",
      "8a",
      "8b",
      "9a",
      "9b",
      "10a",
      "10b",
      "11a",
      "11b",
      "12a",
      "12b",
      "13a",
      "13b",
    ])
    .optional(),
  plant: z.string().min(2).optional(),
  design_feature: z
    .enum([
      "Accent",
      "Barrier",
      "Border",
      "Flowering Tree",
      "Foundation Planting",
      "Hedge",
      "Mass Planting",
      "Screen/Privacy",
      "Security",
      "Shade Tree",
      "Small groups",
      "Small Tree",
      "Specimen",
      "Street Tree",
      "Understory Tree",
    ])
    .optional(),
  problems: z
    .enum([
      "Allelopathic",
      "Contact Dermatitis",
      "Frequent Disease Problems",
      "Frequent Insect Problems",
      "Invasive Species",
      "Malodorous",
      "Messy",
      "Poisonous to Humans",
      "Problem for Cats",
      "Problem for Children",
      "Problem for Dogs",
      "Problem for Horses",
      "Short-lived",
      "Spines/Thorns",
      "Weak Wood",
      "Weedy",
    ])
    .optional(),
};

// Type for query filters
type QueryFilter = {
  intent: string;
  entities: Record<string, string>;
};

// Type for Drizzle query result
// Using unknown instead of any to be more type-safe while still allowing the build to pass
type DrizzleQuery = unknown;

// Type definitions for intent handlers
type IntentHandler = {
  buildConditions: (entities: Record<string, string>) => {
    conditions: (SQL<unknown> | undefined)[];
  };
  buildQuery: (entities: Record<string, string>) => {
    query: DrizzleQuery;
  };
};

// Helper function to validate entities
const validateEntities = <T>(
  entities: Record<string, string>,
  validationSchema: z.ZodType<T>
): T => {
  try {
    return validationSchema.parse(entities);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      throw new Error(JSON.stringify({ type: "validation", issues }));
    }
    throw error;
  }
};

// Helper function to build plant name conditions
const buildPlantNameConditions = (plant: string) => {
  if (plant.length < 2) {
    throw new Error("Plant name must be at least 2 characters long");
  }
  return or(
    ilike(plantFullData.scientificName, `%${plant}%`),
    sql`${plantFullData.commonNames}::text ILIKE ${`%${plant}%`}`
  );
};

// Helper function to build JSONB array contains condition
const buildJsonbArrayContains = (column: unknown, value: string) => {
  return sql`${column} @> jsonb_build_array(${value}::text)`;
};

// Helper function to create a basic query structure
const createBaseQuery = (selectedFields: Record<string, unknown>) => {
  return db
    .select({
      scientific_name: plantFullData.scientificName,
      common_name: sql`${plantFullData.commonNames}[1]`,
      slug: plantFullData.slug,
      first_tag: sql`${plantFullData.tags}->0`,
      first_image: sql`(${plantFullData.images}->0->>'img')`,
      first_image_alt_text: sql`(${plantFullData.images}->0->>'alt_text')`,
      ...selectedFields,
      description: plantFullData.description,
    })
    .from(plantFullData)
    .limit(6);
};

// Helper function to combine multiple filters
const combineFilters = (filters: QueryFilter[]) => {
  const query = createBaseQuery({});
  const allConditions = [];

  for (const filter of filters) {
    const mapping = intentMap[filter.intent as keyof typeof intentMap];
    if (!mapping) {
      console.warn(`Unsupported intent: ${filter.intent}`);
      continue; // Skip this filter instead of throwing an error
    }

    try {
      const { conditions } = mapping.buildConditions(filter.entities);
      if (conditions.length > 0) {
        // Filter out undefined conditions
        const validConditions = conditions.filter(Boolean);
        if (validConditions.length > 0) {
          allConditions.push(and(...validConditions));
        }
      }
    } catch (error) {
      console.warn(`Error processing filter ${filter.intent}:`, error);
      // Continue with other filters
    }
  }

  if (allConditions.length > 0) {
    query.where(or(...allConditions));
  }

  return query;
};

// Map intents to database columns and query builders
const intentMap: Record<string, IntentHandler> = {
  // Cultural Conditions
  light_requirements: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validatedEntities = validateEntities(
        entities,
        z.object({
          light_level: EntityValidation.light_level,
          plant: EntityValidation.plant,
        })
      );

      if (validatedEntities.light_level) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.lightRequirements,
            validatedEntities.light_level
          )
        );
      }

      if (validatedEntities.plant) {
        conditions.push(buildPlantNameConditions(validatedEntities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        light_requirements: plantFullData.lightRequirements,
      });

      const { conditions } =
        intentMap.light_requirements.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  soil_texture: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validTextures = [
        "Clay",
        "Loam (Silt)",
        "Sand",
        "High Organic Matter",
        "Shallow Rocky",
      ] as const;

      const validatedEntities = validateEntities(
        entities,
        z.object({
          soil_texture: z.enum(validTextures).optional(),
          plant: EntityValidation.plant,
        })
      );

      if (validatedEntities.soil_texture) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.soilTexture,
            validatedEntities.soil_texture
          )
        );
      }

      if (validatedEntities.plant) {
        conditions.push(buildPlantNameConditions(validatedEntities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        soil_texture: plantFullData.soilTexture,
      });

      const { conditions } = intentMap.soil_texture.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  soil_ph: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validPh = [
        "Acid (<6.0)",
        "Neutral (6.0-8.0)",
        "Alkaline (>8.0)",
      ] as const;

      const validatedEntities = validateEntities(
        entities,
        z.object({
          soil_ph_value: z.enum(validPh).optional(),
          plant: EntityValidation.plant,
        })
      );

      if (validatedEntities.soil_ph_value) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.soilPh,
            validatedEntities.soil_ph_value
          )
        );
      }

      if (validatedEntities.plant) {
        conditions.push(buildPlantNameConditions(validatedEntities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        soil_ph: plantFullData.soilPh,
      });

      const { conditions } = intentMap.soil_ph.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  soil_drainage: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validDrainage = [
        "Frequent Standing Water",
        "Good Drainage",
        "Moist",
        "Occasional Flooding",
        "Occasionally Dry",
        "Occasionally Wet",
        "Very Dry",
      ];

      if (
        entities.soil_drainage_type &&
        validDrainage.includes(entities.soil_drainage_type)
      ) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.soilDrainage,
            entities.soil_drainage_type
          )
        );
      }

      if (entities.plant) {
        conditions.push(buildPlantNameConditions(entities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        soil_drainage: plantFullData.soilDrainage,
      });

      const { conditions } = intentMap.soil_drainage.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  available_space: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validSpaces = [
        "Less than 12 inches",
        "12 inches-3 feet",
        "3 feet-6 feet",
        "6 feet-12 feet",
        "12-24 feet",
        "24-60 feet",
        "more than 60 feet",
      ] as const;

      const validatedEntities = validateEntities(
        entities,
        z.object({
          space_requirement: z.enum(validSpaces).optional(),
          plant: EntityValidation.plant,
        })
      );

      if (validatedEntities.space_requirement) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.availableSpaceToPlant,
            validatedEntities.space_requirement
          )
        );
      }

      if (validatedEntities.plant) {
        conditions.push(buildPlantNameConditions(validatedEntities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        available_space: plantFullData.availableSpaceToPlant,
      });

      const { conditions } =
        intentMap.available_space.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  nc_regions: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validRegions = ["Coastal", "Mountains", "Piedmont"] as const;

      const validatedEntities = validateEntities(
        entities,
        z.object({
          region: z.enum(validRegions).optional(),
          plant: EntityValidation.plant,
        })
      );

      if (validatedEntities.region) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.ncRegions,
            validatedEntities.region
          )
        );
      }

      if (validatedEntities.plant) {
        conditions.push(buildPlantNameConditions(validatedEntities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        nc_regions: plantFullData.ncRegions,
      });

      const { conditions } = intentMap.nc_regions.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  usda_zones: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validZones = [
        "1a",
        "1b",
        "2a",
        "2b",
        "3a",
        "3b",
        "4a",
        "4b",
        "5a",
        "5b",
        "6a",
        "6b",
        "7a",
        "7b",
        "8a",
        "8b",
        "9a",
        "9b",
        "10a",
        "10b",
        "11a",
        "11b",
        "12a",
        "12b",
        "13a",
        "13b",
      ] as const;

      const validatedEntities = validateEntities(
        entities,
        z.object({
          usda_zone: z.enum(validZones).optional(),
          plant: EntityValidation.plant,
        })
      );

      if (validatedEntities.usda_zone) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.usdaZones,
            validatedEntities.usda_zone
          )
        );
      }

      if (validatedEntities.plant) {
        conditions.push(buildPlantNameConditions(validatedEntities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        usda_zones: plantFullData.usdaZones,
      });

      const { conditions } = intentMap.usda_zones.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  // Landscape
  landscape_location: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validLocations = [
        "Coastal",
        "Container",
        "Hanging Baskets",
        "Houseplants",
        "Lawn",
        "Meadow",
        "Naturalized Area",
        "Near Septic",
        "Patio",
        "Pond",
        "Pool/Hardscape",
        "Recreational Play Area",
        "Riparian",
        "Rock Wall",
        "Slope/Bank",
        "Small Space",
        "Vertical Spaces",
        "Walkways",
        "Woodland",
      ] as const;

      const validatedEntities = validateEntities(
        entities,
        z.object({
          location_type: z.enum(validLocations).optional(),
          plant: EntityValidation.plant,
        })
      );

      if (validatedEntities.location_type) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.landscapeLocation,
            validatedEntities.location_type
          )
        );
      }

      if (validatedEntities.plant) {
        conditions.push(buildPlantNameConditions(validatedEntities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        landscape_location: plantFullData.landscapeLocation,
      });

      const { conditions } =
        intentMap.landscape_location.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  landscape_theme: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validThemes = [
        "Asian Garden",
        "Butterfly Garden",
        "Children's Garden",
        "Cottage Garden",
        "Cutting Garden",
        "Drought Tolerant Garden",
        "Edible Garden",
        "English Garden",
        "Fairy Garden",
        "Garden for the Blind",
        "Native Garden",
        "Nighttime Garden",
        "Pollinator Garden",
        "Rain Garden",
        "Rock Garden",
        "Shade Garden",
        "Water Garden",
        "Winter Garden",
      ] as const;

      const validatedEntities = validateEntities(
        entities,
        z.object({
          theme_type: z.enum(validThemes).optional(),
          plant: EntityValidation.plant,
        })
      );

      if (validatedEntities.theme_type) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.landscapeTheme,
            validatedEntities.theme_type
          )
        );
      }

      if (validatedEntities.plant) {
        conditions.push(buildPlantNameConditions(validatedEntities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        landscape_theme: plantFullData.landscapeTheme,
      });

      const { conditions } =
        intentMap.landscape_theme.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  // Wildlife and Resistance
  attracts: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validWildlife = [
        "Bats",
        "Bees",
        "Butterflies",
        "Frogs",
        "Hummingbirds",
        "Moths",
        "Pollinators",
        "Predatory Insects",
        "Reptiles",
        "Small Mammals",
        "Songbirds",
        "Specialized Bees",
      ] as const;

      const validatedEntities = validateEntities(
        entities,
        z.object({
          wildlife_type: z.enum(validWildlife).optional(),
          plant: EntityValidation.plant,
        })
      );

      if (validatedEntities.wildlife_type) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.attracts,
            validatedEntities.wildlife_type
          )
        );
      }

      if (validatedEntities.plant) {
        conditions.push(buildPlantNameConditions(validatedEntities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        attracts: plantFullData.attracts,
        wildlife_value: plantFullData.wildlifeValue,
      });

      const { conditions } = intentMap.attracts.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  resistance_to_challenges: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validChallenges = [
        "Black Walnut",
        "Compaction",
        "Deer",
        "Diseases",
        "Drought",
        "Dry Soil",
        "Erosion",
        "Fire",
        "Foot Traffic",
        "Heat",
        "Heavy Shade",
        "Humidity",
        "Insect Pests",
        "Pollution",
        "Poor Soil",
        "Rabbits",
        "Salt",
        "Slugs",
        "Squirrels",
        "Storm Damage",
        "Urban Conditions",
        "Voles",
        "Wet Soil",
        "Wind",
      ] as const;

      const validatedEntities = validateEntities(
        entities,
        z.object({
          challenge_type: z.enum(validChallenges).optional(),
          plant: EntityValidation.plant,
        })
      );

      if (validatedEntities.challenge_type) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.resistanceToChallenges,
            validatedEntities.challenge_type
          )
        );
      }

      if (validatedEntities.plant) {
        conditions.push(buildPlantNameConditions(validatedEntities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        resistance_to_challenges: plantFullData.resistanceToChallenges,
      });

      const { conditions } =
        intentMap.resistance_to_challenges.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  problems: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validProblems = EntityValidation.problems;

      const validatedEntities = validateEntities(
        entities,
        z.object({
          problem_type: validProblems,
          plant: EntityValidation.plant,
        })
      );

      if (validatedEntities.problem_type) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.problems,
            validatedEntities.problem_type
          )
        );
      }

      if (validatedEntities.plant) {
        conditions.push(buildPlantNameConditions(validatedEntities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        problems: plantFullData.problems,
      });

      const { conditions } = intentMap.problems.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  // Whole Plant Traits
  plant_type: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validPlantTypes = [
        "Annual",
        "Bulb",
        "Carnivorous",
        "Cool Season Vegetable",
        "Edible",
        "Epiphyte",
        "Fern",
        "Grass",
        "Ground Cover",
        "Herb",
        "Herbaceous Perennial",
        "Houseplant",
        "Mushroom",
        "Native Plant",
        "Ornamental Grasses and Sedges",
        "Perennial",
        "Poisonous",
        "Rose",
        "Shrub",
        "Succulent",
        "Tree",
        "Turfgrass",
        "Vegetable",
        "Vine",
        "Warm Season Vegetable",
        "Water Plant",
        "Weed",
        "Wildflower",
      ] as const;

      const validatedEntities = validateEntities(
        entities,
        z.object({
          type: z.enum(validPlantTypes).optional(),
          plant: EntityValidation.plant,
        })
      );

      if (validatedEntities.type) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.plantTypes,
            validatedEntities.type
          )
        );
      }

      if (validatedEntities.plant) {
        conditions.push(buildPlantNameConditions(validatedEntities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        plant_types: plantFullData.plantTypes,
      });

      const { conditions } = intentMap.plant_type.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  woody_plant_leaf_characteristics: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validCharacteristics = [
        "Broadleaf Evergreen",
        "Deciduous",
        "Needled Evergreen",
        "Semi-evergreen",
      ];

      if (
        entities.leaf_type &&
        validCharacteristics.includes(entities.leaf_type)
      ) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.leafCharacteristics,
            entities.leaf_type
          )
        );
      }

      if (entities.plant) {
        conditions.push(buildPlantNameConditions(entities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        leaf_characteristics: plantFullData.leafCharacteristics,
      });

      const { conditions } =
        intentMap.woody_plant_leaf_characteristics.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  habit_form: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validHabits = [
        "Arching",
        "Ascending",
        "Broad",
        "Cascading",
        "Climbing",
        "Clumping",
        "Columnar",
        "Conical",
        "Creeping",
        "Dense",
        "Erect",
        "Horizontal",
        "Irregular",
        "Mounding",
        "Multi-stemmed",
        "Multi-trunked",
        "Open",
        "Oval",
        "Prostrate",
        "Pyramidal",
        "Rounded",
        "Spreading",
        "Vase",
        "Weeping",
      ];

      if (
        entities.growth_habit &&
        validHabits.includes(entities.growth_habit)
      ) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.plantHabit,
            entities.growth_habit
          )
        );
      }

      if (entities.plant) {
        conditions.push(buildPlantNameConditions(entities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        plant_habit: plantFullData.plantHabit,
      });

      const { conditions } = intentMap.habit_form.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  growth_rate: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validRates = ["Slow", "Medium", "Rapid"];

      if (entities.growth_speed && validRates.includes(entities.growth_speed)) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.growthRate,
            entities.growth_speed
          )
        );
      }

      if (entities.plant) {
        conditions.push(buildPlantNameConditions(entities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        growth_rate: plantFullData.growthRate,
      });

      const { conditions } = intentMap.growth_rate.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  maintenance: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validLevels = ["High", "Low", "Medium"];

      if (
        entities.maintenance_level &&
        validLevels.includes(entities.maintenance_level)
      ) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.maintenance,
            entities.maintenance_level
          )
        );
      }

      if (entities.plant) {
        conditions.push(buildPlantNameConditions(entities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        maintenance: plantFullData.maintenance,
      });

      const { conditions } = intentMap.maintenance.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  texture: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validTextures = ["Fine", "Medium", "Coarse"];

      if (
        entities.texture_type &&
        validTextures.includes(entities.texture_type)
      ) {
        conditions.push(
          buildJsonbArrayContains(plantFullData.texture, entities.texture_type)
        );
      }

      if (entities.plant) {
        conditions.push(buildPlantNameConditions(entities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        texture: plantFullData.texture,
      });

      const { conditions } = intentMap.texture.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  // Flowers
  flower_color: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validColors = [
        "Black",
        "Blue",
        "Brown/Copper",
        "Cream/Tan",
        "Gold/Yellow",
        "Gray/Silver",
        "Green",
        "Insignificant",
        "Orange",
        "Pink",
        "Purple/Lavender",
        "Red/Burgundy",
        "Variegated",
        "White",
      ];

      if (
        entities.flower_color &&
        validColors.includes(entities.flower_color)
      ) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.flowerColors,
            entities.flower_color
          )
        );
      }

      if (entities.plant) {
        conditions.push(buildPlantNameConditions(entities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        flower_colors: plantFullData.flowerColors,
      });

      const { conditions } = intentMap.flower_color.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  flower_value_to_gardener: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validValues = [
        "Edible",
        "Fragrant",
        "Good Cut",
        "Good Dried",
        "Long Bloom Season",
        "Long-lasting",
        "Showy",
      ] as const;

      const validatedEntities = validateEntities(
        entities,
        z.object({
          flower_value: z.enum(validValues).optional(),
          plant: EntityValidation.plant,
        })
      );

      if (validatedEntities.flower_value) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.flowerValueToGardener,
            validatedEntities.flower_value
          )
        );
      }

      if (validatedEntities.plant) {
        conditions.push(buildPlantNameConditions(validatedEntities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        flower_value_to_gardener: plantFullData.flowerValueToGardener,
      });

      const { conditions } =
        intentMap.flower_value_to_gardener.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  flower_bloom_time: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validSeasons = ["Fall", "Spring", "Summer", "Winter"];

      if (
        entities.bloom_season &&
        validSeasons.includes(entities.bloom_season)
      ) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.flowerBloomTime,
            entities.bloom_season
          )
        );
      }

      if (entities.plant) {
        conditions.push(buildPlantNameConditions(entities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        flower_bloom_time: plantFullData.flowerBloomTime,
      });

      const { conditions } =
        intentMap.flower_bloom_time.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  // Leaves
  leaf_color: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validColors = [
        "Black",
        "Blue",
        "Brown/Copper",
        "Cream/Tan",
        "Gold/Yellow",
        "Gray/Silver",
        "Green",
        "Insignificant",
        "Orange",
        "Pink",
        "Purple/Lavender",
        "Red/Burgundy",
        "Variegated",
        "White",
      ];

      if (entities.leaf_color && validColors.includes(entities.leaf_color)) {
        conditions.push(
          buildJsonbArrayContains(plantFullData.leafColor, entities.leaf_color)
        );
      }

      if (entities.plant) {
        conditions.push(buildPlantNameConditions(entities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        leaf_color: plantFullData.leafColor,
      });

      const { conditions } = intentMap.leaf_color.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  leaf_value_to_gardener: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validValues = [
        "Edible",
        "Fragrant",
        "Good Cut",
        "Good Dried",
        "Long-lasting",
        "Showy",
      ] as const;

      const validatedEntities = validateEntities(
        entities,
        z.object({
          leaf_value: z.enum(validValues).optional(),
          plant: EntityValidation.plant,
        })
      );

      if (validatedEntities.leaf_value) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.leafValueToGardener,
            validatedEntities.leaf_value
          )
        );
      }

      if (validatedEntities.plant) {
        conditions.push(buildPlantNameConditions(validatedEntities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        leaf_value_to_gardener: plantFullData.leafValueToGardener,
      });

      const { conditions } =
        intentMap.leaf_value_to_gardener.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  deciduous_leaf_fall_color: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validColors = [
        "Brown/Copper",
        "Cream/Tan",
        "Gold/Yellow",
        "Gray/Silver",
        "Insignificant",
        "Orange",
        "Pink",
        "Purple/Lavender",
        "Red/Burgundy",
      ] as const;

      const validatedEntities = validateEntities(
        entities,
        z.object({
          fall_color: z.enum(validColors).optional(),
          plant: EntityValidation.plant,
        })
      );

      if (validatedEntities.fall_color) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.leafFallColor,
            validatedEntities.fall_color
          )
        );
      }

      if (validatedEntities.plant) {
        conditions.push(buildPlantNameConditions(validatedEntities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        leaf_fall_color: plantFullData.leafFallColor,
      });

      const { conditions } =
        intentMap.deciduous_leaf_fall_color.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  // General
  general_description: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];

      if (entities.plant) {
        conditions.push(buildPlantNameConditions(entities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        description: plantFullData.description,
        origin: plantFullData.origin,
        distribution: plantFullData.distribution,
        uses: plantFullData.uses,
      });

      const conditions = [];

      if (entities.plant) {
        conditions.push(buildPlantNameConditions(entities.plant));
      }

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  unknown: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];

      if (entities.plant) {
        conditions.push(buildPlantNameConditions(entities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        description: plantFullData.description,
      });

      const conditions = [];

      if (entities.plant) {
        conditions.push(buildPlantNameConditions(entities.plant));
      }

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  plant_width: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      type SizeRange = { min: number; max: number | null };
      type SizeRanges = {
        [K in
          | "Less than 12 inches"
          | "12 inches-3 feet"
          | "3 feet-6 feet"
          | "6 feet-12 feet"
          | "12-24 feet"
          | "24-60 feet"
          | "more than 60 feet"]: SizeRange;
      };

      const sizeRanges: SizeRanges = {
        "Less than 12 inches": { min: 0, max: 30 }, // 12 inches = ~30 cm
        "12 inches-3 feet": { min: 30, max: 91 }, // 3 feet = ~91 cm
        "3 feet-6 feet": { min: 91, max: 183 }, // 6 feet = ~183 cm
        "6 feet-12 feet": { min: 183, max: 366 }, // 12 feet = ~366 cm
        "12-24 feet": { min: 366, max: 732 }, // 24 feet = ~732 cm
        "24-60 feet": { min: 732, max: 1829 }, // 60 feet = ~1829 cm
        "more than 60 feet": { min: 1829, max: null }, // > 60 feet
      };

      const validatedEntities = validateEntities(
        entities,
        z.object({
          size: z
            .enum(
              Object.keys(sizeRanges) as [
                keyof SizeRanges,
                ...Array<keyof SizeRanges>
              ]
            )
            .optional(),
          plant: EntityValidation.plant,
        })
      );

      if (validatedEntities.size) {
        const range = sizeRanges[validatedEntities.size as keyof SizeRanges];
        if (range.max === null) {
          // For "more than X" cases
          conditions.push(sql`${plantFullData.widthMax} >= ${range.min}`);
        } else {
          // For range cases, check if the plant's width range overlaps with the requested range
          conditions.push(
            and(
              sql`${plantFullData.widthMin} <= ${range.max}`,
              sql`${plantFullData.widthMax} >= ${range.min}`
            )
          );
        }
      }

      if (validatedEntities.plant) {
        conditions.push(buildPlantNameConditions(validatedEntities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        width_max: plantFullData.widthMax,
        width_min: plantFullData.widthMin,
      });

      const { conditions } = intentMap.plant_width.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  plant_height: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      type HeightRange = { min: number; max: number | null };
      type HeightRanges = {
        [K in
          | "Less than 12 inches"
          | "12 inches-3 feet"
          | "3 feet-6 feet"
          | "6 feet-12 feet"
          | "12-24 feet"
          | "24-60 feet"
          | "more than 60 feet"]: HeightRange;
      };

      const heightRanges: HeightRanges = {
        "Less than 12 inches": { min: 0, max: 30 }, // 12 inches = ~30 cm
        "12 inches-3 feet": { min: 30, max: 91 }, // 3 feet = ~91 cm
        "3 feet-6 feet": { min: 91, max: 183 }, // 6 feet = ~183 cm
        "6 feet-12 feet": { min: 183, max: 366 }, // 12 feet = ~366 cm
        "12-24 feet": { min: 366, max: 732 }, // 24 feet = ~732 cm
        "24-60 feet": { min: 732, max: 1829 }, // 60 feet = ~1829 cm
        "more than 60 feet": { min: 1829, max: null }, // > 60 feet
      };

      const validatedEntities = validateEntities(
        entities,
        z.object({
          height: z
            .enum(
              Object.keys(heightRanges) as [
                keyof HeightRanges,
                ...Array<keyof HeightRanges>
              ]
            )
            .optional(),
          plant: EntityValidation.plant,
        })
      );

      if (validatedEntities.height) {
        const range =
          heightRanges[validatedEntities.height as keyof HeightRanges];
        if (range.max === null) {
          // For "more than X" cases
          conditions.push(sql`${plantFullData.heightMax} >= ${range.min}`);
        } else {
          // For range cases, check if the plant's height range overlaps with the requested range
          conditions.push(
            and(
              sql`${plantFullData.heightMin} <= ${range.max}`,
              sql`${plantFullData.heightMax} >= ${range.min}`
            )
          );
        }
      }

      if (validatedEntities.plant) {
        conditions.push(buildPlantNameConditions(validatedEntities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        height_max: plantFullData.heightMax,
        height_min: plantFullData.heightMin,
      });

      const { conditions } = intentMap.plant_height.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  design_feature: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validFeatures = [
        "Accent",
        "Barrier",
        "Border",
        "Flowering Tree",
        "Foundation Planting",
        "Hedge",
        "Mass Planting",
        "Screen/Privacy",
        "Security",
        "Shade Tree",
        "Small groups",
        "Small Tree",
        "Specimen",
        "Street Tree",
        "Understory Tree",
      ] as const;

      const validatedEntities = validateEntities(
        entities,
        z.object({
          design_feature: z.enum(validFeatures).optional(),
          plant: EntityValidation.plant,
        })
      );

      if (validatedEntities.design_feature) {
        conditions.push(
          buildJsonbArrayContains(
            plantFullData.designFeature,
            validatedEntities.design_feature
          )
        );
      }

      if (validatedEntities.plant) {
        conditions.push(buildPlantNameConditions(validatedEntities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        design_feature: plantFullData.designFeature,
      });

      const { conditions } = intentMap.design_feature.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

  problems_to_exclude: {
    buildConditions: (entities: Record<string, string>) => {
      const conditions = [];
      const validProblems = EntityValidation.problems;

      const validatedEntities = validateEntities(
        entities,
        z.object({
          problem_to_exclude: validProblems,
          plant: EntityValidation.plant,
        })
      );

      if (validatedEntities.problem_to_exclude) {
        // Note: This creates a NOT condition to exclude plants with these problems
        conditions.push(
          sql`NOT ${buildJsonbArrayContains(
            plantFullData.problems,
            validatedEntities.problem_to_exclude
          )}`
        );
      }

      if (validatedEntities.plant) {
        conditions.push(buildPlantNameConditions(validatedEntities.plant));
      }

      return { conditions };
    },
    buildQuery: (entities: Record<string, string>) => {
      const query = createBaseQuery({
        problems: plantFullData.problems,
      });

      const { conditions } =
        intentMap.problems_to_exclude.buildConditions(entities);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      return { query };
    },
  },

};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Handle both formats
    let intents;
    let userGarden;
    
    if (Array.isArray(body)) {
      // Old format - just an array of intents
      intents = body;
    } else {
      // New format - object with intents and userGarden
      intents = body.intents;
      userGarden = body.userGarden;
    }

    // Ensure intents is an array
    if (!intents) {
      console.error("Invalid request format, missing intents:", body);
      return NextResponse.json(
        { error: "Invalid request format. Expected an array of intents." },
        { status: 400 }
      );
    }

    // Convert to array if it's not already
    if (!Array.isArray(intents)) {
      // Check if it's the ParsedQuestion format with intents property
      if (intents.intents && Array.isArray(intents.intents)) {
        intents = intents.intents;
      } else {
        intents = [intents];
      }
    }

    // Validate intents format
    if (!intents.every((filter: unknown) => filter && typeof filter === 'object' && 'intent' in (filter as Record<string, unknown>))) {
      console.error("Invalid filter format:", intents);
      return NextResponse.json(
        { error: "Invalid filter format. Each intent must have an 'intent' property." },
        { status: 400 }
      );
    }

    // Convert intents to QueryFilter format
    const filters: QueryFilter[] = intents.map((intent: Record<string, unknown>) => ({
      intent: intent.intent as string,
      entities: (intent.entities as Record<string, string>) || {},
    }));

    // Add garden-specific filters if available
    if (userGarden) {
      addGardenFilters(filters, userGarden);
    }

    try {
      const query = combineFilters(filters);
      const result = await query;
      const sqlQuery = query.toSQL();

      return NextResponse.json({
        query: "Plant search based on filters",
        params: sqlQuery.params,
        data: result,
      });
    } catch (queryError) {
      console.error("Error executing query:", queryError);
      return NextResponse.json(
        { error: "Failed to execute query", details: String(queryError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: String(error) },
      { status: 500 }
    );
  }
}

// Helper function to add garden-specific filters
function addGardenFilters(filters: QueryFilter[], userGarden: Record<string, unknown>) {
  // Check if we need to add garden-specific filters
  const hasExplicitFilters = new Set(filters.map(f => f.intent));
  
  // Add garden preferences as additional filters, with lower priority
  // For explicit filters, we'll add garden data as supplementary information
  
  // Add region filter
  const ncRegionsIds = userGarden.ncRegionsIds as string[] | undefined;
  if (Array.isArray(ncRegionsIds) && ncRegionsIds.length > 0) {
    if (!hasExplicitFilters.has('nc_regions')) {
      filters.push({
        intent: 'nc_regions',
        entities: { region: ncRegionsIds[0] } // Use the first region as default
      });
    }
    // Store region info for personalization in the response
    filters.forEach(filter => {
      filter.entities.user_region = ncRegionsIds[0];
    });
  }
  
  // Add USDA zone filter
  const usda_zones_ids = userGarden.usda_zones_ids as string[] | undefined;
  if (Array.isArray(usda_zones_ids) && usda_zones_ids.length > 0) {
    if (!hasExplicitFilters.has('usda_zones')) {
      filters.push({
        intent: 'usda_zones',
        entities: { usda_zone: usda_zones_ids[0] } // Use the first zone as default
      });
    }
    // Store zone info for personalization in the response
    filters.forEach(filter => {
      filter.entities.user_zone = usda_zones_ids[0];
    });
  }
  
  // Add light requirements filter
  const sunlightIds = userGarden.sunlightIds as string[] | undefined;
  if (Array.isArray(sunlightIds) && sunlightIds.length > 0) {
    if (!hasExplicitFilters.has('light_requirements')) {
      filters.push({
        intent: 'light_requirements',
        entities: { light_level: sunlightIds[0] } // Use the first sunlight preference
      });
    }
    // Store light info for personalization in the response
    filters.forEach(filter => {
      filter.entities.user_light = sunlightIds[0];
    });
  }
  
  // Add soil texture filter
  const soilTextureIds = userGarden.soilTextureIds as string[] | undefined;
  if (Array.isArray(soilTextureIds) && soilTextureIds.length > 0) {
    if (!hasExplicitFilters.has('soil_texture')) {
      filters.push({
        intent: 'soil_texture',
        entities: { soil_texture: soilTextureIds[0] } // Use the first soil type
      });
    }
    // Store soil info for personalization in the response
    filters.forEach(filter => {
      filter.entities.user_soil = soilTextureIds[0];
    });
  }
  
  // Add soil pH filter
  const soilPhIds = userGarden.soilPhIds as string[] | undefined;
  if (Array.isArray(soilPhIds) && soilPhIds.length > 0) {
    if (!hasExplicitFilters.has('soil_ph')) {
      filters.push({
        intent: 'soil_ph',
        entities: { soil_ph_value: soilPhIds[0] } // Use the first soil pH
      });
    }
    // Store pH info for personalization in the response
    filters.forEach(filter => {
      filter.entities.user_soil_ph = soilPhIds[0];
    });
  }
  
  // Add soil drainage filter
  const soilDrainageIds = userGarden.soilDrainageIds as string[] | undefined;
  if (Array.isArray(soilDrainageIds) && soilDrainageIds.length > 0) {
    if (!hasExplicitFilters.has('soil_drainage')) {
      filters.push({
        intent: 'soil_drainage',
        entities: { soil_drainage_type: soilDrainageIds[0] } // Use the first drainage type
      });
    }
    // Store drainage info for personalization in the response
    filters.forEach(filter => {
      filter.entities.user_drainage = soilDrainageIds[0];
    });
  }
  
  // Add available space filter
  const spaceAvailableIds = userGarden.spaceAvailableIds as string[] | undefined;
  if (Array.isArray(spaceAvailableIds) && spaceAvailableIds.length > 0) {
    if (!hasExplicitFilters.has('available_space')) {
      filters.push({
        intent: 'available_space',
        entities: { space_requirement: spaceAvailableIds[0] } // Use the first space requirement
      });
    }
    // Store space info for personalization in the response
    filters.forEach(filter => {
      filter.entities.user_space = spaceAvailableIds[0];
    });
  }
  
  // Add landscape location filter
  const locationIds = userGarden.locationIds as string[] | undefined;
  if (Array.isArray(locationIds) && locationIds.length > 0) {
    if (!hasExplicitFilters.has('landscape_location')) {
      filters.push({
        intent: 'landscape_location',
        entities: { location_type: locationIds[0] } // Use the first location type
      });
    }
    // Store location info for personalization in the response
    filters.forEach(filter => {
      filter.entities.user_location = locationIds[0];
    });
  }
  
  // Add landscape theme filter
  const gardenThemeIds = userGarden.gardenThemeIds as string[] | undefined;
  if (Array.isArray(gardenThemeIds) && gardenThemeIds.length > 0) {
    if (!hasExplicitFilters.has('landscape_theme')) {
      filters.push({
        intent: 'landscape_theme',
        entities: { theme_type: gardenThemeIds[0] } // Use the first theme
      });
    }
    // Store theme info for personalization in the response
    filters.forEach(filter => {
      filter.entities.user_theme = gardenThemeIds[0];
    });
  }
  
  // Add wildlife attraction filter
  const wildlifeAttractionIds = userGarden.wildlifeAttractionIds as string[] | undefined;
  if (Array.isArray(wildlifeAttractionIds) && wildlifeAttractionIds.length > 0) {
    if (!hasExplicitFilters.has('attracts')) {
      filters.push({
        intent: 'attracts',
        entities: { wildlife_type: wildlifeAttractionIds[0] } // Use the first wildlife type
      });
    }
    // Store wildlife info for personalization in the response
    filters.forEach(filter => {
      filter.entities.user_wildlife = wildlifeAttractionIds[0];
    });
  }
  
  // Add resistance to challenges filter
  const resistanceChallengeIds = userGarden.resistanceChallengeIds as string[] | undefined;
  if (Array.isArray(resistanceChallengeIds) && resistanceChallengeIds.length > 0) {
    if (!hasExplicitFilters.has('resistance_to_challenges')) {
      filters.push({
        intent: 'resistance_to_challenges',
        entities: { challenge_type: resistanceChallengeIds[0] } // Use the first challenge type
      });
    }
    // Store challenge info for personalization in the response
    filters.forEach(filter => {
      filter.entities.user_challenge = resistanceChallengeIds[0];
    });
  }
  
  // Add problems filter
  const problemsToExcludeIds = userGarden.problemsToExcludeIds as string[] | undefined;
  if (Array.isArray(problemsToExcludeIds) && problemsToExcludeIds.length > 0) {
    if (!hasExplicitFilters.has('problems')) {
      filters.push({
        intent: 'problems',
        entities: { problem_type: problemsToExcludeIds[0] } // Use the first problem type
      });
    }
    // Store problem info for personalization in the response
    filters.forEach(filter => {
      filter.entities.user_problem = problemsToExcludeIds[0];
    });
  }
  
  // Add flower color filter
  const flowerColorIds = userGarden.flowerColorIds as string[] | undefined;
  if (Array.isArray(flowerColorIds) && flowerColorIds.length > 0) {
    if (!hasExplicitFilters.has('flower_color')) {
      filters.push({
        intent: 'flower_color',
        entities: { flower_color: flowerColorIds[0] } // Use the first flower color
      });
    }
    // Store flower color info for personalization in the response
    filters.forEach(filter => {
      filter.entities.user_flower_color = flowerColorIds[0];
    });
  }
  
  // Add flower bloom time filter
  const flowerBloomTimeIds = userGarden.flowerBloomTimeIds as string[] | undefined;
  if (Array.isArray(flowerBloomTimeIds) && flowerBloomTimeIds.length > 0) {
    if (!hasExplicitFilters.has('flower_bloom_time')) {
      filters.push({
        intent: 'flower_bloom_time',
        entities: { bloom_time: flowerBloomTimeIds[0] } // Use the first bloom time
      });
    }
    // Store bloom time info for personalization in the response
    filters.forEach(filter => {
      filter.entities.user_bloom_time = flowerBloomTimeIds[0];
    });
  }
}

import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { deepseek } from "@/lib/ai/deepseek";


// Define all the possible values as const arrays for better type inference
const INTENTS = [
  // Cultural Conditions
  "light_requirements",
  "soil_texture",
  "soil_ph",
  "soil_drainage",
  "available_space",
  "nc_regions",
  "usda_zones",
  "fertilizer_requirements",
  // Landscape
  "landscape_location",
  "landscape_theme",
  // Wildlife and Resistance
  "attracts",
  "resistance_to_challenges",
  "problems",
  // Whole Plant Traits
  "plant_type",
  "woody_plant_leaf_characteristics",
  "habit_form",
  "growth_rate",
  "maintenance",
  "texture",
  // Flowers
  "flower_color",
  "flower_value",
  "flower_bloom_time",
  // Leaves
  "leaf_color",
  "leaf_value",
  "leaf_fall_color",
  // General
  "general_description",
  "unknown",
] as const;

const LIGHT_LEVEL_MAPPING = {
  low: "Deep shade (Less than 2 hours to no direct sunlight)",
  medium: "Partial Shade (2-6 hours of direct sunlight)",
  high: "Full Sun (6 or more hours of direct sunlight a day)",
} as const;

const IntentSchema = z.object({
  intent: z.enum(INTENTS),
  entities: z
    .object({
      // Plant identification
      plant: z.string().optional(),
      scientific_name: z.string().optional(),
      common_name: z.string().optional(),

      // Cultural conditions
      light_level: z
        .enum(["low", "medium", "high"])
        .transform((level) => LIGHT_LEVEL_MAPPING[level])
        .optional(),
      diagnostic_type: z
        .enum(["too_much", "too_little", "both", "general"])
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

      // Landscape
      location_type: z
        .enum([
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
        ])
        .optional(),
      theme_type: z
        .enum([
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
        ])
        .optional(),

      // Wildlife and challenges
      wildlife_type: z
        .enum([
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
        ])
        .optional(),
      challenge_type: z
        .enum([
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
        ])
        .optional(),
      problem_type: z
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

      // Plant traits
      type: z
        .enum([
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
        ])
        .optional(),
      leaf_type: z
        .enum([
          "Broadleaf Evergreen",
          "Deciduous",
          "Needled Evergreen",
          "Semi-evergreen",
        ])
        .optional(),
      growth_habit: z
        .enum([
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
        ])
        .optional(),
      growth_speed: z.enum(["Slow", "Medium", "Rapid"]).optional(),
      maintenance_level: z.enum(["High", "Low", "Medium"]).optional(),
      texture_type: z.enum(["Fine", "Medium", "Coarse"]).optional(),

      // Flower characteristics
      flower_color: z
        .enum([
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
        ])
        .optional(),
      flower_trait: z
        .enum([
          "Edible",
          "Fragrant",
          "Good Cut",
          "Good Dried",
          "Long Bloom Season",
          "Long-lasting",
          "Showy",
        ])
        .optional(),
      bloom_season: z.enum(["Fall", "Spring", "Summer", "Winter"]).optional(),

      // Leaf characteristics
      leaf_color: z
        .enum([
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
        ])
        .optional(),
      leaf_trait: z
        .enum([
          "Edible",
          "Fragrant",
          "Good Cut",
          "Good Dried",
          "Long-lasting",
          "Showy",
        ])
        .optional(),
      fall_color: z
        .enum([
          "Brown/Copper",
          "Cream/Tan",
          "Gold/Yellow",
          "Gray/Silver",
          "Insignificant",
          "Orange",
          "Pink",
          "Purple/Lavender",
          "Red/Burgundy",
        ])
        .optional(),

      // Fertilizer requirements
      fertilizer_frequency: z
        .enum([
          "Weekly",
          "Bi-weekly",
          "Monthly",
          "Quarterly",
          "Annually",
          "Growing Season",
          "Spring",
          "Summer",
          "Fall",
          "Winter",
        ])
        .optional(),
      fertilizer_type: z
        .enum([
          "Balanced (NPK)",
          "High Nitrogen",
          "High Phosphorus",
          "High Potassium",
          "Organic",
          "Slow Release",
          "Water Soluble",
        ])
        .optional(),
    })
    .passthrough(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required and must be a string" },
        { status: 400 }
      );
    }

    try {
      const result = await generateObject({
        model: deepseek('deepseek-chat'),
        prompt: `You are a gardening assistant that helps users find plants and gardening information. Parse the following question to identify the user's intent and any relevant entities.
        
Question: "${question}"

Parse this question to identify:
1. The primary intent (what information the user is looking for)
2. Any entities mentioned (plants, conditions, preferences, etc.)

Respond with a structured object that captures this information.`,
        schema: IntentSchema,
      });

      // Ensure we return an array of intents for consistency
      return NextResponse.json([result]);
    } catch (apiError: unknown) {
      // Check if it's an insufficient balance error
      const error = apiError as { statusCode?: number; responseBody?: string };
      if (error.statusCode === 402 || 
          (error.responseBody && error.responseBody.includes("Insufficient Balance"))) {
        console.error("DeepSeek API error: Insufficient Balance");
        return NextResponse.json(
          { error: "Service temporarily unavailable. Please try again later." },
          { status: 503 }
        );
      }
        
      // Re-throw other API errors
      throw apiError;
    }
  } catch (error) {
    console.error("Error parsing question:", error);
    return NextResponse.json(
      { error: "Failed to parse question" },
      { status: 500 }
    );
  }
}

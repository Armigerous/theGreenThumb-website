// lib/plant-queries.ts
// Optimized plant data fetching queries for better performance

import { supabase } from "@/lib/supabaseClient";
import { PlantData } from "@/types/plant";

// Fields needed for initial render (above the fold content)
const INITIAL_RENDER_FIELDS = [
  "id",
  "slug",
  "scientific_name",
  "common_names",
  "description",
  "images",
  "family",
  "genus",
  "species",
  "sound_file",
  "phonetic_spelling",
  "tags",
  "height_max",
  "height_min",
  "width_max",
  "width_min",
  "usda_zones",
  "nc_regions",
  "origin",
  "life_cycle",
  "plant_types",
  "plant_habit",
  "distribution",
  "uses",
] as const;

// Fields needed for care tab (loaded on demand)
const CARE_TAB_FIELDS = [
  "light_requirements",
  "soil_drainage",
  "soil_ph",
  "soil_texture",
  "available_space_to_plant",
  "maintenance",
  "growth_rate",
  "propagation",
  "problems",
  "resistance_to_challenges",
] as const;

// Fields needed for landscape tab (loaded on demand)
const LANDSCAPE_TAB_FIELDS = [
  "garden_spaces",
  "landscape_location",
  "landscape_theme",
  "design_feature",
  "fire_risk",
  "texture",
] as const;

// Fields needed for ecology tab (loaded on demand)
const ECOLOGY_TAB_FIELDS = [
  "wildlife_value",
  "attracts",
] as const;

// Fields needed for additional tab (loaded on demand)
const ADDITIONAL_TAB_FIELDS = [
  "edibility",
  "poison_symptoms",
  "poison_toxic_principle",
  "poison_dermatitis",
  "poison_parts",
  "poison_severity",
  "profile_video",
] as const;

// Physical characteristics fields (loaded on demand)
const PHYSICAL_TAB_FIELDS = [
  "flower_description",
  "flower_bloom_time",
  "flower_colors",
  "flower_inflorescence",
  "flower_petals",
  "flower_shape",
  "flower_size",
  "flower_value_to_gardener",
  "leaf_description",
  "leaf_arrangement",
  "leaf_characteristics",
  "leaf_color",
  "leaf_fall_color",
  "leaf_feel",
  "leaf_hairs_present",
  "leaf_length",
  "leaf_width",
  "leaf_margin",
  "leaf_shape",
  "leaf_type",
  "leaf_value_to_gardener",
  "fruit_description",
  "fruit_color",
  "fruit_display_harvest_time",
  "fruit_length",
  "fruit_type",
  "fruit_value_to_gardener",
  "fruit_width",
  "stem_description",
  "stem_aromatic",
  "stem_bud_scale",
  "stem_bud_terminal",
  "stem_buds",
  "stem_color",
  "stem_cross_section",
  "stem_form",
  "stem_leaf_scar_shape",
  "stem_lenticels",
  "stem_pith",
  "stem_surface",
  "bark_description",
  "bark_attachment",
  "bark_color",
  "bark_plate_shape",
] as const;

/**
 * Optimized query to fetch initial plant data for above-the-fold content
 * This reduces payload size by ~70% compared to select("*")
 */
export async function getPlantInitialData(slug: string): Promise<{
  plant: Partial<PlantData>;
  scientificSlug: string;
}> {
  // Single optimized query with field selection
  const { data: plant, error: plantError } = await supabase
    .from("plant_full_data")
    .select(INITIAL_RENDER_FIELDS.join(", "))
    .eq("slug", slug)
    .single();

  if (plantError || !plant) {
    throw new Error(plantError?.message || "Plant not found");
  }

  // Get scientific slug separately (simpler approach)
  const { data: scientificData, error: slugError } = await supabase
    .from("plant_common_card_data")
    .select("scientific_slug")
    .eq("slug", slug)
    .single();

  if (slugError && slugError.code !== "PGRST116") {
    // Ignore not found error
    console.error("Error fetching scientific slug:", slugError);
  }

  return {
    plant: plant as Partial<PlantData>,
    scientificSlug: scientificData?.scientific_slug || slug,
  };
}

/**
 * Fetch additional plant data for specific tabs (loaded on demand)
 */
export async function getPlantTabData(
  slug: string,
  tab: "care" | "landscape" | "ecology" | "additional" | "physical"
): Promise<Partial<PlantData>> {
  let fields: readonly string[];

  switch (tab) {
    case "care":
      fields = CARE_TAB_FIELDS;
      break;
    case "landscape":
      fields = LANDSCAPE_TAB_FIELDS;
      break;
    case "ecology":
      fields = ECOLOGY_TAB_FIELDS;
      break;
    case "additional":
      fields = ADDITIONAL_TAB_FIELDS;
      break;
    case "physical":
      fields = PHYSICAL_TAB_FIELDS;
      break;
    default:
      throw new Error(`Unknown tab: ${tab}`);
  }

  const { data, error } = await supabase
    .from("plant_full_data")
    .select(fields.join(", "))
    .eq("slug", slug)
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Plant data not found");
  }

  return data as Partial<PlantData>;
}

/**
 * Get all plant data (fallback for when full data is needed)
 * This should be used sparingly and only when necessary
 */
export async function getPlantFullData(slug: string): Promise<{
  plant: PlantData;
  scientificSlug: string;
}> {
  // Get plant data
  const { data: plant, error: plantError } = await supabase
    .from("plant_full_data")
    .select("*")
    .eq("slug", slug)
    .single();

  if (plantError || !plant) {
    throw new Error(plantError?.message || "Plant not found");
  }

  // Get scientific slug separately
  const { data: scientificData, error: slugError } = await supabase
    .from("plant_common_card_data")
    .select("scientific_slug")
    .eq("slug", slug)
    .single();

  if (slugError && slugError.code !== "PGRST116") {
    // Ignore not found error
    console.error("Error fetching scientific slug:", slugError);
  }

  return {
    plant: plant as PlantData,
    scientificSlug: scientificData?.scientific_slug || slug,
  };
}

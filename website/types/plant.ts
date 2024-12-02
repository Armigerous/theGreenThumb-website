import { PlantImage, Synonym } from "./plantsList";

export type BasicPlantData = {
  id: number; // Unique identifier for the plant
  slug: string; // URL-friendly identifier for the plant
  scientific_name: string; // Scientific name of the plant
  genus: string; // Genus of the plant
  species: string | null; // Species of the plant, or null if not specified
};

export type PlantData = {
  id: number; // Unique identifier for the plant
  slug: string; // Slug for plant identification
  genus: string; // Genus of the plant
  species: string; // Species of the plant
  plantimage_set?: PlantImage[]; // Array of images related to the plant
  commonname_set?: string[]; // Array of common names for the plant
  cultivar_set?: string[]; // Array of cultivars for the plant
  synonym_set?: Synonym[]; // Array of synonyms for the plant's scientific name
  tags?: string[]; // Array of tags describing features and characteristics
  plant_type?: string[]; // Array of types indicating plant form (e.g., "Shrub")
  propagation?: string[]; // Array of propagation methods (e.g., seeds, cuttings)
  leaf_characteristics?: string[]; // Array of characteristics of the plant’s leaves
  habit?: string[]; // Array of growth habits (e.g., erect, rounded)
  maintenance?: string[]; // Array indicating maintenance level (e.g., "Low")
  appendage?: string[]; // Array of appendages if applicable
  light?: string[]; // Array of light requirements
  soil_texture?: string[]; // Array of suitable soil textures
  soil_ph?: string[]; // Array of soil pH preferences
  soil_drainage?: string[]; // Array of soil drainage requirements
  available_space_to_plant?: string[]; // Array of space requirements
  nc_region?: string[]; // Array of suitable regions in North Carolina
  usda_zone?: string[]; // Array of USDA hardiness zones
  flower_color?: string[]; // Array of flower colors
  flower_inflorescence?: string[]; // Array of flower structures (inflorescences)
  flower_value_to_gardener?: string[]; // Array of flower attributes valued by gardeners
  flower_bloom_time?: string[]; // Array of bloom times
  flower_shape?: string[]; // Array of flower shapes
  flower_petals?: string[]; // Array of petal details
  leaf_color?: string[]; // Array of leaf colors
  leaf_feel?: string[]; // Array describing the feel/texture of leaves
  leaf_value_to_gardener?: string[]; // Array of leaf attributes valued by gardeners
  leaf_fall_color?: string[]; // Array of fall colors of leaves
  leaf_type?: string[]; // Array indicating leaf types
  leaf_arrangement?: string[]; // Array of leaf arrangements
  leaf_shape?: string[]; // Array of leaf shapes
  leaf_margin?: string[]; // Array of leaf margins
  fruit_color?: string[]; // Array of fruit colors
  fruit_value_to_gardener?: string[]; // Array describing fruit’s value to gardeners
  fruit_display_harvest_time?: string[]; // Array of harvest/display times for fruits
  fruit_type?: string[]; // Array indicating types of fruits
  landscape_location?: string[]; // Array of suitable landscape locations
  landscape_theme?: string[]; // Array of landscape themes
  design_feature?: string[]; // Array of design features
  attracts?: string[]; // Array indicating animals attracted by the plant
  resistance_to_challenges?: string[]; // Array of resistances to environmental challenges
  problems?: string[]; // Array listing any plant-specific problems
  stem_color?: string[]; // Array of stem colors
  bark_color?: string[]; // Array of bark colors
  bark_attachment?: string[]; // Array of bark attachment types
  bark_plate_shape?: string[]; // Array of bark plate shapes
  garden_spaces?: string[]; // Array of garden spaces where plant is suitable
  life_cycle?: string[]; // Array indicating the plant’s lifecycle
  poison_part?: string[]; // Array describing poisonous parts, if any
  growth_rate?: string; // Growth rate of the plant (e.g., "Medium")
  texture?: string; // Texture of the plant (e.g., "Medium")
  flower_size?: string; // Size of flowers
  leaf_hairs_present?: string; // Indicates if leaf hairs are present
  leaf_length?: string; // Length range of leaves
  leaf_width?: string; // Width range of leaves
  fruit_length?: string | null; // Length of fruits
  fruit_width?: string | null; // Width of fruits
  fire_risk?: string | null; // Fire risk level
  stem_aromatic?: string; // Indicates if stem is aromatic
  stem_buds?: string | null; // Description of stem buds
  stem_bud_terminal?: string | null; // Terminal bud type of stem
  stem_bud_scales?: string | null; // Indicates presence of bud scales
  stem_cross_section?: string | null; // Shape of stem cross-section
  stem_form?: string | null; // Stem form
  stem_leaf_scar_shape?: string | null; // Shape of stem leaf scars
  stem_lenticels?: string | null; // Description of stem lenticels
  stem_pith?: string | null; // Pith type of the stem
  stem_surface?: string | null; // Description of stem surface
  poison_severity?: string; // Severity level of poison, if applicable
  poison_dermatitis?: string; // Indicates if poison causes dermatitis
  similar?: string[]; // Array of similar plants
  confused_with?: string[]; // Array of plants it may be confused with
  native_alternative?: string[]; // Array of native plant alternatives
  url?: string; // URL to the plant’s detailed page
  created_time?: string; // ISO date string of creation time
  update_time?: string; // ISO date string of last update
  scientific_name: string; // Scientific name of the plant
  family?: string; // Family of the plant
  sound_file?: string; // URL to an audio file for pronunciation
  phonetic_spelling?: string; // Phonetic spelling of the scientific name
  description?: string; // HTML description of the plant
  internal_comment?: string; // Internal comments
  profile_video?: string | null; // URL to a profile video, if any
  height_max?: number; // Maximum height in inches
  width_max?: number; // Maximum width in inches
  height_min?: number; // Minimum height in inches
  width_min?: number; // Minimum width in inches
  uses?: string; // Uses of the plant
  origin?: string; // Origin location of the plant
  distribution?: string; // Distribution range
  wildlife_value?: string; // Description of the plant’s value to wildlife
  common_insect_problems?: string | null; // Common insect problems, if any
  common_disease_problems?: string | null; // Common disease problems, if any
  other_plant_problems?: string | null; // Other plant problems
  resistance?: string; // Resistance to various conditions
  bulb_storage?: string; // Storage information for bulbs, if applicable
  edibility?: string; // Description of edibility, if any
  description_done?: boolean; // Indicator if description is complete
  proofread?: boolean; // Indicator if content has been proofread
  photos_done?: boolean; // Indicator if photos are complete
  data_fields_reviewed_updated?: boolean; // Indicator if data fields were reviewed
  tags_done?: boolean; // Indicator if tags are complete
  ipm_done?: boolean; // Indicator if IPM data is complete
  video_profile_done?: boolean; // Indicator if video profile is complete
  latin_name_audio_done?: boolean; // Indicator if Latin name audio is complete
  old_database_info_done?: boolean; // Indicator if old database info is complete
  plant_name_verified?: boolean; // Indicator if plant name is verified
  flower_description?: string; // Description of the flowers
  leaf_description?: string; // Description of leaves
  fruit_description?: string; // Description of fruits
  stem_description?: string; // Description of stems
  bark_description?: string; // Description of bark
  poison_symptoms?: string; // Description of poison symptoms
  poison_toxic_principle?: string | null; // Toxic principle of poison, if any
  created_by?: number; // User ID of the creator
  update_by?: number; // User ID of last updater
  play_value?: number[]; // Array of play values associated with the plant
  climbing_method?: string[]; // Array of climbing methods if applicable
};

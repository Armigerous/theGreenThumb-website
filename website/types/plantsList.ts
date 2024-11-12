export type ApiResponse = {
  count: number; // Total number of items available
  next: string | null; // URL to the next page of results, or null if there are no more pages
  previous: string | null; // URL to the previous page of results, or null if on the first page
  results: PlantSummary[]; // Array of plant summary objects in the current page of results
};

export type PlantSummary = {
  id: number; // Unique identifier for the plant
  slug: string; // URL-friendly identifier for the plant
  scientific_name: string; // Scientific name of the plant
  genus: string; // Genus of the plant
  species: string | null; // Species of the plant, or null if not specified
  description?: string; // HTML description of the plant
  wildlife_value?: string; // Information on wildlife interaction, if available
  leaf_description?: string; // Description of the plant’s leaves
  stem_description?: string; // Description of the plant’s stems
  fruit_description?: string; // Description of the plant’s fruits
  flower_description?: string; // Description of the plant’s flowers
  plantimage_set?: PlantImage[]; // Array of images related to the plant
  commonname_set?: string[]; // Array of common names for the plant
  cultivar_set?: Cultivar[]; // Array of cultivar information
  synonym_set?: Synonym[]; // Array of synonyms for the plant’s scientific name
  tags?: string[]; // Array of descriptive tags related to the plant
};

export type Cultivar = {
  name?: string; // Name of the cultivar
  description?: string | null; // Optional description of the cultivar, if available
};

export type PlantImage = {
  img: string; // URL to the main image
  thumbnail_med: string; // URL to medium thumbnail
  thumbnail_small: string; // URL to small thumbnail
  alt_text: string; // Alt text for the image
  caption: string; // Caption for the image
  attribution: string; // Attribution for the image
};

export type Synonym = {
  name: string; // Name of the synonym
};

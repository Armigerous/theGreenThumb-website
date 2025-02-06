// types/plant.ts

export interface PlantData {
  id: number;
  slug: string;
  genus: string;
  species: string;
  description: string;
  scientific_name: string;
  family: string;
  images?: PlantImage[] | null;
  sound_file: string; // the URL or path to your sound file
  // ... add other properties as needed
}

export interface PlantImage {
  /** The actual image URL */
  img: string | null;
  /** Text describing the image */
  alt_text?: string | null;
  /** A short caption */
  caption?: string | null;
  /** Attribution info (e.g., photographer) */
  attribution?: string | null;
}

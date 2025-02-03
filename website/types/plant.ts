// types/plant.ts

export interface PlantData {
  id: number;
  slug: string;
  genus: string;
  species: string;
  description: string;
  scientific_name: string;
  family: string;
  images: string[]; // assuming images are stored as an array of URLs
  sound_file: string; // the URL or path to your sound file
  // ... add other properties as needed
}

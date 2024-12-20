import { Tables } from "@/supabase/supabase.schema";

export type PlantScientificNameRow = Tables<"scientificNames"> & {
  mainPlantData: {
    slug: string;
  };
};

export interface PlantScientificName {
  scientificName: string;
  slug: string;
}

export type ImageData = {
  img: string;
  altText?: string;
  caption?: string;
  attribution?: string;
};

type MainPlantData = Tables<"mainPlantData">;

export interface PlantData {
  id: MainPlantData["id"];
  slug: MainPlantData["slug"];
  scientificName: string;
  genus: MainPlantData["genus"];
  species: MainPlantData["species"];
  family: MainPlantData["family"];
  soundFile: MainPlantData["sound_file"];
  phoneticSpelling: MainPlantData["phonetic_spelling"];
  description: MainPlantData["description"];
  profileVideo: MainPlantData["profile_video"];
  heightMax: MainPlantData["height_max"];
  heightMin: MainPlantData["height_min"];
  widthMax: MainPlantData["width_max"];
  widthMin: MainPlantData["width_min"];
  origin: MainPlantData["origin"];
  distribution: MainPlantData["distribution"];
  uses: MainPlantData["uses"];
  plantImages: Array<{
    img: string | null;
    altText: string | null;
    caption: string | null;
    attribution: string | null;
  }>;
  wildlifeValue: MainPlantData["wildlife_value"];
  edibility: MainPlantData["edibility"];
  flowerDescription: MainPlantData["flower_description"];
  leafDescription: MainPlantData["leaf_description"];
  fruitDescription: MainPlantData["fruit_description"];
  stemDescription: MainPlantData["stem_description"];
  barkDescription: MainPlantData["bark_description"];
  poisonSymptoms: MainPlantData["poison_symptoms"];
  poisonToxicPrinciple: MainPlantData["poison_toxic_principle"];
  tags: Array<string | null>;
  attracts: Array<string | null>;
  availableSpaceToPlant: Array<string | null>;
  barkAttachment: Array<string | null>;
  barkColor: Array<string | null>;
  barkPlateShape: Array<string | null>;
  designFeatures: Array<string | null>;
  fireRisk: Array<string | null>;
  flowerBloomTime: Array<string | null>;
  flowerColor: Array<string | null>;
  flowerInflorescence: Array<string | null>;
  flowerPetals: Array<string | null>;
  flowerShape: Array<string | null>;
  flowerSize: Array<string | null>;
  flowerValueToGardener: Array<string | null>;
  fruitColor: Array<string | null>;
  fruitDisplayHarvestTime: Array<string | null>;
  fruitLength: Array<string | null>;
  fruitType: Array<string | null>;
  fruitValueToGardener: Array<string | null>;
  fruitWidth: Array<string | null>;
  gardenSpaces: Array<string | null>;
  growthRate: Array<string | null>;
  habit: Array<string | null>;
  landscapeLocation: Array<string | null>;
  landscapeTheme: Array<string | null>;
  leafArrangement: Array<string | null>;
  leafCharacteristics: Array<string | null>;
  leafColor: Array<string | null>;
  leafFallColor: Array<string | null>;
  leafFeel: Array<string | null>;
  leafHairsPresent: Array<string | null>;
  leafLength: Array<string | null>;
  leafMargin: Array<string | null>;
  leafShape: Array<string | null>;
  leafType: Array<string | null>;
  leafValueToGardener: Array<string | null>;
  leafWidth: Array<string | null>;
  lifeCycle: Array<string | null>;
  light: Array<string | null>;
  maintenance: Array<string | null>;
  ncRegion: Array<string | null>;
  plantTypes: Array<string | null>;
  poisonDermatitis: Array<string | null>;
  poisonPart: Array<string | null>;
  poisonSeverity: Array<string | null>;
  problems: Array<string | null>;
  propagation: Array<string | null>;
  resistanceToChallenges: Array<string | null>;
  soilDrainage: Array<string | null>;
  soilPh: Array<string | null>;
  soilTexture: Array<string | null>;
  stemAromatic: Array<string | null>;
  stemBudScales: Array<string | null>;
  stemBudTerminal: Array<string | null>;
  stemBuds: Array<string | null>;
  stemColor: Array<string | null>;
  stemCrossSection: Array<string | null>;
  stemForm: Array<string | null>;
  stemLeafScarShape: Array<string | null>;
  stemLenticels: Array<string | null>;
  stemPith: Array<string | null>;
  stemSurface: Array<string | null>;
  texture: Array<string | null>;
  usdaZones: Array<string | null>;
}

export interface PlantImage {
  img: string; // URL to the main image
  altText: string; // Alt text for the image
  caption: string; // Caption for the image
  attribution: string; // Attribution for the image
}

export interface Cultivar {
  name?: string; // Optional name of the cultivar
  description?: string | null; // Optional description of the cultivar
}

export interface Synonym {
  name: string; // Name of the synonym
}

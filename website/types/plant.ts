export type MainPlantData = {
  id: number;
  slug: string;
  genus?: string;
  species?: string;
  family?: string;
  soundFile?: string;
  phoneticSpelling?: string;
  description?: string;
  profileVideo?: string;
  heightMax?: number;
  heightMin?: number;
  widthMax?: number;
  widthMin?: number;
  origin?: string;
  distribution?: string;
  uses?: string;
  wildlifeValue?: string;
  edibility?: string;
  flowerDescription?: string;
  leafDescription?: string;
  fruitDescription?: string;
  stemDescription?: string;
  barkDescription?: string;
  poisonSymptoms?: string;
  poisonToxicPrinciple?: string;
};

export type Lookup = {
  id: number;
  name: string;
};

export type Mapping = {
  plantId: number; // Reference to MainPlantData.id
  attributeId: number; // Reference to corresponding Lookup.id
};

export type ScientificNameData = {
  scientific_name: string;
  slug: string;
};

import { Flower, Sun, TreePine, Heart, Shield, Leaf } from "lucide-react";

export type PremadeFilter = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  filters: string[];
};

export const premadeFilters: PremadeFilter[] = [
  {
    id: "beginner-friendly",
    name: "Beginner Friendly",
    description: "Easy-to-grow plants perfect for beginners",
    icon: TreePine,
    filters: [
      "maintenance|Low",
      "resistance-to-challenges|Drought",
      "resistance-to-challenges|Poor Soil",
    ],
  },
  {
    id: "butterfly-garden",
    name: "Butterfly Garden",
    description: "Create a beautiful butterfly sanctuary",
    icon: Heart,
    filters: [
      "landscape-theme|Butterfly Garden",
      "attracts|Butterflies",
      "attracts|Pollinators",
      "light|Full Sun (6 or more hours of direct sunlight a day)",
    ],
  },
  {
    id: "drought-resistant",
    name: "Drought Resistant",
    description: "Low-water plants for dry conditions",
    icon: Sun,
    filters: [
      "resistance-to-challenges|Drought",
      "resistance-to-challenges|Dry Soil",
      "resistance-to-challenges|Heat",
      "landscape-theme|Drought Tolerant Garden",
    ],
  },
  {
    id: "pollinator-friendly",
    name: "Pollinator Friendly",
    description: "Support local pollinators",
    icon: Flower,
    filters: [
      "attracts|Bees",
      "attracts|Butterflies",
      "attracts|Hummingbirds",
      "attracts|Moths",
      "attracts|Pollinators",
      "attracts|Specialized Bees",
    ],
  },
  {
    id: "low-maintenance",
    name: "Low Maintenance",
    description: "Easy-care plants for busy gardeners",
    icon: Shield,
    filters: [
      "maintenance|Low",
      "resistance-to-challenges|Drought",
      "resistance-to-challenges|Poor Soil",
      "resistance-to-challenges|Urban Conditions",
    ],
  },
  {
    id: "native-garden",
    name: "Native Garden",
    description: "Local plants for your region",
    icon: Leaf,
    filters: ["plant-type|Native Plant", "landscape-theme|Native Garden"],
  },
];

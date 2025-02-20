import {
  Sun,
  Leaf,
  Droplet,
  TreePine,
  TreeDeciduous,
  Ruler,
  MapPin,
  Flower,
  Eye,
  Heart,
  ShieldCheck,
  AlertTriangle,
  Shield,
  Star,
  Clock,
  Paintbrush,
  Sprout,
  Palette,
  Pipette,
  Mountain,
  Map,
  MapPinHouse,
  Activity,
  Hand,
} from "lucide-react";

export type FilterCategory = {
  /**
   * Unique ID for your UI to distinguish categories
   * (like "nc-regions" or "soil-texture").
   */
  id: string;
  /** The label to show in your UI, e.g. "NC Regions" */
  name: string;
  /** The actual Postgres column name in plant_full_data. */
  dbColumn: string;
  /** The list of possible user-selectable values. */
  options: string[];
  icon: React.ElementType;
};

export type FilterSection = {
  id: string;
  name: string;
  isAdvanced?: boolean;
  categories: FilterCategory[];
  icon: React.ElementType;
};

export const allFilters: FilterSection[] = [
  /* ------------------ BASIC SECTIONS ------------------ */
  {
    id: "cultural-conditions",
    name: "Cultural Conditions",
    icon: Map,
    categories: [
      {
        id: "light",
        name: "Light",
        dbColumn: "light_requirements", // JSONB in your table
        options: [
          "Dappled Sunlight (Shade through upper canopy all day)",
          "Deep shade (Less than 2 hours to no direct sunlight)",
          "Full Sun (6 or more hours of direct sunlight a day)",
          "Partial Shade (2-6 hours of direct sunlight)",
        ],
        icon: Sun,
      },
      {
        id: "soil-texture",
        name: "Soil Texture",
        dbColumn: "soil_texture", // JSONB
        options: [
          "Clay",
          "Loam (Silt)",
          "Sand",
          "High Organic Matter",
          "Shallow Rocky",
        ],
        icon: Leaf,
      },
      {
        id: "soil-ph",
        name: "Soil pH",
        dbColumn: "soil_ph", // JSONB
        options: ["Acid (<6.0)", "Neutral (6.0-8.0)", "Alkaline (>8.0)"],
        icon: Droplet,
      },
      {
        id: "soil-drainage",
        name: "Soil Drainage",
        dbColumn: "soil_drainage", // JSONB
        options: [
          "Frequent Standing Water",
          "Good Drainage",
          "Moist",
          "Occasional Flooding",
          "Occasionally Dry",
          "Occasionally Wet",
          "Very Dry",
        ],
        icon: Pipette,
      },
      {
        id: "available-space-to-plant",
        name: "Available Space To Plant",
        dbColumn: "available_space_to_plant", // JSONB
        options: [
          "Less than 12 inches",
          "12 inches-3 feet",
          "3 feet-6 feet",
          "6 feet-12 feet",
          "12-24 feet",
          "24-60 feet",
          "more than 60 feet",
        ],
        icon: Ruler,
      },
      {
        id: "nc-regions",
        name: "NC Regions",
        dbColumn: "nc_regions", // JSONB
        options: ["Coastal", "Mountains", "Piedmont"],
        icon: Mountain,
      },
      {
        id: "usda-zone",
        name: "USDA Zone",
        dbColumn: "usda_zones", // JSONB
        options: [
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
        ],
        icon: MapPin,
      },
    ],
  },
  {
    id: "landscape",
    name: "Landscape",
    icon: TreePine,
    categories: [
      {
        id: "location",
        name: "Location",
        dbColumn: "landscape_location", // JSONB
        options: [
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
        ],
        icon: MapPinHouse,
      },
    ],
  },

  /* ------------------ ADVANCED SECTIONS ------------------ */
  {
    id: "landscape-advanced",
    name: "Landscape",
    isAdvanced: true,
    icon: TreeDeciduous,
    categories: [
      {
        id: "landscape-theme",
        name: "Landscape Theme",
        dbColumn: "landscape_theme", // JSONB
        options: [
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
        ],
        icon: Flower,
      },
      {
        id: "design-feature",
        name: "Design Feature",
        dbColumn: "design_feature", // JSONB
        options: [
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
        ],
        icon: Eye,
      },
    ],
  },
  {
    id: "wildlife-and-resistance",
    name: "Wildlife and Resistance",
    isAdvanced: true,
    icon: Shield,
    categories: [
      {
        id: "attracts",
        name: "Attracts",
        dbColumn: "attracts", // JSONB
        options: [
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
        ],
        icon: Heart,
      },
      {
        id: "resistance-to-challenges",
        name: "Resistance To Challenges",
        dbColumn: "resistance_to_challenges", // JSONB
        options: [
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
        ],
        icon: ShieldCheck,
      },
      {
        id: "problems-to-exclude",
        name: "Problems to Exclude",
        dbColumn: "problems", // JSONB
        options: [
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
        ],
        icon: AlertTriangle,
      },
    ],
  },
  {
    id: "whole-plant-traits",
    name: "Whole Plant Traits",
    isAdvanced: true,
    icon: Leaf,
    categories: [
      {
        id: "plant-type",
        name: "Plant Type",
        dbColumn: "plant_types", // JSONB
        options: [
          "Annual",
          "Bulb",
          "Carnivorous",
          "Cool Season Vegetable",
          "Edible",
          "Epiphyte",
          "Fern",
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
        ],
        icon: TreePine,
      },
      {
        id: "woody-plant-leaf-characteristics",
        name: "Woody Plant Leaf Characteristics",
        dbColumn: "leaf_characteristics", // JSONB
        options: [
          "Broadleaf Evergreen",
          "Deciduous",
          "Needled Evergreen",
          "Semi-evergreen",
        ],
        icon: Leaf,
      },
      {
        id: "habit-form",
        name: "Habit/Form",
        dbColumn: "plant_habit", // JSONB
        options: [
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
        ],
        icon: Star,
      },
      {
        id: "growth-rate",
        name: "Growth Rate",
        dbColumn: "growth_rate", // text or JSONB
        options: ["Slow", "Medium", "Rapid"],
        icon: Clock,
      },
      {
        id: "maintenance",
        name: "Maintenance",
        dbColumn: "maintenance", // JSONB
        options: ["High", "Low", "Medium"],
        icon: Activity,
      },
      {
        id: "texture",
        name: "Texture",
        dbColumn: "texture", // text or JSONB
        options: ["Fine", "Medium", "Coarse"],
        icon: Hand,
      },
    ],
  },
  {
    id: "flowers",
    name: "Flowers",
    isAdvanced: true,
    icon: Flower,
    categories: [
      {
        id: "flower-color",
        name: "Flower Color",
        dbColumn: "flower_colors", // JSONB
        options: [
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
        ],
        icon: Paintbrush,
      },
      {
        id: "flower-value-to-gardener",
        name: "Flower Value To Gardener",
        dbColumn: "flower_value_to_gardener", // JSONB
        options: [
          "Edible",
          "Fragrant",
          "Good Cut",
          "Good Dried",
          "Long Bloom Season",
          "Long-lasting",
          "Showy",
        ],
        icon: Heart,
      },
      {
        id: "flower-bloom-time",
        name: "Flower Bloom Time",
        dbColumn: "flower_bloom_time", // JSONB
        options: ["Fall", "Spring", "Summer", "Winter"],
        icon: Sprout,
      },
    ],
  },
  {
    id: "leaves",
    name: "Leaves",
    isAdvanced: true,
    icon: Leaf,
    categories: [
      {
        id: "leaf-color",
        name: "Leaf Color",
        dbColumn: "leaf_color", // JSONB
        options: [
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
        ],
        icon: Paintbrush,
      },
      {
        id: "leaf-texture",
        name: "Leaf Texture",
        dbColumn: "leaf_feel", // JSONB or text, whichever is correct
        options: [
          "Fleshy",
          "Glossy",
          "Leathery",
          "Papery",
          "Prickly",
          "Rough",
          "Rubbery",
          "Slippery",
          "Smooth",
          "Soft",
          "Velvety",
          "Waxy",
        ],
        icon: Hand,
      },
      {
        id: "leaf-value-to-gardener",
        name: "Leaf Value To Gardener",
        dbColumn: "leaf_value_to_gardener", // JSONB
        options: [
          "Edible",
          "Fragrant",
          "Good Cut",
          "Good Dried",
          "Long-lasting",
          "Showy",
        ],
        icon: Heart,
      },
      {
        id: "deciduous-leaf-fall-color",
        name: "Deciduous Leaf Fall Color",
        dbColumn: "leaf_fall_color", // JSONB
        options: [
          "Brown/Copper",
          "Cream/Tan",
          "Gold/Yellow",
          "Gray/Silver",
          "Insignificant",
          "Orange",
          "Pink",
          "Purple/Lavender",
          "Red/Burgundy",
        ],
        icon: Palette,
      },
    ],
  },
];

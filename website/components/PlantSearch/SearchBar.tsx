"use client";

import { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Sun,
  Droplet,
  Mountain,
  Leaf,
  ArrowUpDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FilterCategory = {
  name: string;
  options: string[];
};

type FilterSection = {
  name: string;
  categories: FilterCategory[];
};

const basicFilters: FilterSection[] = [
  {
    name: "Cultural Conditions",
    categories: [
      {
        name: "Light",
        options: [
          "Dappled Sunlight",
          "Deep Shade",
          "Full Sun",
          "Partial Shade",
        ],
      },
      {
        name: "Soil Texture",
        options: [
          "Clay",
          "High Organic Matter",
          "Loam (Silt)",
          "Sand",
          "Shallow Rocky",
        ],
      },
      {
        name: "Soil pH",
        options: ["Acid (<6.0)", "Alkaline (>8.0)", "Neutral (6.0-8.0)"],
      },
      {
        name: "Soil Drainage",
        options: [
          "Frequent Standing Water",
          "Good Drainage",
          "Moist",
          "Occasional Flooding",
          "Occasionally Dry",
          "Occasionally Wet",
          "Very Dry",
        ],
      },
      {
        name: "Available Space To Plant",
        options: [
          "Less than 12 inches",
          "12 inches-3 feet",
          "3 feet-6 feet",
          "6-feet-12 feet",
          "12-24 feet",
          "24-60 feet",
          "more than 60 feet",
        ],
      },
      {
        name: "NC Region",
        options: ["Coastal", "Mountains", "Piedmont"],
      },
      {
        name: "USDA Plant Hardiness Zone",
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
      },
    ],
  },
  {
    name: "Landscape",
    categories: [
      {
        name: "Landscape Location",
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
      },
    ],
  },
];

const advancedFilters: FilterSection[] = [
  {
    name: "Landscape",
    categories: [
      {
        name: "Landscape Theme",
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
      },
      {
        name: "Design Feature",
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
      },
    ],
  },
  {
    name: "Wildlife and Resistance",
    categories: [
      {
        name: "Attracts",
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
      },
      {
        name: "Resistance To Challenges",
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
      },
      {
        name: "Problems to Exclude",
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
      },
    ],
  },
  {
    name: "Whole Plant Traits",
    categories: [
      {
        name: "Plant Type",
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
      },
      {
        name: "Woody Plant Leaf Characteristics",
        options: [
          "Broadleaf Evergreen",
          "Deciduous",
          "Needled Evergreen",
          "Semi-evergreen",
        ],
      },
      {
        name: "Habit/Form",
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
      },
      {
        name: "Growth Rate",
        options: ["Slow", "Medium", "Rapid"],
      },
      {
        name: "Maintenance",
        options: ["High", "Low", "Medium"],
      },
      {
        name: "Texture",
        options: ["Fine", "Medium", "Coarse"],
      },
    ],
  },
  {
    name: "Flowers",
    categories: [
      {
        name: "Flower Color",
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
      },
      {
        name: "Flower Value To Gardener",
        options: [
          "Edible",
          "Fragrant",
          "Good Cut",
          "Good Dried",
          "Long Bloom Season",
          "Long-lasting",
          "Showy",
        ],
      },
      {
        name: "Flower Bloom Time",
        options: ["Fall", "Spring", "Summer", "Winter"],
      },
    ],
  },
  {
    name: "Leaves",
    categories: [
      {
        name: "Leaf Color",
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
      },
      {
        name: "Leaf Feel",
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
      },
      {
        name: "Leaf Value To Gardener",
        options: [
          "Edible",
          "Fragrant",
          "Good Cut",
          "Good Dried",
          "Long-lasting",
          "Showy",
        ],
      },
      {
        name: "Deciduous Leaf Fall Color",
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
      },
    ],
  },
];
const predefinedFilterSets = [
  { name: "Beginner Plants", filters: ["Low Maintenance", "Drought", "Shade"] },
  { name: "Indoor Plants", filters: ["Houseplants", "Low Light", "Container"] },
  {
    name: "Pollinator Garden",
    filters: ["Attracts Bees", "Attracts Butterflies", "Native Plant"],
  },
];

export default function SearchBar() {
  const [sortOption, setSortOption] = useState("relevance");
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(
    new Set()
  );
  const [resultCount, setResultCount] = useState(100);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setResultCount(Math.max(0, 100 - selectedFilters.size * 5));
  }, [selectedFilters]);

  const toggleFilter = (filter: string) => {
    const newFilters = new Set(selectedFilters);
    if (newFilters.has(filter)) {
      newFilters.delete(filter);
    } else {
      newFilters.add(filter);
    }
    setSelectedFilters(newFilters);
  };

  const clearFilters = () => {
    setSelectedFilters(new Set());
  };

  const removeFilter = (filter: string) => {
    const newFilters = new Set(selectedFilters);
    newFilters.delete(filter);
    setSelectedFilters(newFilters);
  };

  const toggleCategory = (category: string) => {
    const newExpandedCategories = new Set(expandedCategories);
    if (newExpandedCategories.has(category)) {
      newExpandedCategories.delete(category);
    } else {
      newExpandedCategories.add(category);
    }
    setExpandedCategories(newExpandedCategories);
  };

  const applyPredefinedFilterSet = (filterSet: string[]) => {
    setSelectedFilters(new Set(filterSet));
  };

  const handleSort = (option: string) => {
    setSortOption(option);
    // Here you would typically trigger a re-fetch or re-sort of your data
    console.log(`Sorting by: ${option}`);
  };

  const filtersToShow = isAdvanced
    ? [
        ...basicFilters,
        ...advancedFilters.filter(
          (section) =>
            !basicFilters.some((basic) => basic.name === section.name)
        ),
      ].map((section) => ({
        ...section,
        categories: [
          ...(basicFilters.find((basic) => basic.name === section.name)
            ?.categories || []),
          ...(advancedFilters.find((advanced) => advanced.name === section.name)
            ?.categories || []),
        ],
      }))
    : basicFilters;

  const filterIcon = (categoryName: string) => {
    switch (categoryName) {
      case "Light":
        return <Sun className="h-4 w-4 mr-2" />;
      case "Soil Drainage":
        return <Droplet className="h-4 w-4 mr-2" />;
      case "NC Region":
        return <Mountain className="h-4 w-4 mr-2" />;
      default:
        return <Leaf className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search plants..."
            className="w-full pl-10 pr-4 py-2 text-lg bg-background border-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-green-100 hover:bg-green-200 text-green-800 text-lg py-6"
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span>Filters</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[80vh] overflow-y-auto rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-green-800">
                Filter Plants
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="predefined">
                  <AccordionTrigger className="text-lg font-semibold">
                    Predefined Filter Sets
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2">
                      {predefinedFilterSets.map((set) => (
                        <Button
                          key={set.name}
                          variant="outline"
                          size="sm"
                          onClick={() => applyPredefinedFilterSet(set.filters)}
                          className="text-sm bg-green-50 hover:bg-green-100 text-green-800"
                        >
                          {set.name}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                {filtersToShow.map((section) => (
                  <AccordionItem key={section.name} value={section.name}>
                    <AccordionTrigger className="text-lg font-semibold">
                      {section.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      {section.categories.map((category) => (
                        <div key={category.name} className="mb-4">
                          <button
                            onClick={() => toggleCategory(category.name)}
                            className="flex items-center justify-between w-full text-left font-medium mb-2 text-green-800"
                          >
                            <span className="flex items-center">
                              {filterIcon(category.name)}
                              {category.name}
                            </span>
                            {expandedCategories.has(category.name) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                          {expandedCategories.has(category.name) && (
                            <div className="space-y-2 ml-6">
                              {category.options.map((option) => (
                                <TooltipProvider key={option}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center">
                                        <Checkbox
                                          id={option}
                                          checked={selectedFilters.has(option)}
                                          onCheckedChange={() =>
                                            toggleFilter(option)
                                          }
                                          className="h-5 w-5"
                                        />
                                        <Label
                                          htmlFor={option}
                                          className="ml-2 text-base cursor-pointer"
                                        >
                                          {option}
                                        </Label>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        Filter plants by {option.toLowerCase()}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full sm:w-auto text-base py-6"
              >
                Clear All
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAdvanced(!isAdvanced)}
                className="w-full sm:w-auto text-base py-6"
              >
                {isAdvanced ? "Basic Filters" : "Advanced Filters"}
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                className="w-full sm:w-auto text-base py-6"
              >
                Apply Filters
              </Button>
            </div>
            <div className="text-base text-gray-600 mt-2 text-center">
              {resultCount} results
            </div>
          </DialogContent>
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-green-100 hover:bg-green-200 text-green-800 text-lg py-6"
            >
              <ArrowUpDown className="h-5 w-5" />
              <span>Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleSort("relevance")}>
              Relevance
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("name")}>
              Name (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("height")}>
              Height
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("bloom-time")}>
              Bloom Time
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {selectedFilters.size > 0 && (
        <div className="flex flex-wrap gap-2">
          {Array.from(selectedFilters).map((filter) => (
            <Button
              key={filter}
              variant="secondary"
              size="sm"
              onClick={() => removeFilter(filter)}
              className="text-sm bg-green-100 hover:bg-green-200 text-green-800"
            >
              {filter}
              <X className="ml-1 h-3 w-3" />
            </Button>
          ))}
          <Button
            variant="link"
            size="sm"
            onClick={clearFilters}
            className="text-sm text-green-800"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}

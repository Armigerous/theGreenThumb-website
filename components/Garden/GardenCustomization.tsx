import { Label } from "@/components/ui/label";
import { UserGardens } from "@/types/garden";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface PlantSearchResult {
  slug: string;
  scientific_name: string;
  common_name: string;
}

interface SelectedPlant {
  slug: string;
  scientific_name: string;
  common_name: string;
}

/**
 * GardenCustomization Component - Specific Plants & Recommendations
 *
 * Database field mapping:
 * - specificPlantIds -> specific_plant_ids (jsonb array) in userGardens table
 * - wantsRecommendations -> wants_recommendations (boolean) in userGardens table
 */
interface GardenCustomizationProps {
  settings: UserGardens;
  setSettings: React.Dispatch<React.SetStateAction<UserGardens>>;
}

const GardenCustomization = ({
  settings,
  setSettings,
}: GardenCustomizationProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [plants, setPlants] = useState<PlantSearchResult[]>([]);
  const [useCommonNames, setUseCommonNames] = useState(true);
  const [selectedPlants, setSelectedPlants] = useState<SelectedPlant[]>([]);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Ensure values exist
  const specificPlantIds = settings?.specificPlantIds || [];
  const wantsRecommendations = settings?.wantsRecommendations ?? true;

  // Load selected plants on component mount
  useEffect(() => {
    const loadSelectedPlants = async () => {
      try {
        const plants = await Promise.all(
          specificPlantIds.map(async (scientificSlug) => {
            const response = await fetch(`/plant/${scientificSlug}`);
            if (!response.ok) return null;
            return response.json();
          })
        );
        setSelectedPlants(plants.filter((p): p is SelectedPlant => p !== null));
      } catch (error) {
        console.error("Error loading selected plants:", error);
      }
    };
    loadSelectedPlants();
  }, [specificPlantIds]);

  // Handle plant search
  const handleSearch = async (query: string) => {
    try {
      const url =
        query.trim() === ""
          ? `/api/plants/search?nameType=${useCommonNames ? "common" : "scientific"}`
          : `/api/plants/search?query=${encodeURIComponent(query.trim())}&nameType=${useCommonNames ? "common" : "scientific"}`;

      const response = await fetch(url);
      const result = await response.json();
      setPlants(result.results);
    } catch (error) {
      console.error("Error fetching plants:", error);
    }
  };

  // Handle adding a plant to the garden
  const handleAddPlant = (plant: PlantSearchResult) => {
    const scientificSlug = plant.scientific_name
      .toLowerCase()
      .replace(/\s+/g, "-");
    if (!specificPlantIds.includes(scientificSlug)) {
      setSettings({
        ...settings,
        specificPlantIds: [...specificPlantIds, scientificSlug],
      });
      setSelectedPlants([...selectedPlants, plant]);
    }
    setOpen(false);
  };

  // Handle removing a plant from the garden
  const handleRemovePlant = (plantId: string) => {
    setSettings({
      ...settings,
      specificPlantIds: specificPlantIds.filter((id) => id !== plantId),
    });
    setSelectedPlants(
      selectedPlants.filter((plant) => {
        const scientificSlug = plant.scientific_name
          .toLowerCase()
          .replace(/\s+/g, "-");
        return scientificSlug !== plantId;
      })
    );
  };

  // Highlight matching text in search results
  const highlightMatch = (text: string | undefined, query: string) => {
    if (!text) return null;
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Specific Plants</Label>
              <p className="text-base text-primary font-medium">
                Search and select specific plants for your garden
              </p>
              <p className="text-sm text-muted-foreground">
                Use the search box to find and add plants to your garden
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-start mb-2">
                <Switch
                  id="useCommonNames"
                  checked={useCommonNames}
                  onCheckedChange={setUseCommonNames}
                />
                <Label htmlFor="useCommonNames" className="text-sm ml-2">
                  {useCommonNames
                    ? "Using Common Names"
                    : "Using Scientific Names"}
                </Label>
              </div>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    ref={triggerRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-start"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    {searchQuery || "Search for plants..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="p-0"
                  style={{
                    width: triggerRef.current?.offsetWidth || "auto",
                  }}
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <Command>
                    <CommandInput
                      placeholder="Search plants..."
                      value={searchQuery}
                      onValueChange={(value) => {
                        setSearchQuery(value);
                        handleSearch(value);
                      }}
                    />
                    <CommandList>
                      {plants.length > 0 ? (
                        <CommandGroup heading="Available Plants">
                          {plants.map((plant) => (
                            <CommandItem
                              key={`${plant.slug}-${plant.scientific_name}-${plant.common_name}`}
                              onSelect={() => handleAddPlant(plant)}
                              className="cursor-pointer hover:bg-brand-100"
                              value={
                                useCommonNames
                                  ? plant.common_name
                                  : plant.scientific_name
                              }
                            >
                              <span>
                                {highlightMatch(
                                  useCommonNames
                                    ? plant.common_name
                                    : plant.scientific_name,
                                  searchQuery
                                )}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ) : (
                        <CommandEmpty>
                          No plants found.
                          <div>
                            <p>Try searching for a different plant name.</p>
                          </div>
                        </CommandEmpty>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <div className="flex flex-wrap gap-2">
                {selectedPlants.map((plant) => (
                  <Badge
                    key={`${plant.slug}-${plant.scientific_name}-${plant.common_name}`}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {useCommonNames ? plant.common_name : plant.scientific_name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => handleRemovePlant(plant.slug)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Recommendations</Label>
              <p className="text-base text-primary font-medium">
                Would you like to receive personalized plant recommendations?
              </p>
              <p className="text-sm text-muted-foreground">
                Toggle on to get suggestions based on your garden preferences
              </p>
            </div>
            <div className="flex items-center justify-between border rounded-md p-3 bg-muted/20">
              <Label
                htmlFor="wantsRecommendations"
                className="text-sm font-normal"
              >
                Enable personalized recommendations
              </Label>
              <Switch
                id="wantsRecommendations"
                checked={wantsRecommendations}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, wantsRecommendations: checked })
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GardenCustomization;

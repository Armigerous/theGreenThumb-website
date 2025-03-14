import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserGardens, getFilterOptions } from "@/types/garden";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * GardenBasicInfo Component
 *
 * Database field mapping:
 * - name -> name (string) in userGardens table
 * - ncRegionsIds -> nc_regions_ids (jsonb array) in userGardens table
 * - usda_zones_ids -> usda_zones_ids (jsonb array) in userGardens table
 * - sunlightIds -> sunlight_ids (jsonb array) in userGardens table
 * - soilTypeIds -> soil_texture_ids (jsonb array) in userGardens table
 * - soilPhIds -> soil_ph_ids (jsonb array) in userGardens table
 * - soilDrainageIds -> soil_drainage_ids (jsonb array) in userGardens table
 * - spaceAvailableIds -> space_available_ids (jsonb array) in userGardens table
 */
interface GardenBasicInfoProps {
  settings: UserGardens;
  setSettings: React.Dispatch<React.SetStateAction<UserGardens>>;
}

const GardenBasicInfo = ({ settings, setSettings }: GardenBasicInfoProps) => {
  // Get options from filter data
  const regionOptions = getFilterOptions("nc-regions");
  const zoneOptions = getFilterOptions("usda-zone");
  const lightOptions = getFilterOptions("light");
  const soilTextureOptions = getFilterOptions("soil-texture");
  const soilPhOptions = getFilterOptions("soil-ph");
  const soilDrainageOptions = getFilterOptions("soil-drainage");
  const spaceOptions = getFilterOptions("available-space-to-plant");

  // Ensure values exist (use empty string as fallback for string values)
  const name = settings?.name || "";
  const ncRegionsIds = settings?.ncRegionsIds || [];
  const usda_zones_ids = settings?.usda_zones_ids || [];
  const sunlightIds = settings?.sunlightIds || [];
  const soilTypeIds = settings?.soilTypeIds || [];
  const soilPhIds = settings?.soilPhIds || [];
  const soilDrainageIds = settings?.soilDrainageIds || [];
  const spaceAvailableIds = settings?.spaceAvailableIds || [];

  const handleRegionChange = (value: string) => {
    // If "Other" is selected, we'll handle it differently
    if (value === "Other") {
      setSettings({ ...settings, ncRegionsIds: ["Other"] });
    } else {
      setSettings({ ...settings, ncRegionsIds: [value] });
    }
  };

  const handleZoneChange = (value: string) => {
    setSettings({ ...settings, usda_zones_ids: [value] });
  };

  const handleSpaceChange = (value: string) => {
    setSettings({ ...settings, spaceAvailableIds: [value] });
  };

  const handleLightChange = (light: string, checked: boolean) => {
    if (checked) {
      setSettings({
        ...settings,
        sunlightIds: [...(settings.sunlightIds || []), light],
      });
    } else {
      setSettings({
        ...settings,
        sunlightIds: (settings.sunlightIds || []).filter((l) => l !== light),
      });
    }
  };

  const handleSoilTextureChange = (texture: string, checked: boolean) => {
    if (checked) {
      setSettings({
        ...settings,
        soilTypeIds: [...(settings.soilTypeIds || []), texture],
      });
    } else {
      setSettings({
        ...settings,
        soilTypeIds: (settings.soilTypeIds || []).filter((t) => t !== texture),
      });
    }
  };

  const handleSoilPhChange = (ph: string, checked: boolean) => {
    if (checked) {
      setSettings({
        ...settings,
        soilPhIds: [...(settings.soilPhIds || []), ph],
      });
    } else {
      setSettings({
        ...settings,
        soilPhIds: (settings.soilPhIds || []).filter((p) => p !== ph),
      });
    }
  };

  const handleSoilDrainageChange = (drainage: string, checked: boolean) => {
    if (checked) {
      setSettings({
        ...settings,
        soilDrainageIds: [...(settings.soilDrainageIds || []), drainage],
      });
    } else {
      setSettings({
        ...settings,
        soilDrainageIds: (settings.soilDrainageIds || []).filter(
          (d) => d !== drainage
        ),
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Garden Name</Label>
              <p className="text-base text-primary font-medium">
                What would you like to name your garden?
              </p>
              <p className="text-sm text-muted-foreground">
                A simple name to distinguish between multiple gardens you manage
              </p>
            </div>
            <Input
              id="name"
              placeholder="Front Yard Flower Beds"
              value={name}
              onChange={(e) =>
                setSettings({ ...settings, name: e.target.value })
              }
              className="border rounded-md bg-muted/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-lg font-semibold">NC Region</Label>
                <p className="text-base text-primary font-medium">
                  Which region of North Carolina is your garden in?
                </p>
                <p className="text-sm text-muted-foreground">
                  Select the region where your garden is located
                </p>
              </div>
              <Select
                value={ncRegionsIds[0] || ""}
                onValueChange={handleRegionChange}
              >
                <SelectTrigger
                  id="ncRegionsIds"
                  className="border rounded-md bg-muted/20"
                >
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                  {regionOptions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-lg font-semibold">USDA Zone</Label>
                <p className="text-base text-primary font-medium">
                  What is your USDA hardiness zone?
                </p>
                <p className="text-sm text-muted-foreground">
                  Select your zone for plant compatibility
                </p>
              </div>
              <Select
                value={usda_zones_ids[0] || ""}
                onValueChange={handleZoneChange}
              >
                <SelectTrigger
                  id="usda_zones_ids"
                  className="border rounded-md bg-muted/20"
                >
                  <SelectValue placeholder="Select a zone" />
                </SelectTrigger>
                <SelectContent>
                  {zoneOptions.map((zone) => (
                    <SelectItem key={zone} value={zone}>
                      {zone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-lg font-semibold">
                Light Requirements
              </Label>
              <p className="text-base text-primary font-medium">
                How much sunlight does your garden area receive?
              </p>
              <p className="text-sm text-muted-foreground">
                Select the light conditions in your garden
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 border rounded-md p-3 bg-muted/20">
              {lightOptions.map((light) => (
                <div key={light} className="flex items-center space-x-2">
                  <Checkbox
                    id={`light-${light}`}
                    checked={(sunlightIds || []).includes(light)}
                    onCheckedChange={(checked) =>
                      handleLightChange(light, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`light-${light}`}
                    className="text-sm font-normal"
                  >
                    {light}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Soil Profile</Label>
              <p className="text-base text-primary font-medium">
                What are your soil characteristics?
              </p>
              <p className="text-sm text-muted-foreground">
                Select the properties of your garden soil
              </p>
            </div>

            <div className="space-y-4 border rounded-md p-4 bg-muted/20">
              <div className="space-y-3">
                <p className="text-sm font-medium">Soil Texture</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {soilTextureOptions.map((texture) => (
                    <div key={texture} className="flex items-center space-x-2">
                      <Checkbox
                        id={`soil-texture-${texture}`}
                        checked={(soilTypeIds || []).includes(texture)}
                        onCheckedChange={(checked) =>
                          handleSoilTextureChange(texture, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`soil-texture-${texture}`}
                        className="text-sm font-normal"
                      >
                        {texture}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">Soil pH</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {soilPhOptions.map((ph) => (
                    <div key={ph} className="flex items-center space-x-2">
                      <Checkbox
                        id={`soil-ph-${ph}`}
                        checked={(soilPhIds || []).includes(ph)}
                        onCheckedChange={(checked) =>
                          handleSoilPhChange(ph, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`soil-ph-${ph}`}
                        className="text-sm font-normal"
                      >
                        {ph}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">Soil Drainage</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {soilDrainageOptions.map((drainage) => (
                    <div key={drainage} className="flex items-center space-x-2">
                      <Checkbox
                        id={`soil-drainage-${drainage}`}
                        checked={(soilDrainageIds || []).includes(drainage)}
                        onCheckedChange={(checked) =>
                          handleSoilDrainageChange(drainage, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`soil-drainage-${drainage}`}
                        className="text-sm font-normal"
                      >
                        {drainage}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Available Space</Label>
              <p className="text-base text-primary font-medium">
                How much space do you have for planting?
              </p>
              <p className="text-sm text-muted-foreground">
                Select how much room each plant can have in your garden
              </p>
            </div>
            <Select
              value={spaceAvailableIds[0] || ""}
              onValueChange={handleSpaceChange}
            >
              <SelectTrigger
                id="spaceAvailableIds"
                className="border rounded-md bg-muted/20"
              >
                <SelectValue placeholder="Select available space" />
              </SelectTrigger>
              <SelectContent>
                {spaceOptions.map((space) => (
                  <SelectItem key={space} value={space}>
                    {space}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GardenBasicInfo;

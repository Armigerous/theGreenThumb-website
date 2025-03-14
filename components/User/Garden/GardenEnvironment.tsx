import { Label } from "@/components/ui/label";
import { UserGardens, getFilterOptions } from "@/types/garden";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * GardenEnvironment Component
 *
 * Database field mapping:
 * - sunlightIds -> sunlight_ids (jsonb array) in userGardens table
 * - soilTypeIds -> soil_texture_ids (jsonb array) in userGardens table
 * - soilPhIds -> soil_ph_ids (jsonb array) in userGardens table
 * - soilDrainageIds -> soil_drainage_ids (jsonb array) in userGardens table
 */
interface GardenEnvironmentProps {
  settings: UserGardens;
  setSettings: React.Dispatch<React.SetStateAction<UserGardens>>;
}

const GardenEnvironment = ({
  settings,
  setSettings,
}: GardenEnvironmentProps) => {
  const lightOptions = getFilterOptions("light");
  const soilTextureOptions = getFilterOptions("soil-texture");
  const soilPhOptions = getFilterOptions("soil-ph");
  const soilDrainageOptions = getFilterOptions("soil-drainage");

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
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Sunlight</Label>
              <p className="text-base text-primary font-medium">
                How much sunlight does your garden receive daily?
              </p>
              <p className="text-sm text-muted-foreground">
                Select the light conditions in your garden area
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 border rounded-md p-3 bg-muted/20">
              {lightOptions.map((light) => (
                <div key={light} className="flex items-center space-x-2">
                  <Checkbox
                    id={`light-${light}`}
                    checked={(settings.sunlightIds || []).includes(light)}
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
              <Label className="text-lg font-semibold">Soil Texture</Label>
              <p className="text-base text-primary font-medium">
                What type of soil do you have?
              </p>
              <p className="text-sm text-muted-foreground">
                Select the soil texture in your garden area
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 border rounded-md p-3 bg-muted/20">
              {soilTextureOptions.map((texture) => (
                <div key={texture} className="flex items-center space-x-2">
                  <Checkbox
                    id={`soil-texture-${texture}`}
                    checked={(settings.soilTypeIds || []).includes(texture)}
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

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Soil Drainage</Label>
              <p className="text-base text-primary font-medium">
                What is the drainage condition of your soil?
              </p>
              <p className="text-sm text-muted-foreground">
                Select how well water drains through your soil
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 border rounded-md p-3 bg-muted/20">
              {soilDrainageOptions.map((drainage) => (
                <div key={drainage} className="flex items-center space-x-2">
                  <Checkbox
                    id={`soil-drainage-${drainage}`}
                    checked={(settings.soilDrainageIds || []).includes(
                      drainage
                    )}
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

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Soil pH</Label>
              <p className="text-base text-primary font-medium">
                Do you know your soil&apos;s pH level?
              </p>
              <p className="text-sm text-muted-foreground">
                Select the acidity or alkalinity of your soil
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 border rounded-md p-3 bg-muted/20">
              {soilPhOptions.map((ph) => (
                <div key={ph} className="flex items-center space-x-2">
                  <Checkbox
                    id={`soil-ph-${ph}`}
                    checked={(settings.soilPhIds || []).includes(ph)}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default GardenEnvironment;

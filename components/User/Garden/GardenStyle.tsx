import { Label } from "@/components/ui/label";
import { UserGardens, getFilterOptions } from "@/types/garden";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * GardenStyle Component
 *
 * Database field mapping:
 * - locationIds -> location_ids (jsonb array) in userGardens table
 * - gardenThemeIds -> garden_theme_ids (jsonb array) in userGardens table
 * - designFeatureIds -> design_feature_ids (jsonb array) in userGardens table
 */
interface GardenStyleProps {
  settings: UserGardens;
  setSettings: React.Dispatch<React.SetStateAction<UserGardens>>;
}

const GardenStyle = ({ settings, setSettings }: GardenStyleProps) => {
  const landscapeLocationOptions = getFilterOptions("location");
  const landscapeThemeOptions = getFilterOptions("landscape-theme");
  const designFeatureOptions = getFilterOptions("design-feature");

  const handleLocationChange = (location: string, checked: boolean) => {
    if (checked) {
      setSettings({
        ...settings,
        locationIds: [...(settings.locationIds || []), location],
      });
    } else {
      setSettings({
        ...settings,
        locationIds: (settings.locationIds || []).filter((l) => l !== location),
      });
    }
  };

  const handleThemeChange = (theme: string, checked: boolean) => {
    if (checked) {
      setSettings({
        ...settings,
        gardenThemeIds: [...(settings.gardenThemeIds || []), theme],
      });
    } else {
      setSettings({
        ...settings,
        gardenThemeIds: (settings.gardenThemeIds || []).filter(
          (t) => t !== theme
        ),
      });
    }
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      setSettings({
        ...settings,
        designFeatureIds: [...(settings.designFeatureIds || []), feature],
      });
    } else {
      setSettings({
        ...settings,
        designFeatureIds: (settings.designFeatureIds || []).filter(
          (f) => f !== feature
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
              <Label className="text-lg font-semibold">Location</Label>
              <p className="text-base text-primary font-medium">
                Where is this garden located?
              </p>
              <p className="text-sm text-muted-foreground">
                Select where on your property this garden is located or how
                it&apos;s used
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 border rounded-md p-3 bg-muted/20">
              {landscapeLocationOptions.map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location}`}
                    checked={(settings.locationIds || []).includes(location)}
                    onCheckedChange={(checked) =>
                      handleLocationChange(location, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`location-${location}`}
                    className="text-sm font-normal"
                  >
                    {location}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Garden Themes</Label>
              <p className="text-base text-primary font-medium">
                What style of garden are you creating?
              </p>
              <p className="text-sm text-muted-foreground">
                Choose the style or theme of garden you&apos;re planning to
                create
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 border rounded-md p-3 bg-muted/20">
              {landscapeThemeOptions.map((theme) => (
                <div key={theme} className="flex items-center space-x-2">
                  <Checkbox
                    id={`theme-${theme}`}
                    checked={(settings.gardenThemeIds || []).includes(theme)}
                    onCheckedChange={(checked) =>
                      handleThemeChange(theme, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`theme-${theme}`}
                    className="text-sm font-normal"
                  >
                    {theme}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Design Features</Label>
              <p className="text-base text-primary font-medium">
                What special features would you like in your garden?
              </p>
              <p className="text-sm text-muted-foreground">
                Select specific design features you&apos;re interested in for
                your garden (optional)
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 border rounded-md p-3 bg-muted/20">
              {designFeatureOptions.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={`feature-${feature}`}
                    checked={(settings.designFeatureIds || []).includes(
                      feature
                    )}
                    onCheckedChange={(checked) =>
                      handleFeatureChange(feature, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`feature-${feature}`}
                    className="text-sm font-normal"
                  >
                    {feature}
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

export default GardenStyle;

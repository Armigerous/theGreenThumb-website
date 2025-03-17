"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@clerk/nextjs";
import {
  Leaf,
  Settings,
  Loader2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Droplets,
  ScanLine,
  CalendarClock,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { UserGardens, defaultUserGardens } from "@/types/garden";
import GardenBasicInfo from "@/components/User/Garden/GardenBasicInfo";
import GardenStyle from "@/components/User/Garden/GardenStyle";
import GardenWildlife from "@/components/User/Garden/GardenWildlife";
import GardenMaintenance from "@/components/User/Garden/GardenMaintenance";
import GardenAesthetics from "@/components/User/Garden/GardenAesthetics";
import GardenCustomization from "@/components/User/Garden/GardenCustomization";
import { toast } from "sonner";
import {
  GardenPageSkeleton,
  GardenTabContentSkeleton,
} from "@/components/User/Garden/GardenPageSkeleton";
import useSWR, { mutate } from "swr";
import Link from "next/link";

/*
 * Component to Database Field Mapping:
 *
 * GardenBasicInfo:
 * - name -> name (string)
 * - ncRegionsIds -> nc_regions_ids (jsonb array)
 * - usda_zones_ids -> usda_zones_ids (jsonb array)
 * - sunlightIds -> sunlight_ids (jsonb array)
 * - soilTextureIds -> soil_texture_ids (jsonb array)
 * - soilPhIds -> soil_ph_ids (jsonb array)
 * - soilDrainageIds -> soil_drainage_ids (jsonb array)
 * - spaceAvailableIds -> space_available_ids (jsonb array)
 *
 * GardenStyle:
 * - locationIds -> location_ids (jsonb array)
 * - gardenThemeIds -> garden_theme_ids (jsonb array)
 * - designFeatureIds -> design_feature_ids (jsonb array)
 *
 * GardenWildlife:
 * - wildlifeAttractionIds -> wildlife_attraction_ids (jsonb array)
 * - resistanceChallengeIds -> resistance_challenge_ids (jsonb array)
 * - problemsToExcludeIds -> problems_to_exclude_ids (jsonb array)
 *
 * GardenMaintenance:
 * - growthRateId -> growth_rate_id (bigint)
 * - maintenanceLevelId -> maintenance_level_id (bigint)
 * - texturePreferenceId -> texture_preference_id (bigint)
 * - habitFormIds -> habit_form_ids (jsonb array)
 * - plantTypeIds -> plant_type_ids (jsonb array)
 * - yearRoundInterest -> year_round_interest (boolean)
 *
 * GardenAesthetics:
 * - flowerColorIds -> flower_color_ids (jsonb array)
 * - flowerBloomTimeIds -> flower_bloom_time_ids (jsonb array)
 * - flowerValueIds -> flower_value_ids (jsonb array)
 * - leafColorIds -> leaf_color_ids (jsonb array)
 * - leafValueIds -> leaf_value_ids (jsonb array)
 * - fallColorIds -> fall_color_ids (jsonb array)
 *
 * GardenCustomization:
 * - specificPlantIds -> specific_plant_ids (jsonb array)
 * - wantsRecommendations -> wants_recommendations (boolean)
 */

// Create a wrapper to ensure user gardens are always complete
const ensureCompleteSettings = (
  partialSettings?: Partial<UserGardens>
): UserGardens => {
  // Start with the full defaultuserGardens
  const completeSettings = { ...defaultUserGardens };

  // Only merge if partialSettings exists
  if (partialSettings) {
    // For each array property, ensure it exists and is an array
    const arrayProperties: (keyof UserGardens)[] = [
      "ncRegionsIds",
      "usda_zones_ids",
      "sunlightIds",
      "soilTextureIds",
      "soilPhIds",
      "soilDrainageIds",
      "spaceAvailableIds",
      "gardenThemeIds",
      "locationIds",
      "designFeatureIds",
      "wildlifeAttractionIds",
      "resistanceChallengeIds",
      "problemsToExcludeIds",
      "flowerColorIds",
      "flowerBloomTimeIds",
      "flowerValueIds",
      "leafColorIds",
      "leafValueIds",
      "fallColorIds",
      "habitFormIds",
      "plantTypeIds",
    ];

    // Copy all properties from partialSettings, ensuring arrays exist
    Object.keys(partialSettings).forEach((key) => {
      const typedKey = key as keyof UserGardens;
      if (arrayProperties.includes(typedKey)) {
        // Ensure array properties are arrays
        (completeSettings[typedKey] as string[]) = Array.isArray(
          partialSettings[typedKey]
        )
          ? (partialSettings[typedKey] as string[])
          : [];
      } else {
        // Copy other properties safely
        (completeSettings[typedKey] as unknown) = partialSettings[typedKey];
      }
    });
  }

  return completeSettings;
};

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch garden settings");
  }
  const data = await response.json();
  if (!data.settings) {
    return defaultUserGardens;
  }

  // Map database fields to frontend model
  const dbSettings = data.settings;
  return {
    ...defaultUserGardens,
    name: dbSettings.name || "Default Garden",
    ncRegionsIds: dbSettings.ncRegionsIds || [],
    usda_zones_ids: dbSettings.usda_zones_ids || [],
    sunlightIds: dbSettings.sunlightIds || [],
    soilTextureIds: dbSettings.soilTextureIds || [],
    soilPhIds: dbSettings.soilPhIds || [],
    soilDrainageIds: dbSettings.soilDrainageIds || [],
    gardenThemeIds: dbSettings.gardenThemeIds || [],
    locationIds: dbSettings.locationIds || [],
    wildlifeAttractionIds: dbSettings.wildlifeAttractionIds || [],
    resistanceChallengeIds: dbSettings.resistanceChallengeIds || [],
    problemsToExcludeIds: dbSettings.problemsToExcludeIds || [],
    specificPlantIds: dbSettings.specificPlantIds || [],
    wantsRecommendations: dbSettings.wantsRecommendations || true,
    growthRateId: dbSettings.growthRateId
      ? Number(dbSettings.growthRateId)
      : undefined,
    maintenanceLevelId: dbSettings.maintenanceLevelId
      ? Number(dbSettings.maintenanceLevelId)
      : undefined,
    texturePreferenceId: dbSettings.texturePreferenceId
      ? Number(dbSettings.texturePreferenceId)
      : undefined,
    habitFormIds: dbSettings.habitFormIds || [],
    plantTypeIds: dbSettings.plantTypeIds || [],
    yearRoundInterest: dbSettings.yearRoundInterest || false,
    flowerColorIds: dbSettings.flowerColorIds || [],
    flowerBloomTimeIds: dbSettings.flowerBloomTimeIds || [],
    flowerValueIds: dbSettings.flowerValueIds || [],
    leafColorIds: dbSettings.leafColorIds || [],
    leafValueIds: dbSettings.leafValueIds || [],
    fallColorIds: dbSettings.fallColorIds || [],
    spaceAvailableIds: dbSettings.spaceAvailableIds || [],
    designFeatureIds: dbSettings.designFeatureIds || [],
  };
};

export default function MyGardenPage() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState("basics");
  const [isSwitchingTabs, setIsSwitchingTabs] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(
    new Set(["basic"])
  );
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

  // Define tab order
  const tabOrder = [
    "basic",
    "style",
    "wildlife",
    "maintenance",
    "aesthetics",
    "customization",
  ];

  // Function to handle next tab navigation
  const handleNextTab = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      handleTabChange(tabOrder[currentIndex + 1]);
    }
  };

  // Use SWR for data fetching
  const {
    data: userGardens,
    error,
    isLoading,
    isValidating,
  } = useSWR<UserGardens>(
    isLoaded && user ? "/api/user-gardens" : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // 10 seconds
      focusThrottleInterval: 5000, // 5 seconds
    }
  );

  // Wrapper to ensure we never set incomplete settings and handle updates
  const updateUserGarden = async (
    newSettings: UserGardens | ((prev: UserGardens) => UserGardens)
  ) => {
    // Mark that we have unsaved changes
    setHasUnsavedChanges(true);

    // Update the local cache immediately
    const updatedSettings =
      typeof newSettings === "function"
        ? newSettings(userGardens || defaultUserGardens)
        : newSettings;

    // Update the SWR cache
    mutate("/api/user-gardens", ensureCompleteSettings(updatedSettings), false);
  };

  const saveUserGarden = async () => {
    try {
      setIsSaving(true);
      // Map the frontend settings to the database structure
      const mappedSettings = {
        name: userGardens?.name || "Default Garden",
        locationIds: userGardens?.locationIds || [],
        spaceAvailableIds: userGardens?.spaceAvailableIds || [],
        soilPhIds: userGardens?.soilPhIds || [],
        soilTextureIds: userGardens?.soilTextureIds || [],
        soilDrainageIds: userGardens?.soilDrainageIds || [],
        usda_zones_ids: userGardens?.usda_zones_ids || [],
        ncRegionsIds: userGardens?.ncRegionsIds || [],
        sunlightIds: userGardens?.sunlightIds || [],
        gardenThemeIds: userGardens?.gardenThemeIds || [],
        wildlifeAttractionIds: userGardens?.wildlifeAttractionIds || [],
        resistanceChallengeIds: userGardens?.resistanceChallengeIds || [],
        problemsToExcludeIds: userGardens?.problemsToExcludeIds || [],
        growthRateId: userGardens?.growthRateId || null,
        maintenanceLevelId: userGardens?.maintenanceLevelId || null,
        texturePreferenceId: userGardens?.texturePreferenceId || null,
        habitFormIds: userGardens?.habitFormIds || [],
        plantTypeIds: userGardens?.plantTypeIds || [],
        yearRoundInterest: userGardens?.yearRoundInterest || false,
        userPlantsId: userGardens?.userPlantsId || [],
        wantsRecommendations: userGardens?.wantsRecommendations || true,
        flowerColorIds: userGardens?.flowerColorIds || [],
        flowerBloomTimeIds: userGardens?.flowerBloomTimeIds || [],
        flowerValueIds: userGardens?.flowerValueIds || [],
        leafColorIds: userGardens?.leafColorIds || [],
        leafValueIds: userGardens?.leafValueIds || [],
        fallColorIds: userGardens?.fallColorIds || [],
        designFeatureIds: userGardens?.designFeatureIds || [],
      };

      const response = await fetch("/api/user-gardens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mappedSettings),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      // Revalidate the data after successful save
      mutate("/api/user-gardens");
      setHasUnsavedChanges(false);
      toast.success("Your garden settings have been saved");
    } catch (error) {
      console.error("Error saving user gardens:", error);
      toast.error("Failed to save your garden settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTabChange = (value: string) => {
    // Mark this tab as visited
    const newVisitedTabs = new Set(visitedTabs);
    newVisitedTabs.add(value);
    setVisitedTabs(newVisitedTabs);

    // Set switching tabs state to true
    setIsSwitchingTabs(true);

    // Change the active tab
    setActiveTab(value);

    // Reset switching tabs state after a short delay
    setTimeout(() => {
      setIsSwitchingTabs(false);
    }, 100);
  };

  if (!isLoaded || isLoading) {
    return <GardenPageSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">
          Please sign in to access your garden
        </h1>
        <p>You need to be signed in to view and manage your garden.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-500">
          Error loading garden data: {error.message}
        </p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  // Make sure we always have complete settings to render with
  const safeUserGardens = ensureCompleteSettings(userGardens);

  // Determine if we should show the loading skeleton for the current tab
  const shouldShowTabSkeleton = isValidating && !isSwitchingTabs;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">My Garden</h2>
          <p className="text-muted-foreground">
            Customize your garden preferences.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
            className="md:w-auto w-full"
          >
            <Settings className="h-4 w-4 mr-2" />
            Garden Settings
            {isSettingsExpanded ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>

          <Link href="/my-garden/my-plants">
            <Button variant="outline" className="md:w-auto w-full">
              <Leaf className="h-4 w-4 mr-2" />
              My Plants
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-8 w-full max-w-full overflow-hidden">
        <CardHeader
          className="flex flex-row items-center justify-between gap-4 cursor-pointer"
          onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
        >
          <div className="flex items-center">
            <Settings className="h-6 w-6 mr-2 text-primary" />
            <CardTitle>Garden Settings</CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full sm:w-auto"
              onClick={saveUserGarden}
              disabled={isValidating || !hasUnsavedChanges || isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Settings className="h-4 w-4" />
              )}
              {isSaving
                ? "Saving..."
                : hasUnsavedChanges
                  ? "Save Changes"
                  : "All Changes Saved"}
            </Button>
            {isSettingsExpanded ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </div>
        </CardHeader>
        {isSettingsExpanded && (
          <CardContent className="px-4 sm:px-6">
            <p className="text-muted-foreground mb-6">
              Configure your garden preferences to get personalized plant
              recommendations and gardening advice.
            </p>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="wildlife">Wildlife</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                <TabsTrigger value="aesthetics">Aesthetics</TabsTrigger>
                <TabsTrigger value="customization">Customize</TabsTrigger>
              </TabsList>

              {shouldShowTabSkeleton ? (
                <GardenTabContentSkeleton activeTab={activeTab} />
              ) : (
                <>
                  <TabsContent value="basic">
                    <GardenBasicInfo
                      settings={safeUserGardens}
                      setSettings={updateUserGarden}
                    />
                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleNextTab} className="gap-2">
                        Next: Style <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="style">
                    <GardenStyle
                      settings={safeUserGardens}
                      setSettings={updateUserGarden}
                    />
                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleNextTab} className="gap-2">
                        Next: Wildlife <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="wildlife">
                    <GardenWildlife
                      settings={safeUserGardens}
                      setSettings={updateUserGarden}
                    />
                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleNextTab} className="gap-2">
                        Next: Maintenance <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="maintenance">
                    <GardenMaintenance
                      settings={safeUserGardens}
                      setSettings={updateUserGarden}
                    />
                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleNextTab} className="gap-2">
                        Next: Aesthetics <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="aesthetics">
                    <GardenAesthetics
                      settings={safeUserGardens}
                      setSettings={updateUserGarden}
                    />
                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleNextTab} className="gap-2">
                        Next: Customize <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="customization">
                    <GardenCustomization
                      settings={safeUserGardens}
                      setSettings={updateUserGarden}
                    />
                  </TabsContent>
                </>
              )}
            </Tabs>
          </CardContent>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <ScanLine className="w-5 h-5 mr-2" />
                Garden Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Track your garden&apos;s health and upcoming care tasks.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors duration-200">
                  <div className="flex items-start">
                    <CalendarClock className="h-5 w-5 mr-3 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium mb-2">Upcoming Care</h3>
                      <p className="text-sm text-muted-foreground">
                        No upcoming care tasks scheduled. Add plants and care
                        logs to see recommendations.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors duration-200">
                  <div className="flex items-start">
                    <Droplets className="h-5 w-5 mr-3 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium mb-2">Garden Health</h3>
                      <p className="text-sm text-muted-foreground">
                        Add plants to your garden to track overall health
                        status.
                      </p>
                      <div className="w-full mt-3 bg-muted/30 rounded-full h-2.5">
                        <div className="bg-green-400 h-2.5 rounded-full w-0"></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        No plants added yet
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Leaf className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage your garden and plants.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Plant
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarClock className="mr-2 h-4 w-4" />
                  Schedule Care
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Garden Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

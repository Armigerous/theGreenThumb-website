import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { PlantCardResult, SupabasePlantData } from "@/types/plant";

/**
 * This map tells us how each "filter key" (e.g. "light") maps to
 * the actual Supabase relationships. We'll ultimately call something like:
 *
 *   .eq("lightMapping.lightLookup.name", "Full Sun")
 */
const FILTER_MAP: Record<
  string,
  { mappingTable: string; lookupTable: string }
> = {
  light: {
    mappingTable: "lightMapping",
    lookupTable: "lightLookup",
  },
  "soil-texture": {
    mappingTable: "soilTextureMapping",
    lookupTable: "soilTextureLookup",
  },
  "soil-ph": {
    mappingTable: "soilPhMapping",
    lookupTable: "soilPhLookup",
  },
  "soil-drainage": {
    mappingTable: "soilDrainageMapping",
    lookupTable: "soilDrainageLookup",
  },
  "available-space-to-plant": {
    mappingTable: "availableSpaceToPlantMapping",
    lookupTable: "availableSpaceToPlantLookup",
  },
  "nc-region": {
    mappingTable: "ncRegionMapping",
    lookupTable: "ncRegionLookup",
  },
  "usda-zone": {
    mappingTable: "usdaZoneMapping",
    lookupTable: "usdaZoneLookup",
  },
  location: {
    mappingTable: "landscapeLocationMapping",
    lookupTable: "landscapeLocationLookup",
  },
  // Advanced
  "landscape-theme": {
    mappingTable: "landscapeThemeMapping",
    lookupTable: "landscapeThemeLookup",
  },
  "design-feature": {
    mappingTable: "designFeatureMapping",
    lookupTable: "designFeatureLookup",
  },
  attracts: {
    mappingTable: "attractsMapping",
    lookupTable: "attractsLookup",
  },
  "resistance-to-challenges": {
    mappingTable: "resistanceToChallengesMapping",
    lookupTable: "resistanceToChallengesLookup",
  },
  "problems-to-exclude": {
    mappingTable: "problemsMapping",
    lookupTable: "problemsLookup",
  },
  "plant-type": {
    mappingTable: "plantTypesMapping",
    lookupTable: "plantTypesLookup",
  },
  "woody-plant-leaf-characteristics": {
    mappingTable: "leafCharacteristicsMapping",
    lookupTable: "leafCharacteristicsLookup",
  },
  "habit-form": {
    mappingTable: "habitMapping",
    lookupTable: "habitLookup",
  },
  "growth-rate": {
    mappingTable: "growthRateMapping",
    lookupTable: "growthRateLookup",
  },
  maintenance: {
    mappingTable: "maintenanceMapping",
    lookupTable: "maintenanceLookup",
  },
  texture: {
    mappingTable: "textureMapping",
    lookupTable: "textureLookup",
  },
  "flower-color": {
    mappingTable: "flowerColorMapping",
    lookupTable: "flowerColorLookup",
  },
  "flower-value-to-gardener": {
    mappingTable: "flowerValueToGardenerMapping",
    lookupTable: "flowerValueToGardenerLookup",
  },
  "flower-bloom-time": {
    mappingTable: "flowerBloomTimeMapping",
    lookupTable: "flowerBloomTimeLookup",
  },
  "leaf-color": {
    mappingTable: "leafColorMapping",
    lookupTable: "leafColorLookup",
  },
  "leaf-texture": {
    mappingTable: "leafFeelMapping",
    lookupTable: "leafFeelLookup",
  },
  "leaf-value-to-gardener": {
    mappingTable: "leafValueToGardenerMapping",
    lookupTable: "leafValueToGardenerLookup",
  },
  "deciduous-leaf-fall-color": {
    mappingTable: "leafFallColorMapping",
    lookupTable: "leafFallColorLookup",
  },
  "leaf-margin": {
    mappingTable: "leafMarginMapping",
    lookupTable: "leafMarginLookup",
  },
  "leaf-shape": {
    mappingTable: "leafShapeMapping",
    lookupTable: "leafShapeLookup",
  },
  "leaf-type": {
    mappingTable: "leafTypeMapping",
    lookupTable: "leafTypeLookup",
  },
  "life-cycle": {
    mappingTable: "lifeCycleMapping",
    lookupTable: "lifeCycleLookup",
  },
  "stem-color": {
    mappingTable: "stemColorMapping",
    lookupTable: "stemColorLookup",
  },
  "fruit-color": {
    mappingTable: "fruitColorMapping",
    lookupTable: "fruitColorLookup",
  },
  "fruit-value-to-gardener": {
    mappingTable: "fruitValueToGardenerMapping",
    lookupTable: "fruitValueToGardenerLookup",
  },
};

/**
 * Attempt to parse a parameter key like:
 *   "cultural-conditions-light-Dappled Sunlight..." => filterKey="light", filterValue="Dappled Sunlight..."
 *   "whole-plant-traits-growth-rate-Medium" => filterKey="growth-rate", filterValue="Medium"
 */
function parseFilterKeyAndValue(
  paramKey: string
): { filterKey: string; filterValue: string } | null {
  const splitted = paramKey.split("-");
  // The last portion is presumably the filter "value."
  const possibleValue = splitted[splitted.length - 1];

  // We'll find a filterKey in splitted.slice(i, splitted.length - 1) joined by "-"
  // For example, splitted = ["cultural","conditions","light","Dappled Sunlight..."]
  // i=1 => candidate="conditions-light"
  // i=2 => candidate="light" => if in FILTER_MAP, we found it.
  for (let i = 1; i < splitted.length; i++) {
    const candidate = splitted.slice(i, splitted.length - 1).join("-");
    if (FILTER_MAP[candidate]) {
      return {
        filterKey: candidate,
        filterValue: decodeURIComponent(possibleValue),
      };
    }
  }
  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query")?.toLowerCase() || "";
  const limit = Number(searchParams.get("limit") || 28);
  const offset = Number(searchParams.get("offset") || 0);

  // If you’re bundling all filters into one param, e.g. “filters=cultural-conditions-light-Full+Sun,...”
  // then parse them below. If you’re using multiple parameters, you can gather them differently.
  const filtersParam = searchParams.get("filters") || "";

  try {
    // Base query:
    // @ts-expect-error: Type instantiation is excessively deep due to complex Supabase response types
    let supabaseQuery = supabase
      .from("mainPlantData")
      .select(
        `
          slug,
          description,
          scientificNames!inner ( scientificName ),
          commonNames ( commonName ),
          plantImages ( img, altText, caption, attribution ),
          tagsMapping (
            tagId,
            tagsLookup ( name )
          ),
          lightMapping!inner ( lightLookup!inner ( name ) ),
          soilTextureMapping!inner ( soilTextureLookup!inner ( name ) ),
          soilPhMapping!inner ( soilPhLookup!inner ( name ) ),
          soilDrainageMapping!inner ( soilDrainageLookup!inner ( name ) ),
          availableSpaceToPlantMapping!inner ( availableSpaceToPlantLookup!inner ( name ) ),
          ncRegionMapping!inner ( ncRegionLookup!inner ( name ) ),
          usdaZoneMapping!inner ( usdaZoneLookup!inner ( name ) ),
          landscapeLocationMapping!inner ( landscapeLocationLookup!inner ( name ) ),
          landscapeThemeMapping!inner ( landscapeThemeLookup!inner ( name ) ),
          designFeatureMapping!inner ( designFeatureLookup!inner ( name ) ),
          attractsMapping!inner ( attractsLookup!inner ( name ) ),
          resistanceToChallengesMapping!inner ( resistanceToChallengesLookup!inner ( name ) ),
          problemsMapping!inner ( problemsLookup!inner ( name ) ),
          plantTypesMapping!inner ( plantTypesLookup!inner ( name ) ),
          leafCharacteristicsMapping!inner ( leafCharacteristicsLookup!inner ( name ) ),
          habitMapping!inner ( habitLookup!inner ( name ) ),
          growthRateMapping!inner ( growthRateLookup!inner ( name ) ),
          maintenanceMapping!inner ( maintenanceLookup!inner ( name ) ),
          textureMapping!inner ( textureLookup!inner ( name ) ),
          flowerColorMapping!inner ( flowerColorLookup!inner ( name ) ),
          flowerValueToGardenerMapping!inner ( flowerValueToGardenerLookup!inner ( name ) ),
          flowerBloomTimeMapping!inner ( flowerBloomTimeLookup!inner ( name ) ),
          leafColorMapping!inner ( leafColorLookup!inner ( name ) ),
          leafFeelMapping!inner ( leafFeelLookup!inner ( name ) ),
          leafValueToGardenerMapping!inner ( leafValueToGardenerLookup!inner ( name ) ),
          leafFallColorMapping!inner ( leafFallColorLookup!inner ( name ) ),
          leafMarginMapping!inner ( leafMarginLookup!inner ( name ) ),
          leafShapeMapping!inner ( leafShapeLookup!inner ( name ) ),
          leafTypeMapping!inner ( leafTypeLookup!inner ( name ) ),
          lifeCycleMapping!inner ( lifeCycleLookup!inner ( name ) ),
          stemColorMapping!inner ( stemColorLookup!inner ( name ) ),
          fruitColorMapping!inner ( fruitColorLookup!inner ( name ) ),
          fruitValueToGardenerMapping!inner ( fruitValueToGardenerLookup!inner ( name ) )
        `,
        { count: "exact" }
      )
      .range(offset, offset + limit - 1);

    // 1) Filter by “query” => scientific name
    if (query) {
      supabaseQuery = supabaseQuery.ilike(
        "scientificNames.scientificName",
        `%${query}%`
      );
    }

    // 2) Parse the “filters” param if present
    if (filtersParam) {
      // Example: "cultural-conditions-light-Full+Sun,cultural-conditions-soil-texture-Clay"
      // Split on commas if that’s your chosen delimiter
      const rawFilters = filtersParam.split(",");
      for (const filterString of rawFilters) {
        const decodedFilterString = decodeURIComponent(filterString.trim());
        const parsed = parseFilterKeyAndValue(decodedFilterString);
        if (!parsed) continue; // couldn’t parse this filter param

        const { filterKey, filterValue } = parsed;
        const { mappingTable, lookupTable } = FILTER_MAP[filterKey] || {};
        if (!mappingTable || !lookupTable) continue; // unknown filterKey

        // Instead of .contains(...), we do .eq("lightMapping.lightLookup.name", filterValue)
        // Because the data is stored in separate “mapping” and “lookup” tables with *joins*.
        const columnPath = `${mappingTable}.${lookupTable}.name`;
        // e.g. "lightMapping.lightLookup.name"

        supabaseQuery = supabaseQuery.eq(columnPath, filterValue);
        // This means: "Only rows from mainPlantData that have a related record in lightMapping
        // joined to lightLookup with name = filterValue".
      }
    }

    // 3) Execute
    const { data, error, count } = await supabaseQuery;
    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 4) Transform the data for the front end
    const plants: PlantCardResult[] = (data as SupabasePlantData[]).map(
      (plant) => ({
        slug: plant.slug,
        description: plant.description,
        scientificName: plant.scientificNames?.[0]?.scientificName || "Unknown",
        commonName: plant.commonNames?.[0]?.commonName || "N/A",
        tag: plant.tagsMapping?.[0]?.tagsLookup?.name || "N/A",
        image: plant.plantImages?.[0]
          ? {
              img: plant.plantImages[0].img,
              altText: plant.plantImages[0].altText,
              caption: plant.plantImages[0].caption,
              attribution: plant.plantImages[0].attribution,
            }
          : {
              img: "/no-plant-image.png",
              altText: "No plant image available",
              caption: "",
              attribution: "",
            },
      })
    );

    return NextResponse.json({ results: plants, count });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

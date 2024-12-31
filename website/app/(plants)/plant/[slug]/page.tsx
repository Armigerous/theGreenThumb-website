// app/plant/[slug]/page.tsx

import React from "react";
import PlantDetails from "@/components/Database/Plant/PlantDetails";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import { supabase } from "@/lib/supabaseClient";
import { PlantData } from "@/types/plant";

// Revalidate every 24 hours (86400 seconds) for Incremental Static Regeneration
export const revalidate = 86400;

// Define the type for the response including all relationships
type MainPlantDataWithRelations = {
  id: number;
  slug: string;
  scientificNames: { scientificName: string }[];
  genus: string;
  species: string;
  family: string;
  sound_file: string | null;
  phonetic_spelling: string | null;
  description: string;
  profile_video: string | null;
  height_max: number | null;
  height_min: number | null;
  width_max: number | null;
  width_min: number | null;
  origin: string | null;
  distribution: string | null;
  uses: string | null;
  plantImages: {
    img: string | null;
    altText: string | null;
    caption: string | null;
    attribution: string | null;
  }[];
  wildlife_value: string | null;
  edibility: string | null;
  flower_description: string | null;
  leaf_description: string | null;
  fruit_description: string | null;
  stem_description: string | null;
  bark_description: string | null;
  poison_symptoms: string | null;
  poison_toxic_principle: string | null;
  tagsMapping: { tagsLookup: { name: string | null } }[];
  attractsMapping: { attractsLookup: { name: string | null } }[];
  availableSpaceToPlantMapping: {
    availableSpaceToPlantLookup: { name: string | null };
  }[];
  barkAttachmentMapping: { barkAttachmentLookup: { name: string | null } }[];
  barkColorMapping: { barkColorLookup: { name: string | null } }[];
  barkPlateShapeMapping: { barkPlateShapeLookup: { name: string | null } }[];
  designFeatureMapping: { designFeatureLookup: { name: string | null } }[];
  fireRiskMapping: { fireRiskLookup: { name: string | null } }[];
  flowerBloomTimeMapping: { flowerBloomTimeLookup: { name: string | null } }[];
  flowerColorMapping: { flowerColorLookup: { name: string | null } }[];
  flowerInflorescenceMapping: {
    flowerInflorescenceLookup: { name: string | null };
  }[];
  flowerPetalsMapping: { flowerPetalsLookup: { name: string | null } }[];
  flowerShapeMapping: { flowerShapeLookup: { name: string | null } }[];
  flowerSizeMapping: { flowerSizeLookup: { name: string | null } }[];
  flowerValueToGardenerMapping: {
    flowerValueToGardenerLookup: { name: string | null };
  }[];
  fruitColorMapping: { fruitColorLookup: { name: string | null } }[];
  fruitDisplayHarvestTimeMapping: {
    fruitDisplayHarvestTimeLookup: { name: string | null };
  }[];
  fruitLengthMapping: { fruitLengthLookup: { name: string | null } }[];
  fruitTypeMapping: { fruitTypeLookup: { name: string | null } }[];
  fruitValueToGardenerMapping: {
    fruitValueToGardenerLookup: { name: string | null };
  }[];
  fruitWidthMapping: { fruitWidthLookup: { name: string | null } }[];
  gardenSpacesMapping: { gardenSpacesLookup: { name: string | null } }[];
  growthRateMapping: { growthRateLookup: { name: string | null } }[];
  habitMapping: { habitLookup: { name: string | null } }[];
  landscapeLocationMapping: {
    landscapeLocationLookup: { name: string | null };
  }[];
  landscapeThemeMapping: { landscapeThemeLookup: { name: string | null } }[];
  leafArrangementMapping: { leafArrangementLookup: { name: string | null } }[];
  leafCharacteristicsMapping: {
    leafCharacteristicsLookup: { name: string | null };
  }[];
  leafColorMapping: { leafColorLookup: { name: string | null } }[];
  leafFallColorMapping: { leafFallColorLookup: { name: string | null } }[];
  leafFeelMapping: { leafFeelLookup: { name: string | null } }[];
  leafHairsPresentMapping: {
    leafHairsPresentLookup: { name: string | null };
  }[];
  leafLengthMapping: { leafLengthLookup: { name: string | null } }[];
  leafMarginMapping: { leafMarginLookup: { name: string | null } }[];
  leafShapeMapping: { leafShapeLookup: { name: string | null } }[];
  leafTypeMapping: { leafTypeLookup: { name: string | null } }[];
  leafValueToGardenerMapping: {
    leafValueToGardenerLookup: { name: string | null };
  }[];
  leafWidthMapping: { leafWidthLookup: { name: string | null } }[];
  lifeCycleMapping: { lifeCycleLookup: { name: string | null } }[];
  lightMapping: { lightLookup: { name: string | null } }[];
  maintenanceMapping: { maintenanceLookup: { name: string | null } }[];
  ncRegionMapping: { ncRegionLookup: { name: string | null } }[];
  plantTypesMapping: { plantTypesLookup: { name: string | null } }[];
  poisonDermatitisMapping: {
    poisonDermatitisLookup: { name: string | null };
  }[];
  poisonPartMapping: { poisonPartLookup: { name: string | null } }[];
  poisonSeverityMapping: { poisonSeverityLookup: { name: string | null } }[];
  problemsMapping: { problemsLookup: { name: string | null } }[];
  propagationMapping: { propagationLookup: { name: string | null } }[];
  resistanceToChallengesMapping: {
    resistanceToChallengesLookup: { name: string | null };
  }[];
  soilDrainageMapping: { soilDrainageLookup: { name: string | null } }[];
  soilPhMapping: { soilPhLookup: { name: string | null } }[];
  soilTextureMapping: { soilTextureLookup: { name: string | null } }[];
  stemAromaticMapping: { stemAromaticLookup: { name: string | null } }[];
  stemBudScalesMapping: { stemBudScalesLookup: { name: string | null } }[];
  stemBudTerminalMapping: { stemBudTerminalLookup: { name: string | null } }[];
  stemBudsMapping: { stemBudsLookup: { name: string | null } }[];
  stemColorMapping: { stemColorLookup: { name: string | null } }[];
  stemCrossSectionMapping: {
    stemCrossSectionLookup: { name: string | null };
  }[];
  stemFormMapping: { stemFormLookup: { name: string | null } }[];
  stemLeafScarShapeMapping: {
    stemLeafScarShapeLookup: { name: string | null };
  }[];
  stemLenticelsMapping: { stemLenticelsLookup: { name: string | null } }[];
  stemPithMapping: { stemPithLookup: { name: string | null } }[];
  stemSurfaceMapping: { stemSurfaceLookup: { name: string | null } }[];
  textureMapping: { textureLookup: { name: string | null } }[];
  usdaZoneMapping: { usdaZoneLookup: { name: string | null } }[];
};

// Function to transform Supabase data to PlantData type
const transformPlantData = (
  plantData: MainPlantDataWithRelations
): PlantData => {
  return {
    id: plantData.id,
    slug: plantData.slug,
    scientificName: plantData.scientificNames?.[0]?.scientificName || "",
    genus: plantData.genus,
    species: plantData.species,
    family: plantData.family,
    soundFile: plantData.sound_file || "",
    phoneticSpelling: plantData.phonetic_spelling || "",
    description: plantData.description,
    profileVideo: plantData.profile_video || "",
    heightMax: plantData.height_max || 0,
    heightMin: plantData.height_min || 0,
    widthMax: plantData.width_max || 0,
    widthMin: plantData.width_min || 0,
    origin: plantData.origin || "",
    distribution: plantData.distribution || "",
    uses: plantData.uses || "",
    plantImages:
      plantData.plantImages?.map((image) => ({
        img: image.img || "",
        altText: image.altText || "",
        caption: image.caption || "",
        attribution: image.attribution || "",
      })) || [],
    wildlifeValue: plantData.wildlife_value || "",
    edibility: plantData.edibility || "",
    flowerDescription: plantData.flower_description || "",
    leafDescription: plantData.leaf_description || "",
    fruitDescription: plantData.fruit_description || "",
    stemDescription: plantData.stem_description || "",
    barkDescription: plantData.bark_description || "",
    poisonSymptoms: plantData.poison_symptoms || "",
    poisonToxicPrinciple: plantData.poison_toxic_principle || "",
    tags:
      plantData.tagsMapping
        ?.map((tag) => tag.tagsLookup?.name)
        .filter(Boolean) || [],
    attracts:
      plantData.attractsMapping
        ?.map((attract) => attract.attractsLookup?.name)
        .filter(Boolean) || [],
    availableSpaceToPlant:
      plantData.availableSpaceToPlantMapping
        ?.map((item) => item.availableSpaceToPlantLookup?.name)
        .filter(Boolean) || [],
    barkAttachment:
      plantData.barkAttachmentMapping
        ?.map((item) => item.barkAttachmentLookup?.name)
        .filter(Boolean) || [],
    barkColor:
      plantData.barkColorMapping
        ?.map((item) => item.barkColorLookup?.name)
        .filter(Boolean) || [],
    barkPlateShape:
      plantData.barkPlateShapeMapping
        ?.map((item) => item.barkPlateShapeLookup?.name)
        .filter(Boolean) || [],
    designFeatures:
      plantData.designFeatureMapping
        ?.map((item) => item.designFeatureLookup?.name)
        .filter(Boolean) || [],
    fireRisk:
      plantData.fireRiskMapping
        ?.map((item) => item.fireRiskLookup?.name)
        .filter(Boolean) || [],
    flowerBloomTime:
      plantData.flowerBloomTimeMapping
        ?.map((item) => item.flowerBloomTimeLookup?.name)
        .filter(Boolean) || [],
    flowerColor:
      plantData.flowerColorMapping
        ?.map((item) => item.flowerColorLookup?.name)
        .filter(Boolean) || [],
    flowerInflorescence:
      plantData.flowerInflorescenceMapping
        ?.map((item) => item.flowerInflorescenceLookup?.name)
        .filter(Boolean) || [],
    flowerPetals:
      plantData.flowerPetalsMapping
        ?.map((item) => item.flowerPetalsLookup?.name)
        .filter(Boolean) || [],
    flowerShape:
      plantData.flowerShapeMapping
        ?.map((item) => item.flowerShapeLookup?.name)
        .filter(Boolean) || [],
    flowerSize:
      plantData.flowerSizeMapping
        ?.map((item) => item.flowerSizeLookup?.name)
        .filter(Boolean) || [],
    flowerValueToGardener:
      plantData.flowerValueToGardenerMapping
        ?.map((item) => item.flowerValueToGardenerLookup?.name)
        .filter(Boolean) || [],
    fruitColor:
      plantData.fruitColorMapping
        ?.map((item) => item.fruitColorLookup?.name)
        .filter(Boolean) || [],
    fruitDisplayHarvestTime:
      plantData.fruitDisplayHarvestTimeMapping
        ?.map((item) => item.fruitDisplayHarvestTimeLookup?.name)
        .filter(Boolean) || [],
    fruitLength:
      plantData.fruitLengthMapping
        ?.map((item) => item.fruitLengthLookup?.name)
        .filter(Boolean) || [],
    fruitType:
      plantData.fruitTypeMapping
        ?.map((item) => item.fruitTypeLookup?.name)
        .filter(Boolean) || [],
    fruitValueToGardener:
      plantData.fruitValueToGardenerMapping
        ?.map((item) => item.fruitValueToGardenerLookup?.name)
        .filter(Boolean) || [],
    fruitWidth:
      plantData.fruitWidthMapping
        ?.map((item) => item.fruitWidthLookup?.name)
        .filter(Boolean) || [],
    gardenSpaces:
      plantData.gardenSpacesMapping
        ?.map((item) => item.gardenSpacesLookup?.name)
        .filter(Boolean) || [],
    growthRate:
      plantData.growthRateMapping
        ?.map((item) => item.growthRateLookup?.name)
        .filter(Boolean) || [],
    habit:
      plantData.habitMapping
        ?.map((item) => item.habitLookup?.name)
        .filter(Boolean) || [],
    landscapeLocation:
      plantData.landscapeLocationMapping
        ?.map((item) => item.landscapeLocationLookup?.name)
        .filter(Boolean) || [],
    landscapeTheme:
      plantData.landscapeThemeMapping
        ?.map((item) => item.landscapeThemeLookup?.name)
        .filter(Boolean) || [],
    leafArrangement:
      plantData.leafArrangementMapping
        ?.map((item) => item.leafArrangementLookup?.name)
        .filter(Boolean) || [],
    leafCharacteristics:
      plantData.leafCharacteristicsMapping
        ?.map((item) => item.leafCharacteristicsLookup?.name)
        .filter(Boolean) || [],
    leafColor:
      plantData.leafColorMapping
        ?.map((item) => item.leafColorLookup?.name)
        .filter(Boolean) || [],
    leafFallColor:
      plantData.leafFallColorMapping
        ?.map((item) => item.leafFallColorLookup?.name)
        .filter(Boolean) || [],
    leafFeel:
      plantData.leafFeelMapping
        ?.map((item) => item.leafFeelLookup?.name)
        .filter(Boolean) || [],
    leafHairsPresent:
      plantData.leafHairsPresentMapping
        ?.map((item) => item.leafHairsPresentLookup?.name)
        .filter(Boolean) || [],
    leafLength:
      plantData.leafLengthMapping
        ?.map((item) => item.leafLengthLookup?.name)
        .filter(Boolean) || [],
    leafMargin:
      plantData.leafMarginMapping
        ?.map((item) => item.leafMarginLookup?.name)
        .filter(Boolean) || [],
    leafShape:
      plantData.leafShapeMapping
        ?.map((item) => item.leafShapeLookup?.name)
        .filter(Boolean) || [],
    leafType:
      plantData.leafTypeMapping
        ?.map((item) => item.leafTypeLookup?.name)
        .filter(Boolean) || [],
    leafValueToGardener:
      plantData.leafValueToGardenerMapping
        ?.map((item) => item.leafValueToGardenerLookup?.name)
        .filter(Boolean) || [],
    leafWidth:
      plantData.leafWidthMapping
        ?.map((item) => item.leafWidthLookup?.name)
        .filter(Boolean) || [],
    lifeCycle:
      plantData.lifeCycleMapping
        ?.map((item) => item.lifeCycleLookup?.name)
        .filter(Boolean) || [],
    light:
      plantData.lightMapping
        ?.map((item) => item.lightLookup?.name)
        .filter(Boolean) || [],
    maintenance:
      plantData.maintenanceMapping
        ?.map((item) => item.maintenanceLookup?.name)
        .filter(Boolean) || [],
    ncRegion:
      plantData.ncRegionMapping
        ?.map((item) => item.ncRegionLookup?.name)
        .filter(Boolean) || [],
    plantTypes:
      plantData.plantTypesMapping
        ?.map((item) => item.plantTypesLookup?.name)
        .filter(Boolean) || [],
    poisonDermatitis:
      plantData.poisonDermatitisMapping
        ?.map((item) => item.poisonDermatitisLookup?.name)
        .filter(Boolean) || [],
    poisonPart:
      plantData.poisonPartMapping
        ?.map((item) => item.poisonPartLookup?.name)
        .filter(Boolean) || [],
    poisonSeverity:
      plantData.poisonSeverityMapping
        ?.map((item) => item.poisonSeverityLookup?.name)
        .filter(Boolean) || [],
    problems:
      plantData.problemsMapping
        ?.map((item) => item.problemsLookup?.name)
        .filter(Boolean) || [],
    propagation:
      plantData.propagationMapping
        ?.map((item) => item.propagationLookup?.name)
        .filter(Boolean) || [],
    resistanceToChallenges:
      plantData.resistanceToChallengesMapping
        ?.map((item) => item.resistanceToChallengesLookup?.name)
        .filter(Boolean) || [],
    soilDrainage:
      plantData.soilDrainageMapping
        ?.map((item) => item.soilDrainageLookup?.name)
        .filter(Boolean) || [],
    soilPh:
      plantData.soilPhMapping
        ?.map((item) => item.soilPhLookup?.name)
        .filter(Boolean) || [],
    soilTexture:
      plantData.soilTextureMapping
        ?.map((item) => item.soilTextureLookup?.name)
        .filter(Boolean) || [],
    stemAromatic:
      plantData.stemAromaticMapping
        ?.map((item) => item.stemAromaticLookup?.name)
        .filter(Boolean) || [],
    stemBudScales:
      plantData.stemBudScalesMapping
        ?.map((item) => item.stemBudScalesLookup?.name)
        .filter(Boolean) || [],
    stemBudTerminal:
      plantData.stemBudTerminalMapping
        ?.map((item) => item.stemBudTerminalLookup?.name)
        .filter(Boolean) || [],
    stemBuds:
      plantData.stemBudsMapping
        ?.map((item) => item.stemBudsLookup?.name)
        .filter(Boolean) || [],
    stemColor:
      plantData.stemColorMapping
        ?.map((item) => item.stemColorLookup?.name)
        .filter(Boolean) || [],
    stemCrossSection:
      plantData.stemCrossSectionMapping
        ?.map((item) => item.stemCrossSectionLookup?.name)
        .filter(Boolean) || [],
    stemForm:
      plantData.stemFormMapping
        ?.map((item) => item.stemFormLookup?.name)
        .filter(Boolean) || [],
    stemLeafScarShape:
      plantData.stemLeafScarShapeMapping
        ?.map((item) => item.stemLeafScarShapeLookup?.name)
        .filter(Boolean) || [],
    stemLenticels:
      plantData.stemLenticelsMapping
        ?.map((item) => item.stemLenticelsLookup?.name)
        .filter(Boolean) || [],
    stemPith:
      plantData.stemPithMapping
        ?.map((item) => item.stemPithLookup?.name)
        .filter(Boolean) || [],
    stemSurface:
      plantData.stemSurfaceMapping
        ?.map((item) => item.stemSurfaceLookup?.name)
        .filter(Boolean) || [],
    texture:
      plantData.textureMapping
        ?.map((item) => item.textureLookup?.name)
        .filter(Boolean) || [],
    usdaZones:
      plantData.usdaZoneMapping
        ?.map((item) => item.usdaZoneLookup?.name)
        .filter(Boolean) || [],
  };
};

// Generate static paths based on plant slugs
export async function generateStaticParams() {
  try {
    // Query your Supabase database directly for all slugs
    const { data, error } = await supabase
      .from("mainPlantData")
      .select("slug")
      .limit(100);

    if (error) {
      console.error("Error fetching slugs from Supabase:", error.message);
      return [];
    }

    if (!data || data.length === 0) {
      console.error("No slugs found in the database");
      return [];
    }

    // Map the slugs into the format required by Next.js
    return data.map((plant: { slug: string }) => ({
      slug: plant.slug,
    }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

const plantCache: Record<string, PlantData> = {};

// The main PlantPage component
export default async function PlantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  // Serve from cache if available
  if (plantCache[slug]) {
    console.log(`Serving from cache: ${slug}`);
    return (
      <MaxWidthWrapper>
        <PlantDetails plant={plantCache[slug]} />
      </MaxWidthWrapper>
    );
  }

  try {
    // Fetch plant data directly from Supabase
    const { data: plantData, error } = await supabase
      .from("mainPlantData")
      .select(
        `
        id,
        slug,
        scientificNames ( scientificName ),
        genus,
        species,
        family,
        sound_file,
        phonetic_spelling,
        description,
        profile_video,
        height_max,
        height_min,
        width_max,
        width_min,
        origin,
        distribution,
        uses,
        plantImages ( img, altText, caption, attribution ),
        wildlife_value,
        edibility,
        flower_description,
        leaf_description,
        fruit_description,
        stem_description,
        bark_description,
        poison_symptoms,
        poison_toxic_principle,
        tagsMapping ( tagsLookup ( name ) ),
        attractsMapping ( attractsLookup ( name ) ),
        availableSpaceToPlantMapping ( availableSpaceToPlantLookup ( name ) ),
        barkAttachmentMapping ( barkAttachmentLookup ( name ) ),
        barkColorMapping ( barkColorLookup ( name ) ),
        barkPlateShapeMapping ( barkPlateShapeLookup ( name ) ),
        designFeatureMapping ( designFeatureLookup ( name ) ),
        fireRiskMapping ( fireRiskLookup ( name ) ),
        flowerBloomTimeMapping ( flowerBloomTimeLookup ( name ) ),
        flowerColorMapping ( flowerColorLookup ( name ) ),
        flowerInflorescenceMapping ( flowerInflorescenceLookup ( name ) ),
        flowerPetalsMapping ( flowerPetalsLookup ( name ) ),
        flowerShapeMapping ( flowerShapeLookup ( name ) ),
        flowerSizeMapping ( flowerSizeLookup ( name ) ),
        flowerValueToGardenerMapping ( flowerValueToGardenerLookup ( name ) ),
        fruitColorMapping ( fruitColorLookup ( name ) ),
        fruitDisplayHarvestTimeMapping ( fruitDisplayHarvestTimeLookup ( name ) ),
        fruitLengthMapping ( fruitLengthLookup ( name ) ),
        fruitTypeMapping ( fruitTypeLookup ( name ) ),
        fruitValueToGardenerMapping ( fruitValueToGardenerLookup ( name ) ),
        fruitWidthMapping ( fruitWidthLookup ( name ) ),
        gardenSpacesMapping ( gardenSpacesLookup ( name ) ),
        growthRateMapping ( growthRateLookup ( name ) ),
        habitMapping ( habitLookup ( name ) ),
        landscapeLocationMapping ( landscapeLocationLookup ( name ) ),
        landscapeThemeMapping ( landscapeThemeLookup ( name ) ),
        leafArrangementMapping ( leafArrangementLookup ( name ) ),
        leafCharacteristicsMapping ( leafCharacteristicsLookup ( name ) ),
        leafColorMapping ( leafColorLookup ( name ) ),
        leafFallColorMapping ( leafFallColorLookup ( name ) ),
        leafFeelMapping ( leafFeelLookup ( name ) ),
        leafHairsPresentMapping ( leafHairsPresentLookup ( name ) ),
        leafLengthMapping ( leafLengthLookup ( name ) ),
        leafMarginMapping ( leafMarginLookup ( name ) ),
        leafShapeMapping ( leafShapeLookup ( name ) ),
        leafTypeMapping ( leafTypeLookup ( name ) ),
        leafValueToGardenerMapping ( leafValueToGardenerLookup ( name ) ),
        leafWidthMapping ( leafWidthLookup ( name ) ),
        lifeCycleMapping ( lifeCycleLookup ( name ) ),
        lightMapping ( lightLookup ( name ) ),
        maintenanceMapping ( maintenanceLookup ( name ) ),
        ncRegionMapping ( ncRegionLookup ( name ) ),
        plantTypesMapping ( plantTypesLookup ( name ) ),
        poisonDermatitisMapping ( poisonDermatitisLookup ( name ) ),
        poisonPartMapping ( poisonPartLookup ( name ) ),
        poisonSeverityMapping ( poisonSeverityLookup ( name ) ),
        problemsMapping ( problemsLookup ( name ) ),
        propagationMapping ( propagationLookup ( name ) ),
        resistanceToChallengesMapping ( resistanceToChallengesLookup ( name ) ),
        soilDrainageMapping ( soilDrainageLookup ( name ) ),
        soilPhMapping ( soilPhLookup ( name ) ),
        soilTextureMapping ( soilTextureLookup ( name ) ),
        stemAromaticMapping ( stemAromaticLookup ( name ) ),
        stemBudScalesMapping ( stemBudScalesLookup ( name ) ),
        stemBudTerminalMapping ( stemBudTerminalLookup ( name ) ),
        stemBudsMapping ( stemBudsLookup ( name ) ),
        stemColorMapping ( stemColorLookup ( name ) ),
        stemCrossSectionMapping ( stemCrossSectionLookup ( name ) ),
        stemFormMapping ( stemFormLookup ( name ) ),
        stemLeafScarShapeMapping ( stemLeafScarShapeLookup ( name ) ),
        stemLenticelsMapping ( stemLenticelsLookup ( name ) ),
        stemPithMapping ( stemPithLookup ( name ) ),
        stemSurfaceMapping ( stemSurfaceLookup ( name ) ),
        textureMapping ( textureLookup ( name ) ),
        usdaZoneMapping ( usdaZoneLookup ( name ) )
      `
      )
      .eq("slug", slug)
      .single<MainPlantDataWithRelations>();

    if (error || !plantData) {
      console.error(
        "Error fetching plant data from Supabase:",
        error?.message || "Plant not found"
      );
      return <div className="text-center text-red-500">Plant not found</div>;
    }

    // Transform the Supabase data to match the PlantData type
    const plant: PlantData = transformPlantData(plantData);

    return (
      <MaxWidthWrapper>
        <PlantDetails plant={plant} />
      </MaxWidthWrapper>
    );
  } catch (error) {
    console.error("Unexpected error while fetching plant data:", error);
    return (
      <div className="text-center text-red-500">
        An unexpected error occurred
      </div>
    );
  }
}

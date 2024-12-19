import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { PlantData } from "@/types/plant";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "Slug parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Query the Supabase database for the plant with the specified slug, including tags and images
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
      .single();

    if (error || !plantData) {
      console.error(
        "Error fetching plant data:",
        error?.message || "Not found"
      );
      return NextResponse.json(
        { error: "Failed to fetch plant data" },
        { status: 500 }
      );
    }

    // Transform the data to include tags and images
    const plant: PlantData = {
      id: plantData.id,
      slug: plantData.slug,
      scientificName: plantData.scientificNames[0].scientificName,
      genus: plantData.genus,
      species: plantData.species,
      family: plantData.family,
      soundFile: plantData.sound_file,
      phoneticSpelling: plantData.phonetic_spelling,
      description: plantData.description,
      profileVideo: plantData.profile_video,
      heightMax: plantData.height_max,
      heightMin: plantData.height_min,
      widthMax: plantData.width_max,
      widthMin: plantData.width_min,
      origin: plantData.origin,
      distribution: plantData.distribution,
      uses: plantData.uses,
      plantImages:
        plantData.plantImages?.map((image) => ({
          img: image.img,
          altText: image.altText,
          caption: image.caption,
          attribution: image.attribution,
        })) || [],
      wildlifeValue: plantData.wildlife_value,
      edibility: plantData.edibility,
      flowerDescription: plantData.flower_description,
      leafDescription: plantData.leaf_description,
      fruitDescription: plantData.fruit_description,
      stemDescription: plantData.stem_description,
      barkDescription: plantData.bark_description,
      poisonSymptoms: plantData.poison_symptoms,
      poisonToxicPrinciple: plantData.poison_toxic_principle,
      tags: plantData.tagsMapping?.map((tag) => tag.tagsLookup?.name) || [],
      attracts:
        plantData.attractsMapping?.map(
          (attract) => attract.attractsLookup?.name
        ) || [],
      availableSpaceToPlant:
        plantData.availableSpaceToPlantMapping?.map(
          (item) => item.availableSpaceToPlantLookup?.name
        ) || [],
      barkAttachment:
        plantData.barkAttachmentMapping?.map(
          (item) => item.barkAttachmentLookup?.name
        ) || [],
      barkColor:
        plantData.barkColorMapping?.map((item) => item.barkColorLookup?.name) ||
        [],
      barkPlateShape:
        plantData.barkPlateShapeMapping?.map(
          (item) => item.barkPlateShapeLookup?.name
        ) || [],
      designFeatures:
        plantData.designFeatureMapping?.map(
          (item) => item.designFeatureLookup?.name
        ) || [],
      fireRisk:
        plantData.fireRiskMapping?.map((item) => item.fireRiskLookup?.name) ||
        [],
      flowerBloomTime:
        plantData.flowerBloomTimeMapping?.map(
          (item) => item.flowerBloomTimeLookup?.name
        ) || [],
      flowerColor:
        plantData.flowerColorMapping?.map(
          (item) => item.flowerColorLookup?.name
        ) || [],
      flowerInflorescence:
        plantData.flowerInflorescenceMapping?.map(
          (item) => item.flowerInflorescenceLookup?.name
        ) || [],
      flowerPetals:
        plantData.flowerPetalsMapping?.map(
          (item) => item.flowerPetalsLookup?.name
        ) || [],
      flowerShape:
        plantData.flowerShapeMapping?.map(
          (item) => item.flowerShapeLookup?.name
        ) || [],
      flowerSize:
        plantData.flowerSizeMapping?.map(
          (item) => item.flowerSizeLookup?.name
        ) || [],
      flowerValueToGardener:
        plantData.flowerValueToGardenerMapping?.map(
          (item) => item.flowerValueToGardenerLookup?.name
        ) || [],
      fruitColor:
        plantData.fruitColorMapping?.map(
          (item) => item.fruitColorLookup?.name
        ) || [],
      fruitDisplayHarvestTime:
        plantData.fruitDisplayHarvestTimeMapping?.map(
          (item) => item.fruitDisplayHarvestTimeLookup?.name
        ) || [],
      fruitLength:
        plantData.fruitLengthMapping?.map(
          (item) => item.fruitLengthLookup?.name
        ) || [],
      fruitType:
        plantData.fruitTypeMapping?.map((item) => item.fruitTypeLookup?.name) ||
        [],
      fruitValueToGardener:
        plantData.fruitValueToGardenerMapping?.map(
          (item) => item.fruitValueToGardenerLookup?.name
        ) || [],
      fruitWidth:
        plantData.fruitWidthMapping?.map(
          (item) => item.fruitWidthLookup?.name
        ) || [],
      gardenSpaces:
        plantData.gardenSpacesMapping?.map(
          (item) => item.gardenSpacesLookup?.name
        ) || [],
      growthRate:
        plantData.growthRateMapping?.map(
          (item) => item.growthRateLookup?.name
        ) || [],
      habit:
        plantData.habitMapping?.map((item) => item.habitLookup?.name) || [],
      landscapeLocation:
        plantData.landscapeLocationMapping?.map(
          (item) => item.landscapeLocationLookup?.name
        ) || [],
      landscapeTheme:
        plantData.landscapeThemeMapping?.map(
          (item) => item.landscapeThemeLookup?.name
        ) || [],
      leafArrangement:
        plantData.leafArrangementMapping?.map(
          (item) => item.leafArrangementLookup?.name
        ) || [],
      leafCharacteristics:
        plantData.leafCharacteristicsMapping?.map(
          (item) => item.leafCharacteristicsLookup?.name
        ) || [],
      leafColor:
        plantData.leafColorMapping?.map((item) => item.leafColorLookup?.name) ||
        [],
      leafFallColor:
        plantData.leafFallColorMapping?.map(
          (item) => item.leafFallColorLookup?.name
        ) || [],
      leafFeel:
        plantData.leafFeelMapping?.map((item) => item.leafFeelLookup?.name) ||
        [],
      leafHairsPresent:
        plantData.leafHairsPresentMapping?.map(
          (item) => item.leafHairsPresentLookup?.name
        ) || [],
      leafLength:
        plantData.leafLengthMapping?.map(
          (item) => item.leafLengthLookup?.name
        ) || [],
      leafMargin:
        plantData.leafMarginMapping?.map(
          (item) => item.leafMarginLookup?.name
        ) || [],
      leafShape:
        plantData.leafShapeMapping?.map((item) => item.leafShapeLookup?.name) ||
        [],
      leafType:
        plantData.leafTypeMapping?.map((item) => item.leafTypeLookup?.name) ||
        [],
      leafValueToGardener:
        plantData.leafValueToGardenerMapping?.map(
          (item) => item.leafValueToGardenerLookup?.name
        ) || [],
      leafWidth:
        plantData.leafWidthMapping?.map((item) => item.leafWidthLookup?.name) ||
        [],
      lifeCycle:
        plantData.lifeCycleMapping?.map((item) => item.lifeCycleLookup?.name) ||
        [],
      light:
        plantData.lightMapping?.map((item) => item.lightLookup?.name) || [],
      maintenance:
        plantData.maintenanceMapping?.map(
          (item) => item.maintenanceLookup?.name
        ) || [],
      ncRegion:
        plantData.ncRegionMapping?.map((item) => item.ncRegionLookup?.name) ||
        [],
      plantTypes:
        plantData.plantTypesMapping?.map(
          (item) => item.plantTypesLookup?.name
        ) || [],
      poisonDermatitis:
        plantData.poisonDermatitisMapping?.map(
          (item) => item.poisonDermatitisLookup?.name
        ) || [],
      poisonPart:
        plantData.poisonPartMapping?.map(
          (item) => item.poisonPartLookup?.name
        ) || [],
      poisonSeverity:
        plantData.poisonSeverityMapping?.map(
          (item) => item.poisonSeverityLookup?.name
        ) || [],
      problems:
        plantData.problemsMapping?.map((item) => item.problemsLookup?.name) ||
        [],
      propagation:
        plantData.propagationMapping?.map(
          (item) => item.propagationLookup?.name
        ) || [],
      resistanceToChallenges:
        plantData.resistanceToChallengesMapping?.map(
          (item) => item.resistanceToChallengesLookup?.name
        ) || [],
      soilDrainage:
        plantData.soilDrainageMapping?.map(
          (item) => item.soilDrainageLookup?.name
        ) || [],
      soilPh:
        plantData.soilPhMapping?.map((item) => item.soilPhLookup?.name) || [],
      soilTexture:
        plantData.soilTextureMapping?.map(
          (item) => item.soilTextureLookup?.name
        ) || [],
      stemAromatic:
        plantData.stemAromaticMapping?.map(
          (item) => item.stemAromaticLookup?.name
        ) || [],
      stemBudScales:
        plantData.stemBudScalesMapping?.map(
          (item) => item.stemBudScalesLookup?.name
        ) || [],
      stemBudTerminal:
        plantData.stemBudTerminalMapping?.map(
          (item) => item.stemBudTerminalLookup?.name
        ) || [],
      stemBuds:
        plantData.stemBudsMapping?.map((item) => item.stemBudsLookup?.name) ||
        [],
      stemColor:
        plantData.stemColorMapping?.map((item) => item.stemColorLookup?.name) ||
        [],
      stemCrossSection:
        plantData.stemCrossSectionMapping?.map(
          (item) => item.stemCrossSectionLookup?.name
        ) || [],
      stemForm:
        plantData.stemFormMapping?.map((item) => item.stemFormLookup?.name) ||
        [],
      stemLeafScarShape:
        plantData.stemLeafScarShapeMapping?.map(
          (item) => item.stemLeafScarShapeLookup?.name
        ) || [],
      stemLenticels:
        plantData.stemLenticelsMapping?.map(
          (item) => item.stemLenticelsLookup?.name
        ) || [],
      stemPith:
        plantData.stemPithMapping?.map((item) => item.stemPithLookup?.name) ||
        [],
      stemSurface:
        plantData.stemSurfaceMapping?.map(
          (item) => item.stemSurfaceLookup?.name
        ) || [],
      texture:
        plantData.textureMapping?.map((item) => item.textureLookup?.name) || [],
      usdaZones:
        plantData.usdaZoneMapping?.map((item) => item.usdaZoneLookup?.name) ||
        [],
    };

    return NextResponse.json(plant);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

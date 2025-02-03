"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatInchesToFeetAndInches } from "@/lib/utils";
import DOMPurify from "isomorphic-dompurify";
import {
  AlertTriangle,
  Flower,
  BananaIcon as Fruit,
  Info,
  Leaf,
  MapPin,
  SproutIcon as SeedlingIcon,
  SproutIcon,
  SunIcon,
  TreesIcon as TreeIcon,
} from "lucide-react";
import AudioPlayerButton from "./AudioButton";
import ImageGallery from "./ImageGallery";

/** Type for individual images in plantImages array */
interface PlantImage {
  img: string | null;
  alt_text?: string | null;
  caption?: string | null;
  attribution?: string | null;
}

/** Full type for plant data (update or split out as needed) */
interface PlantDetailsProps {
  plant: {
    genus?: string | null;
    common_names?: (string | null)[];
    species?: string | null;
    scientific_name?: string | null;
    family?: string | null;
    sound_file?: string | null;
    phonetic_spelling?: string | null;
    description?: string | null;
    profile_video?: string | null;
    height_max?: number | null;
    height_min?: number | null;
    width_max?: number | null;
    width_min?: number | null;
    origin?: string | null;
    distribution?: string | null;
    uses?: string | null;
    images?: PlantImage[];
    wildlife_value?: string | null;
    edibility?: string | null;
    flower_description?: string | null;
    leaf_description?: string | null;
    fruit_description?: string | null;
    stem_description?: string | null;
    bark_description?: string | null;
    poison_symptoms?: string | null;
    poison_toxic_principle?: string | null;
    fire_risk?: string | null;
    flower_size?: string | null;
    fruit_length?: string | null;
    fruit_width?: string | null;
    garden_spaces?: string | null;
    growth_rate?: string | null;
    leaf_hairs_present?: string | null;
    leaf_length?: string | null;
    leaf_width?: string | null;
    poison_dermatitis?: string | null;
    poison_severity?: string | null;
    stem_aromatic?: string | null;
    stem_bud_scale?: string | null;
    stem_bud_terminal?: string | null;
    stem_buds?: string | null;
    stem_cross_section?: string | null;
    stem_form?: string | null;
    stem_leaf_scar_shape?: string | null;
    stem_lenticels?: string | null;
    stem_pith?: string | null;
    stem_surface?: string | null;
    texture?: string | null;
    tags?: (string | null)[];
    attracts?: (string | null)[];
    available_space_to_plant?: (string | null)[];
    bark_attachment?: (string | null)[];
    bark_color?: (string | null)[];
    bark_plate_shape?: (string | null)[];
    design_features?: (string | null)[];
    flower_bloom_time?: (string | null)[];
    flower_color?: (string | null)[];
    flower_inflorescence?: (string | null)[];
    flower_petals?: (string | null)[];
    flower_shape?: (string | null)[];
    flower_value_to_gardener?: (string | null)[];
    fruit_color?: (string | null)[];
    fruit_display_harvest_time?: (string | null)[];
    fruit_type?: (string | null)[];
    fruit_value_to_gardener?: (string | null)[];
    habit?: (string | null)[];
    landscape_location?: (string | null)[];
    landscape_theme?: (string | null)[];
    leaf_arrangement?: (string | null)[];
    leaf_characteristics?: (string | null)[];
    leaf_color?: (string | null)[];
    leaf_fall_color?: (string | null)[];
    leaf_feel?: (string | null)[];
    leaf_margin?: (string | null)[];
    leaf_shape?: (string | null)[];
    leaf_type?: (string | null)[];
    leaf_value_to_gardener?: (string | null)[];
    life_cycle?: (string | null)[];
    light?: (string | null)[];
    maintenance?: (string | null)[];
    nc_region?: (string | null)[];
    plant_types?: (string | null)[];
    poison_part?: (string | null)[];
    problems?: (string | null)[];
    propagation?: (string | null)[];
    resistance_to_challenges?: (string | null)[];
    soil_drainage?: (string | null)[];
    soil_ph?: (string | null)[];
    soil_texture?: (string | null)[];
    stem_color?: (string | null)[];
    usda_zones?: (string | null)[];
  };
}

/** Displays an array of strings (multi-value) */
const PlantArrayFact = ({
  label,
  data,
}: {
  label: string;
  data?: Array<string | null>;
}) => {
  const filteredData =
    data?.filter((item): item is string => item !== null) || [];

  return (
    <>
      <span className="font-semibold text-cream-800">{label}:</span>
      {filteredData.length > 0 ? (
        <ul className="list-disc ml-6">
          {filteredData.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <span className="ml-1">Not specified</span>
      )}
    </>
  );
};

/** Displays a single string (single-value) */
const PlantFact = ({
  label,
  data,
}: {
  label: string;
  data?: string | null;
}) => (
  <p>
    <span className="font-semibold text-cream-800">{label}:</span>
    <span className="ml-1">{data || "Not specified"}</span>
  </p>
);

const PlantDetails: React.FC<PlantDetailsProps> = ({ plant }) => {
  // Destructure fields from your updated materialized view:
  const {
    genus,
    common_names: commonNames,
    species,
    scientific_name: scientificName,
    family,
    sound_file: soundFile,
    phonetic_spelling: phoneticSpelling,
    description,
    profile_video: profileVideo,
    height_max: heightMax,
    height_min: heightMin,
    width_max: widthMax,
    width_min: widthMin,
    origin,
    distribution,
    uses,
    images: plantImages,
    wildlife_value: wildlifeValue,
    edibility,
    flower_description: flowerDescription,
    leaf_description: leafDescription,
    fruit_description: fruitDescription,
    stem_description: stemDescription,
    bark_description: barkDescription,
    poison_symptoms: poisonSymptoms,
    poison_toxic_principle: poisonToxicPrinciple,

    fire_risk: fireRisk,
    flower_size: flowerSize,
    fruit_length: fruitLength,
    fruit_width: fruitWidth,
    garden_spaces: gardenSpaces,
    growth_rate: growthRate,
    leaf_hairs_present: leafHairsPresent,
    leaf_length: leafLength,
    leaf_width: leafWidth,
    poison_dermatitis: poisonDermatitis,
    poison_severity: poisonSeverity,
    stem_aromatic: stemAromatic,
    stem_bud_scale: stemBudScale,
    stem_bud_terminal: stemBudTerminal,
    stem_buds: stemBuds,
    stem_cross_section: stemCrossSection,
    stem_form: stemForm,
    stem_leaf_scar_shape: stemLeafScarShape,
    stem_lenticels: stemLenticels,
    stem_pith: stemPith,
    stem_surface: stemSurface,
    texture,

    tags,
    attracts,
    available_space_to_plant: availableSpaceToPlant,
    bark_attachment: barkAttachment,
    bark_color: barkColor,
    bark_plate_shape: barkPlateShape,
    design_features: designFeatures,
    flower_bloom_time: flowerBloomTime,
    flower_color: flowerColor,
    flower_inflorescence: flowerInflorescence,
    flower_petals: flowerPetals,
    flower_shape: flowerShape,
    flower_value_to_gardener: flowerValueToGardener,
    fruit_color: fruitColor,
    fruit_display_harvest_time: fruitDisplayHarvestTime,
    fruit_type: fruitType,
    fruit_value_to_gardener: fruitValueToGardener,
    habit,
    landscape_location: landscapeLocation,
    landscape_theme: landscapeTheme,
    leaf_arrangement: leafArrangement,
    leaf_characteristics: leafCharacteristics,
    leaf_color: leafColor,
    leaf_fall_color: leafFallColor,
    leaf_feel: leafFeel,
    leaf_margin: leafMargin,
    leaf_shape: leafShape,
    leaf_type: leafType,
    leaf_value_to_gardener: leafValueToGardener,
    life_cycle: lifeCycle,
    light,
    maintenance,
    nc_region: ncRegion,
    plant_types: plantTypes,
    poison_part: poisonPart,
    problems,
    propagation,
    resistance_to_challenges: resistanceToChallenges,
    soil_drainage: soilDrainage,
    soil_ph: soilPh,
    soil_texture: soilTexture,
    stem_color: stemColor,
    usda_zones: usdaZones,
  } = plant;

  // Sanitize any HTML description
  const sanitizedDescription = DOMPurify.sanitize(description || "", {
    ALLOWED_TAGS: ["p", "strong", "em", "br", "ul", "li"],
  });

  return (
    <section className="my-12">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Left Column: Images */}
        <div className="md:w-1/2">
          {plantImages && plantImages.length > 0 ? (
            <ImageGallery
              images={plantImages
                .filter((img: PlantImage) => img.img !== null)
                .map(({ img, alt_text, caption, attribution }: PlantImage) => ({
                  img: img as string,
                  altText: alt_text || "No description available",
                  caption: caption || "",
                  attribution: attribution || "",
                }))}
            />
          ) : (
            <p className="text-muted-foreground">No images available.</p>
          )}
        </div>

        {/* Right Column: Basic Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            {scientificName}
            {soundFile && <AudioPlayerButton soundFile={soundFile} />}
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            {genus && `Genus: ${genus} - `}
            {species && `Species: ${species} - `}
            {family && `Family: ${family}`}
          </p>
          {phoneticSpelling && (
            <p className="text-sm text-muted-foreground mb-4">
              Phonetic Spelling: {phoneticSpelling}
            </p>
          )}
          {commonNames && commonNames.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Common Names:</h3>
              <ul className="list-disc ml-6">
                {commonNames.map((name: string | null, index: number) =>
                  name ? <li key={index}>{name}</li> : null
                )}
              </ul>
            </div>
          )}

          <div
            className="prose prose-sm mb-4 text-lg"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="my-8">
        <h2 className="text-lg font-semibold mb-2">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tags && tags.length > 0 ? (
            tags
              .filter((tag: string | null): tag is string => tag !== null)
              .map((tag: string, index: number) => (
                <Badge key={index}>{tag}</Badge>
              ))
          ) : (
            <span className="text-muted-foreground">No tags available.</span>
          )}
        </div>
      </div>

      {/* TABS */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full h-full grid-cols-2 grid-rows-3 lg:grid-cols-6 lg:grid-rows-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="physical">Physical</TabsTrigger>
          <TabsTrigger value="care">Care</TabsTrigger>
          <TabsTrigger value="landscape">Landscape</TabsTrigger>
          <TabsTrigger value="ecology">Ecology</TabsTrigger>
          <TabsTrigger value="additional">Additional</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Quick Facts</h3>
                  <ul className="space-y-2">
                    <li>
                      <span className="font-medium">Height:</span>{" "}
                      {heightMin && heightMax
                        ? `${formatInchesToFeetAndInches(
                            heightMin
                          )} - ${formatInchesToFeetAndInches(heightMax)}`
                        : "Not specified"}
                    </li>
                    <li>
                      <span className="font-medium">Width:</span>{" "}
                      {widthMin && widthMax
                        ? `${formatInchesToFeetAndInches(
                            widthMin
                          )} - ${formatInchesToFeetAndInches(widthMax)}`
                        : "Not specified"}
                    </li>
                    <li>
                      <span className="font-medium">USDA Zones:</span>{" "}
                      {usdaZones && usdaZones.length > 0 ? (
                        <ul className="list-disc ml-6">
                          {usdaZones
                            .filter(
                              (zone: string | null): zone is string =>
                                zone !== null
                            )
                            .map((zone: string, index: number) => (
                              <li key={index}>{zone}</li>
                            ))}
                        </ul>
                      ) : (
                        "Not specified"
                      )}
                    </li>
                    <li>
                      <PlantArrayFact label="NC Region" data={ncRegion} />
                    </li>
                    <li>
                      <PlantFact label="Origin" data={origin} />
                    </li>
                    <li>
                      <PlantArrayFact label="Life Cycle" data={lifeCycle} />
                    </li>
                    <li>
                      <PlantArrayFact label="Plant Types" data={plantTypes} />
                    </li>
                    <li>
                      <PlantArrayFact label="Habit" data={habit} />
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Distribution</h3>
                  <p>{distribution || "N/A"}</p>
                  <h3 className="text-lg font-semibold mt-4 mb-2">Uses</h3>
                  <p>{uses || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Physical Tab */}
        <TabsContent value="physical">
          <Card>
            <CardContent>
              <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="flower"
              >
                {/* Flower */}
                <AccordionItem value="flower">
                  <AccordionTrigger>
                    <Flower className="w-5 h-5 mr-2 no-rotate" />
                    Flower Characteristics
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <PlantFact
                          label="Description"
                          data={flowerDescription}
                        />
                        <PlantArrayFact
                          label="Bloom Time"
                          data={flowerBloomTime}
                        />
                        <PlantArrayFact label="Color" data={flowerColor} />
                        <PlantArrayFact
                          label="Inflorescence"
                          data={flowerInflorescence}
                        />
                      </div>
                      <div>
                        <PlantArrayFact label="Petals" data={flowerPetals} />
                        <PlantArrayFact label="Shape" data={flowerShape} />
                        <PlantFact label="Size" data={flowerSize} />
                        <PlantArrayFact
                          label="Value to Gardener"
                          data={flowerValueToGardener}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Leaf */}
                <AccordionItem value="leaf">
                  <AccordionTrigger>
                    <Leaf className="w-5 h-5 mr-2 no-rotate" />
                    Leaf Characteristics
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <PlantFact label="Description" data={leafDescription} />
                        <PlantArrayFact
                          label="Arrangement"
                          data={leafArrangement}
                        />
                        <PlantArrayFact
                          label="Characteristics"
                          data={leafCharacteristics}
                        />
                        <PlantArrayFact label="Color" data={leafColor} />
                        <PlantArrayFact
                          label="Fall Color"
                          data={leafFallColor}
                        />
                      </div>
                      <div>
                        <PlantArrayFact label="Feel" data={leafFeel} />
                        <PlantFact
                          label="Hairs Present"
                          data={leafHairsPresent}
                        />
                        <PlantFact label="Length" data={leafLength} />
                        <PlantFact label="Width" data={leafWidth} />
                        <PlantArrayFact label="Margin" data={leafMargin} />
                        <PlantArrayFact label="Shape" data={leafShape} />
                        <PlantArrayFact label="Type" data={leafType} />
                        <PlantArrayFact
                          label="Value to Gardener"
                          data={leafValueToGardener}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Fruit */}
                <AccordionItem value="fruit">
                  <AccordionTrigger>
                    <Fruit className="w-5 h-5 mr-2 no-rotate" />
                    Fruit Characteristics
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <PlantFact
                          label="Description"
                          data={fruitDescription}
                        />
                        <PlantArrayFact label="Color" data={fruitColor} />
                        <PlantArrayFact
                          label="Display/Harvest Time"
                          data={fruitDisplayHarvestTime}
                        />
                      </div>
                      <div>
                        <PlantFact label="Length" data={fruitLength} />
                        <PlantArrayFact label="Type" data={fruitType} />
                        <PlantArrayFact
                          label="Value to Gardener"
                          data={fruitValueToGardener}
                        />
                        <PlantFact label="Width" data={fruitWidth} />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Stem */}
                <AccordionItem value="stem">
                  <AccordionTrigger>
                    <SeedlingIcon className="w-5 h-5 mr-2 no-rotate" />
                    Stem Characteristics
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <PlantFact label="Description" data={stemDescription} />
                        <PlantFact label="Aromatic" data={stemAromatic} />
                        <PlantFact label="Bud Scale" data={stemBudScale} />
                        <PlantFact
                          label="Bud Terminal"
                          data={stemBudTerminal}
                        />
                        <PlantFact label="Buds" data={stemBuds} />
                        <PlantArrayFact label="Color" data={stemColor} />
                      </div>
                      <div>
                        <PlantFact
                          label="Cross Section"
                          data={stemCrossSection}
                        />
                        <PlantFact label="Form" data={stemForm} />
                        <PlantFact
                          label="Leaf Scar Shape"
                          data={stemLeafScarShape}
                        />
                        <PlantFact label="Lenticels" data={stemLenticels} />
                        <PlantFact label="Pith" data={stemPith} />
                        <PlantFact label="Surface" data={stemSurface} />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Bark */}
                <AccordionItem value="bark">
                  <AccordionTrigger>
                    <TreeIcon className="w-5 h-5 mr-2 no-rotate" />
                    Bark Characteristics
                  </AccordionTrigger>
                  <AccordionContent>
                    <PlantFact label="Description" data={barkDescription} />
                    <PlantArrayFact label="Attachment" data={barkAttachment} />
                    <PlantArrayFact label="Color" data={barkColor} />
                    <PlantArrayFact label="Plate Shape" data={barkPlateShape} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Care Tab */}
        <TabsContent value="care">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <SunIcon className="w-5 h-5 mr-2" />
                    Growing Conditions
                  </h3>
                  <PlantArrayFact label="Light" data={light} />
                  <PlantArrayFact label="Soil Drainage" data={soilDrainage} />
                  <PlantArrayFact label="Soil pH" data={soilPh} />
                  <PlantArrayFact label="Soil Texture" data={soilTexture} />
                  <PlantArrayFact
                    label="Available Space to Plant"
                    data={availableSpaceToPlant}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <SproutIcon className="w-5 h-5 mr-2" />
                    Maintenance
                  </h3>
                  <PlantArrayFact
                    label="Maintenance Level"
                    data={maintenance}
                  />
                  <PlantFact label="Growth Rate" data={growthRate} />
                  <PlantArrayFact label="Propagation" data={propagation} />
                  <PlantArrayFact label="Problems" data={problems} />
                  <PlantArrayFact
                    label="Resistance to Challenges"
                    data={resistanceToChallenges}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Landscape Tab */}
        <TabsContent value="landscape">
          <Card>
            <CardContent className="grid pt-6 md:grid-cols-2">
              <section>
                <h3 className="text-lg font-semibold mb-2">Landscape Use</h3>
                <div className="grid gap-4">
                  <PlantFact label="Garden Spaces" data={gardenSpaces} />
                  <PlantArrayFact
                    label="Landscape Location"
                    data={landscapeLocation}
                  />
                  <PlantArrayFact
                    label="Landscape Theme"
                    data={landscapeTheme}
                  />
                  <PlantArrayFact
                    label="Design Features"
                    data={designFeatures}
                  />
                </div>
              </section>
              <section>
                <h3 className="text-lg font-semibold mt-4 mb-2">
                  Environmental Factors
                </h3>
                <PlantFact label="Fire Risk" data={fireRisk} />
                <PlantFact label="Texture" data={texture} />
              </section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ecology Tab */}
        <TabsContent value="ecology">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Wildlife Value</h3>
                  <p>{wildlifeValue || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Attracts</h3>
                  <div>
                    {attracts && attracts.length > 0 ? (
                      <ul className="list-disc ml-6">
                        {attracts
                          .filter((a: string | null): a is string => a !== null)
                          .map((a: string, idx: number) => (
                            <li key={idx}>{a}</li>
                          ))}
                      </ul>
                    ) : (
                      "Not specified"
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Additional Tab */}
        <TabsContent value="additional">
          <Card>
            <CardContent className="pt-6">
              <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="edibility"
              >
                <AccordionItem value="edibility">
                  <AccordionTrigger>
                    <Info className="w-5 h-5 mr-2 no-rotate" />
                    Edibility and Uses
                  </AccordionTrigger>
                  <AccordionContent>
                    <PlantFact label="Edibility" data={edibility} />
                    <PlantFact label="Uses" data={uses} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="toxicity">
                  <AccordionTrigger>
                    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500 no-rotate" />
                    Toxicity Information
                  </AccordionTrigger>
                  <AccordionContent>
                    <PlantFact label="Poison Symptoms" data={poisonSymptoms} />
                    <PlantFact
                      label="Poison Toxic Principle"
                      data={poisonToxicPrinciple}
                    />
                    <PlantFact
                      label="Poison Dermatitis"
                      data={poisonDermatitis}
                    />
                    <PlantArrayFact label="Poison Part" data={poisonPart} />
                    <PlantFact label="Poison Severity" data={poisonSeverity} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="media">
                  <AccordionTrigger>
                    <MapPin className="w-5 h-5 mr-2 no-rotate" />
                    Media
                  </AccordionTrigger>
                  <AccordionContent>
                    {profileVideo && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Profile Video</h4>
                        <video
                          src={profileVideo}
                          controls
                          className="w-full rounded-lg"
                        />
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default PlantDetails;

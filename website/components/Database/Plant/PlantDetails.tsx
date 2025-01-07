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
import { PlantData } from "@/types/plant";
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

interface PlantDetailsProps {
  plant: PlantData;
}

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
          {filteredData.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <span className="ml-1">Not specified</span>
      )}
    </>
  );
};

// Update PlantFact to handle string | null | undefined
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

const PlantDetails = ({ plant }: PlantDetailsProps) => {
  const {
    genus,
    commonNames,
    species,
    scientificName,
    family,
    soundFile,
    phoneticSpelling,
    description,
    profileVideo,
    heightMax,
    heightMin,
    widthMax,
    widthMin,
    origin,
    distribution,
    uses,
    plantImages,
    wildlifeValue,
    edibility,
    flowerDescription,
    leafDescription,
    fruitDescription,
    stemDescription,
    barkDescription,
    poisonSymptoms,
    poisonToxicPrinciple,
    tags,
    attracts,
    availableSpaceToPlant,
    barkAttachment,
    barkColor,
    barkPlateShape,
    designFeatures,
    fireRisk,
    flowerBloomTime,
    flowerColor,
    flowerInflorescence,
    flowerPetals,
    flowerShape,
    flowerSize,
    flowerValueToGardener,
    fruitColor,
    fruitDisplayHarvestTime,
    fruitLength,
    fruitType,
    fruitValueToGardener,
    fruitWidth,
    gardenSpaces,
    growthRate,
    habit,
    landscapeLocation,
    landscapeTheme,
    leafArrangement,
    leafCharacteristics,
    leafColor,
    leafFallColor,
    leafFeel,
    leafHairsPresent,
    leafLength,
    leafMargin,
    leafShape,
    leafType,
    leafValueToGardener,
    leafWidth,
    lifeCycle,
    light,
    maintenance,
    ncRegion,
    plantTypes,
    poisonDermatitis,
    poisonPart,
    poisonSeverity,
    problems,
    propagation,
    resistanceToChallenges,
    soilDrainage,
    soilPh,
    soilTexture,
    stemAromatic,
    stemBudScales,
    stemBudTerminal,
    stemBuds,
    stemColor,
    stemCrossSection,
    stemForm,
    stemLeafScarShape,
    stemLenticels,
    stemPith,
    stemSurface,
    texture,
    usdaZones,
  } = plant;

  const sanitizedDescription = DOMPurify.sanitize(description || "", {
    ALLOWED_TAGS: ["p", "strong", "em", "br", "ul", "li"],
  });

  return (
    <section className="my-12">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-1/2">
          {plantImages && plantImages.length > 0 ? (
            <ImageGallery
              images={plantImages
                .filter((image) => image.img !== null)
                .map(({ img, altText, caption, attribution }) => ({
                  img: img as string, // Type assertion since we've filtered out nulls
                  altText: altText || "No description available",
                  caption: caption || "",
                  attribution: attribution || "",
                }))}
            />
          ) : (
            <p className="text-muted-foreground">No images available.</p>
          )}
        </div>
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
          {/** Added commonNames display here */}
          {commonNames && commonNames.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Common Names:</h3>
              <ul className="list-disc ml-6">
                {commonNames.map((item, index) => (
                  <li className="text-medium" key={index}>
                    {item.commonName}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div
            className="prose prose-sm mb-4 text-lg"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        </div>
      </div>
      <div className="my-8">
        <h2 className="text-lg font-semibold mb-2">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tags && tags.length > 0 ? (
            tags
              .filter((tag): tag is string => tag !== null)
              .map((tag, index) => <Badge key={index}>{tag}</Badge>)
          ) : (
            <span className="text-muted-foreground">No tags available.</span>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full h-full grid-cols-2 grid-rows-3 lg:grid-cols-6 lg:grid-rows-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="physical">Physical</TabsTrigger>
          <TabsTrigger value="care">Care</TabsTrigger>
          <TabsTrigger value="landscape">Landscape</TabsTrigger>
          <TabsTrigger value="ecology">Ecology</TabsTrigger>
          <TabsTrigger value="additional">Additional</TabsTrigger>
        </TabsList>

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
                        ? `${formatInchesToFeetAndInches(heightMin)} - ${formatInchesToFeetAndInches(heightMax)}`
                        : "Not specified"}
                    </li>
                    <li>
                      <span className="font-medium">Width:</span>{" "}
                      {widthMin && widthMax
                        ? `${formatInchesToFeetAndInches(widthMin)} - ${formatInchesToFeetAndInches(widthMax)}`
                        : "Not specified"}
                    </li>
                    <li>
                      <span className="font-medium">USDA Zones:</span>{" "}
                      {usdaZones && usdaZones.length > 0 ? (
                        <ul className="list-disc ml-6">
                          {usdaZones
                            .filter((zone): zone is string => zone !== null)
                            .map((zone, index) => (
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

        <TabsContent value="physical">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="flower"
          >
            <AccordionItem value="flower">
              <AccordionTrigger>
                <Flower className="w-5 h-5 mr-2 no-rotate" />
                Flower Characteristics
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <PlantFact label="Description" data={flowerDescription} />
                    <PlantArrayFact label="Bloom Time" data={flowerBloomTime} />
                    <PlantArrayFact label="Color" data={flowerColor} />
                    <PlantArrayFact
                      label="Inflorescence"
                      data={flowerInflorescence}
                    />
                  </div>
                  <div>
                    <PlantArrayFact label="Petals" data={flowerPetals} />
                    <PlantArrayFact label="Shape" data={flowerShape} />
                    <PlantArrayFact label="Size" data={flowerSize} />
                    <PlantArrayFact
                      label="Value to Gardener"
                      data={flowerValueToGardener}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
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
                    <PlantArrayFact label="Fall Color" data={leafFallColor} />
                  </div>
                  <div>
                    <PlantArrayFact label="Feel" data={leafFeel} />
                    <PlantArrayFact
                      label="Hairs Present"
                      data={leafHairsPresent}
                    />
                    <PlantArrayFact label="Length" data={leafLength} />
                    <PlantArrayFact label="Width" data={leafWidth} />
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
            <AccordionItem value="fruit">
              <AccordionTrigger>
                <Fruit className="w-5 h-5 mr-2 no-rotate" />
                Fruit Characteristics
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <PlantFact label="Description" data={fruitDescription} />
                    <PlantArrayFact label="Color" data={fruitColor} />
                    <PlantArrayFact
                      label="Display/Harvest Time"
                      data={fruitDisplayHarvestTime}
                    />
                  </div>
                  <div>
                    <PlantArrayFact label="Length" data={fruitLength} />
                    <PlantArrayFact label="Type" data={fruitType} />
                    <PlantArrayFact
                      label="Value to Gardener"
                      data={fruitValueToGardener}
                    />
                    <PlantArrayFact label="Width" data={fruitWidth} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="stem">
              <AccordionTrigger>
                <SeedlingIcon className="w-5 h-5 mr-2 no-rotate" />
                Stem Characteristics
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <PlantFact label="Description" data={stemDescription} />
                    <PlantArrayFact label="Aromatic" data={stemAromatic} />
                    <PlantArrayFact label="Bud Scales" data={stemBudScales} />
                    <PlantArrayFact
                      label="Bud Terminal"
                      data={stemBudTerminal}
                    />
                    <PlantArrayFact label="Buds" data={stemBuds} />
                    <PlantArrayFact label="Color" data={stemColor} />
                  </div>
                  <div>
                    <PlantArrayFact
                      label="Cross Section"
                      data={stemCrossSection}
                    />
                    <PlantArrayFact label="Form" data={stemForm} />
                    <PlantArrayFact
                      label="Leaf Scar Shape"
                      data={stemLeafScarShape}
                    />
                    <PlantArrayFact label="Lenticels" data={stemLenticels} />
                    <PlantArrayFact label="Pith" data={stemPith} />
                    <PlantArrayFact label="Surface" data={stemSurface} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
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
        </TabsContent>

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
                  <PlantArrayFact label="Growth Rate" data={growthRate} />
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

        <TabsContent value="landscape">
          <Card>
            <CardContent className="grid pt-6 md:grid-cols-2">
              <section>
                <h3 className="text-lg font-semibold mb-2">Landscape Use</h3>
                <div className="grid gap-4">
                  <PlantArrayFact label="Garden Spaces" data={gardenSpaces} />
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
                <PlantArrayFact label="Fire Risk" data={fireRisk} />
                <PlantArrayFact label="Texture" data={texture} />
              </section>
            </CardContent>
          </Card>
        </TabsContent>

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
                          .filter(
                            (attract): attract is string => attract !== null
                          )
                          .map((attract, index) => (
                            <li key={index}>{attract}</li>
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
                    <PlantArrayFact
                      label="Poison Dermatitis"
                      data={poisonDermatitis}
                    />
                    <PlantArrayFact label="Poison Part" data={poisonPart} />
                    <PlantArrayFact
                      label="Poison Severity"
                      data={poisonSeverity}
                    />
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

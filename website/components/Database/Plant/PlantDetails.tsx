import { PlantData } from "@/types/plant";
import DOMPurify from "isomorphic-dompurify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Info,
  Leaf,
  Flower,
  BananaIcon as Fruit,
  MapPin,
  AlertTriangle,
  SproutIcon as SeedlingIcon,
  TreesIcon as TreeIcon,
  SunIcon,
  SproutIcon,
} from "lucide-react";
import ImageGallery from "./ImageGallery";

interface PlantDetailsProps {
  plant: PlantData;
}

const PlantDetails = ({ plant }: PlantDetailsProps) => {
  const {
    genus,
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
              images={plantImages.map(({ img, altText, ...rest }) => ({
                img,
                altText,
                ...rest,
              }))}
            />
          ) : (
            <p className="text-muted-foreground">No images available.</p>
          )}
        </div>
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{scientificName}</h1>
          <p className="text-xl text-muted-foreground mb-2">
            {species && `${species} - `} {genus && `${genus} - `}
            {family && family}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Phonetic Spelling: {phoneticSpelling}
          </p>
          <div
            className="prose prose-sm mb-4"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        </div>
      </div>
      <div className="my-8">
        <h2 className="text-lg font-semibold mb-2">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tags && tags.map((tag, index) => <Badge key={index}>{tag}</Badge>)}
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
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
                      <span className="font-medium">Height:</span> {heightMin} -{" "}
                      {heightMax}
                    </li>
                    <li>
                      <span className="font-medium">Width:</span> {widthMin} -{" "}
                      {widthMax}
                    </li>
                    <li>
                      <span className="font-medium">USDA Zones:</span>{" "}
                      {usdaZones && usdaZones.length > 0 ? (
                        <ul className="list-disc ml-6">
                          {usdaZones.map((zone, index) => (
                            <li key={index}>{zone}</li>
                          ))}
                        </ul>
                      ) : (
                        "Not specified"
                      )}
                    </li>

                    <li>
                      <span className="font-medium">NC Region:</span> {ncRegion}
                    </li>
                    <li>
                      <span className="font-medium">Origin:</span> {origin}
                    </li>
                    <li>
                      <span className="font-medium">Life Cycle:</span>{" "}
                      {lifeCycle}
                    </li>
                    <li>
                      <span className="font-medium">Plant Types:</span>{" "}
                      {plantTypes}
                    </li>
                    <li>
                      <span className="font-medium">Habit:</span> {habit}
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Distribution</h3>
                  <p>{distribution}</p>
                  <h3 className="text-lg font-semibold mt-4 mb-2">Uses</h3>
                  <p>{uses}</p>
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
                <Flower className="w-5 h-5 mr-2" />
                Flower Characteristics
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p>
                      <span className="font-medium">Description:</span>{" "}
                      {flowerDescription}
                    </p>
                    <p>
                      <span className="font-medium">Bloom Time:</span>{" "}
                      {flowerBloomTime}
                    </p>
                    <p>
                      <span className="font-medium">Color:</span> {flowerColor}
                    </p>
                    <p>
                      <span className="font-medium">Inflorescence:</span>{" "}
                      {flowerInflorescence}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">Petals:</span>{" "}
                      {flowerPetals}
                    </p>
                    <p>
                      <span className="font-medium">Shape:</span> {flowerShape}
                    </p>
                    <p>
                      <span className="font-medium">Size:</span> {flowerSize}
                    </p>
                    <p>
                      <span className="font-medium">Value to Gardener:</span>{" "}
                      {flowerValueToGardener}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="leaf">
              <AccordionTrigger>
                <Leaf className="w-5 h-5 mr-2" />
                Leaf Characteristics
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p>
                      <span className="font-medium">Description:</span>{" "}
                      {leafDescription}
                    </p>
                    <p>
                      <span className="font-medium">Arrangement:</span>{" "}
                      {leafArrangement}
                    </p>
                    <p>
                      <span className="font-medium">Characteristics:</span>{" "}
                      {leafCharacteristics}
                    </p>
                    <p>
                      <span className="font-medium">Color:</span> {leafColor}
                    </p>
                    <p>
                      <span className="font-medium">Fall Color:</span>{" "}
                      {leafFallColor}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">Feel:</span> {leafFeel}
                    </p>
                    <p>
                      <span className="font-medium">Hairs Present:</span>{" "}
                      {leafHairsPresent}
                    </p>
                    <p>
                      <span className="font-medium">Length:</span> {leafLength}
                    </p>
                    <p>
                      <span className="font-medium">Margin:</span> {leafMargin}
                    </p>
                    <p>
                      <span className="font-medium">Shape:</span> {leafShape}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span> {leafType}
                    </p>
                    <p>
                      <span className="font-medium">Value to Gardener:</span>{" "}
                      {leafValueToGardener}
                    </p>
                    <p>
                      <span className="font-medium">Width:</span> {leafWidth}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="fruit">
              <AccordionTrigger>
                <Fruit className="w-5 h-5 mr-2" />
                Fruit Characteristics
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p>
                      <span className="font-medium">Description:</span>{" "}
                      {fruitDescription}
                    </p>
                    <p>
                      <span className="font-medium">Color:</span> {fruitColor}
                    </p>
                    <p>
                      <span className="font-medium">Display/Harvest Time:</span>{" "}
                      {fruitDisplayHarvestTime}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">Length:</span> {fruitLength}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span> {fruitType}
                    </p>
                    <p>
                      <span className="font-medium">Value to Gardener:</span>{" "}
                      {fruitValueToGardener}
                    </p>
                    <p>
                      <span className="font-medium">Width:</span> {fruitWidth}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="stem">
              <AccordionTrigger>
                <SeedlingIcon className="w-5 h-5 mr-2" />
                Stem Characteristics
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p>
                      <span className="font-medium">Description:</span>{" "}
                      {stemDescription}
                    </p>
                    <p>
                      <span className="font-medium">Aromatic:</span>{" "}
                      {stemAromatic}
                    </p>
                    <p>
                      <span className="font-medium">Bud Scales:</span>{" "}
                      {stemBudScales}
                    </p>
                    <p>
                      <span className="font-medium">Bud Terminal:</span>{" "}
                      {stemBudTerminal}
                    </p>
                    <p>
                      <span className="font-medium">Buds:</span> {stemBuds}
                    </p>
                    <p>
                      <span className="font-medium">Color:</span> {stemColor}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">Cross Section:</span>{" "}
                      {stemCrossSection}
                    </p>
                    <p>
                      <span className="font-medium">Form:</span> {stemForm}
                    </p>
                    <p>
                      <span className="font-medium">Leaf Scar Shape:</span>{" "}
                      {stemLeafScarShape}
                    </p>
                    <p>
                      <span className="font-medium">Lenticels:</span>{" "}
                      {stemLenticels}
                    </p>
                    <p>
                      <span className="font-medium">Pith:</span> {stemPith}
                    </p>
                    <p>
                      <span className="font-medium">Surface:</span>{" "}
                      {stemSurface}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="bark">
              <AccordionTrigger>
                <TreeIcon className="w-5 h-5 mr-2" />
                Bark Characteristics
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  <span className="font-medium">Description:</span>{" "}
                  {barkDescription}
                </p>
                <p>
                  <span className="font-medium">Attachment:</span>{" "}
                  {barkAttachment}
                </p>
                <p>
                  <span className="font-medium">Color:</span> {barkColor}
                </p>
                <p>
                  <span className="font-medium">Plate Shape:</span>{" "}
                  {barkPlateShape}
                </p>
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
                  <p>
                    <span className="font-medium">Light:</span> {light}
                  </p>
                  <p>
                    <span className="font-medium">Soil Drainage:</span>{" "}
                    {soilDrainage}
                  </p>
                  <p>
                    <span className="font-medium">Soil pH:</span> {soilPh}
                  </p>
                  <p>
                    <span className="font-medium">Soil Texture:</span>{" "}
                    {soilTexture}
                  </p>
                  <p>
                    <span className="font-medium">
                      Available Space to Plant:
                    </span>{" "}
                    {availableSpaceToPlant}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <SproutIcon className="w-5 h-5 mr-2" />
                    Maintenance
                  </h3>
                  <p>
                    <span className="font-medium">Maintenance Level:</span>{" "}
                    {maintenance}
                  </p>
                  <p>
                    <span className="font-medium">Growth Rate:</span>{" "}
                    {growthRate}
                  </p>
                  <p>
                    <span className="font-medium">Propagation:</span>{" "}
                    {propagation}
                  </p>
                  <p>
                    <span className="font-medium">Problems:</span> {problems}
                  </p>
                  <p>
                    <span className="font-medium">
                      Resistance to Challenges:
                    </span>{" "}
                    {resistanceToChallenges}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="landscape">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Landscape Use</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p>
                    <span className="font-medium">Garden Spaces:</span>{" "}
                    {gardenSpaces}
                  </p>
                  <p>
                    <span className="font-medium">Landscape Location:</span>{" "}
                    {landscapeLocation}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium">Landscape Theme:</span>{" "}
                    {landscapeTheme}
                  </p>
                  <p>
                    <span className="font-medium">Design Features:</span>{" "}
                    {designFeatures}
                  </p>
                </div>
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-2">
                Environmental Factors
              </h3>
              <p>
                <span className="font-medium">Fire Risk:</span> {fireRisk}
              </p>
              <p>
                <span className="font-medium">Texture:</span> {texture}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ecology">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Wildlife Value</h3>
                  <p>{wildlifeValue}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Attracts</h3>
                  <div>
                    {attracts && attracts.length > 0 ? (
                      <ul className="list-disc ml-6">
                        {attracts.map((attract, index) => (
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
                    <Info className="w-5 h-5 mr-2" />
                    Edibility and Uses
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      <span className="font-medium">Edibility:</span>{" "}
                      {edibility}
                    </p>
                    <p>
                      <span className="font-medium">Uses:</span> {uses}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="toxicity">
                  <AccordionTrigger>
                    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                    Toxicity Information
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      <span className="font-medium">Poison Symptoms:</span>{" "}
                      {poisonSymptoms}
                    </p>
                    <p>
                      <span className="font-medium">
                        Poison Toxic Principle:
                      </span>{" "}
                      {poisonToxicPrinciple}
                    </p>
                    <p>
                      <span className="font-medium">Poison Dermatitis:</span>{" "}
                      {poisonDermatitis}
                    </p>
                    <p>
                      <span className="font-medium">Poison Part:</span>{" "}
                      {poisonPart}
                    </p>
                    <p>
                      <span className="font-medium">Poison Severity:</span>{" "}
                      {poisonSeverity}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="media">
                  <AccordionTrigger>
                    <MapPin className="w-5 h-5 mr-2" />
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
                    {soundFile && (
                      <div>
                        <h4 className="font-medium mb-2">Sound</h4>
                        <audio src={soundFile} controls className="w-full" />
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

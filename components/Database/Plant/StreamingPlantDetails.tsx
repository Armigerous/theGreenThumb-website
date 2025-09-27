"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { PlantData } from "@/types/plant";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Reason: Dynamically import heavy components for better code splitting
const ImageGallery = dynamic(() => import("./ImageGallery"), {
  loading: () => (
    <div className="relative w-full max-w-3xl h-[500px] bg-cream-100 rounded-lg overflow-hidden">
      <Skeleton className="h-full w-full" />
    </div>
  ),
});

const AudioPlayerButton = dynamic(() => import("./AudioButton"), {
  loading: () => <Skeleton className="w-6 h-6 rounded" />,
});

// Reason: Separate critical content for better streaming performance
const CriticalContent = ({ plant }: { plant: PlantData }) => {
  const {
    scientific_name: scientificName,
    sound_file: soundFile,
    genus,
    species,
    family,
    phonetic_spelling: phoneticSpelling,
    common_names: commonNames,
    description,
    images: plantImages,
  } = plant;

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8">
      {/* Left Column: Images - Critical for LCP */}
      <div className="md:w-1/2">
        <Suspense
          fallback={
            <div className="relative w-full max-w-3xl h-[500px] bg-cream-100 rounded-lg overflow-hidden">
              <Skeleton className="h-full w-full" />
            </div>
          }
        >
          <ImageGallery
            images={
              plantImages
                ?.filter((img) => img.img !== null)
                .map(({ img, alt_text, caption, attribution }) => ({
                  img: img as string,
                  altText: alt_text || "No description available",
                  caption: caption || "",
                  attribution: attribution || "",
                })) || []
            }
            priority={true} // Reason: Critical for LCP
          />
        </Suspense>
      </div>

      {/* Right Column: Basic Info - Critical for FCP */}
      <div className="md:w-1/2">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            {scientificName}
            {soundFile && (
              <Suspense fallback={<Skeleton className="w-6 h-6 rounded" />}>
                <AudioPlayerButton soundFile={soundFile} />
              </Suspense>
            )}
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

          {description && (
            <div className="prose prose-sm mb-4 text-lg">
              {description.replace(/<[^>]*>/g, "").slice(0, 200)}...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Reason: Non-critical content that can be streamed later
const NonCriticalContent = () => {
  return (
    <Suspense fallback={<Skeleton className="h-16 w-full my-8" />}>
      <div className="animate-pulse">
        {/* This will be replaced with the full PlantDetails component */}
        <div className="h-96 bg-gray-100 rounded-lg" />
      </div>
    </Suspense>
  );
};

// Reason: Main streaming component for optimal performance
export default function StreamingPlantDetails({ plant }: { plant: PlantData }) {
  return (
    <section className="my-12">
      {/* Critical content loads first */}
      <CriticalContent plant={plant} />

      {/* Non-critical content streams in later */}
      <NonCriticalContent />
    </section>
  );
}

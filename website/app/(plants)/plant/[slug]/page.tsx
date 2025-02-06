// app/plant/[slug]/page.tsx

import React from "react";
import PlantDetails from "@/components/Database/Plant/PlantDetails";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import { supabase } from "@/lib/supabaseClient";
import { unstable_cache } from "next/cache";
import { PlantData } from "@/types/plant";

// Revalidate every 24 hours (86400 seconds) for ISR
export const revalidate = 86400;

export async function generateStaticParams() {
  const { data: plants, error } = await supabase
    .from("plant_autocomplete")
    .select("slug");

  if (error) {
    console.error("Error fetching slugs:", error.message);
    return [];
  }

  return plants.map((plant) => ({
    slug: plant.slug,
  }));
}

// Cache the plant data fetch function
const getPlantData = unstable_cache(
  async (slug: string) => {
    const { data: rawPlant, error } = await supabase
      .from("plant_full_data")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !rawPlant) {
      throw new Error(error?.message || "Plant not found");
    }

    return rawPlant as PlantData;
  },
  ["plant-data"],
  {
    revalidate: 86400, // 24 hours
    tags: ["plants"],
  }
);

export default async function PlantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const plant = await getPlantData(slug);

    return (
      <MaxWidthWrapper>
        <PlantDetails plant={plant} />
        <StructuredData plant={plant} />
      </MaxWidthWrapper>
    );
  } catch (error) {
    console.error("Error fetching plant data:", error);
    return (
      <div className="text-center text-red-500">
        {error instanceof Error && error.message === "Plant not found"
          ? "Plant not found"
          : "An unexpected error occurred"}
      </div>
    );
  }
}

/**
 * Component to inject structured data (JSON-LD) into the page head.
 */
const StructuredData = ({ plant }: { plant: PlantData }) => {
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Plant",
    name: `${plant.genus} ${plant.species}`,
    description: plant.description,
    scientificName: plant.scientific_name,
    family: plant.family,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

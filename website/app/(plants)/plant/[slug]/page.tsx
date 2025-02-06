// app/plant/[slug]/page.tsx

import React from "react";
import PlantDetails from "@/components/Database/Plant/PlantDetails";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import { supabase } from "@/lib/supabaseClient";
import Head from "next/head";
import { PlantData } from "@/types/plant";

// Revalidate every 24 hours (86400 seconds) for ISR
export const revalidate = 86400;

/**

 * A simple in-memory cache to avoid duplicate fetches.
 */
const plantCache: Record<string, PlantData> = {};

export default async function PlantPage({
  params,
}: {
  // Keep the Promise-based params if that's your requirement:
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Return from cache if available
  if (plantCache[slug]) {
    return (
      <MaxWidthWrapper>
        <PlantDetails plant={plantCache[slug]} />
        <StructuredData plant={plantCache[slug]} />
      </MaxWidthWrapper>
    );
  }

  try {
    // Fetch data from the materialized view
    const { data: rawPlant, error } = await supabase
      .from("plant_full_data")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !rawPlant) {
      console.error(
        "Error fetching plant data:",
        error?.message || "Not found"
      );
      return <div className="text-center text-red-500">Plant not found</div>;
    }

    // Cache the fully transformed data
    plantCache[slug] = rawPlant as PlantData;

    return (
      <MaxWidthWrapper>
        <PlantDetails plant={plantCache[slug]} />
        <StructuredData plant={plantCache[slug]} />
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
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
};

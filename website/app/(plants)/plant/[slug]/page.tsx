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

/**
 * The main PlantPage component.
 */
export default async function PlantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

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
    const { data: plant, error } = await supabase
      .from("plant_full_data")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !plant) {
      console.error(
        "Error fetching plant data:",
        error?.message || "Not found"
      );
      return <div className="text-center text-red-500">Plant not found</div>;
    }

    plantCache[slug] = plant as PlantData;

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
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/plant/${plant.slug}`,
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

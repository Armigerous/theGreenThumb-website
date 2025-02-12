// app/plant/[slug]/page.tsx

import React from "react";
import PlantDetails from "@/components/Database/Plant/PlantDetails";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import { supabase } from "@/lib/supabaseClient";
import { unstable_cache } from "next/cache";
import { PlantData } from "@/types/plant";
import { Metadata } from "next";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const plant = await getPlantData(slug);

    const title = `${plant.scientific_name} | Plant Care & Info - The GreenThumb`;
    const description = plant.description
      ? `${plant.description.slice(0, 150)}...`
      : "Learn about plant care, growth, and maintenance with expert tips from The GreenThumb.";

    // Ensure tags is an array and filter out null values
    const tagsArray: string[] = Array.isArray(plant.tags)
      ? plant.tags.filter((tag): tag is string => tag !== null)
      : [];

    const keywords = [
      plant.scientific_name || "",
      plant.genus || "",
      plant.family || "",
      ...tagsArray.map((tag) => tag.toLowerCase()), // Convert tags to lowercase for consistency
      "gardening",
      "plant care",
      "horticulture",
      "The GreenThumb",
    ].filter(Boolean); // Remove empty strings

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/plant/${slug}`,
        images: plant.images?.[0]?.img
          ? [
              {
                url: plant.images[0].img,
                width: 1200,
                height: 630,
                alt: plant.images[0].alt_text || plant.scientific_name || "",
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: plant.images?.[0]?.img
          ? [
              {
                url: plant.images[0].img,
                width: 1200,
                height: 630,
                alt: plant.images[0].alt_text || plant.scientific_name || "",
              },
            ]
          : undefined,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/plant/${slug}`,
      },
      robots: {
        index: true,
        follow: true,
        noarchive: false,
        nosnippet: false,
        notranslate: false,
        noimageindex: false,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {};
  }
}

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

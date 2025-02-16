// app/plant/[slug]/page.tsx

import React, { Suspense } from "react";
import PlantDetails from "@/components/Database/Plant/PlantDetails";
import PlantDetailsSkeleton from "@/components/Database/Plant/PlantDetailsSkeleton";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import { supabase } from "@/lib/supabaseClient";
import { unstable_cache } from "next/cache";
import { PlantData } from "@/types/plant";
import { Metadata } from "next";

// Enable partial prerendering
export const experimental_ppr = true;

// Revalidate every 24 hours (86400 seconds) for ISR
export const revalidate = 86400;

// Cache the slugs query
const getPlantSlugs = unstable_cache(
  async () => {
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
  },
  ["plant-slugs"],
  {
    revalidate: 86400,
    tags: ["plants"],
  }
);

export async function generateStaticParams() {
  return getPlantSlugs();
}

// Cache the plant data fetch function
const getPlantData = unstable_cache(
  async (slug: string) => {
    // First get the plant data
    const { data: plant, error: plantError } = await supabase
      .from("plant_full_data")
      .select("*")
      .eq("slug", slug)
      .single();

    if (plantError || !plant) {
      throw new Error(plantError?.message || "Plant not found");
    }

    // Then get the scientific slug if this is a common name
    const { data: scientificData, error: slugError } = await supabase
      .from("plant_common_card_data")
      .select("scientific_slug")
      .eq("slug", slug)
      .single();

    if (slugError && slugError.code !== "PGRST116") {
      // Ignore not found error
      console.error("Error fetching scientific slug:", slugError);
    }

    return {
      plant: plant as PlantData,
      scientificSlug: scientificData?.scientific_slug || slug,
    };
  },
  ["plant-data"],
  {
    revalidate: 86400,
    tags: ["plants"],
  }
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const slug = (await params).slug;
    const { plant, scientificSlug } = await getPlantData(slug);
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "https://www.theofficialgreenthumb.com";

    const commonName = plant.common_names?.[0] || "Unknown";
    const allCommonNames = Array.isArray(plant.common_names)
      ? plant.common_names
      : [];

    // Enhanced NC-focused keywords
    const keywords = [
      plant.scientific_name,
      ...allCommonNames,
      plant.genus,
      plant.family,
      ...(plant.tags || []),
      // North Carolina specific terms
      "North Carolina native plants",
      "NC garden plants",
      "plants that grow in North Carolina",
      "North Carolina gardening",
      "NC plant care",
      "Piedmont plants",
      "Coastal Plain plants",
      "Mountain region plants",
      // Region-specific search patterns
      `${plant.scientific_name} North Carolina`,
      `growing ${commonName} in NC`,
      `${commonName} NC native`,
      // Common search patterns
      `${plant.scientific_name} care`,
      `${plant.scientific_name} plant`,
      `how to grow ${plant.scientific_name}`,
      ...allCommonNames
        .map((name) => [
          `${name} care`,
          `${name} plant`,
          `how to grow ${name}`,
          `${name} care guide`,
          `${name} growing tips`,
        ])
        .flat(),
    ].filter(Boolean);

    // Create a rich description that includes key information
    const description =
      `Complete guide for ${commonName} (${plant.scientific_name}) care. Learn about light requirements${plant.light ? ` (${plant.light.join(", ")})` : ""}, water requirements${plant.water_requirements ? ` (${plant.water_requirements})` : ""}, and soil preferences${plant.soil_drainage ? ` (${plant.soil_drainage.join(", ")})` : ""}. USDA zones ${plant.usda_zones?.join("-") || "varies"}.`.slice(
        0,
        150
      );

    const title =
      `${commonName} (${plant.scientific_name || ""}) Care Guide - Growing Tips & Instructions`.slice(
        0,
        60
      );

    return {
      title,
      description,
      keywords: keywords.join(", "),
      alternates: {
        canonical: `${baseUrl}/plant/${scientificSlug}`,
      },
      openGraph: {
        title: `${commonName} (${plant.scientific_name || ""}) Care Guide - Complete Growing Instructions`,
        description,
        url: `${baseUrl}/plant/${scientificSlug}`,
        type: "article",
        images: plant.images?.[0]?.img ? [{ url: plant.images[0].img }] : [],
        siteName: "The GreenThumb",
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title: `${commonName} Care Guide`,
        description: `Learn how to grow ${commonName} (${plant.scientific_name}). Complete care instructions and tips.`,
        images: plant.images?.[0]?.img ? [plant.images[0].img] : [],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Plant Not Found",
      description: "The requested plant could not be found.",
    };
  }
}

// Create a separate component for the plant content to enable suspense boundary
async function PlantContent({ slug }: { slug: string }) {
  try {
    const { plant } = await getPlantData(slug);
    return (
      <>
        <PlantDetails plant={plant} />
        <StructuredData plant={plant} />
      </>
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

export default async function PlantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  return (
    <MaxWidthWrapper>
      <Suspense fallback={<PlantDetailsSkeleton />}>
        <PlantContent slug={slug} />
      </Suspense>
    </MaxWidthWrapper>
  );
}

/**
 * Component to inject structured data (JSON-LD) into the page head.
 */
const StructuredData = ({ plant }: { plant: PlantData }) => {
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Article",
    headline: `Growing ${plant.scientific_name} in North Carolina - Complete Care Guide`,
    description: plant.description,
    image: plant.images?.[0]?.img,
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "The GreenThumb",
      url: process.env.NEXT_PUBLIC_BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "The GreenThumb",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`,
      },
    },
    mainEntity: {
      "@type": "Product",
      name: plant.scientific_name,
      description: plant.description,
      category: "Plants",
      brand: {
        "@type": "Brand",
        name: "The GreenThumb",
      },
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Scientific Name",
          value: plant.scientific_name,
        },
        {
          "@type": "PropertyValue",
          name: "Common Names",
          value: plant.common_names?.join(", "),
        },
        {
          "@type": "PropertyValue",
          name: "Light Requirements",
          value: plant.light?.join(", "),
        },
        {
          "@type": "PropertyValue",
          name: "Soil Drainage",
          value: plant.soil_drainage?.join(", "),
        },
        {
          "@type": "PropertyValue",
          name: "USDA Zones",
          value: plant.usda_zones?.join(", "),
        },
        {
          "@type": "PropertyValue",
          name: "Height",
          value:
            plant.height_min && plant.height_max
              ? `${plant.height_min} to ${plant.height_max} feet`
              : undefined,
        },
        {
          "@type": "PropertyValue",
          name: "Width",
          value:
            plant.width_min && plant.width_max
              ? `${plant.width_min} to ${plant.width_max} feet`
              : undefined,
        },
        {
          "@type": "PropertyValue",
          name: "Region",
          value: "North Carolina",
        },
        {
          "@type": "PropertyValue",
          name: "NC Climate Zones",
          value: "Mountains, Piedmont, and Coastal Plain",
        },
      ].filter((prop) => prop.value !== undefined),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: process.env.NEXT_PUBLIC_BASE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Plants",
          item: `${process.env.NEXT_PUBLIC_BASE_URL}/plants`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: plant.scientific_name,
          item: `${process.env.NEXT_PUBLIC_BASE_URL}/plant/${plant.slug}`,
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

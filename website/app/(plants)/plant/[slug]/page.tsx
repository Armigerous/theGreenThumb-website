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
    const slug = (await params).slug;
    const plant = await getPlantData(slug);

    // Get the scientific slug if this is a common name
    const { data: scientificData } = await supabase
      .from("plant_common_card_data")
      .select("scientific_slug")
      .eq("slug", slug)
      .single();

    // The canonical URL should always be the scientific name version
    const canonicalSlug = scientificData?.scientific_slug || slug;
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://thegreenthumb.com";

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
      ...allCommonNames.flatMap((name) => [
        `${name} care`,
        `${name} plant`,
        `how to grow ${name}`,
        `${name} care guide`,
        `${name} growing tips`,
      ]),
      // Generic gardening terms
      "plant care",
      "gardening guide",
      "plant maintenance",
      "growing tips",
      "North Carolina plants",
      "The GreenThumb",
      "plant care instructions",
      "garden plants",
      "indoor plants",
      "outdoor plants",
    ].filter(Boolean);

    // Enhanced NC-focused description
    let description = `Complete guide for growing ${commonName} (${plant.scientific_name}) in North Carolina. Learn about light requirements${plant.light ? ` (${plant.light.join(", ")})` : ""}, water needs${plant.water_requirements ? ` (${plant.water_requirements})` : ""}, and soil preferences${plant.soil_drainage ? ` (${plant.soil_drainage.join(", ")})` : ""}. Perfect for USDA zones ${plant.usda_zones?.join("-") || "varies"}, common in NC gardens. Expert plant care tips from The GreenThumb's North Carolina growing guide.`;
    description = description.slice(0, 150);

    let title = `${commonName} Care Guide - How to Grow in North Carolina (NC) - Complete Instructions`;
    title = title.slice(0, 60);

    // Create full URL for the image
    const ogImage = plant.images?.[0]?.img
      ? new URL(plant.images[0].img).protocol === "http"
        ? plant.images[0].img
        : `${baseUrl}${plant.images[0].img}`
      : `${baseUrl}/no-plant-image.png`; // Provide a default image

    return {
      title,
      description,
      keywords: keywords.join(", "),
      alternates: {
        canonical: `${baseUrl}/plant/${canonicalSlug}`,
      },
      openGraph: {
        title: `${commonName} (${plant.scientific_name || ""}) Care Guide - Complete Growing Instructions`,
        description,
        url: `${baseUrl}/plant/${canonicalSlug}`,
        type: "article",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${commonName} (${plant.scientific_name})`,
          },
        ],
        siteName: "The GreenThumb",
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title: `${commonName} Care Guide`,
        description: `Learn how to grow ${commonName} (${plant.scientific_name}). Complete care instructions and tips.`,
        images: [ogImage],
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
    const plant = await getPlantData(slug);
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

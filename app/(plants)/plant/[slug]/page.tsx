// app/plant/[slug]/page.tsx

import PlantDetails from "@/components/Database/Plant/PlantDetails";
import PlantDetailsSkeleton from "@/components/Database/Plant/PlantDetailsSkeleton";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import { supabase } from "@/lib/supabaseClient";
import { PlantData } from "@/types/plant";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { Suspense } from "react";

// Enable partial prerendering for better streaming performance
export const experimental_ppr = true;

// Revalidate every 24 hours (86400 seconds) for ISR
export const revalidate = 86400;

// Reason: Enable static generation for better TTFB performance
export const dynamic = "force-static";

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

// Cache the metadata generation
const getMetadataKeywords = (plant: PlantData) => {
  const allCommonNames = Array.isArray(plant.common_names)
    ? plant.common_names
    : [];

  return [
    plant.scientific_name,
    ...allCommonNames,
    plant.genus,
    plant.family,
    ...(plant.tags || []),
    `${plant.scientific_name} care`,
    `${plant.scientific_name} plant`,
    `how to grow ${plant.scientific_name}`,
    ...allCommonNames.map((name) => `${name} care`),
    ...allCommonNames.map((name) => `${name} plant`),
    "plant care",
    "gardening guide",
    "North Carolina plants",
    "The GreenThumb",
  ].filter(Boolean);
};

// Reason: Optimize data fetching with separate queries for better reliability
const getPlantDataWithSlug = unstable_cache(
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
  ["plant-data-with-slug"],
  {
    revalidate: 86400,
    tags: ["plants", "plant-details"],
  }
);

// Reason: Optimize metadata generation for better TTFB by enabling static generation
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const { plant, scientificSlug } = await getPlantDataWithSlug(slug);
  const commonName = plant.common_names?.[0] || "Unknown";
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://theofficialgreenthumb.com";

  const description = `Complete guide for ${commonName} (${
    plant.scientific_name
  }) care. Learn about light requirements${
    plant.light ? ` (${plant.light.join(", ")})` : ""
  }, water requirements${
    plant.water_requirements ? ` (${plant.water_requirements})` : ""
  }, and soil preferences${
    plant.soil_drainage ? ` (${plant.soil_drainage.join(", ")})` : ""
  }. USDA zones ${plant.usda_zones?.join("-") || "varies"}.`.slice(0, 150);

  const title = `${commonName} (${
    plant.scientific_name || ""
  }) Care Guide`.slice(0, 60);

  // Reason: Optimize image loading for better LCP performance
  const ogImage = plant.images?.[0]?.img
    ? {
        url: plant.images[0].img,
        width: 1200,
        height: 630,
        alt: `${plant.scientific_name} plant image`,
      }
    : {
        url: `${baseUrl}/no-plant-image.png`,
        width: 1200,
        height: 630,
        alt: "Default plant image",
      };

  return {
    title,
    description,
    keywords: getMetadataKeywords(plant).join(", "),
    alternates: {
      canonical: `${baseUrl}/plant/${scientificSlug}`,
    },
    openGraph: {
      title: `${commonName} (${plant.scientific_name || ""}) Care Guide`,
      description,
      url: `${baseUrl}/plant/${scientificSlug}`,
      type: "article",
      images: [ogImage],
      siteName: "The GreenThumb",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${commonName} Care Guide`,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Reason: Optimize content loading with streaming and better error handling
async function PlantContent({ slug }: { slug: string }) {
  try {
    const { plant } = await getPlantDataWithSlug(slug);
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

// Reason: Implement streaming layout for better perceived performance
export default async function PlantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  return (
    <MaxWidthWrapper>
      {/* Reason: Stream critical content first for better FCP */}
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
    headline: `${plant.scientific_name} Care Guide`,
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

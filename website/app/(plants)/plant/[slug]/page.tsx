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

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  const plant = await getPlantData(params.slug);

  return {
    title: plant.scientific_name ?? "Plant Details",
    description: plant.description ?? "Plant Details",
    openGraph: {
      title: plant.scientific_name ?? "Plant Details",
      description: plant.description ?? "Plant Details",
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?title=${encodeURIComponent(plant.scientific_name ?? "")}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: plant.scientific_name ?? "Plant Details",
      description: plant.description ?? "Plant Details",
      images: [
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?title=${encodeURIComponent(plant.scientific_name ?? "")}`,
      ],
    },
  };
};

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

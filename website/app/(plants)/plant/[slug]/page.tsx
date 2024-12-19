// app/plant/[slug]/page.tsx

import PlantDetails from "@/components/Database/Plant/PlantDetails";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import { supabase } from "@/lib/supabaseClient";

// Revalidate every 24 hours
export const revalidate = 86400;

export async function generateStaticParams() {
  try {
    // Query your Supabase database directly for all slugs
    const { data, error } = await supabase.from("mainPlantData").select("slug");

    if (error) {
      console.error("Error fetching slugs from Supabase:", error.message);
      return [];
    }

    if (!data || data.length === 0) {
      console.error("No slugs found in the database");
      return [];
    }

    // Map the slugs into the format required by Next.js
    return data.map((plant) => ({
      slug: plant.slug,
    }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

export default async function PlantPage({
  params,
}: {
  params: Promise<{ slug?: string }>;
}) {
  const slug = (await params).slug;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/plant?slug=${slug}`
    );

    if (!response.ok) {
      console.error("Failed to fetch plant data");
      return <div className="text-center text-red-500">Plant not found</div>;
    }

    const plant = await response.json();

    if (!plant || !plant.description) {
      return <div className="text-center text-red-500">Plant not found</div>;
    }

    return (
      <MaxWidthWrapper>
        <PlantDetails plant={plant} />
      </MaxWidthWrapper>
    );
  } catch (error) {
    console.error("Error fetching plant data:", error);
    return (
      <div className="text-center text-red-500">
        An unexpected error occurred
      </div>
    );
  }
}

// generate metadata for SEO fuck me fuck me fuck me afsl;sdhaflkjasdhlkfjdhaslkjfdhlkasjhfdlkjsaghlkdjshhkjd

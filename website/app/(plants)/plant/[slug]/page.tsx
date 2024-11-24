// app/plant/[slug]/page.tsx

import PlantDetails from "@/components/Database/Plant/PlantDetails";
import { MaxWidthWrapper } from "@/components/maxWidthHeader";
import { fetchPlantData } from "@/lib/utils";
import { ApiResponse } from "@/types/plantsList";
import { Metadata } from "next";

// Revalidate every 24 hours
export const revalidate = 86400;

export async function generateStaticParams() {
  const baseUrl = "https://plants.ces.ncsu.edu/api/plants/?format=json";
  let nextUrl: string | null = baseUrl;
  let allPlants: { slug: string }[] = [];
  const problematicSlugs = [
    "amsonia-tabernaemontana-var-tabernaemontana",
    "asplenium-platyneuron",
    "asplenium-rhizophyllum",
    "aspidistra",
    "angelica-archangelica",
    "angelica-capitellata",
    "aristolochia-macrophylla",
    "aristolochia-tomentosa",
    "aristolochia-tomentosa",
    "adiantum",
    "adiantum-raddianum",
    "aechmea",
    "anisodontea",
    "artemisia-powis-castle",
    "adenium-obesum",
    "adiantum-capillus-veneris",
    "prunus-persica-winblo",
    "davallia-solida-var-fejeensis",
    "prunus-persica-norman",
    "hydrangea-macrophylla-lemon-daddy",
  ]; // Add known problematic slugs
  const maxPlants = 100; // Adjust this limit as needed

  while (nextUrl && allPlants.length < maxPlants) {
    const response = await fetch(nextUrl);
    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`);
      break;
    }

    const data: ApiResponse = await response.json();
    const newPlants = data.results
      .map((plant) => ({ slug: plant.slug }))
      .filter((plant) => !problematicSlugs.includes(plant.slug)); // Filter out problematic slugs

    allPlants = [...allPlants, ...newPlants];

    // Stop if we reach the maximum number of plants
    if (allPlants.length >= maxPlants) {
      allPlants = allPlants.slice(0, maxPlants); // Trim to exact limit
      break;
    }

    nextUrl = data.next;
  }

  return allPlants.map((plant) => ({ slug: plant.slug }));
}

export default async function PlantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plant = await fetchPlantData(slug).catch((error) => {
    console.error("Error fetching plant data:", error);
    return null; // Return null if fetching fails
  });

  if (!plant || !plant.description) {
    // Handle the error gracefully
    return <div className="text-center text-red-500">Plant not found</div>;
  }

  return (
    <MaxWidthWrapper>
      <PlantDetails plant={plant} />
    </MaxWidthWrapper>
  );
}

// Optional metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const plant = await fetchPlantData(slug).catch((error) => {
    console.error("Error fetching plant metadata:", error);
    return null;
  });

  if (!plant) {
    return {
      title: "Plant Details",
      description: "Explore detailed information about plants.",
    };
  }

  return {
    title: `${plant.commonname_set?.[0] || "Unknown Plant"} (${
      plant.scientific_name || "Unknown"
    }) - Plant Details`,
    description:
      plant.description?.substring(0, 150) ||
      "Explore detailed information about plants.",
  };
}

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

// Mock data
const plantResults = [
  {
    id: 1,
    scientificName: "Lavandula angustifolia",
    commonNames: ["Lavender", "English Lavender", "Common Lavender"],
    description:
      "Lavandula angustifolia, commonly known as lavender, is a flowering plant in the family Lamiaceae, native to the Mediterranean. It's widely cultivated for its fragrant flowers and essential oils, used in perfumes, cosmetics, and aromatherapy. The plant is also popular in gardens for its attractive purple flowers and silvery-green foliage.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    scientificName: "Rosmarinus officinalis",
    commonNames: ["Rosemary", "Old Man"],
    description:
      "Rosmarinus officinalis, commonly known as rosemary, is an aromatic evergreen shrub with needle-like leaves and white, pink, purple, or blue flowers. Native to the Mediterranean region, it's widely used as a culinary herb and for its potential health benefits. Rosemary is also valued in gardening for its attractive appearance and ability to attract pollinators.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    scientificName: "Ocimum basilicum",
    commonNames: ["Sweet Basil", "Common Basil"],
    description:
      "Ocimum basilicum, commonly known as sweet basil or common basil, is a culinary herb of the family Lamiaceae. It's native to tropical regions from central Africa to Southeast Asia. Basil is widely used in various cuisines, particularly in Italian and Southeast Asian dishes. The plant is known for its aromatic leaves, which have a sweet and slightly peppery taste.",
    image: "/placeholder.svg?height=200&width=300",
  },
];

const SearchResults = ({ query }: { query?: string }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-left mb-8">
        <h2 className="text-2xl sm:text-3xl text-pretty font-heading font-semibold tracking-tight text-zinc-800">
          {query ? `Search results for "${query}"` : "All Plants"}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {plantResults.map((plant) => (
          <Link href={`/plant/${plant.id}`} key={plant.id} className="group">
            <Card className="overflow-hidden transition-shadow hover:shadow-lg text-left">
              <Image
                src="https://placehold.co/600x400"
                alt={plant.scientificName}
                width={300}
                height={200}
                className="w-full object-cover h-48"
              />
              <CardHeader className="p-4">
                <h3 className="text-lg font-semibold">
                  {plant.scientificName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {plant.commonNames[0]}
                </p>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {plant.description}
                </p>
              </CardContent>
              <CardFooter className="p-4">
                <p className="text-sm text-primary group-hover:underline">
                  Learn more
                </p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;

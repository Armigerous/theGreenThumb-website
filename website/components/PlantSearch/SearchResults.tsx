import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import PaginationComponent from "./Pagination";
import { ApiResponse } from "@/types/plantsList";

export const revalidate = 86400; // Revalidate every 24 hours

const SearchResults = async ({
  query,
  page,
}: {
  query?: string;
  page: number;
}) => {
  const limit = 28;
  const offset = (page - 1) * limit;

  const API_URL = `https://plants.ces.ncsu.edu/api/plants/?format=json&limit=${limit}&offset=${offset}`;
  const res = await fetch(API_URL);
  const data: ApiResponse = await res.json();

  const totalPages = Math.ceil(data.count / limit);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-left mb-8">
        <h2 className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight text-zinc-800">
          {query ? `Search results for "${query}"` : "All Plants"}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.results.map((plant) => (
          <Link
            href={`/plant/${plant.slug}`}
            key={plant.slug}
            className="group"
          >
            <Card className="overflow-hidden transition-shadow hover:shadow-lg text-left">
              <Image
                src={
                  plant.plantimage_set && plant.plantimage_set.length > 0
                    ? plant.plantimage_set[0].img
                    : "https://placehold.co/600x400"
                }
                alt={plant.scientific_name || "Plant image"}
                width={300}
                height={200}
                className="w-full object-cover h-48"
              />
              <CardHeader className="p-4">
                <h3 className="text-lg font-semibold">
                  {plant.scientific_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {plant.commonname_set?.[0]}
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
      <div>
        <PaginationComponent
          currentPage={page}
          totalPages={totalPages}
          query={query}
        />
      </div>
    </div>
  );
};

export default SearchResults;

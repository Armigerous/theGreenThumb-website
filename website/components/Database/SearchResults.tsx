import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PaginationComponent from "./Pagination";
import { ApiResponse } from "@/types/plantsList";
import DOMPurify from "isomorphic-dompurify";

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

  const API_URL = query
    ? `https://plants.ces.ncsu.edu/api/plants/?format=json&limit=${limit}&offset=${offset}&q=${encodeURIComponent(
        query
      )}`
    : `https://plants.ces.ncsu.edu/api/plants/?format=json&limit=${limit}&offset=${offset}`;

  try {
    const res = await fetch(API_URL);

    // Check if the response is ok (status 200-299)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: ApiResponse = await res.json();
    const totalPages = Math.ceil(data.count / limit);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-left mb-8">
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight text-zinc-800">
            {query ? `Search results for "${query}"` : "All Plants"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {data.count} result{data.count !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Conditional Rendering for No Results */}
        {data.results.length === 0 ? (
          <div className="text-center">
            <Image
              src="/sad-plant.png" // Replace with your "no results" image path
              alt="No results found"
              width={300}
              height={300}
              className="mx-auto rounded-2xl border-4 border-black"
            />
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight text-zinc-800 mt-4">
              No results found 🌱
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Try searching with different keywords.
            </p>
          </div>
        ) : (
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
                        : "/no-plant-image.png"
                    }
                    alt={plant.scientific_name || "Plant image"}
                    width={300}
                    height={200}
                    className="w-full object-cover h-48"
                  />
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg font-semibold">
                      {plant.scientific_name}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {plant.commonname_set?.[0]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div
                      className="text-sm text-muted-foreground line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(plant.description || "", {
                          ALLOWED_TAGS: ["p", "strong", "em", "br", "ul", "li"],
                        }),
                      }}
                    />
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
        )}

        {/* Pagination Component */}
        {data.results.length > 0 && (
          <div>
            <PaginationComponent
              currentPage={page}
              totalPages={totalPages}
              query={query}
            />
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching search results:", error);

    // Return the error UI
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Image
          src="/sad-plant.png" // Replace with the path to your error image
          alt="Error"
          width={300}
          height={300}
          className="mx-auto rounded-md"
        />
        <h2 className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight text-red-600">
          Oops! Something went wrong 🌱
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          We couldn{"'"}t load the plants. Maybe take a break and try again in a
          few minutes?
        </p>
        <Link href="/" className="text-primary mt-4 inline-block underline">
          Go back to Home
        </Link>
      </div>
    );
  }
};

export default SearchResults;

"use client";

import Image from "next/image";
import Link from "next/link";
import PaginationComponent from "../Pagination";
import PlantCard from "@/components/Database/PlantCard";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component
import { useState, useEffect } from "react";

export const revalidate = 86400; // Revalidate every 24 hours

interface Plant {
  slug: string;
  description: string;
  scientificName: string;
  commonName: string;
  tag: string;
  image: {
    img: string;
    altText: string;
    caption: string;
    attribution: string;
  };
}

interface ApiResponse {
  results: Plant[];
  count: number;
}

const SearchResults = ({ query, page }: { query?: string; page: number }) => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const limit = 28;
  const offset = (page - 1) * limit;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/plants?query=${query || ""}&limit=${limit}&offset=${offset}`
        );

        if (!res.ok) throw new Error("Failed to fetch plant data");

        const fetchedData: ApiResponse = await res.json();
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, page, limit, offset]);

  if (loading) {
    return (
      <div className="container mx-auto py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <div
              key={index}
              className="group/card overflow-hidden rounded-xl shadow-md transition-transform text-left"
            >
              {/* Image Skeleton */}
              <Skeleton className="w-full h-48 object-cover rounded-t-xl" />

              {/* Header Section */}
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4 rounded-md" /> {/* Title */}
                <Skeleton className="h-4 w-1/2 rounded-md" />{" "}
                {/* Description */}
              </div>

              {/* Badge Skeleton */}
              <div className="px-4 pb-2">
                <Skeleton className="h-6 w-20 rounded-md" /> {/* Badge */}
              </div>

              {/* Content Section */}
              <div className="px-4 space-y-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-4/6 rounded-md" />
              </div>

              {/* Footer Section */}
              <div className="p-4">
                <Skeleton className="h-4 w-24 rounded-md" /> {/* Learn more */}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.results.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Image
          src="/sad-plant.png" // Replace with the path to your error image
          alt="Error"
          width={300}
          height={300}
          className="mx-auto rounded-md"
          placeholder="blur"
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

  const totalPages = Math.ceil(data.count / limit);

  return (
    <div className="container mx-auto py-4">
      <div className="text-left mb-4">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-cream-800">
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
            src="/sad-plant.png"
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
            <PlantCard key={plant.slug} plant={plant} />
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
};

export default SearchResults;

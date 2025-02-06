"use client";

import Image from "next/image";
import Link from "next/link";
import PaginationComponent from "../Pagination";
import PlantCard from "@/components/Database/PlantCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { PlantData } from "@/types/plant";

// Cache structure to store API responses
interface CacheEntry {
  data: ApiResponse;
  timestamp: number;
}

interface ApiResponse {
  results: PlantData[];
  count: number;
}

// Cache duration in milliseconds (1 hour)
const CACHE_DURATION = 60 * 60 * 1000;

// In-memory cache object
const responseCache: Record<string, CacheEntry> = {};

const SearchResults = ({
  query,
  page,
  filters,
}: {
  query?: string;
  page: number;
  filters?: string;
}) => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const limit = 28;
  const offset = (page - 1) * limit;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Construct URL
        let url = `/api/plants/plant_card?limit=${limit}&offset=${offset}`;
        if (query) url += `&query=${encodeURIComponent(query)}`;
        if (filters) url += `&filters=${encodeURIComponent(filters)}`;

        // Check cache first
        const cacheKey = url;
        const cachedResponse = responseCache[cacheKey];
        const now = Date.now();

        if (cachedResponse && now - cachedResponse.timestamp < CACHE_DURATION) {
          setData(cachedResponse.data);
          setLoading(false);
          return;
        }

        // If not in cache or expired, fetch from API
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch plant data");

        const fetchedData: ApiResponse = await res.json();

        // Update cache
        responseCache[cacheKey] = {
          data: fetchedData,
          timestamp: now,
        };

        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, page, filters, limit, offset]);

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
          src="/sad-plant.png"
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

"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { memo, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { PlantCardData, PlantData } from "@/types/plant";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import components
const PaginationComponent = dynamic(() => import("../Pagination"), {
  loading: () => <div className="h-10 bg-gray-200 animate-pulse rounded" />,
});

const PlantCard = dynamic(() => import("@/components/Database/PlantCard"), {
  loading: () => <PlantCardSkeleton />,
});

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

// Separate PlantCardSkeleton into its own component for reuse
const PlantCardSkeleton = memo(() => (
  <div className="group/card overflow-hidden rounded-xl shadow-md transition-transform text-left">
    <Skeleton className="w-full h-48 object-cover rounded-t-xl" />
    <div className="p-4 space-y-2">
      <Skeleton className="h-5 w-3/4 rounded-md" />
      <Skeleton className="h-4 w-1/2 rounded-md" />
    </div>
    <div className="px-4 pb-2">
      <Skeleton className="h-6 w-20 rounded-md" />
    </div>
    <div className="px-4 space-y-2">
      <Skeleton className="h-4 w-full rounded-md" />
      <Skeleton className="h-4 w-5/6 rounded-md" />
      <Skeleton className="h-4 w-4/6 rounded-md" />
    </div>
    <div className="p-4">
      <Skeleton className="h-4 w-24 rounded-md" />
    </div>
  </div>
));

PlantCardSkeleton.displayName = "PlantCardSkeleton";

// Error state component
const ErrorState = memo(() => (
  <div className="container mx-auto px-4 py-8 text-center">
    <Image
      src="/sad-plant.png"
      alt="Error"
      width={300}
      height={300}
      className="mx-auto rounded-md"
      priority
    />
    <h2 className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight text-red-600">
      Oops! Something went wrong 🌱
    </h2>
    <p className="text-sm text-muted-foreground mt-2">
      We couldn{"'"}t load the plants. Maybe take a break and try again in a few
      minutes?
    </p>
    <Link href="/" className="text-primary mt-4 inline-block underline">
      Go back to Home
    </Link>
  </div>
));

ErrorState.displayName = "ErrorState";

// No results component
const NoResults = memo(() => (
  <div className="text-center">
    <Image
      src="/sad-plant.png"
      alt="No results found"
      width={300}
      height={300}
      className="mx-auto rounded-2xl border-4 border-black"
      priority
    />
    <h2 className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight text-zinc-800 mt-4">
      No results found 🌱
    </h2>
    <p className="text-sm text-muted-foreground mt-2">
      Try searching with different keywords.
    </p>
  </div>
));

NoResults.displayName = "NoResults";

const SearchResults = memo(
  ({
    query,
    page,
    filters,
    nameType,
  }: {
    query?: string;
    page: number;
    filters?: string;
    nameType?: string;
  }) => {
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // Create a ref for the scrolling container
    const parentRef = useRef<HTMLDivElement>(null);

    const limit = 28;
    const offset = (page - 1) * limit;

    // Memoize the URL construction
    const url = useMemo(() => {
      let baseUrl = `/api/plants/plant_card?limit=${limit}&offset=${offset}`;
      if (query) baseUrl += `&query=${encodeURIComponent(query)}`;
      if (filters) baseUrl += `&filters=${encodeURIComponent(filters)}`;
      if (nameType) baseUrl += `&nameType=${encodeURIComponent(nameType)}`;
      return baseUrl;
    }, [query, filters, nameType, limit, offset]);

    // Memoize the fetch function
    const fetchData = useCallback(async () => {
      setLoading(true);
      try {
        // Check cache first
        const cachedResponse = responseCache[url];
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
        responseCache[url] = {
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
    }, [url]);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    // Calculate the number of columns based on screen size
    const getColumnCount = () => {
      if (typeof window === "undefined") return 4; // Default for SSR
      const width = window.innerWidth;
      if (width < 640) return 1; // sm
      if (width < 768) return 2; // md
      if (width < 1024) return 3; // lg
      return 4; // xl and above
    };

    const columnCount = useMemo(() => getColumnCount(), []);

    // Setup virtualizer
    const rowVirtualizer = useVirtualizer({
      count: data ? Math.ceil(data.results.length / columnCount) : 0,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 520, // Increased from 400 to account for full card height
      overscan: 5,
    });

    if (loading) {
      return (
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: limit }).map((_, index) => (
              <PlantCardSkeleton key={index} />
            ))}
          </div>
        </div>
      );
    }

    if (!data || data.results.length === 0) {
      return <ErrorState />;
    }

    const totalPages = Math.ceil(data.count / limit);

    return (
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="text-left mb-4">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-cream-800">
            {query ? `Search results for "${query}"` : "All Plants"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {data.count} result{data.count !== 1 ? "s" : ""} found
          </p>
        </div>

        {data.results.length === 0 ? (
          <NoResults />
        ) : (
          <div className="relative">
            <div
              ref={parentRef}
              className="h-[80vh] sm:h-[900px] overflow-auto scrollbar-hide overscroll-none"
            >
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const fromIndex = virtualRow.index * columnCount;
                  const toIndex = Math.min(
                    fromIndex + columnCount,
                    data.results.length
                  );
                  const rowItems = data.results.slice(fromIndex, toIndex);

                  return (
                    <div
                      key={virtualRow.index}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8"
                    >
                      {rowItems.map((plant: PlantCardData, index: number) => (
                        <PlantCard
                          key={`${plant.slug}-${plant.scientific_name}`}
                          plant={plant}
                          index={index}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
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
  }
);

SearchResults.displayName = "SearchResults";

export default SearchResults;

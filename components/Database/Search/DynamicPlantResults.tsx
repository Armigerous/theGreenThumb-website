"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

// Reason: Dynamic component that will be streamed with PPR
const SearchResults = dynamic(() => import("./SearchResults"), {
  loading: () => <SearchResultsSkeleton />,
  // Reason: Enable SSR for PPR streaming - component will be server-rendered and streamed
  ssr: true,
});

// Skeleton component for search results
const SearchResultsSkeleton = () => (
  <div className="text-left mx-auto px-8 md:px-0 sm:px-4">
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

interface DynamicPlantResultsProps {
  query?: string;
  page: number;
  filters?: string;
  nameType?: string;
}

// Reason: Dynamic plant results component that will be streamed
export function DynamicPlantResults({
  query,
  page,
  filters,
  nameType,
}: DynamicPlantResultsProps) {
  return (
    <div className="text-left mx-auto px-8 md:px-0 sm:px-4">
      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResults
          query={query}
          page={page}
          filters={filters}
          nameType={nameType}
        />
      </Suspense>
    </div>
  );
}

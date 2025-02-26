"use client";

import { Autocomplete } from "./Autocomplete";
import dynamic from "next/dynamic";

// Lazy load SearchResults component
const SearchResults = dynamic(() => import("./SearchResults"), {
  loading: () => <SearchResultsSkeleton />,
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

const Search = ({
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
  return (
    <div className="text-left mx-auto px-8 md:px-0 sm:px-4">
      <Autocomplete />
      <SearchResults
        query={query}
        page={page}
        filters={filters}
        nameType={nameType}
      />
    </div>
  );
};

export default Search;

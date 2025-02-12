// app/components/Database/Search/SearchSkeleton.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SearchSkeleton() {
  // Use the same limit as in your SearchResults loading skeleton
  const limit = 28;

  return (
    <div className="text-left">
      {/* Skeleton for the Autocomplete/Search Input */}
      <div className="px-4">
        <Skeleton className="w-full max-w-screen-sm h-10 my-2 rounded-lg" />
      </div>

      {/* Skeleton for Search Results */}
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
                <Skeleton className="h-4 w-1/2 rounded-md" /> {/* Subtitle */}
              </div>

              {/* Badge Skeleton */}
              <div className="px-4 pb-2">
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>

              {/* Content Section */}
              <div className="px-4 space-y-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-4/6 rounded-md" />
              </div>

              {/* Footer Section */}
              <div className="p-4">
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

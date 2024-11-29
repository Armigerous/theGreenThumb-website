import React from "react";
import Image from "next/image";
import PaginationComponent from "./Pagination";
import { fetchTips } from "@/lib/utils";
import TipCard from "./TipCard";

export const revalidate = 86400; // Revalidate every 24 hours

const SearchResults = async ({
  query,
  page,
}: {
  query?: string;
  page: number;
}) => {
  const limit = 28;

  // Fetch tips data
  const tips = await fetchTips();

  // Calculate total pages
  const totalPages = Math.ceil(tips.length / limit);

  // Paginate results
  const paginatedTips = tips.slice((page - 1) * limit, page * limit);

  return (
    <div className="container mx-auto py-8">
      {/* Featured Posts */}
      {/* Recent Posts */}
      {/* Search Combobox that pops up in front kinda like a modal */}
      <div className="text-left mb-8">
        <h2 className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight text-zinc-800">
          {query ? `Search results for "${query}"` : "All Tips & Tricks"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {tips.length} result{tips.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Conditional Rendering for No Results */}
      {paginatedTips.length === 0 ? (
        <div className="text-center">
          <Image
            src="/sad-plant.png"
            alt="No results found"
            width={300}
            height={300}
            className="mx-auto rounded-2xl border-4 border-black"
          />
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight text-zinc-800 mt-4">
            No results found 📝
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Try searching with different keywords.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedTips.map((tip: any) => (
            <TipCard key={tip._id} tip={tip} />
          ))}
        </ul>
      )}

      {/* Pagination Component */}
      {paginatedTips.length > 0 && (
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

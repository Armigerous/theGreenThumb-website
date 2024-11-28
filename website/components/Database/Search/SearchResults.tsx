import { fetchSearchResults } from "@/lib/utils";
import { ApiResponse } from "@/types/plantsList";
import Image from "next/image";
import Link from "next/link";
import PaginationComponent from "../Pagination";
import PlantCard from "@/components/Database/PlantCard";

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

  try {
    const data: ApiResponse = await fetchSearchResults(query, limit, offset);
    const totalPages = Math.ceil(data.count / limit);

    return (
      <div className="container mx-auto py-8">
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

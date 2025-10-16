import React from "react";
import Image from "next/image";
import PaginationComponent from "./Pagination";
import { fetchPaginatedPosts } from "@/lib/utils";
import TipCard from "./TipCard";
import { Tip } from "@/types/Tip";

export const revalidate = 86400; // Revalidate every 24 hours

const SearchResults = async ({
	query = "",
	page,
}: {
	query?: string;
	page: number;
}) => {
	const normalizedQuery = query.replace("-", " ") || ""; // Trim whitespace
	const limit = 28;

	// Calculate pagination parameters
	const start = (page - 1) * limit;
	const end = page * limit;

	try {
		// Fetch paginated tips data with query
		const { tips, totalCount } = await fetchPaginatedPosts(
			start,
			end,
			normalizedQuery
		);

		// Calculate total pages
		const totalPages = Math.ceil(totalCount / limit);

		return (
			<div className="container mx-auto py-8">
				<div className="text-left mb-8">
					<h2 className="text-2xl sm:text-3xl font-title-bold tracking-tight text-zinc-800">
						{normalizedQuery
							? `Search results for "${normalizedQuery}"`
							: "All Tips & Tricks"}
					</h2>
					<p className="text-sm text-muted-foreground">
						{totalCount} result{totalCount !== 1 ? "s" : ""} found
					</p>
				</div>

				{/* Conditional Rendering for No Results */}
				{tips.length === 0 ? (
					<div className="text-center">
						<Image
							src="/sad-plant.png"
							alt="No results found"
							width={300}
							height={300}
							className="mx-auto rounded-2xl border-4 border-black"
						/>
						<h2 className="text-2xl sm:text-3xl font-title-bold tracking-tight text-zinc-800 mt-4">
							No results found 📝
						</h2>
						<p className="text-sm text-muted-foreground mt-2">
							Try searching with different keywords.
						</p>
					</div>
				) : (
					<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{tips.map((tip: Tip) => (
							<TipCard key={tip._id} tip={tip} />
						))}
					</ul>
				)}

				{/* Pagination Component */}
				{tips.length > 0 && (
					<div>
						<PaginationComponent
							currentPage={page}
							totalPages={totalPages}
							query={normalizedQuery}
						/>
					</div>
				)}
			</div>
		);
	} catch (error) {
		console.error("Error fetching paginated tips:", error);
		return (
			<div className="text-center py-8">
				<h2 className="text-2xl sm:text-3xl font-title-bold tracking-tight text-zinc-800">
					Something went wrong
				</h2>
				<p className="text-sm text-muted-foreground mt-2">
					Please try refreshing the page.
				</p>
			</div>
		);
	}
};

export default SearchResults;

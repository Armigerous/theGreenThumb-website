"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { memo, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { PlantCardData, PlantData } from "@/types/plant";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";

// Dynamically import components
const PaginationComponent = dynamic(() => import("../Pagination"), {
	loading: () => <div className="h-10 bg-gray-200 animate-pulse rounded" />,
	// Reason: Enable SSR for PPR streaming
	ssr: true,
});

const PlantCard = dynamic(() => import("@/components/Database/PlantCard"), {
	loading: () => <PlantCardSkeleton />,
	// Reason: Enable SSR for PPR streaming
	ssr: true,
});

interface ApiResponse {
	results: PlantData[];
	count: number;
}

// Cache duration in milliseconds (1 hour)
const CACHE_DURATION = 60 * 60 * 1000;

// Fetcher function for SWR
const fetcher = async (url: string) => {
	const response = await fetch(url, {
		next: {
			revalidate: 3600,
			tags: ["plants"],
		},
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
};

// Separate PlantCardSkeleton into its own component for reuse
const PlantCardSkeleton = memo(() => (
	<div className="group/card overflow-hidden rounded-xl shadow-md transition-transform text-left h-[430px] w-full">
		<div className="relative w-full h-48">
			<Skeleton className="absolute inset-0 w-full h-full" />
		</div>

		<div className="px-5 py-4 space-y-2">
			<div className="space-y-1">
				<Skeleton className="h-6 w-3/4" /> {/* Title */}
				<Skeleton className="h-4 w-1/2" /> {/* Scientific name */}
			</div>
			<Skeleton className="h-5 w-24 rounded-full" /> {/* Badge */}
		</div>

		<div className="px-5">
			<div className="space-y-1">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-5/6" />
				<Skeleton className="h-4 w-4/6" />
			</div>
		</div>

		<div className="px-5 py-4 mt-auto">
			<Skeleton className="h-4 w-20" /> {/* Learn more */}
		</div>
	</div>
));

PlantCardSkeleton.displayName = "PlantCardSkeleton";

// Update the ErrorState component to accept and display error messages
const ErrorState = memo(({ message }: { message?: string }) => (
	<div className="container mx-auto py-8 text-center">
		<Image
			src="/sad-plant.png"
			alt="Error"
			width={300}
			height={300}
			className="mx-auto rounded-md"
			priority
		/>
		<h2 className="text-2xl sm:text-3xl font-title-bold tracking-tight text-red-600">
			Oops! Something went wrong 🌱
		</h2>
		<p className="text-sm text-muted-foreground mt-2">
			{message ||
				"We couldn't load the plants. Maybe take a break and try again in a few minutes?"}
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
		<h2 className="text-2xl sm:text-3xl font-title-bold tracking-tight text-zinc-800 mt-4">
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
		const [showTopFade, setShowTopFade] = useState(false);
		const [showBottomFade, setShowBottomFade] = useState(true);

		// Create a ref for the scrolling container
		const parentRef = useRef<HTMLDivElement>(null);

		const limit = 28;
		const offset = (page - 1) * limit;

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

		// Construct the URL for SWR
		const url = useMemo(() => {
			let baseUrl = `/api/plants/plant_card?limit=${limit}&offset=${offset}`;
			if (query) baseUrl += `&query=${encodeURIComponent(query)}`;
			if (filters) baseUrl += `&filters=${encodeURIComponent(filters)}`;
			if (nameType) baseUrl += `&nameType=${encodeURIComponent(nameType)}`;
			return baseUrl;
		}, [query, filters, nameType, limit, offset]);

		// Use SWR for data fetching with dynamic behavior for PPR
		const { data, error, isLoading } = useSWR<ApiResponse>(url, fetcher, {
			revalidateOnFocus: false,
			revalidateOnReconnect: true,
			dedupingInterval: CACHE_DURATION,
			keepPreviousData: true,
			// Reason: Ensure this component is treated as dynamic for PPR streaming
			suspense: false,
		});

		// Setup virtualizer
		const rowVirtualizer = useVirtualizer({
			count: data ? Math.ceil(data.results.length / columnCount) : 0,
			getScrollElement: () => parentRef.current,
			estimateSize: () => 450,
			overscan: 5,
		});

		// Handle scroll events to update fade visibility
		const handleScroll = useCallback(() => {
			if (!parentRef.current) return;

			const { scrollTop, scrollHeight, clientHeight } = parentRef.current;
			const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;

			setShowTopFade(scrollTop > 0);
			setShowBottomFade(!isAtBottom);
		}, []);

		useEffect(() => {
			const container = parentRef.current;
			if (!container) return;

			container.addEventListener("scroll", handleScroll);
			// Initial check
			handleScroll();

			return () => {
				container.removeEventListener("scroll", handleScroll);
			};
		}, [handleScroll]);

		if (isLoading) {
			return (
				<div className="container mx-auto py-4">
					<div className="mb-4">
						<Skeleton className="h-10 w-48 md:w-64 mb-2" />{" "}
						{/* Heading skeleton */}
						<Skeleton className="h-4 w-32" /> {/* Results count skeleton */}
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{Array.from({ length: limit }).map((_, index) => (
							<PlantCardSkeleton key={index} />
						))}
					</div>
				</div>
			);
		}

		if (error) {
			return <ErrorState message={error.message} />;
		}

		if (!data || data.results.length === 0) {
			return <NoResults />;
		}

		const totalPages = Math.ceil(data.count / limit);

		return (
			<div className="w-full py-4">
				<div className="text-left mb-4">
					<h2 className="text-2xl md:text-4xl font-title-bold tracking-tight text-cream-800">
						{query ? `Search results for "${query}"` : "All Plants"}
					</h2>
					<p className="text-sm text-muted-foreground">
						{data.count} result{data.count !== 1 ? "s" : ""} found
					</p>
				</div>

				<div className="relative">
					{/* Top fade */}
					<div
						className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
							showTopFade ? "opacity-100" : "opacity-0"
						}`}
					/>

					<div
						ref={parentRef}
						className="h-[80vh] sm:h-[900px] overflow-auto scrollbar-hide overscroll-none"
						onScroll={handleScroll}
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
										className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2"
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

					{/* Bottom fade */}
					<div
						className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
							showBottomFade ? "opacity-100" : "opacity-0"
						}`}
					/>
				</div>

				{/* Pagination Component */}
				{data.results.length > 0 && (
					<div>
						<PaginationComponent
							currentPage={page}
							totalPages={totalPages}
							query={query}
							nameType={nameType}
						/>
					</div>
				)}
			</div>
		);
	}
);

SearchResults.displayName = "SearchResults";

export default SearchResults;

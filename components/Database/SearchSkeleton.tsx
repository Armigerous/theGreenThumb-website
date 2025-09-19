import { Skeleton } from "@/components/ui/skeleton";

// Reason: Provide a loading skeleton for the search component to improve perceived performance
export function SearchSkeleton() {
	return (
		<div className="text-left mx-auto px-8 md:px-0 sm:px-4">
			{/* Search bar skeleton */}
			<div className="mb-6">
				<Skeleton className="h-14 w-full max-w-screen-sm rounded-lg" />
			</div>

			{/* Results header skeleton */}
			<div className="mb-4">
				<Skeleton className="h-8 w-48 md:w-64 mb-2" />
				<Skeleton className="h-4 w-32" />
			</div>

			{/* Plant cards grid skeleton */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{Array.from({ length: 8 }).map((_, index) => (
					<div
						key={index}
						className="group/card overflow-hidden rounded-xl shadow-md h-[430px] w-full"
					>
						<div className="relative w-full h-48">
							<Skeleton className="absolute inset-0 w-full h-full" />
						</div>
						<div className="px-5 py-4 space-y-2">
							<div className="space-y-1">
								<Skeleton className="h-6 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
							</div>
							<Skeleton className="h-5 w-24 rounded-full" />
						</div>
						<div className="px-5">
							<div className="space-y-1">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-5/6" />
								<Skeleton className="h-4 w-4/6" />
							</div>
						</div>
						<div className="px-5 py-4 mt-auto">
							<Skeleton className="h-4 w-20" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

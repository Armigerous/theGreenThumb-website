"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Reason: Client component for static shell that will be prerendered with PPR
const Autocomplete = dynamic(
	() => import("./Autocomplete").then((mod) => ({ default: mod.Autocomplete })),
	{
		ssr: false,
		loading: () => (
			<div className="h-14 bg-gray-100 animate-pulse rounded-lg" />
		),
	}
);

// Reason: Static search shell that includes search bar and results header
export function StaticSearchShell() {
	return (
		<div className="text-left mx-auto px-8 md:px-0 sm:px-4">
			{/* Static search bar - prerendered */}
			<Suspense
				fallback={<div className="h-14 bg-gray-100 animate-pulse rounded-lg" />}
			>
				<Autocomplete />
			</Suspense>
		</div>
	);
}

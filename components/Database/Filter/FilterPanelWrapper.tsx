"use client";

import dynamic from "next/dynamic";

// Reason: Client component wrapper for FilterPanel to enable dynamic imports with PPR
const FilterPanel = dynamic(
	() =>
		import("@/components/Database/Filter/FilterPanel").then((mod) => ({
			default: mod.FilterPanel,
		})),
	{
		ssr: false, // Disable SSR for client-side rendering
		loading: () => <div className="w-64 h-screen bg-gray-50 animate-pulse" />,
	}
);

export default FilterPanel;

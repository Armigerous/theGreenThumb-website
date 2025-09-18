"use client";

import dynamic from "next/dynamic";
import StaticFeaturesButton from "./StaticFeaturesButton";
import { NavigationMenuItem } from "@/components/ui/navigation-menu";
import { memo } from "react";

// Reason: Dynamically import the interactive dropdown to prevent hydration mismatch
const InteractiveDropdownFeatures = dynamic(
	() => import("./DropdownFeatures"),
	{
		ssr: false,
		loading: () => <StaticFeaturesButton />,
	}
);

const DynamicDropdownFeatures = memo(() => {
	return (
		<NavigationMenuItem>
			<InteractiveDropdownFeatures />
		</NavigationMenuItem>
	);
});

DynamicDropdownFeatures.displayName = "DynamicDropdownFeatures";

export default DynamicDropdownFeatures;

import { NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { ChevronDown } from "lucide-react";

// Reason: Static server-rendered fallback for features dropdown to prevent hydration mismatch
const StaticFeaturesButton = () => {
	return (
		<NavigationMenuTrigger className="text-xl font-medium px-6 py-2 hover:bg-brand-25 hover:text-primary transition-colors duration-200">
			Features
			<ChevronDown className="h-4 w-4 ml-1" />
		</NavigationMenuTrigger>
	);
};

export default StaticFeaturesButton;

"use client";

import {
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ListChecks, Smartphone } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

const DropdownFeatures = memo(() => {
	return (
		<>
			<NavigationMenuTrigger className="text-lg font-medium px-6 py-2 hover:bg-brand-25 hover:text-primary transition-colors duration-200">
				Features
			</NavigationMenuTrigger>
			<NavigationMenuContent>
				<ul className="grid w-[240px] gap-3 p-4">
					<li>
						<NavigationMenuLink asChild>
							<Link
								href="/#ProductFeatures"
								className="flex items-center gap-3 w-full px-3 py-2 text-lg font-medium rounded-md transition-colors duration-200 hover:bg-brand-25 hover:text-primary"
							>
								<ListChecks className="h-5 w-5" />
								Product Features
							</Link>
						</NavigationMenuLink>
					</li>
					<li>
						<NavigationMenuLink asChild>
							<Link
								href="/#AppFeatures"
								className="flex items-center gap-3 w-full px-3 py-2 text-lg font-medium rounded-md transition-colors duration-200 hover:bg-brand-25 hover:text-primary"
							>
								<Smartphone className="h-5 w-5" />
								App Features
							</Link>
						</NavigationMenuLink>
					</li>
				</ul>
			</NavigationMenuContent>
		</>
	);
});

DropdownFeatures.displayName = "DropdownFeatures";

export default DropdownFeatures;

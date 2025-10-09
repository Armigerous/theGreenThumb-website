import React from "react";
import Link from "next/link";
import { OrganicCard } from "../_foundations/OrganicCard";
import { Leaf, Lightbulb, Search, Plus } from "lucide-react";

/**
 * QuickActions Component
 *
 * Reason: Organic layout of quick action cards with friendly labels
 * and brand-aligned styling - replaces rigid button grid
 */

export const QuickActions: React.FC = () => {
	const actions = [
		{
			href: "/plants",
			icon: Leaf,
			label: "Find Plants",
			description: "Browse our collection",
		},
		{
			href: "/tips",
			icon: Lightbulb,
			label: "Get Growing Tips",
			description: "Learn how to care",
		},
		{
			href: "/identify",
			icon: Search,
			label: "What's This Plant?",
			description: "Identify with AI",
		},
		{
			href: "/garden-customization",
			icon: Plus,
			label: "Plant a Garden",
			description: "Start something new",
		},
	];

	return (
		<OrganicCard withTexture={false} className="bg-cream-100 border-cream-200">
			<div className="space-y-4">
				<h3 className="font-title-semibold text-lg text-cream-800">
					Quick Actions
				</h3>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
					{actions.map((action, index) => {
						const Icon = action.icon;
						return (
							<Link
								key={index}
								href={action.href}
								className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-cream-50 border border-cream-200 
                      hover:border-brand-300 hover:shadow-md transition-all duration-200 group"
							>
								<div className="h-12 w-12 rounded-full bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
									<Icon className="h-6 w-6 text-brand-600" />
								</div>
								<div className="text-center space-y-1">
									<div className="font-paragraph-semibold text-sm text-cream-800">
										{action.label}
									</div>
									<div className="font-paragraph text-xs text-cream-600">
										{action.description}
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</OrganicCard>
	);
};

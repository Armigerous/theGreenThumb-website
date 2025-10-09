import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	IllustrationPlaceholder,
	IllustrationPrompts,
} from "../_foundations/IllustrationPlaceholder";
import { GardenCardContentProps } from "@/types/garden-ui";

/**
 * GardenCardContent Component
 *
 * Reason: Pure presentational component for garden card display
 * No state, no effects, no client interactions - just data display
 */

export const GardenCardContent: React.FC<GardenCardContentProps> = ({
	garden,
	variant = "default",
}) => {
	const { statistics } = garden;

	// Reason: Determine if garden needs attention with empathetic language
	const needsAttention =
		statistics.plantsNeedingCare > 0 || statistics.criticalPlants > 0;

	// Reason: Calculate plant count message with simple language
	const getPlantCountMessage = () => {
		if (statistics.totalPlants === 0) return "No plants yet";
		if (statistics.totalPlants === 1) return "1 plant growing";
		return `${statistics.totalPlants} plants growing`;
	};

	return (
		<div className="space-y-4">
			{/* Reason: Garden cover illustration placeholder */}
			<div className="w-full">
				<IllustrationPlaceholder
					{...IllustrationPrompts.gardenCoverSpring}
					width={600}
					height={160}
					className="w-full"
				/>
			</div>

			{/* Reason: Garden name and count with brand typography */}
			<div className="space-y-1">
				<h3 className="font-title-bold text-xl text-cream-800">
					{garden.name}
				</h3>
				<p className="font-paragraph text-sm text-cream-600">
					{getPlantCountMessage()}
				</p>
			</div>

			{/* Reason: Simple statistics display with friendly labels */}
			{statistics.totalPlants > 0 && (
				<div className="flex gap-3">
					<div className="flex-1 text-center p-3 rounded-2xl bg-brand-50 border border-brand-100">
						<div className="font-title-bold text-2xl text-brand-600">
							{statistics.healthyPlants}
						</div>
						<div className="font-paragraph text-xs text-cream-600">Happy</div>
					</div>

					{statistics.plantsNeedingCare > 0 && (
						<div className="flex-1 text-center p-3 rounded-2xl bg-accent-50 border border-accent-100">
							<div className="font-title-bold text-2xl text-accent-500">
								{statistics.plantsNeedingCare}
							</div>
							<div className="font-paragraph text-xs text-cream-600">
								Need Love
							</div>
						</div>
					)}
				</div>
			)}

			{/* Reason: Gentle alert for plants needing attention */}
			{needsAttention && (
				<div className="p-3 rounded-2xl bg-accent-50 border border-accent-200">
					<div className="flex items-center gap-2 text-accent-600">
						<span className="text-sm">💧</span>
						<span className="font-paragraph-semibold text-sm">
							{statistics.criticalPlants > 0
								? `${statistics.criticalPlants} struggling`
								: "Could use some attention"}
						</span>
					</div>
				</div>
			)}

			{/* Reason: Action buttons with brand voice */}
			<div className="flex gap-2 pt-2">
				<Button
					asChild
					className="flex-1 bg-brand-600 hover:bg-brand-700 text-primary-foreground font-paragraph-semibold rounded-2xl"
				>
					<Link href={`/my-garden/${garden.id}`}>Visit Garden</Link>
				</Button>

				{needsAttention && (
					<Button
						asChild
						variant="outline"
						className="border-accent-300 text-accent-700 hover:bg-accent-50 font-paragraph-semibold rounded-2xl"
					>
						<Link href={`/my-garden/${garden.id}?tab=care`}>Show Love</Link>
					</Button>
				)}
			</div>
		</div>
	);
};

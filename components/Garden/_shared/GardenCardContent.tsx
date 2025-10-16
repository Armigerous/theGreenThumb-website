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
}) => {
	const { statistics } = garden;

	// Reason: Check if we're using task-based statistics (new) or care-log based (legacy)
	const isTaskBased = "plantsWithOverdueTasks" in statistics;

	// Reason: Determine if garden needs attention with empathetic language
	const needsAttention = isTaskBased
		? (
				statistics as {
					plantsWithOverdueTasks: number;
					plantsWithUrgentTasks: number;
				}
		  ).plantsWithOverdueTasks > 0 ||
		  (
				statistics as {
					plantsWithOverdueTasks: number;
					plantsWithUrgentTasks: number;
				}
		  ).plantsWithUrgentTasks > 0
		: (statistics as { plantsNeedingCare: number; criticalPlants: number })
				.plantsNeedingCare > 0 ||
		  (statistics as { plantsNeedingCare: number; criticalPlants: number })
				.criticalPlants > 0;

	// Note: Removed unused healthyPlants and plantsNeedingCare variables

	// Reason: Calculate critical plants count based on statistics type
	const criticalPlants = isTaskBased
		? (statistics as { plantsWithUrgentTasks: number }).plantsWithUrgentTasks
		: (statistics as { criticalPlants: number }).criticalPlants;

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

			{/* Reason: Gentle alert for plants needing attention */}
			{needsAttention && (
				<div className="p-3 rounded-2xl bg-accent-50 border border-accent-200">
					<div className="flex items-center gap-2 text-accent-600">
						<span className="text-sm">💧</span>
						<span className="font-paragraph-semibold text-sm">
							{criticalPlants > 0
								? `${criticalPlants} struggling`
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

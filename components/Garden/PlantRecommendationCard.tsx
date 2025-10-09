"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PlantRecommendation } from "@/types/garden";
import { Plus, ExternalLink } from "lucide-react";

interface PlantRecommendationCardProps {
	recommendation: PlantRecommendation;
	onAddToGarden?: (recommendation: PlantRecommendation) => void;
	className?: string;
}

/**
 * PlantRecommendationCard Component
 *
 * Reason: Displays plant recommendations in a card format
 * following brand guidelines with proper spacing, colors, and interactions
 */
export const PlantRecommendationCard: React.FC<
	PlantRecommendationCardProps
> = ({ recommendation, onAddToGarden, className }) => {
	const imageUrl = recommendation.image || "/no-plant-image.png";

	return (
		<div
			className={cn(
				"group relative bg-cream-50 border border-cream-200 rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:border-brand-200",
				"focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2",
				className
			)}
		>
			{/* Reason: Plant image with proper aspect ratio */}
			<div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-cream-100">
				<Image
					src={imageUrl}
					alt={recommendation.commonName || recommendation.scientificName}
					fill
					className="object-cover transition-transform duration-200 group-hover:scale-105"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>

				{/* Reason: Recommendation badge */}
				<div className="absolute top-2 right-2">
					<div className="bg-accent-200 text-cream-800 px-2 py-1 rounded-full text-xs font-paragraph-semibold">
						Recommended
					</div>
				</div>
			</div>

			{/* Reason: Plant information */}
			<div className="space-y-2 mb-4">
				<div>
					<h3 className="font-title-semibold text-cream-800 text-lg leading-tight">
						{recommendation.commonName || recommendation.scientificName}
					</h3>
					<p className="font-paragraph text-cream-600 text-sm">
						{recommendation.scientificName}
					</p>
				</div>

				{/* Reason: Plant description */}
				{recommendation.description && (
					<p className="font-paragraph text-cream-600 text-sm line-clamp-2">
						{recommendation.description}
					</p>
				)}
			</div>

			{/* Reason: Action buttons */}
			<div className="flex gap-2">
				{onAddToGarden && (
					<Button
						onClick={() => onAddToGarden(recommendation)}
						className="flex-1 bg-brand-600 hover:bg-brand-700 text-primary-foreground"
						size="sm"
					>
						<Plus className="mr-2 h-4 w-4" />
						Add to Garden
					</Button>
				)}

				<Button
					asChild
					variant="outline"
					size="sm"
					className={`border-cream-300 text-cream-700 hover:bg-cream-100 ${
						!onAddToGarden ? "flex-1" : ""
					}`}
				>
					<a
						href={`/plants/${recommendation.slug}`}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center"
					>
						<ExternalLink className="h-4 w-4" />
						<span className="sr-only">View plant details</span>
					</a>
				</Button>
			</div>
		</div>
	);
};

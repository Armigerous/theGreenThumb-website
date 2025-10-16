"use client";

import React from "react";
import { OrganicCard } from "./_foundations/OrganicCard";
import { GardenCardContent } from "./_shared/GardenCardContent";
import { GardenActionsMenu } from "./_client/GardenActionsMenu";
import { GardenWithStats, GardenWithTaskStats } from "@/types/garden";

/**
 * GardenCard Component (Refactored)
 *
 * Reason: Composed garden card with proper separation of concerns
 * - OrganicCard: Foundation styling and interactions
 * - GardenCardContent: Pure presentation of data
 * - GardenActionsMenu: Client-side interactions
 *
 * Updated to support both legacy care-log based (GardenWithStats)
 * and new task-based (GardenWithTaskStats) garden data structures
 */

type GardenCardProps = {
	garden: GardenWithStats | GardenWithTaskStats;
	onEdit?: (garden: GardenWithStats | GardenWithTaskStats) => void;
	onDelete?: (garden: GardenWithStats | GardenWithTaskStats) => void;
	onAddPlant?: (garden: GardenWithStats | GardenWithTaskStats) => void;
	variant?: "default" | "compact";
	className?: string;
};

export const GardenCard: React.FC<GardenCardProps> = ({
	garden,
	onEdit,
	onDelete,
	onAddPlant,
	variant = "default",
	className = "",
}) => {
	// Reason: Extract and validate garden id from either task-based or legacy structure
	const gardenId = garden.id ?? 0;

	// Reason: Normalize garden data for the card content component
	const normalizedGarden = {
		id: gardenId,
		name: garden.name,
		statistics: garden.statistics,
	};

	return (
		<OrganicCard
			variant={variant}
			elevation="medium"
			withTexture={true}
			className={`group ${className}`}
		>
			{/* Reason: Actions menu in top corner, appears on hover */}
			<div className="absolute top-4 right-4 z-20">
				<GardenActionsMenu
					onEdit={onEdit ? () => onEdit(garden) : undefined}
					onDelete={onDelete ? () => onDelete(garden) : undefined}
					onAddPlant={onAddPlant ? () => onAddPlant(garden) : undefined}
				/>
			</div>

			{/* Reason: Pure presentational content */}
			<GardenCardContent garden={normalizedGarden} variant={variant} />
		</OrganicCard>
	);
};

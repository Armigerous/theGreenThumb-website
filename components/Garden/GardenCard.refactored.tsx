"use client";

import React from "react";
import { OrganicCard } from "./_foundations/OrganicCard";
import { GardenCardContent } from "./_shared/GardenCardContent";
import { GardenActionsMenu } from "./_client/GardenActionsMenu";
import { GardenWithStats } from "@/types/garden";

/**
 * GardenCard Component (Refactored)
 *
 * Reason: Composed garden card with proper separation of concerns
 * - OrganicCard: Foundation styling and interactions
 * - GardenCardContent: Pure presentation of data
 * - GardenActionsMenu: Client-side interactions
 */

type GardenCardProps = {
	garden: GardenWithStats;
	onEdit?: (garden: GardenWithStats) => void;
	onDelete?: (garden: GardenWithStats) => void;
	onAddPlant?: (garden: GardenWithStats) => void;
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
					gardenId={garden.id}
					onEdit={onEdit ? () => onEdit(garden) : undefined}
					onDelete={onDelete ? () => onDelete(garden) : undefined}
					onAddPlant={onAddPlant ? () => onAddPlant(garden) : undefined}
				/>
			</div>

			{/* Reason: Pure presentational content */}
			<GardenCardContent garden={garden} variant={variant} />
		</OrganicCard>
	);
};

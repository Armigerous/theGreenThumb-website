"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Plus } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GardenInteractionProps } from "@/types/garden-ui";

/**
 * GardenActionsMenu Component
 *
 * Reason: Client-side dropdown menu for garden actions
 * Separated from presentation for proper server/client boundaries
 */

export const GardenActionsMenu: React.FC<GardenInteractionProps> = ({
	gardenId,
	onEdit,
	onDelete,
	onAddPlant,
}) => {
	// Reason: Only render if at least one action is provided
	if (!onEdit && !onDelete && !onAddPlant) return null;

	return (
		<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className="h-9 w-9 p-0 rounded-full bg-cream-50/80 backdrop-blur-sm hover:bg-cream-100"
					>
						<MoreHorizontal className="h-4 w-4" />
						<span className="sr-only">Open garden menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48 rounded-2xl">
					{onEdit && (
						<DropdownMenuItem onClick={onEdit} className="rounded-xl">
							<Edit className="mr-2 h-4 w-4" />
							Edit Garden
						</DropdownMenuItem>
					)}
					{onAddPlant && (
						<DropdownMenuItem onClick={onAddPlant} className="rounded-xl">
							<Plus className="mr-2 h-4 w-4" />
							Add Plant
						</DropdownMenuItem>
					)}
					{onDelete && (
						<DropdownMenuItem
							onClick={onDelete}
							className="text-red-600 focus:text-red-600 rounded-xl"
						>
							<Trash2 className="mr-2 h-4 w-4" />
							Delete Garden
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

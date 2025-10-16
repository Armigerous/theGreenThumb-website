"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CareStatusBadge } from "./CareStatusBadge";
import { userPlants, needsCare } from "@/types/garden";
import { MoreHorizontal, Edit, Trash2, Archive } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PlantCardProps {
	plant: userPlants;
	showGardenName?: boolean;
	onEdit?: (plant: userPlants) => void;
	onDelete?: (plant: userPlants) => void;
	onArchive?: (plant: userPlants) => void;
	className?: string;
}

/**
 * PlantCard Component
 *
 * Reason: Displays individual plant information in a card format
 * following brand guidelines with proper spacing, colors, and interactions
 */
export const PlantCard: React.FC<PlantCardProps> = ({
	plant,
	showGardenName = false,
	onEdit,
	onDelete,
	onArchive,
	className,
}) => {
	// Reason: Get primary plant image or fallback (handle both database and type structures)
	const plantImages = plant.images as Array<{
		url?: string;
		isPrimary?: boolean;
		uploadedAt?: Date;
	}>;
	const primaryImage =
		plantImages?.find((img) => img.isPrimary) || plantImages?.[0];

	// Reason: Use database plant image if available, otherwise fallback to user images
	const dbImage = (
		plant as unknown as {
			main_plant_data?: {
				plant_images?: Array<{ img?: string; alt_text?: string }>;
			};
		}
	).main_plant_data?.plant_images?.[0];
	const imageUrl = dbImage?.img || primaryImage?.url || "/no-plant-image.png";

	// Reason: Determine if plant needs care
	const plantNeedsCare = needsCare(plant);

	return (
		<div
			className={cn(
				"group relative bg-cream-50 border border-cream-200 rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:border-brand-200",
				"focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2",
				className
			)}
		>
			{/* Reason: Plant image with proper aspect ratio and fallback */}
			<div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-cream-100">
				<Image
					src={imageUrl}
					alt={
						plant.customName ||
						plant.nickname ||
						(Array.isArray(
							(
								plant as unknown as {
									main_plant_data?: { common_names?: unknown };
								}
							).main_plant_data?.common_names
						)
							? String(
									(
										plant as unknown as {
											main_plant_data?: { common_names?: string[] };
										}
									).main_plant_data?.common_names?.[0] || ""
							  )
							: String(
									(
										plant as unknown as {
											main_plant_data?: { common_names?: string };
										}
									).main_plant_data?.common_names || ""
							  )) ||
						"Plant image"
					}
					fill
					className="object-cover transition-transform duration-200 group-hover:scale-105"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>

				{/* Reason: Care status badge overlay */}
				<div className="absolute top-2 right-2">
					<CareStatusBadge plant={plant} size="sm" />
				</div>
			</div>

			{/* Reason: Plant information */}
			<div className="space-y-2">
				<div>
					<h3 className="font-title-semibold text-cream-800 text-lg leading-tight">
						{plant.customName || plant.nickname}
					</h3>
					<p className="font-paragraph text-cream-600 text-sm">
						{(
							plant as unknown as {
								main_plant_data?: { scientific_name?: string };
							}
						).main_plant_data?.scientific_name ||
							(Array.isArray(
								(
									plant as unknown as {
										main_plant_data?: { common_names?: unknown };
									}
								).main_plant_data?.common_names
							)
								? String(
										(
											plant as unknown as {
												main_plant_data?: { common_names?: string[] };
											}
										).main_plant_data?.common_names?.[0] || ""
								  )
								: String(
										(
											plant as unknown as {
												main_plant_data?: { common_names?: string };
											}
										).main_plant_data?.common_names || ""
								  )) ||
							plant.botanicalName ||
							"Plant ID: " + plant.plant_id}
					</p>
				</div>

				{/* Reason: Show garden name if requested */}
				{showGardenName && (
					<p className="font-paragraph text-cream-500 text-xs">
						Garden: {plant.gardenId || plant.garden_id}
					</p>
				)}

				{/* Reason: Care needs indicator */}
				{plantNeedsCare && (
					<div className="flex items-center gap-1 text-orange-600">
						<span className="text-xs">💧</span>
						<span className="font-paragraph text-xs">Needs attention</span>
					</div>
				)}
			</div>

			{/* Reason: Action menu - only show if handlers are provided */}
			{(onEdit || onDelete || onArchive) && (
				<div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0 bg-cream-50/80 backdrop-blur-sm hover:bg-cream-100"
							>
								<MoreHorizontal className="h-4 w-4" />
								<span className="sr-only">Open plant menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-48">
							{onEdit && (
								<DropdownMenuItem onClick={() => onEdit(plant)}>
									<Edit className="mr-2 h-4 w-4" />
									Edit Plant
								</DropdownMenuItem>
							)}
							{onArchive && (
								<DropdownMenuItem onClick={() => onArchive(plant)}>
									<Archive className="mr-2 h-4 w-4" />
									Archive
								</DropdownMenuItem>
							)}
							{onDelete && (
								<DropdownMenuItem
									onClick={() => onDelete(plant)}
									className="text-red-600 focus:text-red-600"
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Delete
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			)}

			{/* Reason: View details link */}
			<div className="mt-3 pt-3 border-t border-cream-200">
				<Link
					href={`/plants/${plant.id}`}
					className="inline-flex items-center text-brand-600 hover:text-brand-700 font-paragraph-semibold text-sm transition-colors"
				>
					View Details
					<span className="ml-1">→</span>
				</Link>
			</div>
		</div>
	);
};

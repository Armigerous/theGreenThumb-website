import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GardenWithStats } from "@/types/garden";
import { MoreHorizontal, Edit, Trash2, Plus } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GardenCardProps {
	garden: GardenWithStats;
	onEdit?: (garden: GardenWithStats) => void;
	onDelete?: (garden: GardenWithStats) => void;
	onAddPlant?: (garden: GardenWithStats) => void;
	className?: string;
}

/**
 * GardenCard Component
 *
 * Reason: Displays garden information in a card format with statistics
 * following brand guidelines with proper spacing, colors, and interactions
 */
export const GardenCard: React.FC<GardenCardProps> = ({
	garden,
	onEdit,
	onDelete,
	onAddPlant,
	className,
}) => {
	const { statistics } = garden;

	// Reason: Determine garden health status based on plant conditions
	const getGardenHealthStatus = () => {
		if (statistics.criticalPlants > 0) return "critical";
		if (statistics.warningPlants > 0 || statistics.plantsNeedingCare > 0)
			return "warning";
		return "healthy";
	};

	const healthStatus = getGardenHealthStatus();

	// Reason: Health status colors following brand guidelines
	const getHealthStatusColor = () => {
		switch (healthStatus) {
			case "critical":
				return "border-red-200 bg-red-50";
			case "warning":
				return "border-yellow-200 bg-yellow-50";
			default:
				return "border-brand-200 bg-brand-50";
		}
	};

	return (
		<div
			className={cn(
				"group relative bg-cream-50 border-2 rounded-xl p-6 transition-all duration-200 hover:shadow-lg hover:border-brand-300",
				"focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2",
				getHealthStatusColor(),
				className
			)}
		>
			{/* Reason: Garden header with name and actions */}
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1">
					<h3 className="font-title-bold text-cream-800 text-xl mb-1">
						{garden.name}
					</h3>
					<p className="font-paragraph text-cream-600 text-sm">
						{statistics.totalPlants}{" "}
						{statistics.totalPlants === 1 ? "plant" : "plants"}
					</p>
				</div>

				{/* Reason: Action menu */}
				<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0 bg-cream-50/80 backdrop-blur-sm hover:bg-cream-100"
							>
								<MoreHorizontal className="h-4 w-4" />
								<span className="sr-only">Open garden menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							{onEdit && (
								<DropdownMenuItem onClick={() => onEdit(garden)}>
									<Edit className="mr-2 h-4 w-4" />
									Edit Garden
								</DropdownMenuItem>
							)}
							{onAddPlant && (
								<DropdownMenuItem onClick={() => onAddPlant(garden)}>
									<Plus className="mr-2 h-4 w-4" />
									Add Plant
								</DropdownMenuItem>
							)}
							{onDelete && (
								<DropdownMenuItem
									onClick={() => onDelete(garden)}
									className="text-red-600 focus:text-red-600"
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Delete Garden
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Reason: Garden statistics */}
			<div className="grid grid-cols-2 gap-4 mb-4">
				<div className="text-center">
					<div className="font-title-bold text-2xl text-brand-600">
						{statistics.healthyPlants}
					</div>
					<div className="font-paragraph text-xs text-cream-600">Healthy</div>
				</div>

				<div className="text-center">
					<div className="font-title-bold text-2xl text-orange-600">
						{statistics.plantsNeedingCare}
					</div>
					<div className="font-paragraph text-xs text-cream-600">Need Care</div>
				</div>
			</div>

			{/* Reason: Warning indicators */}
			{(statistics.warningPlants > 0 || statistics.criticalPlants > 0) && (
				<div className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
					<div className="flex items-center gap-2 text-yellow-800">
						<span className="text-sm">⚠️</span>
						<span className="font-paragraph-semibold text-sm">
							{statistics.criticalPlants > 0 &&
								`${statistics.criticalPlants} critical`}
							{statistics.criticalPlants > 0 &&
								statistics.warningPlants > 0 &&
								", "}
							{statistics.warningPlants > 0 &&
								`${statistics.warningPlants} warning`}
						</span>
					</div>
				</div>
			)}

			{/* Reason: Action buttons */}
			<div className="flex gap-2">
				<Button
					asChild
					className="flex-1 bg-brand-600 hover:bg-brand-700 text-primary-foreground"
				>
					<Link href={`/my-garden/${garden.id}`}>View Garden</Link>
				</Button>

				{statistics.plantsNeedingCare > 0 && (
					<Button
						asChild
						variant="outline"
						className="border-orange-300 text-orange-700 hover:bg-orange-50"
					>
						<Link href={`/my-garden/${garden.id}?tab=care`}>Care Needed</Link>
					</Button>
				)}
			</div>
		</div>
	);
};

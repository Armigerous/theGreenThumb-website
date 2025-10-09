import React from "react";
import { cn } from "@/lib/utils";
import { OverallGardenStatistics } from "@/types/garden";
import { Leaf, AlertTriangle, Heart, Droplets } from "lucide-react";

interface StatisticsCardProps {
	statistics: OverallGardenStatistics;
	className?: string;
}

/**
 * StatisticsCard Component
 *
 * Reason: Displays overall garden statistics in a clean, organized layout
 * following brand guidelines with proper icons and colors
 */
export const StatisticsCard: React.FC<StatisticsCardProps> = ({
	statistics,
	className,
}) => {
	const stats = [
		{
			label: "Total Gardens",
			value: statistics.totalGardens,
			icon: Leaf,
			color: "text-brand-600",
			bgColor: "bg-brand-50",
		},
		{
			label: "Total Plants",
			value: statistics.totalPlants,
			icon: Heart,
			color: "text-green-600",
			bgColor: "bg-green-50",
		},
		{
			label: "Healthy Plants",
			value: statistics.healthyPlants,
			icon: Heart,
			color: "text-green-600",
			bgColor: "bg-green-50",
		},
		{
			label: "Need Care",
			value: statistics.plantsNeedingCare,
			icon: Droplets,
			color: "text-orange-600",
			bgColor: "bg-orange-50",
		},
		{
			label: "Warning",
			value: statistics.warningPlants,
			icon: AlertTriangle,
			color: "text-yellow-600",
			bgColor: "bg-yellow-50",
		},
		{
			label: "Critical",
			value: statistics.criticalPlants,
			icon: AlertTriangle,
			color: "text-red-600",
			bgColor: "bg-red-50",
		},
	];

	return (
		<div
			className={cn(
				"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4",
				className
			)}
		>
			{stats.map((stat, index) => {
				const Icon = stat.icon;
				return (
					<div
						key={index}
						className={cn(
							"bg-cream-50 border border-cream-200 rounded-lg p-4 text-center transition-all duration-200 hover:shadow-md",
							stat.bgColor
						)}
					>
						<div className={cn("flex justify-center mb-2", stat.color)}>
							<Icon className="h-6 w-6" />
						</div>
						<div className={cn("font-title-bold text-2xl mb-1", stat.color)}>
							{stat.value}
						</div>
						<div className="font-paragraph text-xs text-cream-600">
							{stat.label}
						</div>
					</div>
				);
			})}
		</div>
	);
};

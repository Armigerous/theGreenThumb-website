import React from "react";
import { cn } from "@/lib/utils";
import {
	userPlants,
	getCareStatusColor,
	getCareStatusText,
} from "@/types/garden";

interface CareStatusBadgeProps {
	plant: userPlants;
	size?: "sm" | "md" | "lg";
	showIcon?: boolean;
	className?: string;
}

/**
 * CareStatusBadge Component
 *
 * Reason: Displays the care status of a plant with appropriate colors and icons
 * following the brand guidelines for status indicators
 */
export const CareStatusBadge: React.FC<CareStatusBadgeProps> = ({
	plant,
	size = "md",
	showIcon = true,
	className,
}) => {
	const statusText = getCareStatusText(plant);
	const statusColor = getCareStatusColor(plant);

	// Reason: Size-based styling following brand guidelines
	const sizeClasses = {
		sm: "px-2 py-1 text-xs",
		md: "px-3 py-1.5 text-sm",
		lg: "px-4 py-2 text-base",
	};

	// Reason: Status-specific icons following plant care theme
	const getStatusIcon = () => {
		switch (plant.status) {
			case "critical":
				return "🚨";
			case "warning":
				return "⚠️";
			case "dormant":
				return "😴";
			default:
				return plant.status === "healthy" ? "🌱" : "💧";
		}
	};

	return (
		<div
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full font-paragraph-semibold",
				sizeClasses[size],
				statusColor,
				className
			)}
		>
			{showIcon && (
				<span
					className="text-sm"
					role="img"
					aria-label={`${statusText} status`}
				>
					{getStatusIcon()}
				</span>
			)}
			<span>{statusText}</span>
		</div>
	);
};

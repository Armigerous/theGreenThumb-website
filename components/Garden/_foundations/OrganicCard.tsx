"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { PaperTexture } from "./PaperTexture";
import { OrganicCardProps } from "@/types/garden-ui";
import { animateCardHover } from "@/lib/animations/garden-animations";

/**
 * OrganicCard Component
 *
 * Reason: Foundation card component with organic shapes, soft shadows,
 * and paper texture - replacing hard-edged corporate cards
 */

export const OrganicCard: React.FC<OrganicCardProps> = ({
	children,
	variant = "default",
	elevation = "medium",
	withTexture = true,
	className = "",
}) => {
	const cardRef = useRef<HTMLDivElement>(null);

	// Reason: Elevation-based shadow styling with brand color tints
	const elevationClasses = {
		low: "shadow-sm hover:shadow-md",
		medium: "shadow-md hover:shadow-lg",
		high: "shadow-lg hover:shadow-xl",
	};

	// Reason: Variant-based size adjustments
	const variantClasses = {
		default: "p-6",
		compact: "p-4",
	};

	const handleMouseEnter = () => {
		if (cardRef.current) {
			animateCardHover(cardRef.current, true);
		}
	};

	const handleMouseLeave = () => {
		if (cardRef.current) {
			animateCardHover(cardRef.current, false);
		}
	};

	return (
		<div
			ref={cardRef}
			className={cn(
				"relative overflow-hidden rounded-3xl bg-cream-50 border border-cream-200",
				"transition-all duration-300",
				elevationClasses[elevation],
				variantClasses[variant],
				"focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2",
				className
			)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{/* Reason: Subtle paper texture for gouache aesthetic */}
			{withTexture && <PaperTexture opacity={0.15} />}

			{/* Reason: Content with relative positioning to stay above texture */}
			<div className="relative z-10">{children}</div>
		</div>
	);
};

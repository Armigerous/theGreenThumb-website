"use client";

import React, { useEffect, useRef } from "react";
import {
	celebratePlantAdded,
	celebrateGardenCreated,
	celebrateHealthImproved,
	celebrateCareCompleted,
} from "@/lib/animations/celebration-effects";
import {
	IllustrationPlaceholder,
	IllustrationPrompts,
} from "../_foundations/IllustrationPlaceholder";

/**
 * SuccessCelebration Component
 *
 * Reason: Celebration component for garden milestones with
 * delightful animations and encouraging messaging
 */

type CelebrationType =
	| "plant-added"
	| "garden-created"
	| "health-improved"
	| "care-completed";

type SuccessCelebrationProps = {
	type: CelebrationType;
	message?: string;
	onComplete?: () => void;
	autoClose?: boolean;
	duration?: number;
};

export const SuccessCelebration: React.FC<SuccessCelebrationProps> = ({
	type,
	message,
	onComplete,
	autoClose = true,
	duration = 3000,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (containerRef.current) {
			// Reason: Trigger appropriate celebration animation
			switch (type) {
				case "plant-added":
					celebratePlantAdded(containerRef.current);
					break;
				case "garden-created":
					celebrateGardenCreated(containerRef.current);
					break;
				case "health-improved":
					celebrateHealthImproved(containerRef.current);
					break;
				case "care-completed":
					celebrateCareCompleted(containerRef.current);
					break;
			}
		}

		// Reason: Auto-close celebration after duration
		if (autoClose) {
			const timer = setTimeout(() => {
				onComplete?.();
			}, duration);
			return () => clearTimeout(timer);
		}
	}, [type, autoClose, duration, onComplete]);

	// Reason: Get illustration and default message based on type
	const getCelebrationContent = () => {
		switch (type) {
			case "plant-added":
				return {
					illustration: IllustrationPrompts.successPlantAdded,
					defaultMessage: "Your plant is added!",
				};
			case "garden-created":
				return {
					illustration: IllustrationPrompts.successGardenCreated,
					defaultMessage: "Your garden is growing!",
				};
			case "health-improved":
				return {
					illustration: IllustrationPrompts.successHealthImproved,
					defaultMessage: "Your plant is thriving!",
				};
			case "care-completed":
				return {
					illustration: IllustrationPrompts.successPlantAdded,
					defaultMessage: "Care task completed!",
				};
		}
	};

	const content = getCelebrationContent();

	return (
		<div
			ref={containerRef}
			className="fixed inset-0 z-50 flex items-center justify-center bg-cream-800/20 backdrop-blur-sm"
			role="dialog"
			aria-live="polite"
		>
			<div className="relative bg-cream-50 rounded-3xl p-8 shadow-2xl max-w-md mx-4 text-center space-y-4">
				{/* Reason: Celebration illustration */}
				<div className="flex justify-center">
					<IllustrationPlaceholder {...content.illustration} />
				</div>

				{/* Reason: Success message with brand typography */}
				<h2 className="font-title-bold text-2xl text-cream-800">
					{message || content.defaultMessage}
				</h2>

				<p className="font-paragraph text-cream-600">Keep up the great work!</p>
			</div>
		</div>
	);
};

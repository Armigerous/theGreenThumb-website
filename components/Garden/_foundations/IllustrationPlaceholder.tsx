import React from "react";
import { cn } from "@/lib/utils";
import { IllustrationPlaceholderProps } from "@/types/garden-ui";

/**
 * IllustrationPlaceholder Component
 *
 * Reason: Placeholder component for gouache-style illustrations
 * with generation prompts embedded in comments for future asset creation
 */

export const IllustrationPlaceholder: React.FC<
	IllustrationPlaceholderProps
> = ({ name, width, height, prompt, className = "" }) => {
	return (
		<div
			className={cn(
				"relative flex items-center justify-center rounded-2xl bg-brand-50 border-2 border-dashed border-brand-200",
				"overflow-hidden",
				className
			)}
			style={{
				width: `${width}px`,
				height: `${height}px`,
				maxWidth: "100%",
			}}
			data-illustration={name}
			data-prompt={prompt}
			role="img"
			aria-label={`Illustration placeholder: ${name}`}
		>
			{/* Reason: Visual placeholder content */}
			<div className="text-center p-4 space-y-2">
				<div className="text-4xl opacity-50">🎨</div>
				<p className="font-paragraph text-xs text-cream-600 max-w-[200px]">
					{name}
				</p>
			</div>

			{/* 
        ILLUSTRATION PROMPT:
        {prompt}
        
        Instructions: Use this prompt to generate a gouache-style 
        illustration following the GreenThumb brand guidelines.
        Replace this component with an Image component once generated.
      */}
		</div>
	);
};

/**
 * IllustrationPrompts
 *
 * Reason: Centralized collection of all illustration prompts
 * for easy reference and generation
 */
export const IllustrationPrompts = {
	emptyGarden: {
		name: "Empty Garden State",
		width: 400,
		height: 300,
		prompt:
			"A young seedling sprouting from rich brown soil in a terracotta pot, gentle spring rain falling, soft gouache + watercolor on textured cold-press paper, spring wash (extremely light green #ECF4E7), diffused back-lighting with gentle bloom, rounded forms, no hard outlines, visible brush granulation and paper grain overlay, whimsical child-friendly proportions, cozy and encouraging mood, low contrast, subtle pigment speckles",
	},
	gardenCoverSpring: {
		name: "Spring Garden Cover",
		width: 600,
		height: 200,
		prompt:
			"Overhead view of a small garden bed with diverse plants growing, spring flowers blooming, soft gouache + watercolor on textured cold-press paper, spring wash (#ECF4E7), rounded plant forms, no hard outlines, visible paper grain, cozy garden journal style, low contrast, whimsical and encouraging",
	},
	gardenCoverSummer: {
		name: "Summer Garden Cover",
		width: 600,
		height: 200,
		prompt:
			"Overhead view of a lush summer garden with tomatoes and leafy greens, soft gouache + watercolor on textured cold-press paper, summer wash (#D6E8CC), rounded plant forms, no hard outlines, visible paper grain, cozy garden journal style, low contrast, whimsical and encouraging",
	},
	gardenCoverVegetable: {
		name: "Vegetable Garden Cover",
		width: 600,
		height: 200,
		prompt:
			"Overhead view of a vegetable garden with carrots, lettuce, and herbs, soft gouache + watercolor on textured cold-press paper, summer wash, rounded plant forms, no hard outlines, visible paper grain, cozy garden journal style, low contrast, whimsical and encouraging",
	},
	gardenCoverIndoor: {
		name: "Indoor Garden Cover",
		width: 600,
		height: 200,
		prompt:
			"Collection of indoor plants in terracotta pots on a windowsill, soft morning light, soft gouache + watercolor on textured cold-press paper, spring wash, rounded plant forms, no hard outlines, visible paper grain, cozy and homey, low contrast, whimsical",
	},
	statHappyPlant: {
		name: "Happy Plant Icon",
		width: 80,
		height: 80,
		prompt:
			"A cheerful potted plant with rounded leaves, smiling, soft gouache style, spring green (#5E994B), textured paper, friendly and simple, child-friendly proportions, no hard outlines",
	},
	statGrowingGarden: {
		name: "Growing Garden Icon",
		width: 80,
		height: 80,
		prompt:
			"Multiple small plants of different heights in a row, soft gouache, showing growth progression from seedling to mature plant, encouraging and simple, spring green tones, textured paper",
	},
	statNeedsLove: {
		name: "Needs Love Icon",
		width: 80,
		height: 80,
		prompt:
			"A slightly drooping plant with a small water droplet nearby, soft gouache, empathetic and gentle, not alarming, autumn-yellow tones (#F2E46B), textured paper, child-friendly",
	},
	statWatching: {
		name: "Watching Plant Icon",
		width: 80,
		height: 80,
		prompt:
			"A plant with a magnifying glass examining a leaf, curious and gentle, soft gouache, warm cream and green tones, textured paper, playful and encouraging",
	},
	careAlertBanner: {
		name: "Care Alert Watering Can",
		width: 120,
		height: 120,
		prompt:
			"A friendly watering can gently watering a happy plant, soft gouache + watercolor, warm yellow-cream wash (#FDFD96), cozy and encouraging, rounded forms, visible paper texture, child-friendly style, no hard outlines",
	},
	successPlantAdded: {
		name: "Plant Added Celebration",
		width: 200,
		height: 200,
		prompt:
			"Hands planting a seedling in rich soil, celebrating with small sparkles around, soft gouache, spring wash, joyful and encouraging, rounded forms, textured paper, whimsical proportions",
	},
	successGardenCreated: {
		name: "Garden Created Celebration",
		width: 200,
		height: 200,
		prompt:
			"A complete small garden with diverse happy plants, sun shining with gentle rays, soft gouache, celebration mood with gentle confetti, spring and summer tones, textured paper, encouraging and joyful",
	},
	successHealthImproved: {
		name: "Health Improved Celebration",
		width: 200,
		height: 200,
		prompt:
			"A plant growing taller with new leaves unfurling, transformation from small to flourishing, soft gouache, spring green gradient, growth and vitality, textured paper, encouraging and inspiring",
	},
};

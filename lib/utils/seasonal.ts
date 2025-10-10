import { Season } from "@/types/garden-ui";

/**
 * getCurrentSeason
 *
 * Reason: Detects current season based on month for seasonal theming.
 * Uses Northern Hemisphere seasons by default.
 */
export const getCurrentSeason = (): Season => {
	const month = new Date().getMonth();

	// Reason: Map months to seasons (Northern Hemisphere)
	if (month >= 2 && month <= 4) return "spring"; // Mar-May
	if (month >= 5 && month <= 7) return "summer"; // Jun-Aug
	if (month >= 8 && month <= 10) return "autumn"; // Sep-Nov
	return "winter"; // Dec-Feb
};

/**
 * getSeasonalWashColor
 *
 * Reason: Returns soft gradient wash for seasonal background.
 * Creates watercolor effect - gentle color at top fading to white for readability.
 */
export const getSeasonalWashColor = (season: Season): string => {
	const seasonalGradients: Record<Season, string> = {
		// Reason: Soft spring green fading to white - gentle and fresh
		spring: "linear-gradient(to bottom, #D6E8CC 0%, #FFFFFF 40%)", // brand-100 to white
		
		// Reason: Light summer green fading to white - airy and bright  
		summer: "linear-gradient(to bottom, #BDDDB1 0%, #FFFFFF 40%)", // brand-200 to white
		
		// Reason: Warm autumn cream fading to white - cozy without intensity
		autumn: "linear-gradient(to bottom, #ffea92 0%, #FFFFFF 40%)", // accent-50 to white
		
		// Reason: Cool winter tone fading to white - clean and serene
		winter: "linear-gradient(to bottom, #D4E4F0 0%, #FFFFFF 40%)", // cool blue to white
	};

	return seasonalGradients[season];
};

/**
 * getSeasonalName
 *
 * Reason: Returns friendly seasonal display name with emoji
 */
export const getSeasonalName = (season: Season): string => {
	const seasonalNames: Record<Season, string> = {
		spring: "🌸 Spring Garden",
		summer: "☀️ Summer Garden",
		autumn: "🍂 Autumn Garden",
		winter: "❄️ Winter Garden",
	};

	return seasonalNames[season];
};

/**
 * getSeasonalMessage
 *
 * Reason: Returns encouraging seasonal message for garden page
 */
export const getSeasonalMessage = (season: Season): string => {
	const messages: Record<Season, string> = {
		spring: "Time to plant and grow",
		summer: "Keep your plants happy and hydrated",
		autumn: "Prepare for the cozy season",
		winter: "Care for your indoor friends",
	};

	return messages[season];
};

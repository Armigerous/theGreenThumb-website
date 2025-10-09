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
 * Reason: Returns brand-aligned color for seasonal background wash
 */
export const getSeasonalWashColor = (season: Season): string => {
	const seasonalColors: Record<Season, string> = {
		spring: "#ECF4E7", // brand-50 - extremely light green
		summer: "#D6E8CC", // brand-100 - light green
		autumn: "#F2E46B", // accent-300 - soft lemon
		winter: "#F0F4F8", // Light blue-white
	};

	return seasonalColors[season];
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

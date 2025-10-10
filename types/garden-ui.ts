import { 
	OverallGardenStatistics,
	OverallTaskBasedStatistics,
	TaskBasedGardenStatistics 
} from "./garden";

/**
 * Reason: UI-specific type definitions separated from data types
 * for better modularity and type safety
 */

export type Season = "spring" | "summer" | "autumn" | "winter";

export type GardenCardVariant = "default" | "compact";
export type OrganicCardElevation = "low" | "medium" | "high";

/**
 * Reason: Props for organic card component with brand-aligned styling options
 */
export type OrganicCardProps = {
	children: React.ReactNode;
	variant?: GardenCardVariant;
	elevation?: OrganicCardElevation;
	withTexture?: boolean;
	className?: string;
};

/**
 * Reason: Garden card presentation props - pure data, no callbacks
 * Updated to support both legacy care-log based and new task-based statistics
 */
export type GardenCardContentProps = {
	garden: {
		id: number | string;
		name: string;
		statistics: TaskBasedGardenStatistics | {
			totalPlants: number;
			healthyPlants: number;
			plantsNeedingCare: number;
			warningPlants: number;
			criticalPlants: number;
		};
	};
	variant?: GardenCardVariant;
};

/**
 * Reason: Garden interaction props - handles actions separately from presentation
 */
export type GardenInteractionProps = {
	gardenId: number | string;
	onEdit?: () => void;
	onDelete?: () => void;
	onAddPlant?: () => void;
};

/**
 * Reason: Statistics display props
 * Updated to support both legacy and task-based statistics
 */
export type GardenStatisticsProps = {
	statistics: OverallTaskBasedStatistics | OverallGardenStatistics;
	animated?: boolean;
};

/**
 * Reason: Care alert props with gentle messaging
 */
export type CareAlertProps = {
	plantCount: number;
	onViewCare?: () => void;
	animated?: boolean;
};

/**
 * Reason: Empty state props with brand voice
 */
export type EmptyGardenStateProps = {
	onCreateGarden?: () => void;
	animated?: boolean;
};

/**
 * Reason: Illustration placeholder props
 */
export type IllustrationPlaceholderProps = {
	name: string;
	width: number;
	height: number;
	prompt: string;
	className?: string;
};

/**
 * Reason: Animation configuration type
 */
export type AnimationConfig = {
	duration?: number;
	delay?: number;
	easing?: string;
	stagger?: number;
};

/**
 * Reason: Status color mapping using brand palette
 */
export type PlantStatusColor = {
	bg: string;
	text: string;
	border: string;
};

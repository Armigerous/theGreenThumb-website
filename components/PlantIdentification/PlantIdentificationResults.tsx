"use client";

import { useState, useEffect, useMemo } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Star, Database } from "lucide-react";
import Link from "next/link";
import { PlantCareTips } from "./PlantCareTips";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useImageOptimization } from "@/hooks/use-image-optimization";

interface IdentificationResult {
	id: string;
	name: string;
	scientificName: string;
	confidence: number;
	description: string;
	image?: string;
	careInstructions?: string;
	commonNames?: string[];
	databaseMatch?: boolean;
	isSimilarPlant?: boolean;
	plantId?: number;
	slug?: string;
	fullDescription?: string;
	family?: string;
	genus?: string;
	species?: string;
	heightMin?: number;
	heightMax?: number;
	widthMin?: number;
	widthMax?: number;
	origin?: string;
	distribution?: string;
	uses?: string;
	wildlifeValue?: string;
	edibility?: string;
	flowerDescription?: string;
	leafDescription?: string;
	fruitDescription?: string;
	stemDescription?: string;
	barkDescription?: string;
	poisonSymptoms?: string;
	poisonToxicPrinciple?: string;
	fireRisk?: string;
	flowerSize?: string;
	fruitLength?: string;
	fruitWidth?: string;
	gardenSpaces?: string;
	growthRate?: string;
	leafHairsPresent?: string;
	leafLength?: string;
	leafWidth?: string;
	poisonDermatitis?: string;
	poisonSeverity?: string;
	stemAromatic?: string;
	stemBudScale?: string;
	stemBudTerminal?: string;
	stemBuds?: string;
	stemCrossSection?: string;
	stemForm?: string;
	stemLeafScarShape?: string;
	stemLenticels?: string;
	stemPith?: string;
	stemSurface?: string;
	texture?: string;
	attracts?: string[];
	availableSpaceToPlant?: string[];
	barkAttachment?: string[];
	barkColor?: string[];
	barkPlateShape?: string[];
	designFeatures?: string[];
	flowerBloomTime?: string[];
	flowerColor?: string[];
	flowerInflorescence?: string[];
	flowerPetals?: string[];
	flowerShape?: string[];
	flowerValueToGardener?: string[];
	fruitColor?: string[];
	fruitDisplayHarvestTime?: string[];
	fruitType?: string[];
	fruitValueToGardener?: string[];
	habit?: string[];
	landscapeLocation?: string[];
	landscapeTheme?: string[];
	leafArrangement?: string[];
	leafCharacteristics?: string[];
	leafColor?: string[];
	leafFallColor?: string[];
	leafFeel?: string[];
	leafMargin?: string[];
	leafShape?: string[];
	leafType?: string[];
	leafValueToGardener?: string[];
	lifeCycle?: string[];
	light?: string[];
	maintenance?: string[];
	ncRegion?: string[];
	plantTypes?: string[];
	poisonPart?: string[];
	problems?: string[];
	propagation?: string[];
	resistanceToChallenges?: string[];
	soilDrainage?: string[];
	soilPh?: string[];
	soilTexture?: string[];
	stemColor?: string[];
	tags?: string[];
	usdaZones?: string[];
	lightRequirements?: string;
	waterRequirements?: string;
	usdaHardinessZones?: string;
	images?: Array<{
		id: number | null;
		img: string | null;
		caption?: string | null;
		alt_text?: string | null;
		attribution?: string | null;
	}>;
	plantCardData?: {
		id: number;
		slug: string;
		scientific_name: string;
		description: string | null;
		common_name: string | null;
		first_tag: string | null;
		first_image: string | null;
		first_image_alt_text: string | null;
	}; // Reason: PlantCardData for database matches
}

interface PlantIdentificationResultsProps {
	results: IdentificationResult[];
}

// Reason: Create a separate component for individual result cards to properly use hooks
const PlantResultCard = ({
	result,
	index,
	isClient,
}: {
	result: IdentificationResult;
	index: number;
	isClient: boolean;
}) => {
	const [sanitizedDescription, setSanitizedDescription] = useState("");

	const rawDescription = useMemo(
		() =>
			result.fullDescription ||
			result.description ||
			result.plantCardData?.description ||
			"",
		[
			result.fullDescription,
			result.description,
			result.plantCardData?.description,
		]
	);

	// Reason: Handle sanitization on client-side only with dynamic import
	useEffect(() => {
		if (!isClient || typeof window === "undefined") {
			setSanitizedDescription(rawDescription);
			return;
		}

		// Reason: Dynamic import to avoid SSR issues
		import("isomorphic-dompurify")
			.then((DOMPurifyModule) => {
				const DOMPurify = DOMPurifyModule.default;
				const sanitized = DOMPurify.sanitize(rawDescription, {
					ALLOWED_TAGS: ["p", "strong", "em", "br", "ul", "li"],
				});
				setSanitizedDescription(sanitized);
			})
			.catch(() => {
				// Fallback to raw description if DOMPurify fails to load
				setSanitizedDescription(rawDescription);
			});
	}, [rawDescription, isClient]);

	// Reason: Determine the best image source available
	const imageSource =
		result.image ||
		(result.plantCardData?.first_image && isClient
			? result.plantCardData.first_image
			: null);

	// Reason: Use same image optimization as PlantCard
	const { imageUrl, blurDataUrl, shouldOptimize, loadingStrategy, priority } =
		useImageOptimization({
			src: imageSource || "",
			index,
		});

	// Reason: Determine display name priority
	const displayName =
		result.name ||
		result.plantCardData?.common_name ||
		result.scientificName ||
		"Unknown Plant";

	return (
		<Card
			key={result.id || index}
			className="group/card overflow-hidden rounded-xl shadow-md transition-all duration-200 hover:shadow-lg text-left h-[480px] w-full max-w-sm mx-auto flex flex-col"
		>
			{/* Image Section with improved aspect ratio */}
			<Link
				href={result.slug ? `/plant/${result.slug}` : `/plant/${result.id}`}
				className="block"
			>
				<div className="relative w-full h-48">
					<OptimizedImage
						src={imageUrl}
						alt={`Photo of ${displayName}`}
						fill
						sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
						priority={priority}
						loading={loadingStrategy}
						unoptimized={!shouldOptimize}
						placeholder={blurDataUrl ? "blur" : "empty"}
						blurDataURL={blurDataUrl}
						showSkeleton={true}
					/>

					{/* Badge positioning with better spacing */}
					<div className="absolute inset-2 flex justify-between items-start">
						{/* Confidence Badge - top left */}
						<Badge
							variant={
								result.confidence > 0.8
									? "default"
									: result.confidence > 0.6
									? "secondary"
									: "outline"
							}
							className="text-xs flex items-center gap-1 bg-white/90 backdrop-blur-sm text-black"
						>
							<Star className="h-3 w-3" />
							{Math.round(result.confidence * 100)}%
						</Badge>

						{/* Database/Similar Badge - top right */}
						{result.databaseMatch && (
							<Badge
								variant="default"
								className="text-xs flex items-center gap-1 bg-green-600/90 backdrop-blur-sm text-white"
							>
								<Database className="h-3 w-3" />
								In Database
							</Badge>
						)}

						{result.isSimilarPlant && (
							<Badge
								variant="secondary"
								className="text-xs flex items-center gap-1 bg-blue-500/90 backdrop-blur-sm text-white"
							>
								<Database className="h-3 w-3" />
								Similar
							</Badge>
						)}
					</div>
				</div>
			</Link>

			{/* Header Section with improved spacing */}
			<CardHeader className="px-5 py-4 flex-shrink-0">
				<Link
					href={result.slug ? `/plant/${result.slug}` : `/plant/${result.id}`}
					className="group/header"
				>
					<CardTitle className="text-lg font-paragraph-semibold line-clamp-1 group-hover/header:underline leading-tight">
						{displayName}
					</CardTitle>
					<CardDescription className="text-sm text-muted-foreground line-clamp-1 italic">
						{result.scientificName}
					</CardDescription>
					{result.family && (
						<CardDescription className="text-xs text-gray-500 mt-1">
							Family: {result.family}
						</CardDescription>
					)}
				</Link>

				{/* Show primary tag for database matches and similar plants if available */}
				{(result.databaseMatch || result.isSimilarPlant) &&
					result.plantCardData?.first_tag && (
						<div className="mt-2">
							<Badge className="text-cream-50 text-xs">
								{result.plantCardData.first_tag}
							</Badge>
						</div>
					)}

				{/* Show common names only for AI-only results without database info */}
				{!result.databaseMatch &&
					!result.isSimilarPlant &&
					result.commonNames &&
					result.commonNames.length > 0 && (
						<div className="flex flex-wrap gap-1 mt-2">
							{result.commonNames.slice(0, 2).map((name, idx) => (
								<Badge key={idx} variant="outline" className="text-xs">
									{name}
								</Badge>
							))}
							{result.commonNames.length > 2 && (
								<Badge variant="outline" className="text-xs">
									+{result.commonNames.length - 2} more
								</Badge>
							)}
						</div>
					)}
			</CardHeader>

			{/* Content Section with proper HTML rendering */}
			<CardContent className="flex-grow px-5 py-0 overflow-hidden">
				{isClient && typeof window !== "undefined" ? (
					<div
						className="text-sm text-muted-foreground line-clamp-4 leading-relaxed"
						dangerouslySetInnerHTML={{
							__html: sanitizedDescription,
						}}
					/>
				) : (
					<div className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
						{sanitizedDescription}
					</div>
				)}
			</CardContent>

			{/* Footer Section */}
			<CardFooter className="mt-auto px-5 py-4 flex-shrink-0">
				<Link
					href={result.slug ? `/plant/${result.slug}` : `/plant/${result.id}`}
					className="w-full"
				>
					<p className="text-sm text-primary group-hover/card:underline font-paragraph-semibold">
						Learn more →
					</p>
				</Link>
			</CardFooter>
		</Card>
	);
};

export function PlantIdentificationResults({
	results,
}: PlantIdentificationResultsProps) {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	// Reason: Categorize results into logical groups
	const aiOnlyResults = results.filter(
		(result) => !result.databaseMatch && !result.isSimilarPlant
	);
	const databaseResults = results.filter(
		(result) => result.databaseMatch && !result.isSimilarPlant
	);
	const similarResults = results.filter((result) => result.isSimilarPlant);

	if (!results || results.length === 0) {
		return (
			<Card>
				<CardContent className="text-center py-8">
					<Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-paragraph-semibold text-gray-900 mb-2">
						No plants identified
					</h3>
					<p className="text-gray-600">
						We couldn&apos;t identify any plants matching your input. Try
						uploading a clearer image or providing more detailed descriptions.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-8">
			{/* AI Identification Results */}
			{aiOnlyResults.length > 0 && (
				<div className="space-y-6">
					<div className="text-center">
						<h2 className="text-2xl font-title-bold text-gray-900 mb-2">
							AI Identification Results
						</h2>
						<p className="text-gray-600">
							Found {aiOnlyResults.length} potential AI match
							{aiOnlyResults.length !== 1 ? "es" : ""} based on your input
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{aiOnlyResults.map((result, index) => (
							<PlantResultCard
								key={result.id || index}
								result={result}
								index={index}
								isClient={isClient}
							/>
						))}
					</div>
				</div>
			)}

			{/* Database Match Results */}
			{databaseResults.length > 0 && (
				<div className="space-y-6">
					<div className="text-center">
						<h2 className="text-2xl font-title-bold text-gray-900 mb-2">
							Database Matches
						</h2>
						<p className="text-gray-600">
							Found {databaseResults.length} confirmed match
							{databaseResults.length !== 1 ? "es" : ""} in our plant database
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{databaseResults.map((result, index) => (
							<PlantResultCard
								key={result.id || `db-${index}`}
								result={result}
								index={aiOnlyResults.length + index}
								isClient={isClient}
							/>
						))}
					</div>
				</div>
			)}

			{/* Similar plants section */}
			{similarResults.length > 0 && (
				<div className="space-y-6">
					<div className="text-center">
						<h2 className="text-2xl font-title-bold text-gray-900 mb-2">
							Similar Plants
						</h2>
						<p className="text-gray-600">
							You might also be interested in these {similarResults.length}{" "}
							similar plant
							{similarResults.length !== 1 ? "s" : ""} from our database
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{similarResults.map((result, index) => (
							<PlantResultCard
								key={result.id || `similar-${index}`}
								result={result}
								index={aiOnlyResults.length + databaseResults.length + index}
								isClient={isClient}
							/>
						))}
					</div>
				</div>
			)}

			{/* Reason: Show care tips for the top result (prioritize database, then AI) */}
			{(databaseResults.length > 0
				? databaseResults[0]
				: aiOnlyResults.length > 0
				? aiOnlyResults[0]
				: null) && (
				<PlantCareTips
					plantName={(databaseResults[0] || aiOnlyResults[0])?.name}
					careInstructions={
						(databaseResults[0] || aiOnlyResults[0])?.careInstructions
					}
				/>
			)}

			<div className="text-center text-sm text-gray-500">
				<p>
					Results are based on AI analysis and may not be 100% accurate. For
					definitive identification, consult with a local botanist or plant
					expert.
				</p>
			</div>
		</div>
	);
}

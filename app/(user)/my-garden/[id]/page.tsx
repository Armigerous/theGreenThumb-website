import React from "react";
import { notFound } from "next/navigation";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { PlantCard } from "@/components/Garden/PlantCard";
import { PlantRecommendationCard } from "@/components/Garden/PlantRecommendationCard";
import {
	GardenDetailResponse,
	PlantRecommendation,
	userPlants as UserPlant,
	CareLogEntry,
	CareLogType,
} from "@/types/garden";
import { Plus, ArrowLeft, Users, Leaf } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@/lib/generated/prisma";
// Note: Prisma types are available via generated client, but not needed in this file

interface GardenDetailPageProps {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ tab?: string }>;
}

/**
 * GardenDetailPage Component
 *
 * Reason: Individual garden detail page showing plants and recommendations
 * following brand guidelines with proper navigation and tab system
 */
const GardenDetailPage = async ({
	params,
	searchParams,
}: GardenDetailPageProps) => {
	const { id: gardenId } = await params;
	const { tab: activeTab = "plants" } = await searchParams;

	// Reason: Get authenticated user ID
	const { userId } = await auth();

	// Reason: Fetch garden detail data directly from database
	type GardenWithPlants = Prisma.user_gardensGetPayload<{
		include: {
			user_plants: {
				include: {
					main_plant_data: {
						select: {
							scientific_name: true;
							common_names: true;
							plant_images: {
								select: { img: true; alt_text: true };
								take: 1;
							};
						};
					};
				};
				orderBy: { created_at: "desc" };
			};
		};
	}>;

	let gardenData:
		| (GardenWithPlants & {
				statistics: {
					totalPlants: number;
					healthyPlants: number;
					warningPlants: number;
					criticalPlants: number;
					plantsNeedingCare: number;
				};
		  })
		| null = null;
	let recommendations: PlantRecommendation[] = [];
	let error: string | null = null;

	try {
		if (!userId) {
			throw new Error("User not authenticated");
		}

		const gardenIdNum = parseInt(gardenId);
		if (isNaN(gardenIdNum)) {
			notFound();
		}

		// Reason: Fetch garden details directly from database (Prisma snake_case models)
		const garden = await prisma.user_gardens.findFirst({
			where: { id: gardenIdNum, user_id: userId },
			include: {
				user_plants: {
					orderBy: { created_at: "desc" },
					include: {
						main_plant_data: {
							select: {
								scientific_name: true,
								common_names: true,
								plant_images: {
									select: {
										img: true,
										alt_text: true,
									},
									take: 1,
								},
							},
						},
					},
				},
			},
		});

		if (!garden) {
			notFound();
		}

		// Reason: Calculate statistics for the garden (status not stored in DB)
		const plants = garden.user_plants;
		const totalPlants = plants.length;
		const healthyPlants = totalPlants; // Default assumption; refine via care logs later
		const warningPlants = 0;
		const criticalPlants = 0;

		const plantsNeedingCare = plants.filter((plant) => {
			const rawCareLogs = plant.care_logs as unknown;
			const careLogs = Array.isArray(rawCareLogs)
				? (rawCareLogs as Array<{ date: string; type: string }>)
				: [];
			if (careLogs.length === 0) return true;
			const lastCareDate = new Date(
				Math.max(...careLogs.map((log) => new Date(log.date).getTime()))
			);
			const daysSinceLastCare =
				(Date.now() - lastCareDate.getTime()) / (1000 * 60 * 60 * 24);
			return daysSinceLastCare > 7;
		}).length;

		gardenData = {
			...garden,
			statistics: {
				totalPlants,
				healthyPlants,
				warningPlants,
				criticalPlants,
				plantsNeedingCare,
			},
		};

		// Reason: Fetch recommendations if on recommendations tab (simplified, aligned to schema)
		if (activeTab === "recommendations") {
			const recommendationsData = await prisma.main_plant_data.findMany({
				take: 10,
				include: { plant_images: true },
				orderBy: { scientific_name: "asc" },
			});

			recommendations = recommendationsData.map((plant) => ({
				id: plant.id,
				slug: plant.slug,
				scientificName: plant.scientific_name,
				commonName: Array.isArray(plant.common_names)
					? String(plant.common_names[0] || "")
					: String(plant.common_names || ""),
				description: plant.description || null,
				image: plant.plant_images?.[0]?.img || null,
				imageAlt: plant.plant_images?.[0]?.alt_text || null,
			}));
		}
	} catch (err) {
		console.error("Error fetching garden data:", err);
		error = "Failed to load garden data";
	}

	if (error) {
		return (
			<div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
				<div className="space-y-4">
					<Heading className="text-cream-800">Garden Not Found</Heading>
					<p className="text-red-600 text-lg max-w-2xl mx-auto">{error}</p>
				</div>
				<Button asChild variant="default">
					<Link href="/my-garden">Back to My Gardens</Link>
				</Button>
			</div>
		);
	}

	if (!gardenData) {
		notFound();
	}

	// Reason: Align with Prisma snake_case relation names without unsafe casts
	const { statistics, user_plants } = gardenData;

	// Reason: Map Prisma user_plants rows into UI-friendly UserPlant type expected by components
	const allowedCareTypes: CareLogType[] = [
		"water",
		"fertilize",
		"prune",
		"treatment",
	];

	const userPlantsForUI: UserPlant[] = user_plants.map((p) => {
		const rawCareLogs = p.care_logs as unknown;
		const careLogs: CareLogEntry[] = Array.isArray(rawCareLogs)
			? (rawCareLogs as Array<Record<string, unknown>>).map((entry) => {
					const typeValue =
						typeof entry.type === "string" ? (entry.type as string) : "water";
					const coercedType: CareLogType = allowedCareTypes.includes(
						typeValue as CareLogType
					)
						? (typeValue as CareLogType)
						: "water";
					const dateValue =
						typeof entry.date === "string" || entry.date instanceof Date
							? new Date(entry.date as string)
							: new Date();
					const notesValue =
						typeof entry.notes === "string" ? (entry.notes as string) : "";
					return { date: dateValue, type: coercedType, notes: notesValue };
			  })
			: [];

		const rawImages = p.images as unknown;
		const images: Array<{ url: string; isPrimary: boolean; uploadedAt: Date }> =
			Array.isArray(rawImages)
				? (rawImages as Array<Record<string, unknown>>).map((img, index) => ({
						url:
							typeof img.url === "string"
								? (img.url as string)
								: "/no-plant-image.png",
						isPrimary:
							(typeof img.isPrimary === "boolean"
								? (img.isPrimary as boolean)
								: false) || index === 0,
						uploadedAt:
							typeof img.uploadedAt === "string" ||
							img.uploadedAt instanceof Date
								? new Date(img.uploadedAt as string)
								: new Date(),
				  }))
				: [];

		return {
			id: p.id,
			gardenId: p.garden_id,
			customName: p.nickname,
			botanicalName:
				p.main_plant_data?.scientific_name ||
				(Array.isArray(p.main_plant_data?.common_names)
					? String((p.main_plant_data?.common_names as string[])[0] || "")
					: String(p.main_plant_data?.common_names || "")),
			status: "healthy",
			careLogs,
			images,
			locationTags: [],
			createdAt: p.created_at,
			updatedAt: p.updated_at,
			// Database-compatible fields retained for downstream helpers that expect them
			garden_id: p.garden_id,
			nickname: p.nickname,
			plant_id: p.plant_id,
			care_logs: p.care_logs as unknown as any,
			created_at: p.created_at,
			updated_at: p.updated_at,
			main_plant_data: p.main_plant_data as unknown as any,
		};
	});

	return (
		<div className="min-h-screen bg-cream-50">
			<div className="max-w-7xl mx-auto px-4 py-8">
				{/* Reason: Page header with navigation */}
				<div className="mb-8">
					<div className="flex items-center gap-4 mb-4">
						<Button asChild variant="ghost" size="sm">
							<Link href="/my-garden">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to Gardens
							</Link>
						</Button>
					</div>

					<div className="flex items-start justify-between">
						<div>
							<Heading className="text-cream-800 mb-2">
								{gardenData.name}
							</Heading>
							<p className="text-cream-600 text-lg">
								{statistics.totalPlants}{" "}
								{statistics.totalPlants === 1 ? "plant" : "plants"} in this
								garden
							</p>
						</div>
						<Button
							asChild
							className="bg-brand-600 hover:bg-brand-700 text-primary-foreground"
						>
							<Link href={`/plants?addToGarden=${gardenId}`}>
								<Plus className="mr-2 h-4 w-4" />
								Add Plant
							</Link>
						</Button>
					</div>
				</div>

				{/* Reason: Garden statistics */}
				<div className="mb-8 p-6 bg-cream-100 border border-cream-200 rounded-lg">
					<h2 className="font-title-semibold text-cream-800 text-lg mb-4">
						Garden Health
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="text-center">
							<div className="font-title-bold text-3xl text-green-600 mb-1">
								{statistics.healthyPlants}
							</div>
							<div className="font-paragraph text-sm text-cream-600">
								Healthy
							</div>
						</div>
						<div className="text-center">
							<div className="font-title-bold text-3xl text-orange-600 mb-1">
								{statistics.plantsNeedingCare}
							</div>
							<div className="font-paragraph text-sm text-cream-600">
								Need Care
							</div>
						</div>
						<div className="text-center">
							<div className="font-title-bold text-3xl text-yellow-600 mb-1">
								{statistics.warningPlants}
							</div>
							<div className="font-paragraph text-sm text-cream-600">
								Warning
							</div>
						</div>
						<div className="text-center">
							<div className="font-title-bold text-3xl text-red-600 mb-1">
								{statistics.criticalPlants}
							</div>
							<div className="font-paragraph text-sm text-cream-600">
								Critical
							</div>
						</div>
					</div>
				</div>

				{/* Reason: Tab navigation */}
				<div className="mb-8">
					<div className="flex space-x-1 bg-cream-100 p-1 rounded-lg w-fit">
						<Link
							href={`/my-garden/${gardenId}?tab=plants`}
							className={`px-4 py-2 rounded-md font-paragraph-semibold text-sm transition-colors ${
								activeTab === "plants"
									? "bg-cream-50 text-cream-800 shadow-sm"
									: "text-cream-600 hover:text-cream-800"
							}`}
						>
							<Leaf className="inline mr-2 h-4 w-4" />
							My Plants ({userPlantsForUI.length})
						</Link>
						<Link
							href={`/my-garden/${gardenId}?tab=recommendations`}
							className={`px-4 py-2 rounded-md font-paragraph-semibold text-sm transition-colors ${
								activeTab === "recommendations"
									? "bg-cream-50 text-cream-800 shadow-sm"
									: "text-cream-600 hover:text-cream-800"
							}`}
						>
							<Users className="inline mr-2 h-4 w-4" />
							Recommendations
						</Link>
					</div>
				</div>

				{/* Reason: Tab content */}
				{activeTab === "plants" && (
					<div>
						<div className="flex items-center justify-between mb-6">
							<h2 className="font-title-semibold text-cream-800 text-xl">
								Your Plants
							</h2>
							<div className="flex items-center gap-2 text-cream-600">
								<Leaf className="h-4 w-4" />
								<span className="font-paragraph text-sm">
									{userPlantsForUI.length}{" "}
									{userPlantsForUI.length === 1 ? "plant" : "plants"}
								</span>
							</div>
						</div>

						{userPlantsForUI.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
								{userPlantsForUI.map((plant: UserPlant) => (
									<PlantCard key={plant.id} plant={plant} />
								))}
							</div>
						) : (
							<div className="text-center py-12">
								<div className="text-6xl mb-4">🌱</div>
								<h3 className="font-title-semibold text-cream-800 text-lg mb-2">
									No plants in this garden yet
								</h3>
								<p className="text-cream-600 mb-4">
									Add your first plant to start tracking its growth and care.
								</p>
								<Button
									asChild
									className="bg-brand-600 hover:bg-brand-700 text-primary-foreground"
								>
									<Link href={`/plants?addToGarden=${gardenId}`}>
										<Plus className="mr-2 h-4 w-4" />
										Add Your First Plant
									</Link>
								</Button>
							</div>
						)}
					</div>
				)}

				{activeTab === "recommendations" && (
					<div>
						<div className="flex items-center justify-between mb-6">
							<h2 className="font-title-semibold text-cream-800 text-xl">
								Plant Recommendations
							</h2>
							<p className="text-cream-600 text-sm">
								Based on your garden preferences
							</p>
						</div>

						{recommendations.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
								{recommendations.map((recommendation) => (
									<PlantRecommendationCard
										key={recommendation.id}
										recommendation={recommendation}
									/>
								))}
							</div>
						) : (
							<div className="text-center py-12">
								<div className="text-6xl mb-4">🌿</div>
								<h3 className="font-title-semibold text-cream-800 text-lg mb-2">
									No recommendations available
								</h3>
								<p className="text-cream-600 mb-4">
									Complete your garden preferences to get personalized plant
									recommendations.
								</p>
								<Button
									asChild
									className="bg-brand-600 hover:bg-brand-700 text-primary-foreground"
								>
									<Link href={`/garden-customization?gardenId=${gardenId}`}>
										Update Garden Preferences
									</Link>
								</Button>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default GardenDetailPage;

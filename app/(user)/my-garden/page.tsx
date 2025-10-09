import React from "react";
import { Button } from "@/components/ui/button";
import { GardenOverviewResponse } from "@/types/garden";
import Link from "next/link";
import { queries } from "@/lib/db/queries";
import { auth } from "@clerk/nextjs/server";
import { MyGardenClient } from "./_components/MyGardenClient";
import { MyGardenEmpty } from "./_components/MyGardenEmpty";
import { SeasonalBackground } from "@/components/Garden/_foundations/SeasonalBackground";
import { getCurrentSeason } from "@/lib/utils/seasonal";
import { serializeForClient } from "@/lib/utils/serialization";

/**
 * MyGardenPage Component (Refactored)
 *
 * Reason: Clean server component focused on data fetching only.
 * All UI rendering and interactions delegated to client components
 * following Next.js 15 best practices and proper separation of concerns.
 */
const MyGardenPage = async () => {
	// Reason: Get authenticated user ID
	const { userId } = await auth();

	// Reason: Fetch garden overview data from database layer
	let gardenData: GardenOverviewResponse | null = null;
	let error: string | null = null;

	try {
		if (!userId) {
			throw new Error("User not authenticated");
		}

		const gardensWithStats =
			await queries.gardenOverview.getUserGardensWithStats(userId);
		const overallStatistics =
			await queries.gardenOverview.getUserGardenStatistics(userId);
		const plantsNeedingCare = await queries.gardenOverview.getPlantsNeedingCare(
			userId
		);

		// Reason: Serialize data to plain objects (convert Decimal, BigInt, Date) for client components
		gardenData = serializeForClient({
			gardens: gardensWithStats,
			statistics: overallStatistics,
			plantsNeedingCare: plantsNeedingCare,
		}) as unknown as GardenOverviewResponse;
	} catch (err) {
		console.error("Error fetching garden data:", err);
		error = "Failed to load garden data";
	}

	// Reason: Error state with seasonal background
	if (error) {
		const currentSeason = getCurrentSeason();
		return (
			<>
				<SeasonalBackground season={currentSeason} />
				<div className="relative min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 px-4">
					<div className="space-y-4">
						<h1 className="font-title-bold text-4xl text-cream-800">
							Your Gardens
						</h1>
						<p className="text-red-600 text-lg max-w-2xl mx-auto font-paragraph">
							{error}
						</p>
					</div>
					<Button
						asChild
						size="lg"
						className="bg-brand-600 hover:bg-brand-700 text-primary-foreground font-paragraph-semibold rounded-2xl"
					>
						<Link href="/plants">Find Plants</Link>
					</Button>
				</div>
			</>
		);
	}

	// Reason: Empty state - delegate to client component
	if (!gardenData || gardenData.gardens.length === 0) {
		return <MyGardenEmpty />;
	}

	// Reason: Main content - delegate to client component
	return <MyGardenClient gardenData={gardenData} />;
};

export default MyGardenPage;

"use client";

import React, { useEffect, useRef } from "react";
import { SeasonalBackground } from "@/components/Garden/_foundations/SeasonalBackground";
import { EmptyGardenState } from "@/components/Garden/_shared/EmptyGardenState";
import { CareAlertBanner } from "@/components/Garden/_shared/CareAlertBanner";
import { GardenStatistics } from "@/components/Garden/_shared/GardenStatistics";
import { QuickActions } from "@/components/Garden/_shared/QuickActions";
import { GardenCard } from "@/components/Garden/GardenCard.refactored";
import { GardenOverviewResponse } from "@/types/garden";
import { getCurrentSeason, getSeasonalName } from "@/lib/utils/seasonal";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	animateFadeUp,
	animateStaggerFadeUp,
	withReducedMotion,
} from "@/lib/animations/garden-animations";

/**
 * MyGardenClient Component
 *
 * Reason: Client wrapper for My Garden page handling animations
 * and client-side interactions while keeping server data fetching separate
 */

type MyGardenClientProps = {
	gardenData: GardenOverviewResponse;
};

export const MyGardenClient: React.FC<MyGardenClientProps> = ({
	gardenData,
}) => {
	const headerRef = useRef<HTMLDivElement>(null);
	const statsRef = useRef<HTMLDivElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);

	const { gardens, statistics, plantsNeedingCare } = gardenData;
	const currentSeason = getCurrentSeason();
	const seasonalName = getSeasonalName(currentSeason);

	useEffect(() => {
		// Reason: Entrance animations for page sections
		if (headerRef.current) {
			withReducedMotion(() =>
				animateFadeUp(headerRef.current!, { delay: 200, duration: 600 })
			);
		}

		if (gridRef.current) {
			const cards = gridRef.current.querySelectorAll(".garden-card");
			withReducedMotion(() =>
				animateStaggerFadeUp(Array.from(cards), {
					delay: 600,
					stagger: 100,
				})
			);
		}
	}, []);

	return (
		<>
			{/* Reason: Seasonal background with paper texture */}
			<SeasonalBackground season={currentSeason} animated={true} />

			<div className="relative min-h-screen">
				<div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
					{/* Reason: Page header with seasonal theme and brand voice */}
					<div ref={headerRef} className="opacity-0">
						<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
							<div>
								<h1 className="font-title-bold text-4xl text-cream-800 mb-2">
									Your Gardens
								</h1>
								<p className="font-paragraph text-lg text-cream-600">
									See how your plants are doing
								</p>
							</div>
							<Button
								asChild
								size="lg"
								className="bg-brand-600 hover:bg-brand-700 text-primary-foreground font-paragraph-semibold rounded-2xl self-start md:self-center"
							>
								<Link href="/garden-customization">
									<Plus className="mr-2 h-5 w-5" />
									Plant a Garden
								</Link>
							</Button>
						</div>

						{/* Reason: Seasonal indicator */}
						<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200">
							<span className="font-paragraph text-sm text-cream-600">
								{seasonalName}
							</span>
						</div>
					</div>

					{/* Reason: Statistics overview with garden theme */}
					<div ref={statsRef}>
						<h2 className="font-title-semibold text-xl text-cream-800 mb-4">
							Garden Overview
						</h2>
						<GardenStatistics statistics={statistics} animated={true} />
					</div>

					{/* Reason: Care alert with gentle messaging */}
					<CareAlertBanner
						plantCount={plantsNeedingCare.length}
						animated={true}
					/>

					{/* Reason: Gardens grid */}
					<div>
						<div className="flex items-center justify-between mb-6">
							<h2 className="font-title-semibold text-xl text-cream-800">
								Your Gardens
							</h2>
							<span className="font-paragraph text-sm text-cream-600">
								{gardens.length} {gardens.length === 1 ? "garden" : "gardens"}
							</span>
						</div>

						<div
							ref={gridRef}
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
						>
							{gardens.map((garden) => (
								<div key={garden.id} className="garden-card opacity-0">
									<GardenCard garden={garden} />
								</div>
							))}
						</div>
					</div>

					{/* Reason: Quick actions with friendly labels */}
					<QuickActions />
				</div>
			</div>
		</>
	);
};

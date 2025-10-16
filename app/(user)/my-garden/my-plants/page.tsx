import React from "react";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Reason: Simple under construction page for my plants section
// that follows the website's design patterns with gardening theme
const MyPlantsPage = () => {
	return (
		<div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
			{/* Main heading with site's standard styling */}
			<div className="space-y-4">
				<Heading className="text-cream-800">My Plants</Heading>
				<p className="text-cream-600 text-lg max-w-2xl mx-auto">
					Your personal plant collection tracker is sprouting soon.
				</p>
			</div>

			{/* Construction message with plant theme */}
			<div className="bg-cream-100 border border-cream-300 rounded-lg p-6 max-w-md mx-auto">
				<div className="text-6xl mb-4">🪴</div>
				<h3 className="text-xl font-paragraph-semibold text-cream-800 mb-2">
					Taking Root
				</h3>
				<p className="text-cream-600 text-sm">
					Soon you&apos;ll be able to add plants to your collection, track their
					care schedules, and watch them flourish with personalized insights.
				</p>
			</div>

			{/* Action buttons */}
			<div className="flex flex-col sm:flex-row gap-4">
				<Button asChild variant="default">
					<Link href="/identify">Identify a Plant</Link>
				</Button>
				<Button asChild variant="outline">
					<Link href="/my-garden">Back to Garden</Link>
				</Button>
			</div>
		</div>
	);
};

export default MyPlantsPage;

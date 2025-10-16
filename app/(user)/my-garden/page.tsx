import React from "react";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Reason: Simple under construction page that follows the website's design patterns
// using cream color scheme and consistent typography
const MyGardenPage = () => {
	return (
		<div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
			{/* Main heading with site's standard styling */}
			<div className="space-y-4">
				<Heading className="text-cream-800">My Garden</Heading>
				<p className="text-cream-600 text-lg max-w-2xl mx-auto">
					Your personal garden dashboard is currently being cultivated.
				</p>
			</div>

			{/* Construction message with gardening theme */}
			<div className="bg-cream-100 border border-cream-300 rounded-lg p-6 max-w-md mx-auto">
				<div className="text-6xl mb-4">🌱</div>
				<h3 className="text-xl font-paragraph-semibold text-cream-800 mb-2">
					Growing Soon
				</h3>
				<p className="text-cream-600 text-sm">
					We&apos;re working hard to bring you tools to track your plants,
					monitor their growth, and manage your garden like never before.
				</p>
			</div>

			{/* Action buttons */}
			<div className="flex flex-col sm:flex-row gap-4">
				<Button asChild variant="default">
					<Link href="/plants">Explore Plant Database</Link>
				</Button>
				<Button asChild variant="outline">
					<Link href="/tips">Browse Garden Tips</Link>
				</Button>
			</div>
		</div>
	);
};

export default MyGardenPage;

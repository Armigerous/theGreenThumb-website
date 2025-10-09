"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	IllustrationPlaceholder,
	IllustrationPrompts,
} from "../_foundations/IllustrationPlaceholder";
import { Plus } from "lucide-react";
import { EmptyGardenStateProps } from "@/types/garden-ui";
import {
	animateStaggerFadeUp,
	withReducedMotion,
} from "@/lib/animations/garden-animations";

/**
 * EmptyGardenState Component
 *
 * Reason: Warm, encouraging empty state for users with no gardens
 * using brand voice and gentle visuals instead of generic dashboard messaging
 */

export const EmptyGardenState: React.FC<EmptyGardenStateProps> = ({
	onCreateGarden,
	animated = true,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (animated && containerRef.current) {
			const elements = containerRef.current.querySelectorAll(".animate-item");
			withReducedMotion(() =>
				animateStaggerFadeUp(Array.from(elements), {
					stagger: 150,
					delay: 200,
				})
			);
		}
	}, [animated]);

	return (
		<div
			ref={containerRef}
			className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4"
		>
			<div className="max-w-2xl mx-auto space-y-8">
				{/* Reason: Large encouraging illustration */}
				<div className="animate-item flex justify-center">
					<IllustrationPlaceholder
						{...IllustrationPrompts.emptyGarden}
						className="mx-auto"
					/>
				</div>

				{/* Reason: Warm, simple headline - brand voice */}
				<div className="animate-item space-y-3">
					<h1 className="font-title-bold text-3xl md:text-4xl text-cream-800">
						Let&apos;s Plant Your First Garden
					</h1>
					<p className="font-paragraph text-lg text-cream-600 max-w-xl mx-auto">
						Every great garden starts with a single plant. We&apos;ll help yours
						thrive.
					</p>
				</div>

				{/* Reason: Clear, friendly call-to-action */}
				<div className="animate-item">
					<Button
						asChild
						size="lg"
						className="bg-brand-600 hover:bg-brand-700 text-primary-foreground font-paragraph-semibold text-base px-8 py-6 rounded-2xl"
					>
						<Link href="/garden-customization">
							<Plus className="mr-2 h-5 w-5" />
							Start Your Garden
						</Link>
					</Button>
				</div>

				{/* Reason: Simple secondary actions with friendly labels */}
				<div className="animate-item flex flex-wrap justify-center gap-4 pt-4">
					<Button asChild variant="ghost" className="rounded-xl">
						<Link href="/plants" className="font-paragraph">
							Find Plants
						</Link>
					</Button>
					<Button asChild variant="ghost" className="rounded-xl">
						<Link href="/tips" className="font-paragraph">
							Get Growing Tips
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
};

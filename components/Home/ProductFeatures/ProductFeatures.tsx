"use client";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import { FeaturesProduct, ProductFeature } from "@/types/features";
import { motion } from "framer-motion";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Reason: Lazy load heavy Single component to improve initial page load
const Single = dynamic(() => import("./Single"), {
	loading: () => (
		<div className="space-y-4">
			<Skeleton className="h-8 w-3/4" />
			<Skeleton className="h-32 w-full" />
			<Skeleton className="h-4 w-full" />
		</div>
	),
});

const ProductFeatures: React.FC = () => {
	return (
		<div className="relative m-5">
			<MaxWidthWrapper className="max-w-screen-xl">
				<div className="sticky top-[2vh] pt-14 lg:pt-16 text-cream-800 mb-36">
					<h2 className="font-black text-3xl md:text-5xl lg:text-6xl text-center">
						Product Features
					</h2>
				</div>

				<div className="flex flex-col gap-10">
					{FeaturesProduct.map((ProductFeature: ProductFeature, index) => (
						<motion.div
							key={ProductFeature.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{
								delay: index * 0.1, // Reduced delay for faster perceived performance
								duration: 0.2, // Faster animation
								ease: "easeOut",
							}}
							viewport={{ once: true, margin: "-100px" }} // Trigger animation earlier
						>
							<Suspense
								fallback={
									<div className="space-y-4">
										<Skeleton className="h-8 w-3/4" />
										<Skeleton className="h-32 w-full" />
										<Skeleton className="h-4 w-full" />
									</div>
								}
							>
								<Single item={ProductFeature} />
							</Suspense>
						</motion.div>
					))}
				</div>
			</MaxWidthWrapper>
		</div>
	);
};

export default ProductFeatures;

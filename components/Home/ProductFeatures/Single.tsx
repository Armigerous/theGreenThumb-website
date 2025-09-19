import { Button } from "@/components/ui/button";
import { ProductFeature } from "@/types/features";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLottie } from "lottie-react";
import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";

const Single: React.FC<{ item: ProductFeature }> = ({ item }) => {
	const ref = useRef<HTMLDivElement>(null);
	const [animationData, setAnimationData] = useState<object | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "center start"],
	});
	const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);
	const opacity = useTransform(
		scrollYProgress,
		[0.2, 0.35, 0.6, 0.7],
		[0, 1, 1, 0]
	);

	// Reason: Lazy load animation data to prevent blocking initial page load
	useEffect(() => {
		const loadAnimation = async () => {
			try {
				setIsLoading(true);
				const response = await fetch(item.animationPath);
				const data = await response.json();
				setAnimationData(data);
			} catch (error) {
				console.error("Failed to load animation:", error);
				setAnimationData(null);
			} finally {
				setIsLoading(false);
			}
		};

		loadAnimation();
	}, [item.animationPath]);

	const options = {
		animationData,
		loop: true,
		autoplay: true,
	};

	const lottie = useLottie(options, { height: "100%", width: "100%" });

	return (
		<section ref={ref} className="py-10 lg:py-16">
			<motion.div
				className="flex flex-col lg:flex-row items-center justify-center h-auto w-full overflow-visible gap-10 lg:gap-12"
				style={{ y, opacity }}
			>
				{/* Animation Block */}
				<div className="flex-1 flex justify-center w-full">
					<div className="bg-cream-800 border-black rounded-3xl w-full max-w-[400px] shadow-xl min-h-[300px] flex items-center justify-center">
						{isLoading ? (
							<div className="animate-pulse bg-cream-700 rounded-lg w-full h-full flex items-center justify-center">
								<span className="text-cream-200">Loading animation...</span>
							</div>
						) : animationData ? (
							lottie.View
						) : (
							<div className="flex items-center justify-center text-cream-200">
								<span>Animation unavailable</span>
							</div>
						)}
					</div>
				</div>

				{/* Text Content Block */}
				<div className="flex-1 flex flex-col gap-5 lg:gap-7 text-left">
					<h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold">
						{item.title}
					</h2>
					<p className="text-sm md:text-base lg:text-lg leading-relaxed">
						{item.desc}
					</p>
					<div style={{ zIndex: 10 }}>
						<Link href={item.url} className="block w-fit">
							<Button className="px-4 py-2 bg-primary text-cream-50 rounded-md hover:scale-105 transition-transform text-lg md:text-xl">
								Read More
							</Button>
						</Link>
					</div>
				</div>
			</motion.div>
		</section>
	);
};

export default Single;

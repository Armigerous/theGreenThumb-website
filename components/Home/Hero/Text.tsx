"use client";

import React, { useState, useEffect } from "react";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
	hidden: { opacity: 1 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
		},
	},
};

const words = [
	"Smartest",
	"Simplest",
	"Easiest",
	"Ultimate",
	"Perfect",
	"Lifelong",
	"Trusted",
];

const Text = () => {
	const [currentWordIndex, setCurrentWordIndex] = useState(0);

	// Reason: Add dependency array and optimize interval timing to prevent infinite re-renders
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentWordIndex((prevIndex) =>
				prevIndex === words.length - 1 ? 0 : prevIndex + 1
			);
		}, 3000); // Reduced from 5 to 3 seconds for better engagement

		return () => clearInterval(interval);
	}, []); // Empty dependency array ensures this only runs once

	return (
		<motion.div
			className="text-left md:w-1/2 mb-6 md:mb-0 pt-20 lg:pt-0 px-4 space-y-6"
			initial="hidden"
			animate="visible"
			variants={{
				hidden: { opacity: 0 },
				visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
			}}
		>
			<motion.p
				className="text-medium sm:text-base lg:text-lg mb-4 italic"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				For North Carolina Gardeners
			</motion.p>
			<motion.h1
				className="text-4xl md:text-6xl mb-4 font-thin leading-normal md:leading-relaxed lg:leading-normal"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				Your Garden&apos;s{" "}
				<span className="hover:text-primary font-bold inline-block relative w-[7ch]">
					<AnimatePresence mode="wait">
						<motion.span
							key={words[currentWordIndex]}
							initial={{ y: "100%", opacity: 0 }}
							animate={{ y: "0%", opacity: 1 }}
							exit={{ y: "-100%", opacity: 0 }}
							transition={{ duration: 0.6, ease: "easeInOut" }}
							style={{ display: "inline-block" }}
						>
							{words[currentWordIndex]}
						</motion.span>
					</AnimatePresence>
				</span>{" "}
				Tool is Here!
			</motion.h1>
			<motion.p
				className="mb-4 text-sm md:text-xl max-w-full"
				variants={fadeInUp}
			>
				Effortlessly monitor and optimize your
				<strong> plants&apos; </strong>health with real-time insights in order
				to keep them
				<strong> healthy and thriving.</strong>
			</motion.p>
			<motion.ul
				className="list-none space-y-2 text-sm md:text-lg"
				aria-label="Key features"
				variants={staggerContainer}
			>
				{[
					{ text: "Simple recommendations", underline: "Simple" },
					{ text: "24/7 monitoring", underline: "24/7" },
					{ text: "Simple and beautiful design", underline: "beautiful" },
					{ text: "Perfect for any level of gardener", underline: "any" },
				].map((item, index) => (
					<motion.li
						key={index}
						className="flex items-center font-bold"
						variants={fadeInUp}
					>
						<CheckIcon className="mr-2 h-4 w-4" aria-hidden="true" />
						<span>
							{item.text.split(item.underline).map((part, i) =>
								i === 0 ? (
									part
								) : (
									<React.Fragment key={i}>
										<u>{item.underline}</u>
										{part}
									</React.Fragment>
								)
							)}
						</span>
					</motion.li>
				))}
			</motion.ul>
			<motion.div variants={fadeInUp} className="flex gap-4">
				<Link href="/tips">
					<Button
						variant={"default"}
						className="flex justify-center items-center mt-6 w-full text-cream-50 text-lg md:text-xl lg:text-2xl py-6 bg-primary transition-all transform hover:scale-105 focus:ring focus:ring-brand-600 shadow-lg"
						aria-label="Start Growing Smarter - Navigate to gardening tips"
					>
						<span className="mr-2">Start Growing Smarter</span>
					</Button>
				</Link>
				<Link href="/plants" prefetch={true}>
					<Button
						variant={"outline"}
						className="flex justify-center items-center mt-6 w-full text-primary text-lg md:text-xl lg:text-2xl py-6 border-2 border-primary transition-all transform hover:scale-105 focus:ring focus:ring-brand-600 shadow-lg"
						aria-label="Explore Plants Database"
					>
						<span className="mr-2">Explore Plants</span>
					</Button>
				</Link>
			</motion.div>
		</motion.div>
	);
};

export default Text;

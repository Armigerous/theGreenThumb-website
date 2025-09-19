"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const imageAnimation = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 1.5,
			type: "spring",
			stiffness: 100,
		},
	},
};

const Model = () => {
	return (
		<div className="pointer-events-none w-full md:w-1/2 flex items-center justify-center mb-6 md:mb-0">
			<motion.div
				className="w-full flex items-center justify-center"
				initial="hidden"
				animate="visible"
				variants={imageAnimation}
			>
				<Image
					src={"/logo-transparent.png"}
					alt="GreenThumb logo"
					priority
					height={500}
					width={500}
					className="object-contain"
					sizes="(max-width: 768px) 100vw, 50vw"
					placeholder="blur"
					blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
				/>
			</motion.div>
		</div>
	);
};

export default Model;

import React from "react";
import { Heading } from "../heading";
import Image from "next/image";

const Header = () => {
	return (
		<div className="relative">
			<Image
				src="/tips-search.png"
				alt="Tips & Tricks"
				width={800}
				height={400}
				className="w-full"
				priority
			/>

			<div className="absolute inset-0 flex flex-col justify-center items-center text-center">
				<div className="bg-cream-300 bg-opacity-50 p-4 md:p-6 rounded-lg">
					<Heading className="text-5xl md:text-6xl font-title-bold mb-2 text-brand-600">
						Tips & Tricks
					</Heading>
					<p className="text-lg sm:text-xl md:text-2xl  text-cream-900">
						Learn more about gardening!
					</p>
				</div>
			</div>
		</div>
	);
};

export default Header;

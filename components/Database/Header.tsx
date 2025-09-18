import React from "react";
import { Heading } from "../heading";
import Image from "next/image";

const Header = () => {
	return (
		<div className="relative">
			<Image
				src="/plant-search.png"
				alt="Plant Database"
				width={800}
				height={400}
				className="w-full"
				priority
				placeholder="blur"
				blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvbqvVTBzRi4kePZhD7kkFq4LUOkWm4sHmmKMhXIiQBdOijO4CJ9bvOpdjy2Z/EQ8SWG6O5ePfNoMr0rKvz0fgzL/IU6ZV0cnJSKLPWBaQm0dgNLFJ7xaZL8H6g=="
				sizes="(max-width: 768px) 100vw, 800px"
			/>

			<div className="absolute inset-0 flex flex-col justify-center items-center text-center">
				<div className="bg-cream-300 bg-opacity-70 p-4 md:p-6 rounded-lg">
					<Heading className="text-6xl md:text-7xl font-bold mb-2 text-brand-600">
						Discover
					</Heading>
					<Heading className="text-lg sm:text-xl md:text-2xl  text-cream-900">
						Amazing Plants in North Carolina
					</Heading>
				</div>
			</div>
		</div>
	);
};

export default Header;

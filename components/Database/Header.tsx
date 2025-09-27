import React from "react";
import { Heading } from "../heading";
import { OptimizedImage } from "@/components/ui/optimized-image";

const Header = () => {
  return (
    <div className="relative">
      <OptimizedImage
        src="/plant-search.png"
        alt="Plant Database"
        width={800}
        height={400}
        className="w-full"
        priority
        placeholder="empty"
        sizes="(max-width: 768px) 100vw, 800px"
        showSkeleton={false}
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

import React from "react";
import { Heading } from "../heading";
import { OptimizedImage } from "@/components/ui/smart-image";

const Header = () => {
  return (
    <div className="relative">
      <OptimizedImage
        src="/plant-search.png"
        alt="Plant Database"
        context="hero"
        isCritical={true}
        sizes="100vw"
        className="rounded-lg w-full h-auto"
        priority
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

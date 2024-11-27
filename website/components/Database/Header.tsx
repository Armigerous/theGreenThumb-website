import React from "react";
import { Heading } from "../heading";
import Image from "next/image";

const Header = () => {
  return (
    <div className="relative ">
      <Image
        src="/plant-search.png"
        alt="Plant Database"
        width={800}
        height={200}
        className="w-full"
        priority
      />

      <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
        <div className="bg-cream-300 bg-opacity-50 p-4 md:p-6 rounded-lg">
          <Heading className="text-6xl md:text-7xl font-bold mb-2 text-brand-700">
            Discover
          </Heading>
          <Heading className="text-lg sm:text-xl md:text-2xl  text-black">
            Amazing Plants in North Carolina
          </Heading>
        </div>
      </div>
    </div>
  );
};

export default Header;

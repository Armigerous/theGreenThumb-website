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
        <div className="bg-gray-400 bg-opacity-90 p-4 md:p-6 rounded-lg">
          <Heading className="text-4xl md:text-5xl font-bold mb-2 text-green-700">
            Discover
          </Heading>
          <Heading className="text-lg md:text-xl sm:text-xl text-black">
            Amazing Plants in North Carolina
          </Heading>
        </div>
      </div>
    </div>
  );
};

export default Header;

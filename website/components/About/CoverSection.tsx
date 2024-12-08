import React from "react";
import { Heading } from "../heading";
import Image from "next/image";

const CoverSection: React.FC = () => {
  return (
    <section className="pt-16 pb-16 flex flex-col md:flex-row justify-center items-center">
      {/* Logo Section */}

      <Image
        src={"/logo.png"}
        alt="The GreenThumb logo"
        priority
        height={500}
        width={500}
        className="object-contain "
      />

      {/* Text Section */}
      <div className="relative text-center md:text-left px-4 sm:px-6 py-6 sm:py-8 shadow-xl rounded-lg bg-cream-300/70 w-full md:w-7/12">
        <Heading className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-primary">
          About The GreenThumb
        </Heading>
        <p className="text-sm sm:text-base md:text-lg text-gray-800 mb-4 leading-snug sm:leading-relaxed">
          Revolutionizing gardening with innovative technology. Learn how
          we&apos;re empowering gardeners to create healthier, thriving plants.
        </p>
        <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-snug sm:leading-relaxed">
          From state-of-the-art sensors to user-friendly apps, The GreenThumb
          combines cutting-edge tech with a passion for nature.
        </p>
      </div>
    </section>
  );
};

export default CoverSection;

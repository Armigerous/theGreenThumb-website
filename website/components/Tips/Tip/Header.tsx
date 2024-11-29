import Image from "next/image";
import React from "react";

const Header = ({ tip }: { tip: TipType }) => {
  const { title, categories, mainImage } = tip;

  return (
    <div className="overflow-hidden mt-10 relative w-full h-96 flex flex-col justify-end p-4 bg-gray-800 text-white rounded-lg">
      {/* Blurred Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={mainImage?.asset.url || "/no-plant-image.png"}
          alt={title}
          fill
          objectFit="cover"
          className="blur-sm rounded-lg"
          priority
        />
        <div className="absolute inset-0 bg-black/50 rounded-lg"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 mb-5">
        {/* Category Pills */}
        <div className="flex space-x-2 mb-2">
          {categories.map((category, index) => (
            <span
              key={index}
              className="inline-block py-2 sm:py-3 px-6 sm:px-10 bg-cream-800/80 text-cream-50 rounded-full capitalize font-semibold border-2 border-solid border-cream-50 hover:scale-105 transition-all ease duration-200 text-sm sm:text-base"
            >
              {category.title}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold">{title}</h1>
      </div>
    </div>
  );
};

export default Header;

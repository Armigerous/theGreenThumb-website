import { Tip } from "@/types/Tip";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { badgeVariants } from "@/components/ui/badge";

const Header = ({ tip }: { tip: Tip }) => {
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
            <Link
              href={`/category/${category.slug.current}`}
              key={index}
              className={badgeVariants({ variant: "default" })}
            >
              {category.title}
            </Link>
          ))}
        </div>
        {/* Title */}
        <h1 className="text-4xl font-bold">{title}</h1>
      </div>
    </div>
  );
};

export default Header;

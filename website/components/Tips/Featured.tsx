import { fetchLastSixPosts } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import TipCard from "./TipCard";
import { Tip } from "@/types/Tip";

const Featured = async () => {
  // Fetch the last six posts
  const data: Tip[] = await fetchLastSixPosts();

  // Limit to only the first 3 posts
  const limitedData = data.slice(0, 3);

  return (
    <section className="py-4">
      <div className="flex items-end gap-4">
        <h2 className="text-2xl md:text-4xl font-bold">Featured Posts</h2>
        <Link href="/tips/search">
          <p className="hover:underline text-primary text-right cursor-pointer">
            See More
          </p>
        </Link>
      </div>
      {/* Render the limited data */}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6 auto-rows-fr">
        {limitedData.map((tip, index) => (
          <div
            key={tip._id}
            className={`h-full ${index === 0 ? "md:row-span-2" : "md:row-span-1"}`}
          >
            <TipCard
              tip={tip}
              variant={index === 0 ? "default" : "horizontal"}
            />
          </div>
        ))}
      </ul>

      <Link href="/tips/search">
        <p className="hover:underline text-primary text-right cursor-pointer">
          See More
        </p>
      </Link>
    </section>
  );
};

export default Featured;

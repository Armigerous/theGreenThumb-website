import { fetchLastSixPosts } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import TipCard from "./TipCard";
import { Tip } from "@/types/Tip";

const Featured = async () => {
  const data: Tip[] = await fetchLastSixPosts();

  return (
    <section>
      <h2 className="text-5xl font-bold">Featured Posts</h2>
      {/* Process data in groups of three */}
      {[...Array(Math.ceil(data.length / 3))].map((_, i) => (
        <ul key={i} className="grid grid-cols-2 gap-8 my-6 auto-rows-fr">
          {data.slice(i * 3, i * 3 + 3).map((tip, index: number) => (
            <div
              key={tip._id}
              className={
                index === 0 ? "row-span-2 h-full" : "row-span-1 h-full"
              }
            >
              <TipCard
                tip={tip}
                variant={index === 0 ? "default" : "horizontal"}
              />
            </div>
          ))}
        </ul>
      ))}

      <Link href="/tips/search">
        <p className="hover:underline text-primary text-right cursor-pointer">
          See More
        </p>
      </Link>
    </section>
  );
};

export default Featured;

import React from "react";
import TipCard from "./TipCard";
import { fetchLastSixPosts } from "@/lib/utils";
import Link from "next/link";
import { Tip } from "@/types/Tip";

const Recent = async () => {
  const data: Tip[] = await fetchLastSixPosts();

  return (
    <section>
      <h2 className="text-5xl font-bold">Recent Posts</h2>
      <ul className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-rows-2 gap-8">
        {data.map((tip) => (
          <TipCard key={tip._id} tip={tip} />
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

export default Recent;

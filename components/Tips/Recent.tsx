import React from "react";
import TipCard from "./TipCard";
import { fetchLastSixPosts } from "@/lib/utils";
import Link from "next/link";
import { Tip } from "@/types/Tip";

// Revalidate cache every 24 hours
export const revalidate = 86400;

const Recent = async () => {
  const data: Tip[] = await fetchLastSixPosts();

  // Add cache headers to response
  const response = new Response(JSON.stringify(data));
  response.headers.set(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=172800"
  );

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

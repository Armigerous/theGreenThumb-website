import { formatDate } from "@/lib/utils";
import Link from "next/link";
import ViewCounter from "./ViewCounter";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tip } from "@/types/Tip";

// Define the BlogDetails functional component
const TipDetails = ({ tip }: { tip: Tip }) => {
  const { _id } = tip;
  return (
    // Main container for the blog details
    <div className="py-2 my-10 flex items-center border-2 justify-around flex-wrap font-medium rounded-lg text-lg sm:text-xl px-2 md:px-10 bg-primary text-cream-50 border-cream-800">
      {/* Publication date */}
      <time className="m-3">{formatDate(tip.publishedAt)}</time>
      {/* View counter */}
      <span className="m-3">
        <Suspense fallback={<Skeleton className="" />}>
          <ViewCounter id={_id} /> views
        </Suspense>
      </span>
      {/* Reading time */}
      <div className="m-3">4 min read </div>
      {/* Link to the first tag category */}
      <Link href={`/categories/}`} className="m-3 hover:underline">
        #{}
      </Link>
    </div>
  );
};

export default TipDetails;

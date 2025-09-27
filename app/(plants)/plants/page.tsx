import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import Header from "@/components/Database/Header";
import Search from "@/components/Database/Search/Search";
import { Suspense } from "react";
import { SearchSkeleton } from "@/components/Database/SearchSkeleton";

// Reason: Enable Partial Prerendering for this route to prerender static shell and stream dynamic content
export const experimental_ppr = true;
// Reason: Remove force-dynamic to allow PPR to work properly - PPR handles dynamic content streaming
// export const dynamic = "force-dynamic";
export const revalidate = 3600; // 1 hour

interface SearchParams {
  query?: string;
  page?: string;
  filters?: string;
  nameType?: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query = params.query || "";
  const page = parseInt(params.page || "1", 10);
  const filters = params.filters || "";
  const nameType = params.nameType || "scientific";

  return (
    <MaxWidthWrapper className="text-center">
      <Header />
      <Suspense fallback={<SearchSkeleton />}>
        <Search
          query={query}
          page={page}
          filters={filters}
          nameType={nameType}
        />
      </Suspense>
    </MaxWidthWrapper>
  );
}

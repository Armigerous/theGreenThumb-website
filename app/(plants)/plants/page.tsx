// app/page.tsx
import { Suspense } from "react";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import Header from "@/components/Database/Header";
import Search from "@/components/Database/Search/Search";
import SearchSkeleton from "@/components/Database/SearchSkeleton";

export const experimental_ppr = true;

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    page?: string;
    filters?: string;
    nameType?: string;
  }>;
}) {
  return (
    <MaxWidthWrapper className="text-center">
      <Header />
      {/* The main page renders immediately.
          The search results are loaded inside SearchWrapper */}
      <Suspense fallback={<SearchSkeleton />}>
        <SearchWrapper searchParams={searchParams} />
      </Suspense>
    </MaxWidthWrapper>
  );
}

// A separate component to handle the async searchParams resolution
async function SearchWrapper({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    page?: string;
    filters?: string;
    nameType?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params.query || "";
  const page = parseInt(params.page || "1", 10);
  const filters = params.filters || "";
  const nameType = params.nameType || "scientific";
  return (
    <Search query={query} page={page} filters={filters} nameType={nameType} />
  );
}

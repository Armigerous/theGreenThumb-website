import { Suspense } from "react";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import Header from "@/components/Database/Header";
import Search from "@/components/Database/Search/Search";

export const experimental_ppr = true;

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string; filters?: string }>;
}) {
  return (
    <MaxWidthWrapper className="text-center">
      <Header />
      {/* The main page renders immediately.
          The search results are loaded inside SearchWrapper */}
      <Suspense fallback={<div>Loading search results...</div>}>
        <SearchWrapper searchParams={searchParams} />
      </Suspense>
    </MaxWidthWrapper>
  );
}

// A separate component to handle the async searchParams resolution
async function SearchWrapper({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string; filters?: string }>;
}) {
  const params = await searchParams;
  const query = params.query || "";
  const page = parseInt(params.page || "1", 10);
  const filters = params.filters || "";

  return <Search query={query} page={page} filters={filters} />;
}

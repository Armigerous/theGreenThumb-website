// app/page.tsx
import { Suspense } from "react";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import Header from "@/components/Database/Header";
import Search from "@/components/Database/Search/Search";
import SearchSkeleton from "@/components/Database/SearchSkeleton";

// Add route segment config
export const dynamic = "force-dynamic";
export const fetchCache = "force-cache";

interface SearchParams {
  query?: string;
  page?: string;
  filters?: string;
  nameType?: string;
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <MaxWidthWrapper className="text-center">
      <Header />
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
  searchParams: Promise<SearchParams>;
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

// app/page.tsx
import { Suspense } from "react";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import Header from "@/components/Database/Header";
import Search from "@/components/Database/Search/Search";

// Add route segment config for optimal streaming
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
      {/* Header renders immediately - no Suspense needed */}
      <Header />

      {/* Search component with Suspense for streaming */}
      <Suspense>
        <SearchWrapper searchParams={searchParams} />
      </Suspense>
    </MaxWidthWrapper>
  );
}

// Separate component to handle async searchParams resolution
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

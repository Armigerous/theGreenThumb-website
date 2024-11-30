import Search from "@/components/Tips/Search";
import SearchResults from "@/components/Tips/SearchResults";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  // Search Query
  const query = (await searchParams).query || "";
  const page = parseInt((await searchParams).page || "1", 10);

  return (
    <>
      <SearchResults query={query} page={page} />
    </>
  );
}

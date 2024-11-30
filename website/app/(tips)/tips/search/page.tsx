import SearchResults from "@/components/Tips/SearchResults";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  // Search Query
  const input = (await searchParams).query || "";
  const page = parseInt((await searchParams).page || "1", 10);

  return (
    <>
      <SearchResults query={input} page={page} />
    </>
  );
}

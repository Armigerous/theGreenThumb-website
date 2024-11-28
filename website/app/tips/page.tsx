import Header from "@/components/Tips/Header";
import Search from "@/components/Tips/Search";

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
      <Header />
      <Search query={query} page={page} />
    </>
  );
}

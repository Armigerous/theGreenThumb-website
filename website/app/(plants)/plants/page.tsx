import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import Header from "@/components/Database/Header";
import Search from "@/components/Database/Search/Search";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const query = (await searchParams).query || "";
  const page = parseInt((await searchParams).page || "1", 10);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/plants?query=${encodeURIComponent(query)}`
  );
  const plants = await response.json();

  return (
    <MaxWidthWrapper className="text-center">
      <Header />
      {/* Plant Database image */}
      <Search query={query} page={page} plants={plants} />
    </MaxWidthWrapper>
  );
}

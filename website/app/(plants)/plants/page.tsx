import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import Header from "@/components/Database/Header";
import Search from "@/components/Database/Search";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const query = (await searchParams).query || "";
  const page = parseInt((await searchParams).page || "1", 10);

  return (
    <MaxWidthWrapper className="text-center">
      <Header />
      {/* Plant Database image */}
      <Search query={query} page={page} />
    </MaxWidthWrapper>
  );
}

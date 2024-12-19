import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import Header from "@/components/Database/Header";
import Search from "@/components/Database/Search/Search";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const query = (await searchParams).query || "";
  const page = parseInt((await searchParams).page || "1", 10);

  return (
    <MaxWidthWrapper className="text-center">
      <Header />
      <Search query={query} page={page} />
    </MaxWidthWrapper>
  );
}

import { Metadata } from "next";
import SearchResults from "@/components/Tips/SearchResults";

export const metadata: Metadata = {
  title: "Search Tips - Gardening Insights",
  description: "Search for gardening tips and tricks tailored to your needs.",
};

export default async function page({
  params,
}: {
  params: Promise<{ query?: string; page?: string }>;
}) {
  const input = (await params).query || "";
  const page = parseInt((await params).page || "1", 10);

  return (
    <>
      <SearchResults query={input} page={page} />
    </>
  );
}

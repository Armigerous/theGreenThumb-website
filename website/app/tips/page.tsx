import { client } from "@/sanity/lib/client";
import { POSTS_QUERY } from "@/sanity/lib/queries";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };
  const tips = await client.fetch(POSTS_QUERY);

  console.log(tips);
  console.log(JSON.stringify(tips, null, 2));

  return (
    <>
      <>
        <h1>Tips</h1>
      </>
    </>
  );
}

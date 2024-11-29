import { client } from "@/sanity/lib/client";
import { POST_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/writeClient";
import { unstable_after as after } from "next/server";

const ViewCounter = async ({ id }: { id: string }) => {
  const { views: totalViews } = await client
    .withConfig({ useCdn: false })
    .fetch(POST_VIEWS_QUERY, { id });

  // Safely destructure the views property
  after(async () => {
    await writeClient
      .patch(id)
      .set({ views: totalViews + 1 })
      .commit();
  });

  return <span>{totalViews}</span>;
};

export default ViewCounter;

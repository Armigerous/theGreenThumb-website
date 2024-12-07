import { writeClient } from "@/sanity/lib/writeClient";
import { after } from "next/server";
import { fetchPostViewsById } from "@/lib/utils";

export const dynamic = "force-static"; // Mark this component as server-side only

const ViewCounter = async ({ id }: { id: string }) => {
  try {
    // Fetch the current views using the utility function
    const { views: totalViews } = await fetchPostViewsById(id);

    // Increment the views after rendering
    after(async () => {
      await writeClient
        .patch(id)
        .set({ views: (totalViews || 0) + 1 }) // Ensure views is safely incremented
        .commit();
    });

    return <span>{totalViews || 0}</span>; // Fallback to 0 if views is undefined
  } catch (error) {
    console.error("Error fetching or updating post views:", error);
    return <span>0</span>; // Show 0 if there's an error
  }
};

export default ViewCounter;

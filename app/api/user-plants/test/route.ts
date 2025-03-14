import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { userGardens } from "@/lib/db/migrations/schema";
import { eq } from "drizzle-orm";

// Route Segment Config
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Test endpoint for user-plants API
 * This route helps with testing the user-plants functionality
 */
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get test garden information
    const gardens = await db.query.userGardens.findMany({
      where: (garden, { eq: equals }) => equals(garden.userId, userId)
    });

    // Create a test garden if none exists
    if (gardens.length === 0) {
      const newGarden = await db.insert(userGardens)
        .values({
          userId,
          name: "Test Garden",
          specificPlantIds: ["test-plant-1", "test-plant-2"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning();

      return NextResponse.json({
        message: "Created a test garden",
        garden: newGarden[0]
      });
    }

    // Add a test plant to the first garden if it doesn't have one
    const firstGarden = gardens[0];
    const currentPlantIds = (firstGarden.specificPlantIds as string[]) || [];
    
    if (!currentPlantIds.includes("test-plant-3")) {
      const updatedPlantIds = [...currentPlantIds, "test-plant-3"];
      
      const updatedGarden = await db.update(userGardens)
        .set({
          specificPlantIds: updatedPlantIds,
          updatedAt: new Date().toISOString()
        })
        .where(eq(userGardens.id, firstGarden.id))
        .returning();

      return NextResponse.json({
        message: "Added a test plant to the garden",
        garden: updatedGarden[0]
      });
    }

    // Return test data
    return NextResponse.json({
      message: "Test data already exists",
      gardens,
      testInfo: {
        endpoint: "/api/user-plants",
        availableActions: {
          get: "GET /api/user-plants - Get all user gardens and plants",
          getGarden: "GET /api/user-plants?gardenId=1 - Get a specific garden",
          addPlant: "POST /api/user-plants - Add a plant with X-Action: add-plant",
          removePlant: "POST /api/user-plants - Remove a plant with X-Action: remove-plant",
          updatePlants: "POST /api/user-plants - Update all plants with X-Action: update"
        }
      }
    });
  } catch (error) {
    console.error("Error in user-plants test route:", error);
    return NextResponse.json(
      { error: "Test endpoint failed", details: (error as Error).message },
      { status: 500 }
    );
  }
} 
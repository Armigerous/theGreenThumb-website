import { db } from "@/lib/db";
import { userGardens } from "@/lib/db/migrations/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Route Segment Config
export const dynamic = 'force-dynamic'; // Always fetch fresh data for user-specific content
export const revalidate = 0; // Disable static caching

// Validation schemas
const AddPlantSchema = z.object({
  gardenId: z.number(),
  plantId: z.string()
});

const RemovePlantSchema = z.object({
  gardenId: z.number(),
  plantId: z.string()
});

const UpdatePlantsSchema = z.object({
  gardenId: z.number(),
  plantIds: z.array(z.string())
});

// Plant interface to properly type our response
interface Plant {
  id: string;
  gardenId: number;
  customName: string;
  botanicalName: string;
  status: string;
  careLogs: Record<string, unknown>[];
  images: { url: string; altText?: string }[];
  locationTags: string[];
  createdAt: string;
  updatedAt: string;
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const url = new URL(request.url);
    const userIdParam = url.searchParams.get("userId");
    const gardenIdParam = url.searchParams.get("gardenId");
    
    // Check if the requested userId matches the authenticated user
    if (userIdParam && userIdParam !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Fetch user gardens
    let gardens = [];
    
    if (gardenIdParam) {
      // If gardenId is provided, only fetch that specific garden
      const garden = await db.query.userGardens.findFirst({
        where: (garden, { eq: equals, and: andCondition }) => 
          andCondition(
            equals(garden.userId, userId),
            equals(garden.id, parseInt(gardenIdParam))
          )
      });
      
      if (!garden) {
        return NextResponse.json({ error: "Garden not found" }, { status: 404 });
      }
      
      gardens = [garden];
    } else {
      // Otherwise fetch all gardens
      gardens = await db.query.userGardens.findMany({
        where: (garden, { eq: equals }) => equals(garden.userId, userId)
      });
    }
    
    if (!gardens.length) {
      return NextResponse.json({ gardens: [], plants: [] });
    }
    
    // Will be used for future implementation with userPlants table
    // const gardenIds = gardens.map(garden => garden.id);
    
    // Fetch plants for all user gardens (adding this in anticipation of userPlants implementation)
    const plants: Plant[] = [];
    
    // Prepare response
    const userGardensResponse = {
      gardens,
      plants
    };
    
    return NextResponse.json(userGardensResponse, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error("Error fetching user plants:", error);
    return NextResponse.json(
      { error: "Failed to fetch user plants data" },
      { status: 500 }
    );
  }
}

// Add a plant to a garden
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await request.json();
    const action = request.headers.get("X-Action") || "update"; // Default action is "update"
    
    // Handle different actions based on the X-Action header
    switch (action) {
      case "add-plant": {
        // Add single plant to garden
        const validationResult = AddPlantSchema.safeParse(data);
        if (!validationResult.success) {
          return NextResponse.json(
            { error: "Invalid data", details: validationResult.error.format() },
            { status: 400 }
          );
        }
        
        const { gardenId, plantId } = validationResult.data;
        
        // Verify garden ownership
        const garden = await db.query.userGardens.findFirst({
          where: (gardens, { eq: equals, and: andCondition }) => 
            andCondition(
              equals(gardens.userId, userId),
              equals(gardens.id, gardenId)
            )
        });
        
        if (!garden) {
          return NextResponse.json({ error: "Garden not found" }, { status: 404 });
        }
        
        // Add plant to the specificPlantIds array if not already there
        const currentPlantIds = (garden.specificPlantIds as string[]) || [];
        if (!currentPlantIds.includes(plantId)) {
          const updatedPlantIds = [...currentPlantIds, plantId];
          
          const updatedGarden = await db.update(userGardens)
            .set({
              specificPlantIds: updatedPlantIds,
              updatedAt: new Date().toISOString()
            })
            .where(eq(userGardens.id, gardenId))
            .returning();
          
          revalidatePath('/api/user-plants');
          
          return NextResponse.json({ garden: updatedGarden[0] });
        } else {
          return NextResponse.json({ message: "Plant already in garden", garden });
        }
      }
      
      case "remove-plant": {
        // Remove single plant from garden
        const validationResult = RemovePlantSchema.safeParse(data);
        if (!validationResult.success) {
          return NextResponse.json(
            { error: "Invalid data", details: validationResult.error.format() },
            { status: 400 }
          );
        }
        
        const { gardenId, plantId } = validationResult.data;
        
        // Verify garden ownership
        const garden = await db.query.userGardens.findFirst({
          where: (gardens, { eq: equals, and: andCondition }) => 
            andCondition(
              equals(gardens.userId, userId),
              equals(gardens.id, gardenId)
            )
        });
        
        if (!garden) {
          return NextResponse.json({ error: "Garden not found" }, { status: 404 });
        }
        
        // Remove plant from the specificPlantIds array
        const currentPlantIds = (garden.specificPlantIds as string[]) || [];
        const updatedPlantIds = currentPlantIds.filter(id => id !== plantId);
        
        const updatedGarden = await db.update(userGardens)
          .set({
            specificPlantIds: updatedPlantIds,
            updatedAt: new Date().toISOString()
          })
          .where(eq(userGardens.id, gardenId))
          .returning();
        
        revalidatePath('/api/user-plants');
        
        return NextResponse.json({ garden: updatedGarden[0] });
      }
      
      case "update": 
      default: {
        // Update all plants in garden (replace entire array)
        const validationResult = UpdatePlantsSchema.safeParse(data);
        if (!validationResult.success) {
          return NextResponse.json(
            { error: "Invalid data", details: validationResult.error.format() },
            { status: 400 }
          );
        }
        
        const { gardenId, plantIds } = validationResult.data;
        
        // Verify garden ownership
        const garden = await db.query.userGardens.findFirst({
          where: (gardens, { eq: equals, and: andCondition }) => 
            andCondition(
              equals(gardens.userId, userId),
              equals(gardens.id, gardenId)
            )
        });
        
        if (!garden) {
          return NextResponse.json({ error: "Garden not found" }, { status: 404 });
        }
        
        // Update garden with new plant IDs
        const updatedGarden = await db.update(userGardens)
          .set({
            specificPlantIds: plantIds,
            updatedAt: new Date().toISOString()
          })
          .where(eq(userGardens.id, gardenId))
          .returning();
        
        revalidatePath('/api/user-plants');
        
        return NextResponse.json({ garden: updatedGarden[0] });
      }
    }
  } catch (error) {
    console.error("Error updating user plants:", error);
    return NextResponse.json(
      { error: "Failed to update user plants data" },
      { status: 500 }
    );
  }
}

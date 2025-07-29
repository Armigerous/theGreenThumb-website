import { db } from "@/lib/db";
import { userPlants } from "@/lib/db/migrations/schema";
import { getUserId, handleUnauthorizedResponse } from "@/lib/auth-utils";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { userPlantsSchema } from "@/lib/validations/user-plants";

// Route Segment Config
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return handleUnauthorizedResponse();
    }
    
    const { searchParams } = new URL(request.url);
    const gardenId = searchParams.get('gardenId');
    
    if (!gardenId) {
      return NextResponse.json(
        { error: "Garden ID is required" },
        { status: 400 }
      );
    }
    
    // Convert gardenId to number for database query
    const gardenIdNum = parseInt(gardenId, 10);
    if (isNaN(gardenIdNum)) {
      return NextResponse.json(
        { error: "Invalid garden ID format" },
        { status: 400 }
      );
    }
    
    // Verify the garden belongs to the user
    const garden = await db.query.userGardens.findFirst({
      where: (gardens, { eq, and }) => 
        and(
          eq(gardens.userId, userId),
          eq(gardens.id, gardenIdNum)
        )
    });
    
    if (!garden) {
      return NextResponse.json({ error: "Garden not found" }, { status: 404 });
    }
    
    // Fetch all plants for this garden
    const plants = await db.query.userPlants.findMany({
      where: (plants, { eq }) => eq(plants.gardenId, gardenIdNum),
      orderBy: (plants, { desc }) => [desc(plants.createdAt)]
    });
    
    return NextResponse.json({ plants }, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error("Error fetching plant tracking:", error);
    return NextResponse.json(
      { error: "Failed to fetch plant tracking data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return handleUnauthorizedResponse();
    }
    
    const data = await request.json();
    
    // Validate data schema
    const validationResult = userPlantsSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const plantData = validationResult.data;
    
    // Verify the garden belongs to the user
    const garden = await db.query.userGardens.findFirst({
      where: (gardens, { eq, and }) => 
        and(
          eq(gardens.userId, userId),
          eq(gardens.id, plantData.gardenId)
        )
    });
    
    if (!garden) {
      return NextResponse.json({ error: "Garden not found" }, { status: 404 });
    }
    
    // Create new plant tracking entry
    const newPlant = await db.insert(userPlants).values({
      id: plantData.id || crypto.randomUUID(),
      gardenId: plantData.gardenId,
      customName: plantData.customName,
      botanicalName: plantData.botanicalName || plantData.scientificName || '',
      status: plantData.status || 'active',
      careLogs: plantData.careLogs || [],
      images: plantData.images || [],
      locationTags: plantData.locationTags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }).returning();
    
    revalidatePath('/api/plant-tracking');
    
    return NextResponse.json({ plant: newPlant[0] }, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error("Error creating plant tracking:", error);
    return NextResponse.json(
      { error: "Failed to create plant tracking data" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return handleUnauthorizedResponse();
    }
    
    const data = await request.json();
    
    // Validate data schema
    const validationResult = userPlantsSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const plantData = validationResult.data;
    
    // Ensure plant ID exists for updates
    if (!plantData.id) {
      return NextResponse.json(
        { error: "Plant ID is required for updates" },
        { status: 400 }
      );
    }
    
    // Verify the garden belongs to the user
    const garden = await db.query.userGardens.findFirst({
      where: (gardens, { eq, and }) => 
        and(
          eq(gardens.userId, userId),
          eq(gardens.id, plantData.gardenId)
        )
    });
    
    if (!garden) {
      return NextResponse.json({ error: "Garden not found" }, { status: 404 });
    }
    
    // Update plant tracking entry
    const updateData: Partial<{
      customName: string;
      botanicalName: string;
      status: string;
      careLogs: unknown[];
      images: unknown[];
      locationTags: unknown[];
      updatedAt: string;
    }> = {
      updatedAt: new Date().toISOString()
    };
    
    if (plantData.customName) updateData.customName = plantData.customName;
    if (plantData.status) updateData.status = plantData.status;
    if (plantData.careLogs) updateData.careLogs = plantData.careLogs;
    if (plantData.images) updateData.images = plantData.images;
    if (plantData.locationTags) updateData.locationTags = plantData.locationTags;
    if (plantData.botanicalName || plantData.scientificName) {
      updateData.botanicalName = plantData.botanicalName || plantData.scientificName;
    }
    
    const updatedPlant = await db.update(userPlants)
      .set(updateData)
      .where(eq(userPlants.id, plantData.id))
      .returning();
    
    if (updatedPlant.length === 0) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }
    
    revalidatePath('/api/plant-tracking');
    
    return NextResponse.json({ plant: updatedPlant[0] }, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error("Error updating plant tracking:", error);
    return NextResponse.json(
      { error: "Failed to update plant tracking data" },
      { status: 500 }
    );
  }
} 
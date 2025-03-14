import { db } from "@/lib/db";
import { userPlants } from "@/lib/db/migrations/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Route Segment Config
export const dynamic = 'force-dynamic'; // Always fetch fresh data for user-specific content
export const revalidate = 0; // Disable static caching

// Validation schema for plant tracking
const userPlantsSchema = z.object({
  id: z.string().optional(), // Optional for creation, required for updates
  gardenId: z.number(),
  customName: z.string().min(1, "Custom name is required"),
  botanicalName: z.string().min(1, "Botanical name is required"),
  status: z.enum(["healthy", "warning", "critical", "dormant"]),
  careLogs: z.array(z.object({
    date: z.string(),
    type: z.enum(["water", "fertilize", "prune", "treatment"]),
    notes: z.string(),
    images: z.array(z.string()).optional()
  })).optional().default([]),
  images: z.array(z.object({
    url: z.string(),
    isPrimary: z.boolean(),
    uploadedAt: z.string()
  })).optional().default([]),
  locationTags: z.array(z.string()).optional().default([])
});

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const url = new URL(request.url);
    const gardenId = url.searchParams.get("gardenId");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    
    // Verify the garden belongs to the user
    const garden = await db.query.userGardens.findFirst({
      where: (gardens, { eq, and }) => 
        and(
          eq(gardens.userId, userId),
          gardenId ? eq(gardens.id, parseInt(gardenId)) : undefined
        )
    });
    
    if (gardenId && !garden) {
      return NextResponse.json({ error: "Garden not found" }, { status: 404 });
    }
    
    // Fetch plants for this garden
    let plants = [];
    if (gardenId) {
      // If gardenId is provided, find all plants for that garden
      plants = await db.query.userPlants.findMany({
        where: (plant, { eq }) => eq(plant.gardenId, parseInt(gardenId)),
        limit: limit,
        offset: offset
      });
    } else {
      // Otherwise find all plants from all gardens owned by the user
      const userGardensData = await db.query.userGardens.findMany({
        where: (garden, { eq }) => eq(garden.userId, userId),
        with: {
          plants: {
            limit: limit,
            offset: offset
          }
        }
      });
      
      // Flatten the plants from all gardens
      plants = userGardensData.flatMap(garden => garden.plants || []);
    }
    
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
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      where: (gardens, { eq }) => 
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
      botanicalName: plantData.botanicalName,
      status: plantData.status,
      careLogs: plantData.careLogs,
      images: plantData.images,
      locationTags: plantData.locationTags,
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
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    
    if (!plantData.id) {
      return NextResponse.json({ error: "Plant ID is required" }, { status: 400 });
    }
    
    // Verify the garden belongs to the user
    const garden = await db.query.userGardens.findFirst({
      where: (gardens, { eq }) => 
        and(
          eq(gardens.userId, userId),
          eq(gardens.id, plantData.gardenId)
        )
    });
    
    if (!garden) {
      return NextResponse.json({ error: "Garden not found" }, { status: 404 });
    }
    
    // Verify the plant exists and belongs to this garden
    const existingPlant = await db.query.userPlants.findFirst({
      where: (plants, { eq, and }) => 
        and(
          eq(plants.id, plantData.id as string),
          eq(plants.gardenId, plantData.gardenId)
        )
    });
    
    if (!existingPlant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }
    
    // Update plant tracking entry
    const updatedPlant = await db.update(userPlants)
      .set({
        customName: plantData.customName,
        botanicalName: plantData.botanicalName,
        status: plantData.status,
        careLogs: plantData.careLogs,
        images: plantData.images,
        locationTags: plantData.locationTags,
        updatedAt: new Date().toISOString()
      })
      .where(eq(userPlants.id, plantData.id as string))
      .returning();
    
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
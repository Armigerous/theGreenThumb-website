import { prisma } from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Update Plant Schema
 * 
 * Reason: Validation schema for updating plant information
 * following proper data validation patterns
 */
const UpdatePlantSchema = z.object({
  customName: z.string().min(1, "Custom name is required").optional(),
  plantId: z.number().min(1, "Plant ID is required").optional(),
  status: z.enum(["healthy", "warning", "critical", "dormant"]).optional(),
  careLogs: z.array(z.object({
    date: z.string(),
    type: z.enum(["water", "fertilize", "prune", "treatment"]),
    notes: z.string(),
    images: z.array(z.string()).optional()
  })).optional(),
  images: z.array(z.object({
    url: z.string(),
    isPrimary: z.boolean(),
    uploadedAt: z.string()
  })).optional(),
  locationTags: z.array(z.string()).optional()
});

/**
 * GET /api/user-plants/[id]
 * 
 * Reason: Fetch individual plant details for user plant management
 * with proper authentication and ownership verification
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: plantId } = await params;

    const plant = await prisma.user_plants.findFirst({
      where: { 
        id: plantId,
        user_gardens: { user_id: userId }
      },
      include: {
        user_gardens: {
          select: {
            id: true,
            name: true,
            user_id: true
          }
        }
      }
    });

    if (!plant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    return NextResponse.json({ plant });
  } catch (error) {
    console.error("Error fetching plant details:", error);
    return NextResponse.json(
      { error: "Failed to fetch plant details" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user-plants/[id]
 * 
 * Reason: Update plant information with proper validation
 * and ownership verification
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: plantId } = await params;
    const data = await request.json();
    
    const validationResult = UpdatePlantSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const plantData = validationResult.data;

    // Reason: Verify plant ownership before updating
    const existingPlant = await prisma.user_plants.findFirst({
      where: { 
        id: plantId,
        user_gardens: { user_id: userId }
      }
    });

    if (!existingPlant) {
      return NextResponse.json({ error: "Plant not found or unauthorized" }, { status: 404 });
    }

    const updatedPlant = await prisma.user_plants.update({
      where: { id: plantId },
      data: {
        ...(plantData.customName && { nickname: plantData.customName }),
        ...(plantData.plantId && { plant_id: plantData.plantId }),
        ...(plantData.careLogs && { care_logs: plantData.careLogs }),
        ...(plantData.images && { images: plantData.images }),
      }
    });

    revalidatePath(`/api/user-plants/${plantId}`);
    return NextResponse.json({ plant: updatedPlant });
  } catch (error) {
    console.error("Error updating plant:", error);
    return NextResponse.json(
      { error: "Failed to update plant data" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user-plants/[id]
 * 
 * Reason: Delete plant with proper authentication and ownership verification
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: plantId } = await params;

    // Reason: Verify plant ownership before deleting
    const existingPlant = await prisma.user_plants.findFirst({
      where: { 
        id: plantId,
        user_gardens: { user_id: userId }
      }
    });

    if (!existingPlant) {
      return NextResponse.json({ error: "Plant not found or unauthorized" }, { status: 404 });
    }

    await prisma.user_plants.delete({
      where: { id: plantId }
    });

    revalidatePath(`/api/user-plants/${plantId}`);
    return NextResponse.json({ message: "Plant deleted successfully" });
  } catch (error) {
    console.error("Error deleting plant:", error);
    return NextResponse.json(
      { error: "Failed to delete plant" },
      { status: 500 }
    );
  }
}

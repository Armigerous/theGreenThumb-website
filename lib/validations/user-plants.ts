import { z } from "zod";

export const userPlantsSchema = z.object({
  id: z.string().optional(),
  customName: z.string().min(1, "Plant name is required"),
  scientificName: z.string().optional(),
  botanicalName: z.string().optional(),
  gardenId: z.number(),
  status: z.string().optional(),
  images: z.array(z.object({
    id: z.number().optional(),
    url: z.string().url("Invalid image URL"),
    altText: z.string().optional(),
  })).optional(),
  careLogs: z.array(z.object({
    id: z.number().optional(),
    action: z.string(),
    notes: z.string().optional(),
    date: z.date(),
  })).optional(),
  locationTags: z.array(z.string()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type UserPlant = z.infer<typeof userPlantsSchema>;
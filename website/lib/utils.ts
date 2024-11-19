import { clsx, type ClassValue } from "clsx";
import { remark } from "remark";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchPlantData(slug: string) {
  const response = await fetch(
    `https://plants.ces.ncsu.edu/api/plants/${slug}/?format=json`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch plant data");
  }
  return await response.json();
}

export async function validateMDX(content: string): Promise<boolean> {
  try {
    await remark().process(content);
    return true; // Valid content
  } catch (error) {
    console.error("MDX validation error:", error);
    return false; // Invalid content
  }
}

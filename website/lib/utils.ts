import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ALL_POSTS_TITLES_QUERY, POSTS_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
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

export async function fetchSearchResults(
  query?: string,
  limit = 28,
  offset = 0
) {
  const API_URL = query
    ? `https://plants.ces.ncsu.edu/api/plants/?format=json&limit=${limit}&offset=${offset}&q=${encodeURIComponent(
        query
      )}`
    : `https://plants.ces.ncsu.edu/api/plants/?format=json&limit=${limit}&offset=${offset}`;

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch search results: ${response.status}`);
  }

  return await response.json();
}

export async function fetchAllPlants() {
  const response = await fetch(
    "https://plants.ces.ncsu.edu/api/all_plants/?format=json"
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch plants: ${response.status}`);
  }

  return await response.json();
}

export async function fetchTips() {
  // Fetch Tips
  const tips = await client.fetch(POSTS_QUERY);

  return tips;
}

export async function fetchTipBySlug(slug: string) {
  const tip = await client.fetch(POSTS_QUERY, { slug });
  return tip;
}

export async function fetchTipsByCategory(category: string) {
  const tips = await client.fetch(POSTS_QUERY, { category });
  return tips;
}

export async function fetchAllTipTitles() {
  try {
    const tips = await client.fetch(ALL_POSTS_TITLES_QUERY);
    return tips; // Extract and return just the titles
  } catch (error) {
    console.error("Error fetching titles:", error);
    throw new Error("Failed to fetch titles");
  }
}

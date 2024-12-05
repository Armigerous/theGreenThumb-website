import { client } from "@/sanity/lib/client";
import {
  ALL_CATEGORIES_QUERY,
  ALL_POSTS_SLUGS_QUERY,
  ALL_POSTS_TITLES_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  LATEST_SIX_POSTS_QUERY,
  PAGINATED_POSTS_QUERY,
  POST_BY_SLUG_QUERY,
  POST_VIEWS_QUERY,
} from "@/sanity/lib/queries";
import { TipCategory } from "@/types/Tip";
import { clsx, type ClassValue } from "clsx";
import { cache } from "react";
import { twMerge } from "tailwind-merge";

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

export const fetchPlantData = cache(async (slug: string) => {
  const response = await fetch(
    `https://plants.ces.ncsu.edu/api/plants/${slug}/?format=json`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch plant data");
  }
  return await response.json();
});

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

export const fetchAllPlants = cache(async () => {
  const response = await fetch(
    "https://plants.ces.ncsu.edu/api/all_plants/?format=json"
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch plants: ${response.status}`);
  }

  return await response.json();
});

export const fetchAllTipTitles = cache(async () => {
  try {
    const tips = await client.fetch(ALL_POSTS_TITLES_QUERY);
    return tips; // Extract and return just the titles
  } catch (error) {
    console.error("Error fetching titles:", error);
    throw new Error("Failed to fetch titles");
  }
});

export const fetchAllTipCategories = cache(async () => {
  try {
    const categories = await client.fetch(ALL_CATEGORIES_QUERY);
    return categories; // Extract and return just the titles
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
});

type SlugArray = { slug: string }[];
export const fetchAllTipSlugs = cache(async (): Promise<SlugArray> => {
  try {
    return await client.fetch(ALL_POSTS_SLUGS_QUERY);
  } catch (error) {
    console.error("Error fetching slugs:", error);
    throw new Error("Failed to fetch slugs");
  }
});

export async function fetchPostViewsById(id: string) {
  try {
    return await client
      .withConfig({ useCdn: false })
      .fetch(POST_VIEWS_QUERY, { id });
  } catch (error) {
    console.error("Error fetching post views:", error);
    throw new Error("Failed to fetch post views");
  }
}

export async function fetchPaginatedPosts(
  start: number,
  end: number,
  input: string = ""
) {
  try {
    const data = await client.fetch(PAGINATED_POSTS_QUERY, {
      start,
      end,
      input,
    });
    return {
      tips: data.posts,
      totalCount: data.totalCount,
    };
  } catch (error) {
    console.error("Error fetching paginated posts:", error);
    throw new Error("Failed to fetch paginated posts");
  }
}

export async function fetchLastSixPosts() {
  try {
    return await client.fetch(LATEST_SIX_POSTS_QUERY);
  } catch (error) {
    console.error("Error fetching last six posts:", error);
    throw new Error("Failed to fetch last six posts");
  }
}

export async function fetchTipBySlug(slug: string) {
  try {
    const tip = await client.fetch(POST_BY_SLUG_QUERY, { slug });
    return tip;
  } catch (error) {
    console.error("Error fetching tip by slug:", error);
    throw new Error("Failed to fetch tip by slug");
  }
}

export const fetchCategoryBySlug = cache(
  async (slug: string): Promise<TipCategory> => {
    try {
      const category: TipCategory = await client.fetch(CATEGORY_BY_SLUG_QUERY, {
        slug,
      });
      if (!category) {
        throw new Error(`Category with slug "${slug}" not found.`);
      }
      return category;
    } catch (error) {
      console.error("Error fetching category by slug:", error);
      throw new Error("Failed to fetch category information.");
    }
  }
);

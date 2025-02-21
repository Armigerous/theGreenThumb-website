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
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatInchesToFeetAndInches(
  inches: number | undefined
): string {
  if (inches === undefined) {
    return "N/A"; // Or any default value you'd like to display
  }
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet} ft. ${remainingInches} in.`;
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export const fetchAllTipTitles = cache(async () => {
  try {
    const tips = await client.fetch(ALL_POSTS_TITLES_QUERY);
    return tips; // Extract and return just the titles
  } catch (error) {
    console.error("Error fetching titles:", error);
    throw new Error("Failed to fetch titles");
  }
});

export const fetchAllTipCategories = unstable_cache(
  async () => {
    try {
      const categories = await client.fetch(ALL_CATEGORIES_QUERY);
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories");
    }
  },
  ["tip-categories"],
  {
    revalidate: 86400, // 24 hours
    tags: ["categories"],
  }
);
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

export const fetchPaginatedPosts = unstable_cache(
  async (start: number, end: number, input: string = "") => {
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
  },
  ["paginated-posts"],
  {
    revalidate: 3600,
    tags: ["posts"],
  }
);

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

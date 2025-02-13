// eslint-disable-next-line
const { createClient } = require("@supabase/supabase-js");

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl:
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.theofficialgreenthumb.com",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/studio", "/api"],
  additionalPaths: async (config) => {
    // Create a Supabase client using your server-side keys
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

    if (!supabaseUrl) {
      throw new Error("SUPABASE_URL is not set in environment variables.");
    }

    if (!supabaseKey) {
      throw new Error("SUPABASE_KEY is not set in environment variables.");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the plant slugs from your Supabase table.
    // Option 1: Fetch common slugs (which will be redirected by your middleware)
    const { data, error } = await supabase
      .from("plant_common_card_data")
      .select("slug");

    // Option 2: If you prefer to list the canonical URLs (the scientific slugs), use:
    // const { data, error } = await supabase
    //   .from("plant_common_card_data")
    //   .select("scientific_slug");

    if (error) {
      console.error("Error fetching plant slugs for sitemap:", error);
      return [];
    }
    if (!data) return [];

    // Map the fetched slugs to sitemap paths.
    // If using Option 1, use plant.slug; if using Option 2, use plant.scientific_slug.
    return data.map((plant) => {
      const slugPath = plant.slug; // Change to plant.scientific_slug if needed.
      return config.transform(config, `/plant/${slugPath}`);
    });
  },
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
    additionalSitemaps: [`${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`],
  },
};

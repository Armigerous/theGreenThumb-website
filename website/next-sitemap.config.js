// eslint-disable-next-line
const { createClient } = require("@supabase/supabase-js");

module.exports = {
  siteUrl:
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.theofficialgreenthumb.com",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/studio", "/api"],
  additionalPaths: async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Changed to service key

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials!");
      return [];
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("plant_common_card_data")
      .select("slug");

    if (error) {
      console.error("Supabase error:", error);
      return [];
    }

    return data.map((plant) => {
      const path = `/plant/${plant.slug}`;
      return {
        loc: path,
        changefreq: "weekly",
        priority: 0.7,
        lastmod: new Date().toISOString(),
      };
    });
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/api/*", "/admin/*"],
      },
    ],
    additionalSitemaps: [`${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`],
  },
};

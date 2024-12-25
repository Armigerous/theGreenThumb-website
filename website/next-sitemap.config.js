module.exports = {
  siteUrl:
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.theofficialgreenthumb.com",
  generateRobotsTxt: true, // Generate robots.txt file
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" }, // Allow all bots to crawl the entire site
      { userAgent: "Googlebot", disallow: "/admin" },
    ],
    sitemapSize: 5000, // Limit the number of URLs per sitemap
    additionalSitemaps: [
      "https://www.theofficialgreenthumb.com/blog-sitemap.xml",
      "https://www.theofficialgreenthumb.com/category-sitemap.xml",
    ],
  },
};

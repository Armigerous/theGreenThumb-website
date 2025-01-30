module.exports = {
  siteUrl:
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.theofficialgreenthumb.com",
  generateRobotsTxt: true, // Generate robots.txt file
  sitemapSize: 20000, // Limit the number of URLs per sitemap
  changefreq: "daily", // Default change frequency
  priority: 0.7, // Default priority
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" }, // Allow all bots to crawl the entire site
      { userAgent: "Googlebot", disallow: "/admin" }, // Disallow Googlebot from /admin
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
      // `${process.env.NEXT_PUBLIC_BASE_URL}/blog-sitemap.xml`,
      // `${process.env.NEXT_PUBLIC_BASE_URL}/category-sitemap.xml`,
      // `${process.env.NEXT_PUBLIC_BASE_URL}/tips-and-tricks-sitemap.xml`,
    ],
  },
};

// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
      {
        source: "/api/og",
        headers: [
          {
            key: "Access-Control-Allow-Methods",
            value: "GET",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
  experimental: {
    ppr: "incremental",
    optimizePackageImports: [
      "lucide-react", 
      "@tanstack/react-virtual", 
      "framer-motion",
      "lottie-react",
      "react-icons"
    ],
    optimizeCss: true, // Enable CSS optimization
  },
  // Reason: Moved from deprecated experimental.turbo to new turbopack config
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  // Reason: Optimize build performance and enable better caching
  compress: true,
  poweredByHeader: false,
  transpilePackages: ["next-mdx-remote"],
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.theofficialgreenthumb.com",
      },
      {
        protocol: "https",
        hostname: "eit-planttoolbox-prod.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year cache for better performance
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Reason: Optimize image loading for better LCP performance
    loader: "default",
    unoptimized: true, // Reason: Disable Vercel image optimization to prevent quota exhaustion
  },
};

export default nextConfig;

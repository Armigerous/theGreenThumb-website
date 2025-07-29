// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for Next.js 15
  experimental: {
    // Partial Prerendering for better performance
    ppr: "incremental",
    // Enable React 19 features
    reactCompiler: true,
    // Optimize bundle size
    optimizePackageImports: ["@radix-ui/react-icons", "lucide-react"],
  },
  
  // Transpile packages that need it
  transpilePackages: ["next-mdx-remote"],
  
  // Configure headers for API routes
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
  
  // Image optimization configuration for Vercel limit management
  images: {
    // Allow SVG images
    dangerouslyAllowSVG: true,
    
    // Configure remote image sources
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
    ],
    
    // Conservative device sizes to reduce optimization overhead
    deviceSizes: [640, 750, 828, 1080, 1200],
    
    // Minimal image sizes to preserve Vercel limit
    imageSizes: [16, 32, 48, 64, 96, 128],
    
    // Modern formats for better compression
    formats: ["image/avif", "image/webp"],
    
    // Extended cache TTL to reduce repeated optimizations
    minimumCacheTTL: 7200, // 2 hours
    
    // Disable unoptimized for control
    unoptimized: false,
    
    // Add content security policy for images
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Performance optimizations
  swcMinify: true,
  
  // Enable compression
  compress: true,
  
  // Configure webpack for better performance
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size in production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    
    return config;
  },
};

export default nextConfig;

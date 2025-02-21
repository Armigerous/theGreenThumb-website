import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import NavBar from "@/components/NavBar/NavBar";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_BASE_URL
    ? new URL(process.env.NEXT_PUBLIC_BASE_URL)
    : undefined, // Handle undefined safely
  title: "The GreenThumb - Gardening and Horticulture in North Carolina",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL,
  },

  description:
    "Your ultimate guide to gardening, local plants in North Carolina, horticulture, and sustainable agriculture. Learn and grow with The GreenThumb.",
  keywords: [
    "gardening",
    "local plants North Carolina",
    "horticulture",
    "agriculture",
    "sustainable farming",
    "GreenThumb",
    "gardening tips",
    "plant care",
  ],
  openGraph: {
    title: "The GreenThumb - Gardening and Horticulture in North Carolina",
    description:
      "Explore the best gardening tips, local plants in North Carolina, and horticulture practices. Join The GreenThumb for sustainable agriculture insights.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "GreenThumb banner - Gardening and horticulture insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The GreenThumb - Gardening & Horticulture in NC",
    description:
      "Discover expert gardening tips and insights on local plants in North Carolina. Join The GreenThumb community for all things horticulture and agriculture.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "GreenThumb banner - Gardening and horticulture insights",
      },
    ],
  },
  robots: {
    index: true, // Allow the page to be indexed
    follow: true, // Allow links on the page to be followed
    noarchive: false, // Archive the page in search engines
    nosnippet: false, // Allow text snippets in search results
    notranslate: false, // Allow Google to offer translation
    noimageindex: false, // Allow image indexing
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-cream-50`}
      >
        <NavBar />
        {children}
        <Analytics />
        <SpeedInsights />
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-25E3VTSFMZ" />
    </html>
  );
}

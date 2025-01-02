import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import NavBar from "@/components/NavBar/NavBar";
import Footer from "@/components/Footer";

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
  title: "The GreenThumb",
  description: "Merging the worlds of technology and agriculture",
  keywords: ["technology", "agriculture", "GreenThumb", "sustainable farming"],
  openGraph: {
    title: "The GreenThumb",
    description:
      "Discover how technology meets agriculture with The GreenThumb.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "GreenThumb banner",
      },
    ],
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
    </html>
  );
}

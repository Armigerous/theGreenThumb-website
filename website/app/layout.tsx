import type { Metadata } from "next";
import localFont from "next/font/local";
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
  title: "The GreenThumb",
  description: "Merging the worlds of technology and agriculture",
  keywords: ["technology", "agriculture", "GreenThumb", "sustainable farming"],
  openGraph: {
    title: "The GreenThumb",
    description:
      "Discover how technology meets agriculture with The GreenThumb.",
    url: "https://yourwebsite.com",
    images: [
      {
        url: "https://yourwebsite.com/images/og-image.jpg",
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
        <Footer />
      </body>
    </html>
  );
}

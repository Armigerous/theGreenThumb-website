import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar/NavBar";
import { Toaster } from "@/components/ui/sonner";
import CoreWebVitalsMonitor from "@/components/Performance/CoreWebVitalsMonitor";
import { ClerkProvider } from "@clerk/nextjs";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Mali, Nunito } from "next/font/google";
import "./globals.css";

// Reason: Enable Partial Prerendering for optimal NavBar performance across navigation
export const experimental_ppr = true;

// Reason: Import brand-specified fonts from Google Fonts with optimal loading strategy
const mali = Mali({
	subsets: ["latin"],
	weight: ["400", "700"],
	variable: "--font-mali",
	display: "swap", // Reason: Optimize font loading performance
});

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "600", "700"],
	variable: "--font-nunito",
	display: "swap", // Reason: Optimize font loading performance
});

export const metadata: Metadata = {
	metadataBase: process.env.NEXT_PUBLIC_BASE_URL
		? new URL(process.env.NEXT_PUBLIC_BASE_URL)
		: undefined, // Handle undefined safely
	title: "GreenThumb - Gardening and Horticulture in North Carolina",
	alternates: {
		canonical: process.env.NEXT_PUBLIC_BASE_URL,
	},

	description:
		"Your ultimate guide to gardening, local plants in North Carolina, horticulture, and sustainable agriculture. Learn and grow with GreenThumb.",
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
		title: "GreenThumb - Gardening and Horticulture in North Carolina",
		description:
			"Explore the best gardening tips, local plants in North Carolina, and horticulture practices. Join GreenThumb for sustainable agriculture insights.",
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
		title: "GreenThumb - Gardening & Horticulture in NC",
		description:
			"Discover expert gardening tips and insights on local plants in North Carolina. Join GreenThumb community for all things horticulture and agriculture.",
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
		<ClerkProvider
			appearance={{
				baseTheme: undefined,
			}}
			publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
		>
			<html lang="en" className="scroll-smooth">
				<body
					className={`${mali.variable} ${nunito.variable} antialiased bg-cream-50`}
				>
					<NavBar />
					{children}
					<Analytics />
					<SpeedInsights />
					<CoreWebVitalsMonitor />
					<Footer />
					<Toaster />
				</body>
				<GoogleAnalytics gaId="G-25E3VTSFMZ" />
			</html>
		</ClerkProvider>
	);
}

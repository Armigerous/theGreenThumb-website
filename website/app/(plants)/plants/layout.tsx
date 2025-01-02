import { Metadata } from "next";
import { FilterPanel } from "@/components/Database/Filter/FilterPanel";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Plants Database - GreenThumb",
  description:
    "Explore our comprehensive plants database with advanced filters.",
  keywords: ["plants", "database", "GreenThumb", "gardening", "horticulture"],
  openGraph: {
    title: "Plants Database - GreenThumb",
    description:
      "Explore our comprehensive plants database with advanced filters.",
    url: `${process.env.NEXT_PUBLIC_DEV_URL}/plants`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DEV_URL}/images/plants-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Plants database preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plants Database - GreenThumb",
    description:
      "Explore our comprehensive plants database with advanced filters.",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DEV_URL}/plants`,
  },
};

export default function PlantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <SidebarProvider>
        <FilterPanel />
        {children}
      </SidebarProvider>
    </main>
  );
}

import Main from "@/components/Tips/Main";

// Reason: Enable static generation and caching at route level for faster navigation
export const revalidate = 3600; // 1 hour
export const dynamic = "force-static";

export default async function page() {
	return <Main />;
}

import Script from "next/script";
import Homepage from "@/components/Home/Homepage";

// Reason: Enable static generation and caching at route level for faster navigation
export const revalidate = 3600; // 1 hour
export const dynamic = "force-static";

export default function Home() {
	const jsonLdData = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "GreenThumb",
		url: process.env.NEXT_PUBLIC_BASE_URL,
		logo: "/logo-transparent.png",
		description:
			"Merging the worlds of technology and agriculture for happier gardeners.",
	};

	return (
		<main>
			<Script
				id="json-ld-the-green-thumb"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
			/>
			<Homepage />
		</main>
	);
}

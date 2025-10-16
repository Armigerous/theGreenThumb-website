import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import { PlantIdentificationForm } from "@/components/PlantIdentification/PlantIdentificationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Plant Identification - GreenThumb",
	description:
		"Identify plants from photos or descriptions using AI-powered plant identification technology.",
	keywords: [
		"plant identification",
		"plant recognition",
		"plant finder",
		"plant ID",
		"botanical identification",
		"plant species",
	],
	openGraph: {
		title: "Plant Identification - GreenThumb",
		description:
			"Identify plants from photos or descriptions using AI-powered plant identification technology.",
		images: [
			{
				url: "/plant-search.png",
				width: 1200,
				height: 630,
				alt: "Plant identification tool - GreenThumb",
			},
		],
	},
};

// Reason: Enable Partial Prerendering for this route to prerender static shell and stream dynamic content
export const experimental_ppr = true;
export const revalidate = 3600; // 1 hour

export default function PlantIdentificationPage() {
	return (
		<MaxWidthWrapper className="py-8">
			<div className="text-center mb-8">
				<h1 className="text-4xl font-title-bold text-gray-900 mb-4">
					Plant Identification
				</h1>
				<p className="text-lg text-gray-600 max-w-2xl mx-auto">
					Upload a photo or describe a plant to get instant identification
					results. Our AI-powered system can help you identify thousands of
					plant species.
				</p>
			</div>

			<PlantIdentificationForm />
		</MaxWidthWrapper>
	);
}

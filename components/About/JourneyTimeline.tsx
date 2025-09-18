import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const JourneyTimeline: React.FC = () => {
	const milestones = [
		{
			year: 2021,
			title: "Concept Development",
			description:
				"The idea for GreenThumb was born from a passion for gardening and technology.",
		},
		{
			year: 2022,
			title: "Prototype Creation",
			description:
				"Developed initial prototypes integrating sensors for soil moisture, temperature, humidity, and light.",
		},
		{
			year: 2023,
			title: "Market Research",
			description:
				"Surveyed over 2000 potential users and conducted user interviews to refine the product design.",
		},
		{
			year: 2024,
			title: "AI Integration",
			description:
				"Integrated AI-powered suggestions and real-time sensor data monitoring to enhance user experience.",
		},
	];

	return (
		<section className="py-16 rounded-lg bg-cream-300/70 px-10 shadow-xl">
			<div className="container mx-auto px-6 sm:px-8 py-6">
				<h2 className="text-3xl font-bold mb-8 text-center text-primary">
					Our Journey
				</h2>
				<div className="space-y-8">
					{milestones.map((milestone, index) => (
						<Card
							key={index}
							className="flex flex-col md:flex-row hover:shadow-lg transition-shadow"
						>
							<CardHeader className="md:w-1/4 bg-primary/10 flex items-center justify-center">
								<CardTitle className="text-4xl font-bold text-primary">
									{milestone.year}
								</CardTitle>
							</CardHeader>
							<CardContent className="md:w-3/4 p-6">
								<h3 className="text-xl font-semibold mb-2">
									{milestone.title}
								</h3>
								<p className="text-muted-foreground">{milestone.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};

export default JourneyTimeline;

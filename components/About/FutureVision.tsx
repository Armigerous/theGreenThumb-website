import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, BrainCircuit, Network } from "lucide-react";

const FutureVision: React.FC = () => {
	const visionPoints = [
		{
			icon: Sun,
			title: "Solar-Powered Sensors",
			description:
				"Introducing sustainable energy solutions for prolonged sensor operation in gardens.",
		},
		{
			icon: BrainCircuit,
			title: "AI-Driven Insights",
			description:
				"Enhancing plant care recommendations through advanced AI integration.",
		},
		{
			icon: Network,
			title: "Connected Gardening Community",
			description:
				"Building a network where gardeners share knowledge, experiences, and insights globally.",
		},
	];

	return (
		<section className="py-16">
			<div className="container mx-auto">
				<h2 className="text-3xl font-title-bold mb-8 text-center text-primary">
					Our Vision for the Future
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					{visionPoints.map((point, index) => (
						<Card
							key={index}
							className="bg-card hover:shadow-lg transition-shadow"
						>
							<CardContent className="p-4 sm:p-6 text-center">
								{React.createElement(point.icon, {
									size: 48,
									className: "text-primary mx-auto mb-4",
								})}
								<h3 className="text-xl font-paragraph-semibold mb-2">
									{point.title}
								</h3>
								<p className="text-muted-foreground">{point.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};

export default FutureVision;

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Leaf } from "lucide-react";

interface PlantIdentificationLoadingProps {
	type: "image" | "description";
}

export function PlantIdentificationLoading({
	type,
}: PlantIdentificationLoadingProps) {
	return (
		<Card className="mt-8">
			<CardContent className="text-center py-12">
				<div className="flex flex-col items-center space-y-4">
					<div className="relative">
						<Leaf className="h-16 w-16 text-green-500 animate-pulse" />
						<Loader2 className="h-6 w-6 text-green-600 animate-spin absolute -top-1 -right-1" />
					</div>

					<div className="space-y-2">
						<h3 className="text-lg font-paragraph-semibold text-gray-900">
							Analyzing {type === "image" ? "Plant Image" : "Plant Description"}
						</h3>
						<p className="text-sm text-gray-600 max-w-md">
							Our AI is examining the{" "}
							{type === "image" ? "image" : "description"} to identify the plant
							species. This may take a few moments...
						</p>
					</div>

					<div className="flex space-x-1">
						<div
							className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
							style={{ animationDelay: "0ms" }}
						></div>
						<div
							className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
							style={{ animationDelay: "150ms" }}
						></div>
						<div
							className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
							style={{ animationDelay: "300ms" }}
						></div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

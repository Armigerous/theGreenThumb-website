"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Sun, Thermometer, Leaf } from "lucide-react";

interface PlantCareTipsProps {
  plantName: string;
  careInstructions?: string;
}

export function PlantCareTips({
  plantName,
  careInstructions,
}: PlantCareTipsProps) {
  // Reason: Provide default care tips for common plant types if no specific instructions are provided
  const getDefaultCareTips = (name: string) => {
    const lowerName = name.toLowerCase();

    if (lowerName.includes("succulent") || lowerName.includes("cactus")) {
      return {
        water: "Water sparingly - once every 2-3 weeks",
        light: "Bright, indirect light or direct sun",
        temperature: "Room temperature (65-75°F)",
        tips: "Allow soil to dry completely between waterings",
      };
    }

    if (lowerName.includes("fern") || lowerName.includes("moss")) {
      return {
        water: "Keep soil consistently moist",
        light: "Bright, indirect light",
        temperature: "Cool to room temperature (60-70°F)",
        tips: "High humidity preferred, mist regularly",
      };
    }

    if (lowerName.includes("rose") || lowerName.includes("flowering")) {
      return {
        water: "Water deeply 2-3 times per week",
        light: "Full sun (6+ hours daily)",
        temperature: "Moderate temperatures (65-75°F)",
        tips: "Deadhead spent flowers to encourage new blooms",
      };
    }

    // Default for houseplants
    return {
      water: "Water when top inch of soil is dry",
      light: "Bright, indirect light",
      temperature: "Room temperature (65-75°F)",
      tips: "Rotate plant weekly for even growth",
    };
  };

  const careTips = careInstructions
    ? { water: "", light: "", temperature: "", tips: careInstructions }
    : getDefaultCareTips(plantName);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-600" />
          Care Tips for {plantName}
        </CardTitle>
        <CardDescription>
          Essential care information to keep your plant healthy
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {careInstructions ? (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700">{careInstructions}</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Droplets className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm text-gray-900">Watering</h4>
                <p className="text-sm text-gray-600">{careTips.water}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Sun className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm text-gray-900">Light</h4>
                <p className="text-sm text-gray-600">{careTips.light}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Thermometer className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm text-gray-900">
                  Temperature
                </h4>
                <p className="text-sm text-gray-600">{careTips.temperature}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Leaf className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm text-gray-900">
                  Additional Tips
                </h4>
                <p className="text-sm text-gray-600">{careTips.tips}</p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <Badge variant="outline" className="text-xs">
            💡 Tip: For specific care questions, consult with a local nursery or
            plant expert
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

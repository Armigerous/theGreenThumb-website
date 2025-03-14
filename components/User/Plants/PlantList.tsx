"use client";

import { userPlants } from "@/types/garden";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StatusIndicator from "./StatusIndicator";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";

interface PlantListProps {
  plants: userPlants[];
  onUpdate: (plant: userPlants) => void;
  gardenZones: string[];
}

const PlantList = ({ plants, onUpdate }: PlantListProps) => {
  if (plants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed">
        <p className="mb-4 text-muted-foreground">No plants added yet.</p>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" /> Add Your First Plant
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {plants.map((plant) => (
          <Card key={plant.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between p-4 pb-0">
              <div className="flex items-center gap-2">
                <StatusIndicator status={plant.status} />
                <CardTitle className="text-base font-medium">
                  {plant.customName}
                </CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" /> Edit Plant
                  </DropdownMenuItem>
                  <DropdownMenuItem>Add Care Log</DropdownMenuItem>
                  <DropdownMenuItem>View History</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="flex flex-row gap-4">
                {plant.images && plant.images.length > 0 ? (
                  <div className="relative w-20 h-20 overflow-hidden rounded-md">
                    <Image
                      src={plant.images[0].url}
                      alt={plant.customName}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-20 h-20 bg-muted rounded-md">
                    <span className="text-xs text-muted-foreground">
                      No image
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">
                    {plant.botanicalName}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {plant.locationTags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-4 pt-0 text-xs text-muted-foreground">
              <span>
                Last care:{" "}
                {plant.careLogs && plant.careLogs.length > 0
                  ? format(
                      new Date(plant.careLogs[plant.careLogs.length - 1].date),
                      "MMM d"
                    )
                  : "Never"}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-xs"
                onClick={() => onUpdate(plant)}
              >
                <Plus className="w-3 h-3 mr-1" /> Add Care
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlantList;

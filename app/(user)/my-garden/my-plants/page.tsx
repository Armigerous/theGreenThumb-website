"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Leaf, CalendarClock, Droplets } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import PlantList from "@/components/User/Plants/PlantList";
import AddPlant from "@/components/User/Plants/AddPlant";
import { userPlants, UserGardens } from "@/types/garden";
import useSWR from "swr";
import { PlantListSkeleton } from "@/components/User/Garden/GardenPageSkeleton";

// Interface for the API response
interface UserGardensResponse {
  settings: UserGardens;
  plants: userPlants[];
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  const data = await response.json();

  // Ensure we always have settings and plants arrays
  return {
    settings: data.settings || null,
    plants: data.plants || [],
  };
};

export default function MyPlantsPage() {
  const { user, isLoaded } = useUser();
  const [userPlants, setUserPlants] = useState<userPlants[]>([]);
  const [healthStatus, setHealthStatus] = useState({
    healthy: 0,
    warning: 0,
    critical: 0,
    dormant: 0,
  });

  // Fetch user garden data
  const {
    data: gardenData,
    error,
    isLoading,
  } = useSWR<UserGardensResponse>(
    isLoaded ? `/api/user-gardens?userId=${user?.id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // 10 seconds
    }
  );

  useEffect(() => {
    // When garden data loads, fetch plants
    if (gardenData?.settings?.id) {
      fetchPlants(gardenData.settings.id);
    }
  }, [gardenData]);

  useEffect(() => {
    // Calculate health status whenever userPlants changes
    if (userPlants.length > 0) {
      const statusCounts = userPlants.reduce(
        (acc, plant) => {
          acc[plant.status || "healthy"] += 1;
          return acc;
        },
        { healthy: 0, warning: 0, critical: 0, dormant: 0 }
      );
      setHealthStatus(statusCounts);
    } else {
      setHealthStatus({ healthy: 0, warning: 0, critical: 0, dormant: 0 });
    }
  }, [userPlants]);

  const fetchPlants = async (gardenId: number) => {
    try {
      const response = await fetch(`/api/plant-tracking?gardenId=${gardenId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch plants");
      }
      const data = await response.json();
      setUserPlants(data.plants || []);
    } catch (error) {
      console.error("Error fetching plants:", error);
      toast.error("Failed to fetch plants");
    }
  };

  const handlePlantUpdate = (updatedPlant: userPlants) => {
    setUserPlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant.id === updatedPlant.id ? updatedPlant : plant
      )
    );

    // Refresh the data to ensure consistency
    if (gardenData?.settings?.id) {
      fetchPlants(gardenData.settings.id);
    }
    toast.success("Plant updated successfully");
  };

  // Calculate the health percentage for the progress bar
  const calculateHealthPercentage = () => {
    if (userPlants.length === 0) return 0;
    const healthyCount = healthStatus.healthy + healthStatus.dormant;
    return Math.round((healthyCount / userPlants.length) * 100);
  };

  const healthPercentage = calculateHealthPercentage();

  // Calculate upcoming care tasks - check for plants that might need care soon
  const upcomingCareTasks = userPlants.filter((plant) => {
    // Check if the plant has any care logs
    if (!plant.careLogs || plant.careLogs.length === 0) return false;

    // Get the latest care log
    const latestCareLog = [...plant.careLogs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];

    // If the latest care is water type and it was more than 5 days ago, it needs attention
    if (latestCareLog.type === "water") {
      const lastWateringDate = new Date(latestCareLog.date);
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

      return lastWateringDate < fiveDaysAgo;
    }

    return false;
  }).length;

  if (!isLoaded || isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">My Plants</h2>
            <p className="text-sm text-muted-foreground">
              Track and manage your garden plants
            </p>
          </div>
          <Link href="/my-garden">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Your Garden
            </Button>
          </Link>
        </div>

        <PlantListSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-500">
          Error loading garden data. Please try again.
        </p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">My Plants</h2>
          <p className="text-sm text-muted-foreground">
            Track and manage your garden plants
          </p>
        </div>
        <Link href="/my-garden">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Your Garden
          </Button>
        </Link>
      </div>

      {!gardenData?.settings ? (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed">
          <Leaf className="w-10 h-10 text-muted-foreground mb-2" />
          <p className="mb-4 text-muted-foreground">
            You don&apos;t have a garden set up yet.
          </p>
          <Link href="/my-garden">
            <Button size="sm">Set Up Your Garden</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1">
          {/* Main Plants Section - Full width on mobile, two columns on larger screens */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Leaf className="w-5 h-5 mr-2" />
                  {gardenData.settings.name || "My Garden"}
                </CardTitle>
                {gardenData.settings.id && (
                  <AddPlant
                    gardenId={gardenData.settings.id}
                    existingPlants={userPlants}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage your plant collection.
              </p>
              {userPlants.length > 0 ? (
                <PlantList
                  plants={userPlants}
                  onUpdate={handlePlantUpdate}
                  gardenZones={[]}
                />
              ) : (
                <div className="text-center p-6 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    No plants added yet. Add your first plant to get started!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Garden Insights Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Garden Health Card */}
            <Card className="bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Droplets className="w-5 h-5 mr-2" />
                  Garden Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Track your garden&apos;s health status.
                </p>
                {userPlants.length > 0 ? (
                  <>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      <div className="text-center">
                        <div className="text-emerald-500 font-semibold">
                          {healthStatus.healthy}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Healthy
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-amber-500 font-semibold">
                          {healthStatus.warning}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Warning
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-rose-500 font-semibold">
                          {healthStatus.critical}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Critical
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-400 font-semibold">
                          {healthStatus.dormant}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Dormant
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Add plants to your garden to track overall health status.
                  </p>
                )}
                <div className="w-full mt-3 bg-muted/30 rounded-full h-2.5">
                  <div
                    className={`${
                      healthPercentage > 70
                        ? "bg-emerald-400"
                        : healthPercentage > 40
                          ? "bg-amber-400"
                          : "bg-rose-400"
                    } h-2.5 rounded-full transition-all duration-300`}
                    style={{ width: `${healthPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {userPlants.length > 0
                    ? `Overall health: ${healthPercentage}% (${userPlants.length} plants)`
                    : "No plants added yet"}
                </p>
              </CardContent>
            </Card>

            {/* Upcoming Care Card */}
            <Card className="bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <CalendarClock className="w-5 h-5 mr-2" />
                  Upcoming Care
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Track upcoming care tasks for your plants.
                </p>
                {upcomingCareTasks > 0 ? (
                  <div className="p-4 border rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors duration-200">
                    <p className="text-sm">
                      You have{" "}
                      <span className="font-medium">{upcomingCareTasks}</span>{" "}
                      plants that need attention in the next 7 days.
                    </p>
                    <Button className="mt-4" variant="outline" size="sm">
                      View Care Schedule
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 border rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors duration-200">
                    <p className="text-sm text-muted-foreground">
                      No upcoming care tasks scheduled. Add plants and care logs
                      to see recommendations.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

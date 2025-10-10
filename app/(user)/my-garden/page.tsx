import React from "react";
import { Button } from "@/components/ui/button";
import {
  GardenWithTaskStats,
  OverallTaskBasedStatistics,
  TaskBasedGardenStatistics,
  DashboardPlant,
  DashboardTask,
} from "@/types/garden";
import Link from "next/link";
import { queries } from "@/lib/db/queries";
import { auth } from "@clerk/nextjs/server";
import { MyGardenClient } from "./_components/MyGardenClient";
import { MyGardenEmpty } from "./_components/MyGardenEmpty";
import { SeasonalBackground } from "@/components/Garden/_foundations/SeasonalBackground";
import { getCurrentSeason } from "@/lib/utils/seasonal";
import { serializeForClient } from "@/lib/utils/serialization";

/**
 * Response type for My Garden page using materialized view data
 * Reason: Combines task-based gardens with overall statistics
 */
interface GardenDashboardResponse {
  gardens: GardenWithTaskStats[];
  statistics: OverallTaskBasedStatistics;
}

/**
 * MyGardenPage Component (Refactored with Materialized View)
 *
 * Reason: Clean server component using user_gardens_dashboard materialized view
 * for optimal performance. Single query replaces three separate queries.
 * All UI rendering and interactions delegated to client components
 * following Next.js 15 best practices and proper separation of concerns.
 */
const MyGardenPage = async () => {
  // Reason: Get authenticated user ID
  const { userId } = await auth();

  // Reason: Fetch garden overview data from materialized view
  let gardenData: GardenDashboardResponse | null = null;
  let error: string | null = null;

  try {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Reason: Single query to materialized view replaces three separate queries
    const dashboardData = await queries.gardenOverview.getUserGardensDashboard(
      userId
    );

    // Reason: Transform materialized view data to component-friendly format
    const gardens: GardenWithTaskStats[] = dashboardData.map((garden) => {
      // Reason: Parse JSON fields from materialized view with proper type assertions
      const plants = (garden.plants as unknown as DashboardPlant[]) || [];
      const upcomingTasks =
        (garden.upcoming_tasks as unknown as DashboardTask[]) || [];

      return {
        id: garden.garden_id,
        name: garden.name,
        updated_at: garden.updated_at,
        statistics: {
          totalPlants: Number(garden.total_plants),
          plantsWithOverdueTasks: Number(garden.plants_with_overdue_tasks),
          plantsWithUrgentTasks: Number(garden.plants_with_urgent_tasks),
          plantsNeedingCare: Number(garden.plants_needing_care),
          overdueTasksCount: Number(garden.overdue_tasks_count),
          upcomingTasksCount: Number(garden.upcoming_tasks_count),
        } as TaskBasedGardenStatistics,
        plants,
        upcomingTasks,
      };
    });

    // Reason: Calculate overall statistics by aggregating individual garden stats
    const overallStatistics: OverallTaskBasedStatistics = {
      totalGardens: gardens.length,
      totalPlants: gardens.reduce(
        (sum, g) => sum + g.statistics.totalPlants,
        0
      ),
      plantsWithOverdueTasks: gardens.reduce(
        (sum, g) => sum + g.statistics.plantsWithOverdueTasks,
        0
      ),
      plantsWithUrgentTasks: gardens.reduce(
        (sum, g) => sum + g.statistics.plantsWithUrgentTasks,
        0
      ),
      plantsNeedingCare: gardens.reduce(
        (sum, g) => sum + g.statistics.plantsNeedingCare,
        0
      ),
      overdueTasksCount: gardens.reduce(
        (sum, g) => sum + g.statistics.overdueTasksCount,
        0
      ),
      upcomingTasksCount: gardens.reduce(
        (sum, g) => sum + g.statistics.upcomingTasksCount,
        0
      ),
    };

    // Reason: Serialize data to plain objects (convert Decimal, BigInt, Date) for client components
    gardenData = serializeForClient({
      gardens,
      statistics: overallStatistics,
    }) as unknown as GardenDashboardResponse;
  } catch (err) {
    console.error("Error fetching garden data:", err);
    error = "Failed to load garden data";
  }

  // Reason: Error state with seasonal background
  if (error) {
    const currentSeason = getCurrentSeason();
    return (
      <>
        <SeasonalBackground season={currentSeason} />
        <div className="relative min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 px-4">
          <div className="space-y-4">
            <h1 className="font-title-bold text-4xl text-cream-800">
              Your Gardens
            </h1>
            <p className="text-red-600 text-lg max-w-2xl mx-auto font-paragraph">
              {error}
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-brand-600 hover:bg-brand-700 text-primary-foreground font-paragraph-semibold rounded-2xl"
          >
            <Link href="/plants">Find Plants</Link>
          </Button>
        </div>
      </>
    );
  }

  // Reason: Empty state - delegate to client component
  if (!gardenData || gardenData.gardens.length === 0) {
    return <MyGardenEmpty />;
  }

  // Reason: Main content - delegate to client component
  return <MyGardenClient gardenData={gardenData} />;
};

export default MyGardenPage;

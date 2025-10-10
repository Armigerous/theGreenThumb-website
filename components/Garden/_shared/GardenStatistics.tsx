"use client";

import React, { useEffect, useRef } from "react";
import { OrganicCard } from "../_foundations/OrganicCard";
import {
  IllustrationPlaceholder,
  IllustrationPrompts,
} from "../_foundations/IllustrationPlaceholder";
import { GardenStatisticsProps } from "@/types/garden-ui";
import {
  animateStaggerFadeUp,
  animateCountUp,
  withReducedMotion,
  respectsReducedMotion,
} from "@/lib/animations/garden-animations";

/**
 * GardenStatistics Component
 *
 * Reason: Garden-themed statistics display with organic layout,
 * friendly copy, and count-up animations - replaces corporate grid
 */

export const GardenStatistics: React.FC<GardenStatisticsProps> = ({
  statistics,
  animated = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animated && containerRef.current) {
      const cards =
        containerRef.current.querySelectorAll<HTMLElement>(".stat-card");
      withReducedMotion(() =>
        animateStaggerFadeUp(Array.from(cards), {
          stagger: 80,
          delay: 200,
        })
      );

      // Reason: Animate count-up for numbers if motion is allowed
      if (!respectsReducedMotion()) {
        setTimeout(() => {
          const numbers =
            containerRef.current?.querySelectorAll(".stat-number");
          numbers?.forEach((el) => {
            const target = parseInt(el.getAttribute("data-value") || "0");
            animateCountUp(el as HTMLElement, target, {
              duration: 1000,
              delay: 300,
            });
          });
        }, 400);
      }
    }
  }, [animated, statistics]);

  // Reason: Check if we're using task-based statistics (new) or care-log based (legacy)
  const isTaskBased = "plantsWithOverdueTasks" in statistics;

  // Reason: Define stats with brand-aligned labels and colors
  // Adapt to work with both task-based and legacy statistics
  const stats = [
    {
      label: "Gardens Growing",
      value: statistics.totalGardens,
      illustration: IllustrationPrompts.statGrowingGarden,
      colorClass: "text-brand-600",
      bgClass: "bg-brand-50",
    },
    {
      label: "Total Plants",
      value: statistics.totalPlants,
      illustration: IllustrationPrompts.statHappyPlant,
      colorClass: "text-brand-600",
      bgClass: "bg-brand-50",
    },
  ];

  // Reason: Add task-based or legacy-based health stats
  if (isTaskBased) {
    // Reason: Task-based statistics - calculate healthy plants as those without overdue/urgent tasks
    const tasksStats = statistics as {
      plantsWithOverdueTasks: number;
      plantsWithUrgentTasks: number;
      plantsNeedingCare: number;
      totalPlants: number;
      overdueTasksCount: number;
      upcomingTasksCount: number;
    };
    const healthyPlants = tasksStats.totalPlants - tasksStats.plantsNeedingCare;

    if (healthyPlants > 0) {
      stats.push({
        label: "Happy & Healthy",
        value: healthyPlants,
        illustration: IllustrationPrompts.statHappyPlant,
        colorClass: "text-brand-600",
        bgClass: "bg-brand-50",
      });
    }

    if (tasksStats.plantsWithUrgentTasks > 0) {
      stats.push({
        label: "Need Urgent Care",
        value: tasksStats.plantsWithUrgentTasks,
        illustration: IllustrationPrompts.statNeedsLove,
        colorClass: "text-orange-600",
        bgClass: "bg-orange-50",
      });
    }

    if (tasksStats.plantsWithOverdueTasks > 0) {
      stats.push({
        label: "Tasks Overdue",
        value: tasksStats.plantsWithOverdueTasks,
        illustration: IllustrationPrompts.statWatching,
        colorClass: "text-accent-500",
        bgClass: "bg-accent-50",
      });
    }
  } else {
    // Reason: Legacy care-log based statistics
    const legacyStats = statistics as {
      healthyPlants: number;
      plantsNeedingCare: number;
      warningPlants?: number;
      criticalPlants?: number;
    };

    stats.push({
      label: "Happy & Healthy",
      value: legacyStats.healthyPlants,
      illustration: IllustrationPrompts.statHappyPlant,
      colorClass: "text-brand-600",
      bgClass: "bg-brand-50",
    });

    stats.push({
      label: "Need Love",
      value: legacyStats.plantsNeedingCare,
      illustration: IllustrationPrompts.statNeedsLove,
      colorClass: "text-accent-500",
      bgClass: "bg-accent-50",
    });

    // Reason: Only show watching/struggling if there are plants in those states
    if (legacyStats.warningPlants && legacyStats.warningPlants > 0) {
      stats.push({
        label: "Watching",
        value: legacyStats.warningPlants,
        illustration: IllustrationPrompts.statWatching,
        colorClass: "text-accent-400",
        bgClass: "bg-accent-50",
      });
    }

    if (legacyStats.criticalPlants && legacyStats.criticalPlants > 0) {
      stats.push({
        label: "Struggling",
        value: legacyStats.criticalPlants,
        illustration: IllustrationPrompts.statNeedsLove,
        colorClass: "text-orange-600",
        bgClass: "bg-orange-50",
      });
    }
  }

  return (
    <div
      ref={containerRef}
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`,
      }}
    >
      {stats.map((stat, index) => (
        <OrganicCard
          key={index}
          variant="compact"
          elevation="low"
          withTexture={false}
          className={`stat-card text-center ${stat.bgClass} border-none`}
        >
          {/* Reason: Illustration icon instead of generic lucide icon */}
          <div className="flex justify-center mb-3">
            <IllustrationPlaceholder
              {...stat.illustration}
              width={60}
              height={60}
              className="border-none bg-transparent"
            />
          </div>

          {/* Reason: Large, friendly number with brand typography */}
          <div
            className={`stat-number font-title-bold text-3xl mb-1 ${stat.colorClass}`}
            data-value={stat.value}
          >
            {stat.value}
          </div>

          {/* Reason: Simple, brand-voice label */}
          <div className="font-paragraph text-xs text-cream-600">
            {stat.label}
          </div>
        </OrganicCard>
      ))}
    </div>
  );
};

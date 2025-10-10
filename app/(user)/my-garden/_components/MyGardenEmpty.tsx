"use client";

import React from "react";
import { SeasonalBackground } from "@/components/Garden/_foundations/SeasonalBackground";
import { EmptyGardenState } from "@/components/Garden/_shared/EmptyGardenState";
import { getCurrentSeason } from "@/lib/utils/seasonal";

/**
 * MyGardenEmpty Component
 *
 * Reason: Client component for empty garden state with seasonal background
 */

export const MyGardenEmpty: React.FC = () => {
  const currentSeason = getCurrentSeason();

  return (
    <>
      <SeasonalBackground season={currentSeason} animated={true} />
      <div className="relative">
        <EmptyGardenState animated={true} />
      </div>
    </>
  );
};

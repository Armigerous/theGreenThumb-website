"use client";

import React, { useEffect, useRef } from "react";
import { PaperTexture } from "./PaperTexture";
import { getCurrentSeason, getSeasonalWashColor } from "@/lib/utils/seasonal";
import { Season } from "@/types/garden-ui";
import {
  animateFadeUp,
  withReducedMotion,
} from "@/lib/animations/garden-animations";

/**
 * SeasonalBackground Component
 *
 * Reason: Applies seasonal color wash with paper texture overlay
 * to create cozy garden journal aesthetic following brand guidelines
 */

type SeasonalBackgroundProps = {
  season?: Season;
  animated?: boolean;
  className?: string;
};

export const SeasonalBackground: React.FC<SeasonalBackgroundProps> = ({
  season,
  animated = true,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentSeason = season || getCurrentSeason();
  const washColor = getSeasonalWashColor(currentSeason);

  useEffect(() => {
    if (animated && containerRef.current) {
      withReducedMotion(() =>
        animateFadeUp(containerRef.current!, { duration: 600 })
      );
    }
  }, [animated]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 -z-10 ${className}`}
      style={{ backgroundImage: washColor }}
      aria-hidden="true"
    >
      {/* Reason: Paper texture overlay for gouache feel */}
      <PaperTexture opacity={0.35} />
    </div>
  );
};

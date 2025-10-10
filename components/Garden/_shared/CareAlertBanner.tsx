"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  IllustrationPlaceholder,
  IllustrationPrompts,
} from "../_foundations/IllustrationPlaceholder";
import { CareAlertProps } from "@/types/garden-ui";
import {
  animateSlideIn,
  withReducedMotion,
} from "@/lib/animations/garden-animations";

/**
 * CareAlertBanner Component
 *
 * Reason: Gentle reminder banner for plants needing care
 * using soft colors and encouraging tone instead of harsh alerts
 */

export const CareAlertBanner: React.FC<CareAlertProps> = ({
  plantCount,
  onViewCare,
  animated = true,
}) => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animated && bannerRef.current) {
      withReducedMotion(() =>
        animateSlideIn(bannerRef.current!, "left", { delay: 400 })
      );
    }
  }, [animated]);

  // Reason: Don't render if no plants need care
  if (plantCount === 0) return null;

  // Reason: Friendly, encouraging messaging based on plant count
  const getMessage = () => {
    if (plantCount === 1) return "1 plant would love some attention today";
    return `${plantCount} plants would love some attention today`;
  };

  return (
    <div
      ref={bannerRef}
      className="rounded-3xl p-6 bg-gradient-to-r from-accent-50 to-cream-50 border-2 border-accent-200"
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Reason: Friendly illustration instead of warning icon */}
        <div className="flex-shrink-0">
          <IllustrationPlaceholder
            {...IllustrationPrompts.careAlertBanner}
            width={100}
            height={100}
          />
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          {/* Reason: Warm, encouraging headline */}
          <h3 className="font-title-semibold text-xl text-cream-800">
            {getMessage()}
          </h3>
          {/* Reason: Simple, helpful subtext */}
          <p className="font-paragraph text-cream-600">
            Let&apos;s see what they need
          </p>
        </div>

        {/* Reason: Soft call-to-action button */}
        <div className="flex-shrink-0">
          {onViewCare ? (
            <Button
              onClick={onViewCare}
              variant="outline"
              className="rounded-2xl border-accent-300 text-cream-800 hover:bg-accent-100 font-paragraph-semibold"
            >
              Show Me →
            </Button>
          ) : (
            <Button
              asChild
              variant="outline"
              className="rounded-2xl border-accent-300 text-cream-800 hover:bg-accent-100 font-paragraph-semibold"
            >
              <Link href="/my-garden/care">Show Me →</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

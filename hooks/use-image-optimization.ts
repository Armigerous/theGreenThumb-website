"use client";

import { useState, useEffect } from "react";
import { dynamicBlurDataUrl } from "@/lib/dynamicBlurDataUrl";
import { shouldOptimizeImage, getLoadingStrategy, getPriority } from "@/lib/image-config";

interface UseImageOptimizationProps {
  src: string;
  index: number;
  fallbackSrc?: string;
}

interface UseImageOptimizationReturn {
  imageUrl: string;
  blurDataUrl: string | undefined;
  shouldOptimize: boolean;
  loadingStrategy: "eager" | "lazy";
  priority: boolean;
  isLoading: boolean;
  hasError: boolean;
}

/**
 * Custom hook for managing image optimization strategies
 * Centralizes image loading logic and optimization decisions
 */
export const useImageOptimization = ({
  src,
  index,
  fallbackSrc = "/no-plant-image.png",
}: UseImageOptimizationProps): UseImageOptimizationReturn => {
  const [blurDataUrl, setBlurDataUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const imageUrl = src || fallbackSrc;
  const shouldOptimize = shouldOptimizeImage(index);
  const loadingStrategy = getLoadingStrategy(index);
  const priority = getPriority(index);

  useEffect(() => {
    const generateBlurDataUrl = async () => {
      if (!shouldOptimize || !imageUrl || imageUrl === fallbackSrc) {
        setIsLoading(false);
        return;
      }

      try {
        const blurUrl = await dynamicBlurDataUrl(imageUrl);
        setBlurDataUrl(blurUrl);
      } catch (error) {
        console.warn("Failed to generate blur data URL:", error);
      } finally {
        setIsLoading(false);
      }
    };

    generateBlurDataUrl();
  }, [imageUrl, shouldOptimize, fallbackSrc]);

  return {
    imageUrl,
    blurDataUrl,
    shouldOptimize,
    loadingStrategy,
    priority,
    isLoading,
    hasError,
  };
};

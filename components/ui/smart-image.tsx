"use client";

// components/ui/smart-image.tsx
// Smart image component following latest Next.js 15 practices with Vercel limit management

import Image from "next/image";
import { useState, useCallback } from "react";
import {
  getImageOptimizationConfig,
  getImageType,
  generateBlurPlaceholder,
  type ImageSource,
} from "@/lib/imageOptimization";
import {
  getOptimizationStrategy,
  trackImageOptimization,
  logImageOptimizationUsage,
} from "@/lib/vercelImageLimit";

export interface SmartImageProps {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Image context for optimization strategy */
  context?:
    | "card"
    | "gallery"
    | "hero"
    | "detail"
    | "thumbnail"
    | "static_asset";
  /** Whether this is a critical above-the-fold image */
  isCritical?: boolean;
  /** CSS classes */
  className?: string;
  /** Image quality for optimization */
  quality?: number;
  /** Priority loading */
  priority?: boolean;
  /** Loading strategy */
  loading?: "eager" | "lazy";
  /** Responsive sizes */
  sizes?: string;
  /** Click handler */
  onClick?: () => void;
  /** Load handler */
  onLoad?: () => void;
  /** Error handler */
  onError?: () => void;
  /** Width for non-fill images (optional) */
  width?: number;
  /** Height for non-fill images (optional) */
  height?: number;
  /** Whether to use fill mode */
  fill?: boolean;
  /** Object fit for images */
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export function SmartImage({
  src,
  alt,
  context = "card",
  isCritical = false,
  className,
  onClick,
  onLoad,
  onError,
  width,
  height,
  fill = false,
  objectFit = "cover",
}: SmartImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [optimizationFailed, setOptimizationFailed] = useState(false);

  // Determine image type and optimization strategy
  const imageType = getImageType(src);
  const imageSource: ImageSource = {
    src,
    alt,
    type: imageType,
    isCritical,
    width,
    height,
  };

  const optimizationConfig = getImageOptimizationConfig(imageSource, context);
  const strategy = getOptimizationStrategy(context, isCritical);

  // Handle image errors with fallback
  const handleImageError = useCallback(() => {
    console.error(`Image failed to load: ${src}`);
    setImageError(true);
    setImageLoaded(false);
    onError?.();
  }, [src, onError]);

  // Handle optimization success/failure
  const handleLoad = useCallback(() => {
    setImageLoaded(true);
    // Only track optimization usage if we actually used Vercel optimization
    if (strategy === "optimize" && !optimizationFailed) {
      trackImageOptimization();
    }
    onLoad?.();
  }, [strategy, optimizationFailed, onLoad]);

  const handleOptimizationError = useCallback(() => {
    console.warn(
      `Image optimization failed for ${src}, falling back to direct loading`
    );
    setOptimizationFailed(true);
    onError?.();
  }, [src, onError]);

  // Log usage for debugging (client-side only)
  if (typeof window !== "undefined") {
    logImageOptimizationUsage();
  }

  // Show error placeholder when image fails to load
  if (imageError) {
    return (
      <div
        className={`bg-cream-100 flex items-center justify-center rounded-md ${
          fill ? "absolute inset-0" : "w-full aspect-video"
        } ${className || ""}`}
      >
        <span className="text-muted-foreground text-sm">Image unavailable</span>
      </div>
    );
  }

  // Show loading skeleton while image is loading
  if (!imageLoaded && !imageError) {
    return (
      <div
        className={`relative overflow-hidden ${
          fill ? "absolute inset-0" : className || ""
        }`}
      >
        {/* Shimmer loading skeleton */}
        <div className="absolute inset-0 bg-muted animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cream-50/40 to-transparent animate-shimmer" />
        </div>

        {/* Load the actual image in the background */}
        <div className="opacity-0">
          {getImageElement({
            src,
            alt,
            width,
            height,
            fill,
            className: "",
            objectFit,
            onClick,
            onError: handleImageError,
            onLoad: handleLoad,
            optimizationConfig,
            strategy,
            optimizationFailed,
            handleOptimizationError,
          })}
        </div>
      </div>
    );
  }

  // Show the loaded image
  return getImageElement({
    src,
    alt,
    width,
    height,
    fill,
    className,
    objectFit,
    onClick,
    onError: handleImageError,
    onLoad: handleLoad,
    optimizationConfig,
    strategy,
    optimizationFailed,
    handleOptimizationError,
  });
}

/**
 * Get the actual Image element based on strategy and configuration
 * CRITICAL: Only use Next.js Image component when we want to consume Vercel optimization quota
 */
function getImageElement({
  src,
  alt,
  width,
  height,
  fill,
  className,
  objectFit,
  onClick,
  onError,
  onLoad,
  optimizationConfig,
  strategy,
  optimizationFailed,
  handleOptimizationError,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  onClick?: () => void;
  onError?: () => void;
  onLoad?: () => void;
  optimizationConfig: {
    useOptimization: boolean;
    useBlurPlaceholder: boolean;
    priority: boolean;
    loading: "eager" | "lazy";
    sizes: string;
    quality?: number;
    useFallback: boolean;
  };
  strategy: string;
  optimizationFailed: boolean;
  handleOptimizationError: () => void;
}) {
  // CRITICAL: Use native img tag for 'direct' and 'fallback' strategies to preserve Vercel limit
  if (strategy === "direct" || strategy === "fallback" || optimizationFailed) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onClick={onClick}
        onError={onError}
        onLoad={onLoad}
        style={{
          ...(fill
            ? {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit,
              }
            : {
                width: "100%",
                height: "auto",
              }),
        }}
        loading={optimizationConfig.loading}
      />
    );
  }

  // Only use Next.js Image component for 'optimize' strategy when we want to consume quota
  const baseProps = {
    src,
    alt,
    className,
    onClick,
    onError,
    onLoad,
  };

  // For fill images with optimization
  if (fill) {
    const fillStyle = {
      objectFit,
    };

    return (
      <Image
        {...baseProps}
        fill
        alt={alt}
        quality={optimizationConfig.quality}
        priority={optimizationConfig.priority}
        loading={optimizationConfig.loading}
        sizes={optimizationConfig.sizes}
        placeholder={optimizationConfig.useBlurPlaceholder ? "blur" : "empty"}
        blurDataURL={
          optimizationConfig.useBlurPlaceholder
            ? generateBlurPlaceholder()
            : undefined
        }
        style={fillStyle}
        onError={handleOptimizationError}
      />
    );
  }

  // For responsive images without known dimensions
  if (!width || !height) {
    console.info(
      "SmartImage: Using default responsive dimensions for optimization"
    );

    const defaultWidth = 800;
    const defaultHeight = 600;

    return (
      <Image
        {...baseProps}
        width={defaultWidth}
        height={defaultHeight}
        alt={alt}
        quality={optimizationConfig.quality}
        priority={optimizationConfig.priority}
        loading={optimizationConfig.loading}
        sizes={optimizationConfig.sizes}
        placeholder={optimizationConfig.useBlurPlaceholder ? "blur" : "empty"}
        blurDataURL={
          optimizationConfig.useBlurPlaceholder
            ? generateBlurPlaceholder()
            : undefined
        }
        style={{
          width: "100%",
          height: "auto",
        }}
        onError={handleOptimizationError}
      />
    );
  }

  // Responsive image with known dimensions and optimization
  return (
    <Image
      {...baseProps}
      width={width}
      height={height}
      alt={alt}
      quality={optimizationConfig.quality}
      priority={optimizationConfig.priority}
      loading={optimizationConfig.loading}
      sizes={optimizationConfig.sizes}
      placeholder={optimizationConfig.useBlurPlaceholder ? "blur" : "empty"}
      blurDataURL={
        optimizationConfig.useBlurPlaceholder
          ? generateBlurPlaceholder()
          : undefined
      }
      style={{
        width: "100%",
        height: "auto",
      }}
      onError={handleOptimizationError}
    />
  );
}

// Export a simpler version for common use cases
export function OptimizedImage({
  src,
  alt,
  context = "card",
  isCritical = false,
  className,
  quality,
  priority,
  loading,
  sizes,
  onClick,
  onLoad,
  onError,
  width,
  height,
  fill = false,
  objectFit = "cover",
}: Omit<SmartImageProps, "context"> & {
  context?: SmartImageProps["context"];
}) {
  return (
    <SmartImage
      src={src}
      alt={alt}
      context={context}
      isCritical={isCritical}
      className={className}
      quality={quality}
      priority={priority}
      loading={loading}
      sizes={sizes}
      onClick={onClick}
      onLoad={onLoad}
      onError={onError}
      width={width}
      height={height}
      fill={fill}
      objectFit={objectFit}
    />
  );
}

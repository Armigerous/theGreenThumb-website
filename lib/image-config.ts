/**
 * Image optimization configuration
 * Centralized configuration for managing image optimization strategies
 */

export const IMAGE_CONFIG = {
  // Only optimize the first N images on each page
  MAX_OPTIMIZED_IMAGES_PER_PAGE: 4,
  
  // Fallback image for when optimization fails
  FALLBACK_IMAGE: "/no-plant-image.png",
  
  // Default quality for optimized images
  DEFAULT_QUALITY: 75,
} as const;

/**
 * Determines if an image should be optimized based on its position
 */
export function shouldOptimizeImage(index: number): boolean {
  return index < IMAGE_CONFIG.MAX_OPTIMIZED_IMAGES_PER_PAGE;
}

/**
 * Gets the appropriate loading strategy for an image
 */
export function getLoadingStrategy(index: number): "eager" | "lazy" {
  return index < IMAGE_CONFIG.MAX_OPTIMIZED_IMAGES_PER_PAGE ? "eager" : "lazy";
}

/**
 * Gets the appropriate priority setting for an image
 */
export function getPriority(index: number): boolean {
  return index < IMAGE_CONFIG.MAX_OPTIMIZED_IMAGES_PER_PAGE;
}

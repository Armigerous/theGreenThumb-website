/**
 * Image optimization configuration
 * Centralized configuration for managing image optimization strategies
 * 
 * NOTE: Currently set to 0 to avoid Vercel free tier image optimization limits (5k/month)
 * With 1.5k monthly visitors, we were hitting limits and causing image failures
 * To re-enable when revenue allows: increase MAX_OPTIMIZED_IMAGES_PER_PAGE to 4+
 * and set next.config.ts unoptimized: false
 */

export const IMAGE_CONFIG = {
  // Only optimize the first N images on each page
  // Reason: Set to 0 to stay within Vercel free tier limits
  MAX_OPTIMIZED_IMAGES_PER_PAGE: 0,
  
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

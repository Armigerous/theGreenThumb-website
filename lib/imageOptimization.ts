// lib/imageOptimization.ts
// Smart image optimization strategy for GreenThumb plant database

export interface ImageOptimizationConfig {
  /** Whether to use Vercel's image optimization */
  useOptimization: boolean;
  /** Whether to generate blur placeholder */
  useBlurPlaceholder: boolean;
  /** Priority loading for above-the-fold images */
  priority: boolean;
  /** Loading strategy */
  loading: 'eager' | 'lazy';
  /** Image sizes for responsive loading */
  sizes: string;
  /** Quality setting for optimization */
  quality?: number;
  /** Whether to use fallback strategy if optimization fails */
  useFallback: boolean;
}

export interface ImageSource {
  /** The image URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Image type/category */
  type: ImageType;
  /** Whether this is a critical above-the-fold image */
  isCritical?: boolean;
  /** Expected image dimensions */
  width?: number;
  height?: number;
}

export type ImageType = 'plant_photo' | 'static_asset' | 'user_upload' | 'external' | 'placeholder';

export type ImageContext = 'card' | 'gallery' | 'hero' | 'detail' | 'thumbnail' | 'static_asset';

/**
 * Determines optimal image loading strategy based on image type and context
 * 
 * Strategy:
 * - Plant photos (S3): Use optimization sparingly, direct for most cases
 * - Static assets: Use optimization for critical UI elements only
 * - User uploads: Direct loading to avoid processing overhead
 * - External images: Direct loading to avoid proxy issues
 * - Placeholders: No optimization needed
 * 
 * Vercel Limit Management:
 * - Reserve optimization for critical above-the-fold images only
 * - Use direct loading for all other images to preserve limit
 * - Implement fallback strategies for when limit is reached
 */
export function getImageOptimizationConfig(
  imageSource: ImageSource,
  context: ImageContext
): ImageOptimizationConfig {
  const { type, isCritical = false } = imageSource;
  
  // Base configuration
  const baseConfig: ImageOptimizationConfig = {
    useOptimization: false,
    useBlurPlaceholder: false,
    priority: isCritical,
    loading: isCritical ? 'eager' : 'lazy',
    sizes: getDefaultSizes(context),
    useFallback: true,
  };

  // Strategy based on image type
  switch (type) {
    case 'plant_photo':
      return getPlantPhotoConfig(imageSource, context, baseConfig);
    
    case 'static_asset':
      return getStaticAssetConfig(imageSource, context, baseConfig);
    
    case 'user_upload':
      return getUserUploadConfig(imageSource, context, baseConfig);
    
    case 'external':
      return getExternalImageConfig(imageSource, context, baseConfig);
    
    case 'placeholder':
      return getPlaceholderConfig(imageSource, context, baseConfig);
    
    default:
      return baseConfig;
  }
}

/**
 * Plant photos from S3 - very conservative optimization to preserve Vercel limit
 */
function getPlantPhotoConfig(
  imageSource: ImageSource,
  context: ImageContext,
  baseConfig: ImageOptimizationConfig
): ImageOptimizationConfig {
  const isS3Image = imageSource.src.includes('s3.amazonaws.com') || 
                    imageSource.src.includes('eit-planttoolbox-prod.s3.amazonaws.com');
  
  if (!isS3Image) {
    return baseConfig;
  }

  // Only optimize for critical above-the-fold images to preserve Vercel limit
  if (context === 'hero' && imageSource.isCritical) {
    return {
      ...baseConfig,
      useOptimization: true,
      useBlurPlaceholder: true,
      quality: 75,
      sizes: getOptimizedSizes(context),
      priority: true,
      loading: 'eager',
    };
  }

  // For all other cases, use direct loading to preserve Vercel limit
  return {
    ...baseConfig,
    useOptimization: false,
    useBlurPlaceholder: false,
    sizes: getDirectSizes(context),
  };
}

/**
 * Static assets - only optimize critical UI elements to preserve Vercel limit
 */
function getStaticAssetConfig(
  imageSource: ImageSource,
  context: ImageContext,
  baseConfig: ImageOptimizationConfig
): ImageOptimizationConfig {
  // Only optimize hero images and critical UI elements
  if (context === 'hero' && imageSource.isCritical) {
    return {
      ...baseConfig,
      useOptimization: true,
      useBlurPlaceholder: true,
      quality: 85,
      sizes: getOptimizedSizes(context),
      priority: true,
      loading: 'eager',
    };
  }

  // For all other static assets, use direct loading
  return {
    ...baseConfig,
    useOptimization: false,
    useBlurPlaceholder: false,
    sizes: getDirectSizes(context),
  };
}

/**
 * User uploads - always direct loading to avoid processing overhead
 */
function getUserUploadConfig(
  imageSource: ImageSource,
  context: ImageContext,
  baseConfig: ImageOptimizationConfig
): ImageOptimizationConfig {
  return {
    ...baseConfig,
    useOptimization: false,
    useBlurPlaceholder: false,
    sizes: getDirectSizes(context),
  };
}

/**
 * External images - direct loading to avoid proxy issues
 */
function getExternalImageConfig(
  imageSource: ImageSource,
  context: ImageContext,
  baseConfig: ImageOptimizationConfig
): ImageOptimizationConfig {
  return {
    ...baseConfig,
    useOptimization: false,
    useBlurPlaceholder: false,
    sizes: getDirectSizes(context),
  };
}

/**
 * Placeholder images - no optimization needed
 */
function getPlaceholderConfig(
  imageSource: ImageSource,
  context: ImageContext,
  baseConfig: ImageOptimizationConfig
): ImageOptimizationConfig {
  return {
    ...baseConfig,
    useOptimization: false,
    useBlurPlaceholder: false,
    priority: false,
    loading: 'lazy',
  };
}

/**
 * Get optimized sizes for responsive loading
 */
function getOptimizedSizes(context: ImageContext): string {
  switch (context) {
    case 'card':
      return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw';
    case 'thumbnail':
      return '100px';
    case 'gallery':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
    case 'detail':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
    case 'hero':
      return '100vw';
    case 'static_asset':
      return '(max-width: 768px) 100vw, 50vw';
    default:
      return '100vw';
  }
}

/**
 * Get direct loading sizes (no optimization)
 */
function getDirectSizes(context: ImageContext): string {
  switch (context) {
    case 'card':
      return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw';
    case 'thumbnail':
      return '100px';
    case 'gallery':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
    case 'detail':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
    case 'hero':
      return '100vw';
    case 'static_asset':
      return '(max-width: 768px) 100vw, 50vw';
    default:
      return '100vw';
  }
}

/**
 * Get default sizes for responsive loading
 */
function getDefaultSizes(context: ImageContext): string {
  return getDirectSizes(context);
}

/**
 * Determine image type based on URL and context
 */
export function getImageType(src: string): ImageType {
  if (src.startsWith('/')) {
    // Check for placeholder images first
    if (src.includes('no-plant-image.png') || src.includes('sad-plant.png')) {
      return 'placeholder';
    }
    return 'static_asset';
  }
  
  if (src.includes('s3.amazonaws.com') || src.includes('eit-planttoolbox-prod.s3.amazonaws.com')) {
    return 'plant_photo';
  }
  
  if (src.includes('theofficialgreenthumb.com')) {
    return 'static_asset';
  }
  
  // Assume external if it's a full URL
  if (src.startsWith('http')) {
    return 'external';
  }
  
  return 'static_asset';
}

/**
 * Generate a simple blur placeholder for images
 */
export function generateBlurPlaceholder(): string {
  // Simple base64 blur placeholder
  return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxAAPwCdABmX/9k=';
}
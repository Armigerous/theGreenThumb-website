// lib/vercelImageLimit.ts
// Utility to monitor and manage Vercel's image optimization limit

interface VercelLimitInfo {
  /** Current usage count */
  currentUsage: number;
  /** Maximum allowed usage */
  maxUsage: number;
  /** Usage percentage */
  usagePercentage: number;
  /** Whether we're approaching the limit */
  isApproachingLimit: boolean;
  /** Whether we've hit the limit */
  isAtLimit: boolean;
}

/**
 * Storage key for Vercel image usage tracking
 */
const STORAGE_KEY = 'vercel-image-usage';

/**
 * Maximum allowed image optimizations per month
 */
const MAX_USAGE = 5000;

/**
 * Warning threshold (80% of limit)
 */
const WARNING_THRESHOLD = 0.8;

/**
 * Simulate Vercel limit monitoring (in real implementation, this would call Vercel API)
 * Uses localStorage for client-side tracking
 */
export function getVercelImageLimitInfo(): VercelLimitInfo {
  // In a real implementation, this would fetch from Vercel API
  // For now, we'll simulate based on localStorage or session data
  const storedUsage = typeof window !== 'undefined' 
    ? localStorage.getItem(STORAGE_KEY) 
    : null;
  
  const currentUsage = storedUsage ? parseInt(storedUsage, 10) : 0;
  const usagePercentage = (currentUsage / MAX_USAGE) * 100;
  
  return {
    currentUsage,
    maxUsage: MAX_USAGE,
    usagePercentage,
    isApproachingLimit: usagePercentage > (WARNING_THRESHOLD * 100),
    isAtLimit: currentUsage >= MAX_USAGE,
  };
}

/**
 * Track image optimization usage
 * Increments the counter and logs warnings/errors
 */
export function trackImageOptimization(): void {
  if (typeof window === 'undefined') return;
  
  const currentUsage = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  const newUsage = currentUsage + 1;
  
  localStorage.setItem(STORAGE_KEY, newUsage.toString());
  
  // Log warning if approaching limit
  if (newUsage > MAX_USAGE * WARNING_THRESHOLD) {
    console.warn(`Vercel image optimization usage: ${newUsage}/${MAX_USAGE} (${(newUsage/MAX_USAGE)*100}%)`);
  }
  
  // Log error if at limit
  if (newUsage >= MAX_USAGE) {
    console.error('Vercel image optimization limit reached! Images may not display.');
  }
}

/**
 * Reset usage counter (useful for testing or monthly resets)
 */
export function resetImageOptimizationUsage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get optimization strategy based on current usage and image context
 * Returns 'optimize', 'direct', or 'fallback' based on limit status
 */
export function getOptimizationStrategy(context: string, isCritical: boolean): 'optimize' | 'direct' | 'fallback' {
  const limitInfo = getVercelImageLimitInfo();
  
  // Always fallback if limit is reached
  if (limitInfo.isAtLimit) {
    return 'fallback';
  }
  
  // Use direct loading for non-critical images to preserve limit
  if (!isCritical) {
    return 'direct';
  }
  
  // Use direct loading for gallery and detail contexts to preserve limit
  if (context === 'gallery' || context === 'detail') {
    return 'direct';
  }
  
  return 'optimize';
}

/**
 * Log current usage for debugging and monitoring
 */
export function logImageOptimizationUsage(): void {
  const limitInfo = getVercelImageLimitInfo();
  console.log(`Vercel Image Optimization Usage: ${limitInfo.currentUsage}/${limitInfo.maxUsage} (${limitInfo.usagePercentage.toFixed(1)}%)`);
  
  if (limitInfo.isApproachingLimit) {
    console.warn('⚠️ Approaching Vercel image optimization limit');
  }
  
  if (limitInfo.isAtLimit) {
    console.error('🚨 Vercel image optimization limit reached!');
  }
}
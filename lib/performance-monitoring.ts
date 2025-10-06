/**
 * Performance Monitoring Utilities
 * 
 * Provides comprehensive Core Web Vitals monitoring and performance tracking
 * for the GreenThumb plant slug pages and overall application performance.
 */

// Core Web Vitals thresholds based on Google's recommendations
export const CORE_WEB_VITALS_THRESHOLDS = {
  // Largest Contentful Paint - measures loading performance
  LCP: {
    good: 2500,    // 2.5 seconds or less
    needsImprovement: 4000, // 2.5-4 seconds
    poor: 4000,    // Over 4 seconds
  },
  // First Input Delay - measures interactivity
  FID: {
    good: 100,     // 100ms or less
    needsImprovement: 300,  // 100-300ms
    poor: 300,     // Over 300ms
  },
  // Cumulative Layout Shift - measures visual stability
  CLS: {
    good: 0.1,     // 0.1 or less
    needsImprovement: 0.25, // 0.1-0.25
    poor: 0.25,    // Over 0.25
  },
  // First Contentful Paint - measures loading performance
  FCP: {
    good: 1800,    // 1.8 seconds or less
    needsImprovement: 3000, // 1.8-3 seconds
    poor: 3000,    // Over 3 seconds
  },
  // Time to First Byte - measures server response time
  TTFB: {
    good: 600,     // 600ms or less
    needsImprovement: 1500, // 600ms-1.5s
    poor: 1500,    // Over 1.5 seconds
  },
} as const;

export type CoreWebVitalMetric = 'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB';
export type PerformanceRating = 'good' | 'needs-improvement' | 'poor';

/**
 * Performance metric data structure
 */
export interface PerformanceMetric {
  name: CoreWebVitalMetric;
  value: number;
  rating: PerformanceRating;
  timestamp: number;
  url: string;
  userAgent: string;
  connection?: string;
  deviceType?: 'mobile' | 'desktop' | 'tablet';
}

/**
 * Performance budget configuration
 */
export interface PerformanceBudget {
  metric: CoreWebVitalMetric;
  threshold: number;
  warningThreshold: number;
}

export const PERFORMANCE_BUDGETS: PerformanceBudget[] = [
  {
    metric: 'LCP',
    threshold: 2500, // 2.5s target
    warningThreshold: 2000, // 2s warning
  },
  {
    metric: 'FCP',
    threshold: 1800, // 1.8s target
    warningThreshold: 1500, // 1.5s warning
  },
  {
    metric: 'TTFB',
    threshold: 600, // 600ms target
    warningThreshold: 500, // 500ms warning
  },
  {
    metric: 'CLS',
    threshold: 0.1,
    warningThreshold: 0.08,
  },
  {
    metric: 'FID',
    threshold: 100, // 100ms target
    warningThreshold: 80, // 80ms warning
  },
];

/**
 * Determines performance rating based on Core Web Vitals thresholds
 */
export function getPerformanceRating(metric: CoreWebVitalMetric, value: number): PerformanceRating {
  const thresholds = CORE_WEB_VITALS_THRESHOLDS[metric];
  
  if (value <= thresholds.good) {
    return 'good';
  } else if (value <= thresholds.needsImprovement) {
    return 'needs-improvement';
  } else {
    return 'poor';
  }
}

/**
 * Checks if a performance metric exceeds the budget
 */
export function checkPerformanceBudget(metric: CoreWebVitalMetric, value: number): {
  exceedsBudget: boolean;
  exceedsWarning: boolean;
  budget: PerformanceBudget;
} {
  const budget = PERFORMANCE_BUDGETS.find(b => b.metric === metric);
  
  if (!budget) {
    return {
      exceedsBudget: false,
      exceedsWarning: false,
      budget: { metric, threshold: 0, warningThreshold: 0 },
    };
  }
  
  return {
    exceedsBudget: value > budget.threshold,
    exceedsWarning: value > budget.warningThreshold,
    budget,
  };
}

/**
 * Creates a performance metric object
 */
export function createPerformanceMetric(
  name: CoreWebVitalMetric,
  value: number,
  url: string = typeof window !== 'undefined' ? window.location.href : ''
): PerformanceMetric {
  return {
    name,
    value,
    rating: getPerformanceRating(name, value),
    timestamp: Date.now(),
    url,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'SSR',
    connection: typeof navigator !== 'undefined' ? (navigator as Navigator & { connection?: { effectiveType?: string } }).connection?.effectiveType : undefined,
    deviceType: getDeviceType(),
  };
}

/**
 * Determines device type based on user agent and screen size
 */
function getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return 'desktop'; // Default fallback for SSR
  }
  
  const userAgent = navigator.userAgent.toLowerCase();
  const screenWidth = window.screen.width;
  
  if (/tablet|ipad|playbook|silk/i.test(userAgent) || 
      (screenWidth >= 768 && screenWidth <= 1024)) {
    return 'tablet';
  }
  
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent) ||
      screenWidth < 768) {
    return 'mobile';
  }
  
  return 'desktop';
}

/**
 * Logs performance metrics to console in development
 */
export function logPerformanceMetric(metric: PerformanceMetric): void {
  if (process.env.NODE_ENV === 'development') {
    const budgetCheck = checkPerformanceBudget(metric.name, metric.value);
    
    console.group(`🚀 Core Web Vital: ${metric.name}`);
    console.log(`Value: ${metric.value}ms`);
    console.log(`Rating: ${metric.rating}`);
    console.log(`Budget Check:`, budgetCheck);
    console.log(`Device: ${metric.deviceType}`);
    console.log(`Connection: ${metric.connection || 'unknown'}`);
    console.groupEnd();
    
    // Log warnings for budget violations
    if (budgetCheck.exceedsBudget) {
      console.warn(`⚠️ Performance Budget Exceeded: ${metric.name} is ${metric.value}ms (budget: ${budgetCheck.budget.threshold}ms)`);
    } else if (budgetCheck.exceedsWarning) {
      console.warn(`⚠️ Performance Warning: ${metric.name} is ${metric.value}ms (warning threshold: ${budgetCheck.budget.warningThreshold}ms)`);
    }
  }
}

/**
 * Sends performance metrics to analytics services
 */
export function sendPerformanceMetric(metric: PerformanceMetric): void {
  // Send to Vercel Analytics (already configured)
  if (typeof window !== 'undefined') {
    const windowWithVA = window as typeof window & { va?: (...args: unknown[]) => void };
    if (windowWithVA.va) {
      windowWithVA.va('track', `core-web-vital-${metric.name.toLowerCase()}`, {
        value: metric.value,
        rating: metric.rating,
        deviceType: metric.deviceType,
        connection: metric.connection,
      });
    }
  }
  
  // Send to Google Analytics (already configured)
  if (typeof window !== 'undefined') {
    const windowWithGtag = window as typeof window & { gtag?: (...args: unknown[]) => void };
    if (windowWithGtag.gtag) {
      windowWithGtag.gtag('event', 'core_web_vital', {
        event_category: 'Performance',
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_parameter_1: metric.rating,
        custom_parameter_2: metric.deviceType,
      });
    }
  }
  
  // Log to console in development
  logPerformanceMetric(metric);
}

/**
 * Performance monitoring hook for React components
 */
export function usePerformanceMonitoring() {
  const trackMetric = (name: CoreWebVitalMetric, value: number) => {
    const metric = createPerformanceMetric(name, value);
    sendPerformanceMetric(metric);
  };
  
  return { trackMetric };
}

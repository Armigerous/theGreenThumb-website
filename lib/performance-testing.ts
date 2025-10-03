/**
 * Performance Testing Utilities
 * 
 * Provides automated performance testing capabilities for regression testing
 * and continuous performance monitoring.
 */

import { CORE_WEB_VITALS_THRESHOLDS, type CoreWebVitalMetric } from './performance-monitoring';

/**
 * Performance test configuration
 */
export interface PerformanceTestConfig {
  /**
   * URL to test
   */
  url: string;
  /**
   * Expected performance thresholds
   */
  thresholds: Partial<Record<CoreWebVitalMetric, number>>;
  /**
   * Number of test runs for averaging
   */
  runs?: number;
  /**
   * Whether to run in mobile viewport
   */
  mobile?: boolean;
  /**
   * Custom timeout for tests
   */
  timeout?: number;
}

/**
 * Performance test result
 */
export interface PerformanceTestResult {
  /**
   * Test configuration used
   */
  config: PerformanceTestConfig;
  /**
   * Individual test run results
   */
  runs: PerformanceRunResult[];
  /**
   * Averaged metrics across all runs
   */
  averages: Record<CoreWebVitalMetric, number>;
  /**
   * Overall test status
   */
  status: 'pass' | 'fail' | 'warning';
  /**
   * Failed thresholds
   */
  failures: Array<{
    metric: CoreWebVitalMetric;
    actual: number;
    expected: number;
  }>;
  /**
   * Test execution time
   */
  executionTime: number;
}

/**
 * Individual test run result
 */
export interface PerformanceRunResult {
  /**
   * Run number (1-based)
   */
  run: number;
  /**
   * Metrics captured in this run
   */
  metrics: Record<CoreWebVitalMetric, number>;
  /**
   * Run duration
   */
  duration: number;
  /**
   * Any errors during the run
   */
  error?: string;
}

/**
 * Default performance thresholds for plant pages
 */
export const PLANT_PAGE_THRESHOLDS = {
  LCP: 2500,  // 2.5 seconds
  FCP: 1800,  // 1.8 seconds
  TTFB: 600,  // 600ms
  CLS: 0.1,   // 0.1
  FID: 100,   // 100ms
} as const;

/**
 * Default performance thresholds for home page
 */
export const HOME_PAGE_THRESHOLDS = {
  LCP: 2000,  // 2 seconds
  FCP: 1500,  // 1.5 seconds
  TTFB: 500,  // 500ms
  CLS: 0.1,   // 0.1
  FID: 100,   // 100ms
} as const;

/**
 * Performance test suite configuration
 */
export interface PerformanceTestSuite {
  /**
   * Test suite name
   */
  name: string;
  /**
   * Test configurations
   */
  tests: PerformanceTestConfig[];
  /**
   * Global configuration
   */
  globalConfig?: Partial<PerformanceTestConfig>;
}

/**
 * Creates a performance test configuration for plant pages
 */
export function createPlantPageTestConfig(
  slug: string,
  customThresholds?: Partial<Record<CoreWebVitalMetric, number>>,
  baseUrl?: string
): PerformanceTestConfig {
  const url = baseUrl ? `${baseUrl}/plant/${slug}` : `/plant/${slug}`;
  return {
    url,
    thresholds: { ...PLANT_PAGE_THRESHOLDS, ...customThresholds },
    runs: 3,
    mobile: false,
    timeout: 30000,
  };
}

/**
 * Creates a performance test configuration for home page
 */
export function createHomePageTestConfig(
  customThresholds?: Partial<Record<CoreWebVitalMetric, number>>,
  baseUrl?: string
): PerformanceTestConfig {
  const url = baseUrl ? `${baseUrl}/` : '/';
  return {
    url,
    thresholds: { ...HOME_PAGE_THRESHOLDS, ...customThresholds },
    runs: 3,
    mobile: false,
    timeout: 30000,
  };
}

/**
 * Validates performance metrics against thresholds
 */
export function validatePerformanceMetrics(
  metrics: Record<CoreWebVitalMetric, number>,
  thresholds: Record<CoreWebVitalMetric, number>
): {
  status: 'pass' | 'fail' | 'warning';
  failures: Array<{ metric: CoreWebVitalMetric; actual: number; expected: number }>;
} {
  const failures: Array<{ metric: CoreWebVitalMetric; actual: number; expected: number }> = [];
  
  for (const [metric, actual] of Object.entries(metrics) as Array<[CoreWebVitalMetric, number]>) {
    const expected = thresholds[metric];
    
    if (expected && actual > expected) {
      failures.push({ metric, actual, expected });
    }
  }
  
  if (failures.length === 0) {
    return { status: 'pass', failures: [] };
  }
  
  // Check if any failures are critical (exceed poor threshold)
  const criticalFailures = failures.filter(failure => {
    const poorThreshold = CORE_WEB_VITALS_THRESHOLDS[failure.metric].poor;
    return failure.actual > poorThreshold;
  });
  
  return {
    status: criticalFailures.length > 0 ? 'fail' : 'warning',
    failures,
  };
}

/**
 * Calculates average metrics across multiple test runs
 */
export function calculateAverageMetrics(runs: PerformanceRunResult[]): Record<CoreWebVitalMetric, number> {
  const averages: Partial<Record<CoreWebVitalMetric, number>> = {};
  
  for (const metric of Object.keys(CORE_WEB_VITALS_THRESHOLDS) as CoreWebVitalMetric[]) {
    const values = runs
      .filter(run => run.metrics[metric] !== undefined)
      .map(run => run.metrics[metric]);
    
    if (values.length > 0) {
      averages[metric] = values.reduce((sum, value) => sum + value, 0) / values.length;
    }
  }
  
  return averages as Record<CoreWebVitalMetric, number>;
}

/**
 * Generates a performance test report
 */
export function generatePerformanceReport(result: PerformanceTestResult): string {
  const { config, averages, status, failures, executionTime } = result;
  
  let report = `# Performance Test Report\n\n`;
  report += `**URL**: ${config.url}\n`;
  report += `**Status**: ${status.toUpperCase()}\n`;
  report += `**Execution Time**: ${executionTime}ms\n`;
  report += `**Test Runs**: ${result.runs.length}\n\n`;
  
  report += `## Performance Metrics\n\n`;
  report += `| Metric | Average | Threshold | Status |\n`;
  report += `|--------|---------|-----------|--------|\n`;
  
  for (const [metric, value] of Object.entries(averages) as Array<[CoreWebVitalMetric, number]>) {
    const threshold = config.thresholds[metric];
    const metricStatus = threshold && value > threshold ? '❌ FAIL' : '✅ PASS';
    
    report += `| ${metric} | ${Math.round(value)}ms | ${threshold || 'N/A'}ms | ${metricStatus} |\n`;
  }
  
  if (failures.length > 0) {
    report += `\n## Failures\n\n`;
    report += `| Metric | Actual | Expected | Difference |\n`;
    report += `|--------|--------|----------|------------|\n`;
    
    for (const failure of failures) {
      const difference = failure.actual - failure.expected;
      report += `| ${failure.metric} | ${Math.round(failure.actual)}ms | ${failure.expected}ms | +${Math.round(difference)}ms |\n`;
    }
  }
  
  report += `\n## Recommendations\n\n`;
  
  if (failures.length > 0) {
    report += `- Review and optimize the following metrics that exceed thresholds:\n`;
    for (const failure of failures) {
      report += `  - **${failure.metric}**: Current ${Math.round(failure.actual)}ms, target ${failure.expected}ms\n`;
    }
  } else {
    report += `- ✅ All performance metrics are within acceptable thresholds\n`;
  }
  
  return report;
}

/**
 * Performance test suite for critical pages
 */
export function createCriticalPagesTestSuite(baseUrl?: string): PerformanceTestSuite {
  return {
    name: 'Critical Pages Performance',
    tests: [
      createHomePageTestConfig(undefined, baseUrl),
      createPlantPageTestConfig('monstera-deliciosa', undefined, baseUrl), // Popular plant
      createPlantPageTestConfig('snake-plant', undefined, baseUrl), // Another popular plant
    ],
    globalConfig: {
      runs: 3,
      timeout: 30000,
    },
  };
}

/**
 * Performance test suite for mobile pages
 */
export function createMobilePagesTestSuite(baseUrl?: string): PerformanceTestSuite {
  return {
    name: 'Mobile Pages Performance',
    tests: [
      createHomePageTestConfig(undefined, baseUrl),
      createPlantPageTestConfig('monstera-deliciosa', undefined, baseUrl),
    ],
    globalConfig: {
      runs: 3,
      mobile: true,
      timeout: 30000,
    },
  };
}

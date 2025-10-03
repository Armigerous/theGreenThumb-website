/**
 * Unit tests for performance monitoring utilities
 * 
 * Tests the core performance monitoring functions with proper isolation
 * and TDD principles.
 */

import { describe, test, expect } from 'vitest';
import {
  getPerformanceRating,
  checkPerformanceBudget,
  createPerformanceMetric,
  CORE_WEB_VITALS_THRESHOLDS,
  PERFORMANCE_BUDGETS,
} from '../performance-monitoring';

// Browser environment is mocked in setup.ts

describe('getPerformanceRating', () => {
  test('given LCP value of 2000ms, should return good rating', () => {
    const result = getPerformanceRating('LCP', 2000);
    expect(result).toBe('good');
  });

  test('given LCP value of 3000ms, should return needs-improvement rating', () => {
    const result = getPerformanceRating('LCP', 3000);
    expect(result).toBe('needs-improvement');
  });

  test('given LCP value of 5000ms, should return poor rating', () => {
    const result = getPerformanceRating('LCP', 5000);
    expect(result).toBe('poor');
  });

  test('given FCP value of 1000ms, should return good rating', () => {
    const result = getPerformanceRating('FCP', 1000);
    expect(result).toBe('good');
  });

  test('given FCP value of 2500ms, should return needs-improvement rating', () => {
    const result = getPerformanceRating('FCP', 2500);
    expect(result).toBe('needs-improvement');
  });

  test('given FCP value of 3500ms, should return poor rating', () => {
    const result = getPerformanceRating('FCP', 3500);
    expect(result).toBe('poor');
  });

  test('given TTFB value of 400ms, should return good rating', () => {
    const result = getPerformanceRating('TTFB', 400);
    expect(result).toBe('good');
  });

  test('given TTFB value of 1000ms, should return needs-improvement rating', () => {
    const result = getPerformanceRating('TTFB', 1000);
    expect(result).toBe('needs-improvement');
  });

  test('given TTFB value of 2000ms, should return poor rating', () => {
    const result = getPerformanceRating('TTFB', 2000);
    expect(result).toBe('poor');
  });

  test('given CLS value of 0.05, should return good rating', () => {
    const result = getPerformanceRating('CLS', 0.05);
    expect(result).toBe('good');
  });

  test('given CLS value of 0.15, should return needs-improvement rating', () => {
    const result = getPerformanceRating('CLS', 0.15);
    expect(result).toBe('needs-improvement');
  });

  test('given CLS value of 0.3, should return poor rating', () => {
    const result = getPerformanceRating('CLS', 0.3);
    expect(result).toBe('poor');
  });

  test('given FID value of 50ms, should return good rating', () => {
    const result = getPerformanceRating('FID', 50);
    expect(result).toBe('good');
  });

  test('given FID value of 200ms, should return needs-improvement rating', () => {
    const result = getPerformanceRating('FID', 200);
    expect(result).toBe('needs-improvement');
  });

  test('given FID value of 400ms, should return poor rating', () => {
    const result = getPerformanceRating('FID', 400);
    expect(result).toBe('poor');
  });
});

describe('checkPerformanceBudget', () => {
  test('given LCP value of 2000ms, should not exceed budget', () => {
    const result = checkPerformanceBudget('LCP', 2000);
    expect(result.exceedsBudget).toBe(false);
    expect(result.exceedsWarning).toBe(false);
    expect(result.budget.threshold).toBe(2500);
  });

  test('given LCP value of 2200ms, should exceed warning but not budget', () => {
    const result = checkPerformanceBudget('LCP', 2200);
    expect(result.exceedsBudget).toBe(false);
    expect(result.exceedsWarning).toBe(true);
    expect(result.budget.warningThreshold).toBe(2000);
  });

  test('given LCP value of 3000ms, should exceed both warning and budget', () => {
    const result = checkPerformanceBudget('LCP', 3000);
    expect(result.exceedsBudget).toBe(true);
    expect(result.exceedsWarning).toBe(true);
    expect(result.budget.threshold).toBe(2500);
  });

  test('given FCP value of 1200ms, should not exceed budget', () => {
    const result = checkPerformanceBudget('FCP', 1200);
    expect(result.exceedsBudget).toBe(false);
    expect(result.exceedsWarning).toBe(false);
    expect(result.budget.threshold).toBe(1800);
  });

  test('given FCP value of 1600ms, should exceed warning but not budget', () => {
    const result = checkPerformanceBudget('FCP', 1600);
    expect(result.exceedsBudget).toBe(false);
    expect(result.exceedsWarning).toBe(true);
    expect(result.budget.warningThreshold).toBe(1500);
  });

  test('given FCP value of 2000ms, should exceed both warning and budget', () => {
    const result = checkPerformanceBudget('FCP', 2000);
    expect(result.exceedsBudget).toBe(true);
    expect(result.exceedsWarning).toBe(true);
    expect(result.budget.threshold).toBe(1800);
  });

  test('given TTFB value of 400ms, should not exceed budget', () => {
    const result = checkPerformanceBudget('TTFB', 400);
    expect(result.exceedsBudget).toBe(false);
    expect(result.exceedsWarning).toBe(false);
    expect(result.budget.threshold).toBe(600);
  });

  test('given TTFB value of 550ms, should exceed warning but not budget', () => {
    const result = checkPerformanceBudget('TTFB', 550);
    expect(result.exceedsBudget).toBe(false);
    expect(result.exceedsWarning).toBe(true);
    expect(result.budget.warningThreshold).toBe(500);
  });

  test('given TTFB value of 800ms, should exceed both warning and budget', () => {
    const result = checkPerformanceBudget('TTFB', 800);
    expect(result.exceedsBudget).toBe(true);
    expect(result.exceedsWarning).toBe(true);
    expect(result.budget.threshold).toBe(600);
  });

  test('given CLS value of 0.05, should not exceed budget', () => {
    const result = checkPerformanceBudget('CLS', 0.05);
    expect(result.exceedsBudget).toBe(false);
    expect(result.exceedsWarning).toBe(false);
    expect(result.budget.threshold).toBe(0.1);
  });

  test('given CLS value of 0.09, should exceed warning but not budget', () => {
    const result = checkPerformanceBudget('CLS', 0.09);
    expect(result.exceedsBudget).toBe(false);
    expect(result.exceedsWarning).toBe(true);
    expect(result.budget.warningThreshold).toBe(0.08);
  });

  test('given CLS value of 0.15, should exceed both warning and budget', () => {
    const result = checkPerformanceBudget('CLS', 0.15);
    expect(result.exceedsBudget).toBe(true);
    expect(result.exceedsWarning).toBe(true);
    expect(result.budget.threshold).toBe(0.1);
  });

  test('given FID value of 50ms, should not exceed budget', () => {
    const result = checkPerformanceBudget('FID', 50);
    expect(result.exceedsBudget).toBe(false);
    expect(result.exceedsWarning).toBe(false);
    expect(result.budget.threshold).toBe(100);
  });

  test('given FID value of 90ms, should exceed warning but not budget', () => {
    const result = checkPerformanceBudget('FID', 90);
    expect(result.exceedsBudget).toBe(false);
    expect(result.exceedsWarning).toBe(true);
    expect(result.budget.warningThreshold).toBe(80);
  });

  test('given FID value of 150ms, should exceed both warning and budget', () => {
    const result = checkPerformanceBudget('FID', 150);
    expect(result.exceedsBudget).toBe(true);
    expect(result.exceedsWarning).toBe(true);
    expect(result.budget.threshold).toBe(100);
  });
});

describe('createPerformanceMetric', () => {
  // Timers are already set up in setup.ts

  test('given LCP metric with value 2000ms, should create correct metric object', () => {
    const result = createPerformanceMetric('LCP', 2000);
    
    expect(result.name).toBe('LCP');
    expect(result.value).toBe(2000);
    expect(result.rating).toBe('good');
    expect(result.timestamp).toBe(1672531200000);
    expect(result.url).toBe('http://localhost:3000');
    expect(result.userAgent).toBe('Mozilla/5.0 (Test Browser)');
    expect(result.connection).toBe('4g');
    expect(result.deviceType).toBe('desktop');
  });

  test('given FCP metric with value 3000ms, should create correct metric object', () => {
    const result = createPerformanceMetric('FCP', 3000);
    
    expect(result.name).toBe('FCP');
    expect(result.value).toBe(3000);
    expect(result.rating).toBe('needs-improvement');
    expect(result.timestamp).toBe(1672531200000);
    expect(result.url).toBe('http://localhost:3000');
    expect(result.userAgent).toBe('Mozilla/5.0 (Test Browser)');
    expect(result.connection).toBe('4g');
    expect(result.deviceType).toBe('desktop');
  });

  test('given custom URL, should use provided URL', () => {
    const customUrl = 'https://example.com/test';
    const result = createPerformanceMetric('LCP', 2000, customUrl);
    
    expect(result.url).toBe(customUrl);
  });

  test('given SSR environment, should handle missing window object', () => {
    // Mock SSR environment
    const originalWindow = global.window;
    const originalNavigator = global.navigator;
    
    Object.defineProperty(global, 'window', {
      value: undefined,
      writable: true,
    });

    Object.defineProperty(global, 'navigator', {
      value: undefined,
      writable: true,
    });

    const result = createPerformanceMetric('LCP', 2000);
    
    expect(result.url).toBe('');
    expect(result.userAgent).toBe('SSR');
    expect(result.connection).toBeUndefined();
    expect(result.deviceType).toBe('desktop'); // Default fallback
    
    // Restore original values
    Object.defineProperty(global, 'window', {
      value: originalWindow,
      writable: true,
    });

    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
    });
  });
});

describe('CORE_WEB_VITALS_THRESHOLDS', () => {
  test('should have correct LCP thresholds', () => {
    expect(CORE_WEB_VITALS_THRESHOLDS.LCP.good).toBe(2500);
    expect(CORE_WEB_VITALS_THRESHOLDS.LCP.needsImprovement).toBe(4000);
    expect(CORE_WEB_VITALS_THRESHOLDS.LCP.poor).toBe(4000);
  });

  test('should have correct FCP thresholds', () => {
    expect(CORE_WEB_VITALS_THRESHOLDS.FCP.good).toBe(1800);
    expect(CORE_WEB_VITALS_THRESHOLDS.FCP.needsImprovement).toBe(3000);
    expect(CORE_WEB_VITALS_THRESHOLDS.FCP.poor).toBe(3000);
  });

  test('should have correct TTFB thresholds', () => {
    expect(CORE_WEB_VITALS_THRESHOLDS.TTFB.good).toBe(600);
    expect(CORE_WEB_VITALS_THRESHOLDS.TTFB.needsImprovement).toBe(1500);
    expect(CORE_WEB_VITALS_THRESHOLDS.TTFB.poor).toBe(1500);
  });

  test('should have correct CLS thresholds', () => {
    expect(CORE_WEB_VITALS_THRESHOLDS.CLS.good).toBe(0.1);
    expect(CORE_WEB_VITALS_THRESHOLDS.CLS.needsImprovement).toBe(0.25);
    expect(CORE_WEB_VITALS_THRESHOLDS.CLS.poor).toBe(0.25);
  });

  test('should have correct FID thresholds', () => {
    expect(CORE_WEB_VITALS_THRESHOLDS.FID.good).toBe(100);
    expect(CORE_WEB_VITALS_THRESHOLDS.FID.needsImprovement).toBe(300);
    expect(CORE_WEB_VITALS_THRESHOLDS.FID.poor).toBe(300);
  });
});

describe('PERFORMANCE_BUDGETS', () => {
  test('should have correct LCP budget', () => {
    const lcpBudget = PERFORMANCE_BUDGETS.find(b => b.metric === 'LCP');
    expect(lcpBudget).toBeDefined();
    expect(lcpBudget?.threshold).toBe(2500);
    expect(lcpBudget?.warningThreshold).toBe(2000);
  });

  test('should have correct FCP budget', () => {
    const fcpBudget = PERFORMANCE_BUDGETS.find(b => b.metric === 'FCP');
    expect(fcpBudget).toBeDefined();
    expect(fcpBudget?.threshold).toBe(1800);
    expect(fcpBudget?.warningThreshold).toBe(1500);
  });

  test('should have correct TTFB budget', () => {
    const ttfbBudget = PERFORMANCE_BUDGETS.find(b => b.metric === 'TTFB');
    expect(ttfbBudget).toBeDefined();
    expect(ttfbBudget?.threshold).toBe(600);
    expect(ttfbBudget?.warningThreshold).toBe(500);
  });

  test('should have correct CLS budget', () => {
    const clsBudget = PERFORMANCE_BUDGETS.find(b => b.metric === 'CLS');
    expect(clsBudget).toBeDefined();
    expect(clsBudget?.threshold).toBe(0.1);
    expect(clsBudget?.warningThreshold).toBe(0.08);
  });

  test('should have correct FID budget', () => {
    const fidBudget = PERFORMANCE_BUDGETS.find(b => b.metric === 'FID');
    expect(fidBudget).toBeDefined();
    expect(fidBudget?.threshold).toBe(100);
    expect(fidBudget?.warningThreshold).toBe(80);
  });
});

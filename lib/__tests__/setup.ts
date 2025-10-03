/**
 * Vitest setup file for performance monitoring tests
 * 
 * Provides global test configuration and mocks for browser APIs
 */

import { vi } from 'vitest';

// Mock browser environment for performance monitoring tests
Object.defineProperty(global, 'window', {
  value: {
    location: { href: 'http://localhost:3000' },
    navigator: {
      userAgent: 'Mozilla/5.0 (Test Browser)',
      connection: { effectiveType: '4g' },
    },
    screen: { width: 1920 },
    va: vi.fn(),
    gtag: vi.fn(),
  },
  writable: true,
})

Object.defineProperty(global, 'navigator', {
  value: {
    userAgent: 'Mozilla/5.0 (Test Browser)',
    connection: { effectiveType: '4g' },
  },
  writable: true,
})

Object.defineProperty(global, 'screen', {
  value: { width: 1920 },
  writable: true,
})

// Mock performance API
Object.defineProperty(global, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn(() => []),
  },
  writable: true,
})

// Mock Date.now for consistent timestamps
const mockDate = new Date('2023-01-01T00:00:00Z')
vi.useFakeTimers()
vi.setSystemTime(mockDate)

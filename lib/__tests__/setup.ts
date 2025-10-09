/**
 * Vitest setup file for comprehensive testing
 * 
 * Provides global test configuration and mocks for browser APIs, database, and external services
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

// Mock console methods to reduce test output noise
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}

// Mock Next.js specific globals
global.NextRequest = class NextRequest {
  constructor(public url: string, public init?: RequestInit) {}
}

global.NextResponse = {
  json: vi.fn((data: any, init?: ResponseInit) => ({
    status: init?.status || 200,
    json: vi.fn().mockResolvedValue(data),
    headers: new Headers(init?.headers),
  })),
}

// Mock environment variables
process.env.NODE_ENV = 'test'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'test-key'
process.env.CLERK_SECRET_KEY = 'test-secret'

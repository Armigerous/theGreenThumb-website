# 🚀 Performance Testing Quick Start Guide

## Overview

This guide provides a quick start to the GreenThumb performance testing system, which includes Core Web Vitals monitoring, automated testing, and CI/CD integration.

## Quick Start

### 1. Verify Installation

```bash
# Check if all performance monitoring components are properly installed
node test-performance-monitoring.js
```

### 2. Run Local Performance Tests

```bash
# Start the development server
pnpm run dev

# In another terminal, run performance tests
pnpm run perf:local
```

### 3. Run Lighthouse CI Tests

```bash
# Run Lighthouse CI with full configuration
pnpm run perf:test
```

### 4. Run Performance Audit

```bash
# Run a single Lighthouse audit
NEXT_PUBLIC_BASE_URL=http://localhost:3000 pnpm run perf:audit
```

## Available Scripts

| Script            | Description                                      | Usage                      |
| ----------------- | ------------------------------------------------ | -------------------------- |
| `perf:local`      | Local performance testing with server management | `pnpm run perf:local`      |
| `perf:test`       | Lighthouse CI with full configuration            | `pnpm run perf:test`       |
| `perf:audit`      | Single Lighthouse audit                          | `pnpm run perf:audit`      |
| `perf:automation` | CI/CD automation script                          | `pnpm run perf:automation` |
| `lighthouse`      | Basic Lighthouse CI                              | `pnpm run lighthouse`      |
| `lighthouse:ci`   | Lighthouse CI with upload                        | `pnpm run lighthouse:ci`   |

## Performance Monitoring

### Core Web Vitals

The system automatically tracks these metrics:

- **LCP** (Largest Contentful Paint) - Loading performance
- **FCP** (First Contentful Paint) - Loading performance
- **FID** (First Input Delay) - Interactivity
- **CLS** (Cumulative Layout Shift) - Visual stability
- **TTFB** (Time to First Byte) - Server response time

### Performance Budgets

#### Home Page

- LCP: ≤ 2.0s
- FCP: ≤ 1.5s
- TTFB: ≤ 500ms
- CLS: ≤ 0.1
- FID: ≤ 100ms

#### Plant Pages

- LCP: ≤ 2.5s
- FCP: ≤ 1.8s
- TTFB: ≤ 600ms
- CLS: ≤ 0.1
- FID: ≤ 100ms

## Configuration

### Environment Variables

```bash
# Base URL for testing
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Performance budgets (optional)
LCP_BUDGET=2500
FCP_BUDGET=1800
TTFB_BUDGET=600
CLS_BUDGET=0.1
FID_BUDGET=100

# Test configuration
PERF_TEST_RUNS=3
PERF_TEST_TIMEOUT=60000
PERF_OUTPUT_DIR=./performance-results
```

### Lighthouse CI Configuration

The main configuration is in `lighthouse-ci.config.js`:

```javascript
export default {
	ci: {
		collect: {
			baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
			// ... configuration
		},
		assert: {
			assertions: {
				"categories:performance": ["error", { minScore: 0.8 }],
				"largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
				// ... more assertions
			},
		},
	},
};
```

## CI/CD Integration

### GitHub Actions

The system includes a GitHub Actions workflow (`.github/workflows/performance-test.yml`) that:

- Runs on push to main/development branches
- Runs on pull requests
- Runs daily at 2 AM UTC
- Uploads results as artifacts
- Comments on PRs with results
- Creates issues on performance regressions

### Manual CI Testing

```bash
# Test the CI configuration locally
pnpm run perf:automation
```

## Troubleshooting

### Common Issues

#### 1. Chrome/Chromium Not Found

```bash
# Install Chrome or use Puppeteer
pnpm add -D puppeteer
```

#### 2. Server Not Running

```bash
# Start the development server first
pnpm run dev
```

#### 3. Environment Variables Missing

```bash
# Set required environment variables
export NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=true pnpm run perf:local
```

## Results and Reports

### Output Locations

- **Local tests**: `./performance-results/`
- **Lighthouse CI**: `./.lighthouseci/`
- **GitHub Actions**: Uploaded as artifacts

### Report Formats

- **JSON**: Machine-readable results
- **Markdown**: Human-readable reports
- **HTML**: Lighthouse reports

## Monitoring in Production

### Real-time Monitoring

The system includes real-time Core Web Vitals monitoring:

- **Vercel Analytics**: Automatic integration
- **Google Analytics**: Core Web Vitals tracking
- **Custom Monitor**: `CoreWebVitalsMonitor` component

### Performance Alerts

- Budget violations are logged to console in development
- CI/CD failures trigger GitHub issues
- Slack notifications for critical regressions

## Best Practices

### 1. Regular Testing

- Run performance tests before major releases
- Monitor Core Web Vitals in production
- Set up alerts for budget violations

### 2. Performance Budgets

- Keep budgets realistic but challenging
- Review and adjust based on user feedback
- Consider different budgets for different page types

### 3. CI/CD Integration

- Don't skip performance tests in CI
- Review performance reports in PRs
- Address regressions immediately

## Advanced Usage

### Custom Test Suites

```javascript
// Create custom test configuration
import { createCriticalPagesTestSuite } from "./lib/performance-testing";

const suite = createCriticalPagesTestSuite("https://your-domain.com");
// Run custom suite
```

### Performance Monitoring Hook

```typescript
// Use in React components
import { usePerformanceMonitoring } from "@/lib/performance-monitoring";

function MyComponent() {
	const { trackMetric } = usePerformanceMonitoring();

	const handleAction = () => {
		// Track custom metrics
		trackMetric("FID", 50);
	};
}
```

## Support

### Documentation

- [Performance Testing Documentation](docs/performance-testing.md)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)

### Issues

- Check GitHub issues for known problems
- Create new issues for bugs or feature requests
- Join discussions in the project repository

## Contributing

### Adding New Tests

1. Update `lighthouse-ci.config.js` with new URLs
2. Add corresponding scripts to `package.json`
3. Update documentation
4. Test locally before submitting

### Performance Budgets

1. Review current performance data
2. Set realistic but challenging budgets
3. Update configuration files
4. Test with new budgets

---

**Happy Performance Testing! 🚀**

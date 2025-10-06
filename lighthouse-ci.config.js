/**
 * Lighthouse CI Configuration
 *
 * Automated performance testing configuration for continuous integration
 * and regression testing of Core Web Vitals.
 */

export default {
	// Number of runs for each URL to get stable results
	numberOfRuns: 3,

	// CI configuration
	ci: {
		collect: {
			// Base URL for testing
			baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",

			// URLs to test
			get url() {
				return [
					this.baseUrl,
					`${this.baseUrl}/plant/monstera-deliciosa`,
					`${this.baseUrl}/plant/snake-plant`,
					`${this.baseUrl}/plants`,
					`${this.baseUrl}/tips`,
				];
			},
			// Number of runs per URL
			numberOfRuns: 3,
			// Start server command
			startServerCommand: "pnpm run build && pnpm run start",
			// Server ready timeout
			startServerReadyTimeout: 60000,
			// Start server ready pattern
			startServerReadyPattern: "Ready in",
			// Skip authentication
			settings: {
				// Disable authentication for testing
				skipAudits: ["uses-http2"],
				// Mobile testing
				emulatedFormFactor: "mobile",
				throttling: {
					// Simulate 3G connection
					rttMs: 150,
					throughputKbps: 1638.4,
					cpuSlowdownMultiplier: 4,
				},
			},
		},

		assert: {
			// Performance budgets
			assertions: {
				// Core Web Vitals assertions
				"categories:performance": ["error", { minScore: 0.8 }],
				"categories:accessibility": ["error", { minScore: 0.9 }],
				"categories:best-practices": ["error", { minScore: 0.8 }],
				"categories:seo": ["error", { minScore: 0.9 }],

				// Specific Core Web Vitals
				"largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
				"first-contentful-paint": ["error", { maxNumericValue: 1800 }],
				"cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
				"total-blocking-time": ["error", { maxNumericValue: 200 }],
				"speed-index": ["error", { maxNumericValue: 3000 }],

				// Additional performance metrics
				"unused-javascript": ["warn", { maxNumericValue: 100000 }], // 100KB
				"unused-css-rules": ["warn", { maxNumericValue: 50000 }], // 50KB
				"render-blocking-resources": ["warn"],
				"uses-text-compression": ["error"],
				"uses-optimized-images": ["error"],
				"uses-webp-images": ["warn"],
				"uses-responsive-images": ["error"],
				"efficient-animated-content": ["warn"],
				"preload-lcp-image": ["error"],
				"uses-rel-preconnect": ["warn"],
				"uses-rel-preload": ["warn"],

				// Accessibility
				"color-contrast": ["error"],
				"heading-order": ["error"],
				"image-alt": ["error"],
				label: ["error"],
				"link-name": ["error"],

				// Best practices
				"uses-https": ["error"],
				"no-vulnerable-libraries": ["error"],
				"csp-xss": ["warn"],
				"is-on-https": ["error"],

				// SEO
				"meta-description": ["error"],
				"document-title": ["error"],
				"link-text": ["error"],
				"crawlable-anchors": ["error"],
				"is-crawlable": ["error"],
				"robots-txt": ["error"],
				hreflang: ["warn"],
			},

			// Performance budgets for different page types
			budgets: [
				// Home page budget
				{
					path: "/",
					timings: [
						{
							metric: "first-contentful-paint",
							budget: 1500,
						},
						{
							metric: "largest-contentful-paint",
							budget: 2000,
						},
						{
							metric: "cumulative-layout-shift",
							budget: 0.1,
						},
						{
							metric: "total-blocking-time",
							budget: 200,
						},
					],
					resourceSizes: [
						{
							resourceType: "script",
							budget: 300000, // 300KB
						},
						{
							resourceType: "stylesheet",
							budget: 50000, // 50KB
						},
						{
							resourceType: "image",
							budget: 500000, // 500KB
						},
						{
							resourceType: "total",
							budget: 1000000, // 1MB
						},
					],
					resourceCounts: [
						{
							resourceType: "script",
							budget: 20,
						},
						{
							resourceType: "stylesheet",
							budget: 5,
						},
						{
							resourceType: "image",
							budget: 15,
						},
					],
				},

				// Plant page budget
				{
					path: "/plant/*",
					timings: [
						{
							metric: "first-contentful-paint",
							budget: 1800,
						},
						{
							metric: "largest-contentful-paint",
							budget: 2500,
						},
						{
							metric: "cumulative-layout-shift",
							budget: 0.1,
						},
						{
							metric: "total-blocking-time",
							budget: 300,
						},
					],
					resourceSizes: [
						{
							resourceType: "script",
							budget: 400000, // 400KB
						},
						{
							resourceType: "stylesheet",
							budget: 60000, // 60KB
						},
						{
							resourceType: "image",
							budget: 800000, // 800KB
						},
						{
							resourceType: "total",
							budget: 1500000, // 1.5MB
						},
					],
					resourceCounts: [
						{
							resourceType: "script",
							budget: 25,
						},
						{
							resourceType: "stylesheet",
							budget: 6,
						},
						{
							resourceType: "image",
							budget: 20,
						},
					],
				},
			],
		},

		upload: {
			// Upload results to Lighthouse CI server (if configured)
			target: "temporary-public-storage",
		},
	},
};

"use client";

/**
 * Core Web Vitals Monitor Component
 *
 * Monitors and tracks Core Web Vitals metrics for performance analysis.
 * Integrates with existing Vercel Analytics and Google Analytics.
 */

import { useEffect } from "react";
import {
	createPerformanceMetric,
	sendPerformanceMetric,
	type PerformanceMetric,
} from "@/lib/performance-monitoring";

interface CoreWebVitalsMonitorProps {
	/**
	 * Whether to enable detailed logging in development
	 */
	enableLogging?: boolean;
	/**
	 * Custom callback for performance metrics
	 */
	onMetric?: (metric: PerformanceMetric) => void;
}

/**
 * Core Web Vitals Monitor Component
 *
 * Automatically tracks Core Web Vitals metrics and sends them to analytics services.
 * Runs only on the client side and doesn't impact server-side rendering.
 */
export function CoreWebVitalsMonitor({
	enableLogging = true,
	onMetric,
}: CoreWebVitalsMonitorProps) {
	useEffect(() => {
		// Only run on client side
		if (typeof window === "undefined") return;

		// Track LCP (Largest Contentful Paint)
		const trackLCP = () => {
			new PerformanceObserver((entryList) => {
				const entries = entryList.getEntries();
				const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
					renderTime?: number;
					loadTime?: number;
				};

				// Use renderTime if available, otherwise loadTime
				const lcpValue =
					lastEntry.renderTime || lastEntry.loadTime || lastEntry.startTime;

				if (lcpValue > 0) {
					const metric = createPerformanceMetric("LCP", lcpValue);
					sendPerformanceMetric(metric);

					if (enableLogging && process.env.NODE_ENV === "development") {
						console.log("🎯 LCP tracked:", lcpValue);
					}

					onMetric?.(metric);
				}
			}).observe({ entryTypes: ["largest-contentful-paint"] });
		};

		// Track FID (First Input Delay)
		const trackFID = () => {
			new PerformanceObserver((entryList) => {
				const entries = entryList.getEntries();
				entries.forEach((entry) => {
					const fidValue =
						(entry as PerformanceEntry & { processingStart: number })
							.processingStart - entry.startTime;

					if (fidValue > 0) {
						const metric = createPerformanceMetric("FID", fidValue);
						sendPerformanceMetric(metric);

						if (enableLogging && process.env.NODE_ENV === "development") {
							console.log("🎯 FID tracked:", fidValue);
						}

						onMetric?.(metric);
					}
				});
			}).observe({ entryTypes: ["first-input"] });
		};

		// Track CLS (Cumulative Layout Shift)
		let clsValue = 0;
		const trackCLS = () => {
			new PerformanceObserver((entryList) => {
				const entries = entryList.getEntries();
				entries.forEach((entry) => {
					const entryWithInput = entry as PerformanceEntry & {
						hadRecentInput?: boolean;
						value?: number;
					};
					if (!entryWithInput.hadRecentInput) {
						clsValue += entryWithInput.value || 0;
					}
				});

				// Don't send CLS metric on every layout shift
				// It will be sent on page unload instead
			}).observe({ entryTypes: ["layout-shift"] });
		};

		// Track FCP (First Contentful Paint)
		const trackFCP = () => {
			new PerformanceObserver((entryList) => {
				const entries = entryList.getEntries();
				entries.forEach((entry) => {
					const fcpValue = entry.startTime;

					if (fcpValue > 0) {
						const metric = createPerformanceMetric("FCP", fcpValue);
						sendPerformanceMetric(metric);

						if (enableLogging && process.env.NODE_ENV === "development") {
							console.log("🎯 FCP tracked:", fcpValue);
						}

						onMetric?.(metric);
					}
				});
			}).observe({ entryTypes: ["paint"] });
		};

		// Track TTFB (Time to First Byte)
		const trackTTFB = () => {
			const navigationEntry = performance.getEntriesByType(
				"navigation"
			)[0] as PerformanceNavigationTiming;

			if (navigationEntry) {
				const ttfbValue =
					navigationEntry.responseStart - navigationEntry.requestStart;

				if (ttfbValue > 0) {
					const metric = createPerformanceMetric("TTFB", ttfbValue);
					sendPerformanceMetric(metric);

					if (enableLogging && process.env.NODE_ENV === "development") {
						console.log("🎯 TTFB tracked:", ttfbValue);
					}

					onMetric?.(metric);
				}
			}
		};

		// Initialize all tracking
		try {
			trackLCP();
			trackFID();
			trackCLS();
			trackFCP();
			trackTTFB();

			if (enableLogging && process.env.NODE_ENV === "development") {
				console.log("🚀 Core Web Vitals monitoring initialized");
			}
		} catch (error) {
			if (enableLogging && process.env.NODE_ENV === "development") {
				console.warn(
					"⚠️ Core Web Vitals monitoring failed to initialize:",
					error
				);
			}
		}

		// Track CLS on page unload
		const handleBeforeUnload = () => {
			if (clsValue > 0) {
				const metric = createPerformanceMetric("CLS", clsValue);
				sendPerformanceMetric(metric);
				onMetric?.(metric);
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [enableLogging, onMetric]);

	// This component doesn't render anything
	return null;
}

export default CoreWebVitalsMonitor;

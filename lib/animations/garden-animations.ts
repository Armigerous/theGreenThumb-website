"use client";

import { animate, stagger, Timeline } from "animejs";
import { AnimationConfig } from "@/types/garden-ui";

/**
 * Reason: Reusable animation library for GreenThumb garden UI
 * Uses anime.js for smooth, delightful animations throughout the app
 */

/**
 * animateFadeUp
 *
 * Reason: Gentle entrance animation - fade in while moving up slightly
 * Used for page elements and cards
 */
export const animateFadeUp = (
	targets: string | HTMLElement | HTMLElement[],
	config: AnimationConfig = {}
) => {
	return animate(targets, {
		opacity: [0, 1],
		translateY: [20, 0],
		duration: config.duration || 600,
		delay: config.delay || 0,
		easing: config.easing || "out-cubic",
	});
};

/**
 * animateStaggerFadeUp
 *
 * Reason: Staggered entrance for multiple elements (cards, statistics)
 */
export const animateStaggerFadeUp = (
	targets: string | HTMLElement | HTMLElement[],
	config: AnimationConfig = {}
) => {
	return animate(targets, {
		opacity: [0, 1],
		translateY: [20, 0],
		duration: config.duration || 500,
		delay: stagger(config.stagger || 100, {
			start: config.delay || 0,
		}),
		easing: config.easing || "out-cubic",
	});
};

/**
 * animateCardHover
 *
 * Reason: Subtle lift effect on hover for organic cards
 */
export const animateCardHover = (target: HTMLElement, isEntering: boolean) => {
	return animate(target, {
		translateY: isEntering ? -4 : 0,
		scale: isEntering ? 1.01 : 1,
		duration: 300,
		easing: "out-cubic",
	});
};

/**
 * animateCardPress
 *
 * Reason: Feedback animation for card clicks
 */
export const animateCardPress = (target: HTMLElement) => {
	const timeline = new Timeline();
	return timeline
		.add(target, {
			scale: 0.98,
			duration: 100,
			easing: "out-cubic",
		})
		.add(target, {
			scale: 1,
			duration: 200,
			easing: "spring",
		});
};

/**
 * animateCountUp
 *
 * Reason: Count-up animation for statistics numbers
 */
export const animateCountUp = (
	target: HTMLElement,
	finalValue: number,
	config: AnimationConfig = {}
) => {
	const obj = { value: 0 };
	return animate(obj, {
		value: finalValue,
		round: 1,
		duration: config.duration || 1000,
		delay: config.delay || 0,
		easing: config.easing || "out-expo",
		onUpdate: () => {
			target.textContent = Math.round(obj.value).toString();
		},
	});
};

/**
 * animateSlideIn
 *
 * Reason: Gentle slide-in from side for alerts and banners
 */
export const animateSlideIn = (
	target: string | HTMLElement,
	direction: "left" | "right" = "left",
	config: AnimationConfig = {}
) => {
	const translateX = direction === "left" ? [-30, 0] : [30, 0];

	return animate(target, {
		opacity: [0, 1],
		translateX,
		duration: config.duration || 500,
		delay: config.delay || 0,
		easing: config.easing || "out-cubic",
	});
};

/**
 * animateBounce
 *
 * Reason: Playful bounce for success states and icons
 */
export const animateBounce = (
	target: string | HTMLElement,
	config: AnimationConfig = {}
) => {
	return animate(target, {
		translateY: [0, -10, 0],
		duration: config.duration || 600,
		easing: "spring",
	});
};

/**
 * animateGrowth
 *
 * Reason: Plant growth animation for success celebrations
 */
export const animateGrowth = (
	target: string | HTMLElement,
	config: AnimationConfig = {}
) => {
	return animate(target, {
		scaleY: [0, 1],
		opacity: [0, 1],
		duration: config.duration || 800,
		easing: "spring",
		transformOrigin: "bottom center",
	});
};

/**
 * animateRotate
 *
 * Reason: Gentle rotation animation for interactive elements
 */
export const animateRotate = (
	target: string | HTMLElement,
	degrees: number = 360,
	config: AnimationConfig = {}
) => {
	return animate(target, {
		rotate: degrees,
		duration: config.duration || 600,
		easing: config.easing || "in-out-quad",
	});
};

/**
 * animateScaleIn
 *
 * Reason: Pop-in animation for modals and overlays
 */
export const animateScaleIn = (
	target: string | HTMLElement,
	config: AnimationConfig = {}
) => {
	return animate(target, {
		scale: [0.8, 1],
		opacity: [0, 1],
		duration: config.duration || 400,
		easing: "out-cubic",
	});
};

/**
 * respectsReducedMotion
 *
 * Reason: Check if user prefers reduced motion for accessibility
 */
export const respectsReducedMotion = (): boolean => {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * withReducedMotion
 *
 * Reason: Execute animation only if user doesn't prefer reduced motion
 */
export const withReducedMotion = (animationFn: () => any) => {
	if (respectsReducedMotion()) {
		// Reason: Skip animation, just show final state
		return null;
	}
	return animationFn();
};

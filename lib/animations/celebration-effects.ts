"use client";

import { animate, stagger, random, Timeline } from "animejs";

/**
 * Reason: Celebration effects for garden milestones and success states
 * Using anime.js to create delightful feedback animations
 */

/**
 * celebrateSuccess
 *
 * Reason: General success celebration with subtle particle effect
 */
export const celebrateSuccess = (container: HTMLElement) => {
	const particles = createParticles(container, 12);

	animate(particles, {
		translateX: () => random(-100, 100),
		translateY: () => random(-100, -50),
		scale: [1, 0],
		opacity: [1, 0],
		duration: 1000,
		easing: "out-cubic",
		onComplete: () => {
			particles.forEach((p) => p.remove());
		},
	});
};

/**
 * celebratePlantAdded
 *
 * Reason: Gentle confetti celebration when adding a plant
 */
export const celebratePlantAdded = (container: HTMLElement) => {
	const confetti = createConfetti(container, 20, ["#5E994B", "#77B860", "#D6E8CC"]);

	animate(confetti, {
		translateX: () => random(-150, 150),
		translateY: [0, -200],
		rotate: () => random(-360, 360),
		scale: [0, 1, 0],
		opacity: [1, 1, 0],
		duration: 1500,
		delay: stagger(50),
		easing: "out-cubic",
		onComplete: () => {
			confetti.forEach((c) => c.remove());
		},
	});
};

/**
 * celebrateGardenCreated
 *
 * Reason: Larger celebration for creating a new garden
 */
export const celebrateGardenCreated = (container: HTMLElement) => {
	const confetti = createConfetti(container, 40, [
		"#5E994B",
		"#77B860",
		"#D6E8CC",
		"#FDFD96",
	]);

	animate(confetti, {
		translateX: () => random(-200, 200),
		translateY: [0, -300],
		rotate: () => random(-720, 720),
		scale: [0, 1.2, 0],
		opacity: [1, 1, 0],
		duration: 2000,
		delay: stagger(30),
		easing: "out-cubic",
		onComplete: () => {
			confetti.forEach((c) => c.remove());
		},
	});
};

/**
 * celebrateHealthImproved
 *
 * Reason: Growth animation when plant health improves
 */
export const celebrateHealthImproved = (target: HTMLElement) => {
	const timeline = new Timeline();
	return timeline
		.add(target, {
			scale: [1, 1.1],
			duration: 300,
			easing: "out-cubic",
		})
		.add(target, {
			scale: [1.1, 1],
			duration: 400,
			easing: "spring",
		});
};

/**
 * celebrateCareCompleted
 *
 * Reason: Checkmark bloom animation for completed care tasks
 */
export const celebrateCareCompleted = (container: HTMLElement) => {
	const checkmark = document.createElement("div");
	checkmark.innerHTML = "✓";
	checkmark.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 48px;
    color: #5E994B;
    font-weight: bold;
    transform: translate(-50%, -50%);
    pointer-events: none;
  `;
	container.appendChild(checkmark);

	const timeline = new Timeline();
	timeline
		.add(checkmark, {
			scale: [0, 1.2],
			opacity: [0, 1],
			duration: 300,
			easing: "spring",
		})
		.add(checkmark, {
			scale: [1.2, 1],
			duration: 200,
			easing: "out-cubic",
		})
		.add(checkmark, {
			scale: [1, 0],
			opacity: [1, 0],
			duration: 400,
			delay: 800,
			easing: "in-cubic",
			onComplete: () => {
				checkmark.remove();
			},
		});
};

/**
 * Helper: createParticles
 *
 * Reason: Creates particle elements for celebration effects
 */
const createParticles = (
	container: HTMLElement,
	count: number
): HTMLElement[] => {
	const particles: HTMLElement[] = [];

	for (let i = 0; i < count; i++) {
		const particle = document.createElement("div");
		particle.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 6px;
      height: 6px;
      background: #5E994B;
      border-radius: 50%;
      pointer-events: none;
    `;
		container.appendChild(particle);
		particles.push(particle);
	}

	return particles;
};

/**
 * Helper: createConfetti
 *
 * Reason: Creates confetti elements with brand colors
 */
const createConfetti = (
	container: HTMLElement,
	count: number,
	colors: string[]
): HTMLElement[] => {
	const confetti: HTMLElement[] = [];

	for (let i = 0; i < count; i++) {
		const piece = document.createElement("div");
		const color = colors[Math.floor(Math.random() * colors.length)];
		piece.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 8px;
      height: 8px;
      background: ${color};
      border-radius: 2px;
      pointer-events: none;
    `;
		container.appendChild(piece);
		confetti.push(piece);
	}

	return confetti;
};

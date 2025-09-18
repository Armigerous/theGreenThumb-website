"use client";

import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
	threshold?: number;
	root?: Element | null;
	rootMargin?: string;
	freezeOnceVisible?: boolean;
}

// Reason: Custom hook for performance optimization - only load components when they're visible
export function useIntersectionObserver({
	threshold = 0,
	root = null,
	rootMargin = "0%",
	freezeOnceVisible = false,
}: UseIntersectionObserverOptions = {}): [
	React.RefObject<HTMLDivElement>,
	boolean
] {
	const elementRef = useRef<HTMLDivElement>(null);
	const [isIntersecting, setIsIntersecting] = useState(false);
	const [hasBeenVisible, setHasBeenVisible] = useState(false);

	useEffect(() => {
		const element = elementRef.current;

		if (!element || typeof IntersectionObserver === "undefined") {
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				const isElementIntersecting = entry.isIntersecting;

				if (isElementIntersecting && !hasBeenVisible) {
					setHasBeenVisible(true);
				}

				if (!freezeOnceVisible || !hasBeenVisible) {
					setIsIntersecting(isElementIntersecting);
				}
			},
			{
				threshold,
				root,
				rootMargin,
			}
		);

		observer.observe(element);

		return () => {
			observer.unobserve(element);
		};
	}, [threshold, root, rootMargin, freezeOnceVisible, hasBeenVisible]);

	return [elementRef, freezeOnceVisible ? hasBeenVisible : isIntersecting];
}

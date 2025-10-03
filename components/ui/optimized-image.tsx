"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ImageSkeleton } from "./image-skeleton";

interface OptimizedImageProps {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	fill?: boolean;
	className?: string;
	sizes?: string;
	priority?: boolean;
	loading?: "eager" | "lazy";
	placeholder?: "blur" | "empty";
	blurDataURL?: string;
	unoptimized?: boolean;
	fallbackSrc?: string;
	onError?: () => void;
	onLoad?: () => void;
	showSkeleton?: boolean;
}

/**
 * Enhanced Image component with proper loading states and error handling
 * Replaces Next.js Image component with better UX and optimization control
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
	src,
	alt,
	width,
	height,
	fill = false,
	className,
	sizes,
	priority = false,
	loading = "lazy",
	placeholder = "empty",
	blurDataURL,
	unoptimized = false,
	fallbackSrc = "/no-plant-image.png",
	onError,
	onLoad,
	showSkeleton = true,
	...props
}) => {
	const [imgSrc, setImgSrc] = useState(src);
	const [hasError, setHasError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Reason: Update imgSrc when src prop changes to fix image selection
	useEffect(() => {
		setImgSrc(src);
		setHasError(false);
		setIsLoading(true);
	}, [src]);

	const handleError = () => {
		if (!hasError && fallbackSrc) {
			setImgSrc(fallbackSrc);
			setHasError(true);
			setIsLoading(false);
			onError?.();
		}
	};

	const handleLoad = () => {
		setIsLoading(false);
		onLoad?.();
	};

	const imageElement = (
		<Image
			{...props}
			src={imgSrc}
			alt={alt}
			width={width}
			height={height}
			fill={fill}
			className={cn(
				"object-cover transition-opacity duration-500",
				isLoading ? "opacity-0" : "opacity-100",
				className
			)}
			sizes={sizes}
			priority={priority}
			loading={priority ? undefined : loading} // Don't set loading when priority is true
			placeholder={placeholder}
			blurDataURL={blurDataURL}
			unoptimized={unoptimized || hasError}
			onError={handleError}
			onLoad={handleLoad}
		/>
	);

	if (showSkeleton && isLoading) {
		return (
			<ImageSkeleton className={fill ? "absolute inset-0" : undefined}>
				{imageElement}
			</ImageSkeleton>
		);
	}

	return imageElement;
};

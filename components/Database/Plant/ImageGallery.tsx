"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type PlantImageGalleryProps = {
	images: {
		img: string;
		thumbnail_med?: string;
		altText?: string;
		caption?: string;
		attribution?: string;
	}[];
	priority?: boolean; // Reason: Add priority prop for LCP optimization
};

interface GalleryState {
	selectedImageIndex: number;
	isModalOpen: boolean;
	isFullGalleryOpen: boolean;
	zoomLevel: number;
	panOffset: { x: number; y: number };
	isDragging: boolean;
}

const ImageGallery: React.FC<PlantImageGalleryProps> = ({
	images,
	priority = false,
}) => {
	const validImages = images?.filter((img) => img?.img) || [];

	// Reason: Enhanced state management for gallery functionality
	const [galleryState, setGalleryState] = useState<GalleryState>({
		selectedImageIndex: 0,
		isModalOpen: false,
		isFullGalleryOpen: false,
		zoomLevel: 1,
		panOffset: { x: 0, y: 0 },
		isDragging: false,
	});

	// Reason: Navigation functions for gallery
	const goToPrevious = useCallback(() => {
		setGalleryState((prev) => ({
			...prev,
			selectedImageIndex:
				prev.selectedImageIndex > 0
					? prev.selectedImageIndex - 1
					: validImages.length - 1,
			zoomLevel: 1,
			panOffset: { x: 0, y: 0 },
		}));
	}, [validImages.length]);

	const goToNext = useCallback(() => {
		setGalleryState((prev) => ({
			...prev,
			selectedImageIndex:
				prev.selectedImageIndex < validImages.length - 1
					? prev.selectedImageIndex + 1
					: 0,
			zoomLevel: 1,
			panOffset: { x: 0, y: 0 },
		}));
	}, [validImages.length]);

	const selectImage = useCallback((index: number) => {
		setGalleryState((prev) => ({
			...prev,
			selectedImageIndex: index,
			zoomLevel: 1,
			panOffset: { x: 0, y: 0 },
		}));
	}, []);

	// Reason: Keyboard navigation support
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!galleryState.isModalOpen && !galleryState.isFullGalleryOpen) return;

			switch (event.key) {
				case "ArrowLeft":
					event.preventDefault();
					goToPrevious();
					break;
				case "ArrowRight":
					event.preventDefault();
					goToNext();
					break;
				case "Escape":
					event.preventDefault();
					setGalleryState((prev) => ({
						...prev,
						isModalOpen: false,
						isFullGalleryOpen: false,
					}));
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		galleryState.isModalOpen,
		galleryState.isFullGalleryOpen,
		goToPrevious,
		goToNext,
	]);

	// Reason: Ensure All Images view starts with current selection
	useEffect(() => {
		if (galleryState.isFullGalleryOpen) {
			// Reset zoom and pan when opening full gallery
			setGalleryState((prev) => ({
				...prev,
				zoomLevel: 1,
				panOffset: { x: 0, y: 0 },
			}));
		}
	}, [galleryState.isFullGalleryOpen]);

	if (validImages.length === 0) {
		return <p className="text-cream-500">No images available.</p>;
	}

	const currentImage = validImages[galleryState.selectedImageIndex];
	const selectedImage = currentImage?.img;

	// Reason: Only the first image should have priority for LCP optimization
	const isFirstImage = galleryState.selectedImageIndex === 0;

	return (
		<div className="space-y-4">
			{/* Main Display Image with Image Counter */}
			<div className="relative">
				<Dialog
					open={galleryState.isModalOpen}
					onOpenChange={(open) =>
						setGalleryState((prev) => ({ ...prev, isModalOpen: open }))
					}
				>
					<DialogTrigger asChild>
						<div className="relative w-full max-w-3xl h-[500px] bg-cream-100 rounded-lg overflow-hidden cursor-pointer group">
							<OptimizedImage
								src={selectedImage}
								alt={currentImage?.altText || "Plant image"}
								className="object-cover rounded-lg"
								fill
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								priority={priority && isFirstImage} // Reason: Only prioritize first image for LCP
								showSkeleton={false}
							/>
							{/* Image Counter Overlay */}
							{validImages.length > 1 && (
								<div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
									{galleryState.selectedImageIndex + 1} of {validImages.length}
								</div>
							)}
						</div>
					</DialogTrigger>
					<DialogContent className="sm:max-w-6xl max-h-[90vh] p-0">
						<DialogHeader className="p-6 pb-0">
							<div className="flex items-center justify-between">
								<DialogTitle className="text-lg">
									{currentImage?.altText || "Image View"}
								</DialogTitle>
								<div className="flex items-center gap-4">
									<span className="text-sm text-muted-foreground">
										{galleryState.selectedImageIndex + 1} of{" "}
										{validImages.length}
									</span>
									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											setGalleryState((prev) => ({
												...prev,
												isModalOpen: false,
											}))
										}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</DialogHeader>

						{/* Modal Content with Navigation */}
						<div className="relative flex-1 p-6">
							{/* Navigation Buttons */}
							{validImages.length > 1 && (
								<>
									<Button
										variant="outline"
										size="sm"
										className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
										onClick={goToPrevious}
									>
										<ChevronLeft className="h-4 w-4" />
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
										onClick={goToNext}
									>
										<ChevronRight className="h-4 w-4" />
									</Button>
								</>
							)}

							{/* Main Image */}
							<div className="relative w-full h-[60vh] bg-cream-50 rounded-lg overflow-hidden">
								<OptimizedImage
									src={selectedImage}
									alt={currentImage?.altText || "Plant image"}
									className="object-contain rounded-lg"
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									priority={false} // Reason: Dialog images don't need priority
									showSkeleton={false}
								/>
							</div>
						</div>

						{/* Modal Footer with Caption and Attribution */}
						{(currentImage?.caption || currentImage?.attribution) && (
							<div className="p-6 pt-0 space-y-2">
								{currentImage?.caption && (
									<p className="text-sm text-foreground">
										{currentImage.caption}
									</p>
								)}
								{currentImage?.attribution && (
									<p className="text-xs text-muted-foreground">
										Attribution: {currentImage.attribution}
									</p>
								)}
							</div>
						)}
					</DialogContent>
				</Dialog>
			</div>

			{/* Enhanced Thumbnails */}
			<div className="flex gap-4 p-4 px-0">
				{validImages.slice(0, 5).map((image, index) => (
					<Button
						key={index}
						onClick={() => selectImage(index)}
						className={`relative w-24 h-24 bg-cream-100 rounded-lg overflow-hidden border transition-all duration-200 ${
							galleryState.selectedImageIndex === index
								? "border-brand-500 ring-2 ring-brand-200"
								: "border-cream-300 hover:border-brand-300"
						} hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-700`}
					>
						<OptimizedImage
							src={image.thumbnail_med || image.img}
							alt={image.altText || `Thumbnail ${index + 1}`}
							className="object-cover w-full h-full"
							fill
							sizes="100px"
							priority={false} // Reason: Thumbnails don't need priority loading
							showSkeleton={false}
						/>
					</Button>
				))}
				{validImages.length > 5 && (
					<Dialog
						open={galleryState.isFullGalleryOpen}
						onOpenChange={(open) =>
							setGalleryState((prev) => ({ ...prev, isFullGalleryOpen: open }))
						}
					>
						<DialogTrigger asChild>
							<Button className="w-24 h-24 bg-cream-100 rounded-lg border border-cream-300 text-cream-600 hover:bg-cream-200 transition-colors">
								+{validImages.length - 5}
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-7xl max-h-[90vh] p-0">
							<DialogHeader className="p-6 pb-0">
								<DialogTitle>All Images ({validImages.length})</DialogTitle>
							</DialogHeader>
							<div className="flex flex-col lg:flex-row gap-6 h-[80vh] p-6">
								{/* Large Main Image */}
								<div className="flex-1 relative bg-cream-50 rounded-lg overflow-hidden">
									{/* Navigation Controls */}
									{validImages.length > 1 && (
										<>
											<Button
												variant="outline"
												size="sm"
												className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
												onClick={goToPrevious}
											>
												<ChevronLeft className="h-4 w-4" />
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
												onClick={goToNext}
											>
												<ChevronRight className="h-4 w-4" />
											</Button>
										</>
									)}
									<OptimizedImage
										src={selectedImage}
										alt={currentImage?.altText || "Main image"}
										className="object-contain rounded-lg"
										fill
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
										priority={false} // Reason: Gallery dialog images don't need priority
										showSkeleton={false}
									/>
									{/* Image Counter */}
									<div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
										{galleryState.selectedImageIndex + 1} of{" "}
										{validImages.length}
									</div>
								</div>
								{/* Thumbnail Grid */}
								<div className="w-full lg:w-80 h-48 lg:h-full overflow-y-auto bg-cream-50 rounded-lg p-4">
									<div className="grid grid-cols-2 gap-3">
										{validImages.map((image, index) => (
											<Button
												key={index}
												onClick={() => selectImage(index)}
												className={`relative w-full h-24 bg-cream-100 rounded-lg overflow-hidden border transition-all duration-200 ${
													galleryState.selectedImageIndex === index
														? "border-brand-500 ring-2 ring-brand-200"
														: "border-cream-300 hover:border-brand-300"
												} hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500`}
											>
												<OptimizedImage
													src={image.thumbnail_med || image.img}
													alt={image.altText || `Thumbnail ${index + 1}`}
													className="object-cover w-full h-full"
													fill
													sizes="100px"
													priority={false} // Reason: Gallery thumbnails don't need priority
													showSkeleton={false}
												/>
											</Button>
										))}
									</div>
								</div>
							</div>
							{/* Gallery Footer */}
							{(currentImage?.caption || currentImage?.attribution) && (
								<div className="p-6 pt-0 space-y-2">
									{currentImage?.caption && (
										<p className="text-sm text-foreground">
											{currentImage.caption}
										</p>
									)}
									{currentImage?.attribution && (
										<p className="text-xs text-muted-foreground">
											Attribution: {currentImage.attribution}
										</p>
									)}
								</div>
							)}
						</DialogContent>
					</Dialog>
				)}
			</div>
		</div>
	);
};

export default ImageGallery;

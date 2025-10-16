"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Camera, FileText, Loader2, X, RotateCcw } from "lucide-react";
import Image from "next/image";
import { PlantIdentificationResults } from "./PlantIdentificationResults";
import { PlantIdentificationLoading } from "./PlantIdentificationLoading";
import { usePlantIdentificationState } from "@/hooks/use-plant-identification-state";
import { toast } from "sonner";

// Reason: Define validation schemas for form data consistency
const imageIdentificationSchema = z.object({
	image: z.string().min(1, "Please upload an image"),
});

const descriptionIdentificationSchema = z.object({
	description: z
		.string()
		.min(10, "Please provide a detailed description (at least 10 characters)"),
});

type ImageIdentificationFormValues = z.infer<typeof imageIdentificationSchema>;
type DescriptionIdentificationFormValues = z.infer<
	typeof descriptionIdentificationSchema
>;

export function PlantIdentificationForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [loadingType, setLoadingType] = useState<"image" | "description">(
		"image"
	);
	const [activeTab, setActiveTab] = useState<"image" | "description">("image");

	// Reason: Use persisted state hook for maintaining state across navigation
	const {
		results,
		uploadedImage,
		isRestoringState,
		hasPersistedResults,
		updateResults,
		updateUploadedImage,
		updateDescription,
		handleFileUpload,
		clearState,
	} = usePlantIdentificationState();

	// Reason: Use react-hook-form for consistent form handling
	const imageForm = useForm<ImageIdentificationFormValues>({
		resolver: zodResolver(imageIdentificationSchema),
		defaultValues: {
			image: "",
		},
	});

	const descriptionForm = useForm<DescriptionIdentificationFormValues>({
		resolver: zodResolver(descriptionIdentificationSchema),
		defaultValues: {
			description: "",
		},
	});

	// Reason: Handle file upload for plant identification with compression
	const handleFileUploadEvent = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		try {
			// Reason: Use the compressed file upload function from the hook
			await handleFileUpload(file);
			// Reason: Update form value when image is uploaded
			imageForm.setValue("image", "uploaded");
			imageForm.clearErrors("image");
		} catch (error) {
			console.error("File upload error:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to upload image"
			);
		}
	};

	// Reason: Handle removing uploaded image
	const handleRemoveImage = () => {
		updateUploadedImage(null);
		updateResults(null);
		imageForm.setValue("image", "");
		// Reset file input
		const fileInput = document.getElementById(
			"plant-image-upload"
		) as HTMLInputElement;
		if (fileInput) {
			fileInput.value = "";
		}
	};

	// Reason: Handle plant identification from image using form validation
	const onImageSubmit = async () => {
		if (!uploadedImage) {
			toast.error("Please upload an image first");
			return;
		}

		setIsLoading(true);
		setLoadingType("image");
		updateResults(null);
		try {
			const response = await fetch("/api/plant-identification", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					type: "image",
					image: uploadedImage,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to identify plant");
			}

			const responseData = await response.json();
			updateResults(responseData.results || []);

			if (responseData.results?.length === 0) {
				toast.info(
					"No plants identified. Try uploading a clearer image or providing a description."
				);
			}
		} catch (error) {
			console.error("Plant identification error:", error);
			toast.error("Failed to identify plant. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	// Reason: Handle plant identification from description using form validation
	const onDescriptionSubmit = async (
		data: DescriptionIdentificationFormValues
	) => {
		setIsLoading(true);
		setLoadingType("description");
		updateResults(null);
		try {
			const response = await fetch("/api/plant-identification", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					type: "description",
					description: data.description.trim(),
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to identify plant");
			}

			const responseData = await response.json();
			updateResults(responseData.results || []);

			if (responseData.results?.length === 0) {
				toast.info(
					"No plants found matching your description. Try being more specific about the plant's features."
				);
			}
		} catch (error) {
			console.error("Plant identification error:", error);
			toast.error("Failed to identify plant. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	// Reason: Show loading while restoring state
	if (isRestoringState) {
		return (
			<div className="max-w-4xl mx-auto">
				<div className="flex items-center justify-center py-8">
					<Loader2 className="h-8 w-8 animate-spin text-gray-400" />
					<span className="ml-2 text-gray-600">
						Restoring previous session...
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto">
			{/* Reason: Show notification if we have persisted results */}
			{hasPersistedResults && (
				<div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<Camera className="h-5 w-5 text-blue-600 mr-2" />
							<span className="text-blue-800 font-paragraph-semibold">
								Previous identification results restored
							</span>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={clearState}
							className="text-blue-600 border-blue-300 hover:bg-blue-100"
						>
							Start Fresh
						</Button>
					</div>
				</div>
			)}

			<Tabs
				value={activeTab}
				onValueChange={(value) =>
					setActiveTab(value as "image" | "description")
				}
				className="w-full"
			>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="image" className="flex items-center gap-2">
						<Camera className="h-4 w-4" />
						Upload Photo
					</TabsTrigger>
					<TabsTrigger value="description" className="flex items-center gap-2">
						<FileText className="h-4 w-4" />
						Describe Plant
					</TabsTrigger>
				</TabsList>

				<TabsContent value="image" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Camera className="h-5 w-5" />
								Upload Plant Photo
							</CardTitle>
							<CardDescription>
								Upload a clear photo of the plant you want to identify. Include
								leaves, flowers, or distinctive features for better results.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<Form {...imageForm}>
								<form
									onSubmit={imageForm.handleSubmit(onImageSubmit)}
									className="space-y-4"
								>
									<FormField
										control={imageForm.control}
										name="image"
										render={() => (
											<FormItem>
												<FormControl>
													{!uploadedImage ? (
														// Reason: Show upload dropzone when no image is uploaded
														<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
															<input
																type="file"
																accept="image/*"
																onChange={handleFileUploadEvent}
																className="hidden"
																id="plant-image-upload"
															/>
															<label
																htmlFor="plant-image-upload"
																className="cursor-pointer flex flex-col items-center gap-4"
															>
																<Upload className="h-12 w-12 text-gray-400" />
																<div>
																	<p className="text-lg font-paragraph-semibold text-gray-900">
																		Click to upload or drag and drop
																	</p>
																	<p className="text-sm text-gray-500">
																		PNG, JPG, GIF up to 10MB
																	</p>
																</div>
															</label>
														</div>
													) : (
														// Reason: Show uploaded image with controls
														<div className="space-y-4">
															<div className="relative max-w-md mx-auto">
																<Image
																	src={uploadedImage}
																	alt="Uploaded plant"
																	width={400}
																	height={400}
																	className="w-full rounded-lg shadow-md object-cover"
																/>
																<Button
																	variant="outline"
																	size="sm"
																	onClick={handleRemoveImage}
																	className="absolute top-2 right-2 h-8 w-8 p-0"
																	type="button"
																>
																	<X className="h-4 w-4" />
																</Button>
															</div>

															<div className="flex gap-2">
																<Button
																	variant="outline"
																	onClick={() =>
																		document
																			.getElementById("plant-image-upload")
																			?.click()
																	}
																	className="flex-1"
																	type="button"
																>
																	<RotateCcw className="mr-2 h-4 w-4" />
																	Change Photo
																</Button>
																<Button
																	type="submit"
																	disabled={isLoading}
																	className="flex-1"
																	size="lg"
																>
																	{isLoading ? (
																		<>
																			<Loader2 className="mr-2 h-4 w-4 animate-spin" />
																			Identifying...
																		</>
																	) : (
																		"Identify This Plant"
																	)}
																</Button>
															</div>

															{/* Reason: Hidden file input for changing photo */}
															<input
																type="file"
																accept="image/*"
																onChange={handleFileUploadEvent}
																className="hidden"
																id="plant-image-upload"
															/>
														</div>
													)}
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</form>
							</Form>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="description" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileText className="h-5 w-5" />
								Describe Your Plant
							</CardTitle>
							<CardDescription>
								Provide details about the plant&apos;s appearance, such as leaf
								shape, flower color, size, and any distinctive features.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<Form {...descriptionForm}>
								<form
									onSubmit={descriptionForm.handleSubmit(onDescriptionSubmit)}
									className="space-y-4"
								>
									<FormField
										control={descriptionForm.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Plant Description</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Describe your plant... (e.g., 'A small houseplant with dark green, heart-shaped leaves and white flowers. It grows in a pot and has trailing stems.')"
														{...field}
														onChange={(e) => {
															field.onChange(e);
															updateDescription(e.target.value);
														}}
														className="min-h-[120px]"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<Button
										type="submit"
										disabled={isLoading}
										className="w-full"
										size="lg"
									>
										{isLoading ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Identifying Plant...
											</>
										) : (
											"Identify This Plant"
										)}
									</Button>
								</form>
							</Form>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{isLoading && <PlantIdentificationLoading type={loadingType} />}

			{results && !isLoading && (
				<div className="mt-8">
					<PlantIdentificationResults results={results} />
				</div>
			)}
		</div>
	);
}

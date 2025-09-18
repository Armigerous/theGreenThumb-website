"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Check, X, Loader2, Info, Atom, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

// Form validation schemas - split into two steps
const plantSelectionSchema = z.object({
	plantSlug: z.string().min(1, "Please select a plant from the database"),
	botanicalName: z.string().min(1, "Botanical name is required"),
});

const plantDetailsSchema = z.object({
	customName: z.string().min(1, "Plant name is required"),
	status: z.enum(["healthy", "warning", "critical", "dormant"]),
});

const plantFormSchema = plantSelectionSchema.merge(plantDetailsSchema);

type PlantFormValues = z.infer<typeof plantFormSchema>;

interface PlantSearchResult {
	slug: string;
	scientific_name: string;
	common_name: string;
}

interface PlantDetails {
	id: number;
	slug: string;
	scientific_name: string;
	common_name: string;
	description: string;
	images: Array<{
		img: string;
		alt_text: string;
		caption?: string;
		attribution?: string;
	}>;
	plant_types?: string[];
	habit?: string[];
	height_min?: number;
	height_max?: number;
	width_min?: number;
	width_max?: number;
	light?: string[];
	soil_drainage?: string[];
	maintenance?: string[];
	usda_zones?: string[];
	tags?: string[];
}

interface AddPlantProps {
	gardenId: number;
	existingPlants?: Array<{ botanicalName: string }>;
}

const AddPlant = ({ gardenId, existingPlants = [] }: AddPlantProps) => {
	const [isAdding, setIsAdding] = useState(false);
	const [step, setStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<PlantSearchResult[]>([]);
	const [selectedPlant, setSelectedPlant] = useState<PlantSearchResult | null>(
		null
	);
	const [plantDetails, setPlantDetails] = useState<PlantDetails | null>(null);
	const [isLoadingDetails, setIsLoadingDetails] = useState(false);
	const [isLoadingSearch, setIsLoadingSearch] = useState(false);
	const [useCommonNames, setUseCommonNames] = useState(false);
	const router = useRouter();

	const form = useForm<PlantFormValues>({
		resolver: zodResolver(plantFormSchema),
		defaultValues: {
			customName: "",
			plantSlug: "",
			botanicalName: "",
			status: "healthy",
		},
	});

	// Function to reset all states
	const resetForm = () => {
		form.reset({
			customName: "",
			plantSlug: "",
			botanicalName: "",
			status: "healthy",
		});
		setSelectedPlant(null);
		setPlantDetails(null);
		setSearchQuery("");
		setSearchResults([]);
		setStep(1);
		setIsAdding(false);
	};

	// Fetch search results when the search query changes
	useEffect(() => {
		const fetchPlants = async () => {
			setIsLoadingSearch(true);
			try {
				// Always fetch plants, with or without a query
				const endpoint =
					searchQuery && searchQuery.length >= 2
						? `/api/plants/search?query=${encodeURIComponent(
								searchQuery
						  )}&nameType=${useCommonNames ? "common" : "scientific"}`
						: `/api/plants/popular?nameType=${
								useCommonNames ? "common" : "scientific"
						  }&limit=7`;

				const response = await fetch(endpoint);
				if (!response.ok) {
					throw new Error("Failed to fetch plants");
				}
				const data = await response.json();
				setSearchResults(data.results);
			} catch (error) {
				console.error("Error fetching plants:", error);
				toast.error("Failed to fetch plants");
				setSearchResults([]);
			} finally {
				setIsLoadingSearch(false);
			}
		};

		// Use AbortController for fetch cancellation to avoid race conditions
		const abortController = new AbortController();
		const timeoutId = setTimeout(() => fetchPlants(), 300); // Debounce searches

		return () => {
			clearTimeout(timeoutId);
			abortController.abort();
		};
	}, [searchQuery, useCommonNames]);

	// Load initial plants when component mounts
	useEffect(() => {
		const fetchInitialPlants = async () => {
			setIsLoadingSearch(true);
			try {
				const response = await fetch(
					`/api/plants/popular?nameType=${
						useCommonNames ? "common" : "scientific"
					}&limit=7`
				);
				if (!response.ok) {
					throw new Error("Failed to fetch initial plants");
				}
				const data = await response.json();
				setSearchResults(data.results);
			} catch (error) {
				console.error("Error fetching initial plants:", error);
			} finally {
				setIsLoadingSearch(false);
			}
		};

		fetchInitialPlants();
	}, [useCommonNames]);

	// Fetch plant details when selected plant changes
	useEffect(() => {
		const fetchPlantDetails = async () => {
			if (!selectedPlant?.slug) return;

			setIsLoadingDetails(true);
			try {
				const response = await fetch(`/api/plants/${selectedPlant.slug}`);
				if (!response.ok) {
					throw new Error("Failed to fetch plant details");
				}
				const data = await response.json();
				setPlantDetails(data.plant);

				// Pre-fill the custom name if it's empty
				if (!form.getValues("customName")) {
					form.setValue(
						"customName",
						useCommonNames && data.plant.common_name
							? data.plant.common_name
							: data.plant.scientific_name
					);
				}
			} catch (error) {
				console.error("Error fetching plant details:", error);
				toast.error("Failed to fetch plant details");
			} finally {
				setIsLoadingDetails(false);
			}
		};

		if (selectedPlant) {
			fetchPlantDetails();
		}
	}, [selectedPlant, form, useCommonNames]);

	const onSubmit = async (data: PlantFormValues) => {
		if (step === 1) {
			// Validate first step data
			const selectionData = plantSelectionSchema.safeParse({
				plantSlug: data.plantSlug,
				botanicalName: data.botanicalName,
			});

			if (selectionData.success) {
				setStep(2);
				return;
			}
		}

		if (step === 2) {
			try {
				setIsSubmitting(true);

				// Check if this botanical name is already in the user's garden
				const isDuplicate = existingPlants.some(
					(plant) =>
						plant.botanicalName.toLowerCase() ===
						data.botanicalName.toLowerCase()
				);

				if (isDuplicate) {
					toast.error("This plant is already in your garden");
					setIsSubmitting(false);
					return;
				}

				const response = await fetch("/api/plant-tracking", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						...data,
						gardenId,
						careLogs: [],
						images: [],
						locationTags: [],
					}),
				});

				if (!response.ok) {
					throw new Error("Failed to add plant");
				}

				toast.success("Plant added successfully");
				resetForm();
				router.refresh();
			} catch (error) {
				console.error("Error adding plant:", error);
				toast.error("Failed to add plant");
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	if (!isAdding) {
		return (
			<Button size="sm" variant="outline" onClick={() => setIsAdding(true)}>
				<Plus className="mr-2 h-4 w-4" /> Add Plant
			</Button>
		);
	}

	return (
		<Dialog
			open={isAdding}
			onOpenChange={(open) => {
				if (!open) resetForm();
				setIsAdding(open);
			}}
		>
			<DialogContent className="max-w-6xl p-0 h-[80vh] max-h-[80vh] overflow-hidden">
				<div className="flex flex-col h-full">
					<div className="p-6 border-b">
						<div className="flex items-center justify-between">
							<div>
								<DialogTitle className="text-2xl font-bold">
									Add a New Plant to Your Garden
								</DialogTitle>
								<p className="text-muted-foreground">
									{step === 1
										? "Search and select a plant from our database"
										: "Customize your plant details before adding it to your garden"}
								</p>
							</div>
							<Button
								variant="ghost"
								size="icon"
								onClick={resetForm}
								className="rounded-full"
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					</div>

					<div className="flex-1 overflow-hidden">
						<div className="grid grid-cols-1 lg:grid-cols-2 h-full">
							{/* Left Side: Plant Selection */}
							<div className="border-r overflow-y-auto p-6">
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
										className="space-y-6 h-full flex flex-col"
									>
										{step === 1 ? (
											<>
												<div className="space-y-6 flex-1">
													<div className="flex items-center space-x-2 mb-4">
														<Switch
															id="use-common-names"
															checked={useCommonNames}
															onCheckedChange={setUseCommonNames}
														/>
														<Label
															htmlFor="use-common-names"
															className="text-base flex items-center gap-2"
														>
															{useCommonNames ? (
																<Users className="h-4 w-4 text-primary" />
															) : (
																<Atom className="h-4 w-4 text-primary" />
															)}
															{useCommonNames
																? "Using Common Names"
																: "Using Scientific Names"}
														</Label>
													</div>

													<FormField
														control={form.control}
														name="plantSlug"
														render={({ field }) => (
															<FormItem className="flex flex-col">
																<FormLabel className="text-lg">
																	Search Plants
																</FormLabel>
																<div className="relative">
																	<Command className="border rounded-lg">
																		<CommandInput
																			placeholder={
																				useCommonNames
																					? "Search by common name..."
																					: "Search by scientific name..."
																			}
																			value={searchQuery}
																			onValueChange={setSearchQuery}
																		/>
																		<CommandList>
																			{isLoadingSearch && (
																				<div className="flex items-center justify-center py-4">
																					<Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
																					<span className="ml-2 text-sm text-muted-foreground">
																						Loading plants...
																					</span>
																				</div>
																			)}
																			<CommandEmpty>
																				No plant found.
																			</CommandEmpty>
																			<CommandGroup
																				heading={
																					searchQuery && searchQuery.length >= 2
																						? "Search Results"
																						: "Popular Plants"
																				}
																			>
																				{searchResults.map((result) => (
																					<CommandItem
																						key={result.slug}
																						value={result.slug}
																						onSelect={() => {
																							form.setValue(
																								"plantSlug",
																								result.slug
																							);
																							form.setValue(
																								"botanicalName",
																								result.scientific_name
																							);
																							setSelectedPlant(result);
																						}}
																						className="cursor-pointer"
																					>
																						<Check
																							className={cn(
																								"mr-2 h-4 w-4",
																								field.value === result.slug
																									? "opacity-100"
																									: "opacity-0"
																							)}
																						/>
																						<span className="font-medium">
																							{useCommonNames
																								? result.common_name
																								: result.scientific_name}
																						</span>
																						{useCommonNames && (
																							<span className="ml-2 text-xs text-muted-foreground italic">
																								({result.scientific_name})
																							</span>
																						)}
																						{!useCommonNames &&
																							result.common_name && (
																								<span className="ml-2 text-xs text-muted-foreground italic">
																									({result.common_name})
																								</span>
																							)}
																					</CommandItem>
																				))}
																			</CommandGroup>
																		</CommandList>
																	</Command>
																</div>
																<FormMessage />
															</FormItem>
														)}
													/>

													{isLoadingDetails && (
														<div className="flex justify-center items-center h-32">
															<div className="flex flex-col items-center gap-2">
																<Loader2 className="h-8 w-8 animate-spin text-primary" />
																<span className="text-sm text-muted-foreground">
																	Loading plant details...
																</span>
															</div>
														</div>
													)}
												</div>

												<div className="flex justify-between mt-auto pt-4">
													<Button
														type="button"
														variant="ghost"
														onClick={resetForm}
													>
														Cancel
													</Button>
													<Button
														type="submit"
														disabled={!selectedPlant || isLoadingDetails}
													>
														Next
													</Button>
												</div>
											</>
										) : (
											<>
												<div className="space-y-6 flex-1">
													<h3 className="text-lg font-medium">
														Selected Plant: {selectedPlant?.scientific_name}
													</h3>

													<FormField
														control={form.control}
														name="customName"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Nickname for Your Plant</FormLabel>
																<FormControl>
																	<Input
																		placeholder="Enter a personal name for your plant"
																		{...field}
																	/>
																</FormControl>
																<p className="text-xs text-muted-foreground">
																	This is how your plant will be displayed in
																	your garden.
																</p>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="status"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Current Health Status</FormLabel>
																<Select
																	onValueChange={field.onChange}
																	defaultValue={field.value}
																>
																	<FormControl>
																		<SelectTrigger>
																			<SelectValue placeholder="Select plant status" />
																		</SelectTrigger>
																	</FormControl>
																	<SelectContent>
																		<SelectItem value="healthy">
																			Healthy
																		</SelectItem>
																		<SelectItem value="warning">
																			Needs Attention
																		</SelectItem>
																		<SelectItem value="critical">
																			Critical
																		</SelectItem>
																		<SelectItem value="dormant">
																			Dormant
																		</SelectItem>
																	</SelectContent>
																</Select>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>

												<div className="flex justify-between mt-auto pt-4">
													<Button
														type="button"
														variant="outline"
														onClick={() => setStep(1)}
													>
														Back
													</Button>
													<Button type="submit" disabled={isSubmitting}>
														{isSubmitting ? (
															<>
																<Loader2 className="mr-2 h-4 w-4 animate-spin" />
																Adding...
															</>
														) : (
															"Add to My Garden"
														)}
													</Button>
												</div>
											</>
										)}
									</form>
								</Form>
							</div>

							{/* Right Side: Plant Details Display */}
							<div className="overflow-y-auto h-full bg-muted/10">
								{selectedPlant && plantDetails ? (
									<div className="p-6">
										<div className="mb-6">
											<h3 className="text-2xl font-semibold mb-2">
												{plantDetails.scientific_name}
											</h3>
											{plantDetails.common_name && (
												<p className="text-lg text-muted-foreground mb-4">
													Common Name: {plantDetails.common_name}
												</p>
											)}

											{/* Plant Image */}
											{plantDetails.images &&
												plantDetails.images.length > 0 && (
													<div className="rounded-lg overflow-hidden mb-6 relative aspect-[4/3] max-h-[300px]">
														<Image
															src={plantDetails.images[0].img}
															alt={
																plantDetails.images[0].alt_text ||
																plantDetails.scientific_name
															}
															className="object-cover"
															fill
														/>
													</div>
												)}

											{/* Description */}
											{plantDetails.description && (
												<div className="mb-6">
													<h4 className="text-lg font-medium mb-2">
														Description
													</h4>
													<div
														className="text-sm text-muted-foreground"
														dangerouslySetInnerHTML={{
															__html: plantDetails.description,
														}}
													/>
												</div>
											)}

											{/* Plant Tags */}
											{plantDetails.tags && plantDetails.tags.length > 0 && (
												<div className="mb-6">
													<h4 className="text-lg font-medium mb-2">Tags</h4>
													<div className="flex flex-wrap gap-2">
														{plantDetails.tags.map((tag, index) => (
															<Badge key={index} variant="outline">
																{tag}
															</Badge>
														))}
													</div>
												</div>
											)}

											{/* Quick Info */}
											<div className="grid grid-cols-2 gap-4 mb-6">
												{/* Plant Type */}
												{plantDetails.plant_types &&
													plantDetails.plant_types.length > 0 && (
														<Card>
															<CardHeader className="pb-2">
																<CardTitle className="text-sm">
																	Plant Type
																</CardTitle>
															</CardHeader>
															<CardContent>
																<p className="text-sm">
																	{plantDetails.plant_types.join(", ")}
																</p>
															</CardContent>
														</Card>
													)}

												{/* Habit/Form */}
												{plantDetails.habit &&
													plantDetails.habit.length > 0 && (
														<Card>
															<CardHeader className="pb-2">
																<CardTitle className="text-sm">
																	Growth Habit
																</CardTitle>
															</CardHeader>
															<CardContent>
																<p className="text-sm">
																	{plantDetails.habit.join(", ")}
																</p>
															</CardContent>
														</Card>
													)}

												{/* Size */}
												{(plantDetails.height_min ||
													plantDetails.height_max) && (
													<Card>
														<CardHeader className="pb-2">
															<CardTitle className="text-sm">Height</CardTitle>
														</CardHeader>
														<CardContent>
															<p className="text-sm">
																{plantDetails.height_min &&
																plantDetails.height_max
																	? `${plantDetails.height_min}" - ${plantDetails.height_max}"`
																	: plantDetails.height_min
																	? `From ${plantDetails.height_min}"`
																	: `Up to ${plantDetails.height_max}"`}
															</p>
														</CardContent>
													</Card>
												)}

												{/* Width */}
												{(plantDetails.width_min || plantDetails.width_max) && (
													<Card>
														<CardHeader className="pb-2">
															<CardTitle className="text-sm">Width</CardTitle>
														</CardHeader>
														<CardContent>
															<p className="text-sm">
																{plantDetails.width_min &&
																plantDetails.width_max
																	? `${plantDetails.width_min}" - ${plantDetails.width_max}"`
																	: plantDetails.width_min
																	? `From ${plantDetails.width_min}"`
																	: `Up to ${plantDetails.width_max}"`}
															</p>
														</CardContent>
													</Card>
												)}

												{/* Light */}
												{plantDetails.light &&
													plantDetails.light.length > 0 && (
														<Card>
															<CardHeader className="pb-2">
																<CardTitle className="text-sm">
																	Light Requirements
																</CardTitle>
															</CardHeader>
															<CardContent>
																<p className="text-sm">
																	{plantDetails.light.join(", ")}
																</p>
															</CardContent>
														</Card>
													)}

												{/* Soil */}
												{plantDetails.soil_drainage &&
													plantDetails.soil_drainage.length > 0 && (
														<Card>
															<CardHeader className="pb-2">
																<CardTitle className="text-sm">
																	Soil Drainage
																</CardTitle>
															</CardHeader>
															<CardContent>
																<p className="text-sm">
																	{plantDetails.soil_drainage.join(", ")}
																</p>
															</CardContent>
														</Card>
													)}

												{/* Maintenance */}
												{plantDetails.maintenance &&
													plantDetails.maintenance.length > 0 && (
														<Card>
															<CardHeader className="pb-2">
																<CardTitle className="text-sm">
																	Maintenance
																</CardTitle>
															</CardHeader>
															<CardContent>
																<p className="text-sm">
																	{plantDetails.maintenance.join(", ")}
																</p>
															</CardContent>
														</Card>
													)}

												{/* Zones */}
												{plantDetails.usda_zones &&
													plantDetails.usda_zones.length > 0 && (
														<Card>
															<CardHeader className="pb-2">
																<CardTitle className="text-sm">
																	USDA Zones
																</CardTitle>
															</CardHeader>
															<CardContent>
																<p className="text-sm">
																	{plantDetails.usda_zones.join(", ")}
																</p>
															</CardContent>
														</Card>
													)}
											</div>
										</div>
									</div>
								) : (
									<div className="h-full flex items-center justify-center p-6">
										<div className="text-center max-w-md">
											<Info className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
											<h3 className="text-lg font-medium mb-2">
												Select a plant to view details
											</h3>
											<p className="text-sm text-muted-foreground">
												Search for a plant name in the panel on the left and
												select it to see detailed information here.
											</p>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AddPlant;

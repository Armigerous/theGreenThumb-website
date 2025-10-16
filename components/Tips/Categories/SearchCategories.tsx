"use client";

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { DialogTitle } from "@radix-ui/react-dialog";
import { FolderIcon, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { TipCategory } from "@/types/Tip";

type SearchCategoriesDialogProps = {
	categories: TipCategory[];
};

// Utility function to highlight matching texts
function highlightMatch(text: string, query: string) {
	if (!query) return text;
	const regex = new RegExp(`(${query})`, "gi");
	return text.split(regex).map((part, index) =>
		regex.test(part) ? (
			<span key={index} className="font-title-bold">
				{part}
			</span>
		) : (
			part
		)
	);
}

function getRandomItems<T>(array: T[], count: number): T[] {
	const shuffled = [...array].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
}

export default function SearchCategories({
	categories,
}: SearchCategoriesDialogProps) {
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const router = useRouter();

	return (
		<>
			<Button
				variant="ghost"
				onClick={() => setOpen(true)}
				className="h-full mx-0 md:mx-4 w-auto border-2 border-black my-2 bg-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-cream-800 focus:ring-offset-2 transition-all duration-200"
			>
				<Search className="w-4 h-4 text-cream-800" />
				<span className="text-cream-800">Search for Categories...</span>
			</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<DialogTitle className="text-lg font-paragraph-semibold p-2">
					Search Categories
				</DialogTitle>
				<CommandInput
					placeholder="Search for Categories..."
					value={searchQuery}
					onValueChange={(value) => setSearchQuery(value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							router.push(
								`/categories/search?query=${encodeURIComponent(searchQuery)}`
							);
							setOpen(false);
						}
					}}
				/>
				<CommandList>
					{searchQuery.trim() === "" ? (
						<>
							<CommandGroup heading="Suggestions">
								{getRandomItems(categories, 3).map((category, index) => (
									<Link
										href={`/tips/category/${category.slug.current}`}
										key={index}
									>
										<CommandItem
											key={index}
											className="cursor-pointer hover:bg-brand-100"
										>
											<FolderIcon className="w-5 h-5 mr-2" />
											<span className="text-cream-800 truncate max-w-sm">
												{category.title}
											</span>
										</CommandItem>
									</Link>
								))}
							</CommandGroup>
						</>
					) : (
						<>
							{categories.filter((category) =>
								category.title.toLowerCase().includes(searchQuery.toLowerCase())
							).length > 0 ? (
								<CommandGroup heading="Matching Results">
									{categories
										.filter((category) =>
											category.title
												.toLowerCase()
												.includes(searchQuery.toLowerCase())
										)
										.map((category, index) => (
											<Link
												href={`/tips/category/${category.slug.current}`}
												key={index}
											>
												<CommandItem
													key={index}
													className="cursor-pointer hover:bg-brand-100"
												>
													<FolderIcon className="w-5 h-5 mr-2" />
													<span className="text-cream-800 truncate max-w-sm">
														{highlightMatch(category.title, searchQuery)}
													</span>
												</CommandItem>
											</Link>
										))}
								</CommandGroup>
							) : (
								<CommandEmpty>No categories found.</CommandEmpty>
							)}
						</>
					)}
				</CommandList>
			</CommandDialog>
		</>
	);
}

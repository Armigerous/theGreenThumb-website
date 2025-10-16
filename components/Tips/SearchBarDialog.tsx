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
import { CoffeeIcon, PenBoxIcon, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Tip } from "@/types/Tip";

type SearchBarDialogProps = {
	tips: Tip[];
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

export default function SearchBarDialog({ tips }: SearchBarDialogProps) {
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const router = useRouter();

	const filteredTips = tips.filter((tip) =>
		tip.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<>
			<Button
				variant="ghost"
				onClick={() => setOpen(true)}
				className="justify-start w-full max-w-screen-sm relative flex items-center gap-2 my-2 px-4 py-2 border-2 border-cream-800 rounded-lg bg-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-cream-800 focus:ring-offset-2 transition-all duration-200"
			>
				<Search className="w-4 h-4 text-cream-800" />
				<span className="text-cream-800">Search for Tips & Tricks...</span>
			</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<DialogTitle className="text-lg font-paragraph-semibold p-2">
					Search
				</DialogTitle>
				<CommandInput
					placeholder="Search for Tips & Tricks..."
					value={searchQuery}
					onValueChange={(value) => setSearchQuery(value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							router.push(
								`/tips/search?query=${encodeURIComponent(searchQuery)}`
							);
							setOpen(false);
						}
					}}
				/>
				<CommandList>
					{searchQuery.trim() === "" ? (
						<>
							<CommandGroup heading="Suggestions">
								{getRandomItems(tips, 3).map((tip, index) => (
									<Link href={`/tip/${tip.slug}`} key={index}>
										<CommandItem className="cursor-pointer hover:bg-brand-100">
											<CoffeeIcon className="w-5 h-5 mr-2" />
											<span className="text-cream-800 truncate max-w-sm">
												{tip.title}
											</span>
										</CommandItem>
									</Link>
								))}
							</CommandGroup>
						</>
					) : (
						<>
							{filteredTips.length > 0 ? (
								<CommandGroup heading="Similar Results">
									{filteredTips.map((tip, index: number) => (
										<Link href={`/tip/${tip.slug}`} key={index}>
											<CommandItem className="cursor-pointer hover:bg-brand-100">
												<PenBoxIcon className="w-5 h-5 mr-2" />
												<span className="text-cream-800 truncate max-w-sm">
													{highlightMatch(tip.title, searchQuery)}
												</span>
											</CommandItem>
										</Link>
									))}
								</CommandGroup>
							) : (
								<CommandEmpty>No results found.</CommandEmpty>
							)}
						</>
					)}{" "}
				</CommandList>
			</CommandDialog>
		</>
	);
}

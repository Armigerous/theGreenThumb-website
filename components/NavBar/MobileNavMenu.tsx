"use client";

import { navMenuItems } from "./nav";
import StableMobileAuthSection from "../StableMobileAuthSection";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, ListChecks, Smartphone } from "lucide-react";
import NextLink from "next/link";

// Reason: Client component for mobile navigation menu that requires interactive toggle state
const MobileNavMenu = memo(() => {
	const [open, setOpen] = useState(false);

	return (
		<div className="lg:hidden flex items-center">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 hover:bg-brand-25 hover:text-primary transition-colors duration-200"
						suppressHydrationWarning
					>
						<Menu className="h-4 w-4" />
						<span className="sr-only">Toggle menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent
					side="right"
					className="w-[300px] sm:w-[400px] p-0"
					suppressHydrationWarning
				>
					<div className="flex flex-col h-full">
						{/* Mobile Logo - Fixed at top */}
						<div className="px-6 py-8 border-b border-muted flex-shrink-0">
							<NextLink
								href="/"
								className="text-4xl font-bold text-foreground hover:text-primary transition-colors duration-200"
								onClick={() => setOpen(false)}
							>
								GreenThumb
							</NextLink>
						</div>

						{/* Scrollable Navigation Content */}
						<ScrollArea className="flex-1 px-6">
							<div className="py-6 space-y-4">
								{/* Features Section */}
								<div className="space-y-2">
									<h3 className="text-lg font-semibold text-muted-foreground px-4">
										Features
									</h3>
									<NextLink
										href="/#ProductFeatures"
										className="flex items-center gap-3 text-xl font-medium px-4 py-3 rounded-md transition-colors duration-200 hover:bg-brand-25 hover:text-primary"
										onClick={() => setOpen(false)}
									>
										<ListChecks className="h-5 w-5" />
										Product Features
									</NextLink>
									<NextLink
										href="/#AppFeatures"
										className="flex items-center gap-3 text-xl font-medium px-4 py-3 rounded-md transition-colors duration-200 hover:bg-brand-25 hover:text-primary"
										onClick={() => setOpen(false)}
									>
										<Smartphone className="h-5 w-5" />
										App Features
									</NextLink>
								</div>

								{/* Main Navigation Items */}
								<div className="space-y-2">
									<h3 className="text-lg font-semibold text-muted-foreground px-4">
										Navigation
									</h3>
									{navMenuItems
										.filter((item) => !item.href.startsWith("/#")) // Filter out anchor links since they're in Features
										.map((item, index) => (
											<NextLink
												key={`${item.label}-${index}`}
												href={item.href}
												prefetch={item.href === "/plants" ? true : undefined}
												className="text-xl font-medium px-4 py-3 rounded-md transition-colors duration-200 hover:bg-brand-25 hover:text-primary block"
												onClick={() => setOpen(false)}
											>
												{item.label}
											</NextLink>
										))}
								</div>
							</div>
						</ScrollArea>

						{/* Mobile Auth - Fixed at bottom */}
						<div className="px-6 py-6 border-t border-muted flex-shrink-0">
							<StableMobileAuthSection />
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
});

MobileNavMenu.displayName = "MobileNavMenu";

export default MobileNavMenu;

"use client";

import { navMenuItems } from "./nav";
import StableMobileAuthSection from "../StableMobileAuthSection";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
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
						className="h-10 w-10 hover:bg-brand-25 hover:text-primary transition-colors duration-200"
						suppressHydrationWarning
					>
						<Menu className="h-5 w-5" />
						<span className="sr-only">Toggle menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent
					side="right"
					className="w-[300px] sm:w-[400px]"
					suppressHydrationWarning
				>
					<div className="flex flex-col gap-6 h-full py-8">
						{/* Mobile Logo */}
						<div className="pb-6 border-b border-muted">
							<NextLink
								href="/"
								className="text-4xl font-bold text-foreground hover:text-primary transition-colors duration-200"
								onClick={() => setOpen(false)}
							>
								GreenThumb
							</NextLink>
						</div>

						{/* Navigation Items */}
						<div className="flex flex-col gap-4">
							{navMenuItems.map((item, index) => (
								<NextLink
									key={`${item.label}-${index}`}
									href={item.href}
									prefetch={item.href === "/plants" ? true : undefined}
									className="text-2xl font-medium px-4 py-3 rounded-md transition-colors duration-200 hover:bg-brand-25 hover:text-primary"
									onClick={() => setOpen(false)}
								>
									{item.label}
								</NextLink>
							))}
						</div>

						{/* Mobile Auth */}
						<div className="mt-auto pt-6 border-t border-muted">
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

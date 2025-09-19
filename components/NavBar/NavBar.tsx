"use client";

import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import siteMetaData from "@/lib/siteMetaData";
import { FaFacebookSquare, FaInstagram } from "react-icons/fa";
import { MaxWidthWrapper } from "../maxWidthWrapper";
import DynamicDropdownFeatures from "./DynamicDropdownFeatures";
import StableAuthSection from "../StableAuthSection";
import MobileNavMenu from "./MobileNavMenu";
import { memo } from "react";
import { cn } from "@/lib/utils";

// Reason: Client component for navigation bar to properly handle auth state and prevent hydration mismatches
const NavBar = memo(() => {
	return (
		<nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
			<div className="h-20 min-h-20 max-h-20">
				<MaxWidthWrapper className="flex h-full items-center justify-between px-6">
					{/* Logo - Left Side */}
					<div className="flex-shrink-0">
						<NextLink href="/" className="flex items-center h-full">
							<p className="font-bold text-3xl text-foreground hover:text-primary transition-colors duration-200">
								GreenThumb
							</p>
						</NextLink>
					</div>

					{/* Centered Navigation */}
					<div className="hidden lg:flex flex-1 justify-center px-8">
						<NavigationMenu>
							<NavigationMenuList className="gap-2">
								<DynamicDropdownFeatures />
								<NavigationMenuItem>
									<NavigationMenuLink asChild>
										<NextLink
											href="/plants"
											prefetch={true}
											className={cn(
												navigationMenuTriggerStyle(),
												"text-xl font-medium px-6 py-2 hover:bg-brand-25 hover:text-primary transition-colors duration-200"
											)}
										>
											Plants
										</NextLink>
									</NavigationMenuLink>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<NavigationMenuLink asChild>
										<NextLink
											href="/tips"
											className={cn(
												navigationMenuTriggerStyle(),
												"text-xl font-medium px-6 py-2 hover:bg-brand-25 hover:text-primary transition-colors duration-200"
											)}
										>
											Tips
										</NextLink>
									</NavigationMenuLink>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<NavigationMenuLink asChild>
										<NextLink
											href="/contact"
											className={cn(
												navigationMenuTriggerStyle(),
												"text-xl font-medium px-6 py-2 hover:bg-brand-25 hover:text-primary transition-colors duration-200"
											)}
										>
											Contact
										</NextLink>
									</NavigationMenuLink>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<NavigationMenuLink asChild>
										<NextLink
											href="/about"
											className={cn(
												navigationMenuTriggerStyle(),
												"text-xl font-medium px-6 py-2 hover:bg-brand-25 hover:text-primary transition-colors duration-200"
											)}
										>
											About
										</NextLink>
									</NavigationMenuLink>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenu>
					</div>

					{/* Right Side - Desktop: Social Icons and Auth, Mobile: Mobile Menu */}
					<div className="flex items-center gap-3">
						{/* Desktop: Social Icons and Auth */}
						<div className="hidden lg:flex items-center gap-3">
							{/* Social Media Icons */}
							<div className="flex items-center gap-3">
								<Button
									variant="ghost"
									asChild
									className="h-12 w-12 p-0 hover:bg-brand-25 hover:text-primary transition-colors duration-200"
								>
									<NextLink
										href={siteMetaData.facebook}
										target="_blank"
										rel="noopener noreferrer"
										aria-label="Facebook"
										className="flex items-center justify-center w-full h-full"
									>
										<FaFacebookSquare
											className="rounded-lg"
											style={{
												fontSize: "28px",
												width: "28px",
												height: "28px",
											}}
										/>
									</NextLink>
								</Button>
								<Button
									variant="ghost"
									asChild
									className="h-12 w-12 p-0 hover:bg-brand-25 hover:text-primary transition-colors duration-200"
								>
									<NextLink
										href={siteMetaData.instagram}
										target="_blank"
										rel="noopener noreferrer"
										aria-label="Instagram"
										className="flex items-center justify-center w-full h-full"
									>
										<FaInstagram
											style={{
												fontSize: "28px",
												width: "28px",
												height: "28px",
											}}
										/>
									</NextLink>
								</Button>
							</div>

							{/* Separator */}
							<div className="h-6 w-px bg-gray-300 mx-2" />

							{/* Auth Section */}
							<div className="flex items-center">
								<StableAuthSection />
							</div>
						</div>

						{/* Mobile Navigation */}
						<MobileNavMenu />
					</div>
				</MaxWidthWrapper>
			</div>
		</nav>
	);
});

NavBar.displayName = "NavBar";

export default NavBar;

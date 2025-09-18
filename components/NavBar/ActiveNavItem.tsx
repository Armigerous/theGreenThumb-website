"use client";

import { usePathname } from "next/navigation";
import { useEffect, memo, useMemo } from "react";
import NextLink from "next/link";
import { cn } from "@/lib/utils";
import {
	NavigationMenuLink,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface ActiveNavItemProps {
	href: string;
	children: React.ReactNode;
	className?: string;
}

// Reason: Client component for handling active state and preloading critical routes
const ActiveNavItem = memo(
	({ href, children, className = "" }: ActiveNavItemProps) => {
		const pathname = usePathname();
		const isActive = useMemo(() => pathname === href, [pathname, href]);

		// Reason: Preload critical routes for faster navigation
		useEffect(() => {
			if (typeof window !== "undefined") {
				const link = document.createElement("link");
				link.rel = "prefetch";
				link.href = href;
				document.head.appendChild(link);

				return () => {
					if (document.head.contains(link)) {
						document.head.removeChild(link);
					}
				};
			}
		}, [href]);

		return (
			<NavigationMenuLink asChild>
				<NextLink
					href={href}
					className={cn(
						navigationMenuTriggerStyle(),
						"text-lg",
						isActive &&
							"after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:rounded-[2px] after:bg-primary",
						className
					)}
				>
					{children}
				</NextLink>
			</NavigationMenuLink>
		);
	}
);

ActiveNavItem.displayName = "ActiveNavItem";

export default ActiveNavItem;

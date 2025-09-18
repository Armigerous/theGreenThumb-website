"use client";

import { Button } from "@/components/ui/button";
import {
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import { Leaf } from "lucide-react";
import { memo } from "react";

// Reason: Client component for mobile authentication with Clerk hooks and interactive state
const MobileAuthSection = memo(() => {
	return (
		<div className="h-12 flex items-center">
			<SignedOut>
				<div className="flex gap-4 flex-col sm:flex-row">
					<SignInButton mode="modal">
						<Button
							variant="ghost"
							className="text-black hover:text-primary transition whitespace-nowrap h-10 px-4"
						>
							Sign In
						</Button>
					</SignInButton>
					<SignUpButton mode="modal">
						<Button
							variant="default"
							className="bg-primary text-cream-50 hover:bg-primary/90 transition whitespace-nowrap h-10 px-4"
						>
							Sign Up
						</Button>
					</SignUpButton>
				</div>
			</SignedOut>
			<SignedIn>
				<UserButton
					appearance={{
						elements: {
							userButtonAvatarBox: "",
							userButtonTrigger: "w-12 h-12",
						},
					}}
				>
					<UserButton.MenuItems>
						<UserButton.Link
							label="My Garden"
							labelIcon={<Leaf className="w-4 h-4" />}
							href="/my-garden"
						/>
						<UserButton.Action label="manageAccount" />
						<UserButton.Action label="signOut" />
					</UserButton.MenuItems>
				</UserButton>
			</SignedIn>
		</div>
	);
});

MobileAuthSection.displayName = "MobileAuthSection";

export default MobileAuthSection;

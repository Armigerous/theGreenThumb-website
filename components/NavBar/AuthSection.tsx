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

// Reason: Client component for Clerk authentication that requires hooks and interactive state
const AuthSection = memo(() => {
	return (
		<div className="h-10 flex items-center">
			<SignedOut>
				<div className="flex gap-2">
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
							userButtonTrigger: "w-10 h-10",
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

AuthSection.displayName = "AuthSection";

export default AuthSection;

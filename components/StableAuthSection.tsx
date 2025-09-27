"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { Leaf, Camera } from "lucide-react";
import { memo, useEffect, useState } from "react";

// Reason: Stable auth section that prevents flickering by maintaining state across navigation
const StableAuthSection = memo(() => {
  const { isLoaded, user, isSignedIn } = useUser();
  const [hasInitialized, setHasInitialized] = useState(false);
  const [stableAuthState, setStableAuthState] = useState<{
    isSignedIn: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any;
  } | null>(null);

  // Reason: Only update state once when Clerk loads, then maintain it
  useEffect(() => {
    if (isLoaded && !hasInitialized) {
      setStableAuthState({
        isSignedIn: !!isSignedIn,
        user: user,
      });
      setHasInitialized(true);
    }
  }, [isLoaded, isSignedIn, user, hasInitialized]);

  // Reason: Show nothing until we have stable state, but reserve consistent space
  if (!hasInitialized || !stableAuthState) {
    return <div className="h-10 w-10 flex items-center justify-center" />; // Reserve space for avatar
  }

  return (
    <div className="h-10 flex items-center w-10">
      {stableAuthState.isSignedIn ? (
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "w-10 h-10 min-w-10 min-h-10",
              userButtonTrigger: "w-10 h-10 min-w-10 min-h-10",
              avatarBox: "w-10 h-10 min-w-10 min-h-10",
            },
          }}
        >
          <UserButton.MenuItems>
            <UserButton.Link
              label="My Garden"
              labelIcon={<Leaf className="w-4 h-4" />}
              href="/my-garden"
            />
            <UserButton.Link
              label="Identify Plants"
              labelIcon={<Camera className="w-4 h-4" />}
              href="/identify"
            />
            <UserButton.Action label="manageAccount" />
            <UserButton.Action label="signOut" />
          </UserButton.MenuItems>
        </UserButton>
      ) : (
        <div className="flex gap-2 w-full">
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
      )}
    </div>
  );
});

StableAuthSection.displayName = "StableAuthSection";

export default StableAuthSection;

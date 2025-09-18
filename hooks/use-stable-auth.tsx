"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";

interface StableAuthState {
	isAuthenticated: boolean | null;
	isLoading: boolean;
	user: any;
}

// Reason: Custom hook to maintain stable auth state across navigation and prevent loading states during route changes
export const useStableAuth = (): StableAuthState => {
	const { isLoaded, user } = useUser();
	const hasInitializedRef = useRef(false);
	const [stableState, setStableState] = useState<StableAuthState>({
		isAuthenticated: null,
		isLoading: true,
		user: null,
	});

	useEffect(() => {
		// Reason: Only update state when Clerk has loaded and we haven't initialized yet, or when user state changes
		if (isLoaded) {
			if (!hasInitializedRef.current || stableState.user?.id !== user?.id) {
				hasInitializedRef.current = true;
				setStableState({
					isAuthenticated: !!user,
					isLoading: false,
					user: user,
				});
			}
		}
	}, [isLoaded, user, stableState.user?.id]);

	// Reason: Only show loading on initial load, never during navigation once auth state is established
	return {
		isAuthenticated: stableState.isAuthenticated,
		isLoading: !hasInitializedRef.current && !isLoaded,
		user: stableState.user,
	};
};

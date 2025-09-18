"use client";

import { ReactNode } from "react";

// Reason: Simple providers component for future context providers
// Auth state is handled directly by Clerk components to avoid conflicts
export function Providers({ children }: { children: ReactNode }) {
	return <>{children}</>;
}

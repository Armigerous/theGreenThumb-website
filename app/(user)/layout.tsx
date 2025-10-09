import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper";

/**
 * User Layout Component
 *
 * Reason: Provides authentication protection for all user routes
 * and ensures proper user context is available throughout the user section
 */
export default async function UserLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Reason: Check authentication status for all user routes
	const { userId } = await auth();

	// Reason: Redirect unauthenticated users to sign-in
	if (!userId) {
		redirect("/sign-in");
	}

	return <MaxWidthWrapper className="pt-8">{children}</MaxWidthWrapper>;
}

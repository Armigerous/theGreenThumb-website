/**
 * My Garden Layout Component
 *
 * Reason: Provides specific layout for my-garden pages
 * Authentication is handled by the parent user layout
 */
export default function MyGardenLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}

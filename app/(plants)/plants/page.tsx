import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import Header from "@/components/Database/Header";
import Search from "@/components/Database/Search/Search";

// Reason: Enable static generation and caching at route level for faster navigation
export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour

interface SearchParams {
	query?: string;
	page?: string;
	filters?: string;
	nameType?: string;
}

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const params = await searchParams;
	const query = params.query || "";
	const page = parseInt(params.page || "1", 10);
	const filters = params.filters || "";
	const nameType = params.nameType || "scientific";

	return (
		<MaxWidthWrapper className="text-center">
			<Header />
			<Search query={query} page={page} filters={filters} nameType={nameType} />
		</MaxWidthWrapper>
	);
}

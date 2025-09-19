import { StaticSearchShell } from "./StaticSearchShell";
import { DynamicPlantResults } from "./DynamicPlantResults";

// Reason: Main Search component that separates static and dynamic parts for PPR
const Search = ({
	query,
	page,
	filters,
	nameType,
}: {
	query?: string;
	page: number;
	filters?: string;
	nameType?: string;
}) => {
	return (
		<>
			{/* Static shell - prerendered */}
			<StaticSearchShell />

			{/* Dynamic results - streamed */}
			<DynamicPlantResults
				query={query}
				page={page}
				filters={filters}
				nameType={nameType}
			/>
		</>
	);
};

export default Search;

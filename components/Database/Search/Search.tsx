import { Autocomplete } from "./Autocomplete";
import SearchResults from "./SearchResults";

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
    <div className="text-left mx-auto px-8 md:px-0 sm:px-4">
      <Autocomplete />
      <SearchResults
        query={query}
        page={page}
        filters={filters}
        nameType={nameType}
      />
    </div>
  );
};

export default Search;

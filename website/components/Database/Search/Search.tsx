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
    <div className="text-left">
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

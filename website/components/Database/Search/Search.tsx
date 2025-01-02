import { Autocomplete } from "./Autocomplete";
import SearchResults from "./SearchResults";

const Search = ({
  query,
  page,
  filters,
}: {
  query?: string;
  page: number;
  filters?: string;
}) => {
  return (
    <div className="text-left">
      <Autocomplete />
      <SearchResults query={query} page={page} filters={filters} />
    </div>
  );
};

export default Search;

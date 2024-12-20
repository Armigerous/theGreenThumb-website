import { Autocomplete } from "./Autocomplete";
import SearchResults from "./SearchResults";

const Search = ({ query, page }: { query?: string; page: number }) => {
  return (
    <div className="text-left">
      <Autocomplete />
      <SearchResults query={query} page={page} />
    </div>
  );
};

export default Search;

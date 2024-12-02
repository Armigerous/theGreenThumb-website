import { BasicPlantData } from "@/types/plant";
import { Autocomplete } from "./Autocomplete";
import SearchResults from "./SearchResults";

const Search = ({
  query,
  page,
  plants,
}: {
  query?: string;
  page: number;
  plants: BasicPlantData[];
}) => {
  return (
    <div className="text-left">
      {/* <SearchBar query={query} /> */}
      <Autocomplete plants={plants} />
      <SearchResults query={query} page={page} />
    </div>
  );
};

export default Search;

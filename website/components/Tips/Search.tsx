import React from "react";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";

const Search = ({ query, page }: { query?: string; page: number }) => {
  return (
    <div>
      <SearchBar query={query} />
      <SearchResults query={query} page={page} />
    </div>
  );
};

export default Search;

import { MaxWidthWrapper } from "@/components/maxWidthHeader";
import Header from "@/components/PlantSearch/Header";
import Pagination from "@/components/PlantSearch/Pagination";
import SearchBar from "@/components/PlantSearch/SearchBar";
import SearchResults from "@/components/PlantSearch/SearchResults";
import React from "react";

const page = () => {
  return (
    <>
      <MaxWidthWrapper className="text-center ">
        <Header>{/* Plant Database image */}</Header>
        <SearchBar>{/* SearchBar */}</SearchBar>
        <SearchResults>{/* Search Results */}</SearchResults>
        <Pagination></Pagination>
      </MaxWidthWrapper>
    </>
  );
};

export default page;

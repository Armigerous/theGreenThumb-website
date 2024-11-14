import { MaxWidthWrapper } from "@/components/maxWidthHeader";
import Header from "@/components/PlantSearch/Header";
import Pagination from "@/components/PlantSearch/Pagination";
import { FilterPanel } from "@/components/PlantSearch/Filter/FilterPanel";
import SearchBar from "@/components/PlantSearch/SearchBar/SearchBar";
import SearchResults from "@/components/PlantSearch/SearchResults";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;

  return (
    <SidebarProvider>
      <FilterPanel />
      <MaxWidthWrapper className="text-center">
        <Header>{/* Plant Database image */}</Header>
        <SearchBar query={query}>{/* SearchBar */}</SearchBar>
        <SearchResults query={query}>{/* Search Results */}</SearchResults>
        <Pagination></Pagination>
      </MaxWidthWrapper>
    </SidebarProvider>
  );
}

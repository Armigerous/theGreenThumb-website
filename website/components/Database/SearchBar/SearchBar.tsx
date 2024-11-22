import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import Form from "next/form";
import SearchReset from "../SearchReset";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function SearchBar({ query }: { query?: string }) {
  return (
    <div className="w-full mx-auto space-y-4 py-6 pt-0">
      <div className="w-full flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-between">
        <Form
          action={"plants/"}
          scroll={false}
          className="relative flex-grow search-bar max-w-4xl"
        >
          <div className="relative flex items-center w-full">
            <Input
              name="query"
              defaultValue={query}
              type="text"
              placeholder="Search plants..."
              className="w-full pl-3 pr-20 py-2 text-lg bg-background border-input"
            />

            <div className="absolute right-2 flex gap-2">
              {query && <SearchReset />}
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                aria-label="Search"
              >
                <SearchIcon />
              </Button>
            </div>
          </div>
        </Form>
        <div className="flex flex-row gap-2">
          <SidebarTrigger className="flex items-center space-x-2 bg-brand-300 hover:bg-brand-200 text-brand-800 text-lg py-2">
            <SlidersHorizontalIcon className="h-5 w-5" />
            <span>Filters</span>
          </SidebarTrigger>
          <Button className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-brand-800 text-lg py-2">
            <SlidersHorizontalIcon className="h-5 w-5" />
            <span>Sort</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

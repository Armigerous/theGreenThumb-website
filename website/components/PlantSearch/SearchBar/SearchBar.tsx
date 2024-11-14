import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import Form from "next/form";
import SearchReset from "../SearchReset";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function SearchBar({ query }: { query?: string }) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 py-6">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Form
          action={"plants/"}
          scroll={false}
          className="relative flex-grow search-bar"
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
        <SidebarTrigger className="flex items-center space-x-2 bg-brand-300 hover:bg-brand-200 text-brand-800 text-lg py-2">
          <SlidersHorizontalIcon className="h-5 w-5" />
          <span>Filters</span>
        </SidebarTrigger>
        <div> Sort </div>
      </div>
    </div>
  );
}

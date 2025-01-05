"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PlantScientificName } from "@/types/plant";
import { Search, SlidersHorizontalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function Autocomplete() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [plants, setPlants] = useState<PlantScientificName[]>([]); // Use ScientificNameData
  const triggerRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // Debounce input to reduce API calls
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      try {
        // Decide whether to fetch all plants or filter based on query
        const url =
          searchQuery.trim() === ""
            ? `/api/plants/search` // Fetch all plants if there's no query
            : `/api/plants/search?query=${encodeURIComponent(searchQuery.trim())}`;

        const response = await fetch(url);
        const data = await response.json();
        setPlants(data);
      } catch (error) {
        console.error("Error fetching plants:", error);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const navigateToSearch = () => {
    if (searchQuery.trim()) {
      // Read *current* URLSearchParams from the browser
      const params = new URLSearchParams(window.location.search);

      // Update the "query" param
      params.set("query", searchQuery.trim());

      // (Optional) Reset page to 1 if you have pagination
      // params.delete("page");

      // Push the merged params back to the URL
      router.push(`/plants?${params.toString()}`);
      setOpen(false);
    }
  };

  const highlightMatch = (text: string | undefined, query: string) => {
    if (!text) return null; // Handle undefined text gracefully
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex w-full items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-start w-full max-w-screen-sm relative flex items-center gap-2 my-2 px-4 py-2 border-2 border-cream-800 rounded-lg bg-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-cream-800 focus:ring-offset-2 transition-all duration-200"
          >
            <Search className="w-4 h-4 text-cream-800" />
            {searchQuery ? `Search for "${searchQuery}"` : "Search for plants"}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          style={{
            width: triggerRef.current?.offsetWidth || "auto",
          }}
        >
          <Command>
            <CommandInput
              placeholder="Alcea rosea, Euryale ferox, Acalypha..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  navigateToSearch();
                }
              }}
            />
            <CommandList>
              {plants.length > 0 ? (
                <CommandGroup heading="Top Results">
                  {plants.map((plant) => (
                    <CommandItem
                      key={plant.slug}
                      onSelect={() => {
                        router.push(`/plant/${plant.slug}`);
                        setOpen(false);
                      }}
                      className="cursor-pointer hover:bg-brand-100"
                      value={plant.scientificName}
                    >
                      <span>
                        {highlightMatch(plant.scientificName, searchQuery)}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty>
                  No plants found with a similar name.
                  <div>
                    <p>{`Try searching for "Rose" or "Fern".`}</p>
                  </div>
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <SidebarTrigger className="bg-primary text-cream-50 rounded-lg text-lg">
        <SlidersHorizontalIcon className="h-4 w-4" />
        <span>Filters</span>
      </SidebarTrigger>
    </div>
  );
}

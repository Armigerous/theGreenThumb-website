"use client";

import { LoadingSkeleton } from "@/components/LoadingSkeleton";
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
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export function Autocomplete() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [plants, setPlants] = useState([]);
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
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const navigateToSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/plants?query=${encodeURIComponent(searchQuery.trim())}`);
      setOpen(false);
    }
  };

  const highlightMatch = (text: string, query: string) => {
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
                    value={plant.scientific_name}
                  >
                    <span>
                      {highlightMatch(plant.scientific_name, searchQuery)}
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
  );
}

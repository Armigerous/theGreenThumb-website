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
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@nextui-org/react";
import { Search, SlidersHorizontalIcon, Atom, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface PlantSearchResult {
  slug: string;
  scientific_name: string;
  common_name: string;
}

export function Autocomplete() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [plants, setPlants] = useState<PlantSearchResult[]>([]);
  const [useCommonNames, setUseCommonNames] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      try {
        const url =
          searchQuery.trim() === ""
            ? `/api/plants/search`
            : `/api/plants/search?query=${encodeURIComponent(
                searchQuery.trim()
              )}`;

        const response = await fetch(url);
        const result = await response.json();
        setPlants(result.results);
      } catch (error) {
        console.error("Error fetching plants:", error);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const navigateToSearch = () => {
    if (searchQuery.trim()) {
      const params = new URLSearchParams(window.location.search);
      params.set("query", searchQuery.trim());
      params.set("nameType", useCommonNames ? "common" : "scientific");
      params.delete("page");
      router.push(`/plants?${params.toString()}`);
      setOpen(false);
    }
  };

  const highlightMatch = (text: string | undefined, query: string) => {
    if (!text) return null;
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

  // Handler to update the naming mode and update URL accordingly.
  const handleToggle = (value: boolean) => {
    setUseCommonNames(value);
    const params = new URLSearchParams(window.location.search);
    params.set("nameType", value ? "common" : "scientific");
    router.replace(`/plants?${params.toString()}`);
  };

  return (
    <div className="flex w-full flex-col items-start gap-2">
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
              {searchQuery
                ? `Search for "${searchQuery}"`
                : "Search for plants"}
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
                        value={
                          useCommonNames
                            ? plant.common_name
                            : plant.scientific_name
                        }
                      >
                        <span>
                          {highlightMatch(
                            useCommonNames
                              ? plant.common_name
                              : plant.scientific_name,
                            searchQuery
                          )}
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
      <div className="flex items-center space-x-2">
        <Switch
          id="use-common-names"
          isSelected={useCommonNames}
          onValueChange={handleToggle}
          size="lg"
          thumbIcon={({ isSelected, className }) =>
            isSelected ? (
              <Users
                className={`${className} rounded-full bg-cream-100`}
                fill="none"
              />
            ) : (
              <Atom
                className={`${className}  rounded-full bg-cream-100`}
                fill="none"
              />
            )
          }
        />
        <Label htmlFor="use-common-names" className="text-base">
          {useCommonNames ? "Using Common Names" : "Using Scientific Names"}
        </Label>
      </div>
    </div>
  );
}

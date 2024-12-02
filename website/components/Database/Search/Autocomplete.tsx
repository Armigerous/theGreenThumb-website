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
import { BasicPlantData } from "@/types/plant";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Suspense } from "react";

export function Autocomplete({ plants = [] }: { plants?: BasicPlantData[] }) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // Use debounce hook to optimize search query updates
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Filter plants using debounced search query
  const filteredPlants =
    debouncedSearchQuery.trim() === ""
      ? plants
      : plants.filter((plant) =>
          plant.scientific_name
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase())
        );

  const navigateToSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/plants?query=${encodeURIComponent(searchQuery)}`);
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
    <ErrorBoundary>
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
              <Suspense fallback={<LoadingSkeleton />}>
                {filteredPlants.length > 0 ? (
                  <CommandGroup
                    heading={
                      debouncedSearchQuery.trim() === ""
                        ? "Recommended Plants"
                        : "Similar Results"
                    }
                  >
                    {filteredPlants.map((plant) => (
                      <CommandItem
                        key={plant.slug}
                        onSelect={() => {
                          router.push(`/plant/${plant.slug}`);
                          setOpen(false);
                        }}
                        className="cursor-pointer hover:bg-brand-100"
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
              </Suspense>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </ErrorBoundary>
  );
}

// Custom hook for debouncing input
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Error Boundary to catch errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error("Error in Autocomplete component:", error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error in Autocomplete component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4">Something went wrong.</div>;
    }
    return this.props.children;
  }
}

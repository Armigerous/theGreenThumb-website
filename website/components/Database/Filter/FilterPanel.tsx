"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

import { FilterSearch } from "./FilterSearch";
import { FilterSectionAccordion } from "./FilterSectionAccordion";
import { PremadeFilters } from "./PremadeFilters";
import { allFilters, FilterSection } from "@/types/filterData";

export function FilterPanel() {
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedOptions, setSelectedOptions] = React.useState<{
    [key: string]: boolean;
  }>({});

  const router = useRouter();

  // Rehydrate selectedOptions from the URL on component mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const filters = params.get("filters");
    if (filters) {
      const activeFilters = filters.split(",");
      const initialSelected: { [key: string]: boolean } = {};
      activeFilters.forEach((filter) => {
        initialSelected[filter] = true;
      });
      setSelectedOptions(initialSelected);
    }
  }, []);

  // Toggle checkbox selection
  const toggleOption = React.useCallback((key: string, checked: boolean) => {
    setSelectedOptions((prev) => ({ ...prev, [key]: checked }));
  }, []);

  // Determine which sections to display
  const visibleSections = React.useMemo<FilterSection[]>(() => {
    return (
      allFilters
        // Show advanced sections only if showAdvancedFilters = true
        .filter((section) => (showAdvancedFilters ? true : !section.isAdvanced))
        // Filter category options by searchTerm
        .map((section) => ({
          ...section,
          categories: section.categories.map((cat) => ({
            ...cat,
            options: cat.options.filter((option) =>
              option.toLowerCase().includes(searchTerm.toLowerCase())
            ),
          })),
        }))
        // Filter out categories with no remaining options
        .map((section) => ({
          ...section,
          categories: section.categories.filter(
            (cat) => cat.options.length > 0
          ),
        }))
        // Filter out sections with zero categories
        .filter((section) => section.categories.length > 0)
    );
  }, [searchTerm, showAdvancedFilters]);

  // Apply filters
  const applyFilters = React.useCallback(() => {
    // Collect only the active filters
    const activeFilters = Object.entries(selectedOptions)
      .filter(([, value]) => value)
      .map(([key]) => key);

    // Get current query params
    const params = new URLSearchParams(window.location.search);

    // Store active filters as a comma-separated list in the `filters` param
    if (activeFilters.length > 0) {
      params.set("filters", activeFilters.join(","));
    } else {
      params.delete("filters");
    }

    // Reset page to 1 if you want to go back to the first page after applying
    params.delete("page");

    // Update the URL without a full refresh
    router.replace(`?${params.toString()}`);
  }, [selectedOptions, router]);

  // Clear filters
  const clearAllFilters = React.useCallback(() => {
    setSelectedOptions({});

    // Get current query params
    const params = new URLSearchParams(window.location.search);

    // Remove `filters` param
    params.delete("filters");
    // Possibly also remove `page` if you want to reset pagination
    params.delete("page");

    router.replace(`?${params.toString()}`);
  }, [router]);

  // Apply premade filter
  const handlePremadeFilter = React.useCallback(
    (filters: string[]) => {
      // Reset existing filters
      setSelectedOptions({});

      // Create new filters object
      const newFilters: { [key: string]: boolean } = {};
      filters.forEach((filter) => {
        newFilters[filter] = true;
      });

      // Set new filters
      setSelectedOptions(newFilters);

      // Update URL and trigger search
      const params = new URLSearchParams(window.location.search);
      params.set("filters", filters.join(","));
      params.delete("page");
      router.replace(`?${params.toString()}`);
    },
    [router]
  );

  return (
    <Sidebar side="left" aria-label="Filter Panel">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <SlidersHorizontal className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="font-semibold">Filter Plants</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Premade filters */}
        <PremadeFilters onApplyPremadeFilter={handlePremadeFilter} />

        {/* Filter search box */}
        <FilterSearch
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Filters</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleSections.map((section) => (
                <FilterSectionAccordion
                  key={section.id}
                  section={section}
                  selectedOptions={selectedOptions}
                  onToggleOption={toggleOption}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="destructive"
              className="w-full text-cream-50"
              onClick={clearAllFilters}
            >
              Clear All
            </Button>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAdvancedFilters((prev) => !prev)}
            >
              {showAdvancedFilters
                ? "Hide Advanced Filters"
                : "Show Advanced Filters"}
            </Button>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Button variant="default" className="w-full" onClick={applyFilters}>
              Apply Filters
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

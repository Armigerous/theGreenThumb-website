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
import { allFilters, FilterSection } from "@/types/filterData";

/**
 * The main FilterPanel component.
 */
export function FilterPanel() {
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedOptions, setSelectedOptions] = React.useState<{
    [key: string]: boolean;
  }>({});

  const router = useRouter();

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
        // Within each section, filter categories’ options based on searchTerm
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
        // Finally, filter out sections with zero categories
        .filter((section) => section.categories.length > 0)
    );
  }, [searchTerm, showAdvancedFilters]);

  // Apply filters
  const applyFilters = React.useCallback(() => {
    const activeFilters = Object.entries(selectedOptions)
      .filter(([, value]) => value)
      .map(([key]) => key);

    // For simplicity, set each active filter in the query string with “=true”
    const params = new URLSearchParams();
    activeFilters.forEach((filter) => params.set(filter, "true"));

    // Update the URL without a full refresh
    router.replace(`?${params.toString()}`);
  }, [selectedOptions, router]);

  // Clear filters
  const clearAllFilters = React.useCallback(() => {
    setSelectedOptions({});
    router.replace("?");
  }, [router]);

  return (
    <Sidebar side="left">
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
              className="w-full"
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

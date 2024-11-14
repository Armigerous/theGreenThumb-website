"use client";

import { ChevronRight, SlidersHorizontal } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  advancedFilters,
  basicFilters,
  FilterCategory,
  FilterSection,
} from "@/types/filterData";
import { FilterSearch } from "./FilterSearch";

// Helper function to merge basic and advanced filters (unchanged)
function mergeFilters(
  basic: FilterSection[],
  advanced: FilterSection[]
): FilterSection[] {
  const sectionMap: { [key: string]: FilterSection } = {};

  basic.forEach((basicSection) => {
    sectionMap[basicSection.name] = {
      ...basicSection,
      categories: [...basicSection.categories],
    };
  });

  advanced.forEach((advSection) => {
    if (sectionMap[advSection.name]) {
      const existingSection = sectionMap[advSection.name];
      const categoryMap: { [key: string]: FilterCategory } = {};

      existingSection.categories.forEach((cat) => {
        categoryMap[cat.name] = { ...cat };
      });

      advSection.categories.forEach((advCategory) => {
        if (categoryMap[advCategory.name]) {
          categoryMap[advCategory.name].options = Array.from(
            new Set([
              ...categoryMap[advCategory.name].options,
              ...advCategory.options,
            ])
          );
        } else {
          categoryMap[advCategory.name] = {
            ...advCategory,
            id: `${advSection.id}-${advCategory.name}`,
          };
        }
      });

      existingSection.categories = Object.values(categoryMap);
    } else {
      sectionMap[advSection.name] = {
        ...advSection,
        id: `${advSection.id}-unique`,
      };
    }
  });

  return Object.values(sectionMap);
}

export function FilterPanel({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
  const [selectedOptions, setSelectedOptions] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [searchTerm, setSearchTerm] = React.useState("");

  const toggleOption = (key: string, checked: boolean) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const allFilters = showAdvancedFilters
    ? mergeFilters(basicFilters, advancedFilters)
    : basicFilters;

  const filtersToDisplay = allFilters
    .map((section) => ({
      ...section,
      categories: section.categories
        .map((category) => ({
          ...category,
          options: category.options.filter((option) =>
            option.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((category) => category.options.length > 0),
    }))
    .filter((section) => section.categories.length > 0);

  return (
    <Sidebar {...props}>
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
              {filtersToDisplay.map((section) => (
                <Collapsible
                  key={section.id}
                  asChild
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        {section.icon && (
                          <section.icon className="mr-2 size-4" />
                        )}
                        <span>{section.name}</span>
                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {section.categories.map((category) => (
                          <Collapsible
                            key={`${section.id}-${category.id}`}
                            asChild
                            className="group/categoryCollapsible"
                          >
                            <SidebarMenuSubItem>
                              <CollapsibleTrigger asChild>
                                <SidebarMenuSubButton>
                                  {category.icon && (
                                    <category.icon className="mr-2 size-4" />
                                  )}
                                  <span>{category.name}</span>
                                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/categoryCollapsible:rotate-90" />
                                </SidebarMenuSubButton>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="space-y-1 pl-6">
                                  {category.options.map((option) => {
                                    const optionKey = `${section.id}-${category.id}-${option}`;
                                    return (
                                      <div
                                        key={optionKey}
                                        className="flex items-center space-x-2"
                                      >
                                        <Checkbox
                                          id={optionKey}
                                          checked={Boolean(
                                            selectedOptions[optionKey]
                                          )}
                                          onCheckedChange={(checked) =>
                                            toggleOption(
                                              optionKey,
                                              Boolean(checked)
                                            )
                                          }
                                        />
                                        <Label
                                          htmlFor={optionKey}
                                          className="text-sm font-normal"
                                        >
                                          {option}
                                        </Label>
                                      </div>
                                    );
                                  })}
                                </div>
                              </CollapsibleContent>
                            </SidebarMenuSubItem>
                          </Collapsible>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
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
              onClick={() => setSelectedOptions({})}
            >
              Clear All
            </Button>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              {showAdvancedFilters
                ? "Show Basic Filters"
                : "Show Advanced Filters"}
            </Button>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Button variant="default" className="w-full">
              Apply Filters
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

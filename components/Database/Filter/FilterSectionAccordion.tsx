"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { FilterSection } from "@/types/filterData";
import { FilterCategoryAccordion } from "./FilterCategoryAccordion";

/**
 * This component handles rendering a single "section" accordion.
 */
interface FilterSectionAccordionProps {
  section: FilterSection;
  selectedOptions: { [key: string]: boolean };
  onToggleOption: (key: string, checked: boolean) => void;
}

export function FilterSectionAccordion({
  section,
  selectedOptions,
  onToggleOption,
}: FilterSectionAccordionProps) {
  return (
    <Collapsible
      key={section.id}
      asChild
      className="group/collapsible cursor-pointer"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            {section.icon && <section.icon className="mr-2 size-4" />}
            <span>{section.name}</span>
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {section.categories.map((category) => (
              <FilterCategoryAccordion
                key={`${section.id}-${category.id}`}
                sectionId={section.id}
                category={category}
                selectedOptions={selectedOptions}
                onToggleOption={onToggleOption}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

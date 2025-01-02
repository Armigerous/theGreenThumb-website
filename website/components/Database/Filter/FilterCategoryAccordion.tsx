"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { FilterCategory } from "@/types/filterData";

/**
 * This component handles rendering a single "category" accordion
 * within a section, including all of its options.
 */
interface FilterCategoryAccordionProps {
  sectionId: string;
  category: FilterCategory;
  selectedOptions: { [key: string]: boolean };
  onToggleOption: (key: string, checked: boolean) => void;
}

export function FilterCategoryAccordion({
  sectionId,
  category,
  selectedOptions,
  onToggleOption,
}: FilterCategoryAccordionProps) {
  return (
    <Collapsible
      key={`${sectionId}-${category.id}`}
      asChild
      className="group/categoryCollapsible"
    >
      <SidebarMenuSubItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton>
            {category.icon && <category.icon className="mr-2 size-4" />}
            <span>{category.name}</span>
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/categoryCollapsible:rotate-90" />
          </SidebarMenuSubButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="space-y-2 pl-6">
            {category.options.map((option) => {
              const optionKey = `${sectionId}-${category.id}-${option}`;
              return (
                <div key={optionKey} className="flex items-center space-x-2">
                  <Checkbox
                    id={optionKey}
                    checked={Boolean(selectedOptions[optionKey])}
                    onCheckedChange={(checked) =>
                      onToggleOption(optionKey, Boolean(checked))
                    }
                  />
                  <Label
                    htmlFor={optionKey}
                    className="text-sm font-normal cursor-pointer"
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
  );
}

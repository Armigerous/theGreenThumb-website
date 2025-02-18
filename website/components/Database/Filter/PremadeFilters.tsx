import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { premadeFilters } from "@/types/premadeFilters";
import { ChevronRight, Filter } from "lucide-react";

interface PremadeFiltersProps {
  onApplyPremadeFilter: (filters: string[]) => void;
}

export function PremadeFilters({ onApplyPremadeFilter }: PremadeFiltersProps) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <Collapsible defaultOpen asChild className="group/premadeCollapsible">
            <SidebarMenuSubItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuSubButton>
                  <Filter className="size-4 mr-2" />
                  <span>Premade Filters</span>
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/premadeCollapsible:rotate-90" />
                </SidebarMenuSubButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="flex flex-col gap-2 p-2">
                  {premadeFilters.map((filter) => (
                    <TooltipProvider key={filter.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start gap-2"
                            onClick={() => onApplyPremadeFilter(filter.filters)}
                          >
                            <filter.icon className="size-4" />
                            <span className="truncate">{filter.name}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{filter.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </CollapsibleContent>
            </SidebarMenuSubItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

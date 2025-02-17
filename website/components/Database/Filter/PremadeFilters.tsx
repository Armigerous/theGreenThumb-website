import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { premadeFilters } from "@/types/premadeFilters";

interface PremadeFiltersProps {
  onApplyPremadeFilter: (filters: string[]) => void;
}

export function PremadeFilters({ onApplyPremadeFilter }: PremadeFiltersProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Quick Filters</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
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
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

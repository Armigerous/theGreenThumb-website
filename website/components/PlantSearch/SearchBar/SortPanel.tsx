import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SortPanelProps {
  sortOption: string;
  setSortOption: (option: string) => void;
}

export default function SortPanel({ setSortOption }: SortPanelProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Sort</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setSortOption("relevance")}>
          Relevance
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSortOption("name")}>
          Name (A-Z)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSortOption("height")}>
          Height
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSortOption("bloom-time")}>
          Bloom Time
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ArrowDown01Icon } from "lucide-react";
import React from "react";

const SortPanel = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-brand-800 text-lg py-2">
          <ArrowDown01Icon className="h-5 w-5" />
          <span>Sort</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sorting Options</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem>Scientific Name (A-Z)</DropdownMenuItem>
        <DropdownMenuItem>Scientific Name (Z-A)</DropdownMenuItem>
        <DropdownMenuItem>Common Name (A-Z)</DropdownMenuItem>
        <DropdownMenuItem>Common Name (Z-A)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortPanel;

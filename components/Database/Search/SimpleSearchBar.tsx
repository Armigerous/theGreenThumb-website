"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Reason: Simple search bar without sidebar dependencies for loading states
export function SimpleSearchBar() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder="Search plants..."
        className="pl-10 h-14 text-lg"
        disabled
      />
    </div>
  );
}

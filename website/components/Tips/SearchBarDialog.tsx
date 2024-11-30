"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogTitle } from "@radix-ui/react-dialog";
import { CoffeeIcon, PenBoxIcon, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";

export default function SearchBarDialog({ tips }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        className="justify-start w-full max-w-screen-sm relative flex items-center gap-2 px-4 py-2 border-2 border-cream-800 rounded-lg bg-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-cream-800 focus:ring-offset-2 transition-all duration-200"
      >
        <Search className="w-4 h-4 text-cream-800" />
        <span className="text-cream-800">Search for Tips & Tricks...</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="text-lg font-semibold p-2">Search</DialogTitle>
        <CommandInput
          placeholder="Search for Tips & Tricks..."
          value={searchQuery}
          onValueChange={(value) => setSearchQuery(value)}
        />
        <CommandList>
          {searchQuery.trim() === "" ? (
            <>
              <CommandGroup heading="Suggestions">
                <CommandItem>
                  <CoffeeIcon className="w-5 h-5 mr-2" />
                  <span>Suggestion 1</span>
                </CommandItem>
                <CommandItem>
                  <CoffeeIcon className="w-5 h-5 mr-2" />
                  <span>Suggestion 2</span>
                </CommandItem>
                <CommandItem>
                  <CoffeeIcon className="w-5 h-5 mr-2" />
                  <span>Suggestion 3</span>
                </CommandItem>
              </CommandGroup>
            </>
          ) : (
            <>
              {tips.length > 0 ? (
                <CommandGroup heading="Results">
                  {tips.map((tip: TipType, index: number) => (
                    <Link href={`/tip/${tip.slug}`} key={index}>
                      <CommandItem key={index} className="cursor-pointer">
                        <PenBoxIcon className="w-5 h-5 mr-2" />
                        <span>{tip.title}</span>
                      </CommandItem>
                    </Link>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

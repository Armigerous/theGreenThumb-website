"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import Link from "next/link";

const SearchReset = () => {
  const reset = () => {
    const form = document.querySelector(".search-bar") as HTMLFormElement;

    if (form) {
      form.reset();
    }
  };
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-5 w-5 text-cream-500 hover:text-cream-900 dark:text-cream-400 dark:hover:text-cream-100"
      onClick={reset}
    >
      <Link href="/plants">
        <XIcon />
      </Link>
      <span className="sr-only">Clear</span>
    </Button>
  );
};

export default SearchReset;

"use client";

import React from "react";
import { Button } from "../ui/button";
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
      className="h-5 w-5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
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

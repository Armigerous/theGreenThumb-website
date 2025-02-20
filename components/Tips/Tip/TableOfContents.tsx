import { Tip } from "@/types/Tip";
import Link from "next/link";
import React from "react";

const TableOfContents = ({ tip }: { tip: Tip }) => {
  const { body } = tip;

  // Extract headings from the body
  const toc = body
    .filter(
      (block) =>
        block._type === "block" &&
        block.style !== undefined &&
        ["h1", "h2", "h3", "h4"].includes(block.style)
    )
    .map((block) => {
      const text =
        block.children?.map((child) => child.text).join("") || "Untitled";
      const slug = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      return {
        text,
        slug,
        level: block.style as "h1" | "h2" | "h3" | "h4",
      };
    });

  if (toc.length === 0) {
    return null; // Don't render TOC if there are no headings
  }

  return (
    <details
      className="border-2 border-solid border-cream-800 text-cream-800 rounded-lg sticky 
      top-6 w-full overflow-y-auto max-h-[calc(100vh-4rem)] scrollbar-hide"
      open
    >
      <summary
        className="text-lg font-semibold capitalize cursor-pointer sticky top-0 
       bg-cream-200 p-2"
      >
        Table Of Contents
      </summary>
      <ul className="mt-4 font-in text-base p-4 pt-0 bg-cream-50">
        {toc.map((heading) => (
          <li
            key={`#${heading.slug}`}
            className={`py-1 ${
              heading.level === "h1"
                ? "pl-0 font-bold text-lg"
                : heading.level === "h2"
                  ? "pl-4 sm:pl-6 text-base"
                  : heading.level === "h3"
                    ? "pl-8 sm:pl-10 text-sm"
                    : heading.level === "h4"
                      ? "pl-12 sm:pl-14 text-xs"
                      : ""
            }`}
          >
            <Link
              href={`#${heading.slug}`}
              className="flex items-center justify-start hover:underline"
            >
              <span>{heading.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
};

export default TableOfContents;

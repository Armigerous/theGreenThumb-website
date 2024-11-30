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
        (block.style === "h2" || block.style === "h3")
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
        level: block.style === "h2" ? "two" : "three",
      };
    });

  if (toc.length === 0) {
    return null; // Don't render TOC if there are no headings
  }

  return (
    <details
      className="border-2 border-solid border-cream-800 text-cream-800 rounded-lg p-4 sticky top-6 w-full overflow-hidden overflow-y-auto"
      open
    >
      <summary className="text-lg font-semibold capitalize cursor-pointer">
        Table Of Contents
      </summary>
      <ul className="mt-4 font-in text-base">
        {toc.map((heading) => (
          <li key={`#${heading.slug}`} className="py-1">
            <Link
              href={`#${heading.slug}`}
              data-level={heading.level}
              className="data-[level=two]:pl-0 data-[level=two]:pt-2
                         data-[level=two]:border-t border-solid border-cream-800/40
                         data-[level=three]:pl-4 sm:data-[level=three]:pl-6
                         flex items-center justify-start"
            >
              {heading.level === "three" && (
                <span className="flex w-1 h-1 rounded-full bg-cream-800 mr-2">
                  &nbsp;
                </span>
              )}
              <span className="hover:underline">{heading.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
};

export default TableOfContents;

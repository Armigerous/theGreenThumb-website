import React from "react";

const TableOfContents = ({ tip }: { tip: TipType }) => {
  const { slug, title, publishedAt, body, categories, mainImage } = tip;

  return (
    <details
      className="border-2 border-solid border-cream-800 text-cream-800 rounded-lg p-4 sticky top-6 w-full overflow-hidden overflow-y-auto"
      open
    >
      <summary className="text-lg font-semibold capitalize cursor-pointer">
        Table Of Content
      </summary>
      <ul className="mt-4 font-in text-base">
        <li className="py-1">Table of content</li>
      </ul>

      {/* <details
      className="border-[1px] border-solid border-dark dark:border-light text-dark dark:text-light rounded-lg p-4 sticky top-6 max-h-[80vh] overflow-hidden overflow-y-auto lg:ml-10"
      open
      >
      <summary className="text-lg font-semibold capitalize cursor-pointer">
      Table Of Content
      </summary>
      <ul className="mt-4 font-in text-base">
      {blog.toc.map((heading) => {
        return (
          <li key={`#${heading.slug}`} className="py-1">
          <a
          href={`#${heading.slug}`}
          data-level={heading.level}
          className="data-[level=two]:pl-0  data-[level=two]:pt-2
          data-[level=two]:border-t border-solid border-dark/40 dark:border-light/40
          data-[level=three]:pl-4
          sm:data-[level=three]:pl-6
          flex items-center justify-start"
          >
          {heading.level === "three" ? (
            <span className="flex w-1 h-1 rounded-full bg-dark dark:bg-light mr-2">
            &nbsp;
            </span>
            ) : null}
            
            <span className="hover:underline">{heading.text}</span>
            </a>
            </li>
            );
            })}
            </ul>
            </details> */}
    </details>
  );
};

export default TableOfContents;

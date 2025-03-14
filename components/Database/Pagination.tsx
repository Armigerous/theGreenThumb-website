"use client";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

const PaginationComponent = ({
  currentPage,
  totalPages,
  query,
}: {
  currentPage: number;
  totalPages: number;
  query?: string;
}) => {
  const generateLink = (page: number) => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    params.set("page", page.toString());
    return `/plants/?${params.toString()}`;
  };

  const showEllipsisBefore = currentPage > 2;
  const showEllipsisAfter = currentPage < totalPages - 1;

  if (totalPages <= 1) return null; // Hide pagination for single-page results

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <Pagination className="py-10">
      <PaginationContent className="flex items-center space-x-1 px-4 md:px-0">
        {/* Previous Page Button */}
        <PaginationItem>
          <PaginationPrevious
            href={generateLink(Math.max(1, currentPage - 1))}
            aria-label="Previous page"
            aria-disabled={isFirstPage}
            className={` ${isFirstPage ? "opacity-50 cursor-not-allowed" : "hover:bg-brand-200"}`}
            onClick={(e) => {
              if (isFirstPage) e.preventDefault();
            }}
          />
        </PaginationItem>

        {/* Ellipsis before current page */}
        {showEllipsisBefore && (
          <>
            <PaginationItem>
              <PaginationLink
                href={generateLink(1)}
                className="hover:bg-brand-50 text-sm transition"
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationEllipsis />
          </>
        )}

        {/* Current page and neighbors */}
        {Array.from({ length: 3 }, (_, index) => currentPage - 1 + index)
          .filter((page) => page > 0 && page <= totalPages)
          .map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href={generateLink(page)}
                isActive={page === currentPage}
                className={` ${
                  page === currentPage
                    ? "bg-brand-200 text-cream-800"
                    : "hover:bg-brand-50 text-sm transition"
                }`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

        {/* Ellipsis after current page */}
        {showEllipsisAfter && (
          <>
            <PaginationEllipsis />
            <PaginationItem>
              <PaginationLink
                href={generateLink(totalPages)}
                className="hover:bg-brand-50 text-sm transition"
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* Next Page Button */}
        <PaginationItem>
          <PaginationNext
            href={generateLink(Math.min(totalPages, currentPage + 1))}
            aria-label="Next page"
            aria-disabled={isLastPage}
            className={` ${isLastPage ? "opacity-50 cursor-not-allowed" : "hover:bg-brand-200"}`}
            onClick={(e) => {
              if (isLastPage) e.preventDefault();
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;

"use client";

import React from "react";
import { Pagination } from "@heroui/react";
import { Icon } from "@iconify/react";

interface CustomPaginationProps {
  page: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
}

export default function CustomPagination({
  page,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
}: CustomPaginationProps) {
  const safeTotalItems = totalItems ?? (totalPages * itemsPerPage);
  
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    pages.push(1);

    if (page > 3) {
      pages.push("ellipsis");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push("ellipsis");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    // Deduplicate in case of overlaps on small page counts
    return Array.from(new Set(pages));
  };

  const startItem = safeTotalItems > 0 ? (page - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(page * itemsPerPage, safeTotalItems);

  if (totalPages <= 1) return null;

  return (
    <Pagination className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-3">
      {/* 1. Summary Section */}
      <Pagination.Summary className="text-sm text-slate-500">
        Showing {startItem}-{endItem} of {safeTotalItems} results
      </Pagination.Summary>

      {/* 2. Controls Section */}
      <Pagination.Content className="gap-1 flex items-center shadow-none">
        
        {/* Previous Button */}
        <Pagination.Item>
          <Pagination.Previous 
            isDisabled={page === 1} 
            onPress={() => onPageChange(page - 1)}
            className="flex items-center gap-1.5 px-3 h-8 text-sm font-medium text-slate-700 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed bg-transparent transition-colors"
          >
            <Icon icon="solar:alt-arrow-left-linear" className="w-4 h-4" />
            <span>Previous</span>
          </Pagination.Previous>
        </Pagination.Item>

        {/* Dynamic Page Numbers */}
        {getPageNumbers().map((p, i) =>
          p === "ellipsis" ? (
            <Pagination.Item key={`ellipsis-${i}`}>
              <Pagination.Ellipsis className="w-8 h-8 flex items-center justify-center text-slate-600 bg-transparent" />
            </Pagination.Item>
          ) : (
            <Pagination.Item key={p}>
              <Pagination.Link 
                isActive={p === page} 
                onPress={() => onPageChange(p as number)}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  p === page 
                    ? "bg-slate-100 text-slate-900" 
                    : "bg-transparent text-slate-700 hover:bg-slate-50"
                }`}
              >
                {p}
              </Pagination.Link>
            </Pagination.Item>
          ),
        )}

        {/* Next Button */}
        <Pagination.Item>
          <Pagination.Next 
            isDisabled={page === totalPages} 
            onPress={() => onPageChange(page + 1)}
            className="flex items-center gap-1.5 px-3 h-8 text-sm font-medium text-slate-700 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed bg-transparent transition-colors"
          >
            <span>Next</span>
            <Icon icon="solar:alt-arrow-right-linear" className="w-4 h-4" />
          </Pagination.Next>
        </Pagination.Item>
        
      </Pagination.Content>
    </Pagination>
  );
}
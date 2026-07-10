"use client";

import React from "react";
import { Pagination as HeroUIPagination } from "@heroui/react";

export interface PaginationProps {
  pageIndex: number;
  pageCount: number;
  totalResults: number;
  pageSize: number;
  onPageChange: (index: number) => void;
  ariaLabel?: string;
}

export default function Pagination({
  pageIndex,
  pageCount,
  totalResults,
  pageSize,
  onPageChange,
  ariaLabel = "Pagination",
}: PaginationProps) {
  if (totalResults === 0 || pageCount <= 1) return null;

  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalResults);
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <HeroUIPagination size="sm" aria-label={ariaLabel}>
      <HeroUIPagination.Summary>
        {start} à {end} sur {totalResults} résultats
      </HeroUIPagination.Summary>
      <HeroUIPagination.Content>
        <HeroUIPagination.Item>
          <HeroUIPagination.Previous
            isDisabled={pageIndex === 0}
            onPress={() => onPageChange(Math.max(0, pageIndex - 1))}
          >
            <HeroUIPagination.PreviousIcon />
            Précédent
          </HeroUIPagination.Previous>
        </HeroUIPagination.Item>
        {pages.map((p) => (
          <HeroUIPagination.Item key={p}>
            <HeroUIPagination.Link
              isActive={p === pageIndex + 1}
              onPress={() => onPageChange(p - 1)}
            >
              {p}
            </HeroUIPagination.Link>
          </HeroUIPagination.Item>
        ))}
        <HeroUIPagination.Item>
          <HeroUIPagination.Next
            isDisabled={pageIndex >= pageCount - 1}
            onPress={() => onPageChange(Math.min(pageCount - 1, pageIndex + 1))}
          >
            Suivant
            <HeroUIPagination.NextIcon />
          </HeroUIPagination.Next>
        </HeroUIPagination.Item>
      </HeroUIPagination.Content>
    </HeroUIPagination>
  );
}

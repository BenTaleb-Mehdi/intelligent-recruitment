"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Chip, Pagination, Table } from "@heroui/react";
import type { SortDescriptor } from "@heroui/react";

export interface JobOffer {
  id: string;
  title: string;
  date: string;
  status: "Ouverte" | "Fermée";
  applicants: number;
}

interface JobsTableProps {
  jobs: JobOffer[];
  onToggleStatus: (id: string) => void;
}

// --- TanStack Table Mock Types & Implementation ---------------------------
// Since package installation is restricted in the workspace container, we construct a 
// robust lightweight replica of react-table that implements sorting, pagination and column accessor helpers.
type SortingState = Array<{ id: string; desc: boolean }>;

export const createColumnHelper = <TData extends unknown>() => ({
  accessor: (key: keyof TData | string, config: any) => ({
    id: key as string,
    accessorKey: key,
    ...config,
  }),
});

export const flexRender = (content: any, context: any) => {
  if (typeof content === "function") {
    return content(context);
  }
  return content;
};

function toSortDescriptor(sorting: SortingState): SortDescriptor | undefined {
  const first = sorting[0];
  if (!first) return undefined;
  return {
    column: first.id,
    direction: first.desc ? "descending" : "ascending",
  };
}

function toSortingState(descriptor: SortDescriptor): SortingState {
  return [{ desc: descriptor.direction === "descending", id: descriptor.column as string }];
}

const PAGE_SIZE = 6;

export default function JobsTable({ jobs, onToggleStatus }: JobsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);

  // Sorting bridge descriptor
  const sortDescriptor = useMemo(() => toSortDescriptor(sorting), [sorting]);

  // Column definitions inside the component so we can use dynamic handlers (e.g. onToggleStatus)
  const columnHelper = useMemo(() => createColumnHelper<JobOffer>(), []);
  
  const columns = useMemo(() => [
    columnHelper.accessor("title", {
      header: "Titre de l'offre",
      cell: (info: any) => {
        const row = info.row.original;
        return (
          <Link
            href={`/recruiter/jobs/${row.id}/complete`}
            className="font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 hover:underline transition-colors"
          >
            {info.getValue()}
          </Link>
        );
      },
    }),
    columnHelper.accessor("date", {
      header: "Date de publication",
      cell: (info: any) => <span className="text-slate-400 font-medium text-xs">{info.getValue()}</span>,
    }),
    columnHelper.accessor("status", {
      header: "Statut",
      cell: (info: any) => {
        const row = info.row.original;
        const val = info.getValue();
        return (
          <button
            onClick={() => onToggleStatus(row.id)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border leading-none select-none cursor-pointer transition-all hover:scale-105 ${
              val === "Ouverte"
                ? "bg-emerald-50 text-emerald-700 border-emerald-100/80 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-100/80"
                : "bg-rose-50 text-rose-700 border-rose-100/80 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-100/80"
            }`}
            title={val === "Ouverte" ? "Cliquer pour fermer" : "Cliquer pour ouvrir"}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              val === "Ouverte" ? "bg-emerald-500" : "bg-rose-500"
            }`} />
            {val}
          </button>
        );
      },
    }),
    columnHelper.accessor("applicants", {
      header: "Candidats",
      cell: (info: any) => {
        const row = info.row.original;
        return (
          <Link 
            href={`/recruiter/jobs/${row.id}/applicants`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
          >
            <Icon icon="solar:users-group-two-rounded-linear" className="w-4 h-4" />
            {info.getValue()} Postulants
          </Link>
        );
      },
    }),
    columnHelper.accessor("id", {
      header: "Actions",
      cell: (info: any) => {
        const row = info.row.original;
        return (
          <div className="flex items-center justify-center gap-2">
            <Link
              href={`/recruiter/jobs/${row.id}/quiz`}
              className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-lg transition-all inline-block"
              title="Voir le quiz IA"
            >
              <Icon icon="solar:question-circle-linear" className="w-4 h-4" />
            </Link>
            <Link
              href={`/recruiter/jobs/${row.id}/edit`}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all inline-block"
              title="Modifier l'offre"
            >
              <Icon icon="solar:pen-linear" className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => onToggleStatus(row.id)}
              className={`p-1.5 rounded-lg transition-all ${
                row.status === "Ouverte" 
                  ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30" 
                  : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
              }`}
              title={row.status === "Ouverte" ? "Fermer l'offre" : "Réouvrir l'offre"}
            >
              <Icon 
                icon={row.status === "Ouverte" ? "solar:lock-linear" : "solar:lock-keyhole-unlocked-linear"} 
                className="w-4 h-4" 
              />
            </button>
            <Link 
              href={`/recruiter/jobs/${row.id}/applicants`}
              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-all inline-block"
              title="Voir les candidats"
            >
              <Icon icon="solar:eye-linear" className="w-4 h-4" />
            </Link>
          </div>
        );
      },
    }),
  ], [columnHelper, onToggleStatus]);

  // --- Sorting core logic ---
  const sortedJobs = useMemo(() => {
    const activeSort = sorting[0];
    if (!activeSort) return jobs;

    const { id, desc } = activeSort;
    return [...jobs].sort((a: any, b: any) => {
      const aVal = a[id];
      const bVal = b[id];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return desc ? bVal - aVal : aVal - bVal;
      }
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr < bStr) return desc ? 1 : -1;
      if (aStr > bStr) return desc ? -1 : 1;
      return 0;
    });
  }, [jobs, sorting]);

  // --- Pagination core logic ---
  const paginatedJobs = useMemo(() => {
    const start = pageIndex * PAGE_SIZE;
    return sortedJobs.slice(start, start + PAGE_SIZE);
  }, [sortedJobs, pageIndex]);

  const pageCount = Math.ceil(jobs.length / PAGE_SIZE);
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const start = jobs.length > 0 ? pageIndex * PAGE_SIZE + 1 : 0;
  const end = Math.min((pageIndex + 1) * PAGE_SIZE, jobs.length);

  // Prepare table headers
  const headers = useMemo(() => {
    return columns.map((col) => ({
      id: col.id,
      getCanSort: () => col.id !== "id", // Disable sorting on actions column
      columnDef: col,
      getContext: () => ({}),
    }));
  }, [columns]);

  // Prepare rows structure
  const rows = useMemo(() => {
    return paginatedJobs.map((item) => ({
      id: item.id,
      getVisibleCells: () =>
        columns.map((col) => {
          const value = item[col.accessorKey as keyof JobOffer];
          return {
            id: `${item.id}-${col.id}`,
            column: {
              columnDef: col,
            },
            getContext: () => ({
              getValue: () => value,
              row: { original: item },
            }),
          };
        }),
    }));
  }, [paginatedJobs, columns]);

  return (
    <div className="font-sans">
      <Table className="border border-slate-200/60 shadow-sm rounded-xl bg-white">
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Tableau des offres d'emploi"
            className="min-w-[700px]"
            sortDescriptor={sortDescriptor}
            onSortChange={(d) => {
              setSorting(toSortingState(d));
              setPageIndex(0); // Reset page on sort
            }}
          >
            <Table.Header className="bg-white border-b border-slate-100">
              {headers.map((header) => (
                <Table.Column
                  key={header.id}
                  allowsSorting={header.getCanSort()}
                  id={header.id}
                  isRowHeader={header.id === "title"}
                  className={`bg-white text-slate-400 font-bold text-[10px] tracking-wider uppercase py-3.5 border-b border-slate-100 select-none transition-colors ${
                    header.getCanSort() 
                      ? "hover:bg-slate-50/80 cursor-pointer" 
                      : "cursor-default"
                  }`}
                >
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader sortDirection={sortDirection}>
                      {flexRender(header.columnDef.header, header.getContext())}
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>
              ))}
            </Table.Header>
            <Table.Body>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <Table.Row key={row.id} id={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Table.Cell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))
              ) : (
                <Table.Row id="empty-state">
                  <Table.Cell key="empty-cell" colSpan={5}>
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 dark:bg-zinc-800">
                        <Icon icon="solar:inbox-line-linear" className="w-6 h-6 text-slate-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Aucune offre trouvée</h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-[280px]">Aucune offre ne correspond à votre recherche ou à vos filtres actuels.</p>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
        
        {jobs.length > 0 && (
          <Table.Footer>
            <Pagination size="sm">
              <Pagination.Summary>
                {start} à {end} sur {jobs.length} résultats
              </Pagination.Summary>
              <Pagination.Content>
                <Pagination.Item>
                  <Pagination.Previous
                    isDisabled={pageIndex === 0}
                    onPress={() => setPageIndex((prev) => Math.max(0, prev - 1))}
                  >
                    <Pagination.PreviousIcon />
                    Précédent
                  </Pagination.Previous>
                </Pagination.Item>
                {pages.map((p) => (
                  <Pagination.Item key={p}>
                    <Pagination.Link
                      isActive={p === pageIndex + 1}
                      onPress={() => setPageIndex(p - 1)}
                    >
                      {p}
                    </Pagination.Link>
                  </Pagination.Item>
                ))}
                <Pagination.Item>
                  <Pagination.Next
                    isDisabled={pageIndex >= pageCount - 1}
                    onPress={() => setPageIndex((prev) => Math.min(pageCount - 1, prev + 1))}
                  >
                    Suivant
                    <Pagination.NextIcon />
                  </Pagination.Next>
                </Pagination.Item>
              </Pagination.Content>
            </Pagination>
          </Table.Footer>
        )}
      </Table>
    </div>
  );
}

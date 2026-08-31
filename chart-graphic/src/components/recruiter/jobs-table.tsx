"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Table } from "@heroui/react";
import Pagination from "@/components/recruiter/Pagination";
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

// --- TanStack Table Mock Helpers ---------------------------
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

const techColors: Record<string, string> = {
  "Next.js": "bg-blue-50 text-blue-700 border-blue-100/50",
  "Node.js": "bg-emerald-50 text-emerald-700 border-emerald-100/50",
  "PostgreSQL": "bg-sky-50 text-sky-700 border-sky-100/50",
  "AWS": "bg-amber-50 text-amber-700 border-amber-100/50",
  "Docker": "bg-blue-50 text-blue-700 border-blue-100/50",
  "Terraform": "bg-indigo-50 text-indigo-700 border-indigo-100/50",
};

export default function JobsTable({ jobs, onToggleStatus }: JobsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);

  // Sorting bridge descriptor
  const sortDescriptor = useMemo(() => toSortDescriptor(sorting), [sorting]);

  // Column definitions
  const columnHelper = useMemo(() => createColumnHelper<JobOffer>(), []);
  
  const columns = useMemo(() => [
    columnHelper.accessor("title", {
      header: "Titre de l'offre",
      cell: (info: any) => {
        const row = info.row.original;
        return (
          <Link
            href={`/recruiter/jobs/${row.id}/complete`}
            className="font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 hover:underline transition-colors text-xs"
          >
            {info.getValue()}
          </Link>
        );
      },
    }),
    columnHelper.accessor("date", {
      header: "Date de publication",
      cell: (info: any) => <span className="text-slate-400 font-medium text-xs">{new Date(info.getValue()).toLocaleDateString("fr-FR")}</span>,
    }),
    columnHelper.accessor("status", {
      header: "Statut",
      cell: (info: any) => {
        const row = info.row.original;
        const val = info.getValue();
        const isOpened = val === "Ouverte";
        return (
          <button
            onClick={() => onToggleStatus(row.id)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border leading-none select-none cursor-pointer transition-all hover:scale-105 ${
              isOpened
                ? "bg-emerald-50 text-emerald-700 border-emerald-100/80"
                : "bg-rose-50 text-rose-700 border-rose-100/80"
            }`}
            title={isOpened ? "Cliquer pour fermer" : "Cliquer pour ouvrir"}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isOpened ? "bg-emerald-500" : "bg-rose-500"}`} />
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
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-655 hover:text-blue-700 hover:underline transition-colors"
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
          <div className="flex items-center gap-2">
            <Link
              href={`/recruiter/jobs/${row.id}/quiz`}
              className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
              title="Voir le quiz IA"
            >
              <Icon icon="solar:question-circle-linear" className="w-4 h-4" />
            </Link>
            <Link
              href={`/recruiter/jobs/${row.id}/edit`}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="Modifier l'offre"
            >
              <Icon icon="solar:pen-linear" className="w-4 h-4" />
            </Link>
            <Link 
              href={`/recruiter/jobs/${row.id}/applicants`}
              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
              title="Voir les candidats"
            >
              <Icon icon="solar:eye-linear" className="w-4 h-4" />
            </Link>
          </div>
        );
      },
    }),
  ], [columnHelper, onToggleStatus]);

  // Sorting core logic
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

  // Pagination core logic
  const paginatedJobs = useMemo(() => {
    const start = pageIndex * PAGE_SIZE;
    return sortedJobs.slice(start, start + PAGE_SIZE);
  }, [sortedJobs, pageIndex]);

  const pageCount = Math.ceil(jobs.length / PAGE_SIZE);

  // Prepare table headers for HeroUI table
  const headers = useMemo(() => {
    return columns.map((col) => ({
      id: col.id,
      getCanSort: () => col.id !== "id",
      columnDef: col,
      getContext: () => ({}),
    }));
  }, [columns]);

  // Prepare rows structure for HeroUI table
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

  if (jobs.length === 0) {
    return (
      <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center text-slate-400 select-none shadow-sm font-sans">
        <Icon icon="solar:inbox-line-linear" className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <h3 className="text-sm font-semibold text-slate-700">Aucune offre trouvée</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Aucune offre ne correspond à votre recherche ou à vos filtres actuels.</p>
      </div>
    );
  }

  return (
    <div className="font-sans space-y-6">
      {/* 1. Desktop Spreadsheet Table (hidden on mobile) */}
      <div className="hidden md:block">
        <Table className="border border-slate-200/60 shadow-sm rounded-xl bg-white">
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Tableau des offres d'emploi"
              className="min-w-[700px]"
              sortDescriptor={sortDescriptor}
              onSortChange={(d) => {
                setSorting(toSortingState(d));
                setPageIndex(0);
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
                {rows.map((row) => (
                  <Table.Row key={row.id} id={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Table.Cell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>

      {/* 2. Mobile Card List (hidden on desktop) */}
      <div className="block md:hidden space-y-4">
        {paginatedJobs.map((job) => {
          const isOpened = job.status === "Ouverte";
          return (
            <div
              key={job.id}
              className="bg-white border border-slate-200/60 rounded-2xl p-5 hover:shadow-lg hover:border-blue-200/80 transition-all duration-300 flex flex-col gap-4"
            >
              <div className="flex justify-between items-start gap-4">
                <Link
                  href={`/recruiter/jobs/${job.id}/complete`}
                  className="text-sm font-bold text-slate-850 hover:text-blue-600 transition-colors duration-200 leading-snug"
                >
                  {job.title}
                </Link>
                <button
                  onClick={() => onToggleStatus(job.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black border leading-none select-none cursor-pointer transition-all shrink-0 ${
                    isOpened
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100/50"
                      : "bg-rose-50 text-rose-700 border-rose-100/50"
                  }`}
                >
                  <span className={`w-1 h-1 rounded-full ${isOpened ? "bg-emerald-500" : "bg-rose-500"}`} />
                  {job.status}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold border-t border-slate-50 pt-3">
                <span className="flex items-center gap-1">
                  <Icon icon="solar:clock-circle-linear" className="w-3.5 h-3.5" />
                  {new Date(job.date).toLocaleDateString("fr-FR")}
                </span>
                <Link
                  href={`/recruiter/jobs/${job.id}/applicants`}
                  className="text-blue-600 font-bold flex items-center gap-1"
                >
                  <Icon icon="solar:users-group-two-rounded-linear" className="w-3.5 h-3.5" />
                  {job.applicants} postulant{job.applicants > 1 ? "s" : ""}
                </Link>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-50 pt-3 mt-1">
                <Link
                  href={`/recruiter/jobs/${job.id}/quiz`}
                  className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                  title="Voir le quiz IA"
                >
                  <Icon icon="solar:question-circle-linear" className="w-4.5 h-4.5" />
                </Link>
                <Link
                  href={`/recruiter/jobs/${job.id}/edit`}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  title="Modifier l'offre"
                >
                  <Icon icon="solar:pen-linear" className="w-4.5 h-4.5" />
                </Link>
                <Link 
                  href={`/recruiter/jobs/${job.id}/applicants`}
                  className="bg-blue-600 text-white font-bold h-8 px-3 rounded-lg flex items-center justify-center whitespace-nowrap text-[10px]"
                >
                  Voir candidats
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      {jobs.length > 0 && (
        <div className="pt-2">
          <Pagination
            pageIndex={pageIndex}
            pageCount={pageCount}
            totalResults={jobs.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPageIndex}
            ariaLabel="Pagination des offres"
          />
        </div>
      )}
    </div>
  );
}

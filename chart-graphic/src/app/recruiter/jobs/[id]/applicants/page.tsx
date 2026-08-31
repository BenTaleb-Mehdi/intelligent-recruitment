"use client";

import React, { useState, useMemo, useEffect } from "react";
import type { Key } from "@heroui/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import data from "@/data/applicants.json";
import ApplicantsTable, { Applicant } from "@/components/recruiter/ApplicantsTable";
import SearchInput from "@/components/recruiter/SearchInput";
import Dropdown from "@/components/recruiter/Dropdown";
import Pagination from "@/components/recruiter/Pagination";

const ALL_STATUSES: Applicant["status"][] = ["Nouveau", "Entretien", "En cours", "Refusé"];

const STATUS_OPTIONS = [
  { id: "Nouveau", label: "Nouveau" },
  { id: "Entretien", label: "Entretien" },
  { id: "En cours", label: "En cours" },
  { id: "Refusé", label: "Refusé" },
];

const RATING_OPTIONS = [
  { id: "0", label: "Toutes les notes" },
  { id: "3", label: "3+" },
  { id: "3.5", label: "3.5+" },
  { id: "4", label: "4+" },
  { id: "4.5", label: "4.5+" },
];

export default function JobApplicantsPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = React.useState<Key[]>(ALL_STATUSES);
  const [minScore, setMinScore] = React.useState<Key>("0");

  const applicants = data.applicants as Applicant[];

  const [pageIndex, setPageIndex] = useState(0);
  const PAGE_SIZE = 5;

  const filteredApplicants = useMemo(() => {
    return applicants.filter((a) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.skills.some((s) => s.toLowerCase().includes(q));

      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(a.status);
      const matchesScore = a.rating >= Number(minScore);

      return matchesSearch && matchesStatus && matchesScore;
    });
  }, [searchQuery, selectedStatuses, minScore, applicants]);

  // Reset page when filters change
  useEffect(() => {
    setPageIndex(0);
  }, [searchQuery, selectedStatuses, minScore]);

  const paginatedApplicants = useMemo(() => {
    const start = pageIndex * PAGE_SIZE;
    return filteredApplicants.slice(start, start + PAGE_SIZE);
  }, [filteredApplicants, pageIndex]);

  const pageCount = Math.ceil(filteredApplicants.length / PAGE_SIZE);

  return (
    <div className="space-y-6 font-sans">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/recruiter/jobs"
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
          >
            <Icon icon="solar:alt-arrow-left-linear" className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Candidats - Offre #{jobId}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Consultez et gérez les candidatures reçues pour cette offre.
            </p>
          </div>
        </div>
        <div className="self-start sm:self-center bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
          {filteredApplicants.length} candidat{filteredApplicants.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm">
        <SearchInput
          placeholder="Rechercher par nom, email ou compétence..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          containerClassName="flex-1"
        />

        <Dropdown
          options={STATUS_OPTIONS}
          placeholder="Sélectionner les statuts"
          selectionMode="multiple"
          value={selectedStatuses}
          onChange={(keys) => setSelectedStatuses(keys as Key[])}
          className="w-full sm:w-[220px]"
          ariaLabel="Statut du candidat"
        />

        <Dropdown
          options={RATING_OPTIONS}
          placeholder="Note minimum"
          value={minScore}
          onChange={(key) => setMinScore(key ?? "0")}
          className="w-full sm:w-[160px]"
          ariaLabel="Note minimum"
        />
      </div>

      <ApplicantsTable applicants={paginatedApplicants} jobId={jobId} />

      <Pagination
        pageIndex={pageIndex}
        pageCount={pageCount}
        totalResults={filteredApplicants.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPageIndex}
        ariaLabel="Pagination des candidats"
      />
    </div>
  );
}

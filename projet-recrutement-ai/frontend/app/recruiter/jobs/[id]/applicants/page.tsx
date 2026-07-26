"use client";

import React, { useState, useMemo, useEffect } from "react";
import type { Key } from "@heroui/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import ApplicantsTable, { Applicant } from "@/components/recruiter/ApplicantsTable";
import SearchInput from "@/components/recruiter/SearchInput";
import Dropdown from "@/components/recruiter/Dropdown";
import Pagination from "@/components/recruiter/Pagination";
import { api } from "@/lib/api";
import mockData from "@/data/applicants.json";

const ALL_STATUSES: Applicant["status"][] = ["Nouveau", "Entretien", "En cours", "Refusé"];

const STATUS_OPTIONS = [
  { id: "Nouveau", label: "Nouveau" },
  { id: "Entretien", label: "Entretien" },
  { id: "En cours", label: "En cours" },
  { id: "Refusé", label: "Refusé" },
];

const RATING_OPTIONS = [
  { id: "0", label: "Toutes les notes" },
  { id: "4.5", label: "★ 4.5+ (Excellent)" },
  { id: "4", label: "★ 4.0+ (Très bon)" },
  { id: "3.5", label: "★ 3.5+ (Bon)" },
  { id: "3", label: "★ 3.0+ (Moyen)" },
];

export default function JobApplicantsPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = React.useState<Key[]>(ALL_STATUSES);
  const [minScore, setMinScore] = React.useState<Key>("0");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const res = await api.get<{ success: boolean; data: Applicant[] }>(
          `/api/job-offers/${jobId}/applicants`
        );
        if (res?.data && res.data.length > 0) {
          setApplicants(res.data);
        } else {
          setApplicants(mockData.applicants as Applicant[]);
        }
      } catch (err) {
        console.error("Error loading applicants:", err);
        setApplicants(mockData.applicants as Applicant[]);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);

  const [pageIndex, setPageIndex] = useState(0);
  const PAGE_SIZE = 5;

  // Counts by status
  const statusCounts = useMemo(() => {
    const counts = {
      all: applicants.length,
      Nouveau: 0,
      Entretien: 0,
      "En cours": 0,
      Refusé: 0,
    };
    applicants.forEach((a) => {
      if (counts[a.status] !== undefined) {
        counts[a.status]++;
      }
    });
    return counts;
  }, [applicants]);

  const isFiltered = useMemo(() => {
    return (
      searchQuery.trim() !== "" ||
      selectedStatuses.length < ALL_STATUSES.length ||
      minScore !== "0"
    );
  }, [searchQuery, selectedStatuses, minScore]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStatuses(ALL_STATUSES);
    setMinScore("0");
  };

  const handlePillClick = (status: "ALL" | Applicant["status"]) => {
    if (status === "ALL") {
      setSelectedStatuses(ALL_STATUSES);
    } else {
      setSelectedStatuses([status]);
    }
  };

  const filteredApplicants = useMemo(() => {
    return applicants.filter((a) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.bio && a.bio.toLowerCase().includes(q)) ||
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
            <p className="text-sm text-slate-500 mt-0.5">
              Consultez et gérez les candidatures reçues pour cette offre.
            </p>
          </div>
        </div>
        <div className="self-start sm:self-center bg-blue-50 text-blue-700 border border-blue-100/80 text-xs font-bold px-3.5 py-1.5 rounded-full whitespace-nowrap shadow-sm">
          {filteredApplicants.length} candidat{filteredApplicants.length > 1 ? "s" : ""} trouvé{filteredApplicants.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* Filter Quick Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => handlePillClick("ALL")}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 select-none ${
            selectedStatuses.length === ALL_STATUSES.length
              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
              : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <span>Tous</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
            selectedStatuses.length === ALL_STATUSES.length ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-500"
          }`}>
            {statusCounts.all}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handlePillClick("Nouveau")}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 select-none ${
            selectedStatuses.length === 1 && selectedStatuses.includes("Nouveau")
              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
              : "bg-white text-slate-600 border-slate-200/80 hover:bg-blue-50/50"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Nouveaux</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
            selectedStatuses.length === 1 && selectedStatuses.includes("Nouveau") ? "bg-blue-700 text-blue-100" : "bg-blue-50 text-blue-600"
          }`}>
            {statusCounts.Nouveau}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handlePillClick("Entretien")}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 select-none ${
            selectedStatuses.length === 1 && selectedStatuses.includes("Entretien")
              ? "bg-amber-600 text-white border-amber-600 shadow-sm"
              : "bg-white text-slate-600 border-slate-200/80 hover:bg-amber-50/50"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Entretiens</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
            selectedStatuses.length === 1 && selectedStatuses.includes("Entretien") ? "bg-amber-700 text-amber-100" : "bg-amber-50 text-amber-700"
          }`}>
            {statusCounts.Entretien}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handlePillClick("En cours")}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 select-none ${
            selectedStatuses.length === 1 && selectedStatuses.includes("En cours")
              ? "bg-purple-600 text-white border-purple-600 shadow-sm"
              : "bg-white text-slate-600 border-slate-200/80 hover:bg-purple-50/50"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          <span>En cours</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
            selectedStatuses.length === 1 && selectedStatuses.includes("En cours") ? "bg-purple-700 text-purple-100" : "bg-purple-50 text-purple-700"
          }`}>
            {statusCounts["En cours"]}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handlePillClick("Refusé")}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 select-none ${
            selectedStatuses.length === 1 && selectedStatuses.includes("Refusé")
              ? "bg-rose-600 text-white border-rose-600 shadow-sm"
              : "bg-white text-slate-600 border-slate-200/80 hover:bg-rose-50/50"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>Refusés</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
            selectedStatuses.length === 1 && selectedStatuses.includes("Refusé") ? "bg-rose-700 text-rose-100" : "bg-rose-50 text-rose-700"
          }`}>
            {statusCounts.Refusé}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
          <SearchInput
            placeholder="Rechercher par nom, email, bio ou compétences..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            containerClassName="flex-1"
          />

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <Dropdown
              options={STATUS_OPTIONS}
              placeholder="Tous les statuts"
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
              className="w-full sm:w-[190px]"
              ariaLabel="Note minimum"
            />

            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all shrink-0 h-10 border border-slate-200/70"
                title="Réinitialiser les filtres"
              >
                <Icon icon="solar:restart-bold" className="w-3.5 h-3.5 text-slate-500" />
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Tags */}
        {isFiltered && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap text-xs text-slate-500">
            <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Filtres actifs:</span>
            
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold">
                Recherche: &quot;{searchQuery}&quot;
                <button type="button" onClick={() => setSearchQuery("")} className="hover:text-blue-900">
                  <Icon icon="solar:close-circle-bold" className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {selectedStatuses.length > 0 && selectedStatuses.length < ALL_STATUSES.length && (
              <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold">
                Statuts: {selectedStatuses.join(", ")}
                <button type="button" onClick={() => setSelectedStatuses(ALL_STATUSES)} className="hover:text-purple-900">
                  <Icon icon="solar:close-circle-bold" className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {minScore !== "0" && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-100 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold">
                Note ≥ {minScore} ★
                <button type="button" onClick={() => setMinScore("0")} className="hover:text-amber-950">
                  <Icon icon="solar:close-circle-bold" className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      <ApplicantsTable applicants={paginatedApplicants} jobId={jobId} />

      <Pagination
        page={pageIndex + 1}
        totalPages={pageCount}
        totalItems={filteredApplicants.length}
        itemsPerPage={PAGE_SIZE}
        onPageChange={(p) => setPageIndex(p - 1)}
      />
    </div>
  );
}

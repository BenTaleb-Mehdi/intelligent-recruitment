"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import ApplicantsTable, { Applicant } from "@/components/recruiter/ApplicantsTable";
import SearchInput from "@/components/recruiter/SearchInput";
import Dropdown, { DropdownOption } from "@/components/recruiter/Dropdown";
import Pagination from "@/components/recruiter/Pagination";
import { api, ApiJobOffer } from "@/lib/api";

const ALL_STATUSES: Applicant["status"][] = ["Nouveau", "Entretien", "En cours", "Refusé"];

const STATUS_OPTIONS: DropdownOption[] = [
  { id: "all", label: "Tous les statuts" },
  { id: "Nouveau", label: "Nouveau" },
  { id: "Entretien", label: "Entretien" },
  { id: "En cours", label: "En cours" },
  { id: "Refusé", label: "Refusé" },
];

const RATING_OPTIONS: DropdownOption[] = [
  { id: "0", label: "Tous les scores IA" },
  { id: "4.5", label: "★ 4.5+ (Top Match 90%+)" },
  { id: "4", label: "★ 4.0+ (Très bon 80%+)" },
  { id: "3.5", label: "★ 3.5+ (Bon 70%+)" },
  { id: "3", label: "★ 3.0+ (Potentiel 60%+)" },
];

const SORT_OPTIONS: DropdownOption[] = [
  { id: "score-desc", label: "Meilleur Score IA d'abord" },
  { id: "newest", label: "Plus récentes d'abord" },
  { id: "oldest", label: "Plus anciennes d'abord" },
  { id: "name-asc", label: "Nom (A - Z)" },
  { id: "name-desc", label: "Nom (Z - A)" },
];

export default function JobApplicantsPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [jobOfferTitle, setJobOfferTitle] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [minScore, setMinScore] = useState<string>("0");
  const [selectedSkill, setSelectedSkill] = useState<string>("all");
  const [selectedExperience, setSelectedExperience] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("score-desc");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicantsAndJob = async () => {
      setLoading(true);
      try {
        // Fetch candidates for this offer from database
        const res = await api.get<{ success: boolean; data: Applicant[] }>(
          `/api/job-offers/${jobId}/applicants`
        );
        if (res?.data && Array.isArray(res.data)) {
          setApplicants(res.data);
        } else {
          setApplicants([]);
        }

        // Fetch job offer details for the title
        try {
          const jobRes = await api.get<{ success?: boolean; data?: ApiJobOffer }>(
            `/api/job-offers/${jobId}`
          );
          if (jobRes?.data?.title) {
            setJobOfferTitle(jobRes.data.title);
          }
        } catch {
          // Keep default if title fetch fails
        }
      } catch (err) {
        console.error("Error loading candidates from database:", err);
        setApplicants([]);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchApplicantsAndJob();
    }
  }, [jobId]);

  const [pageIndex, setPageIndex] = useState(0);
  const PAGE_SIZE = 6;

  // Extract distinct skills from applicants
  const availableSkills: DropdownOption[] = useMemo(() => {
    const set = new Set<string>();
    applicants.forEach((a) => {
      if (Array.isArray(a.skills)) {
        a.skills.forEach((s) => {
          if (s.trim()) set.add(s.trim());
        });
      }
    });
    return [
      { id: "all", label: "Toutes les compétences" },
      ...Array.from(set).map((s) => ({ id: s, label: s })),
    ];
  }, [applicants]);

  // Extract distinct experience levels and roles cleanly from applicants
  const availableExperiences: DropdownOption[] = useMemo(() => {
    const customRoles = new Set<string>();
    applicants.forEach((a) => {
      if (!a.experience) return;
      try {
        const parsed = JSON.parse(a.experience);
        if (Array.isArray(parsed)) {
          parsed.forEach((item: any) => {
            const role = item.role || item.title;
            if (role && typeof role === "string") customRoles.add(role.trim());
          });
        } else if (typeof parsed === "string") {
          customRoles.add(parsed.trim());
        }
      } catch {
        if (a.experience.trim() && !a.experience.startsWith("{") && !a.experience.startsWith("[")) {
          customRoles.add(a.experience.trim());
        }
      }
    });

    const options: DropdownOption[] = [
      { id: "all", label: "Toute expérience" },
      { id: "junior", label: "Junior (0 - 2 ans)" },
      { id: "mid", label: "Intermédiaire (3 - 5 ans)" },
      { id: "senior", label: "Senior (5+ ans)" },
    ];

    // Add unique roles found
    customRoles.forEach((role) => {
      options.push({ id: role, label: role });
    });

    return options;
  }, [applicants]);

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
      statusFilter !== "all" ||
      minScore !== "0" ||
      selectedSkill !== "all" ||
      selectedExperience !== "all" ||
      sortBy !== "score-desc"
    );
  }, [searchQuery, statusFilter, minScore, selectedSkill, selectedExperience, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setMinScore("0");
    setSelectedSkill("all");
    setSelectedExperience("all");
    setSortBy("score-desc");
  };

  const handlePillClick = (status: "all" | Applicant["status"]) => {
    setStatusFilter(status);
  };

  const filteredApplicants = useMemo(() => {
    let result = applicants.filter((a) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.phone && a.phone.toLowerCase().includes(q)) ||
        (a.bio && a.bio.toLowerCase().includes(q)) ||
        (a.skills && a.skills.some((s) => s.toLowerCase().includes(q)));

      // 2. Status Filter
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;

      // 3. Score / Rating Filter
      const matchesScore = a.rating >= Number(minScore);

      // 4. Skill Filter
      const matchesSkill =
        selectedSkill === "all" ||
        (a.skills && a.skills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase()));

      // 5. Experience Filter (with smart parsing)
      const matchesExp = (() => {
        if (selectedExperience === "all") return true;
        const expRaw = (a.experience || "").toLowerCase();

        if (selectedExperience === "junior") {
          return (
            expRaw.includes("junior") ||
            expRaw.includes("stage") ||
            expRaw.includes("0-2") ||
            expRaw.includes("1 an") ||
            expRaw.includes("2 ans")
          );
        }
        if (selectedExperience === "mid") {
          return (
            expRaw.includes("interm") ||
            expRaw.includes("mid") ||
            expRaw.includes("3-5") ||
            expRaw.includes("3 ans") ||
            expRaw.includes("4 ans")
          );
        }
        if (selectedExperience === "senior") {
          return (
            expRaw.includes("senior") ||
            expRaw.includes("lead") ||
            expRaw.includes("5+") ||
            expRaw.includes("5 ans") ||
            expRaw.includes("6 ans")
          );
        }

        return expRaw.includes(selectedExperience.toLowerCase());
      })();

      return matchesSearch && matchesStatus && matchesScore && matchesSkill && matchesExp;
    });

    // 6. Sorting
    result.sort((a, b) => {
      if (sortBy === "score-desc") {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === "newest") {
        const dateA = a.appliedDate ? new Date(a.appliedDate).getTime() : 0;
        const dateB = b.appliedDate ? new Date(b.appliedDate).getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy === "oldest") {
        const dateA = a.appliedDate ? new Date(a.appliedDate).getTime() : 0;
        const dateB = b.appliedDate ? new Date(b.appliedDate).getTime() : 0;
        return dateA - dateB;
      }
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

    return result;
  }, [searchQuery, statusFilter, minScore, selectedSkill, selectedExperience, sortBy, applicants]);

  // Reset page when filters change
  useEffect(() => {
    setPageIndex(0);
  }, [searchQuery, statusFilter, minScore, selectedSkill, selectedExperience, sortBy]);

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
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
          >
            <Icon icon="solar:alt-arrow-left-linear" className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Candidats - {jobOfferTitle ? `${jobOfferTitle} (#${jobId})` : `Offre #${jobId}`}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Consultez et gérez les candidatures issues de la base de données.
            </p>
          </div>
        </div>
        <div className="self-start sm:self-center bg-blue-50 text-blue-700 border border-blue-100/80 text-xs font-bold px-3.5 py-1.5 rounded-full whitespace-nowrap shadow-2xs">
          {filteredApplicants.length} candidat{filteredApplicants.length > 1 ? "s" : ""} trouvé{filteredApplicants.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* Filter Quick Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => handlePillClick("all")}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 select-none cursor-pointer ${
            statusFilter === "all"
              ? "bg-slate-900 text-white border-slate-900 shadow-xs"
              : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <span>Tous</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
            statusFilter === "all" ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-500"
          }`}>
            {statusCounts.all}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handlePillClick("Nouveau")}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 select-none cursor-pointer ${
            statusFilter === "Nouveau"
              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
              : "bg-white text-slate-600 border-slate-200/80 hover:bg-blue-50/50"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Nouveaux</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
            statusFilter === "Nouveau" ? "bg-blue-700 text-blue-100" : "bg-blue-50 text-blue-600"
          }`}>
            {statusCounts.Nouveau}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handlePillClick("Entretien")}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 select-none cursor-pointer ${
            statusFilter === "Entretien"
              ? "bg-amber-600 text-white border-amber-600 shadow-xs"
              : "bg-white text-slate-600 border-slate-200/80 hover:bg-amber-50/50"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Entretiens</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
            statusFilter === "Entretien" ? "bg-amber-700 text-amber-100" : "bg-amber-50 text-amber-700"
          }`}>
            {statusCounts.Entretien}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handlePillClick("En cours")}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 select-none cursor-pointer ${
            statusFilter === "En cours"
              ? "bg-purple-600 text-white border-purple-600 shadow-xs"
              : "bg-white text-slate-600 border-slate-200/80 hover:bg-purple-50/50"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          <span>En cours</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
            statusFilter === "En cours" ? "bg-purple-700 text-purple-100" : "bg-purple-50 text-purple-700"
          }`}>
            {statusCounts["En cours"]}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handlePillClick("Refusé")}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 select-none cursor-pointer ${
            statusFilter === "Refusé"
              ? "bg-rose-600 text-white border-rose-600 shadow-xs"
              : "bg-white text-slate-600 border-slate-200/80 hover:bg-rose-50/50"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>Refusés</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
            statusFilter === "Refusé" ? "bg-rose-700 text-rose-100" : "bg-rose-50 text-rose-700"
          }`}>
            {statusCounts.Refusé}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5 z-20 relative">
        {/* Top row: Search input & primary controls */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
          <SearchInput
            placeholder="Rechercher par nom, email, bio ou compétences..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            containerClassName="flex-1"
          />

          <div className="w-full lg:w-[200px]">
            <Dropdown
              options={STATUS_OPTIONS}
              placeholder="Tous les statuts"
              value={statusFilter}
              onChange={(key) => {
                if (key != null) setStatusFilter(String(key));
              }}
              className="w-full"
              ariaLabel="Statut du candidat"
            />
          </div>

          <div className="w-full lg:w-[210px]">
            <Dropdown
              options={RATING_OPTIONS}
              placeholder="Score IA minimum"
              value={minScore}
              onChange={(key) => {
                if (key != null) setMinScore(String(key));
              }}
              className="w-full"
              ariaLabel="Note minimum"
            />
          </div>
        </div>

        {/* Bottom row: Skill + Experience + Sort + Reset */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-3">
            {/* Skill Filter */}
            {availableSkills.length > 1 && (
              <div className="w-full sm:w-[200px]">
                <Dropdown
                  options={availableSkills}
                  placeholder="Compétence"
                  value={selectedSkill}
                  onChange={(key) => {
                    if (key != null) setSelectedSkill(String(key));
                  }}
                  className="w-full"
                  ariaLabel="Compétence"
                />
              </div>
            )}

            {/* Experience Filter */}
            {availableExperiences.length > 1 && (
              <div className="w-full sm:w-[180px]">
                <Dropdown
                  options={availableExperiences}
                  placeholder="Expérience"
                  value={selectedExperience}
                  onChange={(key) => {
                    if (key != null) setSelectedExperience(String(key));
                  }}
                  className="w-full"
                  ariaLabel="Niveau d'expérience"
                />
              </div>
            )}

            {/* Sort Options */}
            <div className="w-full sm:w-[220px]">
              <Dropdown
                options={SORT_OPTIONS}
                placeholder="Trier par"
                value={sortBy}
                onChange={(key) => {
                  if (key != null) setSortBy(String(key));
                }}
                className="w-full"
                ariaLabel="Trier les candidats"
              />
            </div>

            {/* Reset Filter button */}
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100/80 border border-rose-100 transition-all cursor-pointer h-10 select-none"
                title="Réinitialiser les filtres"
              >
                <Icon icon="solar:restart-linear" className="w-3.5 h-3.5" />
                Réinitialiser
              </button>
            )}
          </div>

          {/* Result counter */}
          <div className="text-xs font-medium text-slate-500 self-end sm:self-center">
            <span className="font-bold text-slate-800">{filteredApplicants.length}</span> candidat{filteredApplicants.length > 1 ? "s" : ""}
          </div>
        </div>
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

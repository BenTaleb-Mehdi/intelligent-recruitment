"use client";

import React from "react";
import { Icon } from "@iconify/react";
import SearchInput from "@/components/recruiter/SearchInput";
import Dropdown, { DropdownOption } from "@/components/recruiter/Dropdown";

export interface JobsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  contractFilter: string;
  setContractFilter: (contract: string) => void;
  locationTypeFilter: string;
  setLocationTypeFilter: (loc: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  availableContracts?: string[];
  availableLocationTypes?: string[];
  totalResults?: number;
  onResetFilters: () => void;
}

const STATUS_OPTIONS: DropdownOption[] = [
  { id: "Toutes", label: "Tous les statuts" },
  { id: "Ouverte", label: "Ouverte (Open)" },
  { id: "Fermée", label: "Fermée (Closed)" },
];

const DEFAULT_CONTRACT_OPTIONS: DropdownOption[] = [
  { id: "all", label: "Tous les contrats" },
  { id: "CDI", label: "CDI" },
  { id: "CDD", label: "CDD" },
  { id: "Freelance", label: "Freelance" },
  { id: "Stage", label: "Stage" },
  { id: "Alternance", label: "Alternance" },
];

const DEFAULT_LOCATION_OPTIONS: DropdownOption[] = [
  { id: "all", label: "Tous les modes" },
  { id: "Remote", label: "Télétravail (Remote)" },
  { id: "Hybride", label: "Hybride" },
  { id: "Sur site", label: "Sur site (On-site)" },
];

const SORT_OPTIONS: DropdownOption[] = [
  { id: "newest", label: "Plus récentes d'abord" },
  { id: "oldest", label: "Plus anciennes d'abord" },
  { id: "applicants-desc", label: "Plus de candidats" },
  { id: "applicants-asc", label: "Moins de candidats" },
  { id: "title-asc", label: "Titre (A - Z)" },
  { id: "title-desc", label: "Titre (Z - A)" },
];

export default function JobsFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  contractFilter,
  setContractFilter,
  locationTypeFilter,
  setLocationTypeFilter,
  sortBy,
  setSortBy,
  availableContracts = [],
  availableLocationTypes = [],
  totalResults,
  onResetFilters,
}: JobsFiltersProps) {
  // Merge dynamic contract options if available
  const contractOptions: DropdownOption[] = React.useMemo(() => {
    if (!availableContracts || availableContracts.length === 0) {
      return DEFAULT_CONTRACT_OPTIONS;
    }
    const set = new Set(["CDI", "CDD", "Freelance", "Stage", "Alternance", ...availableContracts]);
    return [
      { id: "all", label: "Tous les contrats" },
      ...Array.from(set).map((c) => ({ id: c, label: c })),
    ];
  }, [availableContracts]);

  // Merge dynamic location options if available
  const locationOptions: DropdownOption[] = React.useMemo(() => {
    if (!availableLocationTypes || availableLocationTypes.length === 0) {
      return DEFAULT_LOCATION_OPTIONS;
    }
    const set = new Set(["Remote", "Hybride", "Sur site", ...availableLocationTypes]);
    return [
      { id: "all", label: "Tous les modes" },
      ...Array.from(set).map((l) => ({ id: l, label: l })),
    ];
  }, [availableLocationTypes]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "Toutes" ||
    contractFilter !== "all" ||
    locationTypeFilter !== "all" ||
    sortBy !== "newest";

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs font-sans space-y-3.5 z-20 relative">
      {/* Top row: Search input & primary controls */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
        {/* Search Input */}
        <SearchInput
          placeholder="Rechercher par titre de poste, compétence..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          containerClassName="flex-1"
        />

        {/* Status Dropdown */}
        <div className="w-full lg:w-[180px]">
          <Dropdown
            options={STATUS_OPTIONS}
            placeholder="Statut"
            value={statusFilter}
            onChange={(key) => {
              if (key != null) {
                setStatusFilter(String(key));
              }
            }}
            ariaLabel="Statut de l'offre"
            className="w-full"
          />
        </div>

        {/* Contract Type Dropdown */}
        <div className="w-full lg:w-[190px]">
          <Dropdown
            options={contractOptions}
            placeholder="Type de contrat"
            value={contractFilter}
            onChange={(key) => {
              if (key != null) {
                setContractFilter(String(key));
              }
            }}
            ariaLabel="Type de contrat"
            className="w-full"
          />
        </div>
      </div>

      {/* Bottom row: Secondary Filters + Sort + Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-3">
          {/* Location Mode Dropdown */}
          <div className="w-full sm:w-[190px]">
            <Dropdown
              options={locationOptions}
              placeholder="Mode de travail"
              value={locationTypeFilter}
              onChange={(key) => {
                if (key != null) {
                  setLocationTypeFilter(String(key));
                }
              }}
              ariaLabel="Mode de travail"
              className="w-full"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="w-full sm:w-[210px]">
            <Dropdown
              options={SORT_OPTIONS}
              placeholder="Trier par"
              value={sortBy}
              onChange={(key) => {
                if (key != null) {
                  setSortBy(String(key));
                }
              }}
              ariaLabel="Trier les offres"
              className="w-full"
            />
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100/80 border border-rose-100 transition-all cursor-pointer h-10 select-none"
              title="Réinitialiser tous les filtres"
            >
              <Icon icon="solar:restart-linear" className="w-3.5 h-3.5" />
              Réinitialiser
            </button>
          )}
        </div>

        {/* Result Counter */}
        {totalResults !== undefined && (
          <div className="text-xs font-medium text-slate-500 self-end sm:self-center">
            <span className="font-bold text-slate-800">{totalResults}</span> offre{totalResults > 1 ? "s" : ""} trouvée{totalResults > 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}

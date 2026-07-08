"use client";

import React from "react";
import SearchInput from "@/components/recruiter/SearchInput";
import Dropdown from "@/components/recruiter/Dropdown";

interface JobsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: "Toutes" | "Ouverte" | "Fermée";
  setStatusFilter: (status: "Toutes" | "Ouverte" | "Fermée") => void;
}

const STATUS_OPTIONS = [
  { id: "Toutes", label: "Tous les statuts" },
  { id: "Ouverte", label: "Ouverte (Open)" },
  { id: "Fermée", label: "Fermée (Closed)" },
];

export default function JobsFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}: JobsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm font-sans z-20 relative">
      
      {/* Search Input */}
      <SearchInput
        placeholder="Rechercher par titre de poste..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        containerClassName="flex-1"
      />

      {/* Select Filter Component */}
      <Dropdown
        options={STATUS_OPTIONS}
        placeholder="Tous les statuts"
        value={statusFilter}
        onChange={(key) => {
          if (key) {
            setStatusFilter(key as "Toutes" | "Ouverte" | "Fermée");
          }
        }}
        className="w-full sm:w-[220px]"
        ariaLabel="Statut de l'offre d'emploi"
      />

    </div>
  );
}

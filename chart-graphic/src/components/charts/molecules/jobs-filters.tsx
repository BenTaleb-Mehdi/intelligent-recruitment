"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Label, ListBox, Select } from "@heroui/react";

interface JobsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: "Toutes" | "Ouverte" | "Fermée";
  setStatusFilter: (status: "Toutes" | "Ouverte" | "Fermée") => void;
}

// Local wrapper for ChevronsExpandVertical using Iconify's Gravity UI icon set
// This avoids compile issues in environments where @gravity-ui/icons isn't pre-installed.
function ChevronsExpandVertical() {
  return <Icon icon="gravity-ui:chevrons-expand-vertical" className="w-3 h-3 text-slate-400" />;
}

export default function JobsFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}: JobsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm font-sans z-20 relative">
      
      {/* Search Input */}
      <div className="relative flex-1">
        <Icon 
          icon="solar:magnifer-linear" 
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" 
        />
        <input
          type="text"
          placeholder="Rechercher par titre de poste..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
        />
      </div>

      {/* HeroUI Select Filter Component */}
      <div className="shrink-0 flex items-center">
        <Select 
          className="w-full sm:w-[220px]" 
          placeholder="Tous les statuts"
          selectedKey={statusFilter}
          onSelectionChange={(key) => {
            if (key) {
              setStatusFilter(key as "Toutes" | "Ouverte" | "Fermée");
            }
          }}
        >
          <Select.Trigger className="w-full bg-white border border-slate-200/80 hover:bg-slate-50/50 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 h-10 shadow-sm transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-600">
            <Select.Value className="text-left" />
            <Select.Indicator className="size-3 flex items-center justify-center">
              <ChevronsExpandVertical />
            </Select.Indicator>
          </Select.Trigger>
          <Select.Popover className="border border-slate-200/80 shadow-lg rounded-xl bg-white p-1 z-30 mt-1 min-w-[220px]">
            <ListBox className="text-xs font-medium text-slate-600">
              <ListBox.Item id="Toutes" textValue="Tous les statuts" className="px-3 py-2 rounded-lg hover:bg-slate-100/80 cursor-pointer flex justify-between items-center">
                Tous les statuts
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="Ouverte" textValue="Ouverte (Open)" className="px-3 py-2 rounded-lg hover:bg-slate-100/80 cursor-pointer flex justify-between items-center">
                Ouverte (Open)
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="Fermée" textValue="Fermée (Closed)" className="px-3 py-2 rounded-lg hover:bg-slate-100/80 cursor-pointer flex justify-between items-center">
                Fermée (Closed)
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

    </div>
  );
}

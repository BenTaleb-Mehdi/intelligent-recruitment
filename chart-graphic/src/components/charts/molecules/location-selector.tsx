"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const DEFAULT_LOCATIONS = [
  "Casablanca, Maroc",
  "Rabat, Maroc",
  "Tanger, Maroc",
  "Marrakech, Maroc",
  "100% Télétravail (Remote)",
  "Hybride (Casablanca / Distanciel)",
];

export default function LocationSelector({ value, onChange }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [locations, setLocations] = useState<string[]>(DEFAULT_LOCATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
        setEditingIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus the inline edit input when active
  useEffect(() => {
    if (editingIndex !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingIndex]);

  // Filter list matching search query
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) =>
      loc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [locations, searchQuery]);

  // Show "Add new" button if query doesn't match any option exactly
  const showAddOption = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return false;
    return !locations.some((loc) => loc.toLowerCase() === query.toLowerCase());
  }, [locations, searchQuery]);

  const handleSelect = (loc: string) => {
    onChange(loc);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleAddNew = () => {
    const query = searchQuery.trim();
    if (!query) return;

    setLocations((prev) => [...prev, query]);
    onChange(query);
    setIsOpen(false);
    setSearchQuery("");
  };

  // Start inline editing of an option
  const startEdit = (index: number, val: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering list item selection
    setEditingIndex(index);
    setEditingValue(val);
  };

  const saveEdit = (index: number, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated = editingValue.trim();
    if (!updated) return;

    const oldVal = locations[index];
    setLocations((prev) =>
      prev.map((loc, idx) => (idx === index ? updated : loc))
    );

    // If the edited location was selected, update the parent value
    if (value === oldVal) {
      onChange(updated);
    }

    setEditingIndex(null);
  };

  const deleteLocation = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const targetVal = locations[index];
    setLocations((prev) => prev.filter((_, idx) => idx !== index));
    
    // Reset selected value if we deleted the currently active one
    if (value === targetVal) {
      onChange("");
    }
  };

  return (
    <div ref={containerRef} className="relative w-full font-sans">
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block select-none">
        Localisation *
      </label>
      
      {/* Trigger element (Looks like a select trigger) */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:bg-slate-100/40 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 h-10 shadow-sm cursor-pointer select-none transition-colors"
      >
        <span className={value ? "text-slate-800 dark:text-slate-200" : "text-slate-400"}>
          {value || "Rechercher ou sélectionner..."}
        </span>
        <Icon 
          icon="gravity-ui:chevrons-expand-vertical" 
          className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" 
        />
      </div>

      {/* Popover Dropdown Container */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 border border-slate-200/80 dark:border-zinc-800 shadow-lg rounded-xl bg-white dark:bg-zinc-950 p-2 z-30 flex flex-col gap-2 max-h-[300px] animate-fade-in">
          
          {/* Search bar inside popover */}
          <div className="relative">
            <Icon 
              icon="solar:magnifer-linear" 
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" 
            />
            <input
              type="text"
              placeholder="Rechercher / Saisir une ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
            />
          </div>

          {/* List items */}
          <div className="overflow-y-auto max-h-[180px] space-y-0.5 pr-0.5">
            {filteredLocations.map((loc, idx) => {
              const originalIndex = locations.indexOf(loc);
              const isEditing = editingIndex === originalIndex;
              const isSelected = value === loc;

              return (
                <div
                  key={idx}
                  onClick={() => !isEditing && handleSelect(loc)}
                  className={`group px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors select-none ${
                    isEditing 
                      ? "bg-slate-50 dark:bg-zinc-900" 
                      : isSelected
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                        : "text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-zinc-800/80 cursor-pointer"
                  }`}
                >
                  {isEditing ? (
                    <form 
                      onSubmit={(e) => saveEdit(originalIndex, e)} 
                      className="flex items-center gap-1.5 w-full"
                    >
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={() => saveEdit(originalIndex)}
                        className="flex-1 bg-slate-50 border border-slate-200/80 rounded-lg px-2 py-1 text-xs text-slate-800 outline-none font-medium focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-400"
                      />
                      <button 
                        type="submit" 
                        className="text-emerald-600 hover:text-emerald-700 p-0.5 transition-colors"
                      >
                        <Icon icon="solar:check-circle-linear" className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <>
                      <span className="truncate pr-4">{loc}</span>
                      
                      {/* Actions displayed on hover */}
                      <div className="flex items-center gap-1">
                        {isSelected && !isEditing && (
                          <Icon icon="solar:check-square-bold" className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        )}
                        <button
                          onClick={(e) => startEdit(originalIndex, loc, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all rounded hover:bg-slate-200 dark:hover:bg-zinc-700"
                          title="Modifier"
                        >
                          <Icon icon="solar:pen-linear" className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => deleteLocation(originalIndex, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-450 transition-all rounded hover:bg-slate-200 dark:hover:bg-zinc-700"
                          title="Supprimer"
                        >
                          <Icon icon="solar:trash-bin-trash-linear" className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {/* Empty list search matches */}
            {filteredLocations.length === 0 && !showAddOption && (
              <div className="text-center py-4 text-[11px] text-slate-400">
                Aucune localisation trouvée.
              </div>
            )}
          </div>

          {/* Add new option handler */}
          {showAddOption && (
            <button
              type="button"
              onClick={handleAddNew}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50/50 dark:text-blue-400 dark:hover:bg-blue-950/20 rounded-lg flex items-center gap-2 border border-dashed border-blue-200 dark:border-blue-900/50 mt-1 select-none transition-colors"
            >
              <Icon icon="solar:plus-circle-linear" className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Ajouter "{searchQuery}"</span>
            </button>
          )}

        </div>
      )}
    </div>
  );
}

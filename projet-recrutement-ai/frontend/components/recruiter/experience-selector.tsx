"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";

interface ExperienceSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const DEFAULT_OPTIONS = [
  "Débutant (Sans expérience)",
  "+1 à 2 ans d'expérience",
  "+3 à 5 ans d'expérience",
  "+5 ans d'expérience (Senior)",
];

export default function ExperienceSelector({ value, onChange }: ExperienceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<string[]>(DEFAULT_OPTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (editingIndex !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingIndex]);

  const filteredOptions = useMemo(() => {
    return options.filter((o) =>
      o.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const showAddOption = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return false;
    return !options.some((o) => o.toLowerCase() === query.toLowerCase());
  }, [options, searchQuery]);

  const handleSelect = (o: string) => {
    onChange(o);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleAddNew = () => {
    const query = searchQuery.trim();
    if (!query) return;
    setOptions((prev) => [...prev, query]);
    onChange(query);
    setIsOpen(false);
    setSearchQuery("");
  };

  const startEdit = (index: number, val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingIndex(index);
    setEditingValue(val);
  };

  const saveEdit = (index: number, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated = editingValue.trim();
    if (!updated) return;
    const oldVal = options[index];
    setOptions((prev) => prev.map((o, idx) => (idx === index ? updated : o)));
    if (value === oldVal) onChange(updated);
    setEditingIndex(null);
  };

  const deleteOption = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const targetVal = options[index];
    setOptions((prev) => prev.filter((_, idx) => idx !== index));
    if (value === targetVal) onChange("");
  };

  return (
    <div ref={containerRef} className="relative w-full font-sans">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block select-none">
        Expérience requise *
      </label>

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 border border-slate-200/80 hover:bg-slate-100/40 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 h-10 shadow-sm cursor-pointer select-none transition-colors"
      >
        <span className={value ? "text-slate-800" : "text-slate-400"}>
          {value || "Sélectionner l'expérience..."}
        </span>
        <Icon
          icon="gravity-ui:chevrons-expand-vertical"
          className="w-3.5 h-3.5 text-slate-400 flex-shrink-0"
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 border border-slate-200/80 shadow-lg rounded-xl bg-white p-2 z-30 flex flex-col gap-2 max-h-[300px] animate-fade-in">
          <div className="relative">
            <Icon
              icon="solar:magnifer-linear"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5"
            />
            <input
              type="text"
              placeholder="Rechercher / Saisir un niveau..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/70 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
            />
          </div>

          <div className="overflow-y-auto max-h-[180px] space-y-0.5 pr-0.5">
            {filteredOptions.map((o, idx) => {
              const originalIndex = options.indexOf(o);
              const isEditing = editingIndex === originalIndex;
              const isSelected = value === o;

              return (
                <div
                  key={idx}
                  onClick={() => !isEditing && handleSelect(o)}
                  className={`group px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors select-none ${
                    isEditing
                      ? "bg-slate-50"
                      : isSelected
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-700 hover:bg-slate-100/80 cursor-pointer"
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
                      <span className="truncate pr-4">{o}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => startEdit(originalIndex, o, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-blue-600 transition-all rounded hover:bg-slate-200"
                          title="Modifier"
                        >
                          <Icon icon="solar:pen-linear" className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => deleteOption(originalIndex, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-all rounded hover:bg-slate-200"
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

            {filteredOptions.length === 0 && !showAddOption && (
              <div className="text-center py-4 text-[11px] text-slate-400">
                Aucune option trouvée.
              </div>
            )}
          </div>

          {showAddOption && (
            <button
              type="button"
              onClick={handleAddNew}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50/50 rounded-lg flex items-center gap-2 border border-dashed border-blue-200 mt-1 select-none transition-colors"
            >
              <Icon icon="solar:plus-circle-linear" className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Ajouter &quot;{searchQuery}&quot;</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

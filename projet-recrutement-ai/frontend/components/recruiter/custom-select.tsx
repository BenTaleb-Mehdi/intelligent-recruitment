"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Select, Label, ListBox } from "@heroui/react";

interface CustomSelectProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  /** Allow the user to add custom options not in the list */
  allowAdd?: boolean;
  /** Allow the user to edit/delete existing options */
  allowEdit?: boolean;
  required?: boolean;
}

export default function CustomSelect({
  label,
  placeholder = "Sélectionner...",
  value,
  onChange,
  options: initialOptions,
  allowAdd = false,
  allowEdit = false,
  required = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<string[]>(initialOptions);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const editInputRef = useRef<HTMLInputElement>(null);

  // Focus inline edit input
  useEffect(() => {
    if (editingIndex !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingIndex]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    return options.filter((opt) =>
      opt.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const showAddOption = useMemo(() => {
    if (!allowAdd) return false;
    const query = searchQuery.trim();
    if (!query) return false;
    return !options.some((opt) => opt.toLowerCase() === query.toLowerCase());
  }, [allowAdd, options, searchQuery]);

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
    e.preventDefault();
    setEditingIndex(index);
    setEditingValue(val);
  };

  const saveEdit = (index: number, e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const updated = editingValue.trim();
    if (!updated) {
      setEditingIndex(null);
      return;
    }
    const oldVal = options[index];
    setOptions((prev) => prev.map((opt, idx) => (idx === index ? updated : opt)));
    if (value === oldVal) onChange(updated);
    setEditingIndex(null);
  };

  const deleteOption = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const targetVal = options[index];
    setOptions((prev) => prev.filter((_, idx) => idx !== index));
    if (value === targetVal) onChange("");
  };

  return (
    <Select
      isOpen={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          // Reset search and editing state when closed
          setSearchQuery("");
          setEditingIndex(null);
        }
      }}
      value={value || null}
      onChange={(val) => {
        // HeroUI v3 passes the selected Key directly here
        if (val) onChange(val.toString());
      }}
      placeholder={placeholder}
      isRequired={required}
      className="w-full font-sans"
    >
      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block select-none">
        {label}
      </Label>

      <Select.Trigger className="w-full bg-slate-50 border border-slate-200/80 hover:bg-slate-100/40 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 h-10 shadow-sm cursor-pointer select-none transition-colors data-[focus-visible=true]:ring-1 data-[focus-visible=true]:ring-blue-600 outline-none">
        {/* Select.Value automatically displays the selected item's textValue or the placeholder */}
        <Select.Value />
        <Select.Indicator>
          <Icon
            icon="gravity-ui:chevrons-expand-vertical"
            className="w-3.5 h-3.5 text-slate-400 flex-shrink-0"
          />
        </Select.Indicator>
      </Select.Trigger>

      {/* Popover encapsulates the custom Search, the ListBox, and the Add button */}
      <Select.Popover className="border border-slate-200/80 shadow-lg rounded-xl bg-white p-2 z-30 flex flex-col gap-2 min-w-[280px]">
        
        {/* 1. Custom Search Bar */}
        <div className="relative">
          <Icon
            icon="solar:magnifer-linear"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5"
          />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            // Prevent clicks/typing here from closing or stealing focus from the popover
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            className="w-full bg-slate-50 border border-slate-200/70 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
          />
        </div>

        {/* 2. HeroUI ListBox */}
        <ListBox className="overflow-y-auto max-h-[170px] space-y-0.5 pr-0.5 outline-none">
          {filteredOptions.map((opt) => {
            const originalIndex = options.indexOf(opt);
            const isEditing = editingIndex === originalIndex;

            return (
              <ListBox.Item
                key={opt}
                id={opt}
                textValue={opt} // textValue is critical for screen readers and <Select.Value />
                className="group px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors select-none text-slate-700 hover:bg-slate-100/80 data-[selected=true]:bg-blue-50 data-[selected=true]:text-blue-700 outline-none"
              >
                {isEditing ? (
                  <form
                    onSubmit={(e) => saveEdit(originalIndex, e)}
                    className="flex items-center gap-1.5 w-full"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onBlur={() => saveEdit(originalIndex)}
                      className="flex-1 bg-slate-50 border border-slate-200/80 rounded-lg px-2 py-1 text-xs text-slate-800 outline-none font-medium focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                    <button
                      type="submit"
                      className="text-emerald-600 hover:text-emerald-700 p-0.5 transition-colors"
                    >
                      <Icon icon="solar:check-circle-linear" className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate pr-4">{opt}</span>
                    <div className="flex items-center gap-1">
                      {allowEdit && (
                        <>
                          <button
                            onClick={(e) => startEdit(originalIndex, opt, e)}
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
                        </>
                      )}
                    </div>
                  </div>
                )}
              </ListBox.Item>
            );
          })}
        </ListBox>

        {filteredOptions.length === 0 && !showAddOption && (
          <div className="text-center py-4 text-[11px] text-slate-400">
            Aucun résultat trouvé.
          </div>
        )}

        {/* 3. Custom Add Option Button */}
        {showAddOption && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddNew();
            }}
            className="w-full text-left px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50/50 rounded-lg flex items-center gap-2 border border-dashed border-blue-200 mt-1 select-none transition-colors"
          >
            <Icon icon="solar:plus-circle-linear" className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Ajouter "{searchQuery}"</span>
          </button>
        )}
      </Select.Popover>
    </Select>
  );
}
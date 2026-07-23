"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";

interface DropdownListsTabProps {
  contractTypes: string[];
  setContractTypes: (value: string[]) => void;
  locations: string[];
  setLocations: (value: string[]) => void;
  experienceLevels: string[];
  setExperienceLevels: (value: string[]) => void;
}

interface ListSectionProps {
  title: string;
  icon: string;
  iconColor: string;
  items: string[];
  onItemsChange: (items: string[]) => void;
  placeholder: string;
}

function ListSection({ title, icon, iconColor, items, onItemsChange, placeholder }: ListSectionProps) {
  const [newItem, setNewItem] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const handleAdd = () => {
    const trimmed = newItem.trim();
    if (!trimmed || items.includes(trimmed)) return;
    onItemsChange([...items, trimmed]);
    setNewItem("");
  };

  const handleDelete = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditingValue(items[index]);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const trimmed = editingValue.trim();
    if (!trimmed) {
      setEditingIndex(null);
      return;
    }
    const updated = items.map((item, i) => (i === editingIndex ? trimmed : item));
    onItemsChange(updated);
    setEditingIndex(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...items];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    onItemsChange(updated);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const updated = [...items];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    onItemsChange(updated);
  };

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
        <Icon icon={icon} className={`w-4 h-4 ${iconColor}`} />
        {title}
      </h4>

      {/* Add new item */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder={placeholder}
          className="flex-1 bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
        />
        <button
          onClick={handleAdd}
          disabled={!newItem.trim() || items.includes(newItem.trim())}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all active:scale-[0.98] select-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon icon="solar:plus-linear" className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {/* Items list */}
      <div className="space-y-1.5">
        {items.map((item, index) => (
          <div
            key={index}
            className="group flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2 hover:border-slate-300 transition-colors"
          >
            {editingIndex === index ? (
              <input
                autoFocus
                type="text"
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit();
                  if (e.key === "Escape") setEditingIndex(null);
                }}
                onBlur={saveEdit}
                className="flex-1 bg-white border border-blue-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
              />
            ) : (
              <span className="flex-1 text-xs font-semibold text-slate-700 truncate">{item}</span>
            )}

            <div className="flex items-center gap-0.5">
              <button
                onClick={() => moveUp(index)}
                disabled={index === 0}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors rounded disabled:opacity-30 disabled:cursor-not-allowed"
                title="Monter"
              >
                <Icon icon="solar:arrow-up-linear" className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => moveDown(index)}
                disabled={index === items.length - 1}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors rounded disabled:opacity-30 disabled:cursor-not-allowed"
                title="Descendre"
              >
                <Icon icon="solar:arrow-down-linear" className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => startEdit(index)}
                className="p-1 text-slate-400 hover:text-blue-600 transition-colors rounded"
                title="Modifier"
              >
                <Icon icon="solar:pen-linear" className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="p-1 text-slate-400 hover:text-rose-600 transition-colors rounded"
                title="Supprimer"
              >
                <Icon icon="solar:trash-bin-trash-linear" className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-6 text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-xl">
            Aucun élément. Ajoutez-en un ci-dessus.
          </div>
        )}
      </div>
    </div>
  );
}

export default function DropdownListsTab({
  contractTypes,
  setContractTypes,
  locations,
  setLocations,
  experienceLevels,
  setExperienceLevels,
}: DropdownListsTabProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 sm:p-8 space-y-8">
      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
        <Icon icon="solar:list-check-3-linear" className="w-4 h-4 text-blue-500" />
        Gestion des listes déroulantes
      </h3>
      <p className="text-[11px] text-slate-500 -mt-4">
        Personnalisez les options disponibles dans les formulaires de création et modification des offres d&apos;emploi.
      </p>

      <ListSection
        title="Types de contrat"
        icon="solar:document-text-linear"
        iconColor="text-blue-500"
        items={contractTypes}
        onItemsChange={setContractTypes}
        placeholder="Ex: CDD, Stage, Freelance..."
      />

      <ListSection
        title="Localisations"
        icon="solar:map-point-linear"
        iconColor="text-emerald-500"
        items={locations}
        onItemsChange={setLocations}
        placeholder="Ex: Paris, Lyon, Remote..."
      />

      <ListSection
        title="Niveaux d'expérience"
        icon="solar:chart-linear"
        iconColor="text-purple-500"
        items={experienceLevels}
        onItemsChange={setExperienceLevels}
        placeholder="Ex: Junior, Senior, Lead..."
      />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { authClient } from "@/lib/auth-client";
import { api, ApiRecruiter, ApiDropdownItem, DropdownType } from "@/lib/api";

const TYPE_LABELS: Record<DropdownType, string> = {
  CONTRACT_TYPE: "Types de contrat",
  LOCATION: "Localisations",
  EXPERIENCE_LEVEL: "Niveaux d'expérience",
};

const TYPE_ICONS: Record<DropdownType, string> = {
  CONTRACT_TYPE: "solar:document-text-linear",
  LOCATION: "solar:map-point-linear",
  EXPERIENCE_LEVEL: "solar:medal-star-linear",
};

const TYPE_COLORS: Record<DropdownType, string> = {
  CONTRACT_TYPE: "bg-blue-50 text-blue-700 border-blue-200",
  LOCATION: "bg-emerald-50 text-emerald-700 border-emerald-200",
  EXPERIENCE_LEVEL: "bg-purple-50 text-purple-700 border-purple-200",
};

export default function DropdownsPage() {
  const [recruiter, setRecruiter] = useState<ApiRecruiter | null>(null);
  const [items, setItems] = useState<ApiDropdownItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const [activeType, setActiveType] = useState<DropdownType>("CONTRACT_TYPE");

  const [newValues, setNewValues] = useState<Record<DropdownType, string>>({
    CONTRACT_TYPE: "",
    LOCATION: "",
    EXPERIENCE_LEVEL: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const { data: session } = await authClient.getSession();
        if (!session?.user?.id) return;

        const { data: recruiters } = await api.get<{ data: ApiRecruiter[] }>("/api/recruiters");
        const r = recruiters?.find((r) => r.userId === session.user.id);
        if (!r) return;
        setRecruiter(r);

        const { data } = await api.get<{ data: ApiDropdownItem[] }>(
          `/api/dropdown-lists/${r.id}`
        );
        setItems(data || []);
      } catch (error) {
        console.error("Error loading dropdown data:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const getItemsByType = (type: DropdownType) =>
    items.filter((item) => item.type === type);

  const handleAdd = async (type: DropdownType) => {
    const value = newValues[type].trim();
    if (!value || !recruiter) return;

    setSaving(type);
    try {
      const { data } = await api.post<{ data: ApiDropdownItem }>(
        `/api/dropdown-lists/${recruiter.id}`,
        { type, value }
      );
      setItems((prev) => [...prev, data]);
      setNewValues((prev) => ({ ...prev, [type]: "" }));
    } catch (error: any) {
      alert(error.message || "Erreur lors de l'ajout");
    } finally {
      setSaving(null);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editValue.trim()) return;

    setSaving(id);
    try {
      const { data } = await api.put<{ data: ApiDropdownItem }>(
        `/api/dropdown-lists/${id}`,
        { value: editValue.trim() }
      );
      setItems((prev) => prev.map((item) => (item.id === id ? data : item)));
      setEditingId(null);
      setEditValue("");
    } catch (error: any) {
      alert(error.message || "Erreur lors de la modification");
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet élément ?")) return;

    setSaving(id);
    try {
      await api.delete(`/api/dropdown-lists/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error: any) {
      alert(error.message || "Erreur lors de la suppression");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!recruiter) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-slate-700">Profil introuvable</h2>
        <Link href="/recruiter/settings" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          Retour aux paramètres
        </Link>
      </div>
    );
  }

  const tabs: DropdownType[] = ["CONTRACT_TYPE", "LOCATION", "EXPERIENCE_LEVEL"];

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      <div className="flex items-center gap-3">
        <Link
          href="/recruiter/settings"
          className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Icon icon="solar:alt-arrow-left-linear" className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Gérer les listes déroulantes</h2>
          <p className="text-sm text-slate-500 mt-1">Ajoutez, modifiez ou supprimez les options disponibles dans vos formulaires.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm">
        <div className="flex border-b border-slate-100">
          {tabs.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold transition-all ${
                activeType === type
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon icon={TYPE_ICONS[type]} className="w-4 h-4" />
              {TYPE_LABELS[type]}
              <span className={`ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                activeType === type ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
              }`}>
                {getItemsByType(type).length}
              </span>
            </button>
          ))}
        </div>

        <div className="p-6 space-y-5">
          {/* Add new item */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder={`Ajouter une option pour ${TYPE_LABELS[activeType].toLowerCase()}...`}
              value={newValues[activeType]}
              onChange={(e) =>
                setNewValues((prev) => ({ ...prev, [activeType]: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd(activeType);
                }
              }}
              className="flex-1 bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
            />
            <button
              onClick={() => handleAdd(activeType)}
              disabled={!newValues[activeType].trim() || saving === activeType}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-5 rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving === activeType ? (
                <Icon icon="solar:restart-bold" className="w-4 h-4 animate-spin" />
              ) : (
                <Icon icon="solar:add-circle-linear" className="w-4 h-4" />
              )}
              Ajouter
            </button>
          </div>

          {/* Items list */}
          <div className="space-y-2">
            {getItemsByType(activeType).length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                Aucune option ajoutée. Commencez par en ajouter une ci-dessus.
              </div>
            ) : (
              getItemsByType(activeType).map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    editingId === item.id
                      ? "bg-white border-blue-200 shadow-sm"
                      : "bg-slate-50/50 border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${TYPE_COLORS[item.type]}`}>
                    {TYPE_LABELS[item.type]}
                  </span>

                  {editingId === item.id ? (
                    <input
                      autoFocus
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdate(item.id);
                        if (e.key === "Escape") {
                          setEditingId(null);
                          setEditValue("");
                        }
                      }}
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  ) : (
                    <span className="flex-1 text-xs font-medium text-slate-700">{item.value}</span>
                  )}

                  <div className="flex items-center gap-1">
                    {editingId === item.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(item.id)}
                          disabled={saving === item.id}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Icon icon="solar:check-read-linear" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditValue("");
                          }}
                          className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Icon icon="solar:close-square-linear" className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(item.id);
                            setEditValue(item.value);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Icon icon="solar:pen-linear" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={saving === item.id}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Icon icon="solar:trash-bin-minimalistic-linear" className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

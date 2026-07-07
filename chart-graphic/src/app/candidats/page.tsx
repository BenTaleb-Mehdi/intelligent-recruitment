"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import candidatesData from "@/data/candidates.json";
import LandingNavbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";

const allSkills = [...new Set(candidatesData.candidates.flatMap((c) => c.skills))].sort();
const allLocations = [...new Set(candidatesData.candidates.map((c) => c.location))].sort();
const allStatuses = [...new Set(candidatesData.candidates.map((c) => c.status))].sort();

const statusColors: Record<string, string> = {
  "Disponible": "bg-emerald-50 text-emerald-700 border-emerald-100",
  "En poste": "bg-amber-50 text-amber-700 border-amber-100",
};

export default function CandidatsPage() {
  const [search, setSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());
  const [minRating, setMinRating] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleFilter = (set: Set<string>, val: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    setter(next);
  };

  const filtered = useMemo(() => {
    return candidatesData.candidates.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedSkills.size > 0 && !c.skills.some((s) => selectedSkills.has(s))) return false;
      if (selectedLocations.size > 0 && !selectedLocations.has(c.location)) return false;
      if (selectedStatuses.size > 0 && !selectedStatuses.has(c.status)) return false;
      if (c.rating < minRating) return false;
      return true;
    });
  }, [search, selectedSkills, selectedLocations, selectedStatuses, minRating]);

  const FilterCheckbox = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
    <label className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-blue-50/50 cursor-pointer text-xs text-slate-600 transition-colors select-none">
      <input type="checkbox" checked={checked} onChange={onChange} className="accent-blue-600 w-3.5 h-3.5 rounded" />
      {label}
    </label>
  );

  return (
    <main className="min-h-screen bg-white font-sans">
      <LandingNavbar />
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Candidats Tech</h1>
            <p className="text-sm text-slate-500 mt-1">{filtered.length} candidats disponibles au Maroc</p>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <Icon icon="solar:filter-linear" className="w-4 h-4" />
            Filtres
          </button>
        </div>

        <div className="flex gap-8">
          <aside className={`${sidebarOpen ? "fixed inset-0 z-50 flex" : "hidden"} lg:sticky lg:top-24 lg:self-start lg:flex lg:w-72 shrink-0`}>
            {sidebarOpen && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
            <div className={`relative w-72 bg-white border border-slate-200 rounded-2xl p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)] ${sidebarOpen ? "z-10 mx-auto my-8 shadow-xl" : ""}`}>
              <div className="flex items-center justify-between lg:hidden">
                <span className="text-sm font-bold text-slate-800">Filtres</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <Icon icon="solar:close-linear" className="w-5 h-5" />
                </button>
              </div>

              <div>
                <div className="relative">
                  <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Statut</h4>
                <div className="flex flex-col gap-0.5">
                  {allStatuses.map((s) => (
                    <FilterCheckbox key={s} label={s} checked={selectedStatuses.has(s)} onChange={() => toggleFilter(selectedStatuses, s, setSelectedStatuses)} />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Localisation</h4>
                <div className="flex flex-col gap-0.5 max-h-36 overflow-y-auto">
                  {allLocations.map((l) => (
                    <FilterCheckbox key={l} label={l} checked={selectedLocations.has(l)} onChange={() => toggleFilter(selectedLocations, l, setSelectedLocations)} />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Compétences</h4>
                <div className="flex flex-col gap-0.5 max-h-36 overflow-y-auto">
                  {allSkills.map((s) => (
                    <FilterCheckbox key={s} label={s} checked={selectedSkills.has(s)} onChange={() => toggleFilter(selectedSkills, s, setSelectedSkills)} />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Note minimum</h4>
                <div className="flex items-center gap-3">
                  <input type="range" min={0} max={5} step={0.5} value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className="flex-1 accent-blue-600" />
                  <span className="text-xs font-bold text-blue-600 w-6 text-right">{minRating}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      icon={star <= minRating ? "solar:star-bold" : "solar:star-linear"}
                      className={`w-3.5 h-3.5 ${star <= minRating ? "text-amber-400" : "text-slate-300"}`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setSearch(""); setSelectedSkills(new Set()); setSelectedLocations(new Set()); setSelectedStatuses(new Set()); setMinRating(0); }}
                className="w-full text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 py-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Réinitialiser tous les filtres
              </button>
            </div>
          </aside>

          <div className="flex-1 space-y-4">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Icon icon="solar:users-group-two-rounded-linear" className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-base font-bold text-slate-700">Aucun candidat trouvé</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">Aucun candidat ne correspond à vos filtres. Essayez de modifier vos critères de recherche.</p>
              </div>
            ) : (
              filtered.map((candidate) => (
                <div key={candidate.id} className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-300 flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm shrink-0 select-none shadow-sm">
                      {candidate.avatar}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{candidate.name}</h3>
                          <p className="text-xs font-semibold text-slate-500">{candidate.title}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[candidate.status] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>
                            {candidate.status}
                          </span>
                          <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm select-none whitespace-nowrap">
                            <Icon icon="solar:stars-linear" className="w-3 h-3" />
                            {candidate.match}%
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Icon icon="solar:map-point-linear" className="w-3 h-3" />
                          {candidate.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon icon="solar:clock-circle-linear" className="w-3 h-3" />
                          {candidate.experience}
                        </span>
                        <span className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Icon
                              key={star}
                              icon={star <= Math.round(candidate.rating) ? "solar:star-bold" : "solar:star-linear"}
                              className={`w-3 h-3 ${star <= Math.round(candidate.rating) ? "text-amber-400" : "text-slate-300"}`}
                            />
                          ))}
                          <span className="text-slate-400 ml-0.5">{candidate.rating}</span>
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {candidate.skills.map((skill) => (
                          <span key={skill} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0 sm:justify-center">
                    <Link
                      href={`/candidats/${candidate.id}`}
                      className="text-[11px] font-bold text-white bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm"
                    >
                      Voir le profil →
                    </Link>
                    <button className="text-[11px] font-bold text-blue-600 border border-blue-200 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap">
                      <Icon icon="solar:chat-round-dots-linear" className="w-3.5 h-3.5 inline-block mr-1" />
                      Contacter
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

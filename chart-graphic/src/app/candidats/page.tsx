"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import candidatesData from "@/data/candidates.json";
import LandingNavbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import SearchInput from "@/components/charts/atoms/SearchInput";
import { Button } from "@/components/charts/atoms/Button";

const allSkills = [...new Set(candidatesData.candidates.flatMap((c) => c.skills))].sort();
const allLocations = [...new Set(candidatesData.candidates.map((c) => c.location))].sort();
const allStatuses = [...new Set(candidatesData.candidates.map((c) => c.status))].sort();

const statusColors: Record<string, string> = {
  "Disponible": "bg-emerald-50 text-emerald-700 border-emerald-100/50",
  "En poste": "bg-amber-50 text-amber-700 border-amber-100/50",
};

const avatarColors = [
  "from-blue-500 to-indigo-500",
  "from-purple-500 to-indigo-500",
  "from-teal-500 to-emerald-500",
  "from-indigo-500 to-sky-500",
  "from-sky-500 to-cyan-500",
];

export default function CandidatsPage() {
  const [search, setSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());
  const [minRating, setMinRating] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  // Lock scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const FilterCheckbox = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
    <label className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer text-xs font-bold text-slate-650 transition-colors select-none">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange} 
        className="accent-blue-600 w-4 h-4 rounded border-slate-300" 
      />
      {label}
    </label>
  );

  const filterContent = (isMobile = false) => (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Icon icon="solar:filter-bold-duotone" className="text-blue-600 text-lg" />
          Filtres de recherche
        </span>
        {isMobile && (
          <button 
            onClick={() => setDrawerOpen(false)} 
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-450 hover:text-slate-700 transition"
          >
            <Icon icon="solar:close-linear" className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recherche directe</h4>
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nom, poste, mot-clé..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-400 transition"
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Disponibilité</h4>
        <div className="flex flex-col gap-0.5">
          {allStatuses.map((s) => (
            <FilterCheckbox 
              key={s} 
              label={s} 
              checked={selectedStatuses.has(s)} 
              onChange={() => toggleFilter(selectedStatuses, s, setSelectedStatuses)} 
            />
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ville</h4>
        <div className="flex flex-col gap-0.5 max-h-40 overflow-y-auto border border-slate-150 rounded-xl p-2 bg-slate-50/50">
          {allLocations.map((l) => (
            <FilterCheckbox 
              key={l} 
              label={l} 
              checked={selectedLocations.has(l)} 
              onChange={() => toggleFilter(selectedLocations, l, setSelectedLocations)} 
            />
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compétences</h4>
        <div className="flex flex-col gap-0.5 max-h-40 overflow-y-auto border border-slate-150 rounded-xl p-2 bg-slate-50/50">
          {allSkills.map((s) => (
            <FilterCheckbox 
              key={s} 
              label={s} 
              checked={selectedSkills.has(s)} 
              onChange={() => toggleFilter(selectedSkills, s, setSelectedSkills)} 
            />
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Évaluation minimale</h4>
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min={0} 
            max={5} 
            step={0.5} 
            value={minRating} 
            onChange={(e) => setMinRating(Number(e.target.value))} 
            className="flex-1 accent-blue-600 cursor-pointer h-1 bg-slate-200 rounded-lg appearance-none" 
          />
          <span className="text-xs font-black text-blue-600 w-8 text-right bg-blue-50 border border-blue-100 rounded-lg px-2 py-0.5">{minRating}</span>
        </div>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Icon
              key={star}
              icon={star <= minRating ? "solar:star-bold" : "solar:star-linear"}
              className={`w-4 h-4 ${star <= minRating ? "text-amber-400 animate-pulse" : "text-slate-300"}`}
            />
          ))}
        </div>
      </div>

      {/* Clean button */}
      <Button
        variant="ghost"
        onClick={() => { 
          setSearch(""); 
          setSelectedSkills(new Set()); 
          setSelectedLocations(new Set()); 
          setSelectedStatuses(new Set()); 
          setMinRating(0); 
        }}
        className="w-full text-xs font-bold text-slate-550 border border-slate-250 py-2.5 rounded-xl hover:bg-slate-50 transition"
      >
        Réinitialiser les filtres
      </Button>

      {isMobile && (
        <Button
          variant="primary"
          onClick={() => setDrawerOpen(false)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-blue-500/10 mt-4"
        >
          Appliquer les filtres
        </Button>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#fafbfc] font-sans">
      <LandingNavbar />
      
      <div className="max-w-6xl mx-auto px-6 pt-36 pb-20">
        
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200/50">
          <div className="space-y-1">
            <span className="inline-block bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Talents IT
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Candidats Tech</h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-400">{filtered.length} profils d'exception disponibles au Maroc</p>
          </div>

          <Button
            onClick={() => setDrawerOpen(true)}
            variant="outline"
            className="lg:hidden flex items-center justify-center gap-2 text-xs font-bold text-blue-600 border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 px-4 py-2.5 rounded-xl shadow-sm transition h-11"
            startIcon="solar:filter-linear"
          >
            Filtres
          </Button>
        </div>

        {/* Layout wrapper */}
        <div className="flex gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-24 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm max-h-[calc(100vh-8rem)] overflow-y-auto">
            {filterContent(false)}
          </aside>

          {/* Mobile Bottom-sheet Drawer */}
          <AnimatePresence>
            {drawerOpen && (
              <>
                {/* Backdrop overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setDrawerOpen(false)}
                  className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm lg:hidden"
                />

                {/* Bottom sheet */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 220 }}
                  className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] bg-white border-t border-slate-200 rounded-t-3xl shadow-2xl p-6 overflow-y-auto lg:hidden flex flex-col"
                >
                  <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 shrink-0" />
                  {filterContent(true)}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Candidates list content */}
          <div className="flex-1 space-y-5">
            {filtered.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center bg-white border border-slate-200/60 rounded-3xl p-8"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl border border-slate-100 flex items-center justify-center mb-4 text-blue-500">
                  <Icon icon="solar:users-group-two-rounded-linear" className="w-8 h-8" />
                </div>
                <h3 className="text-base font-extrabold text-slate-800">Aucun candidat trouvé</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1 max-w-sm">Aucun candidat ne correspond à vos filtres. Modifiez vos critères pour relancer la recherche.</p>
              </motion.div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.08 } }
                }}
                className="space-y-4"
              >
                {filtered.map((candidate, idx) => {
                  const avatarColor = avatarColors[idx % avatarColors.length];
                  return (
                    <Link href={`/candidats/${candidate.id}`} key={candidate.id} className="block">
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
                        }}
                        whileHover={{ y: -4 }}
                        className="group bg-white border border-slate-200/60 rounded-2xl p-5 hover:shadow-lg hover:border-blue-200/80 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-stretch cursor-pointer h-full"
                      >
                        {/* Left: Avatar & details */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${avatarColor} flex items-center justify-center text-white font-black text-sm shrink-0 select-none shadow-sm`}>
                            {candidate.avatar}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                              <div>
                                <h3 className="text-base font-bold text-slate-850 group-hover:text-blue-600 transition-colors duration-200">{candidate.name}</h3>
                                <p className="text-xs font-semibold text-slate-400 mt-0.5">{candidate.title}</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-[10px] font-extrabold px-3 py-0.5 rounded-full border ${statusColors[candidate.status] ?? "bg-slate-50 text-slate-600 border-slate-200/50"}`}>
                                  {candidate.status}
                                </span>
                              </div>
                            </div>
                            
                            {/* Sub metrics */}
                            <div className="flex flex-wrap items-center gap-3.5 text-[11px] text-slate-400 font-semibold">
                              <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                <Icon icon="solar:map-point-linear" className="w-3.5 h-3.5 text-slate-400" />
                                {candidate.location}
                              </span>
                              <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                <Icon icon="solar:clock-circle-linear" className="w-3.5 h-3.5 text-slate-400" />
                                {candidate.experience}
                              </span>
                              <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                <span className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Icon
                                      key={star}
                                      icon={star <= Math.round(candidate.rating) ? "solar:star-bold" : "solar:star-linear"}
                                      className={`w-3 h-3 ${star <= Math.round(candidate.rating) ? "text-amber-400" : "text-slate-300"}`}
                                    />
                                  ))}
                                </span>
                                <span className="text-slate-500 ml-0.5">{candidate.rating}</span>
                              </span>
                            </div>

                            {/* Skills list */}
                            <div className="flex flex-wrap gap-1.5 pt-1.5">
                              {candidate.skills.map((skill) => (
                                <span 
                                  key={skill} 
                                  className="text-[9px] font-black px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100/50"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2.5 shrink-0 justify-end sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-4">
                          <Button
                            variant="primary"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-5 rounded-xl shadow-md shadow-blue-500/5 whitespace-nowrap text-xs w-full"
                          >
                            Voir le profil
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="border-slate-200 hover:bg-slate-50 text-slate-700 font-bold h-10 px-4 rounded-xl whitespace-nowrap text-xs w-full"
                            startIcon="solar:chat-round-dots-linear"
                          >
                            Contacter
                          </Button>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}

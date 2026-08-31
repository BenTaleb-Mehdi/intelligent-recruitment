"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import offersData from "@/data/offers.json";
import LandingNavbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import SearchInput from "@/components/charts/atoms/SearchInput";
import { Button } from "@/components/charts/atoms/Button";

const allTechs = [...new Set(offersData.offers.flatMap((o) => o.tech))].sort();
const allLocations = [...new Set(offersData.offers.map((o) => o.location))].sort();
const allContracts = [...new Set(offersData.offers.map((o) => o.contract))].sort();

const techColors: Record<string, string> = {
  "Next.js": "bg-blue-50 text-blue-700 border-blue-100/50",
  "Node.js": "bg-emerald-50 text-emerald-700 border-emerald-100/50",
  "PostgreSQL": "bg-sky-50 text-sky-700 border-sky-100/50",
  "AWS": "bg-amber-50 text-amber-700 border-amber-100/50",
  "Docker": "bg-blue-50 text-blue-700 border-blue-100/50",
  "Terraform": "bg-indigo-50 text-indigo-700 border-indigo-100/50",
  "Python": "bg-indigo-50 text-indigo-700 border-indigo-100/50",
  "Spark": "bg-orange-50 text-orange-700 border-orange-100/50",
  "dbt": "bg-rose-50 text-rose-700 border-rose-100/50",
  "React": "bg-cyan-50 text-cyan-700 border-cyan-100/50",
  "TypeScript": "bg-blue-50 text-blue-700 border-blue-100/50",
  "Tailwind CSS": "bg-teal-50 text-teal-700 border-teal-100/50",
};

export default function OffresPage() {
  const [search, setSearch] = useState("");
  const [selectedTechs, setSelectedTechs] = useState<Set<string>>(new Set());
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(new Set());
  const [selectedContracts, setSelectedContracts] = useState<Set<string>>(new Set());
  const [salaryMin, setSalaryMin] = useState(0);
  const [salaryMax, setSalaryMax] = useState(50000);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleFilter = (set: Set<string>, val: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    setter(next);
  };

  const filtered = useMemo(() => {
    return offersData.offers.filter((o) => {
      if (search && !o.title.toLowerCase().includes(search.toLowerCase()) && !o.company.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedTechs.size > 0 && !o.tech.some((t) => selectedTechs.has(t))) return false;
      if (selectedLocations.size > 0 && !selectedLocations.has(o.location)) return false;
      if (selectedContracts.size > 0 && !selectedContracts.has(o.contract)) return false;
      if (o.salaryRange && (o.salaryRange.max < salaryMin || o.salaryRange.min > salaryMax)) return false;
      return true;
    });
  }, [search, selectedTechs, selectedLocations, selectedContracts, salaryMin, salaryMax]);

  // Lock scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const FilterCheckbox = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
    <label className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer text-xs font-bold text-slate-655 transition-colors select-none">
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
          placeholder="Titre, entreprise..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-400 transition"
        />
      </div>

      {/* Contract */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contrat</h4>
        <div className="flex flex-col gap-0.5">
          {allContracts.map((c) => (
            <FilterCheckbox 
              key={c} 
              label={c} 
              checked={selectedContracts.has(c)} 
              onChange={() => toggleFilter(selectedContracts, c, setSelectedContracts)} 
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

      {/* Techs */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technologies</h4>
        <div className="flex flex-col gap-0.5 max-h-40 overflow-y-auto border border-slate-150 rounded-xl p-2 bg-slate-50/50">
          {allTechs.map((t) => (
            <FilterCheckbox 
              key={t} 
              label={t} 
              checked={selectedTechs.has(t)} 
              onChange={() => toggleFilter(selectedTechs, t, setSelectedTechs)} 
            />
          ))}
        </div>
      </div>

      {/* Salary range */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Salaire mensuel (DH)</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
              <span>Minimum</span>
              <span className="text-blue-600 font-extrabold">{salaryMin.toLocaleString()} DH</span>
            </div>
            <input 
              type="range" 
              min={0} 
              max={50000} 
              step={2000} 
              value={salaryMin} 
              onChange={(e) => setSalaryMin(Number(e.target.value))} 
              className="w-full accent-blue-600 cursor-pointer h-1 bg-slate-200 rounded-lg appearance-none" 
            />
          </div>
          <div>
            <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
              <span>Maximum</span>
              <span className="text-blue-600 font-extrabold">{salaryMax.toLocaleString()} DH</span>
            </div>
            <input 
              type="range" 
              min={0} 
              max={50000} 
              step={2000} 
              value={salaryMax} 
              onChange={(e) => setSalaryMax(Number(e.target.value))} 
              className="w-full accent-blue-600 cursor-pointer h-1 bg-slate-200 rounded-lg appearance-none" 
            />
          </div>
        </div>
        <button
          onClick={() => { setSalaryMin(0); setSalaryMax(50000); }}
          className="text-[10px] font-bold text-blue-600 hover:text-blue-700 mt-1 block"
        >
          Réinitialiser le salaire
        </button>
      </div>

      {/* Reset all filters */}
      <Button
        variant="ghost"
        onClick={() => { 
          setSearch(""); 
          setSelectedTechs(new Set()); 
          setSelectedLocations(new Set()); 
          setSelectedContracts(new Set()); 
          setSalaryMin(0); 
          setSalaryMax(50000); 
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
              Marché IT
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Offres d'emploi Tech</h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-400">{filtered.length} opportunités de recrutement actives au Maroc</p>
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

          {/* Offers list grid */}
          <div className="flex-1 space-y-4">
            {filtered.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center bg-white border border-slate-200/60 rounded-3xl p-8"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl border border-slate-100 flex items-center justify-center mb-4 text-blue-500">
                  <Icon icon="solar:case-linear" className="w-8 h-8" />
                </div>
                <h3 className="text-base font-extrabold text-slate-800">Aucune offre trouvée</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1 max-w-sm">Aucune opportunité ne correspond à vos filtres. Modifiez vos critères pour relancer la recherche.</p>
              </motion.div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.08 } }
                }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filtered.map((job) => (
                  <Link href={`/offres/${job.id}`} key={job.id} className="block">
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
                      }}
                      whileHover={{ y: -5 }}
                      className="group bg-white border border-slate-200/60 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200/80 transition-all duration-300 flex flex-col justify-between gap-5 relative overflow-hidden cursor-pointer h-full"
                    >
                      {/* Company Initial */}
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-600 font-black text-lg select-none shadow-sm group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-colors duration-300">
                        {job.company.charAt(0)}
                      </div>

                      {/* Job Details */}
                      <div className="space-y-2 flex-1">
                        <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors duration-205">
                          {job.title}
                        </h3>
                        <p className="text-xs font-semibold text-slate-400">{job.company}</p>

                        <div className="flex flex-wrap items-center gap-2.5 pt-1.5 text-[11px] text-slate-400 font-semibold">
                          <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                            <Icon icon="solar:map-point-linear" className="w-3.5 h-3.5 text-slate-400" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                            <Icon icon="solar:case-linear" className="w-3.5 h-3.5 text-slate-400" />
                            {job.contract}
                          </span>
                          <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                            <Icon icon="solar:monitor-linear" className="w-3.5 h-3.5 text-slate-400" />
                            {job.remote}
                          </span>
                        </div>
                      </div>

                      {/* Tech Badges */}
                      <div className="flex flex-wrap gap-1.5">
                        {job.tech.map((t) => (
                          <span
                            key={t}
                            className={`text-[9px] font-black px-2.5 py-0.5 rounded-lg border ${
                              techColors[t] ?? "bg-slate-55 text-slate-600 border-slate-200/50"
                            }`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Card Footer pricing & link */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                        <span className="text-sm font-extrabold text-slate-800">{job.salary}</span>
                        <span className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group/btn transition-colors duration-200">
                          Postuler
                          <span className="transform group-hover/btn:translate-x-0.5 transition-transform duration-200">→</span>
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import offersData from "@/data/offers.json";
import LandingNavbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";

const allTechs = [...new Set(offersData.offers.flatMap((o) => o.tech))].sort();
const allLocations = [...new Set(offersData.offers.map((o) => o.location))].sort();
const allContracts = [...new Set(offersData.offers.map((o) => o.contract))].sort();

const techColors: Record<string, string> = {
  "Next.js": "bg-blue-50 text-blue-700",
  "Node.js": "bg-emerald-50 text-emerald-700",
  "PostgreSQL": "bg-sky-50 text-sky-700",
  "AWS": "bg-amber-50 text-amber-700",
  "Docker": "bg-blue-50 text-blue-700",
  "Terraform": "bg-indigo-50 text-indigo-700",
  "Python": "bg-indigo-50 text-indigo-700",
  "Spark": "bg-orange-50 text-orange-700",
  "dbt": "bg-rose-50 text-rose-700",
  "React": "bg-cyan-50 text-cyan-700",
  "TypeScript": "bg-blue-50 text-blue-700",
  "Tailwind CSS": "bg-teal-50 text-teal-700",
  "Express": "bg-slate-50 text-slate-700",
  "MongoDB": "bg-green-50 text-green-700",
  "Redis": "bg-red-50 text-red-700",
  "Flutter": "bg-sky-50 text-sky-700",
  "Dart": "bg-blue-50 text-blue-700",
  "Firebase": "bg-amber-50 text-amber-700",
  "Figma": "bg-pink-50 text-pink-700",
  "Kubernetes": "bg-blue-50 text-blue-700",
  "Helm": "bg-indigo-50 text-indigo-700",
  "TensorFlow": "bg-orange-50 text-orange-700",
  "NLP": "bg-violet-50 text-violet-700",
  "PyTorch": "bg-red-50 text-red-700",
  "SIEM": "bg-slate-50 text-slate-700",
  "Angular": "bg-red-50 text-red-700",
  "RxJS": "bg-pink-50 text-pink-700",
  "NgRx": "bg-purple-50 text-purple-700",
  "SCSS": "bg-rose-50 text-rose-700",
  "PHP": "bg-indigo-50 text-indigo-700",
  "Laravel": "bg-red-50 text-red-700",
  "Vue.js": "bg-emerald-50 text-emerald-700",
  "MySQL": "bg-sky-50 text-sky-700",
  "Selenium": "bg-lime-50 text-lime-700",
  "Cypress": "bg-teal-50 text-teal-700",
  "JavaScript": "bg-amber-50 text-amber-700",
  "React Native": "bg-cyan-50 text-cyan-700",
  "GraphQL": "bg-pink-50 text-pink-700",
  "Product Strategy": "bg-violet-50 text-violet-700",
  "Data Analysis": "bg-blue-50 text-blue-700",
  "Agile": "bg-emerald-50 text-emerald-700",
  "MLflow": "bg-orange-50 text-orange-700",
  "Storybook": "bg-pink-50 text-pink-700",
  "CloudFormation": "bg-amber-50 text-amber-700",
  "Networking": "bg-slate-50 text-slate-700",
  "Penetration Testing": "bg-red-50 text-red-700",
  "SQL": "bg-sky-50 text-sky-700",
  "Power BI": "bg-amber-50 text-amber-700",
};

export default function OffresPage() {
  const [search, setSearch] = useState("");
  const [selectedTechs, setSelectedTechs] = useState<Set<string>>(new Set());
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(new Set());
  const [selectedContracts, setSelectedContracts] = useState<Set<string>>(new Set());
  const [salaryMin, setSalaryMin] = useState(0);
  const [salaryMax, setSalaryMax] = useState(50000);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <h1 className="text-2xl font-extrabold text-slate-900">Offres d'emploi Tech</h1>
            <p className="text-sm text-slate-500 mt-1">{filtered.length} offres trouvées au Maroc</p>
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
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Type de contrat</h4>
                <div className="flex flex-col gap-0.5">
                  {allContracts.map((c) => (
                    <FilterCheckbox key={c} label={c} checked={selectedContracts.has(c)} onChange={() => toggleFilter(selectedContracts, c, setSelectedContracts)} />
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
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Technologies</h4>
                <div className="flex flex-col gap-0.5 max-h-36 overflow-y-auto">
                  {allTechs.map((t) => (
                    <FilterCheckbox key={t} label={t} checked={selectedTechs.has(t)} onChange={() => toggleFilter(selectedTechs, t, setSelectedTechs)} />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Salaire mensuel</h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium">Min: {salaryMin.toLocaleString()} DH</label>
                    <input type="range" min={0} max={50000} step={2000} value={salaryMin} onChange={(e) => setSalaryMin(Number(e.target.value))} className="w-full accent-blue-600" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium">Max: {salaryMax.toLocaleString()} DH</label>
                    <input type="range" min={0} max={50000} step={2000} value={salaryMax} onChange={(e) => setSalaryMax(Number(e.target.value))} className="w-full accent-blue-600" />
                  </div>
                </div>
                <button
                  onClick={() => { setSalaryMin(0); setSalaryMax(50000); }}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Réinitialiser
                </button>
              </div>

              <button
                onClick={() => { setSearch(""); setSelectedTechs(new Set()); setSelectedLocations(new Set()); setSelectedContracts(new Set()); setSalaryMin(0); setSalaryMax(50000); }}
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
                  <Icon icon="solar:inbox-line-linear" className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-base font-bold text-slate-700">Aucune offre trouvée</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">Aucune offre ne correspond à vos filtres. Essayez de modifier vos critères de recherche.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((job) => (
                  <div
                    key={job.id}
                    className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 p-6 flex flex-col gap-4 relative overflow-hidden cursor-pointer"
                  >
                    <span className="absolute top-4 right-4 inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm select-none">
                      <Icon icon="solar:stars-linear" className="w-3 h-3" />
                      {job.match}% match IA
                    </span>

                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 font-extrabold text-base select-none border border-blue-100">
                      {job.company.charAt(0)}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                        <Link href={`/offres/${job.id}`}>{job.title}</Link>
                      </h3>
                      <p className="text-xs font-semibold text-slate-500">{job.company}</p>

                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Icon icon="solar:map-point-linear" className="w-3 h-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon icon="solar:case-linear" className="w-3 h-3" />
                          {job.contract}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon icon="solar:monitor-linear" className="w-3 h-3" />
                          {job.remote}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {job.tech.map((t) => (
                        <span
                          key={t}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${techColors[t] ?? "bg-slate-100 text-slate-600"}`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="text-sm font-extrabold text-slate-800">{job.salary}</span>
                      <Link
                        href={`/offres/${job.id}`}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                      >
                        Postuler →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

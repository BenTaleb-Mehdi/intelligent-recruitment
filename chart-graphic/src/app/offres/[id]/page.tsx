"use client";

import React, { use } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import offersData from "@/data/offers.json";
import LandingNavbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import { Button } from "@/components/charts/atoms/Button";

interface JobDetailsProps {
  params: Promise<{ id: string }>;
}

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

export default function JobDetailsPage({ params }: JobDetailsProps) {
  const { id } = use(params);

  const job = offersData.offers.find((o) => o.id === id);

  // If job doesn't exist, display a beautiful 404
  if (!job) {
    return (
      <main className="min-h-screen bg-[#fafbfc] font-sans flex flex-col justify-between">
        <LandingNavbar />
        <section className="flex-1 flex flex-col items-center justify-center px-6 pt-36 pb-20 text-center max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="space-y-6"
          >
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center bg-rose-50 border border-rose-100 rounded-3xl text-rose-500 shadow-md">
              <span className="absolute inset-0 rounded-3xl bg-rose-400/10 animate-pulse" />
              <Icon icon="solar:danger-bold-duotone" className="w-10 h-10 relative z-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">404</h1>
              <p className="text-base font-black text-slate-700">This page could not be found.</p>
              <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto leading-relaxed">
                L'opportunité d'emploi tech demandée est introuvable ou a été clôturée par l'entreprise recruteuse.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/offres">
                <Button variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-8 rounded-xl">
                  Retour aux offres
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafbfc] font-sans flex flex-col justify-between">
      <LandingNavbar />

      <section className="flex-1 max-w-5xl mx-auto px-6 pt-36 pb-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column: Job Summary Card */}
          <div className="lg:col-span-4 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-600 font-black text-2xl select-none shadow-sm">
                {job.company.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 leading-tight">{job.title}</h2>
                <p className="text-xs font-semibold text-slate-450 mt-1">{job.company}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-400">Ville</span>
                <span className="font-black text-slate-700">{job.location}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-400">Contrat</span>
                <span className="font-black text-slate-700">{job.contract}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-400">Télétravail</span>
                <span className="font-black text-slate-700">{job.remote}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-400">Salaire</span>
                <span className="font-black text-blue-600">{job.salary}</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <Button variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 w-full rounded-xl">
                Postuler à l'offre
              </Button>
              <Button variant="outline" className="border-slate-200 hover:bg-slate-50 text-slate-700 font-bold h-11 w-full rounded-xl">
                Sauvegarder l'offre
              </Button>
            </div>
          </div>

          {/* Right Column: Job description & Tech Stack */}
          <div className="lg:col-span-8 space-y-6">
            {/* Description block */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Description du poste</h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed">
                {job.description}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed mt-4">
                Dans le cadre de notre développement continu, nous recrutons des collaborateurs engagés et autonomes prêts à relever des défis technologiques complexes. Vous rejoindrez une équipe agile et collaborative pour concevoir de nouvelles fonctionnalités à fort impact pour nos clients.
              </p>
            </div>

            {/* Required Technologies block */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Technologies requises</h3>
              <div className="flex flex-wrap gap-2">
                {job.tech.map((t) => (
                  <span
                    key={t}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
                      techColors[t] ?? "bg-slate-55 text-slate-600 border-slate-200/50"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Simulated IA Matching Criteria list */}
            <div className="bg-slate-900 border border-slate-850 rounded-3xl p-6 sm:p-8 shadow-sm text-white space-y-4 relative overflow-hidden">
              <span className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl" />
              <div className="flex items-center gap-2">
                <Icon icon="solar:stars-bold-duotone" className="text-blue-400 w-5 h-5 animate-pulse" />
                <h3 className="text-sm font-black uppercase tracking-wider text-blue-400">Critères de matching IA</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-400">Compétences clés recherchées</h4>
                  <p className="text-[11px] font-semibold text-slate-300 leading-relaxed">
                    Maîtrise approfondie des architectures backend/frontend, de la gestion de base de données performante et de l'intégration continue.
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-400">Facteurs d'employabilité</h4>
                  <p className="text-[11px] font-semibold text-slate-300 leading-relaxed">
                    Adéquation forte pour les profils ayant une expérience de travail collaboratif en méthodologies Agile/Scrum.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}

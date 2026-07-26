"use client";

import React, { use } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import candidatesData from "@/data/candidates.json";
import LandingNavbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import { Button } from "@/components/charts/atoms/Button";

interface CandidateDetailsProps {
  params: Promise<{ id: string }>;
}

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

export default function CandidateDetailsPage({ params }: CandidateDetailsProps) {
  const { id } = use(params);

  const candidate = candidatesData.candidates.find((c) => c.id === id);

  // If candidate doesn't exist, display a beautiful 404
  if (!candidate) {
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
                Le profil de candidat demandé est introuvable ou n'est plus actif sur notre plateforme.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/candidats">
                <Button variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-8 rounded-xl">
                  Retour aux candidats
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
        <Footer />
      </main>
    );
  }

  const avatarColor = avatarColors[Number(candidate.id) % avatarColors.length];

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
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-4 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${avatarColor} flex items-center justify-center text-white font-black text-2xl select-none shadow-md`}>
                {candidate.avatar}
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 leading-tight">{candidate.name}</h2>
                <p className="text-xs font-semibold text-slate-400 mt-1">{candidate.title}</p>
              </div>
              <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${statusColors[candidate.status] ?? "bg-slate-50 text-slate-600 border-slate-200/50"}`}>
                {candidate.status}
              </span>
            </div>

            <div className="border-t border-slate-100 pt-5 space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-400">Ville</span>
                <span className="font-black text-slate-700">{candidate.location}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-400">Expérience</span>
                <span className="font-black text-slate-700">{candidate.experience}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-400">Évaluation</span>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icon
                        key={star}
                        icon={star <= Math.round(candidate.rating) ? "solar:star-bold" : "solar:star-linear"}
                        className={`w-3.5 h-3.5 ${star <= Math.round(candidate.rating) ? "text-amber-400" : "text-slate-200"}`}
                      />
                    ))}
                  </div>
                  <span className="font-black text-slate-700">{candidate.rating}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 space-y-3">
              <div className="flex gap-3 items-center text-xs font-semibold text-slate-500">
                <Icon icon="solar:letter-bold-duotone" className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="truncate">{candidate.email}</span>
              </div>
              <div className="flex gap-3 items-center text-xs font-semibold text-slate-500">
                <Icon icon="solar:phone-bold-duotone" className="w-5 h-5 text-blue-600 shrink-0" />
                <span>{candidate.phone}</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <Button variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 w-full rounded-xl">
                Contacter le candidat
              </Button>
              <Button variant="outline" className="border-slate-200 hover:bg-slate-50 text-slate-700 font-bold h-11 w-full rounded-xl">
                Télécharger le CV
              </Button>
            </div>
          </div>

          {/* Right Column: Professional details */}
          <div className="lg:col-span-8 space-y-6">
            {/* About / Summary block */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">À propos</h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed">
                Ingénieur talentueux spécialisé dans les technologies web modernes. Passionné par la résolution de problèmes complexes et le développement d'architectures robustes, scalables et centrées sur l'expérience utilisateur. Disponible immédiatement pour rejoindre une équipe de développement dynamique au Maroc ou en télétravail.
              </p>
            </div>

            {/* Skills & Technologies block */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Compétences techniques</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Strengths assessment simulator block */}
            <div className="bg-slate-900 border border-slate-850 rounded-3xl p-6 sm:p-8 shadow-sm text-white space-y-4 relative overflow-hidden">
              <span className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl" />
              <div className="flex items-center gap-2">
                <Icon icon="solar:stars-bold-duotone" className="text-blue-400 w-5 h-5 animate-pulse" />
                <h3 className="text-sm font-black uppercase tracking-wider text-blue-400">Analyse de profil IA</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-400">Forces principales</h4>
                  <p className="text-[11px] font-semibold text-slate-300 leading-relaxed">
                    Excellente maîtrise des frameworks frontend/backend, forte adaptabilité technique, et rigueur dans l'assurance qualité.
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-400">Recommandation</h4>
                  <p className="text-[11px] font-semibold text-slate-300 leading-relaxed">
                    Idéal pour des postes de développement de produit SaaS exigeant de la flexibilité et des compétences Fullstack autonomes.
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

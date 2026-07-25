"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Button } from "@/components/charts/atoms/Button";

const candidates = [
  { 
    name: "Nadia Berrada", 
    title: "Angular Developer Senior", 
    location: "Casablanca", 
    experience: "7 ans d'exp", 
    rating: 4.9, 
    match: 97, 
    skills: ["Angular", "RxJS", "TypeScript"], 
    avatar: "NB",
    avatarBg: "from-blue-500 to-indigo-500"
  },
  { 
    name: "Sara El Moudden", 
    title: "Backend Engineer", 
    location: "Rabat", 
    experience: "6 ans d'exp", 
    rating: 4.8, 
    match: 96, 
    skills: ["Python", "Django", "PostgreSQL"], 
    avatar: "SE",
    avatarBg: "from-purple-500 to-indigo-500"
  },
  { 
    name: "Karim El Fassi", 
    title: "ML Engineer", 
    location: "Casablanca", 
    experience: "5 ans d'exp", 
    rating: 4.8, 
    match: 97, 
    skills: ["Python", "PyTorch", "MLflow"], 
    avatar: "KF",
    avatarBg: "from-teal-500 to-emerald-500"
  },
];

export default function BestCandidates() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15,
      },
    },
  };

  return (
    <section id="candidats" className="py-28 bg-[#f8fafc]/40 relative overflow-hidden border-b border-slate-100">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full bg-indigo-50/40 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 rounded-full bg-blue-50/40 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="inline-block bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider select-none shadow-sm">
            Talents disponibles · Maroc IT
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Les meilleurs profils du moment
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto font-medium">
            Découvrez les talents les mieux notés par notre IA, prêts à relever
            de nouveaux défis tech au Maroc.
          </p>
        </div>

        {/* Candidates Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {candidates.map((c, i) => (
            <Link href="/candidats" key={i} className="block">
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className="group bg-white rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-xl hover:border-blue-200/80 transition-all duration-300 p-6 flex flex-col gap-5 relative overflow-hidden cursor-pointer h-full"
              >
                {/* Profile Card Header */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${c.avatarBg} flex items-center justify-center text-white font-extrabold text-sm select-none shrink-0 shadow-md`}>
                    {c.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors duration-200">
                      {c.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 truncate">{c.title}</p>
                  </div>
                </div>

                {/* Details (Location, Experience, Stars) */}
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold flex-wrap">
                  <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                    <Icon icon="solar:map-point-linear" className="w-3.5 h-3.5 text-slate-400" />
                    {c.location}
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                    <Icon icon="solar:clock-circle-linear" className="w-3.5 h-3.5 text-slate-400" />
                    {c.experience}
                  </span>
                  <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                    <span className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Icon
                          key={star}
                          icon={star <= Math.round(c.rating) ? "solar:star-bold" : "solar:star-linear"}
                          className={`w-3 h-3 ${star <= Math.round(c.rating) ? "text-amber-400" : "text-slate-355"}`}
                        />
                      ))}
                    </span>
                    <span className="text-slate-500 font-bold ml-0.5">{c.rating}</span>
                  </span>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {c.skills.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100/50"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Footer link */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                  <span className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group/btn transition-colors duration-200">
                    Voir le profil
                    <span className="transform group-hover/btn:translate-x-0.5 transition-transform duration-200">→</span>
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* View all button */}
        <div className="text-center pt-4">
          <Link href="/candidats">
            <Button
              variant="outline"
              className="border-slate-200 text-slate-700 font-bold text-sm h-12 px-6 hover:bg-slate-50 hover:border-slate-300 rounded-xl shadow-sm transition-all inline-flex items-center gap-2"
              startIcon="solar:users-group-two-rounded-linear"
            >
              Voir tous les candidats
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

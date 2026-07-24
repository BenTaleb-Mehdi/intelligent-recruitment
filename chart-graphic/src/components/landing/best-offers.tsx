"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import jobsData from "@/data/landing-jobs.json";
import { Button } from "@/components/charts/atoms/Button";

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
};

export default function BestOffers() {
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
    <section id="offres" className="py-28 bg-[#f8fafc]/60 relative overflow-hidden border-y border-slate-100">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-blue-50/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-indigo-50/40 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="inline-block bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider select-none shadow-sm">
            Offres tendance · Maroc IT
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Les meilleures offres du moment
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto font-medium">
            Sélectionnées par notre IA parmi +180 offres actives, selon les stacks
            les plus demandées au Maroc.
          </p>
        </div>

        {/* Jobs Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {jobsData.jobs.map((job, i) => (
            <Link href="/offres" key={i} className="block">
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className="group bg-white rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-xl hover:border-blue-200/80 transition-all duration-300 p-6 flex flex-col gap-5 relative overflow-hidden cursor-pointer h-full"
              >
                {/* Company Logo Char */}
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-600 font-black text-lg select-none shadow-sm group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-colors duration-300">
                  {job.company.charAt(0)}
                </div>

                {/* Title & Company info */}
                <div className="space-y-1 flex-1">
                  <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors duration-200">
                    {job.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400">{job.company}</p>

                  <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Icon icon="solar:map-point-linear" className="w-3.5 h-3.5 text-slate-400" />
                      {job.loc}
                    </span>
                  </div>
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {job.tech.map((t) => (
                    <span
                      key={t}
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${
                        techColors[t] ?? "bg-slate-55 text-slate-600 border-slate-200/50"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Footer pricing & link */}
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

        {/* View all button */}
        <div className="text-center pt-4">
          <Link href="/recruiter/jobs">
            <Button
              variant="outline"
              className="border-slate-200 text-slate-700 font-bold text-sm h-12 px-6 hover:bg-slate-50 hover:border-slate-300 rounded-xl shadow-sm transition-all inline-flex items-center gap-2"
              startIcon="solar:case-linear"
            >
              Voir toutes les offres
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

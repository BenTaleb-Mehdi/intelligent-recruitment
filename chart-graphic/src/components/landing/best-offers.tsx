"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import jobsData from "@/data/landing-jobs.json";

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
};

export default function BestOffers() {
  return (
    <section id="offres" className="py-24 bg-slate-50/50">
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <span className="inline-block bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider select-none">
            Offres tendance · Maroc IT
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Les meilleures offres du moment
          </h2>
          <p className="text-slate-500 text-base max-w-xl mx-auto font-medium">
            Sélectionnées par notre IA parmi +180 offres actives, selon les stacks
            les plus demandées au Maroc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {jobsData.jobs.map((job, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 p-6 flex flex-col gap-5 relative overflow-hidden cursor-pointer"
            >
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm select-none">
                <Icon icon="solar:stars-linear" className="w-3 h-3" />
                {job.match} match IA
              </span>

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 font-extrabold text-base select-none border border-blue-100">
                {job.company.charAt(0)}
              </div>

              <div className="space-y-1.5 flex-1">
                <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                  {job.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500">{job.company}</p>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Icon icon="solar:map-point-linear" className="w-3 h-3" />
                    {job.loc}
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
            href="/offres"
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Postuler →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/recruiter/jobs"
            className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold px-6 py-3 rounded-xl hover:border-blue-300 hover:text-blue-700 hover:shadow-sm transition-all"
          >
            <Icon icon="solar:case-linear" className="w-4 h-4" />
            Voir toutes les offres
          </Link>
        </div>
      </div>
    </section>
  );
}

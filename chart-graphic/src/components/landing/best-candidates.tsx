"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

const candidates = [
  { name: "Nadia Berrada", title: "Angular Developer Senior", location: "Casablanca", experience: "7 ans", rating: 4.9, match: 97, skills: ["Angular", "RxJS", "SCSS"], avatar: "NB" },
  { name: "Sara El Moudden", title: "Backend Engineer", location: "Rabat", experience: "6 ans", rating: 4.8, match: 96, skills: ["Python", "Django", "PostgreSQL"], avatar: "SE" },
  { name: "Karim El Fassi", title: "ML Engineer", location: "Casablanca", experience: "5 ans", rating: 4.8, match: 97, skills: ["Python", "MLflow", "PyTorch"], avatar: "KF" },
];

export default function BestCandidates() {
  return (
    <section id="candidats" className="py-24 bg-slate-50/50">
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <span className="inline-block bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider select-none">
            Talents disponibles · Maroc IT
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Les meilleurs profils du moment
          </h2>
          <p className="text-slate-500 text-base max-w-xl mx-auto font-medium">
            Découvrez les talents les mieux notés par notre IA, prêts à relever
            de nouveaux défis tech au Maroc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {candidates.map((c, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 p-6 flex flex-col gap-4 relative overflow-hidden cursor-pointer"
            >
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm select-none">
                <Icon icon="solar:stars-linear" className="w-3 h-3" />
                {c.match}% match IA
              </span>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm select-none shrink-0 shadow-sm">
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 truncate">{c.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium flex-wrap">
                <span className="flex items-center gap-1">
                  <Icon icon="solar:map-point-linear" className="w-3 h-3" />
                  {c.location}
                </span>
                <span className="flex items-center gap-1">
                  <Icon icon="solar:clock-circle-linear" className="w-3 h-3" />
                  {c.experience}
                </span>
                <span className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      icon={star <= Math.round(c.rating) ? "solar:star-bold" : "solar:star-linear"}
                      className={`w-3 h-3 ${star <= Math.round(c.rating) ? "text-amber-400" : "text-slate-300"}`}
                    />
                  ))}
                  <span className="text-slate-400 ml-0.5">{c.rating}</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {c.skills.map((s) => (
                  <span key={s} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-auto">
                <Link
                  href="/candidats"
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Voir le profil →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/candidats"
            className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold px-6 py-3 rounded-xl hover:border-blue-300 hover:text-blue-700 hover:shadow-sm transition-all"
          >
            <Icon icon="solar:users-group-two-rounded-linear" className="w-4 h-4" />
            Voir tous les candidats
          </Link>
        </div>
      </div>
    </section>
  );
}

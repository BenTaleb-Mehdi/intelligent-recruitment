"use client";

import React from "react";
import { Icon } from "@iconify/react";

const team = [
  { initials: "AB", name: "Amine Benali", role: "CEO & Co-fondateur", desc: "Ex-CTO @OCP. 12 ans dans la data et l'IA." },
  { initials: "SE", name: "Sara El Moudden", role: "CPO & Co-fondatrice", desc: "Ex-PM @Capgemini. Spécialiste produit tech." },
  { initials: "YT", name: "Youssef Tahiri", role: "CTO", desc: "Full-stack & ML. Ancien lead @Inwi." },
  { initials: "KO", name: "Kenza Ouali", role: "Head of Talent", desc: "8 ans dans le recrutement IT au Maroc." },
];

export default function AboutTeam() {
  return (
    <section className="py-20 bg-slate-50/50">
      <div className="max-w-5xl mx-auto px-6 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            L'équipe <span className="text-blue-600">Iksatech</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium">
            Des passionnés de tech et de recrutement, réunis pour transformer le
            marché IT marocain.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map((m) => (
            <div
              key={m.name}
              className="bg-white border border-slate-200/70 rounded-2xl p-6 text-center space-y-3 hover:shadow-lg hover:border-blue-200 transition-all duration-200 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto text-white font-extrabold text-lg select-none shadow-sm group-hover:scale-105 transition-transform">
                {m.initials}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">{m.name}</h3>
                <p className="text-xs font-semibold text-blue-600">{m.role}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                  <Icon icon="solar:link-linear" className="w-3 h-3 text-blue-600" />
                </div>
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                  <Icon icon="solar:letter-linear" className="w-3 h-3 text-blue-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

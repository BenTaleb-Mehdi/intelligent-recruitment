"use client";

import React from "react";
import { Icon } from "@iconify/react";

const stats = [
  { icon: "solar:users-group-two-rounded-linear", value: "+2 400", label: "Candidats actifs" },
  { icon: "solar:case-linear", value: "+200", label: "Offres pourvues" },
  { icon: "solar:buildings-linear", value: "+50", label: "Entreprises partenaires" },
  { icon: "solar:stars-linear", value: "91%", label: "Satisfaction talent" },
];

const values = [
  {
    icon: "solar:brain-linear",
    title: "Matching intelligent",
    desc: "Notre IA analyse skills, expérience et soft skills pour trouver la meilleure adéquation possible.",
  },
  {
    icon: "solar:shield-check-linear",
    title: "Transparence totale",
    desc: "Salaires visibles, processus clairs, feedback systématique. Fini le recrutement boîte noire.",
  },
  {
    icon: "solar:global-linear",
    title: "Focus Maroc",
    desc: "Nous connaissons le marché tech marocain. Casablanca, Rabat, Tanger, Marrakech — et full remote.",
  },
  {
    icon: "solar:clock-circle-linear",
    title: "Rapidité",
    desc: "Un matching en moins de 48h. Plus besoin d'attendre des semaines pour une réponse.",
  },
];

export default function AboutDetails() {
  return (
    <>
      <section className="py-20 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-slate-200/70 rounded-2xl p-6 text-center space-y-2 hover:shadow-md hover:border-blue-200 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mx-auto border border-blue-100">
                  <Icon icon={stat.icon} className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Nos <span className="text-blue-600">valeurs</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto font-medium">
              Ce qui nous guide chaque jour pour transformer le recrutement tech
              au Maroc.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="flex gap-4 bg-slate-50 border border-slate-200/70 rounded-2xl p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                  <Icon icon={v.icon} className="w-6 h-6 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900">{v.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

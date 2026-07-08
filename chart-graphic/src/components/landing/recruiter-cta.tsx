"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

const steps = [
  {
    icon: "solar:case-linear",
    title: "Publiez votre offre",
    desc: "Décrivez le poste en quelques minutes. Notre IA enrichit l'annonce automatiquement.",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    icon: "solar:magic-stick-3-linear",
    title: "L'IA pré-sélectionne",
    desc: "Notre moteur analyse les profils, score les candidats et écarte les non-pertinents.",
    color: "bg-sky-50 text-sky-600 border-sky-100",
  },
  {
    icon: "solar:document-text-linear",
    title: "Quiz technique auto",
    desc: "Un test personnalisé est envoyé aux top matchs. Vous ne lisez que les résultats.",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    icon: "solar:stars-linear",
    title: "Recrutez plus vite",
    desc: "Entretien uniquement avec les meilleurs profils. -70% de temps de recrutement.",
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
];

export default function RecruiterCTA() {
  return (
    <section id="recruteurs" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-3">
          <span className="inline-block bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider select-none">
            Pour les Recruteurs
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Recrutez 3× plus vite,{" "}
            <span className="text-blue-600">
              sans effort
            </span>
          </h2>
          <p className="text-slate-500 text-base max-w-xl mx-auto font-medium">
            Iksatech automatise tout votre pipeline de recrutement — de la publication
            à la sélection finale — grâce à l'IA.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative bg-slate-50 border border-slate-200/70 rounded-2xl p-5 space-y-3 hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
            >
              <span className="absolute -top-3 -left-1 text-[10px] font-black text-slate-300 select-none">
                0{i + 1}
              </span>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${step.color}`}>
                <Icon icon={step.icon} className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 group-hover:text-slate-900">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-10 text-center text-white space-y-6 shadow-2xl">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Offre de lancement</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Publiez votre première offre{" "}
              <span className="text-sky-300">gratuitement</span>
            </h3>
            <p className="text-blue-200 text-sm max-w-md mx-auto">
              Sans carte bancaire. Sans engagement. Commencez en 2 minutes.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/recruiter/jobs"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 text-sm font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors shadow-md"
            >
              <Icon icon="solar:case-linear" className="w-4 h-4" />
              Accéder au dashboard
            </Link>
            <a
              href="#comment"
              className="inline-flex items-center justify-center gap-2 border border-blue-300 text-blue-100 text-sm font-semibold px-6 py-3 rounded-xl hover:border-white hover:text-white transition-colors"
            >
              En savoir plus
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

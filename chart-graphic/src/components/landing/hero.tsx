"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import HeroIllustration from "@/components/landing/hero-illustration";

const trustLogos = [
  { name: "OCP", bg: "bg-blue-50 text-blue-700" },
  { name: "Inwi", bg: "bg-sky-50 text-sky-700" },
  { name: "CashPlus", bg: "bg-cyan-50 text-cyan-700" },
  { name: "Lydec", bg: "bg-indigo-50 text-indigo-700" },
  { name: "Capgemini", bg: "bg-blue-50 text-blue-700" },
];

export default function Hero() {
  const [email, setEmail] = useState("");

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white pt-24 lg:pt-20">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-50 to-sky-50 opacity-60 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-sky-50 to-blue-50 opacity-50 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-r from-blue-50 to-sky-50 opacity-40 blur-2xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full select-none shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Powered by IA · Marché Marocain IT
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Trouvez votre prochain{" "}
              <span className="text-blue-600">
                poste Tech
              </span>{" "}
              au Maroc
            </h1>
            <p className="text-base sm:text-lg text-slate-500 max-w-xl leading-relaxed font-medium">
              Notre IA analyse votre profil et vous propose des offres qui vous
              correspondent vraiment — salaire compétitif, stack moderne,
              entreprises sérieuses.
            </p>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); }}
            className="flex flex-col sm:flex-row gap-3 max-w-md lg:max-w-lg"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-medium placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md whitespace-nowrap"
            >
              Commencer →
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium">
            {[
              { icon: "solar:users-group-two-rounded-linear", label: "+2 400 candidats actifs" },
              { icon: "solar:case-linear", label: "+180 offres publiées" },
              { icon: "solar:stars-linear", label: "Score IA moyen : 91%" },
            ].map((item) => (
              <span key={item.label} className="flex items-center gap-1.5">
                <Icon icon={item.icon} className="w-3.5 h-3.5 text-blue-400" />
                {item.label}
              </span>
            ))}
          </div>

          <div className="pt-2 space-y-3">
            <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest text-center lg:text-left">
              Entreprises partenaires
            </p>
            <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start">
              {trustLogos.map((logo) => (
                <span
                  key={logo.name}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border border-transparent ${logo.bg} select-none`}
                >
                  {logo.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <HeroIllustration />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-300 animate-bounce">
        <Icon icon="solar:alt-arrow-down-linear" className="w-5 h-5" />
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { Icon } from "@iconify/react";

export default function AboutHero() {
  return (
    <section className="relative pt-28 pb-20 overflow-hidden bg-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-50 to-sky-50 opacity-60 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-sky-50 to-blue-50 opacity-50 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full select-none shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          À propos d'Iksatech
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          L'IA repense le{" "}
          <span className="text-blue-600">recrutement tech</span> au Maroc
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
          Nous construisons le pont entre les talents tech marocains et les
          entreprises qui cherchent à innover. Plus de CV perdus, plus de
          processus sans fin — juste un matching intelligent et humain.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 font-medium">
          {[
            { icon: "solar:calendar-linear", label: "Lancé en 2024" },
            { icon: "solar:users-group-two-rounded-linear", label: "+2 400 talents" },
            { icon: "solar:buildings-linear", label: "+50 entreprises" },
            { icon: "solar:map-point-linear", label: "Casablanca · Rabat · Tanger · Remote" },
          ].map((item) => (
            <span key={item.label} className="flex items-center gap-1.5">
              <Icon icon={item.icon} className="w-3.5 h-3.5 text-blue-400" />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

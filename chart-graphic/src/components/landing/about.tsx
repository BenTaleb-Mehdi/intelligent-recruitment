"use client";

import React from "react";
import { Icon } from "@iconify/react";

const stats = [
  { icon: "solar:users-group-two-rounded-linear", value: "+2 400", label: "Candidats actifs" },
  { icon: "solar:case-linear", value: "+180", label: "Offres publiées" },
  { icon: "solar:buildings-linear", value: "+50", label: "Entreprises partenaires" },
  { icon: "solar:stars-linear", value: "91%", label: "Score IA moyen" },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-block bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider select-none">
              À propos
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              L'IA au service du{" "}
              <span className="text-blue-600">recrutement Tech</span> au Maroc
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              Iksatech est une plateforme marocaine qui connecte les talents tech
              aux meilleures entreprises du pays. Notre intelligence artificielle
              analyse en profondeur les profils et les offres pour garantir un
              matching optimal — plus besoin de passer des heures à chercher.
            </p>
            <p className="text-slate-500 text-base leading-relaxed">
              Que vous soyez développeur, data scientist, DevOps ou designer,
              Iksatech vous trouve les opportunités qui correspondent vraiment à
              votre stack, votre expérience et vos aspirations.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {["AB", "SE", "YT", "KO"].map((init, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white text-[9px] font-bold"
                  >
                    {init}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-600 text-[9px] font-bold">
                  +2k
                </div>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Talents inscrits cette semaine
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-slate-50 border border-slate-200/70 rounded-2xl p-6 text-center space-y-2 hover:shadow-md hover:border-blue-200 transition-all duration-200"
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
      </div>
    </section>
  );
}

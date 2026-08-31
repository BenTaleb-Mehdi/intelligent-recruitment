"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

const links = {
  Candidats: ["Parcourir les offres", "Créer mon profil", "Comment ça marche", "FAQ"],
  Recruteurs: ["Publier une offre", "Dashboard", "Tarifs", "API Recruteur"],
  Entreprise: ["À propos", "Blog Tech", "Presse", "Contact"],
};

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 font-sans border-t border-slate-900">
      <div className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="space-y-5 md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5 select-none group">
            <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/10">
              <Icon icon="solar:stars-linear" className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-white font-extrabold text-lg tracking-tight">
              Iksa<span className="text-blue-500">tech</span>
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-slate-500 font-semibold">
            La plateforme de recrutement tech alimentée par l'IA pour le marché marocain.
          </p>
          <div className="flex items-center gap-3 pt-2">
            {[
              { icon: "mdi:linkedin", label: "LinkedIn" },
              { icon: "mdi:twitter", label: "Twitter" },
              { icon: "mdi:github", label: "GitHub" },
            ].map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 hover:bg-slate-950 transition-all duration-300 shadow-sm"
              >
                <Icon icon={s.icon} className="w-4.5 h-4.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Links Columns */}
        {Object.entries(links).map(([section, items]) => (
          <div key={section} className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              {section}
            </h4>
            <ul className="space-y-2.5">
              {items.map((item) => (
                <li key={item}>
                  <Link
                    href="/recruiter/jobs"
                    className="text-xs text-slate-500 hover:text-blue-400 transition-colors duration-200 font-semibold"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Under footer credits */}
      <div className="border-t border-slate-900/60 bg-slate-950/80">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-600 font-semibold">
          <span>© 2026 Iksatech. Tous droits réservés.</span>
          <div className="flex items-center gap-5 flex-wrap justify-center">
            <a href="#" className="hover:text-slate-400 transition-colors duration-200">Politique de confidentialité</a>
            <a href="#" className="hover:text-slate-400 transition-colors duration-200">CGU</a>
            <span className="flex items-center gap-1 select-none">
              Fait avec <Icon icon="solar:heart-linear" className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> au Maroc
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

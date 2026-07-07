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
    <footer className="bg-slate-900 text-slate-400 font-sans">
      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2.5 select-none">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Icon icon="solar:stars-linear" className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-bold text-base">
              Iksa<span className="text-blue-400">tech</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-500">
            La plateforme de recrutement tech alimentée par l'IA pour le marché marocain.
          </p>
          <div className="flex items-center gap-3 pt-1">
            {[
              { icon: "mdi:linkedin", label: "LinkedIn" },
              { icon: "mdi:twitter", label: "Twitter" },
              { icon: "mdi:github", label: "GitHub" },
            ].map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-400 transition-colors"
              >
                <Icon icon={s.icon} className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {Object.entries(links).map(([section, items]) => (
          <div key={section} className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300">
              {section}
            </h4>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item}>
                  <Link
                    href="/recruiter/jobs"
                    className="text-xs text-slate-500 hover:text-blue-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600">
          <span>© 2026 Iksatech. Tous droits réservés.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-slate-400 transition-colors">CGU</a>
            <span className="flex items-center gap-1">
              Fait avec <Icon icon="solar:heart-linear" className="w-3 h-3 text-rose-400" /> au Maroc
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function JobsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-sans">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Mes Offres d'Emploi</h2>
        <p className="text-sm text-slate-500 mt-1">Gérez et suivez le statut de vos publications de recrutement en temps réel.</p>
      </div>
      <Link 
        href="/recruiter/jobs/create"
        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3 px-5 rounded-xl shadow-sm transition-all active:scale-[0.98] select-none shrink-0"
      >
        <Icon icon="solar:plus-linear" className="w-4 h-4" />
        Créer une offre
      </Link>
    </div>
  );
}

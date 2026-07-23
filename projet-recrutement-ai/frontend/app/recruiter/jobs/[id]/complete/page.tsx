"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";

interface CompleteOffer {
  id: string;
  title: string;
  contractType: string;
  location: string;
  salary: string;
  experience: string;
  description: string;
  skills: string[];
  status: "Publiée" | "Brouillon" | "Archivée";
  date: string;
}

const OFFERS_DB: Record<string, CompleteOffer> = {
  "1": {
    id: "1",
    title: "Développeur Fullstack Node/Next.js",
    contractType: "CDI (Contrat à Durée Indéterminée)",
    location: "Casablanca, Maroc (Sur site)",
    salary: "18 000 - 25 000 DH/mois",
    experience: "+3 à 5 ans d'expérience",
    description:
      "Nous recherchons un développeur Fullstack talentueux pour rejoindre notre équipe technique. Vous serez responsable de la conception, du développement et de la maintenance d'applications web modernes en utilisant Node.js et Next.js. Vous travaillerez en étroite collaboration avec l'équipe produit pour livrer des fonctionnalités de haute qualité.",
    skills: ["Node.js", "Next.js", "React", "TypeScript", "PostgreSQL", "Docker"],
    status: "Publiée",
    date: "28 Juin 2026",
  },
  "2": {
    id: "2",
    title: "UI/UX Designer Senior",
    contractType: "CDI (Contrat à Durée Indéterminée)",
    location: "Rabat, Maroc (Hybride)",
    salary: "15 000 - 20 000 DH/mois",
    experience: "+5 ans d'expérience (Senior)",
    description:
      "Nous cherchons un UI/UX Designer Senior pour concevoir des expériences utilisateur exceptionnelles. Vous serez en charge de la recherche utilisateur, de la création de wireframes, de prototypes interactifs et de la conception d'interfaces intuitives.",
    skills: ["Figma", "Design System", "Prototyping", "User Research", "Design Thinking", "Adobe XD"],
    status: "Brouillon",
    date: "24 Juin 2026",
  },
};

export default function OfferCompletePage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const offer = OFFERS_DB[jobId];

  if (!offer) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
          <Icon icon="solar:file-remove-linear" className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-700">Offre introuvable</h2>
        <p className="text-sm text-slate-400">Aucune offre trouvée avec l&apos;identifiant #{jobId}.</p>
        <Link
          href="/recruiter/jobs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          <Icon icon="solar:alt-arrow-left-linear" className="w-4 h-4" />
          Retour aux offres
        </Link>
      </div>
    );
  }

  const statusStyles: Record<string, string> = {
    Publiée: "bg-emerald-50 text-emerald-700 border-emerald-100/80",
    Brouillon: "bg-slate-50 text-slate-600 border-slate-100/80",
    Archivée: "bg-rose-50 text-rose-700 border-rose-100/80",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/recruiter/jobs"
          className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Icon icon="solar:alt-arrow-left-linear" className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight break-words">
              {offer.title}
            </h2>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border leading-none ${
                statusStyles[offer.status]
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  offer.status === "Publiée"
                    ? "bg-emerald-500"
                    : offer.status === "Brouillon"
                    ? "bg-slate-400"
                    : "bg-rose-500"
                }`}
              />
              {offer.status}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Offre créée le {offer.date}</p>
        </div>
      </div>

      {/* Offer Details */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 sm:p-8 space-y-6">
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Icon icon="solar:document-text-linear" className="w-4 h-4 text-blue-500" />
          Détails de l&apos;offre
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type de contrat</span>
            <p className="text-sm font-semibold text-slate-800">{offer.contractType}</p>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Localisation</span>
            <p className="text-sm font-semibold text-slate-800">{offer.location}</p>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Salaire</span>
            <p className="text-sm font-semibold text-slate-800">{offer.salary}</p>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expérience requise</span>
            <p className="text-sm font-semibold text-slate-800">{offer.experience}</p>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</span>
          <p className="text-sm text-slate-600 leading-relaxed">{offer.description}</p>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compétences requises</span>
          <div className="flex flex-wrap gap-1.5">
            {offer.skills.map((skill) => (
              <span
                key={skill}
                className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2.5 py-1 rounded-md border border-blue-100/80"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
        <Link
          href={`/recruiter/jobs/${jobId}/applicants`}
          className="inline-flex items-center gap-2 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-3 px-5 rounded-xl transition-all select-none"
        >
          <Icon icon="solar:users-group-two-rounded-linear" className="w-4 h-4" />
          Voir les candidats
        </Link>
        <button
          onClick={() => router.push("/recruiter/jobs")}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3 px-5 rounded-xl shadow-sm transition-all active:scale-[0.98] select-none"
        >
          <Icon icon="solar:rocket-linear" className="w-4 h-4" />
          {offer.status === "Brouillon" ? "Publier l'offre" : "Retour aux offres"}
        </button>
      </div>
    </div>
  );
}

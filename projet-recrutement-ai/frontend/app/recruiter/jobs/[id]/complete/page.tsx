"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { api } from "@/lib/api";
import type { ApiJobOffer } from "@/lib/api";

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

const OFFERS_DB: Record<string, CompleteOffer> = {};

function parseBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold text-slate-800">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function formatDescription(text: string) {
  if (!text) return null;
  const blocks = text.split(/\n\n+/);
  return blocks.map((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("###")) {
      return (
        <h4 key={idx} className="text-sm font-bold text-slate-800 mt-4 mb-2">
          {trimmed.replace(/^###\s*/, "")}
        </h4>
      );
    }
    if (trimmed.startsWith("##")) {
      return (
        <h3 key={idx} className="text-base font-bold text-slate-900 mt-5 mb-2 border-b border-slate-100 pb-1">
          {trimmed.replace(/^##\s*/, "")}
        </h3>
      );
    }
    if (trimmed.startsWith("#")) {
      return (
        <h2 key={idx} className="text-lg font-bold text-slate-900 mt-6 mb-3">
          {trimmed.replace(/^#\s*/, "")}
        </h2>
      );
    }

    if (trimmed.includes("\n-") || trimmed.includes("\n*") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const items = trimmed
        .split(/\n[-*]\s*/)
        .map(item => item.trim())
        .filter(Boolean);

      let introText = "";
      let listItems = items;
      if (!trimmed.startsWith("- ") && !trimmed.startsWith("* ")) {
        introText = items[0];
        listItems = items.slice(1);
      }

      return (
        <div key={idx} className="space-y-1.5 my-3">
          {introText && <p className="text-sm text-slate-600">{parseBoldText(introText)}</p>}
          <ul className="list-disc pl-5 space-y-1">
            {listItems.map((item, itemIdx) => (
              <li key={itemIdx} className="text-sm text-slate-600 leading-relaxed">
                {parseBoldText(item)}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <p key={idx} className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
        {parseBoldText(trimmed)}
      </p>
    );
  });
}


export default function OfferCompletePage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  
  const [offer, setOffer] = React.useState<CompleteOffer | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [regenerating, setRegenerating] = React.useState(false);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      await api.post(`/api/job-offers/${jobId}/regenerate`, {});
      alert("La demande de régénération a été envoyée avec succès à n8n ! Elle s'actualisera sous peu.");
    } catch (error) {
      console.error("Error regenerating offer:", error);
      alert("Erreur lors du lancement de la régénération.");
    } finally {
      setRegenerating(false);
    }
  };

  React.useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await api.get<{ data: ApiJobOffer }>(`/api/job-offers/${jobId}`);
        if (res?.data) {
          const o = res.data;
          setOffer({
            id: o.id,
            title: o.title,
            contractType: o.contractType,
            location: o.location || "Non spécifiée",
            salary: o.salary || "Non spécifié",
            experience: `${o.experienceYears} ${o.experienceYears > 1 ? "ans" : "an"} d'expérience`,
            description: o.description,
            skills: o.skills ? o.skills.map((s) => s.name) : [],
            status: o.status === "OPEN" ? "Publiée" : "Archivée",
            date: new Date(o.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          });
        }
      } catch (error) {
        console.error("Error fetching job offer:", error);
      } finally {
        setLoading(false);
      }
    };
    if (jobId) {
      fetchOffer();
    }
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="solar:document-text-linear" className="w-4 h-4 text-blue-500" />
            Détails de l&apos;offre
          </h3>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-100 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
          >
            <Icon
              icon="solar:magic-stick-3-linear"
              className={`w-3.5 h-3.5 ${regenerating ? "animate-spin" : ""}`}
            />
            {regenerating ? "Génération..." : "Régénérer par l'IA"}
          </button>
        </div>

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

        <div className="space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description de l&apos;offre</span>
          <div className="space-y-4 bg-slate-50/50 rounded-2xl border border-slate-200/50 p-5 sm:p-6 text-slate-700">
            {formatDescription(offer.description)}
          </div>
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

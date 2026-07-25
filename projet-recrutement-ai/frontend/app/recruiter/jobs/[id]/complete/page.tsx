"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { api } from "@/lib/api";
import type { ApiJobOffer } from "@/lib/api";

interface DescriptionLine {
  text: string;
  isBullet: boolean;
}

interface DescriptionSection {
  title: string;
  icon: string;
  lines: DescriptionLine[];
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

  const [offer, setOffer] = useState<ApiJobOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const fetchOffer = async (showMainSpinner = false) => {
    try {
      if (showMainSpinner) setLoading(true);
      const { data } = await api.get<{ data: ApiJobOffer }>(`/api/job-offers/${jobId}`);
      if (data) {
        setOffer(data);
      } else {
        setError("Offer not found");
      }
    } catch (err: any) {
      console.error("Error fetching job offer details:", err);
      setError(err.message || "Failed to load job offer details");
    } finally {
      if (showMainSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchOffer(true);
    }
  }, [jobId]);

  const handleRegenerateDescription = async () => {
    if (!offer) return;
    try {
      setIsRegenerating(true);
      await api.post(`/api/job-offers/${offer.id}/regenerate`, {});
      console.log("Régénération déclenchée avec succès !");
      // Wait 3 seconds for n8n webhook callback, then soft reload the data
      setTimeout(async () => {
        await fetchOffer(false);
      }, 3000);
    } catch (err: any) {
      console.error("Erreur lors de la régénération:", err);
      alert(err.message || "Erreur lors de la régénération.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const toggleJobStatus = async () => {
    if (!offer) return;
    try {
      const { data: updated } = await api.patch<{ data: ApiJobOffer }>(
        `/api/job-offers/${offer.id}/toggle-status`
      );
      if (updated) {
        setOffer(updated);
      }
    } catch (err: any) {
      console.error("Error toggling job offer status:", err);
      alert("Erreur lors de la modification du statut de l'offre.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-20 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !offer) {
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

  const isOpen = offer.status === "OPEN";
  const statusText = isOpen ? "Ouverte" : "Fermée";
  const statusStyles = isOpen
    ? "bg-emerald-50 text-emerald-700 border-emerald-100/80"
    : "bg-rose-50 text-rose-700 border-rose-100/80";
  const dotColor = isOpen ? "bg-emerald-500" : "bg-rose-500";

  const formattedDate = new Date(offer.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formatExperience = (years: number) => {
    if (years === 0) return "Débutant (Sans expérience)";
    if (years === 1) return "+1 à 2 ans d'expérience";
    if (years === 3) return "+3 à 5 ans d'expérience";
    if (years === 5) return "+5 ans d'expérience (Senior)";
    return `+${years} ans d'expérience`;
  };

  const parsedSections = parseDescription(offer.description);

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      {/* Back button and title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/recruiter/jobs"
            className="p-2.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
          >
            <Icon icon="solar:alt-arrow-left-linear" className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight break-words">
                {offer.title}
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border leading-none ${statusStyles}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                {statusText}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Publiée le {formattedDate}</p>
          </div>
        </div>

        {/* Global actions at top */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            onClick={handleRegenerateDescription}
            disabled={isRegenerating}
            className="inline-flex items-center gap-2 font-semibold text-xs py-2.5 px-4 rounded-xl border border-indigo-200 text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed select-none"
          >
            <Icon 
              icon="solar:restart-bold" 
              className={`w-4 h-4 ${isRegenerating ? "animate-spin" : ""}`} 
            />
            {isRegenerating ? "Régénération..." : "Régénérer la description"}
          </button>
          
          <button
            onClick={toggleJobStatus}
            className={`inline-flex items-center gap-2 font-semibold text-xs py-2.5 px-4 rounded-xl border transition-all active:scale-95 select-none
              ${isOpen 
                ? "bg-white border-rose-200 text-rose-600 hover:bg-rose-50" 
                : "bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              }`}
          >
            <Icon icon={isOpen ? "solar:close-square-linear" : "solar:check-square-linear"} className="w-4 h-4" />
            {isOpen ? "Fermer l'offre" : "Ouvrir l'offre"}
          </button>
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

          {/* Skills Required Card */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 md:p-8 space-y-4">
            <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Icon icon="solar:star-bold-duotone" className="w-5 h-5 text-amber-500" />
              Compétences Clés
            </h3>
            <div className="flex flex-wrap gap-2 pt-2">
              {offer.skills && offer.skills.length > 0 ? (
                offer.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-blue-100/80 shadow-sm transition-all"
                  >
                    {skill.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">Aucune compétence spécifiée</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description de l&apos;offre</span>
          <div className="space-y-4 bg-slate-50/50 rounded-2xl border border-slate-200/50 p-5 sm:p-6 text-slate-700">
            {formatDescription(offer.description)}
          </div>
        </div>

            <div className="space-y-4">
              {/* Contract Type */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                  <Icon icon="solar:document-text-linear" className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contrat</span>
                  <span className="text-xs font-semibold text-slate-800 block mt-0.5">{offer.contractType}</span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                  <Icon icon="solar:map-point-linear" className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Localisation</span>
                  <span className="text-xs font-semibold text-slate-800 block mt-0.5">{offer.location || offer.locationType}</span>
                </div>
              </div>

              {/* Salary */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                  <Icon icon="solar:wad-of-money-linear" className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rémunération</span>
                  <span className="text-xs font-semibold text-slate-800 block mt-0.5">{offer.salary || "Non spécifiée"}</span>
                </div>
              </div>

              {/* Experience */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                  <Icon icon="solar:case-linear" className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Expérience</span>
                  <span className="text-xs font-semibold text-slate-800 block mt-0.5">{formatExperience(offer.experienceYears)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Company / Recruiter Card */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Icon icon="solar:shop-bold-duotone" className="w-4 h-4 text-emerald-500" />
              L&apos;entreprise
            </h3>
            
            <div className="flex items-center gap-3 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-base shadow-md flex-shrink-0">
                {offer.recruiter?.companyName?.slice(0, 2).toUpperCase() || "RE"}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-800 truncate">
                  {offer.recruiter?.companyName || "Entreprise Recruteur"}
                </h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <Icon icon="solar:shield-check-bold" className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span className="text-[10px] font-semibold text-emerald-600">Employeur vérifié</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-slate-200/60">
        <Link
          href={`/recruiter/jobs/${offer.id}/applicants`}
          className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-3 px-5 rounded-xl shadow-sm transition-all select-none"
        >
          <Icon icon="solar:users-group-two-rounded-linear" className="w-4 h-4" />
          Voir les candidats
        </Link>
        <button
          onClick={() => router.push("/recruiter/jobs")}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3 px-5 rounded-xl shadow-md transition-all active:scale-[0.98] select-none"
        >
          <Icon icon="solar:rocket-linear" className="w-4 h-4" />
          Retour aux offres
        </button>
      </div>
    </div>
  );
}

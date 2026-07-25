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

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      {/* Header section */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-start lg:items-center gap-3">
          <Link
            href="/recruiter/jobs"
            className="p-2.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all mt-1 lg:mt-0 flex-shrink-0"
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
            <p className="text-xs text-slate-400 mt-1.5">Publiée le {formattedDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap ml-12 lg:ml-0">
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
      </header>

      {/* Main Content Grid (12 Columns with items-start for sticky functionality) */}
      <div className="grid grid-cols-2 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: L'entreprise (Sticky Sidebar) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-6 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Icon icon="solar:shop-bold-duotone" className="w-4 h-4 text-emerald-500" />
              L&apos;entreprise
            </h3>
            
            <div className="flex items-center gap-3">
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

            {/* Smart Responsive Inner Grid: 1 col on mobile -> 2 cols on tablet -> 1 col on desktop sidebar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type de contrat</span>
                <p className="text-sm font-semibold text-slate-800">{offer.contractType}</p>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Localisation</span>
                <p className="text-sm font-semibold text-slate-800">{offer.location || offer.locationType}</p>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rémunération</span>
                <p className="text-sm font-semibold text-slate-800">{offer.salary || "Non spécifiée"}</p>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expérience</span>
                <p className="text-sm font-semibold text-slate-800">{formatExperience(offer.experienceYears)}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Offer Details & Competences */}
        <main className="lg:col-span-8 space-y-6">
          
          {/* Offer Details */}
          <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Icon icon="solar:document-text-linear" className="w-5 h-5 text-blue-500" />
                Détails de l&apos;offre
              </h3>
              <button
                onClick={handleRegenerateDescription}
                disabled={isRegenerating}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-100 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 self-start sm:self-auto"
              >
                <Icon
                  icon="solar:magic-stick-3-linear"
                  className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin" : ""}`}
                />
                {isRegenerating ? "Génération..." : "Régénérer par l'IA"}
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50/50 rounded-2xl border border-slate-200/50 p-5 sm:p-6 text-slate-700">
                {formatDescription(offer.description)}
              </div>
            </div>
          </div>

          {/* Skills Required Card */}
         <div className="bg-white p-6 sm:p-8 space-y-4">
  <h3 className="text-base font-bold text-slate-800 pb-4 flex items-center gap-2">
    <Icon icon="solar:star-bold-duotone" className="w-5 h-5 text-amber-500" />
    Compétences Clés
  </h3>
  <div className="flex flex-wrap gap-2.5 pt-1">
    {offer.skills && offer.skills.length > 0 ? (
      offer.skills.map((skill: { id: string; name: string }) => (
        <span
          key={skill.id}
          className="bg-blue-50 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
        >
          {skill.name}
        </span>
      ))
    ) : (
      <span className="text-xs text-slate-400 italic">Aucune compétence spécifiée</span>
    )}
  </div>
</div>
        </main>
      </div>

      {/* Action Buttons Footer */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-6 border-t border-slate-200/60">
        <Link
          href={`/recruiter/jobs/${offer.id}/applicants`}
          className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-3 px-6 rounded-xl shadow-sm transition-all select-none"
        >
          <Icon icon="solar:users-group-two-rounded-linear" className="w-4 h-4" />
          Voir les candidats
        </Link>
        <button
          onClick={() => router.push("/recruiter/jobs")}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3 px-6 rounded-xl shadow-md transition-all active:scale-[0.98] select-none"
        >
          <Icon icon="solar:rocket-linear" className="w-4 h-4" />
          Retour aux offres
        </button>
      </div>
    </div>
  );
}
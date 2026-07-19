"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { api, ApiJobOffer } from "@/lib/api";

interface DescriptionLine {
  text: string;
  isBullet: boolean;
}

interface DescriptionSection {
  title: string;
  icon: string;
  lines: DescriptionLine[];
}

// Dynamic parser to split plain text description into logical visual sections
const parseDescription = (text: string): DescriptionSection[] => {
  if (!text) return [];

  const rawLines = text.split("\n");
  const sections: DescriptionSection[] = [];
  let currentSection: DescriptionSection | null = null;

  // Recognizes common headers (e.g. ### Missions, **Missions**, Missions:, etc.)
  const headerRegex = /^(?:#+\s*|\*+\s*|)(Missions|Responsabilités|Profil recherché|Compétences requises|Avantages|À propos|Description du poste|Mission|Profil|Requirements|Responsibilities|Benefits)(?:\s*\*+|:|\s*)$/i;

  const getIconForHeader = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("mission") || t.includes("responsab")) return "solar:target-bold-duotone";
    if (t.includes("profil") || t.includes("requi") || t.includes("compét")) return "solar:diploma-bold-duotone";
    if (t.includes("avantage") || t.includes("benefit")) return "solar:gift-bold-duotone";
    if (t.includes("propos") || t.includes("about")) return "solar:info-square-bold-duotone";
    return "solar:clipboard-text-bold-duotone";
  };

  for (let line of rawLines) {
    line = line.trim();
    if (!line) continue;

    const match = line.match(headerRegex);
    if (match) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: match[1],
        icon: getIconForHeader(match[1]),
        lines: []
      };
    } else {
      if (!currentSection) {
        currentSection = {
          title: "Description du poste",
          icon: "solar:clipboard-text-bold-duotone",
          lines: []
        };
      }
      
      const isBullet = /^[\s*\-•+]+|^\d+\./.test(line);
      const cleanedText = line.replace(/^[\s*\-•+]+|^\d+\.\s*/, "").trim();
      currentSection.lines.push({ text: cleanedText, isBullet });
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
};

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

      {/* Grid Layout: Main info left, Sidebar right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Details (Left Column - 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 md:p-8 space-y-6 relative overflow-hidden">
            {/* Top decorative accent line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-600" />
            
            <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Icon icon="solar:document-text-bold-duotone" className="w-5 h-5 text-blue-500" />
              Description du poste
            </h3>

            {/* Description Render */}
            <div className="space-y-6">
              {parsedSections.length > 0 ? (
                parsedSections.map((section, idx) => {
                  const isDefaultSingleSection = parsedSections.length === 1 && section.title === "Description du poste";
                  return (
                    <div 
                      key={idx} 
                      className={`${
                        isDefaultSingleSection 
                          ? "p-0 border-none bg-transparent hover:bg-transparent" 
                          : "bg-slate-50/40 hover:bg-slate-50/80 border border-slate-100/70 rounded-2xl p-6 transition-all"
                      } space-y-4`}
                    >
                      {!isDefaultSingleSection && (
                        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                          <div className="w-8 h-8 rounded-xl bg-blue-50/80 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <Icon icon={section.icon} className="w-4.5 h-4.5" />
                          </div>
                          <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-800">
                            {section.title}
                          </h4>
                        </div>
                      )}
                      <div className="space-y-2">
                        {section.lines.map((line, lineIdx) => (
                          line.isBullet ? (
                            <div key={lineIdx} className="text-sm text-slate-600 leading-relaxed flex items-start gap-2.5 pl-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/80 mt-2 flex-shrink-0" />
                              <span>{line.text}</span>
                            </div>
                          ) : (
                            <p key={lineIdx} className="text-sm text-slate-600 leading-relaxed pl-1.5 whitespace-pre-wrap">
                              {line.text}
                            </p>
                          )
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500 italic">Aucune description détaillée fournie.</p>
              )}
            </div>
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

        {/* Sidebar details (Right Column - 1/3) */}
        <div className="space-y-6">
          {/* Job specs checklist */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Icon icon="solar:info-square-bold-duotone" className="w-4 h-4 text-indigo-500" />
              Aperçu du poste
            </h3>

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

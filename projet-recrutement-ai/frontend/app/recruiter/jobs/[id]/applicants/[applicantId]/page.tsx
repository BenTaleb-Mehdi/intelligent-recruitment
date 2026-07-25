"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import data from "@/data/applicants.json";
import { api } from "@/lib/api";

const statusStyles: Record<string, string> = {
  Nouveau: "bg-blue-50 text-blue-700 border-blue-100/80",
  Entretien: "bg-amber-50 text-amber-700 border-amber-100/80",
  "En cours": "bg-purple-50 text-purple-700 border-purple-100/80",
  Refusé: "bg-rose-50 text-rose-700 border-rose-100/80",
};

export default function ApplicantDetailPage() {
  const params = useParams();
  const jobId = params.id as string;
  const applicantId = params.applicantId as string;

  const [applicant, setApplicant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicant = async () => {
      setLoading(true);
      try {
        const res = await api.get<{ success: boolean; data: any[] }>(
          `/api/job-offers/${jobId}/applicants`
        );
        if (res?.data && Array.isArray(res.data)) {
          const found = res.data.find(
            (a) => a.id === applicantId || a.applicationId === applicantId || a.candidateId === applicantId
          );
          if (found) {
            setApplicant(found);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Error fetching applicant from API:", err);
      }

      // Fallback to JSON mock data if not found in backend DB
      const mockFound = (data.applicants as any[]).find((a) => a.id === applicantId);
      setApplicant(mockFound || null);
      setLoading(false);
    };

    if (jobId && applicantId) {
      fetchApplicant();
    }
  }, [jobId, applicantId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
          <Icon icon="solar:user-id-linear" className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-700">Candidat introuvable</h2>
        <p className="text-sm text-slate-400">Aucun candidat trouvé avec cet identifiant.</p>
        <Link
          href={`/recruiter/jobs/${jobId}/applicants`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          <Icon icon="solar:alt-arrow-left-linear" className="w-4 h-4" />
          Retour aux candidats
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/recruiter/jobs/${jobId}/applicants`}
          className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Icon icon="solar:alt-arrow-left-linear" className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {applicant.name}
            </h2>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border leading-none ${statusStyles[applicant.status] || statusStyles["Nouveau"]}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                applicant.status === "Nouveau" ? "bg-blue-500" :
                applicant.status === "Entretien" ? "bg-amber-500" :
                applicant.status === "En cours" ? "bg-purple-500" : "bg-rose-500"
              }`} />
              {applicant.status}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Candidat pour l&apos;offre #{jobId}
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 sm:p-8 space-y-6">
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Icon icon="solar:user-id-linear" className="w-4 h-4 text-blue-500" />
          Informations personnelles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nom complet</span>
            <p className="text-sm font-semibold text-slate-800">{applicant.name || "-"}</p>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Téléphone</span>
            <p className="text-sm font-semibold text-slate-800">{applicant.phone || "-"}</p>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</span>
            <p className="text-sm font-semibold text-slate-800">{applicant.email || "-"}</p>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date de candidature</span>
            <p className="text-sm font-semibold text-slate-800">
              {applicant.appliedDate ? (
                isNaN(new Date(applicant.appliedDate).getTime())
                  ? applicant.appliedDate
                  : new Date(applicant.appliedDate).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
              ) : (
                "-"
              )}
            </p>
          </div>
        </div>

        {/* Social Links & CV */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Liens & CV</span>
          <div className="flex flex-wrap gap-2">
            {applicant.github && (
              <a
                href={applicant.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold text-slate-700 bg-slate-50 border border-slate-200/80 rounded-lg hover:bg-slate-100 transition-all"
              >
                <Icon icon="solar:code-square-linear" className="w-3.5 h-3.5" />
                GitHub
              </a>
            )}
            {applicant.linkedin && (
              <a
                href={applicant.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100/80 rounded-lg hover:bg-blue-100 transition-all"
              >
                <Icon icon="solar:link-linear" className="w-3.5 h-3.5" />
                LinkedIn
              </a>
            )}
            {applicant.portfolio && (
              <a
                href={applicant.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-100/80 rounded-lg hover:bg-purple-100 transition-all"
              >
                <Icon icon="solar:global-linear" className="w-3.5 h-3.5" />
                Portfolio
              </a>
            )}
            {applicant.cv && (
              <a
                href={applicant.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100/80 rounded-lg hover:bg-emerald-100 transition-all"
              >
                <Icon icon="solar:file-text-linear" className="w-3.5 h-3.5" />
                Voir le CV
              </a>
            )}
            {!applicant.github && !applicant.linkedin && !applicant.portfolio && !applicant.cv && (
              <span className="text-slate-400 text-xs font-normal">Aucun lien disponible</span>
            )}
          </div>
        </div>
      </div>

      {/* Skills & Experience */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 sm:p-8 space-y-6">
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Icon icon="solar:document-text-linear" className="w-4 h-4 text-blue-500" />
          Compétences & Expérience
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expérience</span>
            <p className="text-sm font-semibold text-slate-800">{applicant.experience || "-"}</p>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Note de matching</span>
            <div className="flex items-center gap-1.5">
              <Icon icon="solar:star-bold" className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-slate-800">{applicant.rating || 0}</span>
              <span className="text-xs text-slate-400">/ 5</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compétences</span>
          <div className="flex flex-wrap gap-1.5">
            {applicant.skills && applicant.skills.length > 0 ? (
              applicant.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2.5 py-1 rounded-md border border-blue-100/80"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-slate-400 text-xs font-normal">Aucune compétence renseignée</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/recruiter/messages?candidateId=${applicant.id || applicant.candidateId}&candidateName=${encodeURIComponent(applicant.name || "")}`}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-3 px-5 rounded-xl shadow-sm transition-all"
        >
          <Icon icon="solar:chat-round-dots-bold" className="w-4 h-4" />
          Contacter le candidat
        </Link>
        <Link
          href={`/recruiter/jobs/${jobId}/applicants`}
          className="inline-flex items-center gap-2 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-3 px-5 rounded-xl transition-all select-none"
        >
          <Icon icon="solar:alt-arrow-left-linear" className="w-4 h-4" />
          Retour à la liste
        </Link>
      </div>
    </div>
  );
}

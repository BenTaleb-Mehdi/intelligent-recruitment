"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { saveRecruiterConversation } from "@/lib/recruiterChat";

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Nouveau" | "Entretien" | "En cours" | "Refusé";
  appliedDate: string;
  skills: string[];
  experience: string;
  rating: number;
  bio?: string;
  image?: string;
}

export interface ApplicantsTableProps {
  applicants: Applicant[];
  jobId: string;
}

const getInitials = (name: string) => {
  if (!name) return "C";
  return name
    .split(" ")
    .map((n) => n[0] || "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const statusStyles: Record<Applicant["status"], string> = {
  Nouveau: "bg-blue-50 text-blue-700 border-blue-100/80 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50",
  Entretien: "bg-amber-50 text-amber-700 border-amber-100/80 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50",
  "En cours": "bg-purple-50 text-purple-700 border-purple-100/80 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/50",
  Refusé: "bg-rose-50 text-rose-700 border-rose-100/80 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50",
};

export default function ApplicantsTable({ applicants, jobId }: ApplicantsTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[800px] text-xs text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 select-none">
              <th className="font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4">
                Candidat
              </th>
              <th className="font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4">
                Contact
              </th>
              <th className="font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4">
                Statut
              </th>
              <th className="font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4">
                Compétences
              </th>
              <th className="font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4">
                Expérience
              </th>
              <th className="font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4">
                Note
              </th>
              <th className="font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4">
                Date
              </th>
              <th className="font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {applicants.length > 0 ? (
              applicants.map((applicant) => (
                <tr
                  key={applicant.id}
                  className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {applicant.image ? (
                        <img
                          src={applicant.image}
                          alt={applicant.name || "Candidat"}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
                          {getInitials(applicant.name)}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {applicant.name || "Candidat"}
                        </span>
                        {applicant.bio ? (
                          <span className="text-[11px] text-slate-400 line-clamp-1 max-w-[220px]" title={applicant.bio}>
                            {applicant.bio}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-slate-600 dark:text-slate-400">{applicant.email || "-"}</span>
                      {applicant.phone ? <span className="text-slate-400">{applicant.phone}</span> : null}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border leading-none select-none ${statusStyles[applicant.status] || statusStyles["Nouveau"]}`}
                    >
                      {applicant.status || "Nouveau"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {applicant.skills && applicant.skills.length > 0 ? (
                        applicant.skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {(() => {
                      const experienceVal = applicant.experience;
                      if (!experienceVal) return "-";
                      try {
                        const parsed = JSON.parse(experienceVal);
                        if (Array.isArray(parsed)) {
                          if (parsed.length === 0) return "-";
                          return (
                            <div className="space-y-1 max-w-[280px]">
                              {parsed.map((exp: any, index: number) => {
                                const role = exp.role || exp.title || "";
                                const company = exp.company || "";
                                const period = exp.period || "";
                                return (
                                  <div key={index} className="leading-normal border-b border-slate-50 last:border-0 pb-1 last:pb-0">
                                    {role && <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate" title={role}>{role}</span>}
                                    <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500">
                                      {company && <span className="truncate" title={company}>{company}</span>}
                                      {period && <span className="text-slate-400 shrink-0">{period}</span>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }
                      } catch (e) {}
                      return <span className="truncate max-w-[200px] block" title={experienceVal}>{experienceVal}</span>;
                    })()}
                  </td>
                  <td className="py-3.5 px-4">
                    {applicant.rating && applicant.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <Icon
                          icon="solar:star-bold"
                          className="w-3.5 h-3.5 text-amber-400"
                        />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {applicant.rating}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {applicant.appliedDate ? (
                      new Date(applicant.appliedDate).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/recruiter/messages?candidateId=${applicant.id}&candidateName=${encodeURIComponent(applicant.name || "")}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-all"
                      >
                        <Icon icon="solar:chat-round-dots-bold" className="w-3.5 h-3.5 text-emerald-600" />
                        Contacter
                      </Link>
                      <Link
                        href={`/recruiter/jobs/${jobId}/applicants/${applicant.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 border border-blue-100/80 dark:border-blue-900/50 rounded-lg transition-all"
                      >
                        <Icon icon="solar:eye-linear" className="w-3.5 h-3.5" />
                        Détails
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 px-4 text-center text-slate-400 select-none"
                >
                  Aucun candidat disponible pour cette offre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div className="md:hidden divide-y divide-slate-100">
        {applicants.length > 0 ? (
          applicants.map((applicant) => (
            <div key={applicant.id} className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                {applicant.image ? (
                  <img
                    src={applicant.image}
                    alt={applicant.name || "Candidat"}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
                    {getInitials(applicant.name)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-semibold text-sm text-slate-800">
                        {applicant.name || "Candidat"}
                      </span>
                      <div className="text-xs text-slate-400 mt-0.5">{applicant.email || "-"}</div>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border leading-none select-none ${statusStyles[applicant.status] || statusStyles["Nouveau"]}`}
                    >
                      {applicant.status || "Nouveau"}
                    </span>
                  </div>
                  {applicant.bio && (
                    <p className="text-xs text-slate-500 mt-1.5 italic line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      &ldquo;{applicant.bio}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Téléphone</span>
                  <p className="text-slate-600 font-medium">{applicant.phone || "-"}</p>
                </div>
                <div className="col-span-2 mt-1">
                  <span className="text-slate-400 block mb-0.5">Expérience</span>
                  {(() => {
                    const experienceVal = applicant.experience;
                    if (!experienceVal) return <p className="text-slate-600 font-medium">-</p>;
                    try {
                      const parsed = JSON.parse(experienceVal);
                      if (Array.isArray(parsed)) {
                        if (parsed.length === 0) return <p className="text-slate-600 font-medium">-</p>;
                        return (
                          <div className="space-y-1.5 mt-1">
                            {parsed.map((exp: any, index: number) => (
                              <div key={index} className="text-xs bg-slate-50 dark:bg-zinc-800/50 p-2 rounded-lg border border-slate-100 dark:border-zinc-700/50">
                                <div className="font-semibold text-slate-800 dark:text-slate-200 flex justify-between gap-2">
                                  <span>{exp.role || exp.title}</span>
                                  {exp.period && <span className="text-[10px] text-slate-400 font-normal">{exp.period}</span>}
                                </div>
                                {exp.company && <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">{exp.company}</div>}
                              </div>
                            ))}
                          </div>
                        );
                      }
                    } catch (e) {}
                    return <p className="text-slate-600 font-medium">{experienceVal}</p>;
                  })()}
                </div>
                <div>
                  <span className="text-slate-400">Note</span>
                  <p className="text-slate-600 font-medium inline-flex items-center gap-1">
                    {applicant.rating && applicant.rating > 0 ? (
                      <>
                        <Icon icon="solar:star-bold" className="w-3 h-3 text-amber-400" />
                        {applicant.rating}
                      </>
                    ) : (
                      "-"
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Date</span>
                  <p className="text-slate-600 font-medium">
                    {applicant.appliedDate ? (
                      new Date(applicant.appliedDate).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    ) : (
                      "-"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {applicant.skills && applicant.skills.length > 0 ? (
                  applicant.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                    >
                      {skill}
                    </span>
                  ))
                ) : null}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <Link
                  href={`/recruiter/messages?candidateId=${applicant.id}&candidateName=${encodeURIComponent(applicant.name || "")}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-all"
                >
                  <Icon icon="solar:chat-round-dots-bold" className="w-3.5 h-3.5 text-emerald-600" />
                  Contacter
                </Link>
                <Link
                  href={`/recruiter/jobs/${jobId}/applicants/${applicant.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100/80 rounded-lg transition-all"
                >
                  <Icon icon="solar:eye-linear" className="w-3.5 h-3.5" />
                  Voir le dossier complet
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 px-4 text-center text-slate-400 select-none">
            Aucun candidat disponible pour cette offre.
          </div>
        )}
      </div>
    </div>
  );
}

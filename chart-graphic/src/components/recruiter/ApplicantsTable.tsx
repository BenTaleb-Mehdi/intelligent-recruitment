"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

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
}

export interface ApplicantsTableProps {
  applicants: Applicant[];
  jobId: string;
}

const statusStyles: Record<Applicant["status"], string> = {
  Nouveau: "bg-blue-50 text-blue-700 border-blue-100/80 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50",
  Entretien: "bg-amber-50 text-amber-700 border-amber-100/80 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50",
  "En cours": "bg-purple-50 text-purple-700 border-purple-100/80 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/50",
  Refusé: "bg-rose-50 text-rose-700 border-rose-100/80 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50",
};

const avatarColors = [
  "from-blue-500 to-indigo-500",
  "from-purple-500 to-indigo-500",
  "from-teal-500 to-emerald-500",
  "from-indigo-500 to-sky-500",
  "from-sky-500 to-cyan-500",
];

export default function ApplicantsTable({ applicants, jobId }: ApplicantsTableProps) {
  if (applicants.length === 0) {
    return (
      <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center text-slate-400 select-none shadow-sm font-sans">
        <Icon icon="solar:users-group-two-rounded-linear" className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p className="text-sm font-semibold">Aucun candidat trouvé pour cette recherche.</p>
      </div>
    );
  }

  return (
    <div className="font-sans">
      {/* 1. Desktop Spreadsheet Table View (hidden on mobile) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 select-none">
                <th className="font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4">Candidat</th>
                <th className="font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4">Contact</th>
                <th className="font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4">Statut</th>
                <th className="font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4">Compétences</th>
                <th className="font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4">Expérience</th>
                <th className="font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4">Note</th>
                <th className="font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4">Date</th>
                <th className="font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((applicant) => (
                <tr key={applicant.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{applicant.name}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-slate-600 dark:text-slate-400">{applicant.email}</span>
                      <span className="text-slate-400">{applicant.phone}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border leading-none select-none ${statusStyles[applicant.status]}`}>
                      {applicant.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {applicant.skills.map((skill) => (
                        <span key={skill} className="bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-650">{applicant.experience}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1">
                      <Icon icon="solar:star-bold" className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{applicant.rating}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(applicant.appliedDate).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Link
                      href={`/recruiter/jobs/${jobId}/applicants/${applicant.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100/80 rounded-lg transition-all"
                    >
                      <Icon icon="solar:eye-linear" className="w-3.5 h-3.5" />
                      Détails
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Mobile Responsive Card List View (hidden on desktop) */}
      <div className="block md:hidden space-y-4">
        {applicants.map((applicant, idx) => {
          const avatarColor = avatarColors[idx % avatarColors.length];
          const initials = applicant.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <Link href={`/recruiter/jobs/${jobId}/applicants/${applicant.id}`} key={applicant.id} className="block">
              <div className="group bg-white border border-slate-200/60 rounded-2xl p-5 hover:shadow-lg hover:border-blue-200/80 transition-all duration-300 flex flex-col gap-4 cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${avatarColor} flex items-center justify-center text-white font-black text-xs shrink-0 select-none shadow-sm`}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-850 truncate group-hover:text-blue-600 transition-colors">
                        {applicant.name}
                      </h3>
                      <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border shrink-0 ${statusStyles[applicant.status]}`}>
                        {applicant.status}
                      </span>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                      Postulé le {new Date(applicant.appliedDate).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-50 pt-3">
                  <span className="flex items-center gap-1">
                    <Icon icon="solar:clock-circle-linear" className="w-3.5 h-3.5 text-slate-400" />
                    {applicant.experience}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon icon="solar:star-bold" className="w-3.5 h-3.5 text-amber-400" />
                    {applicant.rating}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {applicant.skills.map((skill) => (
                    <span key={skill} className="text-[9px] font-black px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100/50">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { api, ApiRecruiter, ApiApplication } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export default function RecentActivity() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const { data: session } = await authClient.getSession();
        if (!session?.user?.id) return;

        const { data: recruiters } = await api.get<{ data: ApiRecruiter[] }>("/api/recruiters");
        const recruiter = recruiters?.find((r) => r.userId === session.user.id);
        if (!recruiter) return;

        const { data: applications } = await api.get<{ data: ApiApplication[] }>(
          `/api/recruiters/${recruiter.id}/recent-applications?limit=10`
        );

        const mapped = (applications || []).map((app) => ({
          name: app.candidate?.user?.name || "Inconnu",
          role: app.jobOffer?.title || "N/A",
          time: new Date(app.appliedDate).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          score: app.matchScore,
          statusClass:
            app.matchScore >= 80
              ? "bg-emerald-50 text-emerald-700 border-emerald-100/80"
              : app.matchScore >= 50
                ? "bg-amber-50 text-amber-700 border-amber-100/80"
                : "bg-rose-50 text-rose-700 border-rose-100/80",
        }));

        setCandidates(mapped);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
          <h4 className="text-base font-semibold text-slate-800">Candidatures Récentes</h4>
        </div>
        <div className="p-6 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
        <h4 className="text-base font-semibold text-slate-800">Candidatures Récentes & Score de Matching IA</h4>
        <span className="text-xs text-indigo-600 font-semibold cursor-pointer hover:underline">Voir tout</span>
      </div>

      {candidates.length === 0 ? (
        <div className="px-6 py-12 text-center text-slate-400 text-sm">
          Aucune candidature récente.
        </div>
      ) : (
        <>
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full min-w-[480px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                  <th className="px-6 py-3">Candidat</th>
                  <th className="px-6 py-3">Poste visé</th>
                  <th className="px-6 py-3">Date de postulation</th>
                  <th className="px-6 py-3 text-right">Score IA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {candidates.map((cand, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{cand.name}</td>
                    <td className="px-6 py-4 text-slate-500">{cand.role}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{cand.time}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${cand.statusClass}`}>
                        {cand.score}% match
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden divide-y divide-slate-100">
            {candidates.map((cand, idx) => (
              <div key={idx} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-semibold text-sm text-slate-800">{cand.name}</span>
                    <p className="text-xs text-slate-500 mt-0.5">{cand.role}</p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${cand.statusClass}`}>
                    {cand.score}% match
                  </span>
                </div>
                <p className="text-xs text-slate-400">{cand.time}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

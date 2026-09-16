"use client";

import React, { useState, useEffect } from "react";
import { api, ApiRecruiter } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

interface ScoreDistributionItem {
  label: string;
  count: number | string;
  percent: number;
  color: string;
}

interface WeeklyBar {
  label: string;
  count: number;
  percent: number;
}

export default function ChartsSection() {
  const [weeklyEvolution, setWeeklyEvolution] = useState<WeeklyBar[]>([
    { label: "Sem 1", count: 8, percent: 30 },
    { label: "Sem 2", count: 16, percent: 55 },
    { label: "Sem 3", count: 12, percent: 45 },
    { label: "Sem 4", count: 28, percent: 85 },
    { label: "Sem 5", count: 20, percent: 70 },
  ]);
  const [scoreDistribution, setScoreDistribution] = useState<ScoreDistributionItem[]>([
    { label: "Top Match (80% - 100%)", count: "12 candidats", percent: 45, color: "bg-emerald-500" },
    { label: "Potentiel (50% - 79%)", count: "10 candidats", percent: 40, color: "bg-amber-500" },
    { label: "Non adapté (< 50%)", count: "4 candidats", percent: 15, color: "bg-rose-500" },
  ]);
  const [accuracy, setAccuracy] = useState<string>("85%");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartsData = async () => {
      try {
        const { data: session } = await authClient.getSession();
        if (!session?.user?.id) return;

        const { data: recruiters } = await api.get<{ data: ApiRecruiter[] }>("/api/recruiters");
        const recruiter = recruiters?.find((r) => r.userId === session.user.id);
        const recruiterId = recruiter ? recruiter.id : "default";

        const res = await api.get<{
          success: boolean;
          data: {
            scoreDistribution: {
              topMatch: { count: number; percent: number; label: string; color: string };
              potential: { count: number; percent: number; label: string; color: string };
              low: { count: number; percent: number; label: string; color: string };
              accuracy: string;
            };
            weeklyEvolution: WeeklyBar[];
          };
        }>(`/api/recruiters/${recruiterId}/stats`);

        if (res?.data?.scoreDistribution) {
          const sd = res.data.scoreDistribution;
          setScoreDistribution([
            {
              label: sd.topMatch.label || "Top Match (80% - 100%)",
              count: `${sd.topMatch.count} candidat${sd.topMatch.count > 1 ? "s" : ""}`,
              percent: sd.topMatch.percent,
              color: "bg-emerald-500",
            },
            {
              label: sd.potential.label || "Potentiel (50% - 79%)",
              count: `${sd.potential.count} candidat${sd.potential.count > 1 ? "s" : ""}`,
              percent: sd.potential.percent,
              color: "bg-amber-500",
            },
            {
              label: sd.low.label || "Non adapté (< 50%)",
              count: `${sd.low.count} candidat${sd.low.count > 1 ? "s" : ""}`,
              percent: sd.low.percent,
              color: "bg-rose-500",
            },
          ]);
          setAccuracy(sd.accuracy || "85%");
        }

        if (res?.data?.weeklyEvolution && Array.isArray(res.data.weeklyEvolution)) {
          setWeeklyEvolution(res.data.weeklyEvolution);
        }
      } catch (error) {
        console.error("Error loading charts data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartsData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chart 1: Bar Chart (Evolution des candidatures) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-2 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-slate-800 tracking-tight">
              Évolution des Candidatures
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Volume des candidatures reçues par semaine
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-100">
            5 dernières semaines
          </span>
        </div>

        <div className="h-60 flex items-end justify-between gap-3 pt-6 px-2">
          {weeklyEvolution.map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <span className="text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-blue-50 px-1.5 py-0.5 rounded shadow-xs">
                {bar.count} postulant{bar.count > 1 ? "s" : ""}
              </span>
              <div
                className="w-full max-w-[48px] bg-gradient-to-t from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 rounded-t-xl transition-all cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.03]"
                style={{ height: `${Math.max(15, bar.percent || 25)}%` }}
              />
              <span className="text-xs text-slate-500 font-semibold whitespace-nowrap mt-1">
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart 2: Doughnut Alternative (Répartition des scores IA) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div>
          <h4 className="text-base font-bold text-slate-800 tracking-tight">
            Répartition des Profils par Score IA
          </h4>
          <p className="text-xs text-slate-400 mt-0.5 mb-5">
            Segmentation intelligente des compétences
          </p>
        </div>

        <div className="space-y-4 pt-1">
          {scoreDistribution.map((item, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">{item.label}</span>
                <span className="text-slate-900 font-bold">{item.count} ({item.percent}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`${item.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-slate-100 flex justify-center mt-4">
            <div className="text-center">
              <span className="text-3xl font-extrabold text-blue-600 tracking-tight">{accuracy}</span>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                Précision actuelle du matching IA
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
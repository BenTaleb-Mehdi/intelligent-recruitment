"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import analyticsData from "@/data/analytics.json";
import ResponseTimeChart from "@/components/recruiter/ResponseTimeChart";
import RecruitmentFunnel from "@/components/recruiter/RecruitmentFunnel";

const { weeklyData, funnelStages } = analyticsData;

export default function AnalyticsPage() {
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Analytiques</h2>
        <p className="text-sm text-slate-500 mt-1">
          Performance du recrutement, vitesse du pipeline et impact de l&apos;IA.
        </p>
      </div>

      {/* Section 1: Core Performance KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <Icon icon="solar:clock-circle-linear" className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Temps de réponse moyen</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">1.8 <span className="text-sm font-semibold text-slate-400">jours</span></p>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit">
            <Icon icon="solar:graph-up-linear" className="w-3.5 h-3.5" />
            -12% vs mois dernier
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Icon icon="solar:target-linear" className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Taux d&apos;acceptation Top Match</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">84.5<span className="text-sm font-semibold text-slate-400">%</span></p>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit">
            <Icon icon="solar:graph-up-linear" className="w-3.5 h-3.5" />
            +5.2% vs mois dernier
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
              <Icon icon="solar:stopwatch-linear" className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Temps économisé (pré-screening)</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">12.5 <span className="text-sm font-semibold text-slate-400">h/offre</span></p>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit">
            <Icon icon="solar:clock-circle-linear" className="w-3.5 h-3.5" />
            Automatisé par l&apos;IA
          </div>
        </div>
      </div>

      {/* Section 2 + 3: Chart + Funnel side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <ResponseTimeChart
          weeklyData={weeklyData}
          hoveredWeek={hoveredWeek}
          setHoveredWeek={setHoveredWeek}
        />

        <RecruitmentFunnel funnelStages={funnelStages} />
      </div>
    </div>
  );
}

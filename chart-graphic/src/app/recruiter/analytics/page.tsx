"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import analyticsData from "@/data/analytics.json";

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        {/* Response Time Evolution */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Icon icon="solar:chart-2-linear" className="w-4 h-4 text-blue-500" />
            Évolution du temps de réponse
          </h3>

          <div className="flex items-end justify-between gap-3 h-48 pt-4">
            {weeklyData.map((d, i) => {
              const barHeight = (d.value / 3) * 100;
              const isHovered = hoveredWeek === i;
              return (
                <div
                  key={d.week}
                  className="flex-1 flex flex-col items-center gap-2 group relative"
                  onMouseEnter={() => setHoveredWeek(i)}
                  onMouseLeave={() => setHoveredWeek(null)}
                >
                  {isHovered && (
                    <div className="absolute -top-8 bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap z-10">
                      {d.value} jours
                    </div>
                  )}
                  <div
                    className={`w-full max-w-[48px] rounded-lg transition-all duration-200 cursor-pointer ${
                      isHovered
                        ? "bg-blue-500 shadow-md shadow-blue-200/50 scale-105"
                        : "bg-blue-200 hover:bg-blue-300"
                    }`}
                    style={{ height: `${barHeight}%` }}
                  />
                  <span className="text-[10px] font-semibold text-slate-400">{d.week}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
            <span>Moyenne: 1.96 jours</span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-200" />
              Temps de réponse (jours)
            </span>
          </div>
        </div>

        {/* Recruitment Funnel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Icon icon="solar:pie-chart-2-linear" className="w-4 h-4 text-amber-500" />
            Tunnel de recrutement
          </h3>

          <div className="space-y-4">
            {funnelStages.map((stage) => (
              <div key={stage.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{stage.label}</span>
                  <span className="font-bold text-slate-900">{stage.count}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${stage.pct}%`,
                      backgroundColor:
                        stage.pct >= 50
                          ? "#10b981"
                          : stage.pct >= 30
                          ? "#f59e0b"
                          : "#ef4444",
                    }}
                  />
                </div>
                <div className="text-right text-[10px] font-medium text-slate-400">
                  {stage.pct}% du total
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

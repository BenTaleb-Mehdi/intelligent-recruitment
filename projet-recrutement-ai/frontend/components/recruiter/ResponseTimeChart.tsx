"use client";

import React from "react";
import { Icon } from "@iconify/react";

export interface WeeklyDataItem {
  week: string;
  value: number;
}

export interface ResponseTimeChartProps {
  weeklyData: WeeklyDataItem[];
  hoveredWeek: number | null;
  setHoveredWeek: (index: number | null) => void;
  avgResponseDays?: number | string;
}

export default function ResponseTimeChart({
  weeklyData,
  hoveredWeek,
  setHoveredWeek,
  avgResponseDays,
}: ResponseTimeChartProps) {
  const computedAvg = avgResponseDays
    ? avgResponseDays
    : weeklyData.length > 0
    ? (weeklyData.reduce((acc, curr) => acc + curr.value, 0) / weeklyData.length).toFixed(2)
    : "1.8";

  return (
    <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 space-y-5">
      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2 select-none">
        <Icon icon="solar:chart-2-linear" className="w-4 h-4 text-blue-500" />
        Évolution du temps de réponse
      </h3>

      <div className="flex items-end justify-between gap-3 h-48 pt-4">
        {weeklyData.map((d, i) => {
          const barHeight = Math.min(100, Math.max(15, (d.value / 3) * 100));
          const isHovered = hoveredWeek === i;
          return (
            <div
              key={d.week}
              className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end"
              onMouseEnter={() => setHoveredWeek(i)}
              onMouseLeave={() => setHoveredWeek(null)}
            >
              {isHovered && (
                <div className="absolute -top-8 bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap z-10 shadow-md">
                  {d.value} jours
                </div>
              )}
              <div
                className={`w-full max-w-[48px] rounded-t-xl transition-all duration-200 cursor-pointer ${
                  isHovered
                    ? "bg-gradient-to-t from-blue-600 to-indigo-500 shadow-md shadow-blue-200/50 scale-105"
                    : "bg-blue-100 hover:bg-blue-200"
                }`}
                style={{ height: `${barHeight}%` }}
              />
              <span className="text-[10px] font-semibold text-slate-400 mt-1">{d.week}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100 select-none">
        <span className="font-semibold text-slate-600">Délai moyen: {computedAvg} jours</span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
          Temps de réponse (jours)
        </span>
      </div>
    </div>
  );
}

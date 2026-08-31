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
}

export default function ResponseTimeChart({
  weeklyData,
  hoveredWeek,
  setHoveredWeek,
}: ResponseTimeChartProps) {
  return (
    <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 space-y-5">
      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2 select-none">
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

      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100 select-none">
        <span>Moyenne: 1.96 jours</span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-200" />
          Temps de réponse (jours)
        </span>
      </div>
    </div>
  );
}

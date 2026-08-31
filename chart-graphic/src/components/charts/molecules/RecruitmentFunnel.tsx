"use client";

import React from "react";
import { Icon } from "@iconify/react";

export interface FunnelStage {
  label: string;
  count: number;
  pct: number;
}

export interface RecruitmentFunnelProps {
  funnelStages: FunnelStage[];
}

export default function RecruitmentFunnel({ funnelStages }: RecruitmentFunnelProps) {
  return (
    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 space-y-5">
      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2 select-none">
        <Icon icon="solar:pie-chart-2-linear" className="w-4 h-4 text-amber-500" />
        Tunnel de recrutement
      </h3>

      <div className="space-y-4">
        {funnelStages.map((stage) => (
          <div key={stage.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs select-none">
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
            <div className="text-right text-[10px] font-medium text-slate-400 select-none">
              {stage.pct}% du total
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

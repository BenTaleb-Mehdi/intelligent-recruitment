"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import statsData from "@/data/stats.json";

export default function StatsCards() {
  const stats = statsData.stats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((item, index) => (
        <div 
          key={index} 
          className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800/80 shadow-sm flex flex-col justify-between min-h-[150px] transition-all hover:shadow-md hover:border-slate-200"
        >
          {/* Top Row: Icon + Title & Trend Badge */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Icon Container */}
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-semibold flex-shrink-0 ${item.iconBg}`}>
                <Icon icon={item.icon} className="w-5 h-5" />
              </div>
              {/* Title */}
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-tight">
                {item.title}
              </span>
            </div>
            {/* Trend Badge (prevent wrap and shrinking) */}
            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 whitespace-nowrap ${item.trendBg} ${item.trendColor} select-none`}>
              {item.trend}
            </div>
          </div>

          {/* Middle Row: Large Value */}
          <div className="mt-3 flex-1 flex items-center">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
              {item.value}
            </h3>
          </div>

          {/* Bottom Row: Action link */}
          <div className="mt-3 pt-1">
            <Link 
              href={item.href}
              className="text-xs font-semibold text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors inline-block hover:underline"
            >
              {item.linkText}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
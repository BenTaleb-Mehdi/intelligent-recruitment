"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { api, ApiRecruiter, RecruiterStats } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

interface StatCard {
  title: string;
  value: string;
  icon: string;
  iconBg: string;
  trend: string;
  trendBg: string;
  trendColor: string;
  linkText: string;
  href: string;
}

export default function StatsCards() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: session } = await authClient.getSession();
        if (!session?.user?.id) return;

        const { data: recruiters } = await api.get<{ data: ApiRecruiter[] }>("/api/recruiters");
        const recruiter = recruiters?.find((r) => r.userId === session.user.id);
        if (!recruiter) return;

        const { data } = await api.get<{ data: RecruiterStats }>(
          `/api/recruiters/${recruiter.id}/stats`
        );
        if (!data) return;

        setStats([
          {
            title: "Total Offres",
            value: String(data.totalJobOffers),
            icon: "solar:case-linear",
            iconBg: "bg-emerald-50/70 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400",
            trend: `↑ ${data.openJobs} ouvertes`,
            trendBg: "bg-emerald-50 dark:bg-emerald-950/25",
            trendColor: "text-emerald-600 dark:text-emerald-400",
            linkText: "Voir les offres",
            href: "/recruiter/jobs",
          },
          {
            title: "Candidatures Reçues",
            value: String(data.totalApplications),
            icon: "solar:users-group-two-rounded-linear",
            iconBg: "bg-amber-50/70 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400",
            trend: `↑ ${data.interviewCount} entretiens`,
            trendBg: "bg-blue-50 dark:bg-blue-950/25",
            trendColor: "text-blue-600 dark:text-blue-400",
            linkText: "Voir les candidats",
            href: "/recruiter/jobs",
          },
          {
            title: "Score Moyen IA",
            value: `${data.avgMatchScore}%`,
            icon: "solar:stars-linear",
            iconBg: "bg-purple-50/70 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400",
            trend: data.avgMatchScore >= 70 ? "↑ Élevé" : "→ Moyen",
            trendBg: data.avgMatchScore >= 70 ? "bg-emerald-50 dark:bg-emerald-950/25" : "bg-amber-50 dark:bg-amber-950/25",
            trendColor: data.avgMatchScore >= 70 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400",
            linkText: "Voir les profils",
            href: "/recruiter/jobs",
          },
          {
            title: "Offres Actives",
            value: String(data.openJobs),
            icon: "solar:clock-circle-linear",
            iconBg: "bg-blue-50/70 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400",
            trend: data.openJobs > 0 ? "↑ En cours" : "Aucune",
            trendBg: "bg-emerald-50 dark:bg-emerald-950/25",
            trendColor: "text-emerald-600 dark:text-emerald-400",
            linkText: "Voir le rapport",
            href: "/recruiter/dashboard",
          },
        ]);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm min-h-[150px] animate-pulse">
            <div className="h-4 bg-slate-100 rounded w-24 mb-4" />
            <div className="h-8 bg-slate-100 rounded w-16 mb-4" />
            <div className="h-3 bg-slate-100 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800/80 shadow-sm flex flex-col justify-between min-h-[150px] transition-all hover:shadow-md hover:border-slate-200"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-semibold flex-shrink-0 ${item.iconBg}`}>
                <Icon icon={item.icon} className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-tight">
                {item.title}
              </span>
            </div>
            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 whitespace-nowrap ${item.trendBg} ${item.trendColor} select-none`}>
              {item.trend}
            </div>
          </div>

          <div className="mt-3 flex-1 flex items-center">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
              {item.value}
            </h3>
          </div>

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

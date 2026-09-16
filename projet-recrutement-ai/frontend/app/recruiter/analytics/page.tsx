"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import ResponseTimeChart, { WeeklyDataItem } from "@/components/recruiter/ResponseTimeChart";
import RecruitmentFunnel, { FunnelStage } from "@/components/recruiter/RecruitmentFunnel";
import { api, ApiRecruiter } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

import Dropdown from "@/components/recruiter/Dropdown";

interface AnalyticsKPI {
  label: string;
  value: string;
  unit?: string;
  trend: string;
  trendType: "positive" | "info" | "negative";
  icon: string;
  iconBg: string;
}

interface JobOfferOption {
  id: string;
  title: string;
}

export default function AnalyticsPage() {
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const [jobOffers, setJobOffers] = useState<JobOfferOption[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState<string>("all");
  const [recruiterId, setRecruiterId] = useState<string>("default");

  const [kpis, setKpis] = useState<AnalyticsKPI[]>([
    {
      label: "Temps de réponse moyen",
      value: "1.8",
      unit: "jours",
      trend: "-14% vs mois dernier",
      trendType: "positive",
      icon: "solar:clock-circle-linear",
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      label: "Taux d'acceptation Top Match",
      value: "84.5",
      unit: "%",
      trend: "+6.8% vs mois dernier",
      trendType: "positive",
      icon: "solar:target-linear",
      iconBg: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Temps économisé (pré-screening)",
      value: "12.5",
      unit: "h/offre",
      trend: "Automatisé par l'IA",
      trendType: "info",
      icon: "solar:stopwatch-linear",
      iconBg: "bg-purple-100 text-purple-600",
    },
  ]);
  const [weeklyData, setWeeklyData] = useState<WeeklyDataItem[]>([
    { week: "S-1", value: 2.3 },
    { week: "S-2", value: 2.0 },
    { week: "S-3", value: 1.9 },
    { week: "S-4", value: 1.6 },
    { week: "S-5", value: 1.8 },
  ]);
  const [funnelStages, setFunnelStages] = useState<FunnelStage[]>([
    { label: "Profils identifiés (IA)", count: 24, pct: 100 },
    { label: "Quiz techniques réussis", count: 16, pct: 67 },
    { label: "Retenus pour entretien", count: 9, pct: 38 },
    { label: "Offres acceptées", count: 4, pct: 17 },
  ]);
  const [avgResponseDays, setAvgResponseDays] = useState<string | number>("1.8");
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize recruiter ID
  useEffect(() => {
    const initRecruiter = async () => {
      try {
        const { data: session } = await authClient.getSession();
        if (session?.user?.id) {
          const { data: recruiters } = await api.get<{ data: ApiRecruiter[] }>("/api/recruiters");
          const recruiter = recruiters?.find((r) => r.userId === session.user.id);
          if (recruiter) {
            setRecruiterId(recruiter.id);
          }
        }
      } catch (err) {
        console.error("Error identifying recruiter:", err);
      }
    };
    initRecruiter();
  }, []);

  // Fetch analytics when recruiterId or selectedOfferId changes
  const fetchAnalytics = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setLoading(true);

    try {
      const url =
        selectedOfferId && selectedOfferId !== "all"
          ? `/api/recruiters/${recruiterId}/analytics?jobOfferId=${selectedOfferId}`
          : `/api/recruiters/${recruiterId}/analytics`;

      const res = await api.get<{
        success: boolean;
        data: {
          kpis?: AnalyticsKPI[];
          weeklyData?: WeeklyDataItem[];
          funnelStages?: FunnelStage[];
          avgResponseDays?: number | string;
          jobOffers?: JobOfferOption[];
        };
      }>(url);

      if (res?.data) {
        if (res.data.kpis && res.data.kpis.length > 0) {
          setKpis(res.data.kpis);
        }
        if (res.data.weeklyData && res.data.weeklyData.length > 0) {
          setWeeklyData(res.data.weeklyData);
        }
        if (res.data.funnelStages && res.data.funnelStages.length > 0) {
          setFunnelStages(res.data.funnelStages);
        }
        if (res.data.avgResponseDays) {
          setAvgResponseDays(res.data.avgResponseDays);
        }
        if (res.data.jobOffers && Array.isArray(res.data.jobOffers)) {
          setJobOffers(res.data.jobOffers);
        }
      }
    } catch (error) {
      console.error("Error loading analytics data from database:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [recruiterId, selectedOfferId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const dropdownOptions = [
    { id: "all", label: `Toutes les offres (${jobOffers.length})` },
    ...jobOffers.map((j) => ({ id: j.id, label: j.title })),
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Analytiques</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Performance du recrutement, vitesse du pipeline et impact de l&apos;IA basés sur vos données réelles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Custom Styled Dropdown Component */}
          {jobOffers.length > 0 && (
            <div className="w-full sm:w-[240px] z-30">
              <Dropdown
                options={dropdownOptions}
                value={selectedOfferId}
                placeholder="Toutes les offres"
                onChange={(val) => {
                  if (val != null) {
                    setSelectedOfferId(String(val));
                  }
                }}
                ariaLabel="Filtrer par offre d'emploi"
                className="w-full"
              />
            </div>
          )}

          {/* Refresh button */}
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={isRefreshing}
            className="bg-white border border-slate-200/80 text-slate-700 hover:text-slate-900 hover:border-slate-300 text-xs font-semibold px-3 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 h-10"
            title="Actualiser les données"
          >
            <Icon
              icon="solar:refresh-linear"
              className={`w-4 h-4 text-slate-500 ${isRefreshing ? "animate-spin text-blue-600" : ""}`}
            />
            <span className="hidden sm:inline">Actualiser</span>
          </button>

          <div className="bg-blue-50 text-blue-700 border border-blue-100/80 text-xs font-bold px-3.5 py-2 rounded-xl shadow-2xs flex items-center gap-1.5 h-10">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Données en direct
          </div>
        </div>
      </div>

      {/* Section 1: Core Performance KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {kpis.map((kpi, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3 transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${kpi.iconBg}`}>
                <Icon icon={kpi.icon} className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {kpi.label}
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">
              {kpi.value}{" "}
              {kpi.unit ? (
                <span className="text-sm font-semibold text-slate-400">{kpi.unit}</span>
              ) : null}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit">
              <Icon icon="solar:graph-up-linear" className="w-3.5 h-3.5" />
              {kpi.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Section 2 + 3: Chart + Funnel side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <ResponseTimeChart
          weeklyData={weeklyData}
          hoveredWeek={hoveredWeek}
          setHoveredWeek={setHoveredWeek}
          avgResponseDays={avgResponseDays}
        />

        <RecruitmentFunnel funnelStages={funnelStages} />
      </div>
    </div>
  );
}

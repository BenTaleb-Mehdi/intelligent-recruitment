"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { Indicator } from "@/components/charts/atoms/Indicator";

interface NavbarCandidateProps {
  onToggleSidebar: () => void;
}

export default function NavbarCandidate({ onToggleSidebar }: NavbarCandidateProps) {
  const pathname = usePathname() || "";

  // Dynamic breadcrumb label mapping
  const getBreadcrumbLabel = () => {
    if (pathname.includes("/candidate/profile")) {
      return "Mon Profil & CV";
    }
    if (pathname.includes("/candidate/jobs")) {
      return "Feed d'offres";
    }
    if (pathname.includes("/candidate/applications")) {
      return "Candidatures";
    }
    if (pathname.includes("/candidate/quizzes")) {
      return "Assessments & Tests";
    }
    return "Dashboard";
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/60 flex items-center justify-between px-6 z-20 font-sans relative shrink-0">
      {/* Left side: Sidebar Toggle & Dynamic Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Toggle Button */}
        <button 
          onClick={onToggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100/70 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Icon icon="solar:sidebar-minimalistic-linear" className="w-5 h-5" />
        </button>

        {/* Separator Line */}
        <div className="w-[1px] h-4 bg-slate-200"></div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-slate-400 select-none">
          <Icon icon="solar:user-linear" className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300 font-light text-xs">/</span>
          <span className="text-slate-800 text-xs font-semibold tracking-wide">
            {getBreadcrumbLabel()}
          </span>
        </div>
      </div>

      {/* Right side: AI Matcher Sync Indicator */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-full text-xs font-semibold select-none border border-emerald-100/50 dark:border-emerald-900/50">
          <Indicator status="success" pulse={false} />
          AI Matcher Sync Active
        </div>
      </div>
    </header>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { Indicator } from "@/components/charts/atoms/Indicator";

interface NavbarCandidateProps {
  onToggleSidebar: () => void;
}

export default function NavbarCandidate({ onToggleSidebar }: NavbarCandidateProps) {
  const pathname = usePathname() || "";
  const [candidateName, setCandidateName] = useState("Mehdi Ben Taleb");
  const [avatarUrl, setAvatarUrl] = useState("/avatar-mehdi.png");

  // Load and listen to profile changes
  useEffect(() => {
    const loadProfile = () => {
      const stored = localStorage.getItem("candidate-profile");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name) setCandidateName(parsed.name);
          if (parsed.personalInfo?.avatarUrl) setAvatarUrl(parsed.personalInfo.avatarUrl);
          else if (parsed.avatarUrl) setAvatarUrl(parsed.avatarUrl);
        } catch (e) {
          console.error(e);
        }
      }
    };
    loadProfile();

    const handleProfileUpdate = () => {
      loadProfile();
    };

    window.addEventListener("candidate-profile-updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("candidate-profile-updated", handleProfileUpdate);
    };
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0] || "")
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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

      {/* Right side: AI Matcher Sync Indicator & User Info */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-full text-xs font-semibold select-none border border-emerald-100/50 dark:border-emerald-900/50">
          <Indicator status="success" pulse={false} />
          AI Matcher Sync Active
        </div>

        {/* Vertical Separator */}
        <div className="h-5 w-[1px] bg-slate-200"></div>

        {/* User Info */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full overflow-hidden bg-blue-100 border border-blue-200/80 flex items-center justify-center text-blue-750 font-bold text-[10px] select-none relative">
            <img 
              src={avatarUrl} 
              alt={candidateName} 
              className="w-full h-full object-cover absolute inset-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <span>{getInitials(candidateName)}</span>
          </div>
          <span className="text-xs font-medium text-slate-600 hidden sm:inline-block">
            {candidateName}
          </span>
        </div>
      </div>
    </header>
  );
}

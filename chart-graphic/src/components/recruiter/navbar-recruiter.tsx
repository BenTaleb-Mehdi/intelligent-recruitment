"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

interface NavbarRecruiterProps {
  onToggleSidebar: () => void;
}

export default function NavbarRecruiter({ onToggleSidebar }: NavbarRecruiterProps) {
  const pathname = usePathname() || "";

  // Dynamic breadcrumb name mapping based on path
  const getBreadcrumbLabel = () => {
    if (pathname.includes("/recruiter/jobs/create")) {
      return "Créer une Offre";
    }
    if (pathname.includes("/applicants")) {
      return "Candidats & Evaluation";
    }
    if (pathname.startsWith("/recruiter/jobs")) {
      return "Mes Offres";
    }
    if (pathname.includes("/recruiter/settings")) {
      return "Paramètres";
    }
    return "Dashboard";
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/60 flex items-center justify-between px-6 z-10 font-sans">
      {/* Left side: Sidebar Toggle & Dynamic Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Toggle Button (Visible on all viewports to toggle the sidebar collapse state) */}
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
          <Icon icon="solar:home-smile-linear" className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300 font-light text-xs">/</span>
          <span className="text-slate-800 text-xs font-semibold tracking-wide">
            {getBreadcrumbLabel()}
          </span>
        </div>
      </div>

      {/* Right side: Actions & User Info */}
      <div className="flex items-center space-x-4">
        {/* Notification Badge */}
        <button className="relative p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-50 transition-colors">
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
          <Icon icon="solar:bell-linear" className="w-5 h-5" />
        </button>

        {/* Vertical Separator */}
        <div className="h-5 w-[1px] bg-slate-200"></div>

        {/* User Info */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 font-semibold text-xs select-none">
            HR
          </div>
          <span className="text-xs font-medium text-slate-600 hidden sm:inline-block">
            Iksatech Corporate
          </span>
        </div>
      </div>
    </header>
  );
}
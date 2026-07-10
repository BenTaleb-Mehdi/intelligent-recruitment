"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { authClient } from "@/lib/auth-client";

interface SidebarRecruiterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SidebarRecruiter({ isOpen, onClose }: SidebarRecruiterProps) {
  const router = useRouter();
  const pathname = usePathname() || "";
  const [isJobsOpen, setIsJobsOpen] = useState(true);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  // Helper to determine if a link is active
  const isActive = (path: string) => pathname === path;
  const isJobsActive = pathname.startsWith("/recruiter/jobs");

  return (
    <aside 
      className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200/85 text-slate-800 h-screen font-sans transition-all duration-300 ease-in-out md:transition-all ${
        isOpen 
          ? "w-64 translate-x-0" 
          : "w-64 -translate-x-full md:w-16 md:translate-x-0"
      }`}
    >
      {/* Brand Logo Header */}
      <div className={`h-16 flex items-center border-b border-slate-200/50 bg-white px-4 ${
        isOpen ? "justify-between" : "justify-center"
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-extrabold text-sm shadow-sm select-none">
            SR
          </div>
          {isOpen && (
            <span className="font-semibold text-slate-900 text-sm tracking-tight">
              SmartRecruit IA
            </span>
          )}
        </div>
        
        {/* Close Button on Mobile (only shown when expanded on mobile screen) */}
        {isOpen && (
          <button 
            onClick={onClose}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-105 rounded-md transition-colors"
          >
            <Icon icon="solar:close-square-linear" className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation Area */}
      <nav className={`flex-1 overflow-y-auto mt-2 ${isOpen ? "p-3 space-y-1" : "p-2 space-y-3"}`}>
        
        {/* Dashboard Link */}
        <Link 
          href="/recruiter/dashboard" 
          onClick={() => {
            if (window.innerWidth < 768) onClose();
          }}
          className={`flex items-center transition-all duration-200 ${
            isOpen 
              ? "px-3 py-2 text-xs font-semibold rounded-lg gap-3" 
              : "w-10 h-10 justify-center mx-auto rounded-xl"
          } ${
            isActive("/recruiter/dashboard")
              ? "bg-slate-100 text-slate-900 shadow-sm"
              : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
          }`}
          title={!isOpen ? "Dashboard" : undefined}
        >
          <Icon 
            icon="solar:home-smile-angle-linear" 
            className="w-5 h-5 flex-shrink-0" 
          />
          {isOpen && <span className="truncate">Dashboard</span>}
        </Link>

        {/* Analytics Link */}
        <Link 
          href="/recruiter/analytics" 
          onClick={() => {
            if (window.innerWidth < 768) onClose();
          }}
          className={`flex items-center transition-all duration-200 ${
            isOpen 
              ? "px-3 py-2 text-xs font-semibold rounded-lg gap-3" 
              : "w-10 h-10 justify-center mx-auto rounded-xl"
          } ${
            isActive("/recruiter/analytics")
              ? "bg-slate-100 text-slate-900 shadow-sm"
              : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
          }`}
          title={!isOpen ? "Analytiques" : undefined}
        >
          <Icon 
            icon="solar:chart-2-linear" 
            className="w-5 h-5 flex-shrink-0" 
          />
          {isOpen && <span className="truncate">Analytiques</span>}
        </Link>

        {/* Jobs Accordion Link / Collapsed Button */}
        {isOpen ? (
          <div>
            <button
              onClick={() => setIsJobsOpen(!isJobsOpen)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                isJobsActive
                  ? "text-slate-900 font-semibold"
                  : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon 
                  icon="solar:letter-opened-linear" 
                  className="w-5 h-5 flex-shrink-0" 
                />
                <span>Offres d'emploi</span>
              </div>
              <Icon 
                icon="solar:alt-arrow-down-linear" 
                className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-400 ${isJobsOpen ? "rotate-180" : ""}`} 
              />
            </button>

            {/* Sub-navigation Links */}
            {isJobsOpen && (
              <div className="mt-1 ml-4 pl-3 border-l border-slate-200 space-y-1">
                <Link
                  href="/recruiter/jobs"
                  onClick={() => {
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={`block px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                    isActive("/recruiter/jobs")
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-500 hover:bg-slate-100/70 hover:text-slate-850"
                  }`}
                >
                  Mes Offres
                </Link>
                <Link
                  href="/recruiter/jobs/create"
                  onClick={() => {
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={`block px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                    isActive("/recruiter/jobs/create")
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-500 hover:bg-slate-100/70 hover:text-slate-850"
                  }`}
                >
                  Créer une Offre
                </Link>
               
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/recruiter/jobs"
            onClick={() => {
              if (window.innerWidth < 768) onClose();
            }}
            className={`flex items-center transition-all duration-200 w-10 h-10 justify-center mx-auto rounded-xl ${
              isJobsActive
                ? "bg-slate-100 text-slate-900 shadow-sm"
                : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
            }`}
            title="Offres d'emploi"
          >
            <Icon icon="solar:letter-opened-linear" className="w-5 h-5 flex-shrink-0" />
          </Link>
        )}

        {/* Messages Link */}
        <Link 
          href="/recruiter/messages" 
          onClick={() => {
            if (window.innerWidth < 768) onClose();
          }}
          className={`flex items-center transition-all duration-200 ${
            isOpen 
              ? "px-3 py-2 text-xs font-semibold rounded-lg gap-3" 
              : "w-10 h-10 justify-center mx-auto rounded-xl"
          } ${
            isActive("/recruiter/messages")
              ? "bg-slate-100 text-slate-900 shadow-sm"
              : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
          }`}
          title={!isOpen ? "Messages" : undefined}
        >
          <Icon 
            icon="solar:chat-round-dots-linear" 
            className="w-5 h-5 flex-shrink-0" 
          />
          {isOpen && <span className="truncate">Messages</span>}
        </Link>

        {/* Candidates Matching (with "New" badge when open) */}
        <Link 
          href="/recruiter/jobs/1/applicants" 
          onClick={() => {
            if (window.innerWidth < 768) onClose();
          }}
          className={`flex items-center transition-all duration-200 ${
            isOpen 
              ? "px-3 py-2 text-xs font-semibold rounded-lg justify-between" 
              : "w-10 h-10 justify-center mx-auto rounded-xl relative"
          } ${
            isActive("/recruiter/jobs/1/applicants")
              ? "bg-slate-100 text-slate-900 shadow-sm"
              : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
          }`}
          title={!isOpen ? "Candidats" : undefined}
        >
          <div className="flex items-center gap-3">
            <Icon 
              icon="solar:users-group-two-rounded-linear" 
              className="w-5 h-5 flex-shrink-0" 
            />
            {isOpen && <span className="truncate">Candidats</span>}
          </div>
          {isOpen ? (
            <span className="px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-100 rounded-md select-none tracking-wide uppercase">
              New
            </span>
          ) : (
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
          )}
        </Link>

        {/* Settings Link */}
        <Link 
          href="/recruiter/settings" 
          onClick={() => {
            if (window.innerWidth < 768) onClose();
          }}
          className={`flex items-center transition-all duration-200 ${
            isOpen 
              ? "px-3 py-2 text-xs font-semibold rounded-lg justify-between" 
              : "w-10 h-10 justify-center mx-auto rounded-xl"
          } ${
            isActive("/recruiter/settings")
              ? "bg-slate-100 text-slate-900 shadow-sm"
              : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
          }`}
          title={!isOpen ? "Paramètres" : undefined}
        >
          <div className="flex items-center gap-3">
            <Icon 
              icon="solar:settings-linear" 
              className="w-5 h-5 flex-shrink-0" 
            />
            {isOpen && <span className="truncate">Paramètres</span>}
          </div>
          {isOpen && (
            <Icon icon="solar:alt-arrow-right-linear" className="w-3.5 h-3.5 text-slate-400" />
          )}
        </Link>
      </nav>

      {/* Footer Navigation Area (Help & Logout) */}
      <div className={`border-t border-slate-200/65 bg-white ${
        isOpen ? "p-3 space-y-1" : "p-2 space-y-3"
      }`}>
        <Link 
          href="/recruiter/help" 
          onClick={() => {
            if (window.innerWidth < 768) onClose();
          }}
          className={`flex items-center text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all duration-200 ${
            isOpen 
              ? "px-3 py-2 text-xs font-semibold rounded-lg gap-3" 
              : "w-10 h-10 justify-center mx-auto rounded-xl"
          }`}
          title={!isOpen ? "Aide & Information" : undefined}
        >
          <Icon icon="solar:question-circle-linear" className="w-5 h-5 flex-shrink-0 text-slate-500" />
          {isOpen && <span className="truncate">Aide & Information</span>}
        </Link>

        <button 
          onClick={handleLogout}
          className={`flex items-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 ${
            isOpen 
              ? "w-full px-3 py-2 text-xs font-semibold rounded-lg gap-3" 
              : "w-10 h-10 justify-center mx-auto rounded-xl"
          }`}
          title={!isOpen ? "Se déconnecter" : undefined}
        >
          <Icon icon="solar:logout-2-linear" className="w-5 h-5 flex-shrink-0 text-slate-400" />
          {isOpen && <span className="truncate">Se déconnecter</span>}
        </button>
      </div>
    </aside>
  );
}
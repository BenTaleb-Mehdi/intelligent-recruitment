"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

interface SidebarCandidateProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAVIGATION_ITEMS = [
  { href: "/candidate/dashboard", label: "Overview Dashboard", icon: "solar:home-smile-angle-linear" },
  { href: "/candidate/profile", label: "My Profile & CV", icon: "solar:user-linear" },
  { href: "/candidate/jobs", label: "Job Feed (AI)", icon: "solar:case-linear" },
  { href: "/candidate/applications", label: "Applications", icon: "solar:document-linear" },
  { href: "/candidate/quizzes", label: "Skills Assessments", icon: "solar:clipboard-list-linear" },
];

export default function SidebarCandidate({ isOpen, onClose }: SidebarCandidateProps) {
  const pathname = usePathname() || "";

  const isActive = (path: string) => pathname === path;

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
            <span className="font-semibold text-slate-900 text-sm tracking-tight select-none">
              Candidate Hub
            </span>
          )}
        </div>
        
        {/* Close Button on Mobile */}
        {isOpen && (
          <button 
            onClick={onClose}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
          >
            <Icon icon="solar:close-square-linear" className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation Area */}
      <nav className={`flex-1 overflow-y-auto mt-2 ${isOpen ? "p-3 space-y-1" : "p-2 space-y-3"}`}>
        {NAVIGATION_ITEMS.map((item) => (
          <Link 
            key={item.href}
            href={item.href}
            onClick={() => {
              if (window.innerWidth < 768) onClose();
            }}
            className={`flex items-center transition-all duration-200 ${
              isOpen 
                ? "px-3 py-2 text-xs font-semibold rounded-lg gap-3" 
                : "w-10 h-10 justify-center mx-auto rounded-xl"
            } ${
              isActive(item.href)
                ? "bg-slate-100 text-slate-900 shadow-sm"
                : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
            }`}
            title={!isOpen ? item.label : undefined}
          >
            <Icon 
              icon={item.icon} 
              className="w-5 h-5 flex-shrink-0" 
            />
            {isOpen && <span className="truncate">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer Navigation Area (Logout) */}
      <div className={`border-t border-slate-200/65 bg-white ${
        isOpen ? "p-3 space-y-1" : "p-2 space-y-3"
      }`}>
        <Link 
          href="/"
          className={`flex items-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 ${
            isOpen 
              ? "w-full px-3 py-2 text-xs font-semibold rounded-lg gap-3" 
              : "w-10 h-10 justify-center mx-auto rounded-xl"
          }`}
          title={!isOpen ? "Se déconnecter" : undefined}
        >
          <Icon icon="solar:logout-2-linear" className="w-5 h-5 flex-shrink-0 text-slate-400" />
          {isOpen && <span className="truncate">Se déconnecter</span>}
        </Link>
      </div>

    </aside>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { Indicator } from "@/components/charts/atoms/Indicator";

const NAVIGATION_ITEMS = [
  { href: "/candidate/dashboard", label: "Overview Dashboard", icon: "solar:widget-bold" },
  { href: "/candidate/profile", label: "My Profile & CV", icon: "solar:user-bold" },
  { href: "/candidate/jobs", label: "Job Feed (AI)", icon: "solar:case-bold" },
  { href: "/candidate/applications", label: "Applications", icon: "solar:document-bold" },
  { href: "/candidate/quizzes", label: "Skills Assessments", icon: "solar:clipboard-list-bold" },
];

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen bg-white text-default-900 overflow-hidden font-sans">
      {/* LEFT SIDEBAR */}
      <aside className="w-80 border-r border-slate-100 dark:border-slate-800 bg-white flex flex-col shrink-0">
        {/* Logo and Brand */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-accent text-white rounded-xl flex items-center justify-center shadow-md shadow-accent/20">
              <Icon icon="solar:user-bold" className="text-xl" />
            </div>
            <div>
              <h5 className="font-bold text-base tracking-tight">Candidate Hub</h5>
              <p className="text-[10px] text-default-400 font-semibold tracking-wider uppercase">Employability Suite</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 bg-slate-200/60 dark:bg-slate-800 rounded font-bold text-slate-600 dark:text-slate-350">
            Candidat
          </span>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "w-full flex items-center justify-between py-2 text-sm transition-all duration-150 rounded-r-lg rounded-l-none border-l-4 pr-3 pl-3.5",
                  isActive
                    ? "border-accent bg-accent/10 dark:bg-slate-800 text-accent font-bold shadow-sm"
                    : "border-transparent text-default-600 hover:text-default-900 hover:bg-default-100/50 dark:hover:bg-default-800/40 font-medium",
                ].join(" ")}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    icon={item.icon}
                    className={`text-lg ${isActive ? "text-accent" : "text-default-400"}`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.href === "/candidate/quizzes" && (
                  <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Candidate Profile Summary Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-blue-50/20 dark:bg-[#1a202c]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent text-sm font-extrabold select-none">
              MB
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-default-800 dark:text-default-200 truncate">Mehdi Ben Taleb</p>
              <p className="text-xs text-default-450 truncate">m.bentaleb@example.com</p>
            </div>
            <Link
              href="/"
              className="p-2 text-default-400 hover:text-default-650 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Logout"
            >
              <Icon icon="solar:logout-bold" className="text-base" />
            </Link>
          </div>
        </div>
      </aside>

      {/* RIGHT WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1e2530]/80 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-default-700 dark:text-default-300">Welcome Back, Mehdi!</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-success-soft/20 dark:bg-success-soft/10 text-success rounded-full text-xs font-semibold select-none">
              <Indicator status="success" pulse={false} />
              AI Matcher Sync Active
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

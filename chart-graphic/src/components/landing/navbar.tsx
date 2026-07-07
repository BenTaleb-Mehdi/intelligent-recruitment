"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

const navLinks = [
  { href: "/offres", label: "Offres", icon: "solar:case-linear" },
  { href: "/candidats", label: "Candidats", icon: "solar:users-group-two-rounded-linear" },
  { href: "/about", label: "À propos", icon: "solar:info-circle-linear" },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-blue-100/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 select-none">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <Icon icon="solar:stars-linear" className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-900 font-bold text-lg tracking-tight">
              Iksa<span className="text-blue-600">tech</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-500">
            <Link href="/offres" className="hover:text-blue-600 transition-colors">Offres</Link>
            <Link href="/candidats" className="hover:text-blue-600 transition-colors">Candidats</Link>
            <a href="#recruteurs" className="hover:text-blue-600 transition-colors">Recruteurs</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/recruiter/jobs"
              className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/recruiter/jobs"
              className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              Démarrer gratuitement →
            </Link>
          </div>

          <button
            className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-4">
              <span className={`absolute left-0 top-0 w-5 h-[2px] bg-current rounded-full transition-all duration-300 ${mobileOpen ? "top-1/2 -translate-y-1/2 rotate-45" : ""}`} />
              <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-5 h-[2px] bg-current rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 bottom-0 w-5 h-[2px] bg-current rounded-full transition-all duration-300 ${mobileOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-all duration-300 md:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-40 h-full w-[280px] bg-white shadow-2xl transition-all duration-300 ease-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-20 pb-6 px-6">
          <div className="flex-1 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon icon={link.icon} className="w-4 h-4 text-blue-600" />
                </span>
                {link.label}
              </Link>
            ))}

            <div className="my-4 border-t border-slate-100" />

            <a
              href="#recruteurs"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Icon icon="solar:buildings-linear" className="w-4 h-4 text-blue-600" />
              </span>
              Recruteurs
            </a>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <Link
              href="/recruiter/jobs"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 py-2.5 rounded-xl hover:bg-blue-50 transition-all"
            >
              <Icon icon="solar:login-linear" className="w-4 h-4" />
              Connexion
            </Link>
            <Link
              href="/recruiter/jobs"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 text-sm font-semibold bg-blue-600 text-white w-full py-3 rounded-xl hover:bg-blue-700 transition-all shadow-sm"
            >
              Démarrer gratuitement
              <Icon icon="solar:arrow-right-linear" className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

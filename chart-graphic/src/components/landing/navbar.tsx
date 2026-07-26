"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/charts/atoms/Button";

const navLinks = [
  { href: "/offres", label: "Offres", icon: "solar:case-linear" },
  { href: "/candidats", label: "Candidats", icon: "solar:users-group-two-rounded-linear" },
  { href: "/about", label: "À propos", icon: "solar:info-circle-linear" },
  { href: "/contact", label: "Contact", icon: "solar:letter-linear" },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/75 backdrop-blur-lg border-b border-slate-200/40 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 select-none group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <Icon icon="solar:stars-linear" className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="text-slate-900 font-extrabold text-xl tracking-tight">
              Iksa<span className="text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">tech</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-slate-600">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 hover:text-blue-600 transition-colors duration-250 rounded-lg"
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <span className="relative z-10">{link.label}</span>
                {hoveredLink === link.href && (
                  <motion.span
                    layoutId="navHover"
                    className="absolute inset-0 bg-blue-50/70 rounded-lg -z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            <Link
              href="/recruteurs"
              className="relative px-4 py-2 hover:text-blue-600 transition-colors duration-250 rounded-lg"
              onMouseEnter={() => setHoveredLink("recruteurs")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <span className="relative z-10">Recruteurs</span>
              {hoveredLink === "recruteurs" && (
                <motion.span
                  layoutId="navHover"
                  className="absolute inset-0 bg-blue-50/70 rounded-lg -z-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/recruiter/jobs">
              <Button
                variant="ghost"
                className="text-slate-600 hover:text-blue-600 font-bold text-sm h-10 px-4"
              >
                Connexion
              </Button>
            </Link>
            <Link href="/recruiter/jobs">
              <Button
                variant="primary"
                className="bg-blue-600 text-white hover:bg-blue-700 font-bold text-sm shadow-md shadow-blue-600/10 hover:shadow-lg hover:shadow-blue-600/20 rounded-xl h-10 px-5 transition-all duration-300"
                endIcon="solar:arrow-right-linear"
              >
                Démarrer gratuitement
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburguer */}
          <button
            className="md:hidden relative z-50 w-11 h-11 flex items-center justify-center rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all border border-transparent hover:border-slate-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-4">
              <span
                className={`absolute left-0 top-0 w-5 h-[2px] bg-current rounded-full transition-all duration-300 ${
                  mobileOpen ? "top-1/2 -translate-y-1/2 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-5 h-[2px] bg-current rounded-full transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 bottom-0 w-5 h-[2px] bg-current rounded-full transition-all duration-300 ${
                  mobileOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Backdrop & Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 z-40 h-full w-[290px] bg-white border-r border-slate-100 shadow-2xl md:hidden flex flex-col pt-24 pb-6 px-6"
            >
              <div className="flex-1 space-y-1.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200"
                  >
                    <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Icon icon={link.icon} className="w-4.5 h-4.5 text-blue-600" />
                    </span>
                    {link.label}
                  </Link>
                ))}

                <div className="my-5 border-t border-slate-100/80" />

                <Link
                  href="/recruteurs"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200"
                >
                  <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Icon icon="solar:buildings-linear" className="w-4.5 h-4.5 text-blue-600" />
                  </span>
                  Recruteurs
                </Link>
              </div>

              <div className="space-y-3 pt-5 border-t border-slate-100">
                <Link href="/recruiter/jobs" onClick={() => setMobileOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 py-3 rounded-xl hover:bg-blue-50/50 transition-all h-11"
                    startIcon="solar:login-linear"
                  >
                    Connexion
                  </Button>
                </Link>
                <Link href="/recruiter/jobs" onClick={() => setMobileOpen(false)}>
                  <Button
                    variant="primary"
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold py-3 rounded-xl shadow-md transition-all h-11"
                    endIcon="solar:arrow-right-linear"
                  >
                    Démarrer gratuitement
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

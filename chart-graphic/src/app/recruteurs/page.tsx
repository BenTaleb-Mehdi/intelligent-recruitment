"use client";

import React from "react";
import type { Metadata } from "next";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Link from "next/link";
import LandingNavbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import { Button } from "@/components/charts/atoms/Button";

const benefits = [
  {
    icon: "solar:flash-bold-duotone",
    title: "Vitesse Incroyable",
    desc: "Vos offres sont diffusées instantanément et les candidats qualifiés sont triés en moins de 24h.",
  },
  {
    icon: "solar:magic-stick-3-bold-duotone",
    title: "Filtrage Intelligent",
    desc: "Notre IA classe les candidats selon leur score de matching basé sur leur historique technique.",
  },
  {
    icon: "solar:checklist-minimalistic-bold-duotone",
    title: "Quiz Techniques Auto",
    desc: "Validez les compétences avec des quiz personnalisés envoyés automatiquement aux profils retenus.",
  },
  {
    icon: "solar:chart-square-bold-duotone",
    title: "Suivi Centralisé",
    desc: "Un tableau de bord épuré pour piloter vos candidatures, vos quiz et vos entretiens.",
  },
];

const pricing = [
  {
    name: "Gratuit",
    price: "0",
    desc: "Pour tester l'efficacité de notre matching IA.",
    features: [
      "1 Offre active",
      "Tri automatique IA",
      "Accès aux profils de base",
      "Support par email",
    ],
    buttonText: "Démarrer gratuitement",
    buttonHref: "/recruiter/jobs",
    popular: false,
    gradient: "from-slate-100 to-slate-200/50 text-slate-800 border-slate-200",
  },
  {
    name: "Pro",
    price: "1 490",
    desc: "Pour les startups et PME en pleine croissance.",
    features: [
      "5 Offres actives",
      "Tri IA avancé (scores détaillés)",
      "Quiz techniques automatisés",
      "Accès complet aux coordonnées",
      "Support prioritaire 24/7",
    ],
    buttonText: "Choisir le plan Pro",
    buttonHref: "/recruiter/jobs",
    popular: true,
    gradient: "from-blue-600 to-indigo-600 text-white border-blue-500 shadow-xl shadow-blue-500/20",
  },
  {
    name: "Enterprise",
    price: "Sur devis",
    desc: "Pour les grandes structures à forts volumes.",
    features: [
      "Offres illimitées",
      "Intégration API ATS / CRM",
      "Accompagnement RH dédié",
      "Quiz techniques sur-mesure",
      "Sourcing actif par nos équipes",
    ],
    buttonText: "Contacter le service commercial",
    buttonHref: "/contact",
    popular: false,
    gradient: "from-slate-900 via-slate-950 to-blue-950 text-white border-slate-800",
  },
];

export default function RecruteursPage() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    },
  };

  return (
    <main className="min-h-screen bg-[#fafbfc] font-sans">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-50/50 blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-indigo-50/40 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider"
          >
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping" />
            Espace Recruteurs
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight"
          >
            Recrutez les meilleurs{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Talents Tech
            </span>{" "}
            au Maroc
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto font-semibold leading-relaxed"
          >
            Notre IA qualifie, teste et classe automatiquement les développeurs et profils IT
            pour vous aider à recruter les profils optimaux en un temps record.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-3 pt-2"
          >
            <Link href="/recruiter/jobs">
              <Button
                variant="primary"
                className="bg-blue-600 text-white font-bold h-12 px-7 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-xl transition-all"
                endIcon="solar:arrow-right-linear"
              >
                Créer un compte entreprise
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 max-w-5xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-3">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest bg-blue-50 border border-blue-100 px-3.5 py-1 rounded-full">
            Avantages
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pourquoi choisir Iksatech ?
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((b) => (
            <motion.div
              key={b.title}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="bg-white border border-slate-200/60 rounded-2xl p-6 space-y-4 hover:shadow-lg hover:border-blue-200/50 transition-all duration-300 group cursor-default"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-slate-100 flex items-center justify-center shadow-sm">
                <Icon icon={b.icon} className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 group-hover:text-slate-900">
                  {b.title}
                </h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white border-y border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-blue-50/30 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-3">
            <span className="text-blue-600 text-xs font-bold uppercase tracking-widest bg-blue-50 border border-blue-100 px-3.5 py-1 rounded-full">
              Tarifs
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Des tarifs simples et transparents
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto font-medium">
              Aucun frais caché. Choisissez l'offre qui convient à votre équipe de recrutement.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
          >
            {pricing.map((p) => (
              <motion.div
                key={p.name}
                variants={itemVariants}
                className={`bg-white rounded-3xl border p-8 flex flex-col gap-6 relative transition-all duration-300 ${
                  p.popular ? "border-blue-500 shadow-xl" : "border-slate-200/80 shadow-sm"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                    Recommandé
                  </span>
                )}

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-800">{p.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                      {p.price}
                    </span>
                    {p.price !== "Sur devis" && (
                      <span className="text-slate-400 text-xs font-bold">DH / mois</span>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="border-t border-slate-100 my-1" />

                <ul className="space-y-3.5 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold">
                      <Icon
                        icon="solar:check-circle-bold-duotone"
                        className={`w-4 h-4 shrink-0 ${p.popular ? "text-blue-500" : "text-emerald-500"}`}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href={p.buttonHref} className="block mt-4">
                  <Button
                    variant={p.popular ? "primary" : "outline"}
                    className={`w-full font-bold h-12 rounded-xl text-xs transition-all ${
                      p.popular
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    {p.buttonText}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

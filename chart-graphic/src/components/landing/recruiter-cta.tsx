"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Button } from "@/components/charts/atoms/Button";

const steps = [
  {
    icon: "solar:case-linear",
    title: "Publiez votre offre",
    desc: "Décrivez le poste en quelques minutes. Notre IA enrichit l'annonce automatiquement.",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    icon: "solar:magic-stick-3-linear",
    title: "L'IA pré-sélectionne",
    desc: "Notre moteur analyse les profils, score les candidats et écarte les non-pertinents.",
    color: "bg-indigo-50 text-indigo-600 border-indigo-100/50",
  },
  {
    icon: "solar:document-text-linear",
    title: "Quiz technique auto",
    desc: "Un test personnalisé est envoyé aux top matchs. Vous ne lisez que les résultats.",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
  },
  {
    icon: "solar:stars-linear",
    title: "Recrutez plus vite",
    desc: "Entretien uniquement avec les meilleurs profils. -70% de temps de recrutement.",
    color: "bg-sky-50 text-sky-600 border-sky-100/50",
  },
];

export default function RecruiterCTA() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
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
    <section id="recruteurs" className="py-28 bg-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-50/50 blur-3xl" />
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-50/50 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="inline-block bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider select-none shadow-sm">
            Pour les Recruteurs
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Recrutez 3× plus vite,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              sans effort
            </span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto font-medium">
            Iksatech automatise tout votre pipeline de recrutement — de la publication
            à la sélection finale — grâce à l'IA.
          </p>
        </div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="relative bg-slate-50/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 space-y-4 hover:shadow-lg hover:border-blue-200/50 hover:bg-white transition-all duration-300 group cursor-default"
            >
              {/* Step number */}
              <span className="absolute top-4 right-4 text-xs font-extrabold text-slate-350 select-none">
                0{i + 1}
              </span>
              
              {/* Step Icon */}
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${step.color} shadow-sm`}>
                <Icon icon={step.icon} className="w-5.5 h-5.5" />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 group-hover:text-slate-900">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Banner CTA block */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 p-10 sm:p-14 text-center text-white space-y-8 shadow-2xl border border-slate-800"
        >
          {/* Subtle glowing elements */}
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">
              Offre de lancement
            </p>
            <h3 className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight">
              Publiez votre première offre{" "}
              <span className="bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
                gratuitement
              </span>
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto font-medium leading-relaxed">
              Sans carte bancaire. Sans engagement. Commencez à recruter les meilleurs talents IT en 2 minutes.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/recruiter/jobs">
              <Button
                variant="primary"
                className="bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold h-12 px-7 rounded-xl shadow-lg shadow-blue-900/10 hover:shadow-xl transition-all w-full sm:w-auto"
                startIcon="solar:case-linear"
              >
                Accéder au dashboard
              </Button>
            </Link>
            <a href="#about" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 text-sm font-bold h-12 px-7 rounded-xl transition-all w-full sm:w-auto"
              >
                En savoir plus
              </Button>
            </a>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}

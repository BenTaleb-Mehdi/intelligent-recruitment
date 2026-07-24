"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import HeroIllustration from "@/components/landing/hero-illustration";
import { Button } from "@/components/charts/atoms/Button";

const trustLogos = [
  { name: "OCP", bg: "bg-blue-50 text-blue-700 border-blue-100" },
  { name: "Inwi", bg: "bg-sky-50 text-sky-700 border-sky-100" },
  { name: "CashPlus", bg: "bg-cyan-50 text-cyan-700 border-cyan-100" },
  { name: "Lydec", bg: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  { name: "Capgemini", bg: "bg-blue-50 text-blue-700 border-blue-100" },
];

export default function Hero() {
  const [email, setEmail] = useState("");

  // Framer Motion variant for staggering elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-start lg:justify-center overflow-hidden bg-[#fafbfc] pt-26 pb-16 lg:pt-28 lg:pb-24">
      {/* Background blobs for premium depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-100/50 to-indigo-100/30 opacity-70 blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-100/40 to-blue-100/30 opacity-60 blur-3xl" />
        <div className="absolute bottom-[-100px] left-1/3 w-[800px] h-[400px] rounded-full bg-gradient-to-r from-sky-100/30 to-blue-100/40 opacity-50 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        {/* Left Column - Text Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 space-y-8 text-center lg:text-left"
        >
          {/* AI Badge indicator */}
          <motion.div variants={itemVariants} className="inline-flex">
            <div className="inline-flex items-center gap-2 bg-white border border-blue-100 text-blue-700 text-xs font-bold px-4 py-2 rounded-full select-none shadow-sm shadow-blue-500/5 hover:border-blue-200 transition-all duration-300">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Powered by IA · Marché IT Maroc
            </div>
          </motion.div>

          {/* Heading and Description */}
          <div className="space-y-4">
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight"
            >
              Trouvez votre prochain{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                poste Tech
              </span>{" "}
              au Maroc
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-slate-500 max-w-xl leading-relaxed font-semibold mx-auto lg:mx-0"
            >
              Notre IA analyse votre profil et vous propose des offres qui vous
              correspondent vraiment — salaire compétitif, stack moderne,
              entreprises sérieuses.
            </motion.p>
          </div>

          {/* Registration Input Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex flex-col sm:flex-row gap-2.5 max-w-md lg:max-w-lg mx-auto lg:mx-0 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-md shadow-slate-100"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="flex-1 px-4 py-3 rounded-xl border border-transparent bg-slate-50/50 text-slate-800 text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-300 transition duration-300"
            />
            <Button
              type="submit"
              variant="primary"
              className="bg-blue-600 text-white font-bold rounded-xl h-11 px-6 shadow-md shadow-blue-500/10 hover:bg-blue-700 transition duration-300 hover:shadow-lg whitespace-nowrap"
              endIcon="solar:arrow-right-linear"
            >
              Commencer
            </Button>
          </motion.form>

          {/* Quick Metrics */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4 justify-center lg:justify-start text-xs text-slate-400 font-semibold"
          >
            {[
              { icon: "solar:users-group-two-rounded-linear", label: "+2 400 candidats actifs" },
              { icon: "solar:case-linear", label: "+180 offres publiées" },
              { icon: "solar:stars-linear", label: "Score IA moyen : 91%" },
            ].map((item) => (
              <span key={item.label} className="flex items-center gap-1.5 bg-slate-100/50 px-3 py-1.5 rounded-lg border border-slate-200/20">
                <Icon icon={item.icon} className="w-4 h-4 text-blue-500" />
                {item.label}
              </span>
            ))}
          </motion.div>

          {/* Trust logos */}
          <motion.div variants={itemVariants} className="pt-4 space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center lg:text-left">
              Entreprises partenaires
            </p>
            <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start">
              {trustLogos.map((logo) => (
                <span
                  key={logo.name}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold border border-slate-200/60 ${logo.bg} select-none shadow-sm hover:scale-105 hover:shadow-md transition-all duration-300 cursor-default`}
                >
                  {logo.name}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Illustration / Simulator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          className="lg:col-span-5 hidden lg:block"
        >
          <HeroIllustration />
        </motion.div>
      </div>

      {/* Bounce indicator down */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-400 animate-bounce cursor-pointer">
        <a href="#about" aria-label="Défiler vers le bas">
          <Icon icon="solar:alt-arrow-down-linear" className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
}

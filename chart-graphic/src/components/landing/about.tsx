"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const stats = [
  { icon: "solar:users-group-two-rounded-linear", value: "+2 400", label: "Candidats actifs", color: "from-blue-500 to-indigo-500", lightBg: "bg-blue-50/50" },
  { icon: "solar:case-linear", value: "+180", label: "Offres publiées", color: "from-indigo-500 to-sky-500", lightBg: "bg-indigo-50/50" },
  { icon: "solar:buildings-linear", value: "+50", label: "Partenaires", color: "from-sky-500 to-cyan-500", lightBg: "bg-sky-50/50" },
  { icon: "solar:stars-linear", value: "91%", label: "Score IA moyen", color: "from-emerald-500 to-teal-500", lightBg: "bg-emerald-50/50" },
];

export default function About() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15,
      },
    },
  };

  return (
    <section id="about" className="py-28 bg-white relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-blue-50/60 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-indigo-50/50 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
        >
          {/* Left Column: Text info */}
          <motion.div variants={itemVariants} className="lg:col-span-7 space-y-6">
            <span className="inline-block bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider select-none">
              Comment ça marche
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              L'IA au service du{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                recrutement Tech
              </span>{" "}
              au Maroc
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-medium">
              Iksatech est une plateforme marocaine qui connecte les talents tech
              aux meilleures entreprises du pays. Notre intelligence artificielle
              analyse en profondeur les profils et les offres pour garantir un
              matching optimal — plus besoin de passer des heures à chercher.
            </p>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-medium">
              Que vous soyez développeur, data scientist, DevOps ou designer,
              Iksatech vous trouve les opportunités qui correspondent vraiment à
              votre stack, votre expérience et vos aspirations.
            </p>
            
            <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
              <div className="flex -space-x-2.5">
                {["AB", "SE", "YT", "KO"].map((init, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-black shadow-sm"
                  >
                    {init}
                  </div>
                ))}
                <div className="w-9 h-9 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center text-blue-600 text-[10px] font-bold">
                  +2k
                </div>
              </div>
              <span className="text-xs text-slate-400 font-bold">
                Talents inscrits cette semaine
              </span>
            </div>
          </motion.div>

          {/* Right Column: Stats Grid */}
          <motion.div
            variants={containerVariants}
            className="lg:col-span-5 grid grid-cols-2 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-slate-50/50 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-5 text-center space-y-3 hover:shadow-lg hover:bg-white hover:border-blue-200/50 transition-all duration-300 relative group cursor-default"
              >
                {/* Glowing border effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

                <div className={`w-11 h-11 rounded-xl ${stat.lightBg} flex items-center justify-center mx-auto border border-slate-100`}>
                  <Icon icon={stat.icon} className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

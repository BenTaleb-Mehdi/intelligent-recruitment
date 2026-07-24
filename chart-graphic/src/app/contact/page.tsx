"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import LandingNavbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import { Button } from "@/components/charts/atoms/Button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    }, 1200);
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <main className="min-h-screen bg-[#fafbfc] font-sans flex flex-col">
      <LandingNavbar />

      <section className="flex-1 max-w-5xl mx-auto px-6 pt-36 pb-20 w-full flex flex-col justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch"
        >
          {/* Left Column: Contact details */}
          <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col justify-between space-y-10">
            <div className="space-y-4">
              <span className="inline-block bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Contact
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Une question ?{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Discutons-en
                </span>
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">
                Nos équipes commerciales et techniques sont à votre écoute pour vous accompagner
                dans votre recherche ou vos besoins en recrutement IT.
              </p>
            </div>

            {/* Coordinates list */}
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-slate-100 flex items-center justify-center shrink-0 text-blue-600">
                  <Icon icon="solar:letter-bold-duotone" className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">Email direct</h4>
                  <p className="text-xs font-bold text-slate-500 hover:text-blue-600 cursor-pointer">
                    contact@iksatech.ma
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-slate-100 flex items-center justify-center shrink-0 text-blue-600">
                  <Icon icon="solar:phone-bold-duotone" className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">Téléphone</h4>
                  <p className="text-xs font-bold text-slate-500 hover:text-blue-600 cursor-pointer">
                    +212 5 22 45 67 89
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-slate-100 flex items-center justify-center shrink-0 text-blue-600">
                  <Icon icon="solar:map-point-bold-duotone" className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">Bureaux Casablanca</h4>
                  <p className="text-xs font-semibold text-slate-400 leading-relaxed">
                    Anfa Place, Bd de la Corniche, Casablanca, Maroc
                  </p>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-bold border-t border-slate-200/50 pt-4">
              IKSATECH RECRUTEMENT IA &copy; 2026
            </div>
          </motion.div>

          {/* Right Column: Form Panel */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/60 shadow-lg p-6 sm:p-8 flex flex-col justify-between"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nom complet</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Votre nom"
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-blue-400 transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Adresse email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-blue-400 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sujet</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Sujet de votre message"
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-blue-400 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Comment pouvons-nous vous aider ?"
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-blue-400 transition resize-none"
                />
              </div>

              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2"
                  >
                    <Icon icon="solar:check-circle-bold-duotone" className="w-5 h-5 text-emerald-500" />
                    <span>Votre message a été envoyé avec succès ! Notre équipe vous répondra sous 24h.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={loading}
                  className="bg-blue-600 text-white font-bold h-12 px-8 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg transition duration-300 w-full sm:w-auto"
                >
                  Envoyer le message
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}

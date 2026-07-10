"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
// ✅ Correct HeroUI imports
import { Select, ListBox, Label } from "@heroui/react";

type Tab = "profile" | "ai" | "security";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "profile", label: "Profil entreprise", icon: "solar:building-linear" },
  { id: "ai", label: "Configuration IA", icon: "solar:magic-stick-3-linear" },
  { id: "security", label: "Sécurité", icon: "solar:shield-check-linear" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [threshold, setThreshold] = useState(70);
  const [skillWeight, setSkillWeight] = useState(60);

  // Reusable Select item styles to keep the code clean
  const selectItemClasses = {
    base: "px-3 py-2 rounded-lg data-[hover=true]:bg-slate-100/80 cursor-pointer text-xs font-medium text-slate-600 data-[selected=true]:bg-slate-50 data-[selected=true]:text-blue-600 outline-none select-none",
    title: "flex justify-between items-center w-full",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Paramètres</h2>
        <p className="text-sm text-slate-500 mt-1">
          Gérez l&apos;identité de votre entreprise et les préférences IA.
        </p>
      </div>

      {/* Section 1: Tabs Navigation */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl sticky top-0 z-10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all flex-1 justify-center whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Icon icon={tab.icon} className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Section 2: Company Profile */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Icon icon="solar:building-linear" className="w-4 h-4 text-blue-500" />
            Identité visuelle & Profil
          </h3>

          {/* Logo Uploader */}
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center gap-3 hover:border-blue-300 transition-colors cursor-pointer">
            <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center">
              <Icon icon="solar:upload-linear" className="w-6 h-6 text-slate-400" />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-700">Déposez votre logo ici</p>
              <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, SVG max 2 Mo</p>
            </div>
          </div>

          {/* Corporate Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nom de l&apos;entreprise *</label>
              <input
                type="text"
                placeholder="SmartRecruit IA"
                defaultValue="SmartRecruit IA"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Site web</label>
              <input
                type="url"
                placeholder="https://smartrecruit.ma"
                defaultValue="https://smartrecruit.ma"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
              />
            </div>
            
            {/* Secteur d'activité Select */}
            <div className="space-y-1.5">
              <Select
                className="w-full"
                placeholder="Sélectionner un secteur"
              >
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Secteur d'activité
                </Label>
                <Select.Trigger className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 h-10 shadow-sm transition-colors cursor-pointer data-[focus=true]:outline-none data-[focus=true]:ring-1 data-[focus=true]:ring-blue-600">
                  <Select.Value className="text-slate-800" />
                </Select.Trigger>
                <Select.Popover className="border border-slate-200/80 shadow-lg rounded-xl bg-white p-1 z-30 min-w-[220px]">
                  <ListBox>
                    <ListBox.Item key="tech" textValue="Technologies" className={selectItemClasses.base}>Technologies</ListBox.Item>
                    <ListBox.Item key="finance" textValue="Finance" className={selectItemClasses.base}>Finance</ListBox.Item>
                    <ListBox.Item key="sante" textValue="Santé" className={selectItemClasses.base}>Santé</ListBox.Item>
                    <ListBox.Item key="education" textValue="Éducation" className={selectItemClasses.base}>Éducation</ListBox.Item>
                    <ListBox.Item key="autre" textValue="Autre" className={selectItemClasses.base}>Autre</ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
              <p className="text-[10px] text-slate-500 mt-1">Sélectionnez le secteur d'activité de votre entreprise</p>
            </div>

            {/* Taille de l'équipe Select */}
            <div className="space-y-1.5">
              <Select
                className="w-full"
                placeholder="Sélectionner la taille"
              >
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Taille de l'équipe
                </Label>
                <Select.Trigger className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 h-10 shadow-sm transition-colors cursor-pointer data-[focus=true]:outline-none data-[focus=true]:ring-1 data-[focus=true]:ring-blue-600">
                  <Select.Value className="text-slate-800" />
                </Select.Trigger>
                <Select.Popover className="border border-slate-200/80 shadow-lg rounded-xl bg-white p-1 z-30 min-w-[220px]">
                  <ListBox>
                    <ListBox.Item key="1-10" textValue="1-10" className={selectItemClasses.base}>1-10</ListBox.Item>
                    <ListBox.Item key="10-50" textValue="10-50" className={selectItemClasses.base}>10-50</ListBox.Item>
                    <ListBox.Item key="50-200" textValue="50-200" className={selectItemClasses.base}>50-200</ListBox.Item>
                    <ListBox.Item key="200+" textValue="200+" className={selectItemClasses.base}>200+</ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
              <p className="text-[10px] text-slate-500 mt-1">Indiquez le nombre d'employés dans votre entreprise</p>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Siège social</label>
              <input
                type="text"
                placeholder="Casablanca, Maroc"
                defaultValue="Casablanca, Maroc"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
              />
            </div>
          </div>

          {/* Presentation Bio */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description de l&apos;entreprise</label>
            <textarea
              rows={4}
              placeholder="Décrivez votre culture, stack technique et vision..."
              defaultValue="SmartRecruit IA est une plateforme de recrutement nouvelle génération qui utilise l'intelligence artificielle pour automatiser le pré-screening, évaluer les compétences techniques et optimiser le matching candidat-poste."
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium resize-y"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3 px-6 rounded-xl shadow-sm transition-all active:scale-[0.98] select-none">
              <Icon icon="solar:diskette-linear" className="w-4 h-4" />
              Enregistrer
            </button>
          </div>
        </div>
      )}

      {/* Section 3: AI Configuration */}
      {activeTab === "ai" && (
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 sm:p-8 space-y-8">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Icon icon="solar:magic-stick-3-linear" className="w-4 h-4 text-purple-500" />
            Préférences de recrutement intelligent
          </h3>

          {/* Threshold Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Seuil de compatibilité IA</label>
              <span className="text-sm font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-lg">{threshold}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-purple-600"
            />
            <p className="text-[10px] text-slate-400">
              Les candidats en dessous de ce seuil sont automatiquement masqués du tableau de bord principal.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-between py-4 border-t border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-700">Envoi automatique des quiz</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Envoyer automatiquement les quiz techniques aux candidats dont le score CV dépasse 80%.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all" />
            </label>
          </div>

          {/* Criterion Weights */}
          <div className="space-y-4 border-t border-slate-100 pt-6">
            <p className="text-xs font-bold text-slate-700">Pondération des critères</p>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Compétences techniques</span>
                  <span className="text-xs font-bold text-blue-600">{skillWeight}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={skillWeight}
                  onChange={(e) => setSkillWeight(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Expérience professionnelle</span>
                  <span className="text-xs font-bold text-emerald-600">{100 - skillWeight}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={100 - skillWeight}
                  onChange={(e) => setSkillWeight(100 - Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-3 px-6 rounded-xl shadow-sm transition-all active:scale-[0.98] select-none">
              <Icon icon="solar:diskette-linear" className="w-4 h-4" />
              Enregistrer
            </button>
          </div>
        </div>
      )}

      {/* Section 4: Security */}
      {activeTab === "security" && (
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Icon icon="solar:shield-check-linear" className="w-4 h-4 text-rose-500" />
            Sécurité du compte
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email actuel</label>
              <input
                type="email"
                defaultValue="contact@smartrecruit.ma"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nouveau mot de passe</label>
                <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Confirmer le mot de passe</label>
                <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs py-3 px-6 rounded-xl shadow-sm transition-all active:scale-[0.98] select-none">
              <Icon icon="solar:diskette-linear" className="w-4 h-4" />
              Mettre à jour
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
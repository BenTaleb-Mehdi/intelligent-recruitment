"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { api, ApiRecruiter } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import CustomSelect from "@/components/recruiter/custom-select";

type Tab = "profile" | "ai" | "security";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "profile", label: "Profil entreprise", icon: "solar:building-linear" },
  { id: "ai", label: "Configuration IA", icon: "solar:magic-stick-3-linear" },
  { id: "security", label: "Sécurité", icon: "solar:shield-check-linear" },
];

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [threshold, setThreshold] = useState(70);
  const [skillWeight, setSkillWeight] = useState(60);

  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [recruiterId, setRecruiterId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchRecruiter = async () => {
      try {
        const { data: session } = await authClient.getSession();
        if (!session?.user?.id) return;

        const { data: recruiters } = await api.get<{ data: ApiRecruiter[] }>("/api/recruiters");
        const recruiter = recruiters?.find((r) => r.userId === session.user.id);
        if (!recruiter) return;

        setRecruiterId(recruiter.id);
        setCompanyName(recruiter.companyName || "");
        setWebsite(recruiter.website || "");
        setIndustry(recruiter.industry || "");
        setTeamSize(recruiter.teamSize || "");
        setHeadquarters(recruiter.headquarters || "");
        setDescription(recruiter.description || "");
        setLogo(recruiter.logo || null);
      } catch (error) {
        console.error("Error fetching recruiter:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiter();
  }, []);

  const handleSave = async () => {
    if (!recruiterId) return;
    setIsSaving(true);
    try {
      await api.put(`/api/recruiters/${recruiterId}`, {
        companyName,
        website,
        industry,
        teamSize,
        headquarters,
        description,
        logo,
      });
      window.dispatchEvent(new Event("recruiter-updated"));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error updating recruiter:", error);
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Le fichier ne doit pas dépasser 2 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 font-sans">
        <div className="space-y-2">
          <div className="h-8 bg-slate-100 rounded w-48 animate-pulse" />
          <div className="h-4 bg-slate-100 rounded w-64 animate-pulse" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="h-6 bg-slate-100 rounded w-48 animate-pulse" />
          <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <div className="h-4 bg-slate-100 rounded w-24 animate-pulse" />
              <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-100 rounded w-24 animate-pulse" />
              <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans relative">
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in select-none">
          <Icon icon="solar:check-circle-bold" className="w-5 h-5 flex-shrink-0" />
          <div className="text-xs font-semibold">Profil mis à jour avec succès !</div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Paramètres</h2>
        <p className="text-sm text-slate-500 mt-1">
          Gérez l&apos;identité de votre entreprise et les préférences IA.
        </p>
      </div>

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

      {activeTab === "profile" && (
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Icon icon="solar:building-linear" className="w-4 h-4 text-blue-500" />
            Identité visuelle & Profil
          </h3>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            onChange={handleLogoUpload}
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center gap-3 hover:border-blue-300 transition-colors cursor-pointer"
          >
            {logo ? (
              <img src={logo} alt="Logo" className="w-14 h-14 rounded-xl object-cover" />
            ) : (
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center">
                <Icon icon="solar:upload-linear" className="w-6 h-6 text-slate-400" />
              </div>
            )}
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-700">
                {logo ? "Changer le logo" : "Déposez votre logo ici"}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, SVG max 2 Mo</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nom de l&apos;entreprise *</label>
              <input
                type="text"
                placeholder="SmartRecruit IA"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Site web</label>
              <input
                type="url"
                placeholder="https://smartrecruit.ma"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <CustomSelect
                label="Secteur d'activité"
                placeholder="Sélectionner un secteur..."
                value={industry}
                onChange={setIndustry}
                options={["Technologies", "Finance", "Santé", "Éducation", "Autre"]}
              />
              <p className="text-[10px] text-slate-500 mt-1">Sélectionnez le secteur d'activité de votre entreprise</p>
            </div>

            <div className="space-y-1.5">
              <CustomSelect
                label="Taille de l'équipe"
                placeholder="Sélectionner la taille..."
                value={teamSize}
                onChange={setTeamSize}
                options={["1-10", "10-50", "50-200", "200+"]}
              />
              <p className="text-[10px] text-slate-500 mt-1">Indiquez le nombre d'employés dans votre entreprise</p>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Siège social</label>
              <input
                type="text"
                placeholder="Casablanca, Maroc"
                value={headquarters}
                onChange={(e) => setHeadquarters(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description de l&apos;entreprise</label>
            <textarea
              rows={4}
              placeholder="Décrivez votre culture, stack technique et vision..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium resize-y"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <Link
                href="/recruiter/settings/dropdowns"
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-3 px-5 rounded-xl transition-all select-none"
              >
                <Icon icon="solar:list-check-linear" className="w-4 h-4" />
                Gérer les listes déroulantes
              </Link>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3 px-6 rounded-xl shadow-sm transition-all active:scale-[0.98] select-none disabled:opacity-75 disabled:cursor-not-allowed min-w-[120px]"
              >
                {isSaving ? (
                  <>
                    <Icon icon="solar:restart-bold" className="w-4 h-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Icon icon="solar:diskette-linear" className="w-4 h-4" />
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "ai" && (
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 sm:p-8 space-y-8">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Icon icon="solar:magic-stick-3-linear" className="w-4 h-4 text-purple-500" />
            Préférences de recrutement intelligent
          </h3>

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

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { api, ApiRecruiter } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import CustomSelect from "@/components/recruiter/custom-select";
import { useAlert } from "@/contexts/AlertContext";

import Dropdown, { DropdownOption } from "@/components/recruiter/Dropdown";

type Tab = "profile" | "ai" | "security";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "profile", label: "Profil entreprise", icon: "solar:building-linear" },
  { id: "ai", label: "Préférences de recrutement intelligent", icon: "solar:magic-stick-3-linear" },
  { id: "security", label: "Sécurité", icon: "solar:shield-check-linear" },
];

const RIGOR_OPTIONS: DropdownOption[] = [
  { id: "lenient", label: "Tolérant (Détection de potentiels & profils atypiques)" },
  { id: "balanced", label: "Équilibré (Standard recommandé)" },
  { id: "strict", label: "Strict (Exigence maximale sur les compétences clés)" },
];

const DEADLINE_OPTIONS: DropdownOption[] = [
  { id: "24", label: "24 heures (1 jour)" },
  { id: "48", label: "48 heures (2 jours - Recommandé)" },
  { id: "72", label: "72 heures (3 jours)" },
  { id: "168", label: "7 jours (1 semaine)" },
];

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // AI & Smart Recruitment Preferences states
  const [threshold, setThreshold] = useState(75);
  const [autoSendQuiz, setAutoSendQuiz] = useState(true);
  const [quizTriggerThreshold, setQuizTriggerThreshold] = useState(80);
  const [quizDeadlineHours, setQuizDeadlineHours] = useState("48");
  const [skillWeight, setSkillWeight] = useState(50);
  const [experienceWeight, setExperienceWeight] = useState(30);
  const [educationWeight, setEducationWeight] = useState(20);
  const [aiRigorLevel, setAiRigorLevel] = useState("balanced");
  const [notifyTopMatch, setNotifyTopMatch] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [autoRejectLowScore, setAutoRejectLowScore] = useState(false);
  const [autoRejectThreshold, setAutoRejectThreshold] = useState(40);
  const [isSavingAi, setIsSavingAi] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [iceNumber, setIceNumber] = useState("");
  const [rcNumber, setRcNumber] = useState("");
  const [originalIceNumber, setOriginalIceNumber] = useState("");
  const [originalRcNumber, setOriginalRcNumber] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<"UNVERIFIED" | "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED">("UNVERIFIED");
  const [isVerifying, setIsVerifying] = useState(false);
  const [recruiterId, setRecruiterId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { showAlert } = useAlert();

  // Security tab states
  const [currentPassword, setCurrentPassword] = useState("");
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingSecurity, setIsUpdatingSecurity] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState(false);
  const [securityError, setSecurityError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecruiter = async () => {
      try {
        const { data: session } = await authClient.getSession();
        if (!session?.user?.id) return;

        setEmail(session.user.email || "");
        setOriginalEmail(session.user.email || "");

        const { data: recruiters } = await api.get<{ data: ApiRecruiter[] }>("/api/recruiters");
        let recruiter = recruiters?.find((r) => r.userId === session.user.id);
        if (!recruiter && recruiters && recruiters.length > 0) {
          recruiter = recruiters[0];
        }

        if (recruiter) {
          setRecruiterId(recruiter.id);
          setCompanyName(recruiter.companyName || "");
          setWebsite(recruiter.website || "");
          setIndustry(recruiter.industry || "");
          setTeamSize(recruiter.teamSize || "");
          setHeadquarters(recruiter.headquarters || "");
          setDescription(recruiter.description || "");
          setLogo(recruiter.logo || null);
          setIceNumber(recruiter.iceNumber || "");
          setRcNumber(recruiter.rcNumber || "");
          setOriginalIceNumber(recruiter.iceNumber || "");
          setOriginalRcNumber(recruiter.rcNumber || "");
          setVerificationStatus(recruiter.verificationStatus || "UNVERIFIED");
        }
      } catch (error) {
        console.error("Error fetching recruiter:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiter();
  }, []);

  // Load AI Preferences
  useEffect(() => {
    try {
      const key = `smart_recruitment_preferences_${recruiterId || "default"}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.threshold !== undefined) setThreshold(parsed.threshold);
        if (parsed.autoSendQuiz !== undefined) setAutoSendQuiz(parsed.autoSendQuiz);
        if (parsed.quizTriggerThreshold !== undefined) setQuizTriggerThreshold(parsed.quizTriggerThreshold);
        if (parsed.quizDeadlineHours !== undefined) setQuizDeadlineHours(parsed.quizDeadlineHours);
        if (parsed.skillWeight !== undefined) setSkillWeight(parsed.skillWeight);
        if (parsed.experienceWeight !== undefined) setExperienceWeight(parsed.experienceWeight);
        if (parsed.educationWeight !== undefined) setEducationWeight(parsed.educationWeight);
        if (parsed.aiRigorLevel !== undefined) setAiRigorLevel(parsed.aiRigorLevel);
        if (parsed.notifyTopMatch !== undefined) setNotifyTopMatch(parsed.notifyTopMatch);
        if (parsed.weeklyDigest !== undefined) setWeeklyDigest(parsed.weeklyDigest);
        if (parsed.autoRejectLowScore !== undefined) setAutoRejectLowScore(parsed.autoRejectLowScore);
        if (parsed.autoRejectThreshold !== undefined) setAutoRejectThreshold(parsed.autoRejectThreshold);
      }
    } catch (err) {
      console.error("Error reading saved AI preferences:", err);
    }
  }, [recruiterId]);

  const handleSaveAiSettings = () => {
    setIsSavingAi(true);
    try {
      const prefs = {
        threshold,
        autoSendQuiz,
        quizTriggerThreshold,
        quizDeadlineHours,
        skillWeight,
        experienceWeight,
        educationWeight,
        aiRigorLevel,
        notifyTopMatch,
        weeklyDigest,
        autoRejectLowScore,
        autoRejectThreshold,
        updatedAt: new Date().toISOString(),
      };
      const key = `smart_recruitment_preferences_${recruiterId || "default"}`;
      localStorage.setItem(key, JSON.stringify(prefs));
      showAlert("success", "Vos préférences de recrutement intelligent ont été enregistrées avec succès !");
    } catch (err) {
      console.error("Error saving AI settings:", err);
      showAlert("danger", "Erreur lors de l'enregistrement des préférences.");
    } finally {
      setTimeout(() => setIsSavingAi(false), 300);
    }
  };

  const handleResetAiDefaults = () => {
    setThreshold(75);
    setAutoSendQuiz(true);
    setQuizTriggerThreshold(80);
    setQuizDeadlineHours("48");
    setSkillWeight(50);
    setExperienceWeight(30);
    setEducationWeight(20);
    setAiRigorLevel("balanced");
    setNotifyTopMatch(true);
    setWeeklyDigest(true);
    setAutoRejectLowScore(false);
    setAutoRejectThreshold(40);
    showAlert("info", "Préférences réinitialisées aux valeurs recommandées par défaut.");
  };

  const handleVerifyCompany = async () => {
    if (!companyName || (!iceNumber && !rcNumber)) {
      showAlert("warning", "Veuillez indiquer le nom de l'entreprise et au moins un identifiant (ICE ou RC).");
      return;
    }

    setIsVerifying(true);
    try {
      const res = await api.post<{
        success: boolean;
        isVerified: boolean;
        canCreateOffer: boolean;
        status: string;
        message: string;
        recruiter?: ApiRecruiter;
      }>("/api/recruiters/verify-company", {
        companyName,
        iceNumber,
        rcNumber,
      });

      if (res.isVerified) {
        setVerificationStatus("VERIFIED");
        showAlert("success", res.message || "Entreprise vérifiée avec succès sur Charika.ma ! Vous pouvez maintenant publier des offres d'emploi.");
      } else {
        setVerificationStatus("REJECTED");
        showAlert("danger", res.message || "Échec de la vérification : Numéro ICE ou RC introuvable sur Charika.ma.");
      }
    } catch (err: any) {
      setVerificationStatus("REJECTED");
      showAlert("danger", err?.message || "Échec de la vérification. Numéro ICE ou RC non valide sur Charika.ma.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: session } = await authClient.getSession();
      const userId = session?.user?.id;

      if (recruiterId) {
        const iceOrRcChanged = iceNumber !== originalIceNumber || rcNumber !== originalRcNumber;

        const res = await api.put<{ 
          success: boolean; 
          data: ApiRecruiter; 
          verificationStatus?: "UNVERIFIED" | "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED"; 
          isVerified?: boolean; 
          message?: string 
        }>(`/api/recruiters/${recruiterId}`, {
          companyName,
          website,
          industry,
          teamSize,
          headquarters,
          description,
          logo,
          iceNumber,
          rcNumber,
        });

        const newStatus = res?.data?.verificationStatus || res?.verificationStatus;
        if (newStatus) {
          setVerificationStatus(newStatus);
        }

        // Update original ICE/RC after a successful save
        setOriginalIceNumber(iceNumber);
        setOriginalRcNumber(rcNumber);

        // Show verification feedback when ICE/RC changed or whenever backend ran verification
        let verificationAlertShown = false;
        if (iceOrRcChanged || newStatus === "VERIFIED" || newStatus === "REJECTED") {
          if (res?.isVerified || newStatus === "VERIFIED") {
            showAlert("success", res?.message || "Profil enregistré et entreprise vérifiée avec succès sur Charika.ma ! Vous pouvez publier des offres.");
            verificationAlertShown = true;
          } else if (newStatus === "REJECTED") {
            showAlert("danger", res?.message || "Profil enregistré, mais la vérification ICE / RC a échoué sur Charika.ma.");
            verificationAlertShown = true;
          }
        }

        if (!verificationAlertShown) {
          window.dispatchEvent(new Event("recruiter-updated"));
          showAlert("success", "Profil mis à jour avec succès !");
          return;
        }
      } else if (userId) {
        const res = await api.post<{ success: boolean; data: ApiRecruiter }>("/api/recruiters", {
          userId,
          companyName: companyName || "Mon Entreprise",
          website,
          industry,
          teamSize,
          headquarters,
          description,
          logo,
          iceNumber,
          rcNumber,
        });
        if (res?.data?.id) {
          setRecruiterId(res.data.id);
          if (res.data.verificationStatus) {
            setVerificationStatus(res.data.verificationStatus);
          }
        }
      } else {
        showAlert("warning", "Veuillez vous connecter pour enregistrer votre profil.");
        return;
      }

      window.dispatchEvent(new Event("recruiter-updated"));
      showAlert("success", "Profil mis à jour avec succès !");
    } catch (error) {
      console.error("Error updating recruiter:", error);
      showAlert("danger", "Erreur lors de la sauvegarde.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSecurityUpdate = async () => {
    setSecurityError(null);
    setSecuritySuccess(false);

    const isEmailChanged = email !== originalEmail;
    const isPasswordChanging = newPassword.length > 0;

    if (!isEmailChanged && !isPasswordChanging) {
      setSecurityError("Aucune modification détectée.");
      return;
    }

    if (!currentPassword) {
      setSecurityError("Le mot de passe actuel est requis pour modifier vos informations de sécurité.");
      return;
    }

    if (isPasswordChanging) {
      if (newPassword.length < 8) {
        setSecurityError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setSecurityError("Les nouveaux mots de passe ne correspondent pas.");
        return;
      }
    }

    setIsUpdatingSecurity(true);
    try {
      // 1. If email is changing
      if (isEmailChanged) {
        const { error } = await authClient.changeEmail({
          newEmail: email,
        });
        if (error) {
          throw new Error(error.message || "Erreur lors de la modification de l'email.");
        }
        setOriginalEmail(email);
      }

      // 2. If password is changing
      if (isPasswordChanging) {
        const { error } = await authClient.changePassword({
          currentPassword,
          newPassword,
        });
        if (error) {
          throw new Error(error.message || "Erreur lors de la modification du mot de passe. Veuillez vérifier votre mot de passe actuel.");
        }
        setNewPassword("");
        setConfirmPassword("");
      }

      setSecuritySuccess(true);
      setCurrentPassword("");
      setTimeout(() => setSecuritySuccess(false), 5000);
    } catch (err: any) {
      console.error("Security update error:", err);
      setSecurityError(err.message || "Une erreur est survenue lors de la mise à jour.");
    } finally {
      setIsUpdatingSecurity(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showAlert("warning", "Le fichier ne doit pas dépasser 2 Mo.");
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

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                N° ICE (Identifiant Commun de l&apos;Entreprise)
              </label>
              <input
                type="text"
                maxLength={15}
                placeholder="002847593000012"
                value={iceNumber}
                onChange={(e) => setIceNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
              />
              <p className="text-[10px] text-slate-400">15 chiffres (Identifiant juridique légal)</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                N° RC (Registre du Commerce)
              </label>
              <input
                type="text"
                placeholder="123456"
                value={rcNumber}
                onChange={(e) => setRcNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
              />
              <p className="text-[10px] text-slate-400">Numéro d&apos;immatriculation au Registre du Commerce</p>
            </div>
          </div>

          {/* Verification Status Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100/70 rounded-xl text-blue-700">
                  <Icon icon="solar:shield-check-bold" className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Vérification de l&apos;Entreprise (Charika.ma)</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Vérification officielle auprès du registre du commerce marocain.</p>
                </div>
              </div>
              <div>
                {verificationStatus === "VERIFIED" ? (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3.5 py-1.5 rounded-full">
                    <Icon icon="solar:check-circle-bold" className="w-4 h-4 text-emerald-600" />
                    Vérifiée (Publication autorisée)
                  </span>
                ) : verificationStatus === "REJECTED" ? (
                  <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 text-[11px] font-bold px-3.5 py-1.5 rounded-full">
                    <Icon icon="solar:close-circle-bold" className="w-4 h-4 text-rose-600" />
                    Vérification Rejetée
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-[11px] font-bold px-3.5 py-1.5 rounded-full">
                    <Icon icon="solar:info-circle-bold" className="w-4 h-4 text-amber-600" />
                    Non Vérifiée (Publication bloquée)
                  </span>
                )}
              </div>
            </div>


            <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
              <p className="text-[11px] text-slate-500">
                {verificationStatus === "VERIFIED"
                  ? "Votre entreprise est certifiée. Vous pouvez créer des offres d'emploi sans restriction."
                  : "Vous ne pouvez pas créer d'offre d'emploi avant d'avoir vérifié votre entreprise."}
              </p>
              <button
                type="button"
                onClick={handleVerifyCompany}
                disabled={isVerifying}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-75"
              >
                {isVerifying ? (
                  <>
                    <Icon icon="solar:restart-bold" className="w-4 h-4 animate-spin" />
                    Vérification Charika.ma...
                  </>
                ) : (
                  <>
                    <Icon icon="solar:shield-check-linear" className="w-4 h-4" />
                    {verificationStatus === "VERIFIED" ? "Re-vérifier l'ICE / RC" : "Vérifier l'entreprise (Charika.ma)"}
                  </>
                )}
              </button>
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
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-8 font-sans">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Icon icon="solar:magic-stick-3-linear" className="w-4 h-4" />
                </div>
                Préférences de recrutement intelligent
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configurez les algorithmes de matching IA, l&apos;automatisation des quiz et les seuils de présélection.
              </p>
            </div>
            <span className="self-start sm:self-center bg-purple-50 text-purple-700 border border-purple-100 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              Moteur IA Actif
            </span>
          </div>

          {/* AI Strategy Overview Card */}
          <div className="bg-gradient-to-r from-purple-50 via-indigo-50/50 to-blue-50 border border-purple-100 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
              <Icon icon="solar:info-circle-linear" className="w-4 h-4 text-purple-600" />
              Stratégie de matching actuelle
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-purple-100/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Seuil Top Match</span>
                <span className="text-sm font-extrabold text-purple-700">{threshold}%</span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-purple-100/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Poids Technique</span>
                <span className="text-sm font-extrabold text-blue-700">{skillWeight}%</span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-purple-100/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Envoi Quiz IA</span>
                <span className={`text-sm font-extrabold ${autoSendQuiz ? "text-emerald-700" : "text-slate-500"}`}>
                  {autoSendQuiz ? "Automatisé" : "Manuel"}
                </span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-purple-100/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Rigueur IA</span>
                <span className="text-sm font-extrabold text-indigo-700 capitalize">
                  {aiRigorLevel === "lenient" ? "Tolérant" : aiRigorLevel === "strict" ? "Strict" : "Équilibré"}
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Seuil de compatibilité IA */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  1. Seuil de compatibilité IA (Matching Minimal)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Score minimal pour qualifier un candidat comme &quot;Top Match&quot; dans votre pipeline.
                </p>
              </div>
              <span className="text-sm font-extrabold text-purple-700 bg-purple-100/80 px-3 py-1 rounded-xl">
                {threshold}%
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={95}
              step={5}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-400">
              <span>50% (Très ouvert)</span>
              <span>75% (Recommandé)</span>
              <span>95% (Très strict)</span>
            </div>
          </div>

          {/* Section 2: Niveau d'exigence et rigueur */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Modèle d&apos;analyse & rigueur IA
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Ajuste la sensibilité de l&apos;IA lors de l&apos;analyse sémantique du CV et des expériences.
              </p>
            </div>
            <div className="w-full max-w-xl">
              <Dropdown
                options={RIGOR_OPTIONS}
                value={aiRigorLevel}
                placeholder="Sélectionner la rigueur"
                onChange={(key) => {
                  if (key != null) setAiRigorLevel(String(key));
                }}
                ariaLabel="Rigueur du modèle IA"
              />
            </div>
          </div>

          {/* Section 3: Pondération multicritères */}
          <div className="space-y-5 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  3. Pondération des critères de matching
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Définissez l&apos;importance relative de chaque axe dans le calcul du score global (Total = 100%).
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                Total : {skillWeight + experienceWeight + educationWeight}%
              </span>
            </div>

            <div className="space-y-4">
              {/* Compétences techniques */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Compétences techniques & Hard Skills
                  </span>
                  <span className="font-bold text-blue-600">{skillWeight}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={80}
                  step={5}
                  value={skillWeight}
                  onChange={(e) => setSkillWeight(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Expérience professionnelle */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Expérience professionnelle & Projets
                  </span>
                  <span className="font-bold text-emerald-600">{experienceWeight}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={80}
                  step={5}
                  value={experienceWeight}
                  onChange={(e) => setExperienceWeight(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Formation & Diplômes */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Formation académique & Certifications
                  </span>
                  <span className="font-bold text-amber-600">{educationWeight}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={5}
                  value={educationWeight}
                  onChange={(e) => setEducationWeight(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Automatisation des Quiz Techniques */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                4. Automatisation des Quiz Techniques
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Accélérez le pré-screening en invitant automatiquement les meilleurs candidats à passer leur test.
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-800">Envoi automatique du test technique</p>
                <p className="text-[11px] text-slate-500">
                  Transmettre automatiquement l&apos;évaluation IA dès qu&apos;un candidat dépasse le seuil défini.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={autoSendQuiz}
                  onChange={(e) => setAutoSendQuiz(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </label>
            </div>

            {autoSendQuiz && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2 p-4 bg-white border border-slate-200/80 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">Seuil CV déclencheur</span>
                    <span className="text-xs font-extrabold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                      ≥ {quizTriggerThreshold}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={60}
                    max={90}
                    step={5}
                    value={quizTriggerThreshold}
                    onChange={(e) => setQuizTriggerThreshold(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-purple-600"
                  />
                  <p className="text-[10px] text-slate-400">
                    Seuls les candidats avec un score IA supérieur ou égal recevront le test.
                  </p>
                </div>

                <div className="space-y-2 p-4 bg-white border border-slate-200/80 rounded-xl">
                  <label className="text-xs font-bold text-slate-700 block">Délai limite pour passer le quiz</label>
                  <Dropdown
                    options={DEADLINE_OPTIONS}
                    value={quizDeadlineHours}
                    placeholder="Délai"
                    onChange={(key) => {
                      if (key != null) setQuizDeadlineHours(String(key));
                    }}
                    ariaLabel="Délai limite du quiz"
                  />
                  <p className="text-[10px] text-slate-400">
                    Temps accordé au candidat avant expiration du lien de test.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Notifications & Alertes Intelligentes */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                5. Alertes & Notifications IA
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Restez alerté en temps réel lors de l&apos;arrivée de profils à forte valeur ajoutée.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800">Alerte instantanée pour les Top Matchs (&gt; 85%)</p>
                  <p className="text-[11px] text-slate-500">
                    Recevoir une notification immédiate lorsqu&apos;un candidat exceptionnel postule.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={notifyTopMatch}
                    onChange={(e) => setNotifyTopMatch(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800">Digest analytique hebdomadaire</p>
                  <p className="text-[11px] text-slate-500">
                    Résumé de la performance du pipeline, temps de réponse et statistiques IA de la semaine.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={weeklyDigest}
                    onChange={(e) => setWeeklyDigest(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                </label>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetAiDefaults}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer select-none"
            >
              <Icon icon="solar:restart-linear" className="w-4 h-4 text-slate-500" />
              Rétablir les valeurs par défaut
            </button>

            <button
              type="button"
              onClick={handleSaveAiSettings}
              disabled={isSavingAi}
              className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-3 px-6 rounded-xl shadow-sm transition-all active:scale-[0.98] select-none disabled:opacity-75 cursor-pointer min-w-[150px]"
            >
              {isSavingAi ? (
                <>
                  <Icon icon="solar:restart-bold" className="w-4 h-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Icon icon="solar:diskette-linear" className="w-4 h-4" />
                  Enregistrer les préférences
                </>
              )}
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

          {securityError && (
            <div className="bg-rose-50 border border-rose-250/60 text-rose-700 text-xs px-4 py-3.5 rounded-xl flex items-center gap-2.5 select-none">
              <Icon icon="solar:danger-triangle-bold" className="w-5 h-5 flex-shrink-0 text-rose-600" />
              <span className="font-medium">{securityError}</span>
            </div>
          )}

          {securitySuccess && (
            <div className="bg-emerald-50 border border-emerald-250/60 text-emerald-700 text-xs px-4 py-3.5 rounded-xl flex items-center gap-2.5 select-none">
              <Icon icon="solar:check-circle-bold" className="w-5 h-5 flex-shrink-0 text-emerald-600" />
              <span className="font-medium">Vos informations de sécurité ont été mises à jour avec succès.</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Adresse email</label>
                <input
                  type="email"
                  placeholder="contact@smartrecruit.ma"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mot de passe actuel *</label>
                <input
                  type="password"
                  placeholder="Requis pour toute modification"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-slate-100 pt-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nouveau mot de passe</label>
                <input
                  type="password"
                  placeholder="Au moins 8 caractères"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  placeholder="Confirmez le nouveau mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={handleSecurityUpdate}
              disabled={isUpdatingSecurity}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs py-3 px-6 rounded-xl shadow-sm transition-all active:scale-[0.98] select-none disabled:opacity-75 disabled:cursor-not-allowed min-w-[120px]"
            >
              {isUpdatingSecurity ? (
                <>
                  <Icon icon="solar:restart-bold" className="w-4 h-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                <>
                  <Icon icon="solar:shield-check-linear" className="w-4 h-4" />
                  Mettre à jour
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

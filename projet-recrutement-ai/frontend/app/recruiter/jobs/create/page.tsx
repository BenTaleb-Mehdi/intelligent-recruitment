"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import SkillsTagInput from "@/components/recruiter/skills-tag-input";
import LocationSelector from "@/components/recruiter/location-selector";
import ContractTypeSelector from "@/components/recruiter/contract-type-selector";
import ExperienceSelector from "@/components/recruiter/experience-selector";
import { api, ApiRecruiter, ApiDropdownItem, DropdownType } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

const DEFAULT_CONTRACT_TYPES = [
  "CDI (Contrat à Durée Indéterminée)",
  "CDD (Contrat à Durée Déterminée)",
  "Stage / Alternance",
  "Freelance / Indépendant",
];

const DEFAULT_LOCATIONS = [
  "Casablanca, Maroc",
  "Rabat, Maroc",
  "Tanger, Maroc",
  "Marrakech, Maroc",
  "100% Télétravail (Remote)",
  "Hybride (Casablanca / Distanciel)",
];

const DEFAULT_EXPERIENCE_LEVELS = [
  "Débutant (Sans expérience)",
  "+1 à 2 ans d'expérience",
  "+3 à 5 ans d'expérience",
  "+5 ans d'expérience (Senior)",
];

export default function CreateJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [contractType, setContractType] = useState<string>("");
  const [locationType, setLocationType] = useState<string>("");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState<string>("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const [isPublishing, setIsPublishing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [recruiterId, setRecruiterId] = useState<string | null>(null);
  const [dropdownItems, setDropdownItems] = useState<ApiDropdownItem[]>([]);

  const refreshDropdownItems = useCallback(async (rid: string) => {
    try {
      const { data: items } = await api.get<{ data: ApiDropdownItem[] }>(
        `/api/dropdown-lists/${rid}`
      );
      if (items) setDropdownItems(items);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const fetchRecruiter = async () => {
      try {
        const { data: session } = await authClient.getSession();
        if (!session?.user?.id) return;

        const { data: recruiters } = await api.get<{ data: ApiRecruiter[] }>("/api/recruiters");
        const recruiter = recruiters?.find((r) => r.userId === session.user.id);
        if (!recruiter) return;

        setRecruiterId(recruiter.id);
        await refreshDropdownItems(recruiter.id);
      } catch (error) {
        console.error("Error fetching recruiter:", error);
      }
    };

    fetchRecruiter();
  }, [refreshDropdownItems]);

  const contractTypeItems = useMemo(() => {
    const db = dropdownItems
      .filter((i) => i.type === "CONTRACT_TYPE")
      .map((i) => ({ id: i.id, value: i.value }));
    return db.length > 0 ? db : DEFAULT_CONTRACT_TYPES.map((v) => ({ value: v }));
  }, [dropdownItems]);

  const locationItems = useMemo(() => {
    const db = dropdownItems
      .filter((i) => i.type === "LOCATION")
      .map((i) => ({ id: i.id, value: i.value }));
    return db.length > 0 ? db : DEFAULT_LOCATIONS.map((v) => ({ value: v }));
  }, [dropdownItems]);

  const experienceItems = useMemo(() => {
    const db = dropdownItems
      .filter((i) => i.type === "EXPERIENCE_LEVEL")
      .map((i) => ({ id: i.id, value: i.value }));
    return db.length > 0 ? db : DEFAULT_EXPERIENCE_LEVELS.map((v) => ({ value: v }));
  }, [dropdownItems]);

  const handleAddDropdown = async (type: DropdownType, value: string) => {
    if (!recruiterId) return;
    try {
      await api.post(`/api/dropdown-lists/${recruiterId}`, { type, value });
      await refreshDropdownItems(recruiterId);
    } catch (error) {
      console.error("Error adding dropdown item:", error);
    }
  };

  const handleUpdateDropdown = async (id: string, value: string) => {
    try {
      await api.put(`/api/dropdown-lists/${id}`, { value });
      if (recruiterId) await refreshDropdownItems(recruiterId);
    } catch (error) {
      console.error("Error updating dropdown item:", error);
    }
  };

  const handleDeleteDropdown = async (id: string) => {
    try {
      await api.delete(`/api/dropdown-lists/${id}`);
      if (recruiterId) await refreshDropdownItems(recruiterId);
    } catch (error) {
      console.error("Error deleting dropdown item:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !contractType || !locationType || !experience || !description || skills.length === 0) {
      alert("Veuillez remplir tous les champs obligatoires et ajouter au moins une compétence.");
      return;
    }

    setIsPublishing(true);

    try {
      const { data: session } = await authClient.getSession();
      if (!session?.user?.id) return;

      const { data: recruiters } = await api.get<{ data: ApiRecruiter[] }>("/api/recruiters");
      const recruiter = recruiters?.find((r) => r.userId === session.user.id);
      if (!recruiter) return;

      const experienceYearsMap: Record<string, number> = {
        "Débutant (Sans expérience)": 0,
        "+1 à 2 ans d'expérience": 1,
        "+3 à 5 ans d'expérience": 3,
        "+5 ans d'expérience (Senior)": 5,
      };

      await api.post("/api/job-offers", {
        recruiterId: recruiter.id,
        title,
        description,
        contractType,
        locationType,
        salary: salary || undefined,
        experienceYears: experienceYearsMap[experience] ?? 0,
        location: locationType,
        skills,
      });

      setShowToast(true);
      setTimeout(() => {
        router.push("/recruiter/jobs");
      }, 1500);
    } catch (error: any) {
      console.error("Error creating job offer:", error);
      alert(error?.message || "Erreur lors de la publication de l'offre.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans relative">
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in select-none">
          <Icon icon="solar:check-circle-bold" className="w-5 h-5 flex-shrink-0" />
          <div className="text-xs font-semibold">Offre publiée avec succès ! Redirection...</div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Link
          href="/recruiter/jobs"
          className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Icon icon="solar:alt-arrow-left-linear" className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Créer une nouvelle offre</h2>
          <p className="text-sm text-slate-500 mt-1">Publiez une offre d&apos;emploi. L&apos;IA générera automatiquement les tests d&apos;évaluation correspondants.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 sm:p-8 space-y-8">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
            1. Informations Générales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Titre de l&apos;offre *
              </label>
              <input
                type="text"
                placeholder="Ex: Développeur Fullstack React / Node.js"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
              />
            </div>

            <div className="space-y-1.5 flex flex-col justify-end">
              <ContractTypeSelector
                value={contractType}
                onChange={setContractType}
                items={contractTypeItems}
                onAdd={(v) => handleAddDropdown("CONTRACT_TYPE", v)}
                onUpdate={handleUpdateDropdown}
                onDelete={handleDeleteDropdown}
              />
            </div>

            <div className="space-y-1.5 flex flex-col justify-end">
              <LocationSelector
                value={locationType}
                onChange={setLocationType}
                items={locationItems}
                onAdd={(v) => handleAddDropdown("LOCATION", v)}
                onUpdate={handleUpdateDropdown}
                onDelete={handleDeleteDropdown}
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Salaire proposé (Optionnel)
              </label>
              <input
                type="text"
                placeholder="Ex: 12 000 - 15 000 DH/mois, Négociable..."
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
            2. Description de l&apos;emploi & Exigences
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 flex flex-col justify-end">
              <ExperienceSelector
                value={experience}
                onChange={setExperience}
                items={experienceItems}
                onAdd={(v) => handleAddDropdown("EXPERIENCE_LEVEL", v)}
                onUpdate={handleUpdateDropdown}
                onDelete={handleDeleteDropdown}
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Description de l&apos;emploi & Rôles *
              </label>
              <textarea
                placeholder="Rédigez la description détaillée des tâches, de la mission et des rôles attendus..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium resize-y"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
            3. Compétences & Indexation IA
          </h3>
          <SkillsTagInput skills={skills} onChange={setSkills} />
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <Link
            href="/recruiter/jobs"
            className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-3 px-5 rounded-xl transition-all select-none"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={isPublishing}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3 px-6 rounded-xl shadow-sm transition-all active:scale-[0.98] select-none disabled:opacity-75 disabled:cursor-not-allowed min-w-[120px]"
          >
            {isPublishing ? (
              <>
                <Icon icon="solar:restart-bold" className="w-4 h-4 animate-spin" />
                Publication...
              </>
            ) : (
              <>
                <Icon icon="solar:rocket-linear" className="w-4 h-4" />
                Publier l&apos;offre
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

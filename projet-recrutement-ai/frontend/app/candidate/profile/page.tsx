"use client";

import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { Card } from "@/components/candidate/Card";
import { Chip } from "@/components/candidate/Chip";
import { Switch } from "@/components/candidate/Switch";
import { Button } from "@/components/candidate/Button";
import CvUploader from "@/components/candidate/CvUploader";
import DeveloperConnections from "@/components/candidate/DeveloperConnections";
import { api } from "@/lib/api";

export interface WorkExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

export interface ProjectItem {
  name: string;
  description: string;
  technologies: string[];
  link: string | null;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0] || "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function CandidateProfile() {
  const [fileName, setFileName] = useState("");

  const [isGitHubConnected, setIsGitHubConnected] = useState(true);
  const [isPortfolioConnected, setIsPortfolioConnected] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  // Profile details state
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    headline: "",
    bio: "",
    location: "",
    phone: "",
    portfolio: "",
    linkedin: "",
    github: "",
    avatarUrl: ""
  });

  // Work Experience list state
  const [experiences, setExperiences] = useState<WorkExperienceItem[]>([]);

  // Education list state
  const [educationList, setEducationList] = useState<EducationItem[]>([]);

  // Communication languages state
  const [languages, setLanguages] = useState<string[]>([]);

  // Projects list state
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);

  // Skills lists state
  const [skills, setSkills] = useState({
    core: [] as string[],
    database: [] as string[],
    ai: [] as string[]
  });

  // UI edit toggle states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [isEditingProjects, setIsEditingProjects] = useState(false);
  const [isEditingLanguages, setIsEditingLanguages] = useState(false);

  // New skill inputs
  const [newCoreSkill, setNewCoreSkill] = useState("");
  const [newDbSkill, setNewDbSkill] = useState("");
  const [newAiSkill, setNewAiSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");

  // dataAI state from MongoDB
  const [dataAI, setDataAI] = useState<any>(null);
  const [isPollingAI, setIsPollingAI] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const mergeAIData = (aiData: any) => {
    if (!aiData) return;
    const parsed = aiData.parsedData || aiData;

    setPersonalInfo((prev) => {
      const nameVal = parsed.fullName || parsed.name || parsed.candidateName || prev.name;
      const headlineVal = parsed.title || parsed.headline || parsed.role || parsed.position || prev.headline;
      const bioVal = parsed.about || parsed.bio || parsed.summary || parsed.profileSummary || parsed.about || prev.bio;
      const locationVal = parsed.location || parsed.address || prev.location;
      const phoneVal = parsed.contacts?.phone || parsed.phone || parsed.telephone || parsed.phoneNumber || prev.phone;
      const portfolioVal = parsed.contacts?.portfolio || parsed.portfolio || parsed.portfolioUrl || parsed.website || prev.portfolio;
      const linkedinVal = parsed.contacts?.linkedin || parsed.linkedin || prev.linkedin;
      const githubVal = parsed.contacts?.github || parsed.github || prev.github;

      return {
        ...prev,
        name: prev.name && prev.name !== "Candidate Name" && prev.name !== "Mehdi Ben Taleb" ? prev.name : nameVal,
        headline: prev.headline && prev.headline !== "Full-Stack Developer" ? prev.headline : headlineVal,
        bio: prev.bio && !prev.bio.startsWith("Passionate full-stack developer") ? prev.bio : bioVal,
        location: prev.location && prev.location !== "Casablanca, Morocco" ? prev.location : locationVal,
        phone: prev.phone && prev.phone !== "+212 600-000000" ? prev.phone : phoneVal,
        portfolio: prev.portfolio && prev.portfolio !== "https://bentaleb.dev" ? prev.portfolio : portfolioVal,
        linkedin: prev.linkedin && prev.linkedin !== "" ? prev.linkedin : linkedinVal,
        github: prev.github && prev.github !== "" ? prev.github : githubVal,
      };
    });

    const aiSkills = parsed.technicalSkills || parsed.skills || [];
    if (aiSkills && aiSkills.length > 0) {
      let skillStrings: string[] = [];
      if (Array.isArray(aiSkills)) {
        skillStrings = aiSkills.map((s: any) => (typeof s === "string" ? s : s.name || s.skill || "")).filter(Boolean);
      }
      if (skillStrings.length > 0) {
        setSkills((prev) => ({
          ...prev,
          core: Array.from(new Set([...prev.core, ...skillStrings]))
        }));
      }
    }

    const rawExp = parsed.experience || parsed.experiences || parsed.workExperience || parsed.positions;
    if (Array.isArray(rawExp) && rawExp.length > 0) {
      setExperiences(rawExp.map((item: any, idx: number) => ({
        id: String(idx + 1),
        company: item.company || item.companyName || "Previous Company",
        role: item.title || item.role || item.position || "Developer",
        period: item.duration || item.period || (item.startDate ? `${item.startDate} - ${item.endDate || "Present"}` : ""),
        description: item.description || item.summary || item.responsibilities || ""
      })));
    }

    const rawEdu = parsed.education;
    if (Array.isArray(rawEdu) && rawEdu.length > 0) {
      setEducationList(rawEdu.map((item: any) => ({
        degree: item.degree || item.diploma || "Degree",
        institution: item.institution || item.school || "Institution",
        year: item.year || item.period || ""
      })));
    }

    const rawLangs = parsed.languages;
    if (Array.isArray(rawLangs) && rawLangs.length > 0) {
      setLanguages(rawLangs);
    }

    const rawProj = parsed.projects;
    if (Array.isArray(rawProj) && rawProj.length > 0) {
      setProjectsList(rawProj.map((item: any) => ({
        name: item.name || item.projectName || "Project Name",
        description: item.description || item.summary || "",
        technologies: Array.isArray(item.technologies) ? item.technologies : [],
        link: item.link || null
      })));
    }
  };

  const fetchDataAI = async () => {
    try {
      const response: any = await api.get("/api/candidates/data-ai");
      if (response.success && response.data) {
        const aiData = response.data;
        setDataAI(aiData);
        mergeAIData(aiData);
      }
    } catch (err) {
      console.error("Error loading dataAI:", err);
    }
  };

  const pollDataAI = () => {
    setIsPollingAI(true);
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const response: any = await api.get("/api/candidates/data-ai");
        if (response.success && response.data) {
          const aiData = response.data;
          setDataAI(aiData);
          mergeAIData(aiData);
          clearInterval(interval);
          setIsPollingAI(false);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }

      if (attempts >= 15) {
        clearInterval(interval);
        setIsPollingAI(false);
      }
    }, 4000);
  };

  const fetchProfile = async () => {
    try {
      const response: any = await api.get("/api/candidates/profile");
      if (response.success && response.data) {
        const profile = response.data;
        const aiData = profile.dataAI || null;
        if (aiData) {
          setDataAI(aiData);
        } else {
          fetchDataAI();
        }

        const parsed = aiData?.parsedData || aiData || {};

        const name = (profile.user?.name && profile.user?.name !== "Mehdi Ben Taleb" && profile.user?.name !== "Candidate Name") 
          ? profile.user.name 
          : (parsed.fullName || parsed.name || parsed.candidateName || profile.user?.name || "Candidate Name");
        const email = profile.user?.email || parsed.contacts?.email || parsed.email || "";
        const headline = (profile.title && profile.title !== "Developer" && profile.title !== "Full-Stack Developer") 
          ? profile.title 
          : (parsed.title || parsed.headline || parsed.role || "Developer");
        const bio = (profile.bio && !profile.bio.startsWith("Passionate full-stack developer"))
          ? profile.bio
          : (parsed.about || parsed.bio || parsed.summary || "");
        const location = profile.location || parsed.location || parsed.address || "";
        const phone = profile.phone || parsed.contacts?.phone || parsed.phone || "";
        const portfolio = profile.portfolioUrl || parsed.contacts?.portfolio || parsed.portfolio || "";
        const linkedin = profile.linkedinUrl || parsed.contacts?.linkedin || parsed.linkedin || "";
        const github = profile.githubUrl || parsed.contacts?.github || parsed.github || "";
        const avatarUrl = profile.user?.image || "";

        setPersonalInfo({
          name,
          email,
          headline,
          bio,
          location,
          phone,
          portfolio,
          linkedin,
          github,
          avatarUrl
        });

        setFileName(profile.cvPath || "");

        // 1. Experiences resolution
        let loadedExp: WorkExperienceItem[] = [];

        if (profile.experience) {
          try {
            const parsedExp = JSON.parse(profile.experience);
            if (Array.isArray(parsedExp) && parsedExp.length > 0 && parsedExp[0].company !== "Tech Solutions Inc.") {
              loadedExp = parsedExp;
            }
          } catch {}
        }

        if (loadedExp.length === 0 && parsed) {
          const rawExp = parsed.experience || parsed.experiences || parsed.workExperience || parsed.positions;
          if (Array.isArray(rawExp) && rawExp.length > 0) {
            loadedExp = rawExp.map((item: any, idx: number) => ({
              id: String(idx + 1),
              company: item.company || item.companyName || "Previous Company",
              role: item.title || item.role || item.position || "Developer",
              period: item.duration || item.period || (item.startDate ? `${item.startDate} - ${item.endDate || "Present"}` : ""),
              description: item.description || item.summary || item.responsibilities || ""
            }));
          }
        }

        if (loadedExp.length > 0) {
          setExperiences(loadedExp);
        }

        // 2. Education resolution
        if (parsed.education) {
          const rawEdu = parsed.education;
          if (Array.isArray(rawEdu) && rawEdu.length > 0) {
            setEducationList(rawEdu.map((item: any) => ({
              degree: item.degree || item.diploma || "Degree",
              institution: item.institution || item.school || "Institution",
              year: item.year || item.period || ""
            })));
          }
        }

        // 2.5. Languages resolution
        if (parsed.languages) {
          const rawLangs = parsed.languages;
          if (Array.isArray(rawLangs) && rawLangs.length > 0) {
            setLanguages(rawLangs);
          }
        }

        // 2.7. Projects resolution
        if (parsed.projects) {
          const rawProj = parsed.projects;
          if (Array.isArray(rawProj) && rawProj.length > 0) {
            setProjectsList(rawProj.map((item: any) => ({
              name: item.name || item.projectName || "Project Name",
              description: item.description || item.summary || "",
              technologies: Array.isArray(item.technologies) ? item.technologies : [],
              link: item.link || null
            })));
          }
        }

        // 3. Skills resolution
        const dbSkills = profile.skills ? profile.skills.map((s: any) => s.name) : [];
        let aiSkillNames: string[] = [];
        const aiSkills = parsed.technicalSkills || parsed.skills || [];
        if (Array.isArray(aiSkills)) {
          aiSkillNames = aiSkills.map((s: any) => (typeof s === "string" ? s : s.name || s.skill || "")).filter(Boolean);
        }

        const mergedCoreSkills = Array.from(new Set([...dbSkills, ...aiSkillNames]));

        const currentSkills = {
          core: mergedCoreSkills,
          database: [] as string[],
          ai: [] as string[]
        };

        setSkills(currentSkills);

        // Sync details to localStorage so top navbar updates instantly
        const payload = {
          name,
          email,
          headline,
          bio,
          location,
          phone,
          portfolio,
          avatarUrl,
          personalInfo: {
            name,
            email,
            headline,
            bio,
            location,
            phone,
            portfolio,
            linkedin,
            github,
            avatarUrl
          },
          skills: currentSkills
        };
        localStorage.setItem("candidate-profile", JSON.stringify(payload));
        window.dispatchEvent(new Event("candidate-profile-updated"));
      }
    } catch (e) {
      console.error("Error loading profile:", e);
    }
  };

  // Load from database on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Save changes to backend
  const saveProfile = async (
    updatedPersonalInfo: typeof personalInfo = personalInfo,
    updatedSkills: typeof skills = skills,
    updatedExperiences: WorkExperienceItem[] = experiences,
    updatedFileName = fileName,
    updatedEducation: EducationItem[] = educationList,
    updatedProjects: ProjectItem[] = projectsList,
    updatedLanguages: string[] = languages
  ) => {
    try {
      const flatSkills = [
        ...updatedSkills.core,
        ...updatedSkills.database,
        ...updatedSkills.ai
      ];

      const serializedExp = JSON.stringify(updatedExperiences);

      const response: any = await api.put("/api/candidates/profile", {
        name: updatedPersonalInfo.name,
        image: updatedPersonalInfo.avatarUrl || undefined,
        title: updatedPersonalInfo.headline,
        bio: updatedPersonalInfo.bio,
        location: updatedPersonalInfo.location,
        experience: serializedExp,
        phone: updatedPersonalInfo.phone,
        portfolioUrl: updatedPersonalInfo.portfolio,
        githubUrl: updatedPersonalInfo.github,
        linkedinUrl: updatedPersonalInfo.linkedin,
        skills: flatSkills,
        cvPath: updatedFileName,
        languages: updatedLanguages,
        education: updatedEducation,
        projects: updatedProjects
      });

      if (response.success) {
        const payload = {
          name: updatedPersonalInfo.name,
          email: updatedPersonalInfo.email,
          headline: updatedPersonalInfo.headline,
          bio: updatedPersonalInfo.bio,
          location: updatedPersonalInfo.location,
          experiences: updatedExperiences,
          experience: serializedExp,
          phone: updatedPersonalInfo.phone,
          portfolio: updatedPersonalInfo.portfolio,
          avatarUrl: updatedPersonalInfo.avatarUrl,
          personalInfo: updatedPersonalInfo,
          skills: updatedSkills
        };
        localStorage.setItem("candidate-profile", JSON.stringify(payload));
        window.dispatchEvent(new Event("candidate-profile-updated"));
      }
    } catch (error) {
      console.error("Error saving profile to database:", error);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const updated = { ...personalInfo, avatarUrl: dataUrl };
        setPersonalInfo(updated);
        saveProfile(updated, skills, experiences);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile & CV</h1>
        <p className="text-sm text-default-550">Manage your CV upload documents, work experiences, and developer portfolio.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Personal Info, Work Experience & CV Upload */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Card 1: Personal Details */}
          <Card className="relative">
            {!isEditingProfile ? (
              <button 
                onClick={() => setIsEditingProfile(true)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/20 dark:hover:bg-blue-900/30 dark:text-blue-400 transition-all duration-200 border border-blue-100 dark:border-blue-900/35 hover:scale-105 active:scale-95 shadow-sm z-10"
                title="Edit Details"
              >
                <Icon icon="solar:pen-linear" className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={() => {
                  saveProfile(personalInfo, skills, experiences);
                  setIsEditingProfile(false);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 dark:text-emerald-450 transition-all duration-200 border border-emerald-100 dark:border-emerald-900/35 hover:scale-105 active:scale-95 shadow-sm z-10"
                title="Save Details"
              >
                <Icon icon="solar:check-read-bold" className="w-4 h-4" />
              </button>
            )}
            <Card.Header className="flex justify-between items-center pb-2 pr-14">
              <div>
                <Card.Title>Personal Details</Card.Title>
                <Card.Description>Extracted from CV & editable by you</Card.Description>
              </div>
            </Card.Header>
            <Card.Content className="space-y-4">
              {/* Avatar row */}
              <div className="flex items-center gap-4 border-b border-default-100 dark:border-default-50/10 pb-4">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group cursor-pointer shrink-0"
                  title="Upload profile picture"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-xl shadow-inner select-none relative">
                    <img 
                      src={personalInfo.avatarUrl || "/avatar-mehdi.png"} 
                      alt={personalInfo.name} 
                      className="w-full h-full object-cover absolute inset-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <span>{getInitials(personalInfo.name)}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/45 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-semibold">
                    <Icon icon="solar:camera-linear" className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-bold text-default-900 dark:text-default-50">{personalInfo.name}</h4>
                  <p className="text-xs text-default-450 mt-0.5">{personalInfo.headline}</p>
                  {personalInfo.location && (
                    <p className="text-xs text-default-500 mt-1 font-medium">{personalInfo.location}</p>
                  )}
                </div>
              </div>

              {isEditingProfile && (
                <div className="flex items-center gap-2.5 p-3 bg-blue-50/60 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/50 rounded-xl text-xs text-blue-700 dark:text-blue-400 font-medium select-none mb-4 animate-pulse">
                  <Icon icon="solar:user-bold-duotone" className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>You are editing personal details. Updates will synchronize automatically.</span>
                </div>
              )}

              {isEditingProfile ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-default-450 uppercase mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={personalInfo.name}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all font-medium text-slate-800 dark:text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-default-450 uppercase mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                        className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all font-medium text-slate-800 dark:text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-default-450 uppercase mb-1.5">Professional Headline</label>
                      <input
                        type="text"
                        value={personalInfo.headline}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, headline: e.target.value })}
                        className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all font-medium text-slate-800 dark:text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-default-450 uppercase mb-1.5">Phone Number</label>
                      <input
                        type="text"
                        value={personalInfo.phone}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                        className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all font-medium text-slate-800 dark:text-slate-200"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-default-450 uppercase mb-1.5">Location</label>
                      <input
                        type="text"
                        value={personalInfo.location || ""}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                        className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all font-medium text-slate-800 dark:text-slate-200"
                        placeholder="e.g. Casablanca, Morocco"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-default-450 uppercase mb-1.5">Portfolio Link</label>
                      <input
                        type="url"
                        value={personalInfo.portfolio || ""}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, portfolio: e.target.value })}
                        className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all font-medium text-slate-800 dark:text-slate-200"
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-default-450 uppercase mb-1.5">LinkedIn Profile</label>
                      <input
                        type="url"
                        value={personalInfo.linkedin || ""}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                        className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all font-medium text-slate-800 dark:text-slate-200"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-default-450 uppercase mb-1.5">GitHub Profile</label>
                      <input
                        type="url"
                        value={personalInfo.github || ""}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                        className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all font-medium text-slate-800 dark:text-slate-200"
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-default-450 uppercase mb-1.5">Bio / About Me</label>
                      <textarea
                        rows={3}
                        value={personalInfo.bio || ""}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                        className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all font-medium text-slate-800 dark:text-slate-200 resize-none"
                        placeholder="Tell recruiters about yourself, your background, and your key strengths..."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      onClick={async () => {
                        await fetchProfile();
                        setIsEditingProfile(false);
                      }}
                      className="text-xs font-semibold text-slate-400 hover:text-slate-650 transition-colors"
                    >
                      Discard changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-[10px] font-bold text-default-400 uppercase tracking-wider mb-1">Full Name</h5>
                      <p className="text-sm font-semibold text-default-800 dark:text-default-200">{personalInfo.name}</p>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-bold text-default-400 uppercase tracking-wider mb-1">Email Address</h5>
                      <p className="text-sm font-semibold text-default-800 dark:text-default-200">{personalInfo.email}</p>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-bold text-default-400 uppercase tracking-wider mb-1">Professional Headline</h5>
                      <p className="text-sm font-semibold text-default-800 dark:text-default-200">{personalInfo.headline}</p>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-bold text-default-400 uppercase tracking-wider mb-1">Phone Number</h5>
                      <p className="text-sm font-semibold text-default-800 dark:text-default-200">{personalInfo.phone || "-"}</p>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-bold text-default-400 uppercase tracking-wider mb-1">Location</h5>
                      <p className="text-sm font-semibold text-default-800 dark:text-default-200">
                        {personalInfo.location || <span className="text-default-450 italic font-normal">Not specified</span>}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-bold text-default-400 uppercase tracking-wider mb-1">Portfolio Link</h5>
                      <p className="text-sm font-semibold text-default-800 dark:text-default-200">
                        {personalInfo.portfolio ? (
                          <a 
                            href={personalInfo.portfolio} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {personalInfo.portfolio.replace("https://", "").replace("http://", "")}
                          </a>
                        ) : (
                          <span className="text-default-450 italic font-normal">No link connected</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-bold text-default-400 uppercase tracking-wider mb-1">LinkedIn Profile</h5>
                      <p className="text-sm font-semibold text-default-800 dark:text-default-200">
                        {personalInfo.linkedin ? (
                          <a 
                            href={personalInfo.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <Icon icon="logos:linkedin-icon" className="w-3.5 h-3.5 shrink-0" />
                            {personalInfo.linkedin.replace("https://www.linkedin.com/in/", "").replace("https://linkedin.com/in/", "").replace("http://www.linkedin.com/in/", "").replace("http://linkedin.com/in/", "")}
                          </a>
                        ) : (
                          <span className="text-default-450 italic font-normal">Not connected</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-bold text-default-400 uppercase tracking-wider mb-1">GitHub Profile</h5>
                      <p className="text-sm font-semibold text-default-800 dark:text-default-200">
                        {personalInfo.github ? (
                          <a 
                            href={personalInfo.github} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <Icon icon="mdi:github" className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200 shrink-0" />
                            {personalInfo.github.replace("https://github.com/", "").replace("http://github.com/", "")}
                          </a>
                        ) : (
                          <span className="text-default-450 italic font-normal">Not connected</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="pt-2 border-t border-default-100 dark:border-default-50/10">
                    <h5 className="text-[10px] font-bold text-default-400 uppercase tracking-wider mb-1">Bio / About Me</h5>
                    {personalInfo.bio ? (
                      <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal bg-slate-50/70 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-800">
                        {personalInfo.bio}
                      </p>
                    ) : (
                      <p className="text-xs text-default-450 italic font-normal">No biography provided yet. Click edit to add your bio.</p>
                    )}
                  </div>
                </div>
              )}
            </Card.Content>
          </Card>

          {/* Card 2: Independent Work Experience Section */}
          <Card className="relative">
            {!isEditingExperience ? (
              <button 
                onClick={() => setIsEditingExperience(true)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/20 dark:hover:bg-blue-900/30 dark:text-blue-400 transition-all duration-200 border border-blue-100 dark:border-blue-900/35 hover:scale-105 active:scale-95 shadow-sm z-10"
                title="Edit Work Experience"
              >
                <Icon icon="solar:pen-linear" className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={() => {
                  saveProfile(personalInfo, skills, experiences);
                  setIsEditingExperience(false);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 dark:text-emerald-450 transition-all duration-200 border border-emerald-100 dark:border-emerald-900/35 hover:scale-105 active:scale-95 shadow-sm z-10"
                title="Save Work Experience"
              >
                <Icon icon="solar:check-read-bold" className="w-4 h-4" />
              </button>
            )}
            <Card.Header className="flex justify-between items-center pb-2 pr-14">
              <div>
                <Card.Title>Work Experience</Card.Title>
                <Card.Description>Companies, roles, and career responsibilities</Card.Description>
              </div>
            </Card.Header>
            <Card.Content className="space-y-6">
              {isEditingExperience ? (
                <div className="space-y-6">
                  {experiences.map((exp, index) => (
                    <div key={exp.id || index} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3 relative group">
                      <button
                        onClick={() => {
                          const updated = experiences.filter((_, i) => i !== index);
                          setExperiences(updated);
                        }}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove experience"
                      >
                        <Icon icon="solar:trash-bin-trash-linear" className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                        <div>
                          <label className="block text-xs font-bold text-default-450 uppercase mb-1">Company Name</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const updated = [...experiences];
                              updated[index].company = e.target.value;
                              setExperiences(updated);
                            }}
                            placeholder="e.g. Acme Corp"
                            className="w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-default-450 uppercase mb-1">Role / Position</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => {
                              const updated = [...experiences];
                              updated[index].role = e.target.value;
                              setExperiences(updated);
                            }}
                            placeholder="e.g. Senior Software Engineer"
                            className="w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-default-450 uppercase mb-1">Period / Dates</label>
                          <input
                            type="text"
                            value={exp.period}
                            onChange={(e) => {
                              const updated = [...experiences];
                              updated[index].period = e.target.value;
                              setExperiences(updated);
                            }}
                            placeholder="e.g. 2022 - Present"
                            className="w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-default-450 uppercase mb-1">What did you do / Responsibilities</label>
                          <textarea
                            rows={3}
                            value={exp.description}
                            onChange={(e) => {
                              const updated = [...experiences];
                              updated[index].description = e.target.value;
                              setExperiences(updated);
                            }}
                            placeholder="Describe your achievements, responsibilities, projects, and tech stack used..."
                            className="w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      setExperiences([
                        ...experiences,
                        { id: Date.now().toString(), company: "", role: "", period: "", description: "" }
                      ]);
                    }}
                    className="w-full py-2.5 px-4 border border-dashed border-blue-300 dark:border-blue-800/60 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    + Add Work Position
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {experiences && experiences.length > 0 ? (
                    experiences.map((exp, index) => (
                      <div 
                        key={exp.id || index} 
                        className={`pb-5 ${index !== experiences.length - 1 ? 'border-b border-default-100 dark:border-default-50/10' : ''}`}
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                          <div>
                            <h4 className="text-sm font-bold text-default-900 dark:text-default-50">{exp.role || "Position"}</h4>
                            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{exp.company}</p>
                          </div>
                          {exp.period && (
                            <span className="text-[11px] font-medium text-default-450 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full">
                              {exp.period}
                            </span>
                          )}
                        </div>
                        {exp.description && (
                          <p className="text-xs text-default-600 dark:text-default-400 leading-relaxed mt-2 whitespace-pre-line">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-default-450 italic">No work experience added yet. Click edit to add your positions.</p>
                  )}
                </div>
              )}
            </Card.Content>
          </Card>

          {/* Card 2.5: Education Section */}
          <Card className="relative">
            {!isEditingEducation ? (
              <button 
                onClick={() => setIsEditingEducation(true)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/20 dark:hover:bg-blue-900/30 dark:text-blue-400 transition-all duration-200 border border-blue-100 dark:border-blue-900/35 hover:scale-105 active:scale-95 shadow-sm z-10"
                title="Edit Education"
              >
                <Icon icon="solar:pen-linear" className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={() => {
                  saveProfile(personalInfo, skills, experiences, fileName, educationList, projectsList, languages);
                  setIsEditingEducation(false);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 dark:text-emerald-450 transition-all duration-200 border border-emerald-100 dark:border-emerald-900/35 hover:scale-105 active:scale-95 shadow-sm z-10"
                title="Save Education"
              >
                <Icon icon="solar:check-read-bold" className="w-4 h-4" />
              </button>
            )}
            <Card.Header className="flex justify-between items-center pb-2 pr-14">
              <div>
                <Card.Title>Education</Card.Title>
                <Card.Description>Academic background and qualification credentials</Card.Description>
              </div>
            </Card.Header>
            <Card.Content className="space-y-6">
              {isEditingEducation ? (
                <div className="space-y-6">
                  {educationList.map((edu, idx) => (
                    <div key={idx} className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-800 relative group/item">
                      <button
                        onClick={() => {
                          const updated = educationList.filter((_, i) => i !== idx);
                          setEducationList(updated);
                        }}
                        className="absolute top-3 right-3 text-default-450 hover:text-rose-600 transition-colors"
                        title="Remove Education"
                      >
                        <Icon icon="solar:trash-bin-trash-linear" className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-default-450 uppercase mb-1">Degree / Qualification</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...educationList];
                              updated[idx].degree = e.target.value;
                              setEducationList(updated);
                            }}
                            className="w-full px-3 py-1.5 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all font-medium text-slate-800 dark:text-slate-200"
                            placeholder="e.g. Master of Science in Computer Science"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-default-450 uppercase mb-1">Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => {
                              const updated = [...educationList];
                              updated[idx].institution = e.target.value;
                              setEducationList(updated);
                            }}
                            className="w-full px-3 py-1.5 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all font-medium text-slate-800 dark:text-slate-200"
                            placeholder="e.g. Solicode Bootcamp"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-default-450 uppercase mb-1">Year / Period</label>
                          <input
                            type="text"
                            value={edu.year}
                            onChange={(e) => {
                              const updated = [...educationList];
                              updated[idx].year = e.target.value;
                              setEducationList(updated);
                            }}
                            className="w-full px-3 py-1.5 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all font-medium text-slate-800 dark:text-slate-200"
                            placeholder="e.g. 2024 - 2026"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setEducationList([
                        ...educationList,
                        { degree: "", institution: "", year: "" }
                      ]);
                    }}
                    className="w-full py-2.5 px-4 border border-dashed border-blue-300 dark:border-blue-800/60 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    + Add Education
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {educationList && educationList.length > 0 ? (
                    educationList.map((edu, index) => (
                      <div 
                        key={index} 
                        className={`pb-5 ${index !== educationList.length - 1 ? 'border-b border-default-100 dark:border-default-50/10' : ''}`}
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                          <div>
                            <h4 className="text-sm font-bold text-default-900 dark:text-default-50">{edu.degree || "Degree"}</h4>
                            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{edu.institution}</p>
                          </div>
                          {edu.year && (
                            <span className="text-[11px] font-medium text-default-450 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full">
                              {edu.year}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-default-450 italic">No education history extracted from CV yet.</p>
                  )}
                </div>
              )}
            </Card.Content>
          </Card>

          {/* Card 2.7: Projects Section */}
          <Card className="relative">
            {!isEditingProjects ? (
              <button 
                onClick={() => setIsEditingProjects(true)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/20 dark:hover:bg-blue-900/30 dark:text-blue-400 transition-all duration-200 border border-blue-100 dark:border-blue-900/35 hover:scale-105 active:scale-95 shadow-sm z-10"
                title="Edit Projects"
              >
                <Icon icon="solar:pen-linear" className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={() => {
                  saveProfile(personalInfo, skills, experiences, fileName, educationList, projectsList, languages);
                  setIsEditingProjects(false);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 dark:text-emerald-450 transition-all duration-200 border border-emerald-100 dark:border-emerald-900/35 hover:scale-105 active:scale-95 shadow-sm z-10"
                title="Save Projects"
              >
                <Icon icon="solar:check-read-bold" className="w-4 h-4" />
              </button>
            )}
            <Card.Header className="flex justify-between items-center pb-2 pr-14">
              <div>
                <Card.Title>Projects</Card.Title>
                <Card.Description>Notable projects and technical applications</Card.Description>
              </div>
            </Card.Header>
            <Card.Content className="space-y-6">
              {isEditingProjects ? (
                <div className="space-y-6">
                  {projectsList.map((project, idx) => (
                    <div key={idx} className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-800 relative group/item">
                      <button
                        onClick={() => {
                          const updated = projectsList.filter((_, i) => i !== idx);
                          setProjectsList(updated);
                        }}
                        className="absolute top-3 right-3 text-default-450 hover:text-rose-600 transition-colors"
                        title="Remove Project"
                      >
                        <Icon icon="solar:trash-bin-trash-linear" className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-default-450 uppercase mb-1">Project Name</label>
                          <input
                            type="text"
                            value={project.name}
                            onChange={(e) => {
                              const updated = [...projectsList];
                              updated[idx].name = e.target.value;
                              setProjectsList(updated);
                            }}
                            className="w-full px-3 py-1.5 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all font-medium text-slate-800 dark:text-slate-200"
                            placeholder="e.g. Intelligent Recruitment Platform"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-default-450 uppercase mb-1">Project Link / URL</label>
                          <input
                            type="text"
                            value={project.link || ""}
                            onChange={(e) => {
                              const updated = [...projectsList];
                              updated[idx].link = e.target.value;
                              setProjectsList(updated);
                            }}
                            className="w-full px-3 py-1.5 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all font-medium text-slate-800 dark:text-slate-200"
                            placeholder="e.g. https://github.com/..."
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-default-450 uppercase mb-1">Technologies (Comma separated)</label>
                          <input
                            type="text"
                            value={project.technologies.join(", ")}
                            onChange={(e) => {
                              const updated = [...projectsList];
                              updated[idx].technologies = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                              setProjectsList(updated);
                            }}
                            className="w-full px-3 py-1.5 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all font-medium text-slate-800 dark:text-slate-200"
                            placeholder="e.g. React, Next.js, Tailwind, Node.js"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-default-450 uppercase mb-1">Description</label>
                          <textarea
                            value={project.description || ""}
                            onChange={(e) => {
                              const updated = [...projectsList];
                              updated[idx].description = e.target.value;
                              setProjectsList(updated);
                            }}
                            rows={3}
                            className="w-full px-3 py-1.5 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all font-medium text-slate-800 dark:text-slate-200"
                            placeholder="Describe the application features and your role..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setProjectsList([
                        ...projectsList,
                        { name: "", description: "", technologies: [], link: "" }
                      ]);
                    }}
                    className="w-full py-2.5 px-4 border border-dashed border-blue-300 dark:border-blue-800/60 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    + Add Project
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {projectsList && projectsList.length > 0 ? (
                    projectsList.map((project, index) => (
                      <div 
                        key={index} 
                        className={`pb-5 ${index !== projectsList.length - 1 ? 'border-b border-default-100 dark:border-default-50/10' : ''}`}
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                          <div>
                            <h4 className="text-sm font-bold text-default-900 dark:text-default-50">{project.name || "Project Name"}</h4>
                            {project.link && (
                              <a 
                                href={project.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
                              >
                                <Icon icon="solar:link-linear" className="w-3.5 h-3.5" />
                                View Link
                              </a>
                            )}
                          </div>
                        </div>
                        {project.description && (
                          <p className="text-xs text-default-600 dark:text-default-400 leading-relaxed mt-2">
                            {project.description}
                          </p>
                        )}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {project.technologies.map((tech) => (
                              <Chip key={tech} color="default" variant="soft">
                                {tech}
                              </Chip>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-default-450 italic">No projects history extracted from CV yet.</p>
                  )}
                </div>
              )}
            </Card.Content>
          </Card>

          {/* Card 3: CV Drag & Drop */}
          <CvUploader
            fileName={fileName}
            onChange={(name) => {
              setFileName(name);
              saveProfile(personalInfo, skills, experiences, name);
              pollDataAI();
            }}
          />

          {/* Card 4: External Integrations */}
          <DeveloperConnections
            isGitHubConnected={isGitHubConnected}
            onGitHubToggle={setIsGitHubConnected}
            isPortfolioConnected={isPortfolioConnected}
            onPortfolioToggle={setIsPortfolioConnected}
          />
        </div>

        {/* Right 1 Col: Extracted Skills & Preferences */}
        <div className="space-y-6">
          <Card className="relative">
            {!isEditingSkills ? (
              <button 
                onClick={() => setIsEditingSkills(true)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/20 dark:hover:bg-blue-900/30 dark:text-blue-400 transition-all duration-200 border border-blue-100 dark:border-blue-900/35 hover:scale-105 active:scale-95 shadow-sm z-10"
                title="Edit Skills"
              >
                <Icon icon="solar:pen-linear" className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={() => {
                  saveProfile(personalInfo, skills, experiences);
                  setIsEditingSkills(false);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 dark:text-emerald-450 transition-all duration-200 border border-emerald-100 dark:border-emerald-900/35 hover:scale-105 active:scale-95 shadow-sm z-10"
                title="Save Skills"
              >
                <Icon icon="solar:check-read-bold" className="w-4 h-4" />
              </button>
            )}
            <Card.Header className="flex justify-between items-center pr-14">
              <div>
                <Card.Title>Extracted Skills</Card.Title>
                <Card.Description>Verified from resume & repos</Card.Description>
              </div>
            </Card.Header>
            <Card.Content className="space-y-5">
              {isEditingSkills && (
                <div className="flex items-center gap-2.5 p-3 bg-amber-50/60 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/50 rounded-xl text-xs text-amber-800 dark:text-amber-300 font-medium select-none mb-4 animate-pulse">
                  <Icon icon="solar:shield-warning-bold-duotone" className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>Adding or removing tags directly affects your AI Matcher Sync score.</span>
                </div>
              )}

              {/* All Skills Container */}
              <div>
                <div className="flex flex-wrap gap-1.5">
                  {skills.core.map((skill) => 
                    isEditingSkills ? (
                      <span 
                        key={skill}
                        className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-rose-50 dark:bg-slate-900 dark:hover:bg-rose-950/20 text-slate-700 hover:text-rose-700 dark:text-slate-300 dark:hover:text-rose-450 border border-slate-200/60 hover:border-rose-200/80 dark:border-slate-800 dark:hover:border-rose-900/40 font-semibold px-2.5 py-0.5 text-xs rounded-full transition-all duration-150 select-none shadow-sm cursor-pointer"
                      >
                        {skill}
                        <button
                          onClick={() => {
                            const updated = skills.core.filter(s => s !== skill);
                            const newSkills = { ...skills, core: updated };
                            setSkills(newSkills);
                            saveProfile(personalInfo, newSkills, experiences);
                          }}
                          className="hover:scale-125 focus:outline-none transition-transform"
                          title={`Remove ${skill}`}
                        >
                          <Icon icon="solar:close-circle-bold" className="w-4 h-4 text-slate-400 hover:text-rose-600 transition-colors" />
                        </button>
                      </span>
                    ) : (
                      <Chip key={skill} color="accent" variant="soft">{skill}</Chip>
                    )
                  )}
                </div>
                {isEditingSkills && (
                  <div className="flex gap-2 mt-3 group relative">
                    <input
                      type="text"
                      placeholder="Add a skill..."
                      value={newCoreSkill}
                      onChange={(e) => setNewCoreSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newCoreSkill.trim()) {
                            const newSkills = { ...skills, core: [...skills.core, newCoreSkill.trim()] };
                            setSkills(newSkills);
                            saveProfile(personalInfo, newSkills, experiences);
                            setNewCoreSkill("");
                          }
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all font-medium"
                    />
                    <button
                      onClick={() => {
                        if (newCoreSkill.trim()) {
                          const newSkills = { ...skills, core: [...skills.core, newCoreSkill.trim()] };
                          setSkills(newSkills);
                          saveProfile(personalInfo, newSkills, experiences);
                          setNewCoreSkill("");
                        }
                      }}
                      className="px-2.5 bg-blue-600 hover:bg-blue-750 text-white rounded-xl transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95 shadow-sm shadow-blue-500/10 text-xs font-bold"
                    >
                      <Icon icon="solar:add-circle-bold" className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>

          {/* Card 3.5: Languages Section */}
          <Card className="relative">
            {!isEditingLanguages ? (
              <button 
                onClick={() => setIsEditingLanguages(true)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/20 dark:hover:bg-blue-900/30 dark:text-blue-400 transition-all duration-200 border border-blue-100 dark:border-blue-900/35 hover:scale-105 active:scale-95 shadow-sm z-10"
                title="Edit Languages"
              >
                <Icon icon="solar:pen-linear" className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={() => {
                  saveProfile(personalInfo, skills, experiences, fileName, educationList, projectsList, languages);
                  setIsEditingLanguages(false);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 dark:text-emerald-450 transition-all duration-200 border border-emerald-100 dark:border-emerald-900/35 hover:scale-105 active:scale-95 shadow-sm z-10"
                title="Save Languages"
              >
                <Icon icon="solar:check-read-bold" className="w-4 h-4" />
              </button>
            )}
            <Card.Header className="flex justify-between items-center pb-2 pr-14">
              <div>
                <Card.Title>Languages</Card.Title>
                <Card.Description>Communication languages & proficiency</Card.Description>
              </div>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {languages && languages.length > 0 ? (
                  languages.map((lang, idx) => 
                    isEditingLanguages ? (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-rose-50 dark:bg-slate-900 dark:hover:bg-rose-950/20 text-slate-700 hover:text-rose-700 dark:text-slate-300 dark:hover:text-rose-450 border border-slate-200/60 hover:border-rose-200/80 dark:border-slate-800 dark:hover:border-rose-900/40 font-semibold px-2.5 py-0.5 text-xs rounded-full transition-all duration-150 select-none shadow-sm cursor-pointer"
                      >
                        {lang}
                        <button
                          onClick={() => {
                            const updated = languages.filter((_, i) => i !== idx);
                            setLanguages(updated);
                            saveProfile(personalInfo, skills, experiences, fileName, educationList, projectsList, updated);
                          }}
                          className="hover:scale-125 focus:outline-none transition-transform"
                          title={`Remove ${lang}`}
                        >
                          <Icon icon="solar:close-circle-bold" className="w-4 h-4 text-slate-400 hover:text-rose-600 transition-colors" />
                        </button>
                      </span>
                    ) : (
                      <Chip key={idx} color="default" variant="soft">
                        {lang}
                      </Chip>
                    )
                  )
                ) : (
                  <p className="text-xs text-default-450 italic">No communication languages extracted from CV yet.</p>
                )}
              </div>
              {isEditingLanguages && (
                <div className="flex gap-2 mt-3 group relative">
                  <input
                    type="text"
                    placeholder="Add a language..."
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newLanguage.trim()) {
                          const updated = [...languages, newLanguage.trim()];
                          setLanguages(updated);
                          saveProfile(personalInfo, skills, experiences, fileName, educationList, projectsList, updated);
                          setNewLanguage("");
                        }
                      }
                    }}
                    className="flex-1 px-3 py-1.5 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all font-medium text-slate-800 dark:text-slate-200"
                  />
                  <button
                    onClick={() => {
                      if (newLanguage.trim()) {
                        const updated = [...languages, newLanguage.trim()];
                        setLanguages(updated);
                        saveProfile(personalInfo, skills, experiences, fileName, educationList, projectsList, updated);
                        setNewLanguage("");
                      }
                    }}
                    className="px-2.5 bg-blue-600 hover:bg-blue-750 text-white rounded-xl transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95 shadow-sm shadow-blue-500/10 text-xs font-bold"
                  >
                    <Icon icon="solar:add-circle-bold" className="w-4 h-4" />
                  </button>
                </div>
              )}
            </Card.Content>
          </Card>

          {/* Sync Switch Settings */}
          <Card>
            <Card.Content className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-semibold text-default-800 dark:text-default-200">Auto-Update Profile</h5>
                  <p className="text-[10px] text-default-450 mt-0.5">Rescan connected accounts daily</p>
                </div>
                <Switch isSelected={autoSync} onChange={(checked) => setAutoSync(checked)} color="accent" aria-label="Auto-Update Profile" />
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
      {/* Loading Overlay Modal */}
      {isPollingAI && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setIsPollingAI(false)}
              className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full flex items-center justify-center text-default-450 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-default-700 transition-all duration-150"
              title="Close"
            >
              <Icon icon="solar:close-circle-bold" className="w-5 h-5" />
            </button>
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                <Icon icon="solar:radial-blur-bold-duotone" className="w-10 h-10 text-blue-600 dark:text-blue-450 animate-spin" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-default-900 dark:text-default-50">AI CV Parsing in Progress</h3>
              <p className="text-xs text-default-500 dark:text-default-400 leading-relaxed">
                Please wait a moment. The AI is extracting your personal details, work experience, education history, languages, and technical skills from your resume to configure your profile automatically.
              </p>
            </div>
            <div className="pt-2">
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                <div className="absolute top-0 bottom-0 left-0 bg-blue-600 rounded-full animate-pulse w-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

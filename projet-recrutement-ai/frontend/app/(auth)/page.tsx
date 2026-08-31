"use client";
import React, { useState, useEffect } from "react";
import LoginCard from "@/components/LoginCard";
import RegisterCard from "@/components/RegisterCard";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";

type AuthView = "login" | "register";

export default function AuthPage() {
    const [view, setView] = useState<AuthView>("login");
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (session) {
            const isOnboarded = (session.user as any).isOnboarded;
            const role = (session.user as any).role?.toUpperCase();
            if (role === "ADMIN") {
                router.push("/admin/dashboard");
            } else if (isOnboarded) {
                router.push(role === "RECRUITER" ? "/recruiter/dashboard" : "/candidate/dashboard");
            } else {
                router.push("/welcome");
            }
        }
    }, [session, router, mounted]);

    if (!mounted || isPending) {
        return null;
    }

    return (
        <div className="w-full max-w-[440px] lg:max-w-[1050px] min-h-[600px] bg-white dark:bg-zinc-950 border border-default-200 shadow-2xl rounded-3xl overflow-hidden flex flex-col lg:flex-row m-4">
            {/* Left side panel (TalentMatch AI Promo) - hidden on mobile */}
            <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden flex-col justify-between p-8 text-default-900 bg-blue-50/30 dark:bg-zinc-900/50 rounded-r-[48px] lg:rounded-r-[64px] border-r border-default-100 dark:border-zinc-800 shadow-[4px_0_15px_rgba(0,0,0,0.01)] z-10">
                {/* Header Logo & Brand */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white shadow-sm">
                            <Icon icon="lucide:sparkles" className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-blue-900 dark:text-blue-400">
                            TalentMatch AI
                        </span>
                    </div>

                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-400 text-[11px] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        Plateforme Intelligente de Recrutement & de Matching IA
                    </div>
                </div>

                {/* Main Copy Area */}
                <div className="my-6 space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight text-blue-950 dark:text-white">
                            Le bon <span className="text-blue-600 dark:text-blue-400">talent</span>.<br />
                            La bonne <span className="text-blue-600 dark:text-blue-400">opportunité</span>.
                        </h1>
                        <div className="w-8 h-0.5 bg-blue-600 rounded-full" />
                    </div>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[400px] leading-relaxed">
                        L'Intelligence Artificielle au service d'un recrutement plus <span className="font-semibold text-blue-600 dark:text-blue-400">intelligent</span>, plus <span className="font-semibold text-blue-600 dark:text-blue-400">rapide</span> et plus <span className="font-semibold text-blue-600 dark:text-blue-400">fiable</span>.
                    </p>
                </div>

                {/* Grid of 3 Highlights */}
                <div className="grid grid-cols-3 gap-4 my-2">
                    {/* Item 1 */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm">
                            <Icon icon="lucide:user-search" className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Matching Bidirectionnel</h3>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">Reliez les meilleurs talents aux opportunités.</p>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm">
                            <Icon icon="lucide:shield-check" className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Vérification des Compétences</h3>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">Des preuves concrètes pour recruter en confiance.</p>
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm">
                            <Icon icon="lucide:zap" className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Gain de Temps & Performance</h3>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">Automatisez chaque étape et recrutez plus vite.</p>
                        </div>
                    </div>
                </div>

                {/* Footer Banner */}
                <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                        <Icon icon="lucide:lightbulb" className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Des décisions basées sur les <span className="font-semibold text-blue-600 dark:text-blue-400">données</span>. Des résultats basés sur les <span className="font-semibold text-blue-600 dark:text-blue-400">talents</span>.</span>
                    </div>
                </div>
            </div>

            {/* Right side panel (Forms) */}
            <div className="w-full lg:w-[50%] flex items-center justify-center p-6 md:p-10 bg-white dark:bg-transparent z-0">
                <div className="w-full max-w-[360px] mx-auto">
                    {view === "login" ? (
                        <LoginCard setView={setView} />
                    ) : (
                        <RegisterCard setView={setView} />
                    )}
                </div>
            </div>
        </div>
    );
}


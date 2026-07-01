"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, Spinner } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

export default function WelcomePage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<"candidat" | "recruteur" | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isOnboarded = (session?.user as any)?.isOnboarded;

    useEffect(() => {
        if (!mounted) return;
        if (isOnboarded) {
            router.push("/dashboard");
        }
    }, [isOnboarded, router, mounted]);

    const handleSelectRole = async (role: "candidat" | "recruteur") => {
        if (!session?.user?.id) return;
        setSelected(role);
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/user/update-role", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: session.user.id, role }),
            });

            if (response.ok) {
                window.location.href = "/dashboard";
            }
        } catch (error) {
            console.error("Error updating role:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) {
        return null;
    }

    if (isPending) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-default-50 to-default-100">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!session) {
        router.push("/");
        return null;
    }

    if (isOnboarded) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-default-50 to-default-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -right-40 size-80 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-success/5 blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-[800px] text-center mb-10">
                <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary/10 mb-6">
                    <Icon icon="lucide:sparkles" className="size-8 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                    Welcome to{" "}
                    <span className="bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
                        Recruitment AI
                    </span>
                </h1>
                <p className="text-lg text-default-500 max-w-lg mx-auto">
                    Choose how you want to use the platform. You can always update your choice later.
                </p>
            </div>

            <div className="relative z-10 grid md:grid-cols-2 gap-6 w-full max-w-[700px]">
                <Card
                    isPressable
                    isDisabled={loading}
                    onPress={() => handleSelectRole("candidat")}
                    className={`flex-1 p-8 border-2 transition-all duration-200 shadow-sm hover:shadow-lg group cursor-pointer
                        ${selected === "candidat" && loading
                            ? "border-primary bg-primary-50 shadow-md"
                            : "border-transparent hover:border-primary/30 hover:-translate-y-1"
                        }`}
                >
                    <CardBody className="text-center flex flex-col items-center gap-4">
                        <Icon icon="lucide:user-search" className="size-12 text-primary" />
                        <div>
                            <h2 className="text-xl font-bold mb-1">Job Seeker</h2>
                            <p className="text-xs text-default-400 uppercase tracking-wider font-semibold">Candidat</p>
                        </div>
                        <p className="text-sm text-default-500 leading-relaxed">
                            Browse job opportunities, upload your CV, and take technical tests to showcase your skills.
                        </p>
                        <span
                            className={`mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                                ${selected === "candidat" && loading
                                    ? "bg-primary text-white"
                                    : "bg-primary/10 text-primary group-hover:bg-primary/20"
                                }`}
                        >
                            {selected === "candidat" && loading && (
                                <Icon icon="lucide:loader-2" className="animate-spin size-4" />
                            )}
                            {selected === "candidat" && loading ? "Redirecting..." : "Get Started"}
                        </span>
                    </CardBody>
                </Card>

                <Card
                    isPressable
                    isDisabled={loading}
                    onPress={() => handleSelectRole("recruteur")}
                    className={`flex-1 p-8 border-2 transition-all duration-200 shadow-sm hover:shadow-lg group cursor-pointer
                        ${selected === "recruteur" && loading
                            ? "border-success bg-success-50 shadow-md"
                            : "border-transparent hover:border-success/30 hover:-translate-y-1"
                        }`}
                >
                    <CardBody className="text-center flex flex-col items-center gap-4">
                        <Icon icon="lucide:briefcase" className="size-12 text-success" />
                        <div>
                            <h2 className="text-xl font-bold mb-1">Recruiter</h2>
                            <p className="text-xs text-default-400 uppercase tracking-wider font-semibold">Recruteur</p>
                        </div>
                        <p className="text-sm text-default-500 leading-relaxed">
                            Post job offers, browse candidate profiles, and leverage AI insights to find the best talent.
                        </p>
                        <span
                            className={`mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                                ${selected === "recruteur" && loading
                                    ? "bg-success text-white"
                                    : "bg-success/10 text-success group-hover:bg-success/20"
                                }`}
                        >
                            {selected === "recruteur" && loading && (
                                <Icon icon="lucide:loader-2" className="animate-spin size-4" />
                            )}
                            {selected === "recruteur" && loading ? "Redirecting..." : "Get Started"}
                        </span>
                    </CardBody>
                </Card>
            </div>

            <p className="relative z-10 mt-10 text-xs text-default-400">
                {session.user?.name} &middot; {session.user?.email}
            </p>
        </div>
    );
}
"use client";
import React, { useState, useEffect } from "react";
import LoginCard from "@/components/LoginCard";
import RegisterCard from "@/components/RegisterCard";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";

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
            if (isOnboarded) {
                router.push("/dashboard");
            } else {
                router.push("/welcome");
            }
        }
    }, [session, router, mounted]);

    if (!mounted || isPending) {
        return null;
    }

    return (
        <>
            {view === "login" ? (
                <LoginCard setView={setView} />
            ) : (
                <RegisterCard setView={setView} />
            )}
        </>
    );
}

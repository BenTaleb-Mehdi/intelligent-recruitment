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

    useEffect(() => {
        if (session) {
            router.push("/dashboard");
        }
    }, [session, router]);

    if (isPending) {
        return <Spinner size="lg" label="Checking session..." />;
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

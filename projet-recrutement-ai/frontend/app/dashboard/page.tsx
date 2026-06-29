"use client";
import React, { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Spinner, Card } from "@heroui/react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function DashboardPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/");
        }
    }, [session, isPending, router]);

    if (isPending) return <div className="h-screen w-screen flex justify-center items-center"><Spinner size="lg" /></div>;
    if (!session) return null;

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-default-50">
            <DashboardSidebar />
            <div className="flex flex-col flex-1 h-full overflow-y-auto">
                <DashboardNavbar userName={session?.user?.name} />
                <main className="p-6 flex-1">
                    <Card className="p-6 shadow-sm">
                        <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard! 🎉</h2>
                        <p className="text-default-500">
                            This page is built with TypeScript (TSX) and HeroUI components.
                        </p>
                    </Card>
                </main>
            </div>
        </div>
    );
}
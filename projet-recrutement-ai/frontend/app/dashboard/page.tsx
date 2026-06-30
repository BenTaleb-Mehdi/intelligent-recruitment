"use client";
import React, { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Spinner, Card } from "@heroui/react";
import { Sidebar } from "@/components/ui/sidebar";
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
        <Sidebar.Provider
            variant="sidebar"
            collapsible="icon"
            defaultOpen
            navigate={router.push}
        >
            <DashboardSidebar />
            <Sidebar.Main>
                <DashboardNavbar userName={session?.user?.name} />
                <div className="p-6 flex-1 bg-default-50 min-h-[calc(100vh-64px)]">
                    <Card className="p-6 shadow-sm">
                        <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard! 🎉</h2>
                        <p className="text-default-500">
                            This page is built with TypeScript (TSX) and HeroUI components.
                        </p>
                    </Card>
                </div>
            </Sidebar.Main>
        </Sidebar.Provider>
    );
}
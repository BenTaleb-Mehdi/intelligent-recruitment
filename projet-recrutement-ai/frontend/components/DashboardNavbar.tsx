"use client";
import React from "react";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { Icon } from "@iconify/react";

interface DashboardNavbarProps {
    userName?: string;
}

export default function DashboardNavbar({ userName = "User" }: DashboardNavbarProps) {
    const router = useRouter();
    const { toggleSidebar } = useSidebar();

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/");
    };

    return (
        <header className="flex items-center justify-between h-16 px-4 border-b border-divider bg-content1">
            <div className="flex items-center gap-2">
                <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={toggleSidebar}
                    aria-label="Toggle sidebar"
                    className="md:hidden"
                >
                    <Icon icon="lucide:menu" className="size-5" />
                </Button>
                <span className="font-bold text-base md:hidden">Recruitment AI</span>
            </div>

            <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {userName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                    <p className="text-sm font-medium">{userName}</p>
                </div>
                <Button
                    color="danger"
                    variant="flat"
                    size="sm"
                    onPress={handleLogout}
                    className="font-medium"
                >
                    Sign Out
                </Button>
            </div>
        </header>
    );
}

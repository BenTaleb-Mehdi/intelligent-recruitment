"use client";
import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface DashboardNavbarProps {
    userName?: string;
}

export default function DashboardNavbar({ userName = "User" }: DashboardNavbarProps) {
    const router = useRouter();

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/");
    };

    return (
        <Navbar isBordered className="w-full max-h-[64px] bg-content1">
            <NavbarBrand>
                <p className="font-bold text-inherit text-lg">Recruitment AI</p>
            </NavbarBrand>
            <NavbarContent justify="end">
                <NavbarItem className="mr-4 hidden sm:flex">
                    <p className="text-sm text-default-600">Welcome, <span className="font-semibold">{userName}</span></p>
                </NavbarItem>
                <NavbarItem>
                    <Button color="danger" variant="flat" size="sm" onPress={handleLogout}>Sign Out</Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
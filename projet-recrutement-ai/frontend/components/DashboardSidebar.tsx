"use client";
import React from "react";
import { Link } from "@heroui/react";

export default function DashboardSidebar() {
    return (
        <div className="w-[260px] h-screen bg-content2 border-r border-divider flex flex-col p-4 gap-6 hidden md:flex">
            <div className="px-2 py-4 border-b border-divider">
                <h2 className="text-xl font-black text-primary">DASHBOARD</h2>
            </div>
            <nav className="flex flex-col gap-2">
                <Link href="/dashboard" className="p-3 rounded-xl bg-primary/10 text-primary font-medium w-full block">
                    📊 Overview
                </Link>
                <Link href="#" className="p-3 rounded-xl text-default-600 hover:bg-default-100 w-full block">
                    👤 Profile
                </Link>
                <Link href="#" className="p-3 rounded-xl text-default-600 hover:bg-default-100 w-full block">
                    ⚙️ Settings
                </Link>
            </nav>
        </div>
    );
}
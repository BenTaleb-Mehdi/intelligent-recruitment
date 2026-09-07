"use client";
import { authClient } from "@/lib/auth-client";
import { Button, Dropdown } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { Icon } from "@iconify/react";
import { ThemeToggleButton } from "@/components/charts/atoms/ThemeToggleButton";
import NotificationDropdown from "@/components/charts/molecules/NotificationDropdown";

interface DashboardNavbarProps {
    userName?: string;
    userEmail?: string;
}

export default function DashboardNavbar({ userName = "User", userEmail = "" }: DashboardNavbarProps) {
    const router = useRouter();
    const { toggleSidebar } = useSidebar();

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/");
    };

    return (
        <header className="flex items-center justify-between h-16 px-4 border-b border-default-200 bg-background">
            <div className="flex items-center gap-2">
                <Button isIconOnly variant="ghost" size="sm" onPress={toggleSidebar} aria-label="Toggle sidebar" className="md:hidden">
                    <Icon icon="solar:hamburger-menu-bold" className="text-lg" />
                </Button>
                <span className="font-bold text-base text-default-900 md:hidden">Recruitment AI</span>
            </div>

            <div className="flex items-center gap-2">
                <ThemeToggleButton />
                <NotificationDropdown />

                <Dropdown>
                    <Dropdown.Trigger>
                        <button className="flex items-center gap-3 cursor-pointer">
                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium text-default-900">{userName}</p>
                            </div>
                            <Icon icon="solar:alt-arrow-down-bold" className="text-sm text-default-400" />
                        </button>
                    </Dropdown.Trigger>
                    <Dropdown.Popover placement="bottom end">
                        <Dropdown.Menu>
                            <Dropdown.Item className="opacity-70">{userEmail}</Dropdown.Item>
                            <Dropdown.Item><Icon icon="solar:user-bold" className="mr-2" /> Edit profile</Dropdown.Item>
                            <Dropdown.Item><Icon icon="solar:settings-bold" className="mr-2" /> Account settings</Dropdown.Item>
                            <Dropdown.Item onClick={handleLogout}><Icon icon="solar:logout-2-bold" className="mr-2" /> Sign out</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Popover>
                </Dropdown>
            </div>
        </header>
    );
}
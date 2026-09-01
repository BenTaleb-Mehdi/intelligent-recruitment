"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { usePathname, useRouter } from "next/navigation";

interface NavbarSearchMobileProps {
  onSearch?: () => void;
}

export function NavbarSearchMobile({ onSearch }: NavbarSearchMobileProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const isAdmin = pathname.startsWith("/admin");

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    if (isAdmin) {
      router.push(`/admin/users?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(`/dashboard?search=${encodeURIComponent(trimmed)}`);
    }
    setOpen(false);
    onSearch?.();
  };

  if (!open) {
    return (
      <Button
        isIconOnly
        variant="ghost"
        size="sm"
        aria-label="Search"
        className="md:hidden"
        onPress={() => setOpen(true)}
      >
        <Icon icon="lucide:search" className="size-5" />
      </Button>
    );
  }

  return (
    <form
      className="absolute inset-x-0 top-0 z-20 flex h-16 items-center gap-2 border-b border-default-200 bg-content1 px-4 md:hidden"
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
    >
      <div className="relative flex flex-1 items-center">
        <Icon
          icon="lucide:search"
          className="pointer-events-none absolute left-3 size-4 text-default-400"
        />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full rounded-lg border border-default-200 bg-default-50 py-2 pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary dark:border-default-100/20 dark:bg-default-100/10"
        />
      </div>
      <Button isIconOnly variant="ghost" size="sm" aria-label="Close search" onPress={() => setOpen(false)}>
        <Icon icon="lucide:x" className="size-5" />
      </Button>
    </form>
  );
}

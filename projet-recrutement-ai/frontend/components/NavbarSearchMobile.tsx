"use client";

import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
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
        variant="light"
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
      <Input
        autoFocus
        value={query}
        onValueChange={setQuery}
        placeholder="Search..."
        size="sm"
        variant="bordered"
        startContent={<Icon icon="lucide:search" className="size-4 text-default-400" />}
        className="flex-1"
      />
      <Button isIconOnly variant="light" size="sm" aria-label="Close search" onPress={() => setOpen(false)}>
        <Icon icon="lucide:x" className="size-5" />
      </Button>
    </form>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { usePathname, useRouter } from "next/navigation";

export default function NavbarSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const isAdmin = pathname.startsWith("/admin");

  const placeholder = isAdmin
    ? "Search users, emails, IDs..."
    : "Search jobs, candidates, skills...";

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    if (isAdmin) {
      router.push(`/admin/users?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(`/dashboard?search=${encodeURIComponent(trimmed)}`);
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("navbar-search")?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <form
      className="hidden flex-1 max-w-md mx-4 md:flex"
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch(query);
      }}
    >
      <Input
        id="navbar-search"
        value={query}
        onValueChange={setQuery}
        placeholder={placeholder}
        size="sm"
        variant="bordered"
        startContent={<Icon icon="lucide:search" className="size-4 text-default-400" />}
        endContent={
          <kbd className="hidden rounded-md border border-default-200 bg-default-100 px-1.5 py-0.5 text-[10px] font-medium text-default-500 lg:inline-block dark:border-default-100/20">
            ⌘K
          </kbd>
        }
        classNames={{
          inputWrapper: "bg-default-50 dark:bg-default-100/10 border-default-200 dark:border-default-100/20",
        }}
        isClearable
        onClear={() => setQuery("")}
      />
    </form>
  );
}

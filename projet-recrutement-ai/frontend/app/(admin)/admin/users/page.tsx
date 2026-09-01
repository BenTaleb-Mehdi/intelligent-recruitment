"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  Button,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import PageHeader from "@/components/admin/PageHeader";
import UsersTableSkeleton from "@/components/admin/UsersTableSkeleton";
import { fetchAdminUsers, type AdminUser } from "@/services/adminService";

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

function truncateId(id: string) {
  return id.length > 14 ? `${id.slice(0, 12)}…` : id;
}

function roleColor(role: string): "default" | "success" | "danger" | "warning" | "accent" {
  const r = role?.toUpperCase();
  if (r === "ADMIN") return "danger";
  if (r === "RECRUITER" || r === "RECRUTEUR") return "success";
  if (r === "CANDIDATE" || r === "CANDIDAT") return "accent";
  return "default";
}

function roleLabel(role: string) {
  const r = role?.toUpperCase();
  if (r === "CANDIDATE" || r === "CANDIDAT") return "Candidat";
  if (r === "RECRUITER" || r === "RECRUTEUR") return "Recruteur";
  if (r === "ADMIN") return "Admin";
  return role;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const q = searchParams.get("search") ?? "";
    setSearch(q);
    setDebouncedSearch(q);
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, limit]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdminUsers({ page, limit, search: debouncedSearch });
      setUsers(res.users);
      setTotalPages(res.pagination.totalPages);
      setTotal(res.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const copyId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Manage Users"
        description={`${total} registered user${total !== 1 ? "s" : ""} on the platform`}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Manage Users" },
        ]}
      />

      {error && (
        <Card className="mb-4 border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
          {error}
        </Card>
      )}

      {loading && users.length === 0 ? (
        <UsersTableSkeleton />
      ) : (
        <Card className="overflow-hidden border border-default-200 bg-content1 shadow-sm dark:border-default-100/20">
          <div className="border-b border-default-200 p-4 dark:border-default-100/20">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-md flex flex-1 items-center">
                <Icon icon="lucide:search" className="pointer-events-none absolute left-3 size-4 text-default-400" />
                <input
                  placeholder="Search by id, name, or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-default-200 bg-default-50 py-2 pl-9 pr-8 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary dark:border-default-100/20 dark:bg-default-100/10"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2 text-default-400 hover:text-default-600"
                    aria-label="Clear"
                  >
                    <Icon icon="lucide:x" className="size-3.5" />
                  </button>
                )}
              </div>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="h-9 rounded-lg border border-default-200 bg-content1 px-3 text-sm font-medium text-foreground dark:border-default-100/20"
                aria-label="Items per page"
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n} per page
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={`overflow-x-auto ${loading ? "opacity-60" : ""}`}>
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-default-200 bg-default-50 dark:border-default-100/20 dark:bg-default-100/5">
                  {["Id", "Name", "Email", "Email Verified", "Role", "Joined At", "Actions"].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-default-500"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-default-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-default-100 transition hover:bg-default-50 dark:border-default-100/10 dark:hover:bg-default-100/5"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <code className="text-xs text-default-600">{truncateId(user.id)}</code>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="ghost"
                            aria-label="Copy ID"
                            onPress={() => copyId(user.id)}
                          >
                            <Icon
                              icon={copiedId === user.id ? "lucide:check" : "lucide:copy"}
                              className={`size-3.5 ${copiedId === user.id ? "text-success" : "text-default-400"}`}
                            />
                          </Button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-foreground">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-default-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <Chip
                          size="sm"
                          variant="soft"
                          color={user.emailVerified ? "success" : "warning"}
                        >
                          {user.emailVerified ? "Verified" : "Pending"}
                        </Chip>
                      </td>
                      <td className="px-4 py-3">
                        <Chip size="sm" variant="soft" color={roleColor(user.role)}>
                          {roleLabel(user.role)}
                        </Chip>
                      </td>
                      <td className="px-4 py-3 text-sm text-default-500">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-3">
                        <Dropdown>
                          <DropdownTrigger>
                            <Button isIconOnly size="sm" variant="ghost" aria-label="Actions">
                              <Icon icon="lucide:more-horizontal" className="size-4" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="User actions">
                            <DropdownItem
                              key="view"
                              onClick={() => router.push(`/admin/users/${user.id}`)}
                            >
                              <div className="flex items-center gap-2">
                                <Icon icon="lucide:eye" className="size-4" />
                                <span>View profile</span>
                              </div>
                            </DropdownItem>
                            <DropdownItem
                              key="report"
                              onClick={() => router.push("/admin/reported")}
                            >
                              <div className="flex items-center gap-2 text-warning">
                                <Icon icon="lucide:flag" className="size-4" />
                                <span>View reports</span>
                              </div>
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-default-200 p-4 dark:border-default-100/20">
              <p className="text-sm text-default-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  isDisabled={page <= 1}
                  onPress={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  isDisabled={page >= totalPages}
                  onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

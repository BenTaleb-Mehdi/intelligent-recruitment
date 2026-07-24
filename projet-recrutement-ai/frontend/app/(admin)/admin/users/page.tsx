"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Card,
  Input,
  Button,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Select,
  SelectItem,
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

function roleColor(role: string): "primary" | "success" | "danger" | "default" {
  if (role === "admin") return "danger";
  if (role === "recruteur") return "success";
  if (role === "candidat") return "primary";
  return "default";
}

function roleLabel(role: string) {
  if (role === "candidat") return "Candidat";
  if (role === "recruteur") return "Recruteur";
  if (role === "admin") return "Admin";
  return role;
}

export default function AdminUsersPage() {
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
              <Input
                placeholder="Search by id, name, or email..."
                value={search}
                onValueChange={setSearch}
                startContent={<Icon icon="lucide:search" className="size-4 text-default-400" />}
                className="max-w-md"
                variant="bordered"
                size="sm"
                isClearable
                onClear={() => setSearch("")}
              />
              <Select
                label="Per page"
                selectedKeys={new Set([String(limit)])}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0];
                  if (val) setLimit(Number(val));
                }}
                className="w-36"
                size="sm"
                variant="bordered"
              >
                {[5, 10, 20, 50].map((n) => (
                  <SelectItem key={String(n)} textValue={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </Select>
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
                            variant="light"
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
                          variant="flat"
                          color={user.emailVerified ? "success" : "warning"}
                        >
                          {user.emailVerified ? "Verified" : "Pending"}
                        </Chip>
                      </td>
                      <td className="px-4 py-3">
                        <Chip size="sm" variant="flat" color={roleColor(user.role)}>
                          {roleLabel(user.role)}
                        </Chip>
                      </td>
                      <td className="px-4 py-3 text-sm text-default-500">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-3">
                        <Dropdown>
                          <DropdownTrigger>
                            <Button isIconOnly size="sm" variant="light" aria-label="Actions">
                              <Icon icon="lucide:more-horizontal" className="size-4" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="User actions">
                            <DropdownItem
                              key="view"
                              startContent={<Icon icon="lucide:eye" className="size-4" />}
                              as={Link}
                              href={`/admin/users/${user.id}`}
                            >
                              View profile
                            </DropdownItem>
                            <DropdownItem
                              key="report"
                              startContent={<Icon icon="lucide:flag" className="size-4" />}
                              className="text-warning"
                            >
                              View reports
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
              <Pagination
                total={totalPages}
                page={page}
                onChange={setPage}
                size="sm"
                showControls
                color="primary"
              />
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

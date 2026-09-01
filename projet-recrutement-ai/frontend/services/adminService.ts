import { apiFetch } from "@/lib/api";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: string;
  isOnboarded: boolean;
  createdAt: string;
  image: string | null;
}

export interface AdminStats {
  totalUsers: number;
  candidats: number;
  recruteurs: number;
  admins: number;
  newThisWeek: number;
  verifiedEmails: number;
  onboardedUsers: number;
  pendingReports: number;
  jobOffers: number;
  applications: number;
  quizResults: number;
}

export interface UsersResponse {
  success: boolean;
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StatsResponse {
  success: boolean;
  stats: AdminStats;
}

export function fetchAdminStats() {
  return apiFetch<StatsResponse>("/api/admin/stats");
}

export function fetchAdminUsers(params: { page?: number; limit?: number; search?: string }) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  return apiFetch<UsersResponse>(`/api/admin/users?${query.toString()}`);
}

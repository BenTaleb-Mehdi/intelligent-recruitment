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

export interface AdminUserDetail extends AdminUser {
  candidate: {
    id: string;
    title: string;
    phone: string | null;
    location: string | null;
    status: string;
    employabilityScore: number;
    _count: { applications: number; testResults: number };
  } | null;
  recruiter: {
    id: string;
    companyName: string | null;
    industry: string | null;
    headquarters: string | null;
    verificationStatus: string;
    _count: { jobOffers: number };
  } | null;
}

export type AdminQuizStatus = "PENDING" | "VALIDATED" | "REJECTED";

export interface AdminQuiz {
  id: string;
  title: string;
  skillTarget: string;
  status: AdminQuizStatus;
  duration: number;
  deadline: string | null;
  createdAt: string;
  averageScore: number | null;
  jobOffer: {
    id: string;
    title: string;
    recruiter: { id: string; companyName: string | null };
  };
  _count: { questions: number; testResults: number };
}

export interface AdminQuizResult {
  id: string;
  score: number;
  passed: boolean;
  completedAt: string;
  candidate: {
    id: string;
    title: string;
    user: { id: string; name: string; email: string; image: string | null };
  };
  quiz: {
    id: string;
    title: string;
    _count: { questions: number };
    jobOffer: {
      id: string;
      title: string;
      recruiter: { id: string; companyName: string | null };
    };
  };
}

export interface AdminQuizResultDetail extends Omit<AdminQuizResult, "candidate" | "quiz"> {
  candidate: AdminQuizResult["candidate"] & {
    bio: string | null;
    phone: string | null;
    location: string | null;
    experience: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
    portfolioUrl: string | null;
    cvPath: string | null;
    skills: Array<{ id: string; name: string }>;
  };
  quiz: Omit<AdminQuizResult["quiz"], "_count" | "jobOffer"> & {
    skillTarget: string;
    status: AdminQuizStatus;
    duration: number;
    deadline: string | null;
    questions: Array<{
      id: string;
      text: string;
      options: string[];
      correctAnswer: number;
    }>;
    jobOffer: {
      id: string;
      title: string;
      recruiter: {
        id: string;
        companyName: string | null;
        user: { id: string; name: string; email: string };
      };
    };
  };
}

interface DataResponse<T> {
  success: boolean;
  data: T;
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

export function fetchAdminUser(id: string) {
  return apiFetch<{ success: boolean; user: AdminUserDetail }>(`/api/admin/users/${id}`);
}

export function fetchAdminQuizzes() {
  return apiFetch<DataResponse<AdminQuiz[]>>("/api/admin/quizzes");
}

export function fetchAdminQuizResults() {
  return apiFetch<DataResponse<AdminQuizResult[]>>("/api/admin/quiz-results");
}

export function fetchAdminQuizResult(id: string) {
  return apiFetch<DataResponse<AdminQuizResultDetail>>(`/api/admin/quiz-results/${id}`);
}

export function updateAdminQuizStatus(id: string, status: AdminQuizStatus) {
  return apiFetch<DataResponse<AdminQuiz>>(`/api/admin/quizzes/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

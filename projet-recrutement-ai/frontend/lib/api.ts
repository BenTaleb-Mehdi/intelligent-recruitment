const API_BASE = "http://localhost:5000";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${url}`, {
        headers: { "Content-Type": "application/json", ...options?.headers },
        credentials: "include",
        ...options,
    });
    const text = await res.text();
    let json: any;
    try {
        json = JSON.parse(text);
    } catch {
        throw new Error(`Request failed (${res.status}): ${text.slice(0, 200)}`);
    }
    if (!res.ok) throw new Error(json.error || json.message || "Request failed");
    return json;
}

export const api = {
    get: <T>(url: string) => request<T>(url),
    post: <T>(url: string, body: unknown) =>
        request<T>(url, { method: "POST", body: JSON.stringify(body) }),
    upload: async <T>(url: string, formData: FormData): Promise<T> => {
        const res = await fetch(`${API_BASE}${url}`, {
            method: "POST",
            body: formData,
            credentials: "include",
        });
        const text = await res.text();
        let json: any;
        try {
            json = JSON.parse(text);
        } catch {
            throw new Error(`Upload failed (${res.status}): ${text.slice(0, 200)}`);
        }
        if (!res.ok) throw new Error(json.error || json.message || "Upload failed");
        return json;
    },
    put: <T>(url: string, body: unknown) =>
        request<T>(url, { method: "PUT", body: JSON.stringify(body) }),
    patch: <T>(url: string, body?: unknown) =>
        request<T>(url, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
    delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};


export interface ApiRecruiter {
    id: string;
    userId: string;
    companyName: string;
    website?: string;
    industry?: string;
    teamSize?: string;
    headquarters?: string;
    description?: string;
    logo?: string;
    contractTypes?: string;
    locations?: string;
    experienceLevels?: string;
    user: { id: string; name: string; email: string; image?: string };
}

export interface ApiJobOffer {
    id: string;
    recruiterId: string;
    title: string;
    description: string;
    contractType: string;
    locationType: string;
    salary?: string;
    experienceYears: number;
    location?: string;
    status: "OPEN" | "CLOSED";
    createdAt: string;
    recruiter?: { id: string; companyName: string };
    skills: { id: string; name: string }[];
    _count?: { applications: number };
    applications?: any[];
    quiz?: any;
}

export interface RecruiterStats {
    totalJobOffers: number;
    openJobs: number;
    totalApplications: number;
    interviewCount: number;
    avgMatchScore: number;
}

export interface ApiApplication {
    id: string;
    status: string;
    matchScore: number;
    matchExplanation?: string;
    appliedDate: string;
    candidate: {
        id: string;
        userId: string;
        title: string;
        user: { id: string; name: string; email: string; image?: string };
    };
    jobOffer: { id: string; title: string };
}

export type DropdownType = "CONTRACT_TYPE" | "LOCATION" | "EXPERIENCE_LEVEL";

export interface ApiDropdownItem {
    id: string;
    recruiterId: string;
    type: DropdownType;
    value: string;
    createdAt: string;
}

import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("sa_token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const json = await res.json();
  return json as ApiResponse<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (body: LoginRequest) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  register: (body: RegisterRequest) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  me: () => request<AuthResponse["user"]>("/auth/me"),
};

// ─── Public endpoints ─────────────────────────────────────────────────────────

export const publicApi = {
  getServices: () => request("/services"),
  getService: (slug: string) => request(`/services/${slug}`),
  getPortfolio: () => request("/portfolio"),
  getPortfolioItem: (slug: string) => request(`/portfolio/${slug}`),
  getGallery: (category?: string) =>
    request(`/gallery${category ? `?category=${category}` : ""}`),
  getBlogs: () => request("/blogs"),
  getBlog: (slug: string) => request(`/blogs/${slug}`),
  getTestimonials: () => request("/testimonials"),
  getSettings: () => request("/settings"),
  submitContact: (body: unknown) =>
    request("/contact", { method: "POST", body: JSON.stringify(body) }),
  submitQuoteRequest: (body: unknown) =>
    request("/leads", { method: "POST", body: JSON.stringify(body) }),
};

// ─── Customer portal ──────────────────────────────────────────────────────────

export const customerApi = {
  getProfile: () => request("/customers/profile"),
  updateProfile: (body: unknown) =>
    request("/customers/profile", { method: "PUT", body: JSON.stringify(body) }),
  getMyQuotes: () => request("/quotes/my"),
  getMyProjects: () => request("/projects/my"),
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  getCustomers: () => request("/customers"),
  getLeads: () => request("/leads"),
  updateLead: (id: number, body: unknown) =>
    request(`/leads/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  getQuotes: () => request("/quotes"),
  createQuote: (body: unknown) =>
    request("/quotes", { method: "POST", body: JSON.stringify(body) }),
  updateQuote: (id: number, body: unknown) =>
    request(`/quotes/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  getProjects: () => request("/projects"),
  createProject: (body: unknown) =>
    request("/projects", { method: "POST", body: JSON.stringify(body) }),
  updateProject: (id: number, body: unknown) =>
    request(`/projects/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  getContactRequests: () => request("/contact"),
};

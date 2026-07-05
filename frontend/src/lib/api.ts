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
  getServiceById: (id: number) => request(`/services/${id}`),
  getPortfolio: () => request("/portfolio"),
  getPortfolioFeatured: () => request("/portfolio/featured"),
  getPortfolioItem: (id: number) => request(`/portfolio/${id}`),
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
  getQuote: (id: number) => request(`/quotes/${id}`),
  getMyProjects: () => request("/projects/my"),
  getProject: (id: number) => request(`/projects/${id}`),
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  // Customers
  getCustomers: () => request("/admin/customers"),

  // Leads
  getLeads: () => request("/admin/leads"),
  getLead: (id: number) => request(`/admin/leads/${id}`),
  updateLeadStatus: (id: number, status: string) =>
    request(`/admin/leads/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  // Quotes
  getQuotes: () => request("/admin/quotes"),
  getQuote: (id: number) => request(`/admin/quotes/${id}`),
  updateQuoteStatus: (id: number, status: string) =>
    request(`/admin/quotes/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  // Projects
  getProjects: () => request("/admin/projects"),
  getProject: (id: number) => request(`/admin/projects/${id}`),
  updateProjectStatus: (id: number, status: string) =>
    request(`/admin/projects/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  // Contact requests
  getContactRequests: () => request("/admin/contact-requests"),
  getContactRequest: (id: number) => request(`/admin/contact-requests/${id}`),

  // Services
  getServices: () => request("/admin/services"),
  createService: (body: unknown) =>
    request("/admin/services", { method: "POST", body: JSON.stringify(body) }),
  updateService: (id: number, body: unknown) =>
    request(`/admin/services/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteService: (id: number) =>
    request(`/admin/services/${id}`, { method: "DELETE" }),

  // Gallery
  getGalleryItems: () => request("/admin/gallery"),
  createGalleryItem: (body: unknown) =>
    request("/admin/gallery", { method: "POST", body: JSON.stringify(body) }),
  updateGalleryItem: (id: number, body: unknown) =>
    request(`/admin/gallery/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteGalleryItem: (id: number) =>
    request(`/admin/gallery/${id}`, { method: "DELETE" }),

  // Portfolio
  getPortfolioItems: () => request("/admin/portfolio"),
  createPortfolioItem: (body: unknown) =>
    request("/admin/portfolio", { method: "POST", body: JSON.stringify(body) }),
  updatePortfolioItem: (id: number, body: unknown) =>
    request(`/admin/portfolio/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deletePortfolioItem: (id: number) =>
    request(`/admin/portfolio/${id}`, { method: "DELETE" }),

  // Blog
  getBlogPosts: () => request("/admin/blogs"),
  createBlogPost: (body: unknown) =>
    request("/admin/blogs", { method: "POST", body: JSON.stringify(body) }),
  updateBlogPost: (id: number, body: unknown) =>
    request(`/admin/blogs/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteBlogPost: (id: number) =>
    request(`/admin/blogs/${id}`, { method: "DELETE" }),

  // Testimonials
  getTestimonials: () => request("/admin/testimonials"),
  createTestimonial: (body: unknown) =>
    request("/admin/testimonials", { method: "POST", body: JSON.stringify(body) }),
  updateTestimonial: (id: number, body: unknown) =>
    request(`/admin/testimonials/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteTestimonial: (id: number) =>
    request(`/admin/testimonials/${id}`, { method: "DELETE" }),

  // Settings
  getSettings: () => request("/admin/settings"),
  updateSetting: (key: string, value: string) =>
    request(`/admin/settings/${key}`, {
      method: "PUT",
      body: JSON.stringify({ value }),
    }),
};

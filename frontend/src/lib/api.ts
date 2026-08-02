import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is required.");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("sa_token") : null;
  const cleanToken =
    token && token !== "undefined" && token !== "null" ? token : null;

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
    ...options.headers,
  };

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error("NETWORK_ERROR");
  }

  try {
    const json = await res.json();
    if (!res.ok && json && typeof json === "object") {
      return json as ApiResponse<T>;
    }
    return json as ApiResponse<T>;
  } catch {
    throw new Error(`HTTP_${res.status}`);
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export function apiErrorMessage(
  response: ApiResponse<unknown> | null | undefined,
  fallback = "Request failed."
) {
  const message = response?.message?.trim();
  const fieldErrors = response?.errors
    ? Object.entries(response.errors)
        .map(([field, error]) => `${field}: ${error}`)
        .join(" ")
    : "";

  return [message, fieldErrors].filter(Boolean).join(" ") || fallback;
}

export function caughtApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    if (error.message === "NETWORK_ERROR") {
      return "Cannot reach the server. Please check your connection and try again.";
    }
    if (error.message.startsWith("HTTP_")) {
      return `${fallback} (${error.message})`;
    }
    return error.message;
  }

  return fallback;
}

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
  getPortfolioBySlug: (slug: string) => request(`/portfolio/${slug}`),
  getPortfolioImagesBySlug: (slug: string) => request(`/portfolio/${slug}/images`),
  getPortfolioItem: (id: number) => request(`/portfolio/${id}`),
  getGallery: (category?: string) =>
    request(`/gallery${category ? `?category=${encodeURIComponent(category)}` : ""}`),
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
  getMyQuotes: () => request("/quotes/my", { cache: "no-store" }),
  getQuote: (id: number) => request(`/quotes/${id}`),
  submitQuoteRequest: (body: { serviceType: string; description: string; companyName?: string }) =>
    request("/quotes", { method: "POST", body: JSON.stringify(body) }),
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
  getQuotes: () => request("/admin/quotes", { cache: "no-store" }),
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
  getGalleryItems: (category?: string) =>
    request(`/admin/gallery${category ? `?category=${encodeURIComponent(category)}` : ""}`),
  createGalleryItem: (body: unknown) =>
    request("/admin/gallery", { method: "POST", body: JSON.stringify(body) }),
  uploadGalleryItem: (body: FormData) =>
    request("/admin/gallery", { method: "POST", body }),
  updateGalleryItem: (id: number, body: unknown) =>
    request(`/admin/gallery/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteGalleryItem: (id: number) =>
    request(`/admin/gallery/${id}`, { method: "DELETE" }),
  reorderGalleryItems: (items: { galleryItemId: number; sortOrder: number }[]) =>
    request("/admin/gallery/reorder", {
      method: "PATCH",
      body: JSON.stringify({ items }),
    }),
  setGalleryPublished: (id: number, published: boolean) =>
    request(`/admin/gallery/${id}/publish`, {
      method: "PATCH",
      body: JSON.stringify({ published }),
    }),
  setGalleryFeatured: (id: number, featured: boolean) =>
    request(`/admin/gallery/${id}/featured`, {
      method: "PATCH",
      body: JSON.stringify({ featured }),
    }),

  // Portfolio
  getPortfolioItems: () => request("/admin/portfolio"),
  createPortfolioItem: (body: unknown) =>
    request("/admin/portfolio", { method: "POST", body: JSON.stringify(body) }),
  updatePortfolioItem: (id: number, body: unknown) =>
    request(`/admin/portfolio/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deletePortfolioItem: (id: number) =>
    request(`/admin/portfolio/${id}`, { method: "DELETE" }),
  setPortfolioPublished: (id: number, published: boolean) =>
    request(`/admin/portfolio/${id}/publish`, {
      method: "PATCH",
      body: JSON.stringify({ published }),
    }),
  setPortfolioFeatured: (id: number, featured: boolean) =>
    request(`/admin/portfolio/${id}/featured`, {
      method: "PATCH",
      body: JSON.stringify({ featured }),
    }),
  getPortfolioImages: (projectId: number) =>
    request(`/admin/portfolio/${projectId}/images`),
  uploadPortfolioImage: (projectId: number, body: FormData) =>
    request(`/admin/portfolio/${projectId}/images`, { method: "POST", body }),
  updatePortfolioImage: (projectId: number, imageId: number, body: unknown) =>
    request(`/admin/portfolio/${projectId}/images/${imageId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deletePortfolioImage: (projectId: number, imageId: number) =>
    request(`/admin/portfolio/${projectId}/images/${imageId}`, { method: "DELETE" }),
  reorderPortfolioImages: (
    projectId: number,
    images: { imageId: number; sortOrder: number }[]
  ) =>
    request(`/admin/portfolio/${projectId}/images/reorder`, {
      method: "PATCH",
      body: JSON.stringify({ images }),
    }),
  setPortfolioCoverImage: (projectId: number, imageId: number) =>
    request(`/admin/portfolio/${projectId}/images/${imageId}/cover`, {
      method: "PATCH",
    }),
  addPortfolioImagesToGallery: (
    projectId: number,
    body: {
      imageIds: number[];
      title?: string;
      category?: string;
      altText?: string;
      caption?: string;
      featured?: boolean;
      published?: boolean;
    }
  ) =>
    request(`/admin/portfolio/${projectId}/images/gallery`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

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

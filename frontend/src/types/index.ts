// ─── Auth ─────────────────────────────────────────────────────────────────────

export type UserRole = "ROLE_ADMIN" | "ROLE_CUSTOMER";

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  tokenType: "Bearer";
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: Record<string, string>;
}

// ─── Customer ─────────────────────────────────────────────────────────────────

export interface Customer {
  id: number;
  userId: number;
  companyName?: string;
  gstNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

// ─── Lead ─────────────────────────────────────────────────────────────────────

export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST";

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceType: string;
  message: string;
  source: string;
  status: LeadStatus;
  createdAt: string;
}

// ─── Quote ────────────────────────────────────────────────────────────────────

export type QuoteStatus = "PENDING" | "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "EXPIRED";

export interface QuoteItem {
  id: number;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface Quote {
  id: number;
  referenceNo: string;
  title: string;
  description?: string;
  status: QuoteStatus;
  totalAmount?: number;
  validUntil?: string;
  customerId?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  companyName?: string;
  items?: QuoteItem[];
  createdAt: string;
  updatedAt?: string;
}

// ─── Project ──────────────────────────────────────────────────────────────────

export type ProjectStatus =
  | "PLANNED"
  | "IN_PROGRESS"
  | "QUALITY_CHECK"
  | "INSTALLATION"
  | "COMPLETED"
  | "CANCELLED";

export interface Project {
  id: number;
  referenceNo: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  startDate?: string;
  estimatedCompletion?: string;
  actualCompletion?: string;
  createdAt: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export interface Service {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon?: string;
  imageUrl?: string;
  displayOrder: number;
}

// ─── Portfolio ────────────────────────────────────────────────────────────────

export interface PortfolioItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  clientName?: string;
  serviceId?: number;
  service?: Service;
  images?: string[];
  tags?: string[];
  isFeatured: boolean;
  displayOrder?: number;
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

export interface GalleryItem {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
  isFeatured: boolean;
  displayOrder: number;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  tags: string[];
  status: BlogStatus;
  publishedAt?: string;
  createdAt: string;
}

// ─── Testimonial ──────────────────────────────────────────────────────────────

export interface Testimonial {
  id: number;
  customerName: string;
  company?: string;
  content: string;
  rating: number;
  imageUrl?: string;
  displayOrder: number;
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export interface ContactRequest {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  status: "NEW" | "READ" | "RESOLVED";
  createdAt: string;
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export interface SiteSetting {
  key: string;
  value: string;
  description?: string;
}

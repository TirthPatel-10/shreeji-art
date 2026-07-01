# Architecture — Shreeji Art

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET / CDN                          │
└──────────────────────┬──────────────────────────────────────────┘
                       │
          ┌────────────▼─────────────┐
          │    Vercel Edge Network   │
          │  (Next.js 14 App Router) │
          │  frontend/               │
          └────────────┬─────────────┘
                       │ HTTPS REST (JSON)
          ┌────────────▼─────────────┐
          │  Railway (Spring Boot)   │
          │  backend/                │
          │  Port 8080               │
          │                          │
          │  Spring Security + JWT   │
          │  Spring Data JPA         │
          └────────────┬─────────────┘
                       │ JDBC / SSL
          ┌────────────▼─────────────┐
          │   Supabase (PostgreSQL)  │
          │   database/              │
          └──────────────────────────┘
```

---

## Frontend — Next.js 14

### Router Strategy: App Router

```
frontend/src/app/
├── (public)/          # Public website — no auth required
│   ├── page.tsx       # /  (home)
│   ├── about/
│   ├── services/
│   ├── portfolio/
│   ├── gallery/
│   ├── blog/
│   ├── contact/
│   └── quote/
├── (auth)/            # Login / Register pages
│   ├── login/
│   └── register/
├── (customer)/        # Customer portal — ROLE_CUSTOMER required
│   ├── layout.tsx     # Auth guard + portal layout
│   ├── dashboard/
│   ├── quotes/
│   ├── projects/
│   └── profile/
└── (admin)/           # Admin dashboard — ROLE_ADMIN required
    └── admin/
        ├── layout.tsx # Auth guard + admin sidebar
        ├── dashboard/
        ├── customers/
        ├── leads/
        ├── quotes/
        ├── projects/
        ├── portfolio/
        ├── services/
        ├── blog/
        ├── contacts/
        ├── testimonials/
        ├── settings/
        └── profile/
```

### Key Frontend Libraries
- **Next.js 14** — App Router, Server Components, Image optimization
- **Tailwind CSS 3** — Utility-first styling
- **shadcn/ui** — Accessible component library built on Radix UI
- **lucide-react** — Icon set
- **clsx + tailwind-merge** — Conditional class merging

### Auth Flow (Frontend)
1. User submits login form → POST `/api/v1/auth/login`
2. Server returns `{ token, user }` as JSON
3. Token stored in `localStorage` (or `httpOnly` cookie — prefer cookie in prod)
4. All API calls include `Authorization: Bearer <token>` header
5. Route guards in Next.js layouts check token + role before rendering

---

## Backend — Spring Boot 3 / Java 21

### Module Structure

```
com.shreejiart/
├── common/
│   ├── config/        # SecurityConfig, CorsConfig
│   ├── jwt/           # JwtUtil, JwtAuthFilter
│   ├── security/      # UserDetailsServiceImpl
│   ├── exception/     # GlobalExceptionHandler, ResourceNotFoundException
│   └── response/      # ApiResponse<T> wrapper
├── auth/              # AuthController, AuthService, DTOs
├── users/             # User entity, UserRole, UserRepository, UserService
├── customers/         # Customer entity + repo
├── leads/             # Lead entity + repo
├── quotes/            # Quote entity + repo
├── projects/          # Project entity + repo
├── services/          # ServiceItem entity + repo
├── gallery/           # GalleryItem entity + repo
├── blogs/             # BlogPost entity + repo
├── testimonials/      # Testimonial entity + repo
├── contactrequests/   # ContactRequest entity + repo
└── settings/          # SiteSetting entity + repo
```

### API Versioning
All endpoints are prefixed: `/api/v1/`

### Security
- Spring Security 6 (stateless — no sessions)
- JWT filter runs before `UsernamePasswordAuthenticationFilter`
- Public routes whitelisted in `SecurityConfig`
- Role-based access: `ROLE_ADMIN`, `ROLE_CUSTOMER`

### Response Format
All endpoints return a standard envelope:
```json
{
  "success": true,
  "message": "OK",
  "data": { ... }
}
```

---

## Database — Supabase PostgreSQL

- Hosted on Supabase (managed PostgreSQL)
- Schema defined in `database/schema.sql`
- Accessed via Spring Data JPA / Hibernate
- Connection pooling via Supabase's built-in pooler (Transaction mode for Railway)

### Key Tables
```
users              → core auth (email, password, role)
customers          → customer profile (linked to users)
leads              → incoming quote requests
quotes             → formal quotations
projects           → active work orders
services           → service catalog
gallery_items      → image gallery
portfolio_items    → project showcase
blog_posts         → content articles
testimonials       → client reviews
contact_requests   → contact form submissions
site_settings      → dynamic website configuration
```

---

## Deployment Architecture

| Service      | Platform  | Notes                                      |
|--------------|-----------|--------------------------------------------|
| Frontend     | Vercel    | Auto-deploy on push to `main`              |
| Backend      | Railway   | Dockerfile or Maven buildpack              |
| Database     | Supabase  | Free tier: 500MB / paid for production     |

### Environment Variable Flow
```
Supabase Dashboard → DB connection string → Railway env vars → Spring Boot
GitHub Repo → Vercel project → NEXT_PUBLIC_* vars → Next.js
```

---

## Security Considerations

1. JWT secret must be ≥256 bits, stored in env var (never in code)
2. CORS restricted to known frontend origins
3. Passwords hashed with BCrypt (Spring Security default)
4. Database accessed over SSL (Supabase enforces TLS)
5. Admin routes protected by role check at both API and frontend levels
6. Input validated with `@Valid` + Bean Validation on all DTOs

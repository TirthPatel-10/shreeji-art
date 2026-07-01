# Developer Handoff — Shreeji Art

This document is for any developer picking up this project. Read it before writing a single line of code.

---

## Project Status

| Layer    | Status                 | Notes                                           |
|----------|------------------------|-------------------------------------------------|
| Docs     | Complete               | All planning docs in /docs                      |
| Frontend | Skeleton created       | Routes stubbed, shadcn/ui not yet initialized   |
| Backend  | Skeleton created       | Auth + User modules functional stubs            |
| Database | Schema designed        | Run schema.sql in Supabase to create tables     |
| Deployment | Not yet configured   | See README for Vercel + Railway steps           |

---

## First Steps for a New Developer

1. Read `docs/ARCHITECTURE.md` — understand the three-layer structure
2. Read `docs/API_PLAN.md` — all endpoints are planned here
3. Read `docs/DATABASE_SCHEMA.md` — understand data models
4. Clone the repo, copy `.env.example` to `.env`, fill in Supabase credentials
5. Run `database/schema.sql` in Supabase SQL Editor
6. Start the backend: `cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=dev`
7. Start the frontend: `cd frontend && npm install && npm run dev`
8. Initialize shadcn/ui: `cd frontend && npx shadcn-ui@latest init`

---

## Key Design Decisions

### Why JWT (not sessions)?
The backend is deployed on Railway as a stateless service. JWT allows horizontal scaling without shared session storage.

### Why Spring Boot (not Node/Express)?
Owner preference. Java 21 with Spring Boot 3 is production-ready and well-suited for a structured business application with clear role-based access.

### Why Supabase (not raw PostgreSQL)?
Supabase provides managed PostgreSQL with a generous free tier, a web-based SQL editor, and built-in Supabase Storage for image uploads. Connection is standard JDBC.

### Why Vercel (frontend) + Railway (backend)?
Vercel is purpose-built for Next.js. Railway provides simple Docker/Maven deployment for Spring Boot without DevOps overhead.

### Why no Clerk?
Owner prefers to own the auth stack. Spring Security + JWT gives full control over token lifecycle and user roles without external dependency.

---

## Module Ownership

| Module          | Priority | Owner     | Notes                                    |
|-----------------|----------|-----------|------------------------------------------|
| auth            | P0       | Backend   | Working skeleton present                 |
| users           | P0       | Backend   | Working skeleton present                 |
| public website  | P1       | Frontend  | Design content needed from client        |
| customer portal | P1       | Full-stack| Depends on auth being complete           |
| admin dashboard | P2       | Full-stack| Depends on all backend modules           |
| leads           | P1       | Backend   | Stub only — implement form handler first |
| quotes          | P2       | Backend   | Depends on leads + customers             |
| projects        | P2       | Backend   | Depends on quotes                        |
| services/gallery| P1       | Full-stack| Content management — admin priority      |
| blog            | P3       | Full-stack| Lower priority                           |

---

## Environment Variables

Never hardcode secrets. All secrets go in:
- Backend: `application-dev.yml` (gitignored) or Railway env vars
- Frontend: `.env.local` (gitignored) or Vercel env vars

See `.env.example` for the full list.

---

## Image Uploads

Use Supabase Storage for file uploads:
1. Create a bucket named `shreeji-art-assets` in Supabase Storage
2. Set public bucket policy for `gallery/` and `portfolio/` folders
3. Upload via the Supabase client or the REST API
4. Store the returned public URL in the database column

---

## Common Gotchas

1. **Spring Boot + Supabase**: Use the "Transaction" mode pooler connection string from Supabase, not the direct connection — Railway instances may exhaust direct connections.
2. **CORS**: The allowed origins list in `SecurityConfig` and `CorsConfig` must include the Vercel preview URL in addition to production.
3. **Next.js App Router**: Do not mix Server and Client components carelessly. Data fetching in Server Components, interactivity in Client Components.
4. **JWT Secret**: Must be base64-encoded and at least 256 bits. Generate with: `openssl rand -base64 32`
5. **shadcn/ui**: Run `npx shadcn-ui@latest init` from the `frontend/` directory after `npm install`.

---

## Contacts

- Project: Shreeji Art, Ahmedabad, Gujarat, India
- Platform built by: *[Developer name here]*

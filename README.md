# Shreeji Art — Premium Signage Manufacturing & Branding Platform

Shreeji Art is a full-stack web platform for a premium signage manufacturing and branding company based in Ahmedabad, India. The platform includes a public-facing website, a customer self-service portal, and a comprehensive admin dashboard.

## Tech Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Frontend   | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui     |
| Backend    | Spring Boot 3, Java 21, Maven                       |
| Database   | PostgreSQL via Supabase                             |
| Auth       | Spring Security + JWT (HS256)                       |
| Deployment | Frontend → Vercel · Backend → Railway               |

## Project Structure

```
shreeji-art/
├── frontend/          # Next.js TypeScript app (App Router)
├── backend/           # Spring Boot Java 21 REST API
├── database/          # SQL schema and seed files
├── docs/              # Architecture, API, and planning docs
├── .env.example       # Environment variable template
└── README.md
```

## Prerequisites

- Node.js 20+
- Java 21 (JDK)
- Maven 3.9+
- A Supabase project (PostgreSQL)

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-org/shreeji-art.git
cd shreeji-art
```

### 2. Database — Supabase

1. Create a project at https://supabase.com
2. Go to **SQL Editor** and run `database/schema.sql`
3. Copy the connection string from **Settings → Database**

### 3. Backend — Spring Boot

```bash
cd backend

# Copy and edit the dev config
cp src/main/resources/application-dev.yml.example src/main/resources/application-dev.yml
# Set DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET

mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Backend runs at: `http://localhost:8080`  
Swagger UI: `http://localhost:8080/swagger-ui/index.html` *(add springdoc dependency to enable)*

### 4. Frontend — Next.js

```bash
cd frontend

cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

npm install

# Initialize shadcn/ui (first time only)
npx shadcn-ui@latest init

npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## Deployment

### Frontend → Vercel

1. Push to GitHub and import the repo in Vercel
2. Set **Root Directory** to `frontend/`
3. Framework preset: **Next.js**
4. Add all `NEXT_PUBLIC_*` environment variables
5. Deploy

### Backend → Railway

1. Create a new Railway project and link your GitHub repo
2. Set **Root Directory** to `backend/`
3. Add all environment variables (see `.env.example`)
4. Railway auto-detects Maven and deploys on push

### Database → Supabase

1. Create a Supabase project
2. Run `database/schema.sql` in the SQL Editor
3. Use the **Transaction** pooler connection string for Railway

---

## Documentation

| Document                                   | Description                          |
|--------------------------------------------|--------------------------------------|
| [Project Plan](docs/PROJECT_PLAN.md)       | Goals, scope, milestones             |
| [Architecture](docs/ARCHITECTURE.md)       | System design and component overview |
| [App Flow](docs/APP_FLOW.md)               | User journeys and navigation flows   |
| [API Plan](docs/API_PLAN.md)               | REST API endpoint design             |
| [Database Schema](docs/DATABASE_SCHEMA.md) | Table definitions and relationships  |
| [Roadmap](docs/ROADMAP.md)                 | Phase-by-phase feature roadmap       |
| [Handoff](docs/HANDOFF.md)                 | Developer handoff notes              |
| [AI Rules](docs/AI_RULES.md)               | Rules for AI-assisted development    |

---

## Default Admin Credentials (dev only)

Set via `application-dev.yml` seed or a data initializer.  
**Never commit real credentials.**

---

## License

Private — All rights reserved. Shreeji Art, Ahmedabad, Gujarat, India.

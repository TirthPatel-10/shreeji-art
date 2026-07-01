# AI Rules — Shreeji Art

Rules for AI-assisted development on this project. Follow these in every session.

---

## 1. Always Inspect Before Creating

Before creating any file, check if it already exists. Before editing, read it first. Never overwrite without reading.

## 2. Do Not Guess Credentials

Never generate, invent, or hardcode database URLs, JWT secrets, API keys, or passwords. Always use the `.env.example` pattern and reference environment variables.

## 3. Follow the Established Stack

**Do not introduce:**
- Clerk, Auth0, NextAuth, or any third-party auth library (auth is Spring Security + JWT)
- Prisma, Drizzle, or any ORM on the frontend (backend handles all DB via JPA)
- Redux, Zustand, or global state libraries unless explicitly approved
- React Query / SWR unless explicitly approved (use `fetch` with Server Components first)

**Always use:**
- `jakarta.*` packages in Spring Boot (not `javax.*` — Spring Boot 3 uses Jakarta EE)
- Spring Security 6 syntax (`SecurityFilterChain` bean, not `WebSecurityConfigurerAdapter`)
- App Router patterns in Next.js (not Pages Router)
- Tailwind CSS utility classes (not inline styles, not CSS modules)
- shadcn/ui components for UI elements

## 4. Module Boundaries

Each backend module (`auth`, `users`, `leads`, etc.) owns its own:
- Entity class
- Repository interface
- Service class
- Controller class
- DTO classes (in a `dto/` subfolder)

Do not put business logic in controllers. Controllers call services. Services call repositories.

## 5. API Response Format

All endpoints must return `ApiResponse<T>`:
```java
ApiResponse.success(data)
ApiResponse.error(message)
```

Never return raw entities or bare strings from controllers.

## 6. Security Defaults

- All new endpoints are `authenticated()` by default
- Explicitly whitelist public endpoints in `SecurityConfig.java`
- Admin-only endpoints use `hasRole("ADMIN")`
- Customer-only endpoints use `hasAnyRole("ADMIN", "CUSTOMER")`

## 7. Validation

Every incoming DTO must have Bean Validation annotations (`@NotBlank`, `@Email`, `@Size`, etc.).
Every controller method accepting a request body must use `@Valid`.

## 8. Frontend Route Protection

Every protected route group must have a `layout.tsx` that checks auth before rendering children. Do not rely on API 401 responses alone for UX — guard at the layout level.

## 9. No Dead Code

Do not generate placeholder methods that throw `UnsupportedOperationException` or `TODO` comments. Leave the method missing rather than creating a broken stub. Exception: empty repository interfaces and entity classes are acceptable stubs.

## 10. File Creation Priority

When building features, create in this order:
1. Database migration (if schema changes)
2. Backend entity + repository
3. Backend service + controller
4. Frontend types (`src/types/index.ts`)
5. Frontend API function (`src/lib/api.ts`)
6. Frontend page/component

## 11. Naming Conventions

| Layer      | Convention                          | Example                        |
|------------|-------------------------------------|--------------------------------|
| Java class | PascalCase                          | `QuoteService`                 |
| Java method| camelCase                           | `createQuote()`                |
| DB column  | snake_case                          | `created_at`                   |
| DB table   | plural snake_case                   | `quote_items`                  |
| API route  | kebab-case plural                   | `/api/v1/quote-items`          |
| TS type    | PascalCase                          | `QuoteItem`                    |
| TS file    | camelCase or kebab-case             | `quoteService.ts`              |
| React comp | PascalCase                          | `QuoteCard.tsx`                |
| CSS class  | Tailwind utilities only             | `className="flex gap-4"`       |

## 12. Comments Policy

Write zero comments unless the **why** is non-obvious. Code should be self-documenting through clear naming. No multi-line comment blocks. No `// TODO` unless a task is tracked.

## 13. Test Files

Do not generate test files unless explicitly requested. When tests are requested, write integration tests for the backend (hitting the real database) and component tests for the frontend.

## 14. Phase Discipline

Refer to `docs/ROADMAP.md`. Do not implement Phase 4 features when working on Phase 2. Do not add payment, inventory, or HR features at any point in the MVP.

# App Flow — Shreeji Art

## 1. Public Visitor Journey

```
Landing (/)
  ├── Browse Services (/services)
  │     └── Service Detail (/services/[slug])
  ├── View Portfolio (/portfolio)
  │     └── Portfolio Item Detail (/portfolio/[slug])
  ├── View Gallery (/gallery)
  ├── Read Blog (/blog)
  │     └── Blog Post (/blog/[slug])
  ├── About Us (/about)
  ├── Contact (/contact)          → form submission → ContactRequest saved
  └── Request Quote (/quote)      → multi-step form → Lead saved
        └── Confirmation message shown
```

---

## 2. Customer Registration & Login

```
/register
  ├── Fill name, email, phone, password
  ├── POST /api/v1/auth/register
  ├── Account created with ROLE_CUSTOMER
  └── Redirected to /dashboard

/login
  ├── Enter email + password
  ├── POST /api/v1/auth/login
  ├── JWT returned and saved
  └── Redirected to /dashboard
```

---

## 3. Customer Portal Journey

```
/dashboard
  ├── Summary cards: active quotes, active projects
  ├── Recent activity feed
  └── Links to portal sections

/quotes
  ├── List of quotes sent by admin
  └── Quote detail: items, total, status, validity

/projects
  ├── List of active/completed projects
  └── Project detail: description, status, timeline

/profile
  └── Edit: name, phone, company name, address
```

---

## 4. Admin Workflow

### Lead → Quote → Project Pipeline

```
Quote Request Form (public)
  └── Lead saved in DB (status: NEW)
        │
        ▼ Admin reviews in /admin/leads
  Lead status updated → CONTACTED → QUALIFIED → LOST
        │
        ▼ Admin clicks "Convert to Quote"
  Quote created (/admin/quotes)
  ├── Add line items (product, qty, unit price)
  ├── Set valid-until date
  ├── Status: DRAFT → SENT → ACCEPTED / REJECTED
  └── Customer can view quote in portal
        │
        ▼ Quote accepted
  Project created (/admin/projects)
  ├── Linked to quote
  ├── Status: PLANNED → IN_PROGRESS → QUALITY_CHECK → INSTALLATION → COMPLETED
  └── Customer can track in portal
```

### Admin Navigation Map

```
/admin
  ├── /admin/dashboard        (stats overview)
  ├── /admin/customers        (list, view, deactivate)
  ├── /admin/leads            (inbox, status, convert)
  ├── /admin/quotes           (CRUD, send, status)
  ├── /admin/projects         (CRUD, status, timeline)
  ├── /admin/portfolio        (CRUD portfolio items)
  ├── /admin/services         (edit service content)
  ├── /admin/blog             (CRUD blog posts)
  ├── /admin/contacts         (contact requests inbox)
  ├── /admin/testimonials     (approve, reorder)
  ├── /admin/settings         (company info, socials, SEO)
  └── /admin/profile          (admin own profile)
```

---

## 5. Quote Request Flow (Detail)

```
Step 1 — Contact Info
  name, email, phone, company name

Step 2 — Project Info
  service type (dropdown: LED, Acrylic, 3D, ACP, SS, etc.)
  approximate size / dimensions
  location (city)
  description / requirements

Step 3 — Confirmation
  Review summary
  Submit → POST /api/v1/contact/quote-request
  → Lead saved with status NEW
  → Email notification to admin (Phase 2)
  → Thank-you confirmation screen
```

---

## 6. Auth Guard Logic (Frontend)

```
Request to protected route
  │
  ├── Token in storage? No → /login (redirect)
  │
  ├── Token valid? No → /login (clear storage)
  │
  ├── Route requires ROLE_ADMIN?
  │     ├── User is ROLE_ADMIN → allow
  │     └── User is ROLE_CUSTOMER → /dashboard (redirect)
  │
  └── Route requires ROLE_CUSTOMER?
        ├── User is ROLE_CUSTOMER or ROLE_ADMIN → allow
        └── No auth → /login (redirect)
```

---

## 7. State Management Strategy

| State Type       | Strategy                                     |
|------------------|----------------------------------------------|
| Auth token/user  | React Context + localStorage                 |
| Server data      | Fetch in Server Components where possible    |
| Client UI state  | `useState` / `useReducer`                    |
| Forms            | Controlled components or React Hook Form     |
| Global toasts    | shadcn/ui `toast` / `sonner`                 |

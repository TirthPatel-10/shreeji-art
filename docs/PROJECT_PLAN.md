# Project Plan — Shreeji Art

## Overview

Shreeji Art is a premium signage manufacturing and branding company in Ahmedabad, India. This platform serves three audiences:

| Audience        | Purpose                                             |
|-----------------|-----------------------------------------------------|
| Public visitors | Explore services, view portfolio, request quotes    |
| Customers       | Track quotes, monitor project progress, manage profile |
| Admins          | Manage the full business workflow end-to-end        |

## Business Context

**Services offered:**
- LED Signs & Neon Signs
- Acrylic Signs & Letters
- 3D Letter Signs (SS, Brass, Chrome)
- ACP (Aluminium Composite Panel) Signage
- Stainless Steel Signage
- Glow Sign Boards
- Wayfinding & Directional Signs
- Office Branding & Interior Signage
- Retail Branding
- Industrial Signage
- Custom Fabrication

**Target clients:** Retail chains, corporate offices, malls, hospitals, hotels, factories, educational institutions.

---

## MVP Scope

### Phase 1 — Foundation (Current)
- [x] Project structure, docs, environment setup
- [x] Frontend skeleton (Next.js)
- [x] Backend skeleton (Spring Boot)
- [x] Database schema design

### Phase 2 — Public Website
- [ ] Home page (hero, services grid, portfolio highlights, testimonials, CTA)
- [ ] About page (company story, values, team)
- [ ] Services pages (index + individual detail pages)
- [ ] Portfolio page (filterable gallery of past projects)
- [ ] Gallery page (image grid with category filters)
- [ ] Blog page (list + individual post pages)
- [ ] Contact page (form + Google Maps embed + contact details)
- [ ] Request Quote form (multi-step form → leads table)

### Phase 3 — Auth & Customer Portal
- [ ] Customer registration and login (JWT)
- [ ] Customer dashboard (summary cards)
- [ ] My Quotes (list + detail view)
- [ ] My Projects (list + status timeline)
- [ ] Profile page (edit name, phone, company, address)

### Phase 4 — Admin Dashboard
- [ ] Overview dashboard (stats: leads, quotes, projects, revenue)
- [ ] Customer management (list, view profile, deactivate)
- [ ] Lead management (view, convert to quote, assign status)
- [ ] Quote management (create, edit, send to customer, mark won/lost)
- [ ] Project management (create from quote, update status, add notes)
- [ ] Portfolio management (CRUD for portfolio items)
- [ ] Gallery management (upload, categorize, reorder images)
- [ ] Services content management (update descriptions, images)
- [ ] Blog management (write, publish, unpublish posts)
- [ ] Contact requests inbox (view, mark resolved)
- [ ] Testimonials management (approve, display order)
- [ ] Website settings (company info, social links, SEO defaults)

---

## Out of Scope (MVP)

- Payment gateway integration
- Inventory / materials management
- Employee / HR management
- Support ticket system
- Mobile native app

---

## Team Roles

| Role           | Responsibilities                          |
|----------------|-------------------------------------------|
| Admin          | Full platform access, all CRUD operations |
| Customer       | Read-only portal: quotes, projects, profile |

---

## Success Metrics

- Online quote requests per month
- Customer portal adoption (% of clients logging in)
- Admin time saved on quote follow-ups
- Portfolio items showcased

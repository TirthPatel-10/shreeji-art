# Roadmap — Shreeji Art

## Phase 1 — Foundation (Week 1–2) ✅ In Progress

- [x] Monorepo structure
- [x] Documentation suite
- [x] Next.js frontend skeleton
- [x] Spring Boot backend skeleton
- [x] Database schema design
- [ ] Local dev environment fully running
- [ ] Git + CI/CD pipeline configured

---

## Phase 2 — Public Website (Week 2–4)

**Frontend**
- [ ] Navbar with mobile menu
- [ ] Footer with company info and social links
- [ ] Home page: hero, services grid, portfolio highlights, testimonials, CTA
- [ ] About page: company story, values
- [ ] Services index + detail pages
- [ ] Portfolio page with filter
- [ ] Gallery page with lightbox
- [ ] Blog list + single post pages
- [ ] Contact page with form
- [ ] Request Quote multi-step form

**Backend**
- [ ] Services CRUD endpoints
- [ ] Portfolio CRUD endpoints
- [ ] Gallery CRUD endpoints
- [ ] Blog CRUD endpoints
- [ ] Contact form submission endpoint
- [ ] Quote request (lead) submission endpoint
- [ ] Testimonials public endpoint
- [ ] Site settings public endpoint

---

## Phase 3 — Auth & Customer Portal (Week 4–6)

**Backend**
- [ ] `POST /auth/register` — customer registration
- [ ] `POST /auth/login` — JWT login
- [ ] `GET /auth/me` — get current user
- [ ] Customer profile read/update endpoints
- [ ] My Quotes endpoint
- [ ] My Projects endpoint

**Frontend**
- [ ] Login page
- [ ] Register page
- [ ] Auth context (token management)
- [ ] Customer dashboard
- [ ] My Quotes list + detail view
- [ ] My Projects list + status view
- [ ] Profile edit page

---

## Phase 4 — Admin Dashboard (Week 6–10)

**Frontend**
- [ ] Admin sidebar layout
- [ ] Overview dashboard with stat cards
- [ ] Customers table (search, paginate)
- [ ] Leads inbox (filter by status, convert to quote)
- [ ] Quotes management (create, edit, send)
- [ ] Projects management (create from quote, update status)
- [ ] Portfolio management (image upload, reorder)
- [ ] Gallery management
- [ ] Services content editor
- [ ] Blog editor (rich text)
- [ ] Contact requests inbox
- [ ] Testimonials management
- [ ] Website settings form

**Backend**
- [ ] Admin-only guards on all admin endpoints
- [ ] Quote creation with line items
- [ ] Project creation linked to quote
- [ ] Lead status transitions
- [ ] Image upload to Supabase Storage

---

## Phase 5 — Polish & Production (Week 10–12)

- [ ] SEO: meta tags, Open Graph, sitemap.xml, robots.txt
- [ ] Performance: Next.js Image optimization, lazy loading
- [ ] Mobile responsiveness audit
- [ ] Error pages (404, 500)
- [ ] Loading skeletons
- [ ] Toast notifications
- [ ] Form validation (both client and server)
- [ ] Rate limiting on public API endpoints
- [ ] Production environment variables set in Vercel + Railway
- [ ] Custom domain configuration
- [ ] SSL verification

---

## Phase 6 — Future Enhancements (Post-MVP)

- Email notifications (quote sent, project status changed)
- WhatsApp integration for lead notifications
- Payment gateway (Razorpay)
- PDF quote generation
- Project photo updates (admin uploads progress photos)
- Customer review submission from portal
- Google Analytics integration
- Inventory / materials tracking
- Employee task assignment
- Mobile app (React Native)

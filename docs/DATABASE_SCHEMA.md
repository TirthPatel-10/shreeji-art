# Database Schema — Shreeji Art

> Full SQL is in `database/schema.sql`. This document explains design decisions.

## Entity Relationship Overview

```
users ──< customers
users ──< blog_posts (author)

leads ──> quotes (optional: lead can become a quote)
customers ──< quotes
quotes ──< quote_items
quotes ──> projects (one quote → one project)
customers ──< projects

services ──< portfolio_items
services ──< gallery_items
```

---

## Tables

### users

Core authentication table. All portal users (admins and customers) have a row here.

| Column        | Type                   | Notes                          |
|---------------|------------------------|--------------------------------|
| id            | BIGSERIAL PRIMARY KEY  |                                |
| email         | VARCHAR(255) UNIQUE    | Used as login username         |
| password_hash | VARCHAR(255)           | BCrypt hash, never plaintext   |
| first_name    | VARCHAR(100)           |                                |
| last_name     | VARCHAR(100)           |                                |
| phone         | VARCHAR(20)            |                                |
| role          | VARCHAR(30)            | ROLE_ADMIN or ROLE_CUSTOMER    |
| is_active     | BOOLEAN DEFAULT true   | Soft disable without deletion  |
| created_at    | TIMESTAMPTZ            | Auto-set                       |
| updated_at    | TIMESTAMPTZ            | Auto-updated                   |

---

### customers

Extended profile for customers (linked 1:1 to users).

| Column        | Type                   | Notes                          |
|---------------|------------------------|--------------------------------|
| id            | BIGSERIAL PRIMARY KEY  |                                |
| user_id       | BIGINT FK → users(id)  | UNIQUE — one profile per user  |
| company_name  | VARCHAR(255)           | Optional                       |
| gst_number    | VARCHAR(20)            | Optional                       |
| address       | TEXT                   |                                |
| city          | VARCHAR(100)           |                                |
| state         | VARCHAR(100)           |                                |
| pincode       | VARCHAR(10)            |                                |
| created_at    | TIMESTAMPTZ            |                                |
| updated_at    | TIMESTAMPTZ            |                                |

---

### leads

Incoming enquiries from the public quote request form or contact form.

| Column         | Type                   | Notes                                        |
|----------------|------------------------|----------------------------------------------|
| id             | BIGSERIAL PRIMARY KEY  |                                              |
| name           | VARCHAR(255)           |                                              |
| email          | VARCHAR(255)           |                                              |
| phone          | VARCHAR(20)            |                                              |
| company        | VARCHAR(255)           | Optional                                     |
| service_type   | VARCHAR(100)           | LED, Acrylic, 3D, ACP, etc.                  |
| message        | TEXT                   |                                              |
| source         | VARCHAR(50)            | quote_form, contact_form, direct, referral   |
| status         | VARCHAR(30)            | NEW, CONTACTED, QUALIFIED, CONVERTED, LOST   |
| assigned_to    | BIGINT FK → users(id)  | Optional admin assignment                    |
| created_at     | TIMESTAMPTZ            |                                              |
| updated_at     | TIMESTAMPTZ            |                                              |

---

### quotes

Formal quotations created by admin, linked to customers.

| Column          | Type                      | Notes                                    |
|-----------------|---------------------------|------------------------------------------|
| id              | BIGSERIAL PRIMARY KEY     |                                          |
| reference_no    | VARCHAR(50) UNIQUE        | e.g. SA-2024-001                         |
| customer_id     | BIGINT FK → customers(id) | Required for portal visibility           |
| lead_id         | BIGINT FK → leads(id)     | Optional, if quote came from a lead      |
| title           | VARCHAR(255)              |                                          |
| description     | TEXT                      |                                          |
| status          | VARCHAR(30)               | DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED |
| total_amount    | NUMERIC(12,2)             |                                          |
| valid_until     | DATE                      |                                          |
| notes           | TEXT                      | Internal notes for admin                 |
| created_at      | TIMESTAMPTZ               |                                          |
| updated_at      | TIMESTAMPTZ               |                                          |

---

### quote_items

Line items within a quote.

| Column      | Type                  | Notes            |
|-------------|-----------------------|------------------|
| id          | BIGSERIAL PRIMARY KEY |                  |
| quote_id    | BIGINT FK → quotes(id)|                  |
| description | TEXT                  |                  |
| quantity    | NUMERIC(10,2)         |                  |
| unit        | VARCHAR(50)           | sqft, pcs, rft   |
| unit_price  | NUMERIC(12,2)         |                  |
| total_price | NUMERIC(12,2)         | quantity × price |

---

### projects

Active or completed work orders, typically created from an accepted quote.

| Column               | Type                      | Notes                                              |
|----------------------|---------------------------|----------------------------------------------------|
| id                   | BIGSERIAL PRIMARY KEY     |                                                    |
| reference_no         | VARCHAR(50) UNIQUE        | e.g. SP-2024-001                                   |
| customer_id          | BIGINT FK → customers(id) |                                                    |
| quote_id             | BIGINT FK → quotes(id)    | Optional                                           |
| title                | VARCHAR(255)              |                                                    |
| description          | TEXT                      |                                                    |
| status               | VARCHAR(30)               | PLANNED, IN_PROGRESS, QUALITY_CHECK, INSTALLATION, COMPLETED, CANCELLED |
| start_date           | DATE                      |                                                    |
| estimated_completion | DATE                      |                                                    |
| actual_completion    | DATE                      | Filled when project is marked COMPLETED            |
| notes                | TEXT                      | Admin notes                                        |
| created_at           | TIMESTAMPTZ               |                                                    |
| updated_at           | TIMESTAMPTZ               |                                                    |

---

### services

Service catalog — content managed by admin.

| Column            | Type                  | Notes                     |
|-------------------|-----------------------|---------------------------|
| id                | BIGSERIAL PRIMARY KEY |                           |
| name              | VARCHAR(255)          | e.g. "LED Signs"          |
| slug              | VARCHAR(255) UNIQUE   | e.g. "led-signs"          |
| short_description | TEXT                  | Used in cards/previews    |
| description       | TEXT                  | Full page content (HTML)  |
| icon              | VARCHAR(100)          | Lucide icon name or emoji |
| image_url         | TEXT                  |                           |
| is_active         | BOOLEAN DEFAULT true  |                           |
| display_order     | INT DEFAULT 0         |                           |
| created_at        | TIMESTAMPTZ           |                           |
| updated_at        | TIMESTAMPTZ           |                           |

---

### portfolio_items

Showcase of completed projects.

| Column        | Type                    | Notes                     |
|---------------|-------------------------|---------------------------|
| id            | BIGSERIAL PRIMARY KEY   |                           |
| title         | VARCHAR(255)            |                           |
| slug          | VARCHAR(255) UNIQUE     |                           |
| description   | TEXT                    |                           |
| client_name   | VARCHAR(255)            |                           |
| service_id    | BIGINT FK → services(id)|                           |
| images        | TEXT[]                  | Array of image URLs       |
| tags          | TEXT[]                  |                           |
| is_featured   | BOOLEAN DEFAULT false   |                           |
| display_order | INT DEFAULT 0           |                           |
| created_at    | TIMESTAMPTZ             |                           |
| updated_at    | TIMESTAMPTZ             |                           |

---

### gallery_items

Image gallery with categories.

| Column        | Type                    | Notes                          |
|---------------|-------------------------|--------------------------------|
| id            | BIGSERIAL PRIMARY KEY   |                                |
| title         | VARCHAR(255)            |                                |
| image_url     | TEXT                    |                                |
| category      | VARCHAR(100)            | LED, Acrylic, 3D, ACP, SS, etc.|
| service_id    | BIGINT FK → services(id)| Optional category link         |
| is_featured   | BOOLEAN DEFAULT false   |                                |
| display_order | INT DEFAULT 0           |                                |
| created_at    | TIMESTAMPTZ             |                                |

---

### blog_posts

CMS for blog articles.

| Column         | Type                  | Notes                         |
|----------------|-----------------------|-------------------------------|
| id             | BIGSERIAL PRIMARY KEY |                               |
| author_id      | BIGINT FK → users(id) |                               |
| title          | VARCHAR(500)          |                               |
| slug           | VARCHAR(500) UNIQUE   |                               |
| excerpt        | TEXT                  | Used in card previews         |
| content        | TEXT                  | Full article (HTML/Markdown)  |
| featured_image | TEXT                  | Image URL                     |
| tags           | TEXT[]                |                               |
| status         | VARCHAR(20)           | DRAFT, PUBLISHED, ARCHIVED    |
| published_at   | TIMESTAMPTZ           | Null until published          |
| created_at     | TIMESTAMPTZ           |                               |
| updated_at     | TIMESTAMPTZ           |                               |

---

### testimonials

Client reviews displayed on the website.

| Column        | Type                  | Notes                        |
|---------------|-----------------------|------------------------------|
| id            | BIGSERIAL PRIMARY KEY |                              |
| customer_name | VARCHAR(255)          |                              |
| company       | VARCHAR(255)          |                              |
| content       | TEXT                  |                              |
| rating        | INT                   | 1–5                          |
| image_url     | TEXT                  | Optional avatar              |
| is_approved   | BOOLEAN DEFAULT false |                              |
| display_order | INT DEFAULT 0         |                              |
| created_at    | TIMESTAMPTZ           |                              |

---

### contact_requests

Submissions from the contact page form.

| Column     | Type                  | Notes                         |
|------------|-----------------------|-------------------------------|
| id         | BIGSERIAL PRIMARY KEY |                               |
| name       | VARCHAR(255)          |                               |
| email      | VARCHAR(255)          |                               |
| phone      | VARCHAR(20)           |                               |
| company    | VARCHAR(255)          |                               |
| subject    | VARCHAR(500)          |                               |
| message    | TEXT                  |                               |
| status     | VARCHAR(20)           | NEW, READ, RESOLVED           |
| created_at | TIMESTAMPTZ           |                               |

---

### site_settings

Key-value store for dynamic website configuration.

| Column      | Type                  | Notes                         |
|-------------|-----------------------|-------------------------------|
| id          | BIGSERIAL PRIMARY KEY |                               |
| key         | VARCHAR(100) UNIQUE   | e.g. "company_phone"          |
| value       | TEXT                  |                               |
| description | TEXT                  | For admin UI label            |
| updated_at  | TIMESTAMPTZ           |                               |

**Default settings keys:**
`company_name`, `company_phone`, `company_email`, `company_address`,
`facebook_url`, `instagram_url`, `whatsapp_number`,
`meta_title`, `meta_description`, `google_maps_url`

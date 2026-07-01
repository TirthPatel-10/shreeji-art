-- ============================================================
-- Shreeji Art — PostgreSQL Schema
-- Run this in Supabase SQL Editor to initialize the database.
-- ============================================================

-- Users (core auth table — admin and customers)
CREATE TABLE IF NOT EXISTS users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    phone           VARCHAR(20),
    role            VARCHAR(30)  NOT NULL DEFAULT 'ROLE_CUSTOMER',
    is_active       BOOLEAN      NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Customers (extended profile for ROLE_CUSTOMER users)
CREATE TABLE IF NOT EXISTS customers (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT       NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_name  VARCHAR(255),
    gst_number    VARCHAR(20),
    address       TEXT,
    city          VARCHAR(100),
    state         VARCHAR(100),
    pincode       VARCHAR(10),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Leads (incoming enquiries from public quote/contact forms)
CREATE TABLE IF NOT EXISTS leads (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    phone         VARCHAR(20),
    company       VARCHAR(255),
    service_type  VARCHAR(100),
    message       TEXT,
    source        VARCHAR(50)  NOT NULL DEFAULT 'quote_form',
    status        VARCHAR(30)  NOT NULL DEFAULT 'NEW',
    assigned_to   BIGINT       REFERENCES users(id),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Services (signage service catalog)
CREATE TABLE IF NOT EXISTS services (
    id                BIGSERIAL PRIMARY KEY,
    name              VARCHAR(255) NOT NULL,
    slug              VARCHAR(255) NOT NULL UNIQUE,
    short_description TEXT,
    description       TEXT,
    icon              VARCHAR(100),
    image_url         TEXT,
    is_active         BOOLEAN      NOT NULL DEFAULT true,
    display_order     INT          NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Portfolio items (completed project showcase)
CREATE TABLE IF NOT EXISTS portfolio_items (
    id            BIGSERIAL PRIMARY KEY,
    title         VARCHAR(255) NOT NULL,
    slug          VARCHAR(255) NOT NULL UNIQUE,
    description   TEXT,
    client_name   VARCHAR(255),
    service_id    BIGINT       REFERENCES services(id),
    images        TEXT[]       DEFAULT ARRAY[]::TEXT[],
    tags          TEXT[]       DEFAULT ARRAY[]::TEXT[],
    is_featured   BOOLEAN      NOT NULL DEFAULT false,
    display_order INT          NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Gallery images
CREATE TABLE IF NOT EXISTS gallery_items (
    id            BIGSERIAL PRIMARY KEY,
    title         VARCHAR(255),
    image_url     TEXT         NOT NULL,
    category      VARCHAR(100),
    service_id    BIGINT       REFERENCES services(id),
    is_featured   BOOLEAN      NOT NULL DEFAULT false,
    display_order INT          NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Quotes (formal quotations for customers)
CREATE TABLE IF NOT EXISTS quotes (
    id            BIGSERIAL PRIMARY KEY,
    reference_no  VARCHAR(50)  NOT NULL UNIQUE,
    customer_id   BIGINT       NOT NULL REFERENCES customers(id),
    lead_id       BIGINT       REFERENCES leads(id),
    title         VARCHAR(255) NOT NULL,
    description   TEXT,
    status        VARCHAR(30)  NOT NULL DEFAULT 'DRAFT',
    total_amount  NUMERIC(12,2),
    valid_until   DATE,
    notes         TEXT,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Quote line items
CREATE TABLE IF NOT EXISTS quote_items (
    id            BIGSERIAL PRIMARY KEY,
    quote_id      BIGINT       NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    description   TEXT,
    quantity      NUMERIC(10,2),
    unit          VARCHAR(50),
    unit_price    NUMERIC(12,2),
    total_price   NUMERIC(12,2)
);

-- Projects (active work orders)
CREATE TABLE IF NOT EXISTS projects (
    id                    BIGSERIAL PRIMARY KEY,
    reference_no          VARCHAR(50)  NOT NULL UNIQUE,
    customer_id           BIGINT       NOT NULL REFERENCES customers(id),
    quote_id              BIGINT       REFERENCES quotes(id),
    title                 VARCHAR(255) NOT NULL,
    description           TEXT,
    status                VARCHAR(30)  NOT NULL DEFAULT 'PLANNED',
    start_date            DATE,
    estimated_completion  DATE,
    actual_completion     DATE,
    notes                 TEXT,
    created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
    id              BIGSERIAL PRIMARY KEY,
    author_id       BIGINT       NOT NULL REFERENCES users(id),
    title           VARCHAR(500) NOT NULL,
    slug            VARCHAR(500) NOT NULL UNIQUE,
    excerpt         TEXT,
    content         TEXT,
    featured_image  TEXT,
    tags            TEXT[]       DEFAULT ARRAY[]::TEXT[],
    status          VARCHAR(20)  NOT NULL DEFAULT 'DRAFT',
    published_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id              BIGSERIAL PRIMARY KEY,
    customer_name   VARCHAR(255) NOT NULL,
    company         VARCHAR(255),
    content         TEXT         NOT NULL,
    rating          INT          NOT NULL DEFAULT 5,
    image_url       TEXT,
    is_approved     BOOLEAN      NOT NULL DEFAULT false,
    display_order   INT          NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_requests (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL,
    phone       VARCHAR(20),
    company     VARCHAR(255),
    subject     VARCHAR(500) NOT NULL,
    message     TEXT         NOT NULL,
    status      VARCHAR(20)  NOT NULL DEFAULT 'NEW',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Site settings (key-value)
CREATE TABLE IF NOT EXISTS site_settings (
    id          BIGSERIAL PRIMARY KEY,
    key         VARCHAR(100) NOT NULL UNIQUE,
    value       TEXT,
    description TEXT,
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_quotes_customer_id ON quotes(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_customer_id ON projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_slug ON portfolio_items(slug);
CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON gallery_items(category);

-- ── Seed: Default site settings ──────────────────────────────

INSERT INTO site_settings (key, value, description) VALUES
    ('company_name',    'Shreeji Art',                    'Company display name'),
    ('company_phone',   '+91 99999 99999',                'Primary contact phone'),
    ('company_email',   'info@shreejiart.in',             'Primary contact email'),
    ('company_address', 'Ahmedabad, Gujarat - 380001',    'Business address'),
    ('whatsapp_number', '919999999999',                   'WhatsApp number (with country code, no +)'),
    ('facebook_url',    '',                               'Facebook page URL'),
    ('instagram_url',   '',                               'Instagram profile URL'),
    ('meta_title',      'Shreeji Art — Premium Signage & Branding, Ahmedabad', 'Default SEO title'),
    ('meta_description','Custom signage manufacturing and branding solutions in Ahmedabad, India.', 'Default SEO description'),
    ('google_maps_url', '',                               'Google Maps embed URL')
ON CONFLICT (key) DO NOTHING;

-- ── Seed: Default services ────────────────────────────────────

INSERT INTO services (name, slug, short_description, icon, display_order) VALUES
    ('LED Signs',               'led-signs',                'Energy-efficient LED signage for storefronts and commercial spaces.',  '💡', 1),
    ('Acrylic Signs',           'acrylic-signs',            'Premium acrylic cut letters and backlit acrylic signage.',             '🔷', 2),
    ('3D Letter Signs',         '3d-letter-signs',          'Stainless steel, brass, and chrome 3D letter signs.',                  '🅰️', 3),
    ('ACP Signage',             'acp-signage',              'Aluminium composite panel boards for facades and hoardings.',          '🏢', 4),
    ('Stainless Steel Signage', 'stainless-steel-signage',  'SS cut-out letters and panels for premium exterior signage.',          '⚙️', 5),
    ('Glow Sign Boards',        'glow-sign-boards',         'Illuminated flex and LED glow boards for night-time visibility.',      '✨', 6),
    ('Wayfinding Signs',        'wayfinding-signs',         'Directional signage systems for malls, hospitals, and campuses.',      '🗺️', 7),
    ('Office Branding',         'office-branding',          'Interior office branding — logo walls, cabin plates, reception signs.','🏬', 8),
    ('Retail Branding',         'retail-branding',          'Shop-front signage, display boards, and in-store visual branding.',    '🛍️', 9),
    ('Industrial Signage',      'industrial-signage',       'Safety signs, plant name boards, and industrial identification.',      '🏭', 10),
    ('Custom Fabrication',      'custom-fabrication',       'Bespoke fabrication for unique shapes and materials.',                 '🔧', 11)
ON CONFLICT (slug) DO NOTHING;

-- Synchronize admin Portfolio, Gallery, and Blog schema with Spring Boot JPA mappings.
-- Safe to run multiple times in Supabase SQL Editor.
-- This migration does not drop tables or delete existing data.

BEGIN;

-- ── Portfolio projects ───────────────────────────────────────

ALTER TABLE portfolio_items
    ADD COLUMN IF NOT EXISTS short_description TEXT,
    ADD COLUMN IF NOT EXISTS full_description TEXT,
    ADD COLUMN IF NOT EXISTS client_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS category VARCHAR(100),
    ADD COLUMN IF NOT EXISTS location VARCHAR(255),
    ADD COLUMN IF NOT EXISTS completion_year INT,
    ADD COLUMN IF NOT EXISTS service_id BIGINT,
    ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
    ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

UPDATE portfolio_items
SET
    images = COALESCE(images, ARRAY[]::TEXT[]),
    tags = COALESCE(tags, ARRAY[]::TEXT[]),
    is_featured = COALESCE(is_featured, false),
    is_published = COALESCE(is_published, true),
    display_order = COALESCE(display_order, 0),
    created_at = COALESCE(created_at, NOW()),
    updated_at = COALESCE(updated_at, NOW());

ALTER TABLE portfolio_items
    ALTER COLUMN images SET DEFAULT ARRAY[]::TEXT[],
    ALTER COLUMN tags SET DEFAULT ARRAY[]::TEXT[],
    ALTER COLUMN is_featured SET DEFAULT false,
    ALTER COLUMN is_featured SET NOT NULL,
    ALTER COLUMN is_published SET DEFAULT true,
    ALTER COLUMN is_published SET NOT NULL,
    ALTER COLUMN display_order SET DEFAULT 0,
    ALTER COLUMN display_order SET NOT NULL,
    ALTER COLUMN created_at SET DEFAULT NOW(),
    ALTER COLUMN created_at SET NOT NULL,
    ALTER COLUMN updated_at SET DEFAULT NOW(),
    ALTER COLUMN updated_at SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_portfolio_items_service'
          AND conrelid = 'portfolio_items'::regclass
    ) THEN
        ALTER TABLE portfolio_items
            ADD CONSTRAINT fk_portfolio_items_service
            FOREIGN KEY (service_id)
            REFERENCES services(id);
    END IF;
END $$;

-- ── Portfolio project images ─────────────────────────────────

CREATE TABLE IF NOT EXISTS portfolio_project_images (
    id             BIGSERIAL PRIMARY KEY,
    project_id     BIGINT,
    image_url      TEXT,
    storage_path   TEXT,
    alt_text       VARCHAR(500),
    caption        TEXT,
    sort_order     INT          DEFAULT 0,
    is_cover_image BOOLEAN      DEFAULT false,
    is_published   BOOLEAN      DEFAULT true,
    created_at     TIMESTAMPTZ  DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  DEFAULT NOW()
);

ALTER TABLE portfolio_project_images
    ADD COLUMN IF NOT EXISTS project_id BIGINT,
    ADD COLUMN IF NOT EXISTS image_url TEXT,
    ADD COLUMN IF NOT EXISTS storage_path TEXT,
    ADD COLUMN IF NOT EXISTS alt_text VARCHAR(500),
    ADD COLUMN IF NOT EXISTS caption TEXT,
    ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS is_cover_image BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'portfolio_project_images'
          AND column_name = 'portfolio_item_id'
    ) THEN
        UPDATE portfolio_project_images
        SET project_id = COALESCE(project_id, portfolio_item_id)
        WHERE project_id IS NULL;
    END IF;
END $$;

UPDATE portfolio_project_images
SET
    sort_order = COALESCE(sort_order, 0),
    is_cover_image = COALESCE(is_cover_image, false),
    is_published = COALESCE(is_published, true),
    created_at = COALESCE(created_at, NOW()),
    updated_at = COALESCE(updated_at, NOW());

ALTER TABLE portfolio_project_images
    ALTER COLUMN sort_order SET DEFAULT 0,
    ALTER COLUMN sort_order SET NOT NULL,
    ALTER COLUMN is_cover_image SET DEFAULT false,
    ALTER COLUMN is_cover_image SET NOT NULL,
    ALTER COLUMN is_published SET DEFAULT true,
    ALTER COLUMN is_published SET NOT NULL,
    ALTER COLUMN created_at SET DEFAULT NOW(),
    ALTER COLUMN created_at SET NOT NULL,
    ALTER COLUMN updated_at SET DEFAULT NOW(),
    ALTER COLUMN updated_at SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM portfolio_project_images
        WHERE project_id IS NULL OR image_url IS NULL OR storage_path IS NULL
    ) THEN
        ALTER TABLE portfolio_project_images
            ALTER COLUMN project_id SET NOT NULL,
            ALTER COLUMN image_url SET NOT NULL,
            ALTER COLUMN storage_path SET NOT NULL;
    ELSE
        RAISE NOTICE 'portfolio_project_images contains rows with null project_id, image_url, or storage_path; NOT NULL constraints were not tightened.';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_portfolio_project_images_project'
          AND conrelid = 'portfolio_project_images'::regclass
    ) AND NOT EXISTS (
        SELECT 1
        FROM portfolio_project_images image
        LEFT JOIN portfolio_items project ON project.id = image.project_id
        WHERE image.project_id IS NOT NULL
          AND project.id IS NULL
    ) THEN
        ALTER TABLE portfolio_project_images
            ADD CONSTRAINT fk_portfolio_project_images_project
            FOREIGN KEY (project_id)
            REFERENCES portfolio_items(id)
            ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'portfolio_project_images_storage_path_key'
          AND conrelid = 'portfolio_project_images'::regclass
    ) AND NOT EXISTS (
        SELECT storage_path
        FROM portfolio_project_images
        WHERE storage_path IS NOT NULL
        GROUP BY storage_path
        HAVING COUNT(*) > 1
    ) THEN
        ALTER TABLE portfolio_project_images
            ADD CONSTRAINT portfolio_project_images_storage_path_key UNIQUE (storage_path);
    END IF;
END $$;

-- ── Standalone gallery images ────────────────────────────────

CREATE TABLE IF NOT EXISTS gallery_items (
    id            BIGSERIAL PRIMARY KEY,
    title         VARCHAR(255),
    image_url     TEXT,
    storage_path  TEXT,
    alt_text      VARCHAR(500),
    caption       TEXT,
    category      VARCHAR(100),
    service_id    BIGINT,
    project_id    BIGINT,
    is_featured   BOOLEAN      DEFAULT false,
    is_published  BOOLEAN      DEFAULT true,
    sort_order    INT          DEFAULT 0,
    display_order INT          DEFAULT 0,
    created_at    TIMESTAMPTZ  DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  DEFAULT NOW()
);

ALTER TABLE gallery_items
    ADD COLUMN IF NOT EXISTS title VARCHAR(255),
    ADD COLUMN IF NOT EXISTS image_url TEXT,
    ADD COLUMN IF NOT EXISTS storage_path TEXT,
    ADD COLUMN IF NOT EXISTS alt_text VARCHAR(500),
    ADD COLUMN IF NOT EXISTS caption TEXT,
    ADD COLUMN IF NOT EXISTS category VARCHAR(100),
    ADD COLUMN IF NOT EXISTS service_id BIGINT,
    ADD COLUMN IF NOT EXISTS project_id BIGINT,
    ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

UPDATE gallery_items
SET
    is_featured = COALESCE(is_featured, false),
    is_published = COALESCE(is_published, true),
    sort_order = COALESCE(sort_order, display_order, 0),
    display_order = COALESCE(display_order, sort_order, 0),
    created_at = COALESCE(created_at, NOW()),
    updated_at = COALESCE(updated_at, NOW());

ALTER TABLE gallery_items
    ALTER COLUMN is_featured SET DEFAULT false,
    ALTER COLUMN is_featured SET NOT NULL,
    ALTER COLUMN is_published SET DEFAULT true,
    ALTER COLUMN is_published SET NOT NULL,
    ALTER COLUMN sort_order SET DEFAULT 0,
    ALTER COLUMN sort_order SET NOT NULL,
    ALTER COLUMN display_order SET DEFAULT 0,
    ALTER COLUMN display_order SET NOT NULL,
    ALTER COLUMN created_at SET DEFAULT NOW(),
    ALTER COLUMN created_at SET NOT NULL,
    ALTER COLUMN updated_at SET DEFAULT NOW(),
    ALTER COLUMN updated_at SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM gallery_items WHERE image_url IS NULL
    ) THEN
        ALTER TABLE gallery_items
            ALTER COLUMN image_url SET NOT NULL;
    ELSE
        RAISE NOTICE 'gallery_items contains rows with null image_url; NOT NULL constraint was not tightened.';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_gallery_items_service'
          AND conrelid = 'gallery_items'::regclass
    ) THEN
        ALTER TABLE gallery_items
            ADD CONSTRAINT fk_gallery_items_service
            FOREIGN KEY (service_id)
            REFERENCES services(id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_gallery_items_project'
          AND conrelid = 'gallery_items'::regclass
    ) AND NOT EXISTS (
        SELECT 1
        FROM gallery_items image
        LEFT JOIN portfolio_items project ON project.id = image.project_id
        WHERE image.project_id IS NOT NULL
          AND project.id IS NULL
    ) THEN
        ALTER TABLE gallery_items
            ADD CONSTRAINT fk_gallery_items_project
            FOREIGN KEY (project_id)
            REFERENCES portfolio_items(id)
            ON DELETE SET NULL;
    END IF;
END $$;

-- ── Blog posts ───────────────────────────────────────────────

ALTER TABLE blog_posts
    ADD COLUMN IF NOT EXISTS author_id BIGINT,
    ADD COLUMN IF NOT EXISTS title VARCHAR(500),
    ADD COLUMN IF NOT EXISTS slug VARCHAR(500),
    ADD COLUMN IF NOT EXISTS excerpt TEXT,
    ADD COLUMN IF NOT EXISTS content TEXT,
    ADD COLUMN IF NOT EXISTS featured_image TEXT,
    ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'DRAFT',
    ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

UPDATE blog_posts
SET
    tags = COALESCE(tags, ARRAY[]::TEXT[]),
    status = COALESCE(status, 'DRAFT'),
    created_at = COALESCE(created_at, NOW()),
    updated_at = COALESCE(updated_at, NOW());

DO $$
DECLARE
    admin_user_id BIGINT;
BEGIN
    SELECT id
    INTO admin_user_id
    FROM users
    WHERE role = 'ROLE_ADMIN'
    ORDER BY id
    LIMIT 1;

    IF admin_user_id IS NOT NULL THEN
        UPDATE blog_posts
        SET author_id = admin_user_id
        WHERE author_id IS NULL;
    END IF;
END $$;

ALTER TABLE blog_posts
    ALTER COLUMN tags SET DEFAULT ARRAY[]::TEXT[],
    ALTER COLUMN status SET DEFAULT 'DRAFT',
    ALTER COLUMN status SET NOT NULL,
    ALTER COLUMN created_at SET DEFAULT NOW(),
    ALTER COLUMN created_at SET NOT NULL,
    ALTER COLUMN updated_at SET DEFAULT NOW(),
    ALTER COLUMN updated_at SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM blog_posts
        WHERE author_id IS NULL OR title IS NULL OR slug IS NULL
    ) THEN
        ALTER TABLE blog_posts
            ALTER COLUMN author_id SET NOT NULL,
            ALTER COLUMN title SET NOT NULL,
            ALTER COLUMN slug SET NOT NULL;
    ELSE
        RAISE NOTICE 'blog_posts contains rows with null author_id, title, or slug; NOT NULL constraints were not tightened.';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_blog_posts_author'
          AND conrelid = 'blog_posts'::regclass
    ) AND NOT EXISTS (
        SELECT 1
        FROM blog_posts post
        LEFT JOIN users author ON author.id = post.author_id
        WHERE post.author_id IS NOT NULL
          AND author.id IS NULL
    ) THEN
        ALTER TABLE blog_posts
            ADD CONSTRAINT fk_blog_posts_author
            FOREIGN KEY (author_id)
            REFERENCES users(id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'blog_posts_slug_key'
          AND conrelid = 'blog_posts'::regclass
    ) AND NOT EXISTS (
        SELECT slug
        FROM blog_posts
        WHERE slug IS NOT NULL
        GROUP BY slug
        HAVING COUNT(*) > 1
    ) THEN
        ALTER TABLE blog_posts
            ADD CONSTRAINT blog_posts_slug_key UNIQUE (slug);
    END IF;
END $$;

-- ── Indexes ──────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_portfolio_items_slug
    ON portfolio_items(slug);

CREATE INDEX IF NOT EXISTS idx_portfolio_items_published
    ON portfolio_items(is_published);

CREATE INDEX IF NOT EXISTS idx_portfolio_project_images_project
    ON portfolio_project_images(project_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_portfolio_project_images_published
    ON portfolio_project_images(is_published);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_class index_class
        JOIN pg_namespace namespace ON namespace.oid = index_class.relnamespace
        WHERE index_class.relname = 'ux_portfolio_project_single_cover'
          AND namespace.nspname = 'public'
    ) AND NOT EXISTS (
        SELECT project_id
        FROM portfolio_project_images
        WHERE is_cover_image = true
        GROUP BY project_id
        HAVING COUNT(*) > 1
    ) THEN
        CREATE UNIQUE INDEX ux_portfolio_project_single_cover
            ON portfolio_project_images(project_id)
            WHERE is_cover_image = true;
    ELSE
        RAISE NOTICE 'portfolio_project_images has duplicate cover images or the cover index already exists; unique cover index was not created.';
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_gallery_items_category
    ON gallery_items(category);

CREATE INDEX IF NOT EXISTS idx_gallery_items_published
    ON gallery_items(is_published);

CREATE INDEX IF NOT EXISTS idx_gallery_items_sort
    ON gallery_items(sort_order, display_order, id);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug
    ON blog_posts(slug);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status
    ON blog_posts(status);

-- ── Supabase Storage buckets ────────────────────────────────
-- Public buckets are used for public image delivery.
-- Writes still happen only from the Spring Boot backend using the server-side
-- service role/secret key; this does not create public-write policies.

INSERT INTO storage.buckets (id, name, public)
VALUES
    ('project-images', 'project-images', true),
    ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO UPDATE
SET
    name = EXCLUDED.name,
    public = EXCLUDED.public;

COMMIT;

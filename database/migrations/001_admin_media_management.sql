-- Admin Media Management backend foundation.
-- Run this in the Supabase SQL Editor before enabling the admin media UI.

ALTER TABLE portfolio_items
    ADD COLUMN IF NOT EXISTS short_description TEXT,
    ADD COLUMN IF NOT EXISTS full_description TEXT,
    ADD COLUMN IF NOT EXISTS category VARCHAR(100),
    ADD COLUMN IF NOT EXISTS location VARCHAR(255),
    ADD COLUMN IF NOT EXISTS completion_year INT,
    ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
    ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE IF NOT EXISTS portfolio_project_images (
    id             BIGSERIAL PRIMARY KEY,
    project_id     BIGINT       NOT NULL REFERENCES portfolio_items(id) ON DELETE CASCADE,
    image_url      TEXT         NOT NULL,
    storage_path   TEXT         NOT NULL UNIQUE,
    alt_text       VARCHAR(500),
    caption        TEXT,
    sort_order     INT          NOT NULL DEFAULT 0,
    is_cover_image BOOLEAN      NOT NULL DEFAULT false,
    is_published   BOOLEAN      NOT NULL DEFAULT true,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE gallery_items
    ADD COLUMN IF NOT EXISTS storage_path TEXT,
    ADD COLUMN IF NOT EXISTS alt_text VARCHAR(500),
    ADD COLUMN IF NOT EXISTS caption TEXT,
    ADD COLUMN IF NOT EXISTS project_id BIGINT REFERENCES portfolio_items(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_portfolio_items_published
    ON portfolio_items(is_published);

CREATE INDEX IF NOT EXISTS idx_portfolio_project_images_project
    ON portfolio_project_images(project_id, sort_order);

CREATE UNIQUE INDEX IF NOT EXISTS ux_portfolio_project_single_cover
    ON portfolio_project_images(project_id)
    WHERE is_cover_image = true;

CREATE INDEX IF NOT EXISTS idx_gallery_items_published
    ON gallery_items(is_published);

-- Optional bucket creation. Confirm desired public/private bucket policy first.
-- insert into storage.buckets (id, name, public)
-- values ('project-images', 'project-images', true)
-- on conflict (id) do nothing;
--
-- insert into storage.buckets (id, name, public)
-- values ('gallery-images', 'gallery-images', true)
-- on conflict (id) do nothing;

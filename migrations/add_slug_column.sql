
-- Add slug column to listings table
ALTER TABLE listings ADD COLUMN IF NOT EXISTS slug text;

-- Create a unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS listings_slug_idx ON listings (slug);

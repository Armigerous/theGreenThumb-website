-- Database Indexes for Plant Performance Optimization
-- Execute these indexes to improve query performance

-- Primary index for plant slug lookups (most critical)
CREATE INDEX IF NOT EXISTS idx_plant_full_data_slug 
ON plant_full_data (slug);

-- Index for plant autocomplete (used in generateStaticParams)
CREATE INDEX IF NOT EXISTS idx_plant_autocomplete_slug 
ON plant_autocomplete (slug);

-- Index for scientific slug lookups
CREATE INDEX IF NOT EXISTS idx_plant_common_card_data_slug 
ON plant_common_card_data (slug);

-- Index for scientific slug lookups
CREATE INDEX IF NOT EXISTS idx_plant_common_card_data_scientific_slug 
ON plant_common_card_data (scientific_slug);

-- Composite index for common queries (slug + scientific_name for metadata)
CREATE INDEX IF NOT EXISTS idx_plant_full_data_slug_scientific_name 
ON plant_full_data (slug, scientific_name);

-- Index for plant images (if images are stored separately)
CREATE INDEX IF NOT EXISTS idx_plant_images_plant_id 
ON plant_images (plant_id);

-- Index for plant popularity (if tracking page views)
-- CREATE INDEX IF NOT EXISTS idx_plant_views_plant_id 
-- ON plant_views (plant_id);

-- Analyze tables to update statistics
ANALYZE plant_full_data;
ANALYZE plant_autocomplete;
ANALYZE plant_common_card_data;
ANALYZE plant_images;

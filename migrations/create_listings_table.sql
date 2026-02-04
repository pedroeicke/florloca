-- Create listings table for classified ads
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
    
    -- Basic info
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    category TEXT NOT NULL,
    
    -- Location
    state TEXT,
    city TEXT,
    
    -- Media
    images TEXT[] DEFAULT '{}',
    
    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'paused', 'deleted')),
    
    -- Metadata
    views INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON public.listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_store_id ON public.listings(store_id);
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at DESC);

-- Enable RLS
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view active listings
CREATE POLICY "Anyone can view active listings"
    ON public.listings
    FOR SELECT
    USING (status = 'active');

-- Users can view their own listings (any status)
CREATE POLICY "Users can view own listings"
    ON public.listings
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own listings
CREATE POLICY "Users can insert own listings"
    ON public.listings
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own listings
CREATE POLICY "Users can update own listings"
    ON public.listings
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own listings (soft delete by changing status)
CREATE POLICY "Users can delete own listings"
    ON public.listings
    FOR DELETE
    USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_listings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER listings_updated_at
    BEFORE UPDATE ON public.listings
    FOR EACH ROW
    EXECUTE FUNCTION update_listings_updated_at();

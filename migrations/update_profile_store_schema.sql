-- Create profiles table if not exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at timestamp with time zone,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  website text,
  phone text
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Create stores table if not exists
CREATE TABLE IF NOT EXISTS public.stores (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  owner_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  description text,
  logo_url text,
  cover_url text,
  address text,
  whatsapp text,
  social_links jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS for stores
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stores are viewable by everyone."
  ON public.stores FOR SELECT
  USING ( true );

CREATE POLICY "Users can create stores."
  ON public.stores FOR INSERT
  WITH CHECK ( auth.uid() = owner_id );

CREATE POLICY "Owners can update their stores."
  ON public.stores FOR UPDATE
  USING ( auth.uid() = owner_id );

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('store-assets', 'store-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for avatars storage
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

DROP POLICY IF EXISTS "Anyone can upload an avatar." ON storage.objects;
CREATE POLICY "Anyone can upload an avatar."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'avatars' );

DROP POLICY IF EXISTS "Anyone can update their own avatar." ON storage.objects;
CREATE POLICY "Anyone can update their own avatar."
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'avatars' );

-- Policies for store-assets storage
DROP POLICY IF EXISTS "Store assets are publicly accessible." ON storage.objects;
CREATE POLICY "Store assets are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'store-assets' );

DROP POLICY IF EXISTS "Anyone can upload store assets." ON storage.objects;
CREATE POLICY "Anyone can upload store assets."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'store-assets' );

DROP POLICY IF EXISTS "Anyone can update store assets." ON storage.objects;
CREATE POLICY "Anyone can update store assets."
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'store-assets' );


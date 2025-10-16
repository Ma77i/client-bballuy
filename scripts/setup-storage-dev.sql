-- Development setup script for team_logos storage bucket
-- WARNING: This is less secure and should only be used for development
-- Run this in your Supabase SQL editor

-- 1. Create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team_logos',
  'team_logos', 
  false, -- private bucket
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop all existing policies for team_logos
DELETE FROM storage.policies 
WHERE bucket_id = 'team_logos';

-- 3. Create a single permissive policy for development
CREATE POLICY "Allow all authenticated users full access to team_logos" ON storage.objects
FOR ALL 
TO authenticated
USING (bucket_id = 'team_logos')
WITH CHECK (bucket_id = 'team_logos');

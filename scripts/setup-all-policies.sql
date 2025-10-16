-- Complete setup script for all RLS policies
-- Run this in your Supabase SQL editor to fix all permission issues

-- ==============================================
-- 1. STORAGE POLICIES FOR TEAM_LOGOS BUCKET
-- ==============================================

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team_logos',
  'team_logos', 
  false, -- private bucket
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies
DELETE FROM storage.policies WHERE bucket_id = 'team_logos';

-- Create storage policies
CREATE POLICY "Users can upload to their own folder" ON storage.objects
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'team_logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own files" ON storage.objects
FOR SELECT 
TO authenticated
USING (
  bucket_id = 'team_logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own files" ON storage.objects
FOR UPDATE 
TO authenticated
USING (
  bucket_id = 'team_logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'team_logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own files" ON storage.objects
FOR DELETE 
TO authenticated
USING (
  bucket_id = 'team_logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ==============================================
-- 2. TEAMS TABLE POLICIES
-- ==============================================

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own teams" ON teams;
DROP POLICY IF EXISTS "Users can view public teams and their own teams" ON teams;
DROP POLICY IF EXISTS "Users can update their own teams" ON teams;
DROP POLICY IF EXISTS "Users can delete their own teams" ON teams;

-- Create teams policies
CREATE POLICY "Users can create their own teams" ON teams
FOR INSERT 
TO authenticated
WITH CHECK (captain_id = auth.uid());

CREATE POLICY "Users can view public teams and their own teams" ON teams
FOR SELECT 
TO authenticated
USING (
  is_public = true 
  OR captain_id = auth.uid()
  OR id IN (
    SELECT team_id 
    FROM team_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
);

CREATE POLICY "Users can update their own teams" ON teams
FOR UPDATE 
TO authenticated
USING (captain_id = auth.uid())
WITH CHECK (captain_id = auth.uid());

CREATE POLICY "Users can delete their own teams" ON teams
FOR DELETE 
TO authenticated
USING (captain_id = auth.uid());

-- ==============================================
-- 3. TEAM_MEMBERS TABLE POLICIES
-- ==============================================

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create team member records" ON team_members;
DROP POLICY IF EXISTS "Users can view team members of accessible teams" ON team_members;
DROP POLICY IF EXISTS "Captains can update team members" ON team_members;
DROP POLICY IF EXISTS "Captains can delete team members" ON team_members;

-- Create team_members policies
CREATE POLICY "Users can create team member records" ON team_members
FOR INSERT 
TO authenticated
WITH CHECK (
  user_id = auth.uid() 
  OR team_id IN (
    SELECT id FROM teams WHERE captain_id = auth.uid()
  )
);

CREATE POLICY "Users can view team members of accessible teams" ON team_members
FOR SELECT 
TO authenticated
USING (
  team_id IN (
    SELECT id FROM teams 
    WHERE is_public = true 
    OR captain_id = auth.uid()
    OR id IN (
      SELECT tm.team_id 
      FROM team_members tm 
      WHERE tm.user_id = auth.uid() 
      AND tm.status = 'active'
    )
  )
);

CREATE POLICY "Captains can update team members" ON team_members
FOR UPDATE 
TO authenticated
USING (
  team_id IN (
    SELECT id FROM teams WHERE captain_id = auth.uid()
  )
)
WITH CHECK (
  team_id IN (
    SELECT id FROM teams WHERE captain_id = auth.uid()
  )
);

CREATE POLICY "Captains can delete team members" ON team_members
FOR DELETE 
TO authenticated
USING (
  team_id IN (
    SELECT id FROM teams WHERE captain_id = auth.uid()
  )
);

-- ==============================================
-- COMPLETION MESSAGE
-- ==============================================
SELECT 'All RLS policies have been set up successfully!' as status;

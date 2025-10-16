-- Policies for teams table
-- Run this in your Supabase SQL editor

-- 1. Enable RLS on teams table if not already enabled
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create their own teams" ON teams;
DROP POLICY IF EXISTS "Users can view public teams and their own teams" ON teams;
DROP POLICY IF EXISTS "Users can update their own teams" ON teams;
DROP POLICY IF EXISTS "Users can delete their own teams" ON teams;

-- 3. Create policies for teams table

-- Policy 1: Allow users to create teams where they are the captain
CREATE POLICY "Users can create their own teams" ON teams
FOR INSERT 
TO authenticated
WITH CHECK (
  captain_id = auth.uid()
);

-- Policy 2: Allow users to view public teams and teams they're part of
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

-- Policy 3: Allow captains to update their teams
CREATE POLICY "Users can update their own teams" ON teams
FOR UPDATE 
TO authenticated
USING (captain_id = auth.uid())
WITH CHECK (captain_id = auth.uid());

-- Policy 4: Allow captains to delete their teams
CREATE POLICY "Users can delete their own teams" ON teams
FOR DELETE 
TO authenticated
USING (captain_id = auth.uid());

-- Alternative: More permissive policy for development (uncomment if needed)
-- WARNING: This allows any authenticated user to access any team
/*
DROP POLICY IF EXISTS "Allow all authenticated users full access to teams" ON teams;
CREATE POLICY "Allow all authenticated users full access to teams" ON teams
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);
*/

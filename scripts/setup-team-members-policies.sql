-- Policies for team_members table
-- Run this in your Supabase SQL editor

-- 1. Enable RLS on team_members table if not already enabled
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create team member records" ON team_members;
DROP POLICY IF EXISTS "Users can view team members of accessible teams" ON team_members;
DROP POLICY IF EXISTS "Captains can update team members" ON team_members;
DROP POLICY IF EXISTS "Captains can delete team members" ON team_members;

-- 3. Create policies for team_members table

-- Policy 1: Allow users to create team member records (for joining teams or being invited)
CREATE POLICY "Users can create team member records" ON team_members
FOR INSERT 
TO authenticated
WITH CHECK (
  -- Users can add themselves to teams, or captains can add others
  user_id = auth.uid() 
  OR team_id IN (
    SELECT id FROM teams WHERE captain_id = auth.uid()
  )
);

-- Policy 2: Allow users to view team members of teams they have access to
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

-- Policy 3: Allow captains to update team members
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

-- Policy 4: Allow captains to delete team members
CREATE POLICY "Captains can delete team members" ON team_members
FOR DELETE 
TO authenticated
USING (
  team_id IN (
    SELECT id FROM teams WHERE captain_id = auth.uid()
  )
);

-- Alternative: More permissive policy for development (uncomment if needed)
-- WARNING: This allows any authenticated user to access any team member record
/*
DROP POLICY IF EXISTS "Allow all authenticated users full access to team_members" ON team_members;
CREATE POLICY "Allow all authenticated users full access to team_members" ON team_members
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);
*/

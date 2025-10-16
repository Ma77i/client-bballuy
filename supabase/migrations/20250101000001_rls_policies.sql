-- Enable Row Level Security on all tables
ALTER TABLE users_public ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE court_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE court_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE thread_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is moderator or admin
CREATE OR REPLACE FUNCTION is_moderator_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users_public
    WHERE id = auth.uid()
    AND app_role IN ('moderator', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is team captain
CREATE OR REPLACE FUNCTION is_team_captain(team_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM teams
    WHERE id = team_uuid
    AND captain_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is team member
CREATE OR REPLACE FUNCTION is_team_member(team_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members
    WHERE team_id = team_uuid
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if users share a team
CREATE OR REPLACE FUNCTION shares_team_with(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members tm1
    INNER JOIN team_members tm2 ON tm1.team_id = tm2.team_id
    WHERE tm1.user_id = auth.uid()
    AND tm2.user_id = target_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is blocked
CREATE OR REPLACE FUNCTION is_blocked_by(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM blocked_users
    WHERE blocker_id = target_user_id
    AND blocked_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- users_public policies
CREATE POLICY "Users can view public profiles"
  ON users_public FOR SELECT
  USING (
    profile_visibility = 'public'
    OR id = auth.uid()
    OR shares_team_with(id)
    OR is_moderator_or_admin()
  );

CREATE POLICY "Users can update own profile"
  ON users_public FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON users_public FOR INSERT
  WITH CHECK (id = auth.uid());

-- teams policies
CREATE POLICY "Anyone can view public teams"
  ON teams FOR SELECT
  USING (
    is_public = true
    OR is_team_member(id)
    OR is_moderator_or_admin()
  );

CREATE POLICY "Authenticated users can create teams"
  ON teams FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND captain_id = auth.uid());

CREATE POLICY "Captains and moderators can update teams"
  ON teams FOR UPDATE
  USING (
    captain_id = auth.uid()
    OR is_moderator_or_admin()
  )
  WITH CHECK (
    captain_id = auth.uid()
    OR is_moderator_or_admin()
  );

CREATE POLICY "Captains and moderators can delete teams"
  ON teams FOR DELETE
  USING (
    captain_id = auth.uid()
    OR is_moderator_or_admin()
  );

-- team_members policies
CREATE POLICY "Team members can view their team roster"
  ON team_members FOR SELECT
  USING (
    is_team_member(team_id)
    OR is_moderator_or_admin()
  );

CREATE POLICY "Captains can add team members"
  ON team_members FOR INSERT
  WITH CHECK (
    is_team_captain(team_id)
    OR is_moderator_or_admin()
  );

CREATE POLICY "Captains can remove team members"
  ON team_members FOR DELETE
  USING (
    is_team_captain(team_id)
    OR user_id = auth.uid()
    OR is_moderator_or_admin()
  );

CREATE POLICY "Captains can update team members"
  ON team_members FOR UPDATE
  USING (
    is_team_captain(team_id)
    OR is_moderator_or_admin()
  )
  WITH CHECK (
    is_team_captain(team_id)
    OR is_moderator_or_admin()
  );

-- courts policies
CREATE POLICY "Anyone can view courts"
  ON courts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create courts"
  ON courts FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

CREATE POLICY "Creators and moderators can update courts"
  ON courts FOR UPDATE
  USING (
    created_by = auth.uid()
    OR is_moderator_or_admin()
  )
  WITH CHECK (
    created_by = auth.uid()
    OR is_moderator_or_admin()
  );

CREATE POLICY "Creators and moderators can delete courts"
  ON courts FOR DELETE
  USING (
    created_by = auth.uid()
    OR is_moderator_or_admin()
  );

-- court_photos policies
CREATE POLICY "Anyone can view court photos"
  ON court_photos FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can upload court photos"
  ON court_photos FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Uploaders and moderators can delete photos"
  ON court_photos FOR DELETE
  USING (
    user_id = auth.uid()
    OR is_moderator_or_admin()
  );

-- court_ratings policies
CREATE POLICY "Anyone can view court ratings"
  ON court_ratings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can rate courts"
  ON court_ratings FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can update their own ratings"
  ON court_ratings FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own ratings"
  ON court_ratings FOR DELETE
  USING (user_id = auth.uid());

-- matches policies
CREATE POLICY "Anyone can view public matches"
  ON matches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM match_participants
      WHERE match_id = matches.id
      AND user_id = auth.uid()
    )
    OR home_team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
    OR away_team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
    OR is_moderator_or_admin()
    OR true
  );

CREATE POLICY "Authenticated users can create matches"
  ON matches FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

CREATE POLICY "Captains and creators can update matches"
  ON matches FOR UPDATE
  USING (
    created_by = auth.uid()
    OR (home_team_id IS NOT NULL AND is_team_captain(home_team_id))
    OR (away_team_id IS NOT NULL AND is_team_captain(away_team_id))
    OR is_moderator_or_admin()
  )
  WITH CHECK (
    created_by = auth.uid()
    OR (home_team_id IS NOT NULL AND is_team_captain(home_team_id))
    OR (away_team_id IS NOT NULL AND is_team_captain(away_team_id))
    OR is_moderator_or_admin()
  );

CREATE POLICY "Creators and moderators can delete matches"
  ON matches FOR DELETE
  USING (
    created_by = auth.uid()
    OR is_moderator_or_admin()
  );

-- match_participants policies
CREATE POLICY "Anyone can view match participants"
  ON match_participants FOR SELECT
  USING (true);

CREATE POLICY "Users can join matches"
  ON match_participants FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can leave matches"
  ON match_participants FOR DELETE
  USING (
    user_id = auth.uid()
    OR is_moderator_or_admin()
  );

CREATE POLICY "Match organizers can update participants"
  ON match_participants FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE id = match_participants.match_id
      AND created_by = auth.uid()
    )
    OR is_moderator_or_admin()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM matches
      WHERE id = match_participants.match_id
      AND created_by = auth.uid()
    )
    OR is_moderator_or_admin()
  );

-- threads policies
CREATE POLICY "Thread participants can view threads"
  ON threads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM thread_participants
      WHERE thread_id = threads.id
      AND user_id = auth.uid()
    )
    OR is_moderator_or_admin()
  );

CREATE POLICY "Authenticated users can create threads"
  ON threads FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- thread_participants policies
CREATE POLICY "Thread participants can view participants"
  ON thread_participants FOR SELECT
  USING (
    thread_id IN (
      SELECT thread_id FROM thread_participants WHERE user_id = auth.uid()
    )
    OR is_moderator_or_admin()
  );

CREATE POLICY "Thread creators can add participants"
  ON thread_participants FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can leave threads"
  ON thread_participants FOR DELETE
  USING (
    user_id = auth.uid()
    OR is_moderator_or_admin()
  );

CREATE POLICY "Users can update their thread participation"
  ON thread_participants FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- messages policies
CREATE POLICY "Thread participants can view messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM thread_participants
      WHERE thread_id = messages.thread_id
      AND user_id = auth.uid()
    )
    OR is_moderator_or_admin()
  );

CREATE POLICY "Thread participants can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM thread_participants
      WHERE thread_id = messages.thread_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Senders and moderators can delete messages"
  ON messages FOR DELETE
  USING (
    sender_id = auth.uid()
    OR is_moderator_or_admin()
  );

-- reports policies
CREATE POLICY "Authenticated users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND reporter_id = auth.uid());

CREATE POLICY "Reporters can view their own reports"
  ON reports FOR SELECT
  USING (
    reporter_id = auth.uid()
    OR is_moderator_or_admin()
  );

CREATE POLICY "Moderators can update reports"
  ON reports FOR UPDATE
  USING (is_moderator_or_admin())
  WITH CHECK (is_moderator_or_admin());

-- blocked_users policies
CREATE POLICY "Users can view their blocked list"
  ON blocked_users FOR SELECT
  USING (blocker_id = auth.uid());

CREATE POLICY "Users can block others"
  ON blocked_users FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND blocker_id = auth.uid());

CREATE POLICY "Users can unblock others"
  ON blocked_users FOR DELETE
  USING (blocker_id = auth.uid());

-- audit_logs policies
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users_public
      WHERE id = auth.uid()
      AND app_role = 'admin'
    )
  );

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- consent_records policies
CREATE POLICY "Users can view their own consent records"
  ON consent_records FOR SELECT
  USING (
    user_id = auth.uid()
    OR is_moderator_or_admin()
  );

CREATE POLICY "Users can create consent records"
  ON consent_records FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- user_sessions policies
CREATE POLICY "Users can view their own sessions"
  ON user_sessions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create sessions"
  ON user_sessions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can delete their own sessions"
  ON user_sessions FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own sessions"
  ON user_sessions FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- rate_limits policies (service role only)
CREATE POLICY "Service role can manage rate limits"
  ON rate_limits FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

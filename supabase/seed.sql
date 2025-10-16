-- Seed script for StreetHoops app
-- Run with: psql -h localhost -U postgres -d postgres -f supabase/seed.sql

-- Insert sample users (passwords are hashed, use 'TestPassword123' for all)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'player1@test.com', crypt('TestPassword123', gen_salt('bf')), NOW(), '{"display_name": "Alex Johnson"}', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'player2@test.com', crypt('TestPassword123', gen_salt('bf')), NOW(), '{"display_name": "Jordan Smith"}', NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'captain@test.com', crypt('TestPassword123', gen_salt('bf')), NOW(), '{"display_name": "Taylor Brown"}', NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'moderator@test.com', crypt('TestPassword123', gen_salt('bf')), NOW(), '{"display_name": "Casey Moderator"}', NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'admin@test.com', crypt('TestPassword123', gen_salt('bf')), NOW(), '{"display_name": "Admin User"}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Update user profiles with roles and stats
UPDATE users_public SET
  app_role = 'player',
  level = 12,
  xp = 2400,
  games_played = 24,
  games_won = 15,
  points_total = 456,
  assists_total = 89,
  rebounds_total = 134,
  bio = 'Love playing pickup games!',
  city = 'San Francisco, CA'
WHERE id = '11111111-1111-1111-1111-111111111111';

UPDATE users_public SET
  app_role = 'player',
  level = 8,
  xp = 1200,
  games_played = 15,
  games_won = 8,
  points_total = 234,
  assists_total = 45,
  rebounds_total = 67,
  bio = 'Always down for a game',
  city = 'Oakland, CA'
WHERE id = '22222222-2222-2222-2222-222222222222';

UPDATE users_public SET
  app_role = 'team_captain',
  level = 18,
  xp = 4500,
  games_played = 45,
  games_won = 30,
  points_total = 890,
  assists_total = 156,
  rebounds_total = 234,
  bio = 'Team captain | Competitive player',
  city = 'Berkeley, CA'
WHERE id = '33333333-3333-3333-3333-333333333333';

UPDATE users_public SET
  app_role = 'moderator',
  bio = 'Community moderator',
  city = 'San Francisco, CA'
WHERE id = '44444444-4444-4444-4444-444444444444';

UPDATE users_public SET
  app_role = 'admin',
  bio = 'Platform administrator',
  city = 'San Francisco, CA'
WHERE id = '55555555-5555-5555-5555-555555555555';

-- Insert sample courts
INSERT INTO courts (id, name, coords, address, surface, lighting, indoor, hoops_count, notes, rating_avg, rating_count, created_by)
VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Golden Gate Park Court', ST_SetSRID(ST_MakePoint(-122.4783, 37.7694), 4326), '501 Stanyan St, San Francisco, CA 94117', 'concrete', true, false, 2, 'Great outdoor court with lights. Gets busy on weekends.', 4.5, 12, '11111111-1111-1111-1111-111111111111'),
  ('c2222222-2222-2222-2222-222222222222', 'Mission Rec Center', ST_SetSRID(ST_MakePoint(-122.4194, 37.7599), 4326), '2450 Harrison St, San Francisco, CA 94110', 'wood', true, true, 1, 'Indoor court, well maintained. Need to reserve.', 4.8, 25, '22222222-2222-2222-2222-222222222222'),
  ('c3333333-3333-3333-3333-333333333333', 'Dolores Park Courts', ST_SetSRID(ST_MakePoint(-122.4269, 37.7596), 4326), 'Dolores St & 19th St, San Francisco, CA 94114', 'asphalt', false, false, 2, 'Popular spot, great views. No lights.', 4.2, 18, '33333333-3333-3333-3333-333333333333'),
  ('c4444444-4444-4444-4444-444444444444', 'Lake Merritt Courts', ST_SetSRID(ST_MakePoint(-122.2585, 37.8044), 4326), '568 Bellevue Ave, Oakland, CA 94610', 'concrete', true, false, 3, 'Multiple courts, good for tournaments.', 4.6, 30, '11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

-- Insert sample teams
INSERT INTO teams (id, name, captain_id, is_public, description, home_court_id, wins, losses)
VALUES
  ('t1111111-1111-1111-1111-111111111111', 'The Hoopers', '33333333-3333-3333-3333-333333333333', true, 'Community basketball team. All skill levels welcome!', 'c1111111-1111-1111-1111-111111111111', 15, 8),
  ('t2222222-2222-2222-2222-222222222222', 'Mission Ballers', '11111111-1111-1111-1111-111111111111', true, 'Competitive team from the Mission district.', 'c2222222-2222-2222-2222-222222222222', 22, 5),
  ('t3333333-3333-3333-3333-333333333333', 'Oakland Warriors', '22222222-2222-2222-2222-222222222222', true, 'East Bay represent!', 'c4444444-4444-4444-4444-444444444444', 18, 10)
ON CONFLICT (id) DO NOTHING;

-- Insert team members
INSERT INTO team_members (team_id, user_id, role, position, jersey_number)
VALUES
  ('t1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'captain', 'Point Guard', 1),
  ('t1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'member', 'Shooting Guard', 23),
  ('t2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'captain', 'Small Forward', 7),
  ('t2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'member', 'Power Forward', 15),
  ('t3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'captain', 'Center', 33)
ON CONFLICT (team_id, user_id) DO NOTHING;

-- Insert sample matches
INSERT INTO matches (id, home_team_id, away_team_id, court_id, scheduled_at, status, score_home, score_away, created_by)
VALUES
  ('m1111111-1111-1111-1111-111111111111', 't1111111-1111-1111-1111-111111111111', 't2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', NOW() + INTERVAL '2 days', 'scheduled', NULL, NULL, '33333333-3333-3333-3333-333333333333'),
  ('m2222222-2222-2222-2222-222222222222', 't2222222-2222-2222-2222-222222222222', 't3333333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '3 days', 'completed', 78, 72, '11111111-1111-1111-1111-111111111111'),
  ('m3333333-3333-3333-3333-333333333333', 't1111111-1111-1111-1111-111111111111', 't3333333-3333-3333-3333-333333333333', 'c4444444-4444-4444-4444-444444444444', NOW() + INTERVAL '5 days', 'scheduled', NULL, NULL, '33333333-3333-3333-3333-333333333333')
ON CONFLICT (id) DO NOTHING;

-- Insert sample reports (for moderation testing)
INSERT INTO reports (id, reporter_id, target_type, target_id, reason, description, status)
VALUES
  ('r1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'user', '22222222-2222-2222-2222-222222222222', 'spam', 'User is spamming chat messages', 'pending'),
  ('r2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'court', 'c3333333-3333-3333-3333-333333333333', 'inappropriate_content', 'Inappropriate graffiti on court photo', 'reviewing')
ON CONFLICT (id) DO NOTHING;

-- Insert consent records
INSERT INTO consent_records (user_id, consent_type, version, consented_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'tos', '1.0', NOW()),
  ('11111111-1111-1111-1111-111111111111', 'privacy_policy', '1.0', NOW()),
  ('11111111-1111-1111-1111-111111111111', 'age_verification', '1.0', NOW()),
  ('22222222-2222-2222-2222-222222222222', 'tos', '1.0', NOW()),
  ('22222222-2222-2222-2222-222222222222', 'privacy_policy', '1.0', NOW()),
  ('22222222-2222-2222-2222-222222222222', 'age_verification', '1.0', NOW())
ON CONFLICT DO NOTHING;

-- Insert audit logs
INSERT INTO audit_logs (actor_id, action, target_type, target_id, metadata)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'user_signup', 'user', '11111111-1111-1111-1111-111111111111', '{"method": "email"}'),
  ('33333333-3333-3333-3333-333333333333', 'team_created', 'team', 't1111111-1111-1111-1111-111111111111', '{"team_name": "The Hoopers"}'),
  ('44444444-4444-4444-4444-444444444444', 'report_reviewed', 'report', 'r2222222-2222-2222-2222-222222222222', '{"action": "reviewing"}')
ON CONFLICT DO NOTHING;

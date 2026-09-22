-- LOCAL BASELINE ONLY. Reconstructed from the reviewed 2026-09-19 inventory.

-- Preserves existing behavior, including permission issues assigned to T03.

-- Not a remote upgrade. Does not replace the historical root migrations.

SET search_path = public, extensions;

SET check_function_bodies = off;

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;

CREATE TYPE public."app_role" AS ENUM ('player', 'team_captain', 'moderator', 'admin');

CREATE TYPE public."game_mode" AS ENUM ('1v1', '2v2', '3v3', '4v4', '5v5');

CREATE TYPE public."location_mode" AS ENUM ('precise', 'approx');

CREATE TYPE public."match_side" AS ENUM ('A', 'B');

CREATE TYPE public."match_status" AS ENUM ('scheduled', 'playing', 'finished', 'canceled');

CREATE TYPE public."profile_visibility" AS ENUM ('public', 'friends', 'private');

CREATE TYPE public."report_status" AS ENUM ('open', 'under_review', 'resolved', 'dismissed');

CREATE TYPE public."target_type" AS ENUM ('user', 'team', 'message', 'photo', 'court', 'match');

CREATE TYPE public."thread_type" AS ENUM ('team', 'dm', 'match');

CREATE TABLE public."achievements" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "key" text,
  "name" text,
  "description" text,
  "icon_url" text
);

CREATE TABLE public."audit_logs" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "actor_id" uuid,
  "action" text NOT NULL,
  "target_type" text,
  "target_id" uuid,
  "metadata" jsonb,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public."courts" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "coords" geography(Point,4326) NOT NULL,
  "surface" text,
  "lighting" text,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "half_court" boolean DEFAULT false NOT NULL
);

CREATE TABLE public."game_participants" (
  "game_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "side" match_side NOT NULL,
  "joined_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public."games" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "mode" game_mode NOT NULL,
  "status" match_status DEFAULT 'scheduled'::match_status NOT NULL,
  "created_by" uuid NOT NULL,
  "court_id" uuid NOT NULL,
  "is_public" boolean DEFAULT true NOT NULL,
  "scheduled_at" timestamp with time zone DEFAULT now(),
  "started_at" timestamp with time zone,
  "finished_at" timestamp with time zone,
  "score_a" integer DEFAULT 0 NOT NULL,
  "score_b" integer DEFAULT 0 NOT NULL,
  "note" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public."matches" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "home_team_id" uuid NOT NULL,
  "away_team_id" uuid NOT NULL,
  "court_id" uuid NOT NULL,
  "scheduled_at" timestamp with time zone NOT NULL,
  "status" match_status DEFAULT 'scheduled'::match_status NOT NULL,
  "score_home" integer DEFAULT 0 NOT NULL,
  "score_away" integer DEFAULT 0 NOT NULL,
  "created_by" uuid NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public."messages" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "thread_id" uuid NOT NULL,
  "sender_id" uuid NOT NULL,
  "content" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public."reports" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "reporter_id" uuid NOT NULL,
  "target_type" target_type NOT NULL,
  "target_id" uuid,
  "reason" text NOT NULL,
  "status" report_status DEFAULT 'open'::report_status NOT NULL,
  "moderator_id" uuid,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public."team_members" (
  "team_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "role" app_role DEFAULT 'player'::app_role NOT NULL,
  "joined_at" timestamp with time zone DEFAULT now() NOT NULL,
  "status" text DEFAULT 'active'::text
);

CREATE TABLE public."teams" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "captain_id" uuid DEFAULT auth.uid() NOT NULL,
  "logo_url" text,
  "is_public" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "description" text,
  "type" text DEFAULT 'Casual'::text,
  "home_court_id" uuid,
  "requires_approval" boolean DEFAULT false NOT NULL,
  "minimum_players" integer
);

CREATE TABLE public."thread_participants" (
  "thread_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "joined_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public."threads" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "type" thread_type NOT NULL,
  "team_id" uuid,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public."user_achievements" (
  "user_id" uuid NOT NULL,
  "achievement_id" uuid NOT NULL,
  "unlocked_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE public."user_consents" (
  "user_id" uuid NOT NULL,
  "tos_version" text NOT NULL,
  "privacy_version" text NOT NULL,
  "accepted_at" timestamp with time zone DEFAULT now() NOT NULL,
  "source" text DEFAULT 'app'::text,
  "meta" jsonb DEFAULT '{}'::jsonb
);

CREATE TABLE public."users_public" (
  "id" uuid NOT NULL,
  "display_name" text,
  "avatar_url" text,
  "app_role" app_role DEFAULT 'player'::app_role NOT NULL,
  "discoverable" boolean DEFAULT true NOT NULL,
  "profile_visibility" profile_visibility DEFAULT 'public'::profile_visibility NOT NULL,
  "location_mode" location_mode DEFAULT 'precise'::location_mode NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "level" integer DEFAULT 1,
  "games_played" integer DEFAULT 0,
  "points_total" integer DEFAULT 0,
  "assists_total" integer DEFAULT 0,
  "rebounds_total" integer DEFAULT 0
);

ALTER TABLE public."achievements" ADD CONSTRAINT "achievements_key_key" UNIQUE (key);

ALTER TABLE public."achievements" ADD CONSTRAINT "achievements_pkey" PRIMARY KEY (id);

ALTER TABLE public."audit_logs" ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY (id);

ALTER TABLE public."courts" ADD CONSTRAINT "courts_pkey" PRIMARY KEY (id);

ALTER TABLE public."game_participants" ADD CONSTRAINT "game_participants_pkey" PRIMARY KEY (game_id, user_id);

ALTER TABLE public."games" ADD CONSTRAINT "games_pkey" PRIMARY KEY (id);

ALTER TABLE public."games" ADD CONSTRAINT "games_score_nonneg" CHECK (((score_a >= 0) AND (score_b >= 0)));

ALTER TABLE public."matches" ADD CONSTRAINT "different_teams" CHECK ((home_team_id <> away_team_id));

ALTER TABLE public."matches" ADD CONSTRAINT "matches_pkey" PRIMARY KEY (id);

ALTER TABLE public."messages" ADD CONSTRAINT "messages_pkey" PRIMARY KEY (id);

ALTER TABLE public."reports" ADD CONSTRAINT "reports_pkey" PRIMARY KEY (id);

ALTER TABLE public."team_members" ADD CONSTRAINT "team_members_pkey" PRIMARY KEY (team_id, user_id);

ALTER TABLE public."team_members" ADD CONSTRAINT "team_members_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'pending'::text])));

ALTER TABLE public."teams" ADD CONSTRAINT "teams_pkey" PRIMARY KEY (id);

ALTER TABLE public."teams" ADD CONSTRAINT "teams_type_check" CHECK ((type = ANY (ARRAY['Casual'::text, 'Competitive'::text])));

ALTER TABLE public."thread_participants" ADD CONSTRAINT "thread_participants_pkey" PRIMARY KEY (thread_id, user_id);

ALTER TABLE public."threads" ADD CONSTRAINT "threads_pkey" PRIMARY KEY (id);

ALTER TABLE public."user_achievements" ADD CONSTRAINT "user_achievements_pkey" PRIMARY KEY (user_id, achievement_id);

ALTER TABLE public."user_consents" ADD CONSTRAINT "user_consents_pkey" PRIMARY KEY (user_id);

ALTER TABLE public."users_public" ADD CONSTRAINT "users_public_pkey" PRIMARY KEY (id);

ALTER TABLE public."audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY (actor_id) REFERENCES users_public(id) ON DELETE SET NULL;

ALTER TABLE public."game_participants" ADD CONSTRAINT "game_participants_game_id_fkey" FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE;

ALTER TABLE public."game_participants" ADD CONSTRAINT "game_participants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users_public(id) ON DELETE CASCADE;

ALTER TABLE public."games" ADD CONSTRAINT "games_court_id_fkey" FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE SET NULL;

ALTER TABLE public."games" ADD CONSTRAINT "games_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users_public(id) ON DELETE SET NULL;

ALTER TABLE public."matches" ADD CONSTRAINT "matches_away_team_id_fkey" FOREIGN KEY (away_team_id) REFERENCES teams(id) ON DELETE CASCADE;

ALTER TABLE public."matches" ADD CONSTRAINT "matches_court_id_fkey" FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE SET NULL;

ALTER TABLE public."matches" ADD CONSTRAINT "matches_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users_public(id) ON DELETE SET NULL;

ALTER TABLE public."matches" ADD CONSTRAINT "matches_home_team_id_fkey" FOREIGN KEY (home_team_id) REFERENCES teams(id) ON DELETE CASCADE;

ALTER TABLE public."messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES users_public(id) ON DELETE SET NULL;

ALTER TABLE public."messages" ADD CONSTRAINT "messages_thread_id_fkey" FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE;

ALTER TABLE public."reports" ADD CONSTRAINT "reports_moderator_id_fkey" FOREIGN KEY (moderator_id) REFERENCES users_public(id) ON DELETE SET NULL;

ALTER TABLE public."reports" ADD CONSTRAINT "reports_reporter_id_fkey" FOREIGN KEY (reporter_id) REFERENCES users_public(id) ON DELETE SET NULL;

ALTER TABLE public."team_members" ADD CONSTRAINT "team_members_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE;

ALTER TABLE public."team_members" ADD CONSTRAINT "team_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users_public(id) ON DELETE CASCADE;

ALTER TABLE public."teams" ADD CONSTRAINT "teams_captain_id_fkey" FOREIGN KEY (captain_id) REFERENCES users_public(id) ON DELETE RESTRICT;

ALTER TABLE public."teams" ADD CONSTRAINT "teams_home_court_id_fkey" FOREIGN KEY (home_court_id) REFERENCES courts(id) ON DELETE SET NULL;

ALTER TABLE public."thread_participants" ADD CONSTRAINT "thread_participants_thread_id_fkey" FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE;

ALTER TABLE public."thread_participants" ADD CONSTRAINT "thread_participants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users_public(id) ON DELETE CASCADE;

ALTER TABLE public."threads" ADD CONSTRAINT "threads_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE;

ALTER TABLE public."user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_fkey" FOREIGN KEY (achievement_id) REFERENCES achievements(id);

ALTER TABLE public."user_achievements" ADD CONSTRAINT "user_achievements_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users_public(id);

ALTER TABLE public."user_consents" ADD CONSTRAINT "user_consents_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX courts_coords_idx ON public.courts USING gist (coords);

CREATE INDEX game_participants_side_idx ON public.game_participants USING btree (game_id, side);

CREATE INDEX game_participants_user_idx ON public.game_participants USING btree (user_id);

CREATE INDEX games_created_by_idx ON public.games USING btree (created_by);

CREATE INDEX games_mode_idx ON public.games USING btree (mode);

CREATE INDEX games_scheduled_idx ON public.games USING btree (scheduled_at);

CREATE INDEX games_status_idx ON public.games USING btree (status);

CREATE INDEX matches_court_idx ON public.matches USING btree (court_id);

CREATE INDEX matches_status_idx ON public.matches USING btree (status);

CREATE INDEX matches_team_idx ON public.matches USING btree (home_team_id, away_team_id);

CREATE INDEX messages_sender_idx ON public.messages USING btree (sender_id);

CREATE INDEX messages_thread_idx ON public.messages USING btree (thread_id);

CREATE INDEX reports_status_idx ON public.reports USING btree (status);

CREATE INDEX reports_target_idx ON public.reports USING btree (target_type, target_id);

CREATE INDEX idx_team_members_team ON public.team_members USING btree (team_id);

CREATE INDEX idx_team_members_user_team ON public.team_members USING btree (user_id, team_id);

CREATE INDEX team_members_user_idx ON public.team_members USING btree (user_id);

CREATE INDEX teams_captain_idx ON public.teams USING btree (captain_id);

CREATE INDEX thread_participants_user_idx ON public.thread_participants USING btree (user_id);

CREATE INDEX user_achievements_ach_idx ON public.user_achievements USING btree (achievement_id);

CREATE INDEX user_achievements_user_idx ON public.user_achievements USING btree (user_id);

CREATE INDEX users_public_role_idx ON public.users_public USING btree (app_role);

CREATE OR REPLACE FUNCTION public.can_read_team(team uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (
    select 1 from public.teams t
    where t.id = team
      and (
        t.is_public = true
        or t.captain_id = auth.uid()
        or public.is_active_member(auth.uid(), team)
      )
  );
$function$;

CREATE OR REPLACE FUNCTION public.enforce_team_member_status()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  req boolean;
BEGIN
  -- Solo fuerza en altas de jugadores normales (no toca al capitán)
  IF new.role = 'player' THEN
    SELECT requires_approval INTO req
    FROM public.teams
    WHERE id = new.team_id;

    IF req IS TRUE THEN
      new.status := 'pending';
    ELSE
      new.status := coalesce(new.status, 'active');
    END IF;
  END IF;

  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.users_public(id, display_name, avatar_url, app_role)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', ''), null, 'player');
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.is_active_member(u uuid, team uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (
    select 1
    from public.team_members tm
    where tm.team_id = team
      and tm.user_id = u
      and (tm.status is null or tm.status = 'active')
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_captain(u uuid, team uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(
    (select captain_id = u from public.teams where id = team),
    false
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_mod_or_admin(u uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (
    select 1 from public.users_public
    where id = u and app_role in ('moderator','admin')
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_thread_participant(u uuid, th uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (
    select 1 from public.thread_participants tp
    where tp.thread_id = th and tp.user_id = u
  );
$function$;

CREATE OR REPLACE FUNCTION public.log_action(p_actor uuid, p_action text, p_target_type text, p_target_id uuid, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  insert into public.audit_logs (actor_id, action, target_type, target_id, metadata)
  values (p_actor, p_action, p_target_type, p_target_id, p_metadata);
$function$;

CREATE OR REPLACE FUNCTION public.prevent_captain_leaving()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  is_captain boolean;
begin
  -- si no es su propia fila, no aplicamos (policy ya limita a self)
  if old.user_id <> auth.uid() then
    return old;
  end if;

  select (t.captain_id = old.user_id) into is_captain
  from public.teams t
  where t.id = old.team_id;

  if is_captain then
    raise exception 'Captains cannot leave their own team. Transfer captaincy first.';
  end if;

  return old;
end;
$function$;

CREATE OR REPLACE FUNCTION public.share_team(a uuid, b uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (
    select 1
    from public.team_members tm1
    join public.team_members tm2 on tm1.team_id = tm2.team_id
    where tm1.user_id = a
      and tm2.user_id = b
      and (tm1.status is null or tm1.status = 'active')
      and (tm2.status is null or tm2.status = 'active')
  );
$function$;

CREATE OR REPLACE FUNCTION public.touch_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if (NEW.updated_at is not null) then
    NEW.updated_at := now();
  end if;
  return NEW;
end;
$function$;

CREATE OR REPLACE FUNCTION public.whoami()
 RETURNS uuid
 LANGUAGE sql
 STABLE
AS $function$ select auth.uid(); $function$;

CREATE VIEW public."user_stats" AS  WITH finished AS (
         SELECT g.id,
            g.score_a,
            g.score_b
           FROM games g
          WHERE g.status = 'finished'::match_status
        ), per_user AS (
         SELECT gp.user_id,
            gp.game_id,
            gp.side,
                CASE
                    WHEN gp.side = 'A'::match_side AND f.score_a > f.score_b OR gp.side = 'B'::match_side AND f.score_b > f.score_a THEN 1
                    ELSE 0
                END AS win
           FROM game_participants gp
             JOIN finished f ON f.id = gp.game_id
        )
 SELECT u.id AS user_id,
    u.display_name,
    count(pu.game_id)::integer AS games_played,
    COALESCE(sum(pu.win), 0::bigint)::integer AS wins,
    (count(pu.game_id) - COALESCE(sum(pu.win), 0::bigint))::integer AS losses
   FROM users_public u
     LEFT JOIN per_user pu ON pu.user_id = u.id
  GROUP BY u.id, u.display_name;

CREATE TRIGGER trg_on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user();

CREATE TRIGGER trg_reports_touch BEFORE UPDATE ON public.reports FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER trg_enforce_team_member_status BEFORE INSERT ON public.team_members FOR EACH ROW EXECUTE FUNCTION enforce_team_member_status();

CREATE TRIGGER trg_prevent_captain_leaving BEFORE DELETE ON public.team_members FOR EACH ROW EXECUTE FUNCTION prevent_captain_leaving();

ALTER TABLE public."audit_logs" ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."courts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."matches" ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."messages" ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."reports" ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."team_members" ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."teams" ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."thread_participants" ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."threads" ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."user_consents" ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."users_public" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_insert" ON public."audit_logs" AS PERMISSIVE FOR INSERT TO PUBLIC WITH CHECK (false);

CREATE POLICY "audit_logs_select" ON public."audit_logs" AS PERMISSIVE FOR SELECT TO "authenticated" USING (is_mod_or_admin(auth.uid()));

CREATE POLICY "audit_select" ON public."audit_logs" AS PERMISSIVE FOR SELECT TO PUBLIC USING ((EXISTS ( SELECT 1
   FROM users_public u
  WHERE ((u.id = auth.uid()) AND (u.app_role = 'admin'::app_role)))));

CREATE POLICY "courts_select" ON public."courts" AS PERMISSIVE FOR SELECT TO PUBLIC USING (true);

CREATE POLICY "matches_delete" ON public."matches" AS PERMISSIVE FOR DELETE TO PUBLIC USING (is_mod_or_admin(auth.uid()));

CREATE POLICY "matches_insert" ON public."matches" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((is_captain(auth.uid(), home_team_id) OR is_captain(auth.uid(), away_team_id)));

CREATE POLICY "matches_select" ON public."matches" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((can_read_team(home_team_id) OR can_read_team(away_team_id)));

CREATE POLICY "matches_select_accessible" ON public."matches" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM teams t
  WHERE (((t.id = matches.home_team_id) OR (t.id = matches.away_team_id)) AND ((t.is_public = true) OR (t.captain_id = auth.uid()) OR (EXISTS ( SELECT 1
           FROM team_members tm
          WHERE ((tm.team_id = t.id) AND (tm.user_id = auth.uid()) AND (COALESCE(tm.status, 'active'::text) = ANY (ARRAY['active'::text, 'pending'::text]))))))))));

CREATE POLICY "matches_update" ON public."matches" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((is_captain(auth.uid(), home_team_id) OR is_captain(auth.uid(), away_team_id) OR is_mod_or_admin(auth.uid()))) WITH CHECK ((is_captain(auth.uid(), home_team_id) OR is_captain(auth.uid(), away_team_id) OR is_mod_or_admin(auth.uid())));

CREATE POLICY "messages_delete" ON public."messages" AS PERMISSIVE FOR DELETE TO PUBLIC USING ((is_thread_participant(auth.uid(), thread_id) OR is_mod_or_admin(auth.uid())));

CREATE POLICY "messages_insert" ON public."messages" AS PERMISSIVE FOR INSERT TO PUBLIC WITH CHECK ((is_thread_participant(auth.uid(), thread_id) AND (auth.uid() = sender_id)));

CREATE POLICY "messages_select" ON public."messages" AS PERMISSIVE FOR SELECT TO PUBLIC USING (is_thread_participant(auth.uid(), thread_id));

CREATE POLICY "msg_insert" ON public."messages" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((sender_id = auth.uid()) AND is_thread_participant(auth.uid(), thread_id)));

CREATE POLICY "msg_select" ON public."messages" AS PERMISSIVE FOR SELECT TO "authenticated" USING (is_thread_participant(auth.uid(), thread_id));

CREATE POLICY "reports_insert" ON public."reports" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((reporter_id = auth.uid()));

CREATE POLICY "reports_select" ON public."reports" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((reporter_id = auth.uid()) OR is_mod_or_admin(auth.uid())));

CREATE POLICY "reports_update" ON public."reports" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (is_mod_or_admin(auth.uid())) WITH CHECK (is_mod_or_admin(auth.uid()));

CREATE POLICY "tmem_delete_self" ON public."team_members" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((user_id = auth.uid()));

CREATE POLICY "tmem_insert_self" ON public."team_members" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((user_id = auth.uid()));

CREATE POLICY "tmem_select_roster_if_public_or_captain" ON public."team_members" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((team_id IN ( SELECT t.id
   FROM teams t
  WHERE ((t.is_public = true) OR (t.captain_id = auth.uid())))));

CREATE POLICY "tmem_select_self" ON public."team_members" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((user_id = auth.uid()));

CREATE POLICY "teams_delete_captain" ON public."teams" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((captain_id = auth.uid()));

CREATE POLICY "teams_insert_self_captain" ON public."teams" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((captain_id = auth.uid()));

CREATE POLICY "teams_select_public_or_captain" ON public."teams" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((is_public = true) OR (captain_id = auth.uid())));

CREATE POLICY "teams_update_captain" ON public."teams" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((captain_id = auth.uid())) WITH CHECK ((captain_id = auth.uid()));

CREATE POLICY "tp_delete" ON public."thread_participants" AS PERMISSIVE FOR DELETE TO "authenticated" USING (((user_id = auth.uid()) OR is_captain(auth.uid(), ( SELECT t.team_id
   FROM threads t
  WHERE (t.id = thread_participants.thread_id)))));

CREATE POLICY "tp_insert" ON public."thread_participants" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((user_id = auth.uid()) OR is_captain(auth.uid(), ( SELECT t.team_id
   FROM threads t
  WHERE (t.id = thread_participants.thread_id)))));

CREATE POLICY "tp_select" ON public."thread_participants" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((is_thread_participant(auth.uid(), thread_id) OR can_read_team(( SELECT t.team_id
   FROM threads t
  WHERE (t.id = thread_participants.thread_id)))));

CREATE POLICY "tparts_delete" ON public."thread_participants" AS PERMISSIVE FOR DELETE TO PUBLIC USING (((auth.uid() = user_id) OR is_mod_or_admin(auth.uid())));

CREATE POLICY "tparts_insert" ON public."thread_participants" AS PERMISSIVE FOR INSERT TO PUBLIC WITH CHECK (((auth.uid() = user_id) OR is_mod_or_admin(auth.uid())));

CREATE POLICY "tparts_select" ON public."thread_participants" AS PERMISSIVE FOR SELECT TO PUBLIC USING (((user_id = auth.uid()) OR is_mod_or_admin(auth.uid())));

CREATE POLICY "threads_delete" ON public."threads" AS PERMISSIVE FOR DELETE TO PUBLIC USING (is_mod_or_admin(auth.uid()));

CREATE POLICY "threads_insert" ON public."threads" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((team_id IS NULL) OR can_read_team(team_id)));

CREATE POLICY "threads_select" ON public."threads" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((((team_id IS NULL) AND (EXISTS ( SELECT 1
   FROM thread_participants tp
  WHERE ((tp.thread_id = threads.id) AND (tp.user_id = auth.uid()))))) OR ((team_id IS NOT NULL) AND can_read_team(team_id))));

CREATE POLICY "threads_update" ON public."threads" AS PERMISSIVE FOR UPDATE TO PUBLIC USING (is_mod_or_admin(auth.uid()));

CREATE POLICY "consents_insert" ON public."user_consents" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((user_id = auth.uid()));

CREATE POLICY "consents_select" ON public."user_consents" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((user_id = auth.uid()));

CREATE POLICY "consents_update" ON public."user_consents" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));

CREATE POLICY "uc_select_self" ON public."user_consents" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((user_id = auth.uid()));

CREATE POLICY "uc_update_self" ON public."user_consents" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));

CREATE POLICY "uc_upsert_self" ON public."user_consents" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((user_id = auth.uid()));

CREATE POLICY "up_insert" ON public."users_public" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((id = auth.uid()));

CREATE POLICY "up_select" ON public."users_public" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((profile_visibility = 'public'::profile_visibility) OR (id = auth.uid()) OR share_team(id, auth.uid())));

CREATE POLICY "up_update" ON public."users_public" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((id = auth.uid()) OR is_mod_or_admin(auth.uid()))) WITH CHECK (((id = auth.uid()) OR is_mod_or_admin(auth.uid())));

GRANT DELETE ON TABLE public."achievements" TO "anon";

GRANT INSERT ON TABLE public."achievements" TO "anon";

GRANT REFERENCES ON TABLE public."achievements" TO "anon";

GRANT SELECT ON TABLE public."achievements" TO "anon";

GRANT TRIGGER ON TABLE public."achievements" TO "anon";

GRANT TRUNCATE ON TABLE public."achievements" TO "anon";

GRANT UPDATE ON TABLE public."achievements" TO "anon";

GRANT DELETE ON TABLE public."achievements" TO "authenticated";

GRANT INSERT ON TABLE public."achievements" TO "authenticated";

GRANT REFERENCES ON TABLE public."achievements" TO "authenticated";

GRANT SELECT ON TABLE public."achievements" TO "authenticated";

GRANT TRIGGER ON TABLE public."achievements" TO "authenticated";

GRANT TRUNCATE ON TABLE public."achievements" TO "authenticated";

GRANT UPDATE ON TABLE public."achievements" TO "authenticated";

GRANT DELETE ON TABLE public."achievements" TO "postgres" WITH GRANT OPTION;

GRANT INSERT ON TABLE public."achievements" TO "postgres" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE public."achievements" TO "postgres" WITH GRANT OPTION;

GRANT SELECT ON TABLE public."achievements" TO "postgres" WITH GRANT OPTION;

GRANT TRIGGER ON TABLE public."achievements" TO "postgres" WITH GRANT OPTION;

GRANT TRUNCATE ON TABLE public."achievements" TO "postgres" WITH GRANT OPTION;

GRANT UPDATE ON TABLE public."achievements" TO "postgres" WITH GRANT OPTION;

GRANT DELETE ON TABLE public."achievements" TO "service_role";

GRANT INSERT ON TABLE public."achievements" TO "service_role";

GRANT REFERENCES ON TABLE public."achievements" TO "service_role";

GRANT SELECT ON TABLE public."achievements" TO "service_role";

GRANT TRIGGER ON TABLE public."achievements" TO "service_role";

GRANT TRUNCATE ON TABLE public."achievements" TO "service_role";

GRANT UPDATE ON TABLE public."achievements" TO "service_role";

GRANT DELETE ON TABLE public."audit_logs" TO "anon";

GRANT INSERT ON TABLE public."audit_logs" TO "anon";

GRANT REFERENCES ON TABLE public."audit_logs" TO "anon";

GRANT SELECT ON TABLE public."audit_logs" TO "anon";

GRANT TRIGGER ON TABLE public."audit_logs" TO "anon";

GRANT TRUNCATE ON TABLE public."audit_logs" TO "anon";

GRANT UPDATE ON TABLE public."audit_logs" TO "anon";

GRANT DELETE ON TABLE public."audit_logs" TO "authenticated";

GRANT INSERT ON TABLE public."audit_logs" TO "authenticated";

GRANT REFERENCES ON TABLE public."audit_logs" TO "authenticated";

GRANT SELECT ON TABLE public."audit_logs" TO "authenticated";

GRANT TRIGGER ON TABLE public."audit_logs" TO "authenticated";

GRANT TRUNCATE ON TABLE public."audit_logs" TO "authenticated";

GRANT UPDATE ON TABLE public."audit_logs" TO "authenticated";

GRANT DELETE ON TABLE public."audit_logs" TO "postgres" WITH GRANT OPTION;

GRANT INSERT ON TABLE public."audit_logs" TO "postgres" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE public."audit_logs" TO "postgres" WITH GRANT OPTION;

GRANT SELECT ON TABLE public."audit_logs" TO "postgres" WITH GRANT OPTION;

GRANT TRIGGER ON TABLE public."audit_logs" TO "postgres" WITH GRANT OPTION;

GRANT TRUNCATE ON TABLE public."audit_logs" TO "postgres" WITH GRANT OPTION;

GRANT UPDATE ON TABLE public."audit_logs" TO "postgres" WITH GRANT OPTION;

GRANT DELETE ON TABLE public."audit_logs" TO "service_role";

GRANT INSERT ON TABLE public."audit_logs" TO "service_role";

GRANT REFERENCES ON TABLE public."audit_logs" TO "service_role";

GRANT SELECT ON TABLE public."audit_logs" TO "service_role";

GRANT TRIGGER ON TABLE public."audit_logs" TO "service_role";

GRANT TRUNCATE ON TABLE public."audit_logs" TO "service_role";

GRANT UPDATE ON TABLE public."audit_logs" TO "service_role";

GRANT DELETE ON TABLE public."courts" TO "anon";

GRANT INSERT ON TABLE public."courts" TO "anon";

GRANT REFERENCES ON TABLE public."courts" TO "anon";

GRANT SELECT ON TABLE public."courts" TO "anon";

GRANT TRIGGER ON TABLE public."courts" TO "anon";

GRANT TRUNCATE ON TABLE public."courts" TO "anon";

GRANT UPDATE ON TABLE public."courts" TO "anon";

GRANT DELETE ON TABLE public."courts" TO "authenticated";

GRANT INSERT ON TABLE public."courts" TO "authenticated";

GRANT REFERENCES ON TABLE public."courts" TO "authenticated";

GRANT SELECT ON TABLE public."courts" TO "authenticated";

GRANT TRIGGER ON TABLE public."courts" TO "authenticated";

GRANT TRUNCATE ON TABLE public."courts" TO "authenticated";

GRANT UPDATE ON TABLE public."courts" TO "authenticated";

GRANT DELETE ON TABLE public."courts" TO "postgres" WITH GRANT OPTION;

GRANT INSERT ON TABLE public."courts" TO "postgres" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE public."courts" TO "postgres" WITH GRANT OPTION;

GRANT SELECT ON TABLE public."courts" TO "postgres" WITH GRANT OPTION;

GRANT TRIGGER ON TABLE public."courts" TO "postgres" WITH GRANT OPTION;

GRANT TRUNCATE ON TABLE public."courts" TO "postgres" WITH GRANT OPTION;

GRANT UPDATE ON TABLE public."courts" TO "postgres" WITH GRANT OPTION;

GRANT DELETE ON TABLE public."courts" TO "service_role";

GRANT INSERT ON TABLE public."courts" TO "service_role";

GRANT REFERENCES ON TABLE public."courts" TO "service_role";

GRANT SELECT ON TABLE public."courts" TO "service_role";

GRANT TRIGGER ON TABLE public."courts" TO "service_role";

GRANT TRUNCATE ON TABLE public."courts" TO "service_role";

GRANT UPDATE ON TABLE public."courts" TO "service_role";

GRANT DELETE ON TABLE public."game_participants" TO "anon";

GRANT INSERT ON TABLE public."game_participants" TO "anon";

GRANT REFERENCES ON TABLE public."game_participants" TO "anon";

GRANT SELECT ON TABLE public."game_participants" TO "anon";

GRANT TRIGGER ON TABLE public."game_participants" TO "anon";

GRANT TRUNCATE ON TABLE public."game_participants" TO "anon";

GRANT UPDATE ON TABLE public."game_participants" TO "anon";

GRANT DELETE ON TABLE public."game_participants" TO "authenticated";

GRANT INSERT ON TABLE public."game_participants" TO "authenticated";

GRANT REFERENCES ON TABLE public."game_participants" TO "authenticated";

GRANT SELECT ON TABLE public."game_participants" TO "authenticated";

GRANT TRIGGER ON TABLE public."game_participants" TO "authenticated";

GRANT TRUNCATE ON TABLE public."game_participants" TO "authenticated";

GRANT UPDATE ON TABLE public."game_participants" TO "authenticated";

GRANT DELETE ON TABLE public."game_participants" TO "postgres" WITH GRANT OPTION;

GRANT INSERT ON TABLE public."game_participants" TO "postgres" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE public."game_participants" TO "postgres" WITH GRANT OPTION;

GRANT SELECT ON TABLE public."game_participants" TO "postgres" WITH GRANT OPTION;

GRANT TRIGGER ON TABLE public."game_participants" TO "postgres" WITH GRANT OPTION;

GRANT TRUNCATE ON TABLE public."game_participants" TO "postgres" WITH GRANT OPTION;

GRANT UPDATE ON TABLE public."game_participants" TO "postgres" WITH GRANT OPTION;

GRANT DELETE ON TABLE public."game_participants" TO "service_role";

GRANT INSERT ON TABLE public."game_participants" TO "service_role";

GRANT REFERENCES ON TABLE public."game_participants" TO "service_role";

GRANT SELECT ON TABLE public."game_participants" TO "service_role";

GRANT TRIGGER ON TABLE public."game_participants" TO "service_role";

GRANT TRUNCATE ON TABLE public."game_participants" TO "service_role";

GRANT UPDATE ON TABLE public."game_participants" TO "service_role";

GRANT DELETE ON TABLE public."games" TO "anon";

GRANT INSERT ON TABLE public."games" TO "anon";

GRANT REFERENCES ON TABLE public."games" TO "anon";

GRANT SELECT ON TABLE public."games" TO "anon";

GRANT TRIGGER ON TABLE public."games" TO "anon";

GRANT TRUNCATE ON TABLE public."games" TO "anon";

GRANT UPDATE ON TABLE public."games" TO "anon";

GRANT DELETE ON TABLE public."games" TO "authenticated";

GRANT INSERT ON TABLE public."games" TO "authenticated";

GRANT REFERENCES ON TABLE public."games" TO "authenticated";

GRANT SELECT ON TABLE public."games" TO "authenticated";

GRANT TRIGGER ON TABLE public."games" TO "authenticated";

GRANT TRUNCATE ON TABLE public."games" TO "authenticated";

GRANT UPDATE ON TABLE public."games" TO "authenticated";

GRANT DELETE ON TABLE public."games" TO "postgres" WITH GRANT OPTION;

GRANT INSERT ON TABLE public."games" TO "postgres" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE public."games" TO "postgres" WITH GRANT OPTION;

GRANT SELECT ON TABLE public."games" TO "postgres" WITH GRANT OPTION;

GRANT TRIGGER ON TABLE public."games" TO "postgres" WITH GRANT OPTION;

GRANT TRUNCATE ON TABLE public."games" TO "postgres" WITH GRANT OPTION;

GRANT UPDATE ON TABLE public."games" TO "postgres" WITH GRANT OPTION;

GRANT DELETE ON TABLE public."games" TO "service_role";

GRANT INSERT ON TABLE public."games" TO "service_role";

GRANT REFERENCES ON TABLE public."games" TO "service_role";

GRANT SELECT ON TABLE public."games" TO "service_role";

GRANT TRIGGER ON TABLE public."games" TO "service_role";

GRANT TRUNCATE ON TABLE public."games" TO "service_role";

GRANT UPDATE ON TABLE public."games" TO "service_role";

GRANT DELETE ON TABLE public."matches" TO "anon";

GRANT INSERT ON TABLE public."matches" TO "anon";

GRANT REFERENCES ON TABLE public."matches" TO "anon";

GRANT SELECT ON TABLE public."matches" TO "anon";

GRANT TRIGGER ON TABLE public."matches" TO "anon";

GRANT TRUNCATE ON TABLE public."matches" TO "anon";

GRANT UPDATE ON TABLE public."matches" TO "anon";

GRANT DELETE ON TABLE public."matches" TO "authenticated";

GRANT INSERT ON TABLE public."matches" TO "authenticated";

GRANT REFERENCES ON TABLE public."matches" TO "authenticated";

GRANT SELECT ON TABLE public."matches" TO "authenticated";

GRANT TRIGGER ON TABLE public."matches" TO "authenticated";

GRANT TRUNCATE ON TABLE public."matches" TO "authenticated";

GRANT UPDATE ON TABLE public."matches" TO "authenticated";

GRANT DELETE ON TABLE public."matches" TO "postgres" WITH GRANT OPTION;

GRANT INSERT ON TABLE public."matches" TO "postgres" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE public."matches" TO "postgres" WITH GRANT OPTION;

GRANT SELECT ON TABLE public."matches" TO "postgres" WITH GRANT OPTION;

GRANT TRIGGER ON TABLE public."matches" TO "postgres" WITH GRANT OPTION;

GRANT TRUNCATE ON TABLE public."matches" TO "postgres" WITH GRANT OPTION;

GRANT UPDATE ON TABLE public."matches" TO "postgres" WITH GRANT OPTION;

GRANT DELETE ON TABLE public."matches" TO "service_role";

GRANT INSERT ON TABLE public."matches" TO "service_role";

GRANT REFERENCES ON TABLE public."matches" TO "service_role";

GRANT SELECT ON TABLE public."matches" TO "service_role";

GRANT TRIGGER ON TABLE public."matches" TO "service_role";

GRANT TRUNCATE ON TABLE public."matches" TO "service_role";

GRANT UPDATE ON TABLE public."matches" TO "service_role";

GRANT DELETE ON TABLE public."messages" TO "anon";

GRANT INSERT ON TABLE public."messages" TO "anon";

GRANT REFERENCES ON TABLE public."messages" TO "anon";

GRANT SELECT ON TABLE public."messages" TO "anon";

GRANT TRIGGER ON TABLE public."messages" TO "anon";

GRANT TRUNCATE ON TABLE public."messages" TO "anon";

GRANT UPDATE ON TABLE public."messages" TO "anon";

GRANT DELETE ON TABLE public."messages" TO "authenticated";

GRANT INSERT ON TABLE public."messages" TO "authenticated";

GRANT REFERENCES ON TABLE public."messages" TO "authenticated";

GRANT SELECT ON TABLE public."messages" TO "authenticated";

GRANT TRIGGER ON TABLE public."messages" TO "authenticated";

GRANT TRUNCATE ON TABLE public."messages" TO "authenticated";

GRANT UPDATE ON TABLE public."messages" TO "authenticated";

GRANT DELETE ON TABLE public."messages" TO "postgres" WITH GRANT OPTION;

GRANT INSERT ON TABLE public."messages" TO "postgres" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE public."messages" TO "postgres" WITH GRANT OPTION;

GRANT SELECT ON TABLE public."messages" TO "postgres" WITH GRANT OPTION;

GRANT TRIGGER ON TABLE public."messages" TO "postgres" WITH GRANT OPTION;

GRANT TRUNCATE ON TABLE public."messages" TO "postgres" WITH GRANT OPTION;

GRANT UPDATE ON TABLE public."messages" TO "postgres" WITH GRANT OPTION;

GRANT DELETE ON TABLE public."messages" TO "service_role";

GRANT INSERT ON TABLE public."messages" TO "service_role";

GRANT REFERENCES ON TABLE public."messages" TO "service_role";

GRANT SELECT ON TABLE public."messages" TO "service_role";

GRANT TRIGGER ON TABLE public."messages" TO "service_role";

GRANT TRUNCATE ON TABLE public."messages" TO "service_role";

GRANT UPDATE ON TABLE public."messages" TO "service_role";

GRANT DELETE ON TABLE public."reports" TO "anon";

GRANT INSERT ON TABLE public."reports" TO "anon";

GRANT REFERENCES ON TABLE public."reports" TO "anon";

GRANT SELECT ON TABLE public."reports" TO "anon";

GRANT TRIGGER ON TABLE public."reports" TO "anon";

GRANT TRUNCATE ON TABLE public."reports" TO "anon";

GRANT UPDATE ON TABLE public."reports" TO "anon";

GRANT DELETE ON TABLE public."reports" TO "authenticated";

GRANT INSERT ON TABLE public."reports" TO "authenticated";

GRANT REFERENCES ON TABLE public."reports" TO "authenticated";

GRANT SELECT ON TABLE public."reports" TO "authenticated";

GRANT TRIGGER ON TABLE public."reports" TO "authenticated";

GRANT TRUNCATE ON TABLE public."reports" TO "authenticated";

GRANT UPDATE ON TABLE public."reports" TO "authenticated";

GRANT DELETE ON TABLE public."reports" TO "postgres" WITH GRANT OPTION;

GRANT INSERT ON TABLE public."reports" TO "postgres" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE public."reports" TO "postgres" WITH GRANT OPTION;

GRANT SELECT ON TABLE public."reports" TO "postgres" WITH GRANT OPTION;

GRANT TRIGGER ON TABLE public."reports" TO "postgres" WITH GRANT OPTION;

GRANT TRUNCATE ON TABLE public."reports" TO "postgres" WITH GRANT OPTION;

GRANT UPDATE ON TABLE public."reports" TO "postgres" WITH GRANT OPTION;

GRANT DELETE ON TABLE public."reports" TO "service_role";

GRANT INSERT ON TABLE public."reports" TO "service_role";

GRANT REFERENCES ON TABLE public."reports" TO "service_role";

GRANT SELECT ON TABLE public."reports" TO "service_role";

GRANT TRIGGER ON TABLE public."reports" TO "service_role";

GRANT TRUNCATE ON TABLE public."reports" TO "service_role";

GRANT UPDATE ON TABLE public."reports" TO "service_role";

GRANT DELETE ON TABLE public."team_members" TO "anon";

GRANT INSERT ON TABLE public."team_members" TO "anon";

GRANT REFERENCES ON TABLE public."team_members" TO "anon";

GRANT SELECT ON TABLE public."team_members" TO "anon";

GRANT TRIGGER ON TABLE public."team_members" TO "anon";

GRANT TRUNCATE ON TABLE public."team_members" TO "anon";

GRANT UPDATE ON TABLE public."team_members" TO "anon";

GRANT DELETE ON TABLE public."team_members" TO "authenticated";

GRANT INSERT ON TABLE public."team_members" TO "authenticated";

GRANT REFERENCES ON TABLE public."team_members" TO "authenticated";

GRANT SELECT ON TABLE public."team_members" TO "authenticated";

GRANT TRIGGER ON TABLE public."team_members" TO "authenticated";

GRANT TRUNCATE ON TABLE public."team_members" TO "authenticated";

GRANT UPDATE ON TABLE public."team_members" TO "authenticated";

GRANT DELETE ON TABLE public."team_members" TO "postgres" WITH GRANT OPTION;

GRANT INSERT ON TABLE public."team_members" TO "postgres" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE public."team_members" TO "postgres" WITH GRANT OPTION;

GRANT SELECT ON TABLE public."team_members" TO "postgres" WITH GRANT OPTION;

GRANT TRIGGER ON TABLE public."team_members" TO "postgres" WITH GRANT OPTION;

GRANT TRUNCATE ON TABLE public."team_members" TO "postgres" WITH GRANT OPTION;

GRANT UPDATE ON TABLE public."team_members" TO "postgres" WITH GRANT OPTION;

GRANT DELETE ON TABLE public."team_members" TO "service_role";

GRANT INSERT ON TABLE public."team_members" TO "service_role";

GRANT REFERENCES ON TABLE public."team_members" TO "service_role";

GRANT SELECT ON TABLE public."team_members" TO "service_role";

GRANT TRIGGER ON TABLE public."team_members" TO "service_role";

GRANT TRUNCATE ON TABLE public."team_members" TO "service_role";

GRANT UPDATE ON TABLE public."team_members" TO "service_role";

GRANT DELETE ON TABLE public."teams" TO "anon";

GRANT INSERT ON TABLE public."teams" TO "anon";

GRANT REFERENCES ON TABLE public."teams" TO "anon";

GRANT SELECT ON TABLE public."teams" TO "anon";

GRANT TRIGGER ON TABLE public."teams" TO "anon";

GRANT TRUNCATE ON TABLE public."teams" TO "anon";

GRANT UPDATE ON TABLE public."teams" TO "anon";

GRANT DELETE ON TABLE public."teams" TO "authenticated";

GRANT INSERT ON TABLE public."teams" TO "authenticated";

GRANT REFERENCES ON TABLE public."teams" TO "authenticated";

GRANT SELECT ON TABLE public."teams" TO "authenticated";

GRANT TRIGGER ON TABLE public."teams" TO "authenticated";

GRANT TRUNCATE ON TABLE public."teams" TO "authenticated";

GRANT UPDATE ON TABLE public."teams" TO "authenticated";

GRANT DELETE ON TABLE public."teams" TO "postgres" WITH GRANT OPTION;

GRANT INSERT ON TABLE public."teams" TO "postgres" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE public."teams" TO "postgres" WITH GRANT OPTION;

GRANT SELECT ON TABLE public."teams" TO "postgres" WITH GRANT OPTION;

GRANT TRIGGER ON TABLE public."teams" TO "postgres" WITH GRANT OPTION;

GRANT TRUNCATE ON TABLE public."teams" TO "postgres" WITH GRANT OPTION;

GRANT UPDATE ON TABLE public."teams" TO "postgres" WITH GRANT OPTION;

GRANT DELETE ON TABLE public."teams" TO "service_role";

GRANT INSERT ON TABLE public."teams" TO "service_role";

GRANT REFERENCES ON TABLE public."teams" TO "service_role";

GRANT SELECT ON TABLE public."teams" TO "service_role";

GRANT TRIGGER ON TABLE public."teams" TO "service_role";

GRANT TRUNCATE ON TABLE public."teams" TO "service_role";

GRANT UPDATE ON TABLE public."teams" TO "service_role";

GRANT DELETE ON TABLE public."thread_participants" TO "anon";

GRANT INSERT ON TABLE public."thread_participants" TO "anon";

GRANT REFERENCES ON TABLE public."thread_participants" TO "anon";

GRANT SELECT ON TABLE public."thread_participants" TO "anon";

GRANT TRIGGER ON TABLE public."thread_participants" TO "anon";

GRANT TRUNCATE ON TABLE public."thread_participants" TO "anon";

GRANT UPDATE ON TABLE public."thread_participants" TO "anon";

GRANT DELETE ON TABLE public."thread_participants" TO "authenticated";

GRANT INSERT ON TABLE public."thread_participants" TO "authenticated";

GRANT REFERENCES ON TABLE public."thread_participants" TO "authenticated";

GRANT SELECT ON TABLE public."thread_participants" TO "authenticated";

GRANT TRIGGER ON TABLE public."thread_participants" TO "authenticated";

GRANT TRUNCATE ON TABLE public."thread_participants" TO "authenticated";

GRANT UPDATE ON TABLE public."thread_participants" TO "authenticated";

GRANT DELETE ON TABLE public."thread_participants" TO "postgres" WITH GRANT OPTION;

GRANT INSERT ON TABLE public."thread_participants" TO "postgres" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE public."thread_participants" TO "postgres" WITH GRANT OPTION;

GRANT SELECT ON TABLE public."thread_participants" TO "postgres" WITH GRANT OPTION;

GRANT TRIGGER ON TABLE public."thread_participants" TO "postgres" WITH GRANT OPTION;

GRANT TRUNCATE ON TABLE public."thread_participants" TO "postgres" WITH GRANT OPTION;

GRANT UPDATE ON TABLE public."thread_participants" TO "postgres" WITH GRANT OPTION;

GRANT DELETE ON TABLE public."thread_participants" TO "service_role";

GRANT INSERT ON TABLE public."thread_participants" TO "service_role";

GRANT REFERENCES ON TABLE public."thread_participants" TO "service_role";

GRANT SELECT ON TABLE public."thread_participants" TO "service_role";

GRANT TRIGGER ON TABLE public."thread_participants" TO "service_role";

GRANT TRUNCATE ON TABLE public."thread_participants" TO "service_role";

GRANT UPDATE ON TABLE public."thread_participants" TO "service_role";

GRANT DELETE ON TABLE public."threads" TO "anon";

GRANT INSERT ON TABLE public."threads" TO "anon";

GRANT REFERENCES ON TABLE public."threads" TO "anon";

GRANT SELECT ON TABLE public."threads" TO "anon";

GRANT TRIGGER ON TABLE public."threads" TO "anon";

GRANT TRUNCATE ON TABLE public."threads" TO "anon";

GRANT UPDATE ON TABLE public."threads" TO "anon";

GRANT DELETE ON TABLE public."threads" TO "authenticated";

GRANT INSERT ON TABLE public."threads" TO "authenticated";

GRANT REFERENCES ON TABLE public."threads" TO "authenticated";

GRANT SELECT ON TABLE public."threads" TO "authenticated";

GRANT TRIGGER ON TABLE public."threads" TO "authenticated";

GRANT TRUNCATE ON TABLE public."threads" TO "authenticated";

GRANT UPDATE ON TABLE public."threads" TO "authenticated";

GRANT DELETE ON TABLE public."threads" TO "postgres" WITH GRANT OPTION;

GRANT INSERT ON TABLE public."threads" TO "postgres" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE public."threads" TO "postgres" WITH GRANT OPTION;

GRANT SELECT ON TABLE public."threads" TO "postgres" WITH GRANT OPTION;

GRANT TRIGGER ON TABLE public."threads" TO "postgres" WITH GRANT OPTION;

GRANT TRUNCATE ON TABLE public."threads" TO "postgres" WITH GRANT OPTION;

GRANT UPDATE ON TABLE public."threads" TO "postgres" WITH GRANT OPTION;

GRANT DELETE ON TABLE public."threads" TO "service_role";

GRANT INSERT ON TABLE public."threads" TO "service_role";

GRANT REFERENCES ON TABLE public."threads" TO "service_role";

GRANT SELECT ON TABLE public."threads" TO "service_role";

GRANT TRIGGER ON TABLE public."threads" TO "service_role";

GRANT TRUNCATE ON TABLE public."threads" TO "service_role";

GRANT UPDATE ON TABLE public."threads" TO "service_role";

GRANT DELETE ON TABLE public."user_achievements" TO "anon";

GRANT INSERT ON TABLE public."user_achievements" TO "anon";

GRANT REFERENCES ON TABLE public."user_achievements" TO "anon";

GRANT SELECT ON TABLE public."user_achievements" TO "anon";

GRANT TRIGGER ON TABLE public."user_achievements" TO "anon";

GRANT TRUNCATE ON TABLE public."user_achievements" TO "anon";

GRANT UPDATE ON TABLE public."user_achievements" TO "anon";

GRANT DELETE ON TABLE public."user_achievements" TO "authenticated";

GRANT INSERT ON TABLE public."user_achievements" TO "authenticated";

GRANT REFERENCES ON TABLE public."user_achievements" TO "authenticated";

GRANT SELECT ON TABLE public."user_achievements" TO "authenticated";

GRANT TRIGGER ON TABLE public."user_achievements" TO "authenticated";

GRANT TRUNCATE ON TABLE public."user_achievements" TO "authenticated";

GRANT UPDATE ON TABLE public."user_achievements" TO "authenticated";

GRANT DELETE ON TABLE public."user_achievements" TO "postgres" WITH GRANT OPTION;

GRANT INSERT ON TABLE public."user_achievements" TO "postgres" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE public."user_achievements" TO "postgres" WITH GRANT OPTION;

GRANT SELECT ON TABLE public."user_achievements" TO "postgres" WITH GRANT OPTION;

GRANT TRIGGER ON TABLE public."user_achievements" TO "postgres" WITH GRANT OPTION;

GRANT TRUNCATE ON TABLE public."user_achievements" TO "postgres" WITH GRANT OPTION;

GRANT UPDATE ON TABLE public."user_achievements" TO "postgres" WITH GRANT OPTION;

GRANT DELETE ON TABLE public."user_achievements" TO "service_role";

GRANT INSERT ON TABLE public."user_achievements" TO "service_role";

GRANT REFERENCES ON TABLE public."user_achievements" TO "service_role";

GRANT SELECT ON TABLE public."user_achievements" TO "service_role";

GRANT TRIGGER ON TABLE public."user_achievements" TO "service_role";

GRANT TRUNCATE ON TABLE public."user_achievements" TO "service_role";

GRANT UPDATE ON TABLE public."user_achievements" TO "service_role";

GRANT DELETE ON TABLE public."user_consents" TO "anon";

GRANT INSERT ON TABLE public."user_consents" TO "anon";

GRANT REFERENCES ON TABLE public."user_consents" TO "anon";

GRANT SELECT ON TABLE public."user_consents" TO "anon";

GRANT TRIGGER ON TABLE public."user_consents" TO "anon";

GRANT TRUNCATE ON TABLE public."user_consents" TO "anon";

GRANT UPDATE ON TABLE public."user_consents" TO "anon";

GRANT DELETE ON TABLE public."user_consents" TO "authenticated";

GRANT INSERT ON TABLE public."user_consents" TO "authenticated";

GRANT REFERENCES ON TABLE public."user_consents" TO "authenticated";

GRANT SELECT ON TABLE public."user_consents" TO "authenticated";

GRANT TRIGGER ON TABLE public."user_consents" TO "authenticated";

GRANT TRUNCATE ON TABLE public."user_consents" TO "authenticated";

GRANT UPDATE ON TABLE public."user_consents" TO "authenticated";

GRANT DELETE ON TABLE public."user_consents" TO "postgres" WITH GRANT OPTION;

GRANT INSERT ON TABLE public."user_consents" TO "postgres" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE public."user_consents" TO "postgres" WITH GRANT OPTION;

GRANT SELECT ON TABLE public."user_consents" TO "postgres" WITH GRANT OPTION;

GRANT TRIGGER ON TABLE public."user_consents" TO "postgres" WITH GRANT OPTION;

GRANT TRUNCATE ON TABLE public."user_consents" TO "postgres" WITH GRANT OPTION;

GRANT UPDATE ON TABLE public."user_consents" TO "postgres" WITH GRANT OPTION;

GRANT DELETE ON TABLE public."user_consents" TO "service_role";

GRANT INSERT ON TABLE public."user_consents" TO "service_role";

GRANT REFERENCES ON TABLE public."user_consents" TO "service_role";

GRANT SELECT ON TABLE public."user_consents" TO "service_role";

GRANT TRIGGER ON TABLE public."user_consents" TO "service_role";

GRANT TRUNCATE ON TABLE public."user_consents" TO "service_role";

GRANT UPDATE ON TABLE public."user_consents" TO "service_role";

GRANT DELETE ON TABLE public."user_stats" TO "anon";

GRANT INSERT ON TABLE public."user_stats" TO "anon";

GRANT REFERENCES ON TABLE public."user_stats" TO "anon";

GRANT SELECT ON TABLE public."user_stats" TO "anon";

GRANT TRIGGER ON TABLE public."user_stats" TO "anon";

GRANT TRUNCATE ON TABLE public."user_stats" TO "anon";

GRANT UPDATE ON TABLE public."user_stats" TO "anon";

GRANT DELETE ON TABLE public."user_stats" TO "authenticated";

GRANT INSERT ON TABLE public."user_stats" TO "authenticated";

GRANT REFERENCES ON TABLE public."user_stats" TO "authenticated";

GRANT SELECT ON TABLE public."user_stats" TO "authenticated";

GRANT TRIGGER ON TABLE public."user_stats" TO "authenticated";

GRANT TRUNCATE ON TABLE public."user_stats" TO "authenticated";

GRANT UPDATE ON TABLE public."user_stats" TO "authenticated";

GRANT DELETE ON TABLE public."user_stats" TO "postgres" WITH GRANT OPTION;

GRANT INSERT ON TABLE public."user_stats" TO "postgres" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE public."user_stats" TO "postgres" WITH GRANT OPTION;

GRANT SELECT ON TABLE public."user_stats" TO "postgres" WITH GRANT OPTION;

GRANT TRIGGER ON TABLE public."user_stats" TO "postgres" WITH GRANT OPTION;

GRANT TRUNCATE ON TABLE public."user_stats" TO "postgres" WITH GRANT OPTION;

GRANT UPDATE ON TABLE public."user_stats" TO "postgres" WITH GRANT OPTION;

GRANT DELETE ON TABLE public."user_stats" TO "service_role";

GRANT INSERT ON TABLE public."user_stats" TO "service_role";

GRANT REFERENCES ON TABLE public."user_stats" TO "service_role";

GRANT SELECT ON TABLE public."user_stats" TO "service_role";

GRANT TRIGGER ON TABLE public."user_stats" TO "service_role";

GRANT TRUNCATE ON TABLE public."user_stats" TO "service_role";

GRANT UPDATE ON TABLE public."user_stats" TO "service_role";

GRANT DELETE ON TABLE public."users_public" TO "anon";

GRANT INSERT ON TABLE public."users_public" TO "anon";

GRANT REFERENCES ON TABLE public."users_public" TO "anon";

GRANT SELECT ON TABLE public."users_public" TO "anon";

GRANT TRIGGER ON TABLE public."users_public" TO "anon";

GRANT TRUNCATE ON TABLE public."users_public" TO "anon";

GRANT UPDATE ON TABLE public."users_public" TO "anon";

GRANT DELETE ON TABLE public."users_public" TO "authenticated";

GRANT INSERT ON TABLE public."users_public" TO "authenticated";

GRANT REFERENCES ON TABLE public."users_public" TO "authenticated";

GRANT SELECT ON TABLE public."users_public" TO "authenticated";

GRANT TRIGGER ON TABLE public."users_public" TO "authenticated";

GRANT TRUNCATE ON TABLE public."users_public" TO "authenticated";

GRANT UPDATE ON TABLE public."users_public" TO "authenticated";

GRANT DELETE ON TABLE public."users_public" TO "postgres" WITH GRANT OPTION;

GRANT INSERT ON TABLE public."users_public" TO "postgres" WITH GRANT OPTION;

GRANT REFERENCES ON TABLE public."users_public" TO "postgres" WITH GRANT OPTION;

GRANT SELECT ON TABLE public."users_public" TO "postgres" WITH GRANT OPTION;

GRANT TRIGGER ON TABLE public."users_public" TO "postgres" WITH GRANT OPTION;

GRANT TRUNCATE ON TABLE public."users_public" TO "postgres" WITH GRANT OPTION;

GRANT UPDATE ON TABLE public."users_public" TO "postgres" WITH GRANT OPTION;

GRANT DELETE ON TABLE public."users_public" TO "service_role";

GRANT INSERT ON TABLE public."users_public" TO "service_role";

GRANT REFERENCES ON TABLE public."users_public" TO "service_role";

GRANT SELECT ON TABLE public."users_public" TO "service_role";

GRANT TRIGGER ON TABLE public."users_public" TO "service_role";

GRANT TRUNCATE ON TABLE public."users_public" TO "service_role";

GRANT UPDATE ON TABLE public."users_public" TO "service_role";

REVOKE ALL ON FUNCTION public."can_read_team"(team uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public."can_read_team"(team uuid) TO PUBLIC;

GRANT EXECUTE ON FUNCTION public."can_read_team"(team uuid) TO "anon";

GRANT EXECUTE ON FUNCTION public."can_read_team"(team uuid) TO "authenticated";

GRANT EXECUTE ON FUNCTION public."can_read_team"(team uuid) TO "postgres" WITH GRANT OPTION;

GRANT EXECUTE ON FUNCTION public."can_read_team"(team uuid) TO "service_role";

REVOKE ALL ON FUNCTION public."enforce_team_member_status"() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public."enforce_team_member_status"() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public."enforce_team_member_status"() TO "anon";

GRANT EXECUTE ON FUNCTION public."enforce_team_member_status"() TO "authenticated";

GRANT EXECUTE ON FUNCTION public."enforce_team_member_status"() TO "postgres" WITH GRANT OPTION;

GRANT EXECUTE ON FUNCTION public."enforce_team_member_status"() TO "service_role";

REVOKE ALL ON FUNCTION public."handle_new_auth_user"() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public."handle_new_auth_user"() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public."handle_new_auth_user"() TO "anon";

GRANT EXECUTE ON FUNCTION public."handle_new_auth_user"() TO "authenticated";

GRANT EXECUTE ON FUNCTION public."handle_new_auth_user"() TO "postgres" WITH GRANT OPTION;

GRANT EXECUTE ON FUNCTION public."handle_new_auth_user"() TO "service_role";

REVOKE ALL ON FUNCTION public."is_active_member"(u uuid, team uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public."is_active_member"(u uuid, team uuid) TO PUBLIC;

GRANT EXECUTE ON FUNCTION public."is_active_member"(u uuid, team uuid) TO "anon";

GRANT EXECUTE ON FUNCTION public."is_active_member"(u uuid, team uuid) TO "authenticated";

GRANT EXECUTE ON FUNCTION public."is_active_member"(u uuid, team uuid) TO "postgres" WITH GRANT OPTION;

GRANT EXECUTE ON FUNCTION public."is_active_member"(u uuid, team uuid) TO "service_role";

REVOKE ALL ON FUNCTION public."is_captain"(u uuid, team uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public."is_captain"(u uuid, team uuid) TO "anon";

GRANT EXECUTE ON FUNCTION public."is_captain"(u uuid, team uuid) TO "authenticated";

GRANT EXECUTE ON FUNCTION public."is_captain"(u uuid, team uuid) TO "postgres" WITH GRANT OPTION;

GRANT EXECUTE ON FUNCTION public."is_captain"(u uuid, team uuid) TO "service_role";

REVOKE ALL ON FUNCTION public."is_mod_or_admin"(u uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public."is_mod_or_admin"(u uuid) TO PUBLIC;

GRANT EXECUTE ON FUNCTION public."is_mod_or_admin"(u uuid) TO "anon";

GRANT EXECUTE ON FUNCTION public."is_mod_or_admin"(u uuid) TO "authenticated";

GRANT EXECUTE ON FUNCTION public."is_mod_or_admin"(u uuid) TO "postgres" WITH GRANT OPTION;

GRANT EXECUTE ON FUNCTION public."is_mod_or_admin"(u uuid) TO "service_role";

REVOKE ALL ON FUNCTION public."is_thread_participant"(u uuid, th uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public."is_thread_participant"(u uuid, th uuid) TO PUBLIC;

GRANT EXECUTE ON FUNCTION public."is_thread_participant"(u uuid, th uuid) TO "anon";

GRANT EXECUTE ON FUNCTION public."is_thread_participant"(u uuid, th uuid) TO "authenticated";

GRANT EXECUTE ON FUNCTION public."is_thread_participant"(u uuid, th uuid) TO "postgres" WITH GRANT OPTION;

GRANT EXECUTE ON FUNCTION public."is_thread_participant"(u uuid, th uuid) TO "service_role";

REVOKE ALL ON FUNCTION public."log_action"(p_actor uuid, p_action text, p_target_type text, p_target_id uuid, p_metadata jsonb) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public."log_action"(p_actor uuid, p_action text, p_target_type text, p_target_id uuid, p_metadata jsonb) TO PUBLIC;

GRANT EXECUTE ON FUNCTION public."log_action"(p_actor uuid, p_action text, p_target_type text, p_target_id uuid, p_metadata jsonb) TO "anon";

GRANT EXECUTE ON FUNCTION public."log_action"(p_actor uuid, p_action text, p_target_type text, p_target_id uuid, p_metadata jsonb) TO "authenticated";

GRANT EXECUTE ON FUNCTION public."log_action"(p_actor uuid, p_action text, p_target_type text, p_target_id uuid, p_metadata jsonb) TO "postgres" WITH GRANT OPTION;

GRANT EXECUTE ON FUNCTION public."log_action"(p_actor uuid, p_action text, p_target_type text, p_target_id uuid, p_metadata jsonb) TO "service_role";

REVOKE ALL ON FUNCTION public."prevent_captain_leaving"() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public."prevent_captain_leaving"() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public."prevent_captain_leaving"() TO "anon";

GRANT EXECUTE ON FUNCTION public."prevent_captain_leaving"() TO "authenticated";

GRANT EXECUTE ON FUNCTION public."prevent_captain_leaving"() TO "postgres" WITH GRANT OPTION;

GRANT EXECUTE ON FUNCTION public."prevent_captain_leaving"() TO "service_role";

REVOKE ALL ON FUNCTION public."share_team"(a uuid, b uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public."share_team"(a uuid, b uuid) TO PUBLIC;

GRANT EXECUTE ON FUNCTION public."share_team"(a uuid, b uuid) TO "anon";

GRANT EXECUTE ON FUNCTION public."share_team"(a uuid, b uuid) TO "authenticated";

GRANT EXECUTE ON FUNCTION public."share_team"(a uuid, b uuid) TO "postgres" WITH GRANT OPTION;

GRANT EXECUTE ON FUNCTION public."share_team"(a uuid, b uuid) TO "service_role";

REVOKE ALL ON FUNCTION public."touch_updated_at"() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public."touch_updated_at"() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public."touch_updated_at"() TO "anon";

GRANT EXECUTE ON FUNCTION public."touch_updated_at"() TO "authenticated";

GRANT EXECUTE ON FUNCTION public."touch_updated_at"() TO "postgres" WITH GRANT OPTION;

GRANT EXECUTE ON FUNCTION public."touch_updated_at"() TO "service_role";

REVOKE ALL ON FUNCTION public."whoami"() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public."whoami"() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public."whoami"() TO "anon";

GRANT EXECUTE ON FUNCTION public."whoami"() TO "authenticated";

GRANT EXECUTE ON FUNCTION public."whoami"() TO "postgres" WITH GRANT OPTION;

GRANT EXECUTE ON FUNCTION public."whoami"() TO "service_role";

SET check_function_bodies = on;

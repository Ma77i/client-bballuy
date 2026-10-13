-- SPEC-002/T05: preserving local match closure and bounded safe player lookup.
BEGIN;
CREATE FUNCTION public.pickup_player_search(p_search text)
RETURNS TABLE(id uuid,display_name text) LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT u.id,u.display_name FROM public.users_public u
  WHERE auth.uid() IS NOT NULL AND length(btrim(p_search)) BETWEEN 2 AND 40
    AND strpos(lower(u.display_name),lower(btrim(p_search)))>0
  ORDER BY u.display_name,u.id LIMIT 20;
$$;
REVOKE ALL ON FUNCTION public.pickup_player_search(text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.pickup_player_search(text) TO authenticated;
CREATE OR REPLACE FUNCTION public.pickup_command(p_request_id uuid,p_action text,p_data jsonb,p_expected_actor uuid DEFAULT auth.uid())
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  actor uuid := auth.uid();
  payload jsonb := jsonb_build_object('action',p_action,'data',p_data);
  receipt pickup_private.requests;
  s public.pickup_sessions;
  m public.pickup_matches;
  allowed text[];
  result jsonb;
  occupied integer;
  present integer;
  per_side integer;
  playing boolean;
  player jsonb;
  new_a integer;
  new_b integer;
  expected integer;
BEGIN
  IF actor IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='42501'; END IF;
  IF actor IS DISTINCT FROM p_expected_actor THEN RAISE EXCEPTION 'Caller identity changed' USING ERRCODE='42501'; END IF;
  IF p_request_id IS NULL OR p_action IS NULL OR p_data IS NULL OR jsonb_typeof(p_data)<>'object' THEN
    RAISE EXCEPTION 'Invalid command' USING ERRCODE='22023';
  END IF;
  -- Hash collisions only serialize unrelated requests; identity is checked below.
  PERFORM pg_advisory_xact_lock(hashtextextended(actor::text||p_request_id::text,0));
  SELECT * INTO receipt FROM pickup_private.requests WHERE actor_id=actor AND request_id=p_request_id;
  IF FOUND THEN
    IF receipt.payload<>payload THEN RAISE EXCEPTION 'Request key reused with different payload' USING ERRCODE='22023'; END IF;
    RETURN receipt.response;
  END IF;
  allowed := CASE p_action
    WHEN 'create_session' THEN ARRAY['court_id','format','timing','scheduled_at','description','organizer_plays','present_count']
    WHEN 'edit_session' THEN ARRAY['session_id','court_id','format','scheduled_at','description']
    WHEN 'join' THEN ARRAY['session_id'] WHEN 'leave' THEN ARRAY['session_id']
    WHEN 'start' THEN ARRAY['session_id'] WHEN 'cancel' THEN ARRAY['session_id']
    WHEN 'complete_session' THEN ARRAY['session_id']
    WHEN 'create_match' THEN ARRAY['court_id','format','source_session_id','players']
    WHEN 'score' THEN ARRAY['match_id','expected_revision','score_a','score_b']
    ELSE NULL END;
  IF allowed IS NULL OR EXISTS (SELECT 1 FROM jsonb_object_keys(p_data) k WHERE NOT k=ANY(allowed)) THEN
    RAISE EXCEPTION 'Unsupported command or fields' USING ERRCODE='22023';
  END IF;

  IF p_action='create_session' THEN
    IF jsonb_typeof(p_data->'organizer_plays')<>'boolean' OR p_data->'organizer_plays' IS NULL THEN
      RAISE EXCEPTION 'Choose organizer participation' USING ERRCODE='22023';
    END IF;
    playing := (p_data->>'organizer_plays')::boolean;
    present := pickup_private.integer_value(p_data->'present_count');
    IF playing AND present<1 THEN RAISE EXCEPTION 'Playing organizer occupies a place' USING ERRCODE='22023'; END IF;
    INSERT INTO public.pickup_sessions(organizer_id,court_id,format,timing,scheduled_at,description,organizer_plays,core_locked)
      VALUES(actor,(p_data->>'court_id')::uuid,p_data->>'format',p_data->>'timing',
        CASE WHEN p_data->>'timing'='now' THEN now() ELSE (p_data->>'scheduled_at')::timestamptz END,
        coalesce(p_data->>'description',''),playing,present>0) RETURNING * INTO s;
    IF present>s.capacity OR (s.timing='future' AND s.scheduled_at<=now()) THEN
      RAISE EXCEPTION 'Invalid places or future time' USING ERRCODE='22023';
    END IF;
    IF playing THEN INSERT INTO public.pickup_places(session_id,user_id) VALUES(s.id,actor); END IF;
    FOR occupied IN 1..(present-CASE WHEN playing THEN 1 ELSE 0 END) LOOP
      INSERT INTO public.pickup_places(session_id,guest_label) VALUES(s.id,'Guest '||occupied);
    END LOOP;
    result := to_jsonb(s);

  ELSIF p_action IN ('join','leave','start','cancel','complete_session','edit_session') THEN
    SELECT * INTO s FROM public.pickup_sessions WHERE id=(p_data->>'session_id')::uuid FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Session not found' USING ERRCODE='P0002'; END IF;
    IF p_action NOT IN ('join','leave') AND s.organizer_id<>actor THEN
      RAISE EXCEPTION 'Organizer required' USING ERRCODE='42501';
    END IF;
    IF p_action='join' THEN
      IF s.state<>'open' THEN RAISE EXCEPTION 'Registration closed' USING ERRCODE='PT409'; END IF;
      IF NOT EXISTS(SELECT 1 FROM public.pickup_places WHERE session_id=s.id AND user_id=actor) THEN
        SELECT count(*) INTO occupied FROM public.pickup_places WHERE session_id=s.id;
        IF occupied>=s.capacity THEN RAISE EXCEPTION 'Session full' USING ERRCODE='PT409'; END IF;
        INSERT INTO public.pickup_places(session_id,user_id) VALUES(s.id,actor);
      END IF;
      UPDATE public.pickup_sessions SET core_locked=true,
        organizer_plays=CASE WHEN actor=organizer_id THEN true ELSE organizer_plays END
        WHERE id=s.id RETURNING * INTO s;
    ELSIF p_action='leave' THEN
      IF s.state<>'open' THEN RAISE EXCEPTION 'Registration closed' USING ERRCODE='PT409'; END IF;
      DELETE FROM public.pickup_places WHERE session_id=s.id AND user_id=actor;
      IF actor=s.organizer_id THEN
        UPDATE public.pickup_sessions SET organizer_plays=false WHERE id=s.id RETURNING * INTO s;
      END IF;
    ELSIF p_action='edit_session' THEN
      IF s.state<>'open' THEN RAISE EXCEPTION 'Session closed' USING ERRCODE='PT409'; END IF;
      IF (p_data ? 'court_id' OR p_data ? 'format' OR p_data ? 'scheduled_at') AND s.core_locked THEN
        RAISE EXCEPTION 'Cancel and recreate registered sessions' USING ERRCODE='PT409';
      END IF;
      UPDATE public.pickup_sessions SET court_id=CASE WHEN p_data ? 'court_id' THEN (p_data->>'court_id')::uuid ELSE court_id END,
        format=CASE WHEN p_data ? 'format' THEN p_data->>'format' ELSE format END,
        scheduled_at=CASE WHEN p_data ? 'scheduled_at' THEN (p_data->>'scheduled_at')::timestamptz ELSE scheduled_at END,
        description=CASE WHEN p_data ? 'description' THEN p_data->>'description' ELSE description END
        WHERE id=s.id RETURNING * INTO s;
      IF p_data ? 'scheduled_at' AND s.timing='future' AND s.scheduled_at<=now() THEN
        RAISE EXCEPTION 'Invalid future time' USING ERRCODE='22023';
      END IF;
    ELSIF p_action='start' THEN
      IF s.state NOT IN ('open','started') THEN RAISE EXCEPTION 'Session closed' USING ERRCODE='PT409'; END IF;
      UPDATE public.pickup_sessions SET state='started',started_at=coalesce(started_at,now()) WHERE id=s.id RETURNING * INTO s;
    ELSIF p_action='cancel' THEN
      IF s.state NOT IN ('open','cancelled') THEN RAISE EXCEPTION 'Cannot cancel started play' USING ERRCODE='PT409'; END IF;
      UPDATE public.pickup_sessions SET state='cancelled',closed_at=coalesce(closed_at,now()) WHERE id=s.id RETURNING * INTO s;
    ELSE
      IF s.state NOT IN ('started','completed') THEN RAISE EXCEPTION 'Start before completion' USING ERRCODE='PT409'; END IF;
      UPDATE public.pickup_sessions SET state='completed',closed_at=coalesce(closed_at,now()) WHERE id=s.id RETURNING * INTO s;
    END IF;
    result := to_jsonb(s);

  ELSIF p_action='create_match' THEN
    IF p_data->>'source_session_id' IS NOT NULL THEN
      SELECT * INTO s FROM public.pickup_sessions WHERE id=(p_data->>'source_session_id')::uuid FOR UPDATE;
      IF NOT FOUND OR s.organizer_id<>actor THEN RAISE EXCEPTION 'Organizer required' USING ERRCODE='42501'; END IF;
      IF s.state NOT IN ('started','completed') OR s.court_id IS DISTINCT FROM (p_data->>'court_id')::uuid
        OR s.format IS DISTINCT FROM p_data->>'format' THEN RAISE EXCEPTION 'Invalid source session' USING ERRCODE='22023'; END IF;
    END IF;
    per_side := CASE p_data->>'format' WHEN '1v1' THEN 1 WHEN '2v2' THEN 2 WHEN '5v5' THEN 5 ELSE 0 END;
    IF per_side=0 OR jsonb_typeof(p_data->'players') IS DISTINCT FROM 'array' THEN
      RAISE EXCEPTION 'Invalid match players' USING ERRCODE='22023';
    END IF;
    IF jsonb_array_length(p_data->'players')<>per_side*2 THEN RAISE EXCEPTION 'Wrong player count' USING ERRCODE='22023'; END IF;
    INSERT INTO public.pickup_matches(organizer_id,court_id,source_session_id,format)
      VALUES(actor,(p_data->>'court_id')::uuid,(p_data->>'source_session_id')::uuid,p_data->>'format') RETURNING * INTO m;
    FOR player IN SELECT value FROM jsonb_array_elements(p_data->'players') LOOP
      IF jsonb_typeof(player)<>'object' OR EXISTS(SELECT 1 FROM jsonb_object_keys(player) k WHERE k NOT IN ('side','user_id','guest_label')) THEN
        RAISE EXCEPTION 'Invalid player fields' USING ERRCODE='22023';
      END IF;
      INSERT INTO public.pickup_match_players(match_id,side,user_id,guest_label)
        VALUES(m.id,player->>'side',(player->>'user_id')::uuid,player->>'guest_label');
    END LOOP;
    IF (SELECT count(*) FROM public.pickup_match_players WHERE match_id=m.id AND side='A')<>per_side OR
       (SELECT count(*) FROM public.pickup_match_players WHERE match_id=m.id AND side='B')<>per_side THEN
      RAISE EXCEPTION 'Wrong side counts' USING ERRCODE='22023';
    END IF;
    result := to_jsonb(m);
  ELSE
    SELECT * INTO m FROM public.pickup_matches WHERE id=(p_data->>'match_id')::uuid FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Match not found' USING ERRCODE='P0002'; END IF;
    IF m.organizer_id<>actor THEN RAISE EXCEPTION 'Organizer required' USING ERRCODE='42501'; END IF;
    expected := pickup_private.integer_value(p_data->'expected_revision');
    new_a := pickup_private.integer_value(p_data->'score_a');
    new_b := pickup_private.integer_value(p_data->'score_b');
    IF expected<>m.revision THEN RAISE EXCEPTION 'Result revision conflict' USING ERRCODE='PT409'; END IF;
    INSERT INTO public.pickup_score_history(match_id,revision,previous_a,previous_b,score_a,score_b)
      VALUES(m.id,m.revision+1,m.score_a,m.score_b,new_a,new_b);
    UPDATE public.pickup_matches SET score_a=new_a,score_b=new_b,revision=revision+1,
      state='completed',closed_at=coalesce(closed_at,now()) WHERE id=m.id RETURNING * INTO m;
    IF m.source_session_id IS NOT NULL THEN
      UPDATE public.pickup_sessions SET state='completed',closed_at=coalesce(closed_at,now())
        WHERE id=m.source_session_id AND organizer_id=actor AND state='started';
    END IF;
    result := to_jsonb(m);
  END IF;
  INSERT INTO pickup_private.requests(actor_id,request_id,payload,response) VALUES(actor,p_request_id,payload,result);
  RETURN result;
END $$;
NOTIFY pgrst,'reload schema';
COMMIT;

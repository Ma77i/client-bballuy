-- Incremental MVP contract. Baseline/seed remain local-only.
-- Deployment to an existing project requires a separate reviewed upgrade.
CREATE TABLE public.court_memberships (
  user_id uuid NOT NULL REFERENCES public.users_public(id) ON DELETE CASCADE,
  court_id uuid NOT NULL REFERENCES public.courts(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, court_id)
);
CREATE INDEX court_memberships_court_idx ON public.court_memberships(court_id);
ALTER TABLE public.court_memberships ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.court_memberships FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.court_memberships TO service_role;
-- Ownership policies and API writes are deliberately gated on T03.

-- Keep geography storage intact and expose named numbers for map clients.
CREATE VIEW public.court_catalog WITH (security_invoker = true) AS
SELECT id, name, half_court, lighting, surface, notes, created_at,
       public.ST_Y(coords::public.geometry) AS latitude,
       public.ST_X(coords::public.geometry) AS longitude
FROM public.courts;
REVOKE ALL ON TABLE public.court_catalog FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.court_catalog TO anon, authenticated, service_role;

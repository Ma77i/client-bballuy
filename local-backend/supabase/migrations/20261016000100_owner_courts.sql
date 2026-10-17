-- Owner-supplied catalog batch, 2026-10-16. Local development only.
-- Concrete is stored using the existing catalog value; unknown fields stay null.
-- The DO block is atomic and safe to replay; conflicts abort the whole batch.
DO $$
DECLARE r record; point geography;
BEGIN
  FOR r IN SELECT * FROM (VALUES
      ('13829193-bd91-4a7b-ab4a-c960fbbbd390'::uuid, 'La sereg', -56.1714, -34.896771, false),
      ('5c8cf078-9371-4164-8bac-e830f29de0a8'::uuid, 'barrio sur', -56.1829666, -34.9140763, true),
      ('466a68f4-abbd-4df3-ad0a-c043a9a80d98'::uuid, 'cementerio sur', -56.1881912, -34.9133863, false),
      ('7ccdea8a-7a07-4a00-b2b8-9b358abab0e3'::uuid, 'Plaza Argentina', -56.19905, -34.911714, false)
  ) AS batch(id, name, longitude, latitude, half_court)
  LOOP
    point := ST_SetSRID(ST_MakePoint(r.longitude, r.latitude),4326)::geography;
    IF EXISTS (SELECT 1 FROM public.courts c WHERE c.id=r.id) THEN
      IF NOT EXISTS (SELECT 1 FROM public.courts c WHERE c.id=r.id AND c.name=r.name
          AND ST_AsEWKB(c.coords::geometry)=ST_AsEWKB(point::geometry)
          AND c.half_court=r.half_court AND c.surface='concreto'
          AND c.lighting IS NULL AND c.notes IS NULL) THEN
        RAISE EXCEPTION 'Existing court conflicts with owner catalog batch: %', r.name;
      END IF;
    ELSE
      IF EXISTS (SELECT 1 FROM public.courts c
          WHERE lower(trim(c.name))=lower(trim(r.name)) OR ST_DWithin(c.coords,point,5)) THEN
        RAISE EXCEPTION 'Possible duplicate court; review before import: %', r.name;
      END IF;
      INSERT INTO public.courts(id,name,coords,half_court,surface,lighting,notes)
      VALUES(r.id,r.name,point,r.half_court,'concreto',NULL,NULL);
    END IF;
  END LOOP;
END $$;

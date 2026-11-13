-- Apply once to a NEW, dedicated RedZen database as its migration owner.
-- Never run automatically during build/start or against a shared BaddBeatz database.
BEGIN;
CREATE SCHEMA redzen_private;
REVOKE ALL ON SCHEMA redzen_private FROM PUBLIC;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'redzen_intake') THEN
    CREATE ROLE redzen_intake NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;
  END IF;
  IF current_user = 'redzen_intake' OR
     EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'redzen_intake' AND
       (rolsuper OR rolcreatedb OR rolcreaterole OR rolbypassrls)) THEN
    RAISE EXCEPTION 'Use an independent, restricted runtime role';
  END IF;
END $$;

CREATE TABLE redzen_private.interest_requests (
  id text PRIMARY KEY CHECK (id ~ '^[a-f0-9]{64}$'),
  fingerprint text NOT NULL CHECK (fingerprint ~ '^[a-f0-9]{64}$'),
  kind text NOT NULL CHECK (kind IN ('interest', 'early-access')),
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 100 AND name = btrim(name)),
  email text NOT NULL CHECK (length(email) BETWEEN 3 AND 254 AND email = btrim(email)),
  consent boolean NOT NULL DEFAULT true CHECK (consent = true),
  received_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE redzen_private.rate_buckets (
  client_hash text NOT NULL CHECK (client_hash ~ '^[a-f0-9]{64}$'),
  window_start timestamptz NOT NULL,
  attempts integer NOT NULL CHECK (attempts BETWEEN 1 AND 21),
  PRIMARY KEY (client_hash, window_start)
);
CREATE TABLE redzen_private.schema_version (version integer PRIMARY KEY CHECK (version = 1));
INSERT INTO redzen_private.schema_version VALUES (1);
ALTER TABLE redzen_private.interest_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE redzen_private.rate_buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE redzen_private.schema_version ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION redzen_private.submit_interest(
  p_id text, p_fingerprint text, p_kind text, p_name text, p_email text, p_client_hash text
) RETURNS TABLE (status text, id text, kind text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog AS $$
DECLARE
  previous redzen_private.interest_requests%ROWTYPE;
  attempts integer;
  saved redzen_private.interest_requests%ROWTYPE;
BEGIN
  IF session_user <> 'redzen_intake' OR
     EXISTS (SELECT 1 FROM pg_roles WHERE rolname = session_user AND
       (rolsuper OR rolcreatedb OR rolcreaterole OR rolbypassrls)) THEN
    RAISE EXCEPTION 'Use the restricted runtime role';
  END IF;
  IF p_id IS NULL OR p_id !~ '^[a-f0-9]{64}$' OR
     p_fingerprint IS NULL OR p_fingerprint !~ '^[a-f0-9]{64}$' OR
     p_client_hash IS NULL OR p_client_hash !~ '^[a-f0-9]{64}$' OR
     p_kind IS NULL OR p_kind NOT IN ('interest', 'early-access') OR
     p_name IS NULL OR length(p_name) NOT BETWEEN 1 AND 100 OR p_name <> btrim(p_name) OR
     p_email IS NULL OR length(p_email) NOT BETWEEN 3 AND 254 OR
     p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' OR p_email <> btrim(p_email) THEN
    RAISE EXCEPTION 'Invalid application';
  END IF;
  SELECT r.* INTO previous FROM redzen_private.interest_requests AS r WHERE r.id = p_id;
  IF FOUND THEN
    IF previous.fingerprint = p_fingerprint THEN
      RETURN QUERY SELECT 'received'::text, previous.id, previous.kind;
    ELSE
      RETURN QUERY SELECT 'conflict'::text, NULL::text, NULL::text;
    END IF;
    RETURN;
  END IF;
  INSERT INTO redzen_private.rate_buckets AS b (client_hash, window_start, attempts)
  VALUES (p_client_hash, date_bin('15 minutes', CURRENT_TIMESTAMP, '2000-01-01'::timestamptz), 1)
  ON CONFLICT (client_hash, window_start) DO UPDATE SET attempts = least(b.attempts + 1, 21)
  RETURNING b.attempts INTO attempts;
  IF attempts > 20 THEN
    RETURN QUERY SELECT 'rate_limited'::text, NULL::text, NULL::text;
    RETURN;
  END IF;
  INSERT INTO redzen_private.interest_requests AS r (id, fingerprint, kind, name, email)
  VALUES (p_id, p_fingerprint, p_kind, p_name, p_email)
  ON CONFLICT ON CONSTRAINT interest_requests_pkey DO UPDATE SET id = EXCLUDED.id
    WHERE r.fingerprint = EXCLUDED.fingerprint
  RETURNING r.* INTO saved;
  IF FOUND THEN
    RETURN QUERY SELECT 'received'::text, saved.id, saved.kind;
  ELSE
    RETURN QUERY SELECT 'conflict'::text, NULL::text, NULL::text;
  END IF;
END $$;

CREATE FUNCTION redzen_private.intake_ready() RETURNS boolean
LANGUAGE sql SECURITY DEFINER SET search_path = pg_catalog AS $$
  SELECT EXISTS (SELECT 1 FROM redzen_private.schema_version WHERE version = 1)
    AND session_user = 'redzen_intake'
    AND NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = session_user AND
      (rolsuper OR rolcreatedb OR rolcreaterole OR rolbypassrls))
$$;

REVOKE ALL ON ALL TABLES IN SCHEMA redzen_private FROM PUBLIC, redzen_intake;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA redzen_private FROM PUBLIC;
GRANT USAGE ON SCHEMA redzen_private TO redzen_intake;
GRANT EXECUTE ON FUNCTION redzen_private.submit_interest(text,text,text,text,text,text) TO redzen_intake;
GRANT EXECUTE ON FUNCTION redzen_private.intake_ready() TO redzen_intake;
COMMIT;

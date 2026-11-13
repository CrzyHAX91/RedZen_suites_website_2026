-- Apply as migration owner after 001. No production migration is automatic.
BEGIN;
ALTER TABLE redzen_private.schema_version DROP CONSTRAINT schema_version_version_check;
UPDATE redzen_private.schema_version SET version = 2;
ALTER TABLE redzen_private.schema_version ADD CONSTRAINT schema_version_version_check CHECK (version = 2);
DROP FUNCTION redzen_private.submit_interest(text,text,text,text,text,text);
DROP FUNCTION redzen_private.intake_ready();
CREATE FUNCTION redzen_private.submit_interest_v2(
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
       (rolsuper OR rolcreatedb OR rolcreaterole OR rolbypassrls)) OR
     EXISTS (SELECT 1 FROM pg_auth_members WHERE member = (SELECT oid FROM pg_roles WHERE rolname = session_user)) THEN
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
  -- Serialize same-key retries across independent sessions before consuming rate slots.
  PERFORM pg_advisory_xact_lock(hashtextextended(p_id, 0));
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

CREATE OR REPLACE FUNCTION redzen_private.intake_ready(required_version integer) RETURNS boolean
LANGUAGE sql SECURITY DEFINER SET search_path = pg_catalog AS $$
  SELECT required_version = 2 AND EXISTS (SELECT 1 FROM redzen_private.schema_version WHERE version = 2)
    AND session_user = 'redzen_intake'
    AND NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = session_user AND
      (rolsuper OR rolcreatedb OR rolcreaterole OR rolbypassrls))
    AND NOT EXISTS (SELECT 1 FROM pg_auth_members WHERE member = (SELECT oid FROM pg_roles WHERE rolname = session_user))
$$;


REVOKE ALL ON FUNCTION redzen_private.submit_interest_v2(text,text,text,text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION redzen_private.submit_interest_v2(text,text,text,text,text,text) TO redzen_intake;
REVOKE ALL ON FUNCTION redzen_private.intake_ready(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION redzen_private.intake_ready(integer) TO redzen_intake;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'redzen_maintenance') THEN
    CREATE ROLE redzen_maintenance NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;
  END IF;
END $$;
CREATE FUNCTION redzen_private.expire_intake(
  application_before timestamptz, bucket_before timestamptz, dry_run boolean DEFAULT true
) RETURNS TABLE (applications bigint, rate_buckets bigint)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog AS $$
DECLARE app_count bigint; bucket_count bigint;
BEGIN
  IF session_user <> 'redzen_maintenance' OR
     EXISTS (SELECT 1 FROM pg_roles WHERE rolname = session_user AND
       (rolsuper OR rolcreatedb OR rolcreaterole OR rolbypassrls)) OR
     EXISTS (SELECT 1 FROM pg_auth_members WHERE member = (SELECT oid FROM pg_roles WHERE rolname = session_user)) THEN
    RAISE EXCEPTION 'Use the independent maintenance role';
  END IF;
  IF application_before IS NULL OR bucket_before IS NULL OR dry_run IS NULL OR
     NOT isfinite(application_before) OR NOT isfinite(bucket_before) OR
     application_before > CURRENT_TIMESTAMP - interval '1 day' OR
     bucket_before > CURRENT_TIMESTAMP - interval '1 day' THEN
    RAISE EXCEPTION 'Invalid retention cutoffs';
  END IF;
  IF dry_run THEN
    SELECT count(*) INTO app_count FROM redzen_private.interest_requests WHERE received_at < application_before;
    SELECT count(*) INTO bucket_count FROM redzen_private.rate_buckets WHERE window_start < bucket_before;
  ELSE
    DELETE FROM redzen_private.interest_requests WHERE received_at < application_before;
    GET DIAGNOSTICS app_count = ROW_COUNT;
    DELETE FROM redzen_private.rate_buckets WHERE window_start < bucket_before;
    GET DIAGNOSTICS bucket_count = ROW_COUNT;
  END IF;
  RETURN QUERY SELECT app_count, bucket_count;
END $$;
REVOKE ALL ON FUNCTION redzen_private.expire_intake(timestamptz,timestamptz,boolean) FROM PUBLIC, redzen_intake;
REVOKE ALL ON ALL TABLES IN SCHEMA redzen_private FROM redzen_maintenance;
GRANT USAGE ON SCHEMA redzen_private TO redzen_maintenance;
GRANT EXECUTE ON FUNCTION redzen_private.expire_intake(timestamptz,timestamptz,boolean) TO redzen_maintenance;

COMMIT;

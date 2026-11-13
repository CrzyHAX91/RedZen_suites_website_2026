-- Operator audit: metadata and schema version only; no application records are read.
-- Run inside a READ ONLY transaction after 001, 002 and independent login provisioning.
WITH roles AS (
  SELECT wanted.name, r.* FROM (VALUES ('redzen_intake'), ('redzen_maintenance')) wanted(name)
  LEFT JOIN pg_catalog.pg_roles r ON r.rolname = wanted.name
), private_schema AS (
  SELECT * FROM pg_catalog.pg_namespace WHERE nspname = 'redzen_private'
), tables AS (
  SELECT c.* FROM pg_catalog.pg_class c JOIN private_schema n ON n.oid = c.relnamespace
  WHERE c.relkind IN ('r','p')
), expected_functions(signature, allowed_role) AS (
  VALUES ('redzen_private.submit_interest_v2(text,text,text,text,text,text)', 'redzen_intake'),
         ('redzen_private.intake_ready(integer)', 'redzen_intake'),
         ('redzen_private.expire_intake(timestamp with time zone,timestamp with time zone,boolean)', 'redzen_maintenance')
), functions AS (
  SELECT e.*, p.* FROM expected_functions e
  LEFT JOIN pg_catalog.pg_proc p ON p.oid = pg_catalog.to_regprocedure(e.signature)
), checks(check_name, passed) AS (
  SELECT 'restricted_independent_logins', count(*) = 2 AND bool_and(oid IS NOT NULL AND rolcanlogin
    AND NOT (rolsuper OR rolcreatedb OR rolcreaterole OR rolbypassrls OR rolinherit)
    AND NOT EXISTS (SELECT 1 FROM pg_catalog.pg_auth_members m WHERE m.member = roles.oid)) FROM roles
  UNION ALL
  SELECT 'private_schema_owner_and_public_acl', count(*) = 1 AND bool_and(
    nspowner NOT IN (SELECT oid FROM roles WHERE oid IS NOT NULL)
    AND NOT EXISTS (SELECT 1 FROM pg_catalog.aclexplode(coalesce(nspacl, pg_catalog.acldefault('n',nspowner))) a
      WHERE a.grantee = 0 AND a.privilege_type IN ('USAGE','CREATE'))) FROM private_schema
  UNION ALL
  SELECT 'version_2', count(*) = 1 AND min(version) = 2 FROM redzen_private.schema_version
  UNION ALL
  SELECT 'required_tables_and_rls', count(*) = 3 AND bool_and(relrowsecurity
    AND relname IN ('interest_requests','rate_buckets','schema_version')
    AND relowner NOT IN (SELECT oid FROM roles WHERE oid IS NOT NULL)) FROM tables
  UNION ALL
  SELECT 'no_direct_table_privileges', count(*) = 6 AND bool_and(r.oid IS NOT NULL AND NOT
    pg_catalog.has_table_privilege(r.oid,t.oid,'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER'))
    FROM roles r CROSS JOIN tables t
  UNION ALL
  SELECT 'schema_usage_without_create', count(*) = 2 AND bool_and(r.oid IS NOT NULL
    AND pg_catalog.has_schema_privilege(r.oid,n.oid,'USAGE')
    AND NOT pg_catalog.has_schema_privilege(r.oid,n.oid,'CREATE')) FROM roles r CROSS JOIN private_schema n
  UNION ALL
  SELECT 'no_schema_creation', count(*) > 0 AND bool_and(r.oid IS NOT NULL
    AND NOT pg_catalog.has_schema_privilege(r.oid,n.oid,'CREATE'))
    FROM roles r CROSS JOIN pg_catalog.pg_namespace n
    WHERE n.nspname !~ '^pg_temp_' AND n.nspname !~ '^pg_toast_temp_'
  UNION ALL
  SELECT 'definer_owners_and_search_paths', count(*) = 3 AND bool_and(oid IS NOT NULL AND prosecdef
    AND proowner NOT IN (SELECT oid FROM roles WHERE oid IS NOT NULL)
    AND 'search_path=pg_catalog, pg_temp' = ANY(proconfig)) FROM functions
  UNION ALL
  SELECT 'no_public_rpc_execution', count(*) = 3 AND bool_and(oid IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM pg_catalog.aclexplode(coalesce(proacl, pg_catalog.acldefault('f',proowner))) a
    WHERE a.grantee = 0 AND a.privilege_type = 'EXECUTE')) FROM functions
  UNION ALL
  SELECT 'only_assigned_rpc_execution', count(*) = 6 AND bool_and(f.oid IS NOT NULL AND r.oid IS NOT NULL
    AND pg_catalog.has_function_privilege(r.oid,f.oid,'EXECUTE') = (r.name = f.allowed_role))
    FROM roles r CROSS JOIN functions f
  UNION ALL
  SELECT 'no_unexpected_private_rpcs', NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_proc p JOIN private_schema n ON n.oid = p.pronamespace CROSS JOIN roles r
    WHERE pg_catalog.has_function_privilege(r.oid,p.oid,'EXECUTE')
      AND NOT EXISTS (SELECT 1 FROM functions f WHERE f.oid = p.oid AND f.allowed_role = r.name))
)
SELECT check_name, coalesce(passed,false) AS passed FROM checks ORDER BY check_name;

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

const audit = await readFile(new URL('../db/checks/intake_permissions.sql', import.meta.url), 'utf8');
test('independent read-only audit detects privilege drift without reading application records', async () => {
  const db = await PGlite.create();
  try {
    for (const name of ['001_private_intake.sql','002_intake_concurrency_and_retention.sql']) {
      await db.exec(await readFile(new URL('../db/migrations/' + name, import.meta.url), 'utf8'));
    }
    await db.exec('ALTER ROLE redzen_intake LOGIN; ALTER ROLE redzen_maintenance LOGIN');
    async function checks() {
      await db.exec('BEGIN READ ONLY');
      try { return (await db.query<{check_name: string; passed: boolean}>(audit)).rows; }
      finally { await db.exec('ROLLBACK'); }
    }
    const baseline = await checks();
    assert.equal(baseline.length, 11);
    assert.ok(baseline.every(r => r.passed), JSON.stringify(baseline));
    for (const [grant, revoke, failed] of [
      ['GRANT SELECT ON redzen_private.interest_requests TO redzen_intake', 'REVOKE SELECT ON redzen_private.interest_requests FROM redzen_intake', 'no_direct_table_privileges'],
      ['GRANT EXECUTE ON FUNCTION redzen_private.expire_intake(timestamptz,timestamptz,boolean) TO redzen_intake', 'REVOKE EXECUTE ON FUNCTION redzen_private.expire_intake(timestamptz,timestamptz,boolean) FROM redzen_intake', 'only_assigned_rpc_execution'],
      ['CREATE ROLE audit_test_group; GRANT audit_test_group TO redzen_maintenance', 'REVOKE audit_test_group FROM redzen_maintenance; DROP ROLE audit_test_group', 'restricted_independent_logins'],
      ['ALTER FUNCTION redzen_private.intake_ready(integer) SET search_path = pg_catalog', 'ALTER FUNCTION redzen_private.intake_ready(integer) SET search_path = pg_catalog, pg_temp', 'definer_owners_and_search_paths'],
      ['GRANT USAGE ON SCHEMA redzen_private TO PUBLIC', 'REVOKE USAGE ON SCHEMA redzen_private FROM PUBLIC', 'private_schema_owner_and_public_acl'],
    ]) {
      await db.exec(grant);
      assert.equal((await checks()).find(r => r.check_name === failed)?.passed, false, failed);
      await db.exec(revoke);
    }
    assert.ok((await checks()).every(r => r.passed));
  } finally { await db.close(); }
});

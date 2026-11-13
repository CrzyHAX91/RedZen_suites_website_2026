import { readFile } from 'node:fs/promises';
import pg from 'pg';

// Private operator task only. This never applies a migration or reads lead records.
async function main() {
  if (process.argv.length !== 2) throw Error('Unexpected arguments');
  const url = new URL(process.env.REDZEN_AUDIT_DATABASE_URL || '');
  if (!['postgres:','postgresql:'].includes(url.protocol) || !url.password ||
      !url.hostname.endsWith('.neon.tech') || url.hostname !== process.env.REDZEN_DATABASE_HOST ||
      !['require','verify-full'].includes(url.searchParams.get('sslmode') || '') ||
      !process.env.REDZEN_EXPECTED_DATABASE_NAME ||
      decodeURIComponent(url.pathname.slice(1)) !== process.env.REDZEN_EXPECTED_DATABASE_NAME ||
      ['redzen_intake','redzen_maintenance'].includes(decodeURIComponent(url.username))) {
    throw Error('Use the approved independent audit connection');
  }
  const client = new pg.Client({ connectionString: url.toString(), connectionTimeoutMillis: 5000 });
  await client.connect();
  try {
    await client.query('BEGIN READ ONLY');
    await client.query("SET LOCAL statement_timeout = '10s'");
    const sql = await readFile(new URL('../db/checks/intake_permissions.sql', import.meta.url), 'utf8');
    const result = await client.query(sql);
    await client.query('ROLLBACK');
    const passed = result.rows.length === 11 && result.rows.every(r => r.passed === true);
    console.log(JSON.stringify({ audit: 'intake-permissions', readOnly: true, passed, checks: result.rows }));
    if (!passed) process.exitCode = 1;
  } finally { await client.end(); }
}
main().catch(() => { console.error('Permission audit failed; no credentials, SQL errors or personal records logged.'); process.exitCode = 1; });

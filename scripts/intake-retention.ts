import pg from 'pg';

// Operator-only. Never imported by the web app, API handlers or build scripts.
async function main() {
  const url = new URL(process.env.REDZEN_MAINTENANCE_DATABASE_URL || '');
  if (!['postgres:', 'postgresql:'].includes(url.protocol) || url.username !== 'redzen_maintenance' ||
      !url.hostname.endsWith('.neon.tech') || url.hostname !== process.env.REDZEN_DATABASE_HOST ||
      !url.password || !['require', 'verify-full'].includes(url.searchParams.get('sslmode') || '')) {
    throw Error('Use the separate restricted maintenance connection with TLS and the approved host.');
  }
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const confirmation = args.find(x => x.startsWith('--confirm-database='))?.slice('--confirm-database='.length);
  if (args.some(x => x !== '--apply' && !x.startsWith('--confirm-database='))) throw Error('Unknown option.');
  if (process.env.REDZEN_PRIVACY_READY !== 'true') throw Error('Privacy/retention configuration has not been enabled.');
  if (apply && confirmation !== decodeURIComponent(url.pathname.slice(1))) throw Error('Apply requires --confirm-database=<exact database name>.');
  function days(key: string) {
    const value = process.env[key] || '';
    if (!/^[1-9][0-9]{0,3}$/.test(value) || Number(value) > 3650) throw Error('Set approved retention days.');
    return Number(value);
  }
  const now = Date.now();
  const appBefore = new Date(now - days('REDZEN_APPLICATION_RETENTION_DAYS') * 86400000);
  const bucketBefore = new Date(now - days('REDZEN_RATE_BUCKET_RETENTION_DAYS') * 86400000);
  const client = new pg.Client({ connectionString: url.toString(), connectionTimeoutMillis: 5000, statement_timeout: 30000 });
  await client.connect();
  try {
    const result = await client.query('SELECT * FROM redzen_private.expire_intake($1,$2,$3)', [appBefore, bucketBefore, !apply]);
    console.log(JSON.stringify({ dryRun: !apply, applicationBefore: appBefore, bucketBefore, counts: result.rows[0] }));
  } finally { await client.end(); }
}
main().catch(() => { console.error('Retention operation failed. No connection string, SQL details or personal data logged.'); process.exitCode = 1; });

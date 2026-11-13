import { neon } from '@neondatabase/serverless';

export interface StoredApplication {
  id: string;
  fingerprint: string;
  kind: 'interest' | 'early-access';
  name: string;
  email: string;
  clientHash: string;
}
export interface IntakeResult {
  status: 'received' | 'conflict' | 'rate_limited';
  id?: string;
  kind?: string;
}
export type Query = (sql: string, values?: unknown[]) => Promise<Record<string, unknown>[]>;
export interface InterestStore {
  put: (record: StoredApplication) => Promise<IntakeResult>;
  ready: () => Promise<boolean>;
}

// Narrow RPC-only database role. No browser key, table export or runtime DDL.
export function createPostgresInterestStore(query: Query): InterestStore {
  return {
    async ready() {
      const rows = await query('SELECT redzen_private.intake_ready(2) AS ready');
      return rows.length === 1 && rows[0].ready === true;
    },
    async put(record) {
      const rows = await query(
        'SELECT * FROM redzen_private.submit_interest_v2($1, $2, $3, $4, $5, $6)',
        [record.id, record.fingerprint, record.kind, record.name, record.email, record.clientHash],
      );
      if (rows.length !== 1) throw new Error('Intake unavailable');
      const row = rows[0];
      if (row.status === 'conflict' || row.status === 'rate_limited') return { status: row.status };
      if (row.status !== 'received' || row.id !== record.id || row.kind !== record.kind) {
        throw new Error('Intake unavailable');
      }
      return { status: 'received', id: record.id, kind: record.kind };
    },
  };
}

export function createNeonInterestStore(env: NodeJS.ProcessEnv): InterestStore {
  const url = new URL(env.DATABASE_URL || '');
  if (!['postgres:', 'postgresql:'].includes(url.protocol) ||
      url.hostname !== env.REDZEN_DATABASE_HOST || !url.hostname.endsWith('.neon.tech') ||
      url.username !== 'redzen_intake' || !url.password ||
      !['require', 'verify-full'].includes(url.searchParams.get('sslmode') || '')) {
    throw new Error('Intake unavailable');
  }
  const sql = neon(url.toString());
  return createPostgresInterestStore(async (text, values = []) => {
    return await sql.query(text, values, { fetchOptions: { signal: AbortSignal.timeout(7000) } });
  });
}

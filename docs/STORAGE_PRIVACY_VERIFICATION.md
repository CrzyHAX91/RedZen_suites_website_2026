# Storage/privacy hardening and Linux verification

## Changes

- Public secondary pages load on demand; the homepage remains eager. The initial
  minified JavaScript chunk falls from 560.98 kB to about 427.71 kB in a local
  production build (about 24%). The 500 kB warning is not suppressed.
- Apply migration 002 after 001 as the independent migration owner. Versioned
  submit_interest_v2 and intake_ready(2) calls deliberately fail if 002 is absent.
  Old unversioned RPCs are removed. No database migration runs during build/start.
- A transaction advisory lock serializes identical request keys before checking
  existing records or counting rate slots. The record primary key remains the
  final uniqueness constraint. Role memberships make runtime readiness/submission
  fail closed. No additional anonymous or runtime table permissions are granted.
- A separate NOLOGIN maintenance role can preview counts and remove only records
  before validated cutoffs through expire_intake. It cannot read table contents;
  the intake role cannot invoke maintenance. Grant LOGIN only through the secure
  operator flow after approval; never reuse the intake URL or an owner login.
- REDZEN_PRIVACY_READY remains false by default. Intake requires explicitly
  configured application, rate-bucket and backup retention days (1..3650), a
  reviewed privacy setup and the existing separate-project/enablement guards.
  No retention duration is silently selected as business policy.
- Public property/investor forms prepare a mailto draft, with no browser lead
  storage or claim of receipt. The visitor sends the message themselves. A static
  build gate rejects legacy browser lead-storage keys in any public JS chunk,
  keeping the associated seed records out of the public bundle.
- Privacy copy discloses pseudonymous IP hashes, withdrawal, processors and the
  backup deletion limitation. This is technical preparation, not a legal review
  or proof of an operational privacy process.

## Linux PostgreSQL service test

The new isolated GitHub Actions job uses a disposable PostgreSQL 17 container on
an Ubuntu runner. CI-only trust authentication belongs solely to that disposable
service. Production connection validation still requires the approved Neon host,
restricted login and TLS. The test pins connections to loopback/redzen_ci and
refuses to run without CI=true and the service container ID.

It applies actual migrations and tests separate backend sessions, 40 concurrent
same-key HTTP retries, conflicting reuse, 30 simultaneous distinct requests under
one IP's 20-slot limit, interest and early-access, runtime and anonymous access,
role membership rejection, database stop/start, committed-data persistence,
pg_dump/restore into a fresh database, restored permissions, and maintenance
preview/deletion restrictions. The HTTP adapter uses the real handler, store and
SQL; it does not simulate Vercel/Neon networking or prove deployed routing.

The browser-smoke job exercises lazy route navigation on desktop and mobile
viewports, deferred downloads and synthetic failed/successful intake responses.
It blocks all external requests and never writes to the live intake. A local
browser attempt was blocked by sandbox Unix-socket restrictions; CI provides
browser execution evidence instead.

Local ordinary tests run PGlite and are separate evidence. A real PostgreSQL CI
result must be inspected before claiming the Linux integration suite passed.

## Operator runbook — intake stays closed until completed

1. Confirm the dedicated project/database/region, processor arrangements, privacy
   contact and purpose-based retention durations for preview and production.
   These are open operator decisions. Do not use synthetic test values as policy.
2. Review/apply migration 002 as owner on each approved database. Confirm runtime
   has no role memberships, ownership, direct table grants or administrative flags.
3. Create the independent maintenance login securely. Set its connection URL only
   in the operator environment, never in public/client variables or intake workers.
4. Set the approved retention variables and REDZEN_PRIVACY_READY only after the
   operational checks below. Run `node --import tsx scripts/intake-retention.ts`
   first: it is a count-only dry-run. Actual deletion requires `--apply` and
   `--confirm-database=<exact database name>`. Logs contain counts/cutoffs, no PII.
5. Install an approved daily private cleanup schedule and failure alert. None is
   installed by this PR. Dry-run/apply against disposable records first. Record
   the operator action, counts and result without names, emails or secrets.
6. Configure provider backup expiry using the approved backup retention days;
   that environment variable is a release prerequisite, not a provider API call.
   Record deletion requests securely. Before restoring a backup into service,
   reapply deletion requests and retention cleanup; verify their absence before
   opening intake. Routine cleanup does not replace targeted erasure requests.
7. Review WAF/bot controls, provider quotas/spend alerts, deployed routing,
   trusted forwarded IP behavior, cold starts and physical iOS Safari submission.
   The IP limit is not a complete bot defence. Owner operations and their private
   credentials remain separate from the public intake.

Matching idempotency keys work while their request records are retained. Once a
record is removed, reusing an old key is treated as a new request. Backups are
not scrubbed by deleting a live row. Never claim immediate erasure from backups.
No live database, WAF, account, cloud retention policy, payment, deployment or
public intake is changed by these source changes or disposable tests.

# Authorized Neon preview verification — 13 November 2026

This is actual Neon evidence, separate from local/PGlite and GitHub Linux tests.
Only newly created test resources and synthetic data were used. No Vercel project,
production database, public intake, payments or paid subscription was activated.

## Retained test environment

| Item | Verified value |
| --- | --- |
| Organization | Dustin, `org-twilight-hill-46553389`; plan remains Free |
| Project | `redzen-suites-preview` / `solitary-silence-12788156` |
| Region / PostgreSQL | AWS Frankfurt `aws-eu-central-1` / 17 |
| Original retained branch | `preview` / `br-empty-lab-ba0qx6l1`, default=true |
| Database / owner | `redzen_preview` / `redzen_migration_owner` |
| Final compute | `ep-sweet-band-badrghhg`, fixed 0.25 CU |
| Final direct host | `ep-sweet-band-badrghhg.c-8.eu-central-1.aws.neon.tech` |
| History | 21,600 seconds (6 hours), not 7 days |
| Idle suspension | Provider default (`suspend_timeout_seconds=0`); Free rejects an explicit override |
| Scheduled snapshots | Empty schedule; none enabled |
| Remaining lead rows / rate buckets | 0 / 0 after fixture cleanup |
| Remaining branches / manual snapshots | Original preview only / 0 snapshots |

The original project-create request with explicit 300-second suspension was rejected
by the Free plan. The successful request left provider suspension defaults intact;
there was no plan upgrade. No credentials appear in this report or source. Runtime
and maintenance login passwords were provisioned through server-generated values
and the provider credential flow without displaying them. Neither login owns the
schema/tables/functions, inherits another role, or has direct private-table access.

## Database checks performed

The database was checked empty before applying the reviewed migrations 001 then
002 as its independent migration owner. Each migration ran transactionally. Actual
restricted-login authentication succeeded and `intake_ready(2)` returned true.

The read-only catalog audit passed all 11 checks on the original database and again
on the restored database: role flags/memberships, private schema and table ownership,
RLS, no direct table grants/schema creation, exact RPC execution grants, no PUBLIC
RPC execution, safe SECURITY DEFINER search paths and schema version 2. This is a
separate operator-login audit, not a claim of independent human review or provider
IAM assurance. Organization metadata reports MFA is not required; owner account
security remains a production action.

Live negative tests returned SQLSTATE 42501 for runtime table access, maintenance
table access and runtime invocation of `expire_intake`. Maintenance count-only
preview worked and did not delete records.

## Requests and rate limiting

- Forty client calls submitted as one parallel batch: all received the same reference.
  Exactly one request row and one rate slot were stored.
- Only one distinct backend PID was observed through the connected query route.
  This route serialized/reused one connection. These measurements prove retry
  idempotency, NOT actual simultaneous independent Neon sessions. Independent-session
  concurrency remains established only by the separate Linux PostgreSQL CI test.
- Conflicting reuse of the same key returned `conflict`.
- Thirty distinct synthetic requests sharing one client hash: 20 received,
  10 rate_limited. This was a single SQL statement, not a concurrency measurement.
- Both interest and early-access were accepted with synthetic name/email fixtures.

These are SQL/RPC tests, not Vercel HTTP/routing or physical Safari acceptance.

## Provider snapshot, erasure replay and cleanup

A synthetic erasure fixture was dated 60 days old. A manual Neon snapshot
`snap-super-star-baep5fjv` captured 23 synthetic records, including that fixture.
It was created at 13:59:58 UTC with an expiry of 14:59:56 UTC.

Maintenance dry-run counted exactly one expired application. Explicit cleanup then
removed that one row from the original branch (22 rows remained, fixture absent).
A snapshot restore produced `br-withered-credit-baemxfrc`; it contained the earlier
23 rows, demonstrating that the deleted fixture reappeared from backup.

Important operator correction: the restore request used `finalize=true`, which
swapped the test project's default branch/name and moved computes. That was not
the intended isolated-copy behaviour. The original branch was immediately restored
as default, branch names were corrected, and checks thereafter used explicit branch
IDs. No website or production resource was attached. For future isolated tests,
use `finalize=false` and inspect actual branches/computes before proceeding.

The restored branch passed all 11 permission checks. Reapplying the erasure cleanup
removed exactly one row again (22 remained, erased fixture absent). A retry returned
the original request reference on the restored database.

The non-default restore branch and its snapshot were then deleted under the owner's
explicit test-cleanup approval. Only the known synthetic IDs and client hashes were
removed from the retained original preview. Final reads confirmed one original
branch, zero manual snapshots, zero request rows and zero rate buckets. The surviving
preview compute has the new endpoint ID/host recorded above; no app environment URL
was configured. There are no production RPO/RTO or backup-expiry guarantees from
this one disposable restore test.

## Still open before public production

Vercel commercial entitlement, separate project, protected deployment/routing,
Neon HTTPS application transport and independent-session burst testing, trusted
forwarded-IP behaviour, WAF/spend controls, real cold-start/redeployment tests,
physical Safari checks, approved notice/retention choices, processor arrangements,
operational rights requests/cleanup alerts and production backup schedule/expiry.

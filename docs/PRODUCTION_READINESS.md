# RedZen privacy, permissions, backup and hosted acceptance

Status: NEON PREVIEW VERIFIED, VERCEL HOSTED ACCEPTANCE BLOCKED. 13 November 2026.
This document does not authorize resource creation, DDL, deletion, paid plans,
deployment, public collection, mail sending or payments. These need owner approval.

## Observed account state and intended target

Authenticated Vercel reads on 13 November returned one team, `crzyhaxs`
(`team_8aFGl7PLCorNBqEa2GbmTDs5`), and one project, `redzen-suites-wellness`
(`prj_BrZa2h7kmiRBIvvm1QVbULLPJtfK`). The repository's existing rollout record
identifies that project as BaddBeatz. It is explicitly excluded by the code guard.
No independent RedZen project or installed database integration appeared in that
team's complete project/integration lists. This does not establish the state of
standalone Neon accounts or other Vercel accounts. The team API did not return a
billing plan. A later authorized Neon setup created the separate Free preview project
`solitary-silence-12788156` in Frankfurt, database `redzen_preview`. Migrations 001/002,
role checks and provider snapshot restore/deletion replay were verified with
synthetic data. See [NEON_PREVIEW_VERIFICATION.md](NEON_PREVIEW_VERIFICATION.md).
No Vercel RedZen preview deployment or production database has been created.

Target: Neon preview created after approval; hosting and production remain proposals:

| Item | Proposed value |
| --- | --- |
| Vercel team | Existing `crzyhaxs`; never modify its existing project |
| New project | `redzen-suites-website-2026`, subject to availability |
| Source | Reviewed commit of `CrzyHAX91/RedZen_suites_website_2026` |
| Hosting | Node 24.x, Vite, `npm run build:vercel`, `dist`, functions `fra1` |
| Protection | Require authentication for the immutable preview URL; no domain cutover |
| Preview database | Created Free project `redzen-suites-preview`, `aws-eu-central-1`, test fixtures removed after verification |
| Production database | Separate empty Neon project; no branches copied from production into preview |
| Initial intake | `REDZEN_INTAKE_ENABLED=false`, `REDZEN_PRIVACY_READY=false` |
| Git deployments | Keep `git.deploymentEnabled=false` |
| Excluded secrets | No BaddBeatz, SMTP, Stripe or Gemini credentials |

Vercel's published commercial offering starts at USD20/month excluding taxes and
usage. Its Hobby plan is for personal/non-commercial use. Existing commercial
entitlement and incremental charges must be confirmed before creating a project;
do not upgrade or accept paid terms from this runbook. Spend limits on the shared
team can affect BaddBeatz: do not change them globally without reviewing that impact.

## Privacy decisions ready for owner review

These are proposed maximums, not statutory terms and not active configuration.
The AP requires a purpose-based justification rather than one universal duration.

| Data/process | Proposal | Reason / decision still required |
| --- | --- | --- |
| Interest and early-access requests | 180 days from receipt; earlier removal on withdrawal when applicable | Pre-opening communication; review necessity at 90 days. No marketing reuse outside the agreed purpose. |
| HMAC IP-rate buckets | 1 day | Rate limiting uses 15-minute windows; daily cleanup bounds remaining storage to about 48 hours, not a guaranteed 24-hour maximum. |
| Application cleanup | Daily private run, failure alert and count-only logs | Daily cadence can leave records up to one day beyond the configured cutoff; disclose this or schedule more frequently. |
| Production backup/history | Maximum 7 days | Requires configured expiry for every snapshot, WAL history and any export; not just an env variable. |
| Preview fixtures | Maximum 1 day, removed after acceptance | No customer data. Destroy test copies and snapshots after the restore exercise. |
| Proposed recovery objective | RPO <=24 hours, RTO <=4 hours | Business objectives, not measured guarantees; prove them in a restore exercise. |

Before publishing, confirm the legal controller name and correspondence address,
verify access to `info@redzen-suites.nl`, approve purposes/legal bases, document
the abuse-prevention balancing assessment and consent wording, and complete the
processor/transfer record. No health data or payment data belong in this intake.
The database stores consent=true and a timestamp, but does not prove which notice
version a person saw; record release dates and approved notice versions securely.

Provider register to complete:

| Provider | Scope | Required evidence |
| --- | --- | --- |
| Vercel | Function/CDN processing and operational logs | Actual account/plan, applicable DPA, subprocessors/transfer basis, log retention and access controls |
| Neon | Database, history, snapshots | Actual project/region/plan, executed/applicable DPA, subprocessors/transfer basis and expiry configuration |
| Mail provider | Mailto messages received by the owner | Provider identity, DPA, mailbox retention and deletion workflow; still unknown |

Frankfurt for compute/database does not prove that all processing stays in the EU.
Do not mark DPA/transfer checks complete just because a provider publishes a DPA.

### Website privacy text to approve, not yet published

Controller: [confirm legal name], trading as RedZen-Suites, [confirm correspondence
address], contact info@redzen-suites.nl. We process your first name, email,
application kind, consent, receipt timestamp and reference for your application
and pre-opening updates. Consent can be withdrawn via that contact address.
We use a keyed IP-derived code for abuse prevention; this is pseudonymous data.
Applications are deleted after 180 days, with daily cleanup (up to one extra day),
or earlier where a valid withdrawal/erasure request requires it. Rate buckets are
deleted after one day with daily cleanup (up to one extra day). Proposed providers
are Vercel and Neon; insert confirmed account-specific region, transfer safeguards
and processor details before publication. Backup/history copies expire within the
approved maximum seven days; restoring data requires replaying erasure requests
before the service reopens. Contact us for access, correction, applicable erasure,
restriction or portability, or to object where applicable. You can complain to the
Autoriteit Persoonsgegevens. An application is no reservation or payment.

This notice is a draft. Also align cookie/analytics copy with actual network
behaviour. Mailto partner/investor/contact messages require mailbox policy coverage.

### Requests, targeted erasure and deletion replay

1. Owner checks the requester's identity proportionately through the existing
   contact channel. Do not request identity documents by default. Record a private
   case reference, request/action dates and applicable deadline; no public issues.
2. An independent authorized operator handles access/correction/targeted erasure
   through parameterized owner operations on the confirmed database. The runtime
   role must never gain SELECT/UPDATE/DELETE. `expire_intake` only handles age-based
   deletion and cannot by itself fulfil an individual erasure request.
3. Preview counts before any approved erasure. Record affected opaque request IDs
   and deletion timestamp in a separate restricted erasure ledger outside restored
   database history. No email/name in CI logs. That ledger is personal data too:
   approve its access and a limited lifetime covering all recoverable backups.
4. Before reopening any restored database, replay the ledger and retention cleanup,
   verify targeted rows are absent and rerun the permission audit. No customer-facing
   request-export or erasure UI is supplied by this PR. Assign and test the operator
   process before real collection; no unattended deletion workflow is installed.

## Independent database verification

Migrations remain manual owner operations, never build/startup code. Apply 001 then
002 only to the separately approved database with intake closed. Provision runtime
and maintenance logins via the provider's secure flow. Neither may own objects,
inherit other roles, create schemas or directly access private tables. Keep
maintenance credentials outside web functions. Do not use `npm start`/the Express
file-store as a production substitute: it lacks the Vercel privacy guards.

The new operator audit reads catalog metadata and the schema version in a
`BEGIN READ ONLY` transaction. It outputs 11 named pass/fail checks without leads.
It detects role flags/memberships, table grants/RLS, schema access/ownership,
unexpected RPC grants, PUBLIC execution and unsafe definer configuration.
It does not prove provider IAM, password rotation, network ACLs, contracts or backups.

Provide `ops/operator.env.example` fields through a private secret store, then run:

```sh
node --import tsx scripts/audit-intake-permissions.ts
```

Require exit code 0 and 11 passing checks on both the original and restored database.
The connection must target the exact approved host/database and an independent
auditor with enough metadata/version access; never put its URL into web variables.

## Backup and restore procedure

Neon Free offers at most six hours of restore history and one manual snapshot;
scheduled backups are unavailable there. Use it only for the disposable preview
exercise. A one-day preview maximum-retention policy is an upper limit, not a
claim that Free provides 24 hours of recovery. Production's proposed seven-day
history requires a suitable paid Neon plan and separate cost authorization.

After approval, the operator must:

1. Confirm exact project/branch/database IDs and region. Capture provider settings
   showing WAL/history window, snapshot schedule, expiry and quotas. Inventory any
   manual snapshots/exports separately; shortening WAL history does not remove them.
2. For isolated snapshot tests, request `finalize=false` and verify branch/default/endpoint
   metadata before continuing. `finalize=true` can replace the source branch name
   and move its computes; it is not an isolated-copy operation.
3. Set production history to seven days and, if approved/needed, a daily snapshot
   schedule with explicit seven-day expiry. Confirm provider support and total
   cost before enabling it. Store no unencrypted pg_dump exports in this repo/CI.
4. On a protected preview containing only synthetic fixtures, create a backup or
   snapshot and restore into an isolated disposable target. Record start/end,
   recovery point and measured RPO/RTO, not the whole database contents.
5. Verify committed fixture rows, an earlier synthetic erasure replay, the 11-check
   audit and API idempotency. Never replace/repoint the original live database for
   this test. Keep the restored target closed until checks pass.
6. Verify expiry/deletion actually removes test snapshots/copies; configure a private
   cleanup task and failure alert. Test that alert. Run the existing retention CLI
   dry-run before a separately approved `--apply --confirm-database=<exact name>`.

`REDZEN_BACKUP_RETENTION_DAYS=7` is not a Neon API operation. Retention, recovery
availability and backup restoration are separate evidence items. None is marked
complete by the Linux disposable pg_dump/restore test.

## Protected hosted acceptance

First approve creating the separate project and empty preview database, exact
commercial entitlement/costs, DDL 001/002 and a protected preview deployment. No
public alias/domain cutover. Check the actual immutable deployment, project, commit,
preview environment, authentication and empty database before confirming its host.

With intake still closed, run:

```sh
node --import tsx scripts/verify-hosted-preview.ts
```

It refuses unapproved/production-style/branch aliases and fails if the preview is
accessible without protection. It does not follow redirects with the bypass secret.
Seven checks cover the protected homepage/API, liveness, closed intake, closed
legacy lead endpoint and JSON 404. No contact records are submitted in this mode.

After separate approval to enable intake ONLY on the protected synthetic preview,
approve preview-specific privacy/retention values, then run:

```sh
node --import tsx scripts/verify-hosted-preview.ts --synthetic --confirm-host=<exact-preview-hostname>
```

Nineteen checks exercise real network acknowledgments, eight simultaneous retries,
conflicting reuse, validation, cross-origin rejection and both application kinds.
The result contains only synthetic opaque references; verify exactly two committed
rows independently. The script deliberately reports durability/restore unverified.
Do not set production flags or reuse production secrets. Protection bypass belongs
only in the operator environment; responses, auth tokens and browser state are not
shareable test artifacts. Mock contract tests do not establish hosted success.

Remaining real-environment scenarios: trusted forwarded-IP spoof resistance/rate
limit, provider outage and recovery, function cold start/redeployment persistence,
provider backup restore/deletion replay, actual static/server-artifact exposure,
WAF/abuse/spend alerts, and physical iOS Safari success/failure/retry. Record the
exact SHA, immutable URL, actual settings, time and non-sensitive results. Do not
rerun tests against a newer commit unless changes require it.

## Release gates and evidence

| Gate | Current result |
| --- | --- |
| Separate RedZen hosting / empty Neon preview | Neon preview verified and empty; Vercel project still absent |
| Owner policy, controller/contact and DPAs | OPEN: proposals above, no approval/contract evidence |
| Catalog audit code and contract tests | Local tests passed; actual Neon audit passed; see this PR's CI for Linux evidence |
| Hosted role/password/IAM audit | Actual Neon login/SQL audit passed 11/11; provider IAM/second-person review and Vercel configuration remain open |
| Backup expiry and provider restoration | Free preview snapshot restore and erasure replay verified; production schedule/expiry still unconfigured |
| Protected hosted acceptance | BLOCKED: no deployed immutable RedZen preview |
| Production/public intake/payments | CLOSED; separate approval and all applicable gates required |

## Official references checked 13 November 2026

- https://autoriteitpersoonsgegevens.nl/nl/over-privacy/persoonsgegevens/bewaren-van-persoonsgegevens
- https://autoriteitpersoonsgegevens.nl/themas/basis-avg/avg-algemeen/verwerkersovereenkomst
- https://vercel.com/pricing
- https://vercel.com/legal/dpa
- https://neon.com/docs/introduction/regions
- https://neon.com/docs/introduction/plans
- https://neon.com/docs/postgres/backup-restore/backups
- https://neon.com/docs/postgres/backup-restore/history-window
- https://neon.com/pdf/DPA.pdf

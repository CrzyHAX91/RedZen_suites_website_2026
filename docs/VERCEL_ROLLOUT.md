> Follow-up: see [STORAGE_PRIVACY_VERIFICATION.md](STORAGE_PRIVACY_VERIFICATION.md)
> for mandatory migration 002, version-2 RPCs, privacy configuration and the
> isolated Linux PostgreSQL tests. The original November 5 validation below
> predates that follow-up and is not evidence for its final commit.

# RedZen Vercel rollout - option B

Selected by the owner on 5 November 2026. This is code preparation, not authorization
to provision resources, change hosting, move domains or deploy.

## Existing target: preserve it

Authenticated inspection on 5 November found:

| Item | Observed value |
| --- | --- |
| Team | `crzyhaxs` / `team_8aFGl7PLCorNBqEa2GbmTDs5` |
| Existing project | `redzen-suites-wellness` / `prj_BrZa2h7kmiRBIvvm1QVbULLPJtfK` |
| Existing production alias | `redzen-suites-wellness.vercel.app` |
| Alias deployment | `dpl_61H1sjc8RppxJr2oAehkD5n94SeX` |
| Deployed repository | `CrzyHAX91/Baddbeatz-Studio-App` |
| Deployed branch/SHA | `main` / `e0834fe9d6522742c2bf32ffe8ef9a1156f979ad` |
| RedZen implementation base | `main` / `e55717668e7fbf7d6e92d82cd517fc4e29fbd613` |

No project attached to the RedZen repository was returned in this team's filtered
project list. No installed database integration was returned. This does not prove
that none exists in other accounts. The team API does not expose its billing plan.
The old rollout document is historical; its older alias observation is not current.

## Proposed target: new, independent resources

| Setting | Proposal |
| --- | --- |
| Vercel project | New `redzen-suites-website-2026`, subject to availability |
| Repository / production branch | `CrzyHAX91/RedZen_suites_website_2026` / `main` |
| Root / framework | Repository root / Vite |
| Node | 22.x or 24.x, checked by CI |
| Build / static output | `npm run build:vercel` / `dist` |
| API | Explicit Node Web handlers under `api/`; no standalone listener |
| Function region | `fra1` (Frankfurt); provision database close to it |
| Database | Dedicated Neon/PostgreSQL project, separate empty preview and production branches/databases |
| Automatic Git deployments | Disabled by `git.deploymentEnabled=false` |
| First release | Protected preview with disposable data; exact reviewed commit |
| Existing domains | No changes, including the misleading BaddBeatz alias |

Provisioning the project/import can itself start a deployment. It therefore needs
explicit hosting/deployment approval before creation. Do not assume a first import
is read-only. Do not enable an automatic release workflow.

For commercial use, Vercel requires Pro or Enterprise; Hobby is restricted to
personal non-commercial use. Published Pro pricing starts at $20/month, with usage
and tax potentially additional. Existing plan and incremental project cost are not
confirmed. Neon Free is proposed for the preview, but Marketplace availability,
limits, region and billing terms must be reviewed at provisioning. Do not upgrade
an account, accept paid terms or enable paid overage without separate authorization.

## Runtime settings (never client variables)

| Variable | Value / purpose |
| --- | --- |
| `REDZEN_VERCEL_PROJECT_ID` | New project's actual ID, different from the existing BaddBeatz ID |
| `VERCEL_PROJECT_ID`, `VERCEL`, `VERCEL_ENV` | Vercel system variables; expose system variables in the new project |
| `REDZEN_INTAKE_ENABLED` | `false` initially. Exact `true` only for an approved, protected intake test |
| `DATABASE_URL` | Dedicated `redzen_intake` login connection, `sslmode=require`; set as a secret |
| `REDZEN_DATABASE_HOST` | Exact Neon endpoint hostname for this environment, including pooler suffix if used |
| `REDZEN_RATE_LIMIT_SECRET` | Newly generated random secret of at least 32 characters, server-only |

Never share BaddBeatz secrets, reuse its project ID, or prefix database/rate-limit
secrets with `VITE_`. Preview must never inherit the production database URL or
production lead data. Neon integration defaults may use owner credentials: those
are deliberately rejected by the runtime. Configure the restricted login instead.
The API does not require SMTP, Stripe or Gemini credentials.

## Database setup, after approval

1. Confirm a NEW dedicated Neon database/branch, region and account before DDL.
2. Review and apply `db/migrations/001_private_intake.sql` once as migration owner.
   Migration is never part of build, startup or request handling.
3. Give the generated `redzen_intake` role LOGIN with a newly generated password
   through the provider's secure administration flow. Do not paste it in chat,
   commands, issues, logs or source control. Do not grant the role ownership,
   membership in an owner/admin role, table access, superuser, create-role,
   create-database or bypass-RLS privileges.
4. Put its connection string into the NEW project's environment secret settings.
5. Verify `/api/ready` before submitting any synthetic requests. Disabling intake
   intentionally makes readiness return 503 while `/api/health` remains liveness.

The schema is private; anonymous/PUBLIC has no schema access. The runtime only
executes two narrowly scoped functions. Tables have row-level security enabled;
fixed-search-path security-definer functions perform validated writes as the
migration owner. There is no public list/read/update/delete endpoint for leads.

Requests are atomic database statements. Matching request-key fingerprints return
the existing ID; conflicting payloads return 409. A primary key and conflict-aware
insert arbitrate simultaneous inserts. Validated requests are acknowledged only
after the database call completes; database errors yield 503 without a fallback.
Client timeout can occur after a committed write: the existing client reuses its
idempotency key, so a retry resolves to the same reference.

The database rate limit permits 20 new applications per Vercel-supplied client IP
per 15-minute window. Only its HMAC is stored; matching retries do not consume
another slot. This is not a full bot defence or spending cap. Review project WAF,
provider quotas, operator alerts and spend controls before public collection.
Decide retention for applications and hashed rate buckets; provide an approved
operator cleanup/backup procedure. No automatic data deletion job is installed.

## Routing and public build

`vercel.json` routes named APIs first, closed legacy lead/payment/receipt URLs next,
and all remaining `/api` paths to a JSON 404 handler. Static files and SPA fallback
come afterward. Every function fixes its operation internally; query parameters
cannot turn a closed legacy path into an intake action.

`build:vercel` runs a project guard, builds only the Vite client and checks static
output. The ordinary standalone build puts server output in `server-build`, outside
`dist`. The old demo admin is not loaded from the public app and the client Drive
backup worker is not started. These browser features are not a server intake CRM
or database backup. Server-side authorized administration remains future work.

Reservations, payments, paid receipts and discounts remain disabled. The existing
booking policy is unchanged and the standard rate stays EUR150 per two hours.

## Verification evidence and release gates

Local Node 24: all 28 tests, TypeScript, the ordinary production build and the
Vercel frontend build with synthetic project metadata passed. All five function
entrypoints were also imported locally and checked for JSON responses with intake
disabled; this is not a Vercel runtime execution.
The seven added test groups execute the real SQL migration and functions on
PGlite (PostgreSQL compiled to WASM), check restricted/anonymous permissions,
idempotency, conflict and rate limiting, and reopen a disk-backed test database.
PGlite has one connection: queued request tests do NOT prove independent-session
Neon concurrency or actual Vercel execution. Stubs used for failure tests only
verify HTTP error handling, not storage durability.

Before deployment approval, require CI on the final commit (Node 22 and 24) and
review provider plan, target ID and environment. Before public intake, complete:

- Protected Vercel/Neon end-to-end tests for both kinds, outage, retries and
  simultaneous independent requests, using only disposable test data.
- Actual deployed routing: API unknown returns JSON 404, closed legacy routes 409,
  successful intake 201, conflict 409, invalid input 400 and rate limit 429.
- Verify received records persist across a function cold start and redeployment;
  restore a disposable backup. Verify no lead, source map or server bundle is public.
- Physical iOS Safari submission/failure/retry tests and approved privacy/retention
  information. Check property/address/opening copy separately before publication.

No deployable preview, live Neon transport, backup restore or domain cutover is
claimed by local/CI checks. A protected preview is the next approval boundary.
Publication/custom domain cutover requires separate approval. Record current
DNS/alias values first, and rollback only the new RedZen resources; preserve
received applications and never rollback the existing BaddBeatz project.

## Official references checked on 5 November 2026

- https://vercel.com/docs/functions/runtimes/node-js
- https://vercel.com/docs/project-configuration/vercel-json
- https://vercel.com/docs/project-configuration/git-configuration
- https://vercel.com/docs/headers/request-headers
- https://vercel.com/docs/plans/hobby
- https://vercel.com/pricing
- https://github.com/neondatabase/serverless/blob/main/CONFIG.md
- https://neon.com/pricing
- https://pglite.dev/docs/about

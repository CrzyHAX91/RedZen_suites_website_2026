# CI maintenance — 13 November 2026

The Booking quality workflow now pins checkout v7.0.1 and setup-node v7.1.0 to
their verified upstream commit SHAs. Both actions use Node 24 internally;
application checks still cover Node 22 and 24 on GitHub-hosted Ubuntu runners.
Read-only token permissions and persist-credentials: false are retained.

A separate dependency job installs the lockfile with lifecycle scripts disabled
and runs npm audit --audit-level=high over production and development packages.
High/critical findings and registry failures fail the job; no advisory exceptions,
continue-on-error or automatic dependency rewrites are used. npm audit sends
package/version metadata to the npm registry. This repository and its manifests
are public; no application data or credentials are part of the audit.

The first run exposed gRPC through Firestore and a Vite development-server issue.
Vite is now locked to 6.4.6, with a manifest floor of ^6.4.5 in both existing
dependency sections. Firebase remains on its existing major version. A scoped
override replaces Firestore's ~1.9.0 gRPC dependency with exactly 1.13.6, an
upstream patched release for both gRPC advisories. This crosses Firestore's
declared minor range and therefore needs compatibility verification. Remove the
override when Firebase supplies a patched supported dependency range; do not
apply npm audit fix --force's suggested downgrade to Firebase 9.

Local Node 24 verification: npm ci, all 28 tests (0 failed/skipped), TypeScript,
production build and npm audit (0 vulnerabilities) pass. An offline Firestore
SDK smoke check initializes a synthetic app, sets a loopback emulator target,
constructs a document reference and terminates without a remote read/write.
This does not prove authenticated Firestore transport or production operation.
The separate Vercel build remains covered by CI; inspect the final commit's run.

The existing ~561 kB initial frontend chunk warning is a performance concern,
not a failed CI step. Its threshold is not increased or suppressed by this change.
Storage rollout, prices, bookings, payments and deployments are outside this
CI change. No live customer/provider test or payment is performed.

## Upstream evidence

- https://github.com/actions/checkout/releases/tag/v7.0.1
- https://github.com/actions/setup-node/releases/tag/v7.1.0
- https://github.com/advisories/GHSA-m9gg-hp2v-232j
- https://github.com/advisories/GHSA-f596-whhp-79r4
- https://github.com/advisories/GHSA-8g5g-mxqh-grgj

First audit run: https://github.com/CrzyHAX91/RedZen_suites_website_2026/actions/runs/43421893914

# Dependency review — PR #3

## Security and reachability

| Update | Verified upstream change | Effect in this application |
| --- | --- | --- |
| body-parser 1.20.8 → 1.20.9 | CVE-2026-111181 / GHSA-27r3-jxmh-p828: trailing bytes after a compressed request could cause an unhandled decompressor error and crash the process. The fix detaches/destroys the decoder, handles late errors and drains the request; unsupported charset validation happens before decompression. | Directly relevant: Express uses JSON and extended URL-encoded parsers for public requests. Both resolve to the updated package. |
| nodemailer 9.1.1 → 10.1.4 | Requires Node >=20 and supplies ESM/CommonJS builds. Includes bounded parser/MIME work, removal of credentials on cross-origin redirects, protection against per-message OAuth token-endpoint override, header-name sanitization, safer MIME boundaries and private DKIM cache files. | No active Nodemailer import, SMTP transport or sendMail call exists in application source. Reservation helpers throw; the HTTP receipt route returns 409. Contact creates a mailto draft on the visitor's device. These fixes reduce latent dependency risk; they do not restore mail delivery. |
| qs 6.16.0 → 6.16.2 | Encoding/correctness fixes; bounds on repeated strictMerge conflicts and array-limit handling. | Transitive Express/body-parser dependency. No separate CVE is established by the reviewed release notes. Existing intake validation remains required. |
| re2js 2.8.6 → 2.9.1 | Typed-array/DFA changes, lazy DFA construction, frozen codepoint data and corrected re() type declaration. Requires Node >=20. | Transitive @firebase/ai dependency, with no direct application import. No separate CVE is established by the reviewed release notes. |

The lockfile also adds six bundled optional WASM dependency records under Tailwind oxide; their parent version is unchanged. Nodemailer adds no runtime dependencies. Its source manifest's prepare script builds its distribution; the npm lock entry does not mark a new install script.

## Runtime and package-manager correction

The existing quality workflow used Node 22. This PR declares supported Node 22/24 LTS major lines, adds .nvmrc=22 and checks npm installation with --engine-strict on both majors. Production runtime configuration is external and has not been inspected or changed: confirm the actual runtime is 22 or 24 before any later deployment.

package-lock.json is the authoritative lockfile; use npm ci. The stale bun.lock is removed because it still resolves the old dependencies and could cause a build system to select a different dependency graph. Bun installation is not a supported/retested path for this change.

## Nodemailer behavior to account for before enabling SMTP

- Pool idle connections close after four minutes by default. Rejected recipients reset reusable connections; a connection dropped before a message is sent may be retried.
- connectionTimeout covers DNS, proxy, TCP, TLS, greeting and STARTTLS setup.
- Any 421 response ends the SMTP session; idle closure emits end rather than an ECONNECTION error.
- Already-consumed or destroyed message streams fail with ESTREAM.
- After failed opportunistic STARTTLS, authentication is skipped on a plaintext connection unless forceAuth is explicitly set.

There is currently no application SMTP configuration to migrate. Offline ESM/CommonJS JSON-transport checks verify import and message-composition compatibility; they are not evidence of external SMTP delivery. A later, separately approved activation must test provider TLS/authentication, timeouts, rejected recipients and failure reporting without claiming payment or a confirmed booking.

## Validation and overlap

PR #1 was already merged as a11b41fab36f7c6daf047bf1e47c55012fdf90d3, which is the parent of the reviewed Dependabot commit c3e23fbb781f58ef0d6df5a50df0f3107def6ee2. PR #3 was the only open PR at review time. Price, booking gates and website copy are untouched.

The original GitHub Actions run 40871915678 passed all 14 existing tests, TypeScript and the frontend/server production build on Node 22.23.4. The combined commit-status endpoint alone did not reveal those check-runs. GitGuardian also passed.

New tests exercise the same createApp factory used by the standalone server: gzip/deflate trailing bytes, request draining and health after parsing, malformed compression, the JSON body limit, Unicode intake persistence, URL-encoded rejection, closed legacy receipt/payment endpoints, and offline Nodemailer ESM/CommonJS message composition.

Required merge checks: npm ci --engine-strict --no-audit --no-fund; npm test; npm run lint; npm run build on both Node 22 and 24. A successful build can retain the existing Vite chunk-size warning.

Local syntax and whitespace can be checked, but this review environment cannot download npm packages: the registry CONNECT timed out and npm ci --offline failed with ENOTCACHED. A local npm test therefore cannot load tsx. Use the GitHub Actions results for execution evidence; do not label those local attempts as passing.

No deployment, provider configuration, real email, booking or payment is part of this change. No complete zero-vulnerability npm audit is claimed.

## Primary sources

- [body-parser security fix and upstream regression cases](https://github.com/expressjs/body-parser/commit/1260c3845f54502a05a87594f09a334786bb34d7)
- [body-parser advisory](https://github.com/expressjs/body-parser/security/advisories/GHSA-27r3-jxmh-p828)
- [Nodemailer 10.0.0 breaking change](https://github.com/nodemailer/nodemailer/releases/tag/v10.0.0)
- [Nodemailer 10.1.4 changelog](https://github.com/nodemailer/nodemailer/blob/v10.1.4/CHANGELOG.md)
- [Nodemailer message/OAuth hardening](https://github.com/nodemailer/nodemailer/commit/e347fa2260a7e342e772a7e187937aa87ac96364)
- [qs 6.16.2 changelog](https://github.com/ljharb/qs/blob/v6.16.2/CHANGELOG.md)
- [re2js 2.9.0](https://github.com/le0pard/re2js/releases/tag/2.9.0) and [2.9.1](https://github.com/le0pard/re2js/releases/tag/2.9.1)
- [Original passing workflow run](https://github.com/CrzyHAX91/RedZen_suites_website_2026/actions/runs/40871915678)

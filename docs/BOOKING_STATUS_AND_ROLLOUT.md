# RedZen booking status and rollout — 13 October 2026

## Verified inputs

Repository base: `eea72c91f33bfa12bf3d969e5ae3f3d0f8c2e924`.
Standard session: €200 per two hours, confirmed by the owner on 11 October.
Markerkant 13-10 is being investigated. No signed lease, confirmed opening or available calendar is assumed.
The historic €50 Early Access benefit has no current confirmation in the supplied evidence. It is withdrawn from the active offer; historical promises are not retrospectively adjudicated here.
No true reservations, payments, receipts or email sends are activated.

## Behavior implemented

`src/data/bookingStatus.ts` contains the reviewed business state, standard price and derived action policy. Reservation availability requires an eligible phase AND explicit true values for confirmed location, confirmed opening, ready calendar and separate reservation approval. A discount needs explicit confirmation, terms, a valid future expiry and an amount between zero and the standard price. Missing or unexpected gate values fail closed.

Home, suites, header, footer, FAQ and Early Access copy use the standard rate and application wording. Early Access is a request, with no guaranteed priority, discount, voucher, paid deposit or session slot. The old demo membership lookup/referral rewards have been removed from the public Early Access page. Admin invoice generation and legacy client payment helpers are disabled. Server receipt, client payment and legacy lead-sync endpoints reject requests.

Interest and Early Access applications are distinct values. `/api/interest` validates input, persists only permitted fields and returns an application reference only after storage succeeds. It neither marks a payment nor confirms a reservation. Request keys prevent duplicate records on retry. A conflicting reuse returns 409. Invalid input returns 400. Missing or failing storage returns 503, with no simulated fallback. The client rejects HTML, incomplete responses, failures and simulated success; it retains input and reuses the request key for the same submission.

Contact prepares a mailto draft using the existing repository contact address. The user sends it themselves; no email delivery claim is made. The address was retained from source, not independently verified.

Mobile header action is hidden at narrow widths to avoid crowding. Navigation has expanded state, Escape close, focus cycling, scroll lock and background inert state. Inputs have associated labels; feedback is announced; buttons have 48px targets; focus outlines, skip-to-content and reduced-motion support are provided. Heavy admin and investor routes are loaded on demand.

## Checks run

- Eight regression tests passed, including a real local HTTP intake test in a temporary directory.
- `npm run lint` (`tsc --noEmit`) passed.
- `npm run build` passed. Vite retains a warning about a chunk above 500kB; initial JS is reduced from approximately 868kB to 733kB before gzip.
- `git diff --check` passed.
- Browser/device QA was not run: the supported browser-control capability is unavailable in this managed environment. Static React rendering checks cover the affected marketing pages, but cannot prove layout, focus behavior or device compatibility.
- A lockfile and GitHub Actions quality workflow were added. Local passing checks do not imply remote CI has completed.

## Hosting finding

Authenticated Vercel inspection of `redzen-suites-wellness.vercel.app` returned READY production deployment `dpl_5ZSLp5SsBrukKfysbxmmc5wB826W`, linked to **CrzyHAX91/Baddbeatz-Studio-App**, branch main, commit `5b192fb74c4c542ad3212f5403714e08f79fc2a2`. Therefore that hostname is not evidence of this RedZen repository's current UI, and pushing this RedZen branch cannot be assumed to update it. No alias, project connection or production deployment was changed.

## Still required for rollout

1. Review and merge the PR, then deploy the RedZen commit to its correct RedZen hosting project. Verify repository, SHA and domain before release; do not overwrite the BaddBeatz deployment.
2. For the included standalone Node server, configure `LEAD_STORAGE_PATH` to an absolute directory on a **durable private writable volume**, outside `dist` or any publicly served path. Apply appropriate retention, backup and operator access controls before accepting real applications. Records are JSON files with private permissions; this is not an admin management system.
3. A static Vite deployment alone cannot serve the new API. A Vercel/serverless deployment requires a durable database/intake adapter rather than ephemeral local files. No new provider, database, credential or service was provisioned.
4. Validate mobile layouts and keyboard focus in a browser, then exercise success/failure/retry against the deployed intake using test data and remove those records afterward.
5. Obtain current owner confirmation and terms before enabling any Early Access discount. Confirm location, opening, operational readiness and separate approval before building or activating actual booking/payment integration. Setting flags does not create a booking provider.

The current PR implements the customer status and application flow. It does not claim a production rollout, external email delivery, booked session, paid transaction or definitive opening.

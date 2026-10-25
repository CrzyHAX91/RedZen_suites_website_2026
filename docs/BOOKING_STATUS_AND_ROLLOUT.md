# RedZen booking status and rollout — updated 25 October 2026

## Verified inputs

Repository base: `eea72c91f33bfa12bf3d969e5ae3f3d0f8c2e924`.
Standard session: €150 per two hours. The owner instruction “Gebruik 150” from 23 October, explicitly reaffirmed in the 25 October task, supersedes the earlier €200 implementation. It is the standard tariff, not a temporary Early Access discount.
Markerkant 13-10, number 146 is being investigated. No signed lease, confirmed opening or available calendar is assumed.
The historic €50 Early Access benefit has no current confirmation in the supplied evidence; its inactive configured discount is now zero. It is withdrawn from the active offer; historical promises are not retrospectively adjudicated here.
No true reservations, payments, receipts or email sends are activated.

## Behavior implemented

`src/data/bookingStatus.ts` contains the reviewed business state, standard price and derived action policy. Reservation availability requires an eligible phase AND explicit true values for confirmed location, confirmed opening, ready calendar and separate reservation approval. A discount needs explicit confirmation, terms, a valid future expiry and an amount between zero and the standard price. Missing or unexpected gate values fail closed.

Home, suites, header, footer, FAQ and Early Access copy use the standard rate and application wording. Early Access is a request, with no guaranteed priority, discount, voucher, paid deposit or session slot. The old demo membership lookup/referral rewards have been removed from the public Early Access page. Admin invoice generation and legacy client payment helpers are disabled. Server receipt, client payment and legacy lead-sync endpoints reject requests.

Interest and Early Access applications are distinct values. `/api/interest` validates input, persists only permitted fields and returns an application reference only after storage succeeds. It neither marks a payment nor confirms a reservation. Request keys prevent duplicate records on retry. A conflicting reuse returns 409. Invalid input returns 400. Missing or failing storage returns 503, with no simulated fallback. The client rejects HTML, incomplete responses, failures and simulated success; it retains input and reuses the request key for the same submission.

Contact prepares a mailto draft using the existing repository contact address. The user sends it themselves; no email delivery claim is made. The address was retained from source, not independently verified.

Mobile header action is hidden at narrow widths to avoid crowding. Navigation has expanded state, Escape close, focus cycling, scroll lock and background inert state. Inputs have associated labels; feedback is announced; buttons have 48px targets; focus outlines, skip-to-content and reduced-motion support are provided. Heavy admin and investor routes are loaded on demand.

## Checks run

- Fourteen regression tests passed on 25 October, including a real local HTTP intake test in a temporary directory, all public price surfaces, FAQ data, both suite concepts, no unconfirmed extras, discount gates and request IDs without randomUUID.
- `npm run lint` (`tsc --noEmit`) passed.
- `npm run build` passed. Vite retains a warning about a chunk above 500kB; initial JS is reduced from approximately 868kB to 729kB before gzip on 25 October.
- `git diff --check` passed.
- Chromium browser QA used isolated 320px, 390px and 768px iframe viewports, not physical devices. No horizontal document overflow was measured for Early Access, suites and FAQ respectively. Checked menu open/Escape close, suite selection, navigation to Early Access, FAQ price expansion and failed intake without a backend: error shown, name/email retained, submit enabled again, no success confirmation. Found and fixed a real HTTP-preview bug: randomUUID was unavailable and threw outside try/finally, leaving the form pending. Request IDs now use secure getRandomValues when needed and all failure paths release the lock. Dedicated iOS Safari/touch/virtual-keyboard and deployed API QA remain outstanding. The local-only Vite script and iframe harness were removed after QA.
- A lockfile and GitHub Actions quality workflow were added. Local passing checks do not imply remote CI has completed.

## Hosting finding

Authenticated Vercel inspection of `redzen-suites-wellness.vercel.app` returned READY production deployment `dpl_5ZSLp5SsBrukKfysbxmmc5wB826W`, linked to **CrzyHAX91/Baddbeatz-Studio-App**, branch main, commit `5b192fb74c4c542ad3212f5403714e08f79fc2a2`. Therefore that hostname is not evidence of this RedZen repository's current UI, and pushing this RedZen branch cannot be assumed to update it. No alias, project connection or production deployment was changed.

## Still required for rollout

1. Review and merge the PR, then deploy the RedZen commit to its correct RedZen hosting project. Verify repository, SHA and domain before release; do not overwrite the BaddBeatz deployment.
2. For the included standalone Node server, configure `LEAD_STORAGE_PATH` to an absolute directory on a **durable private writable volume**, outside `dist` or any publicly served path. Apply appropriate retention, backup and operator access controls before accepting real applications. Records are JSON files with private permissions; this is not an admin management system.
3. A static Vite deployment alone cannot serve the new API. A Vercel/serverless deployment requires a durable database/intake adapter rather than ephemeral local files. No new provider, database, credential or service was provisioned.
4. Complete physical iOS Safari/keyboard QA and exercise success/failure/retry against the deployed durable intake with disposable test data. Local Chromium and HTTP tests passed; they do not prove production deployment.
5. Obtain current owner confirmation and terms before enabling any Early Access discount. Confirm location, opening, operational readiness and separate approval before building or activating actual booking/payment integration. Setting flags does not create a booking provider.

The current PR implements the customer status and application flow. It does not claim a production rollout, external email delivery, booked session, paid transaction or definitive opening.

## Source reconciliation on 25 October

- Current owner task explicitly specifies €150 and identifies candidate Markerkant 13-10 number 146. This establishes the price instruction, not an opening or lease approval.
- The exact property brochure for number 146 was not retrieved from the available Library, Drive or relevant email searches. No floor area, rent, parking, permits or installed facilities are asserted from it.
- Retrieved older document `RedZen_Suites_Bedrijfsplan_Markerkant_13-150_Almere.docx` (June 2026; Library ID `libfile_9858d3b82a4081919f4cd0a10119e3d7`, pages 1–2) concerns a different address and €199.95. It explicitly requires object data confirmation; it does not override the October owner instruction and is not the requested number 146 brochure.
- A separate saved Site text `RedZen-Suites.txt` also contains the older €200; it is a separate hosted artifact and was not deployed or edited by this GitHub PR task.
- Investor rate defaults and legacy FAQ seeds now share the central price. Historical inactive referral rewards and admin demonstration records are not active offers and were not repriced retrospectively.
- Configurator no longer adds unconfirmed ritual/extension prices, preselects chargeable extras, or claims a saved membership selection. Both concepts display €150 for two hours; extras remain unpriced pending approval.
- No merge, deployment, real booking, payment or external email was performed.

import { validHostingTarget } from '../server/hostingTarget';

if (!validHostingTarget(process.env)) {
  console.error('Blocked: verify a separate RedZen Vercel project and set REDZEN_VERCEL_PROJECT_ID.');
  process.exit(1);
}
if (process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_OWNER !== 'CrzyHAX91') {
  console.error('Blocked: unexpected repository owner.'); process.exit(1);
}
if (process.env.VERCEL_GIT_REPO_SLUG && process.env.VERCEL_GIT_REPO_SLUG !== 'RedZen_suites_website_2026') {
  console.error('Blocked: unexpected repository.'); process.exit(1);
}
console.log('Separate RedZen project target accepted.');

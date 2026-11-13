export const BADDBEATZ_PROJECT_ID = 'prj_BrZa2h7kmiRBIvvm1QVbULLPJtfK';

// This is a release guard, not a replacement for checking the authenticated project.
export function validHostingTarget(env: NodeJS.ProcessEnv): boolean {
  return env.VERCEL === '1' &&
    ['preview', 'production'].includes(env.VERCEL_ENV || '') &&
    /^prj_[A-Za-z0-9]+$/.test(env.REDZEN_VERCEL_PROJECT_ID || '') &&
    env.VERCEL_PROJECT_ID === env.REDZEN_VERCEL_PROJECT_ID &&
    env.VERCEL_PROJECT_ID !== BADDBEATZ_PROJECT_ID;
}

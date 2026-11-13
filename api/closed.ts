import { createIntakeHandler } from '../server/vercelIntake';
export default { fetch: createIntakeHandler('closed') };

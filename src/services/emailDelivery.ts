export interface ReservationEmailRequest {
  recipientEmail: string;
  senderFrom: string;
  subject: string;
  html: string;
  text: string;
  dryRun?: boolean;
}

export type ReservationEmailResult =
  | { success: true; mode: 'resend'; messageId: string }
  | { success: false; mode: 'simulated'; preview: true };

export class EmailDeliveryError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'EmailDeliveryError';
    this.statusCode = statusCode;
  }
}

/** Sends through Resend, or renders an explicit development-only preview. */
export async function dispatchReservationEmail(
  email: ReservationEmailRequest,
  environment: NodeJS.ProcessEnv = process.env,
  request: typeof fetch = fetch
): Promise<ReservationEmailResult> {
  if (email.dryRun) {
    if (environment.NODE_ENV !== 'development') {
      throw new EmailDeliveryError('Email previews are available only in development.', 403);
    }
    return { success: false, mode: 'simulated', preview: true };
  }

  if (!environment.RESEND_API_KEY || !environment.EMAIL_FROM) {
    throw new EmailDeliveryError('Email provider is not configured.', 503);
  }

  let response: Response;
  try {
    response = await request('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${environment.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: email.senderFrom,
        to: [email.recipientEmail],
        subject: email.subject,
        html: email.html,
        text: email.text
      })
    });
  } catch {
    throw new EmailDeliveryError('Resend could not be reached.', 502);
  }

  let result: { id?: string } = {};
  try {
    result = await response.json() as { id?: string };
  } catch {
    // A successful API response must include a message ID before it is accepted.
  }

  if (!response.ok || !result.id) {
    throw new EmailDeliveryError('Resend did not accept the email.', 502);
  }

  return { success: true, mode: 'resend', messageId: result.id };
}

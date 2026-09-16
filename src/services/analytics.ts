/**
 * RedZen Suites - Analytics & Telemetry Service
 * Safe event dispatching without personal identifiable information (PII).
 */

export type AnalyticsEventName =
  | 'concept_page_viewed'
  | 'suites_page_viewed'
  | 'suite_selected'
  | 'zen_one_viewed'
  | 'zen_signature_viewed'
  | 'sustainability_page_viewed'
  | 'sustainability_cta_clicked'
  | 'faq_page_viewed'
  | 'faq_category_selected'
  | 'faq_item_opened'
  | 'early_access_cta_clicked'
  | 'page_viewed';

export interface AnalyticsPayload {
  page?: string;
  section?: string;
  cta_label?: string;
  suite_source?: string;
  destination?: string;
  category?: string;
  item_id?: string;
  [key: string]: unknown;
}

export function trackEvent(eventName: AnalyticsEventName, payload?: AnalyticsPayload): void {
  try {
    const timestamp = new Date().toISOString();
    const cleanPayload = {
      event: eventName,
      timestamp,
      ...payload
    };

    // Console logging in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[RedZen Analytics] 📊 ${eventName}`, cleanPayload);
    }

    // Google Tag Manager / DataLayer support if available
    if (typeof window !== 'undefined' && (window as unknown as { dataLayer?: unknown[] }).dataLayer) {
      (window as unknown as { dataLayer: unknown[] }).dataLayer.push(cleanPayload);
    }

    // Custom DOM Event for internal subscribers
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('redzen_analytics', { detail: cleanPayload }));
    }
  } catch (err) {
    // Fail silently so UI is never interrupted
    console.warn('Analytics tracking error:', err);
  }
}

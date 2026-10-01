import { EarlyAccessLead, PropertyLead, InvestorLead, LeadStatus } from '../types';
import { INITIAL_LEADS, INITIAL_PROPERTY_LEADS, INITIAL_INVESTOR_LEADS } from '../data/initialData';

const EARLY_ACCESS_KEY = 'redzen_early_access_leads_v1';
const PROPERTY_LEADS_KEY = 'redzen_property_leads_v1';
const INVESTOR_LEADS_KEY = 'redzen_investor_leads_v1';
const MEMBER_COUNTER_BASE = 726; // Realistic pre-launch member count

export function getEarlyAccessLeads(): EarlyAccessLead[] {
  try {
    const raw = localStorage.getItem(EARLY_ACCESS_KEY);
    if (!raw) {
      localStorage.setItem(EARLY_ACCESS_KEY, JSON.stringify(INITIAL_LEADS));
      return INITIAL_LEADS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LEADS;
  }
}

export function saveEarlyAccessLead(leadData: Omit<EarlyAccessLead, 'id' | 'createdAt' | 'status' | 'memberNumber'>): EarlyAccessLead {
  const currentLeads = getEarlyAccessLeads();
  const nextMemberNumber = MEMBER_COUNTER_BASE + currentLeads.length + 1;
  const cleanCode = leadData.referralCode || `ZEN-${leadData.firstName.trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5) || 'GUEST'}-${Math.floor(100 + Math.random() * 900)}`;

  const newLead: EarlyAccessLead = {
    id: 'lead-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    ...leadData,
    referralCode: cleanCode,
    referralCount: leadData.referralCount || 0,
    createdAt: new Date().toISOString(),
    status: 'new',
    memberNumber: nextMemberNumber
  };

  // If this lead was referred by an existing member, increment their referral count
  if (newLead.referredBy) {
    const refQuery = newLead.referredBy.trim().toUpperCase();
    const referrerIndex = currentLeads.findIndex(l => 
      (l.referralCode && l.referralCode.toUpperCase() === refQuery) ||
      l.email.toLowerCase() === newLead.referredBy?.trim().toLowerCase()
    );
    if (referrerIndex !== -1) {
      currentLeads[referrerIndex].referralCount = (currentLeads[referrerIndex].referralCount || 0) + 1;
    }
  }

  const updated = [newLead, ...currentLeads];
  try {
    localStorage.setItem(EARLY_ACCESS_KEY, JSON.stringify(updated));
    // Optional backend sync if server route is mounted
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead)
    }).catch(() => {/* Silent fallback to local storage */});
  } catch (e) {
    console.error('Failed to save to local storage', e);
  }

  return newLead;
}

export function updateLeadStatus(id: string, newStatus: LeadStatus): void {
  const currentLeads = getEarlyAccessLeads();
  const updated = currentLeads.map(lead => 
    lead.id === id ? { ...lead, status: newStatus } : lead
  );
  try {
    localStorage.setItem(EARLY_ACCESS_KEY, JSON.stringify(updated));
    fetch(`/api/leads/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(() => {});
  } catch (e) {
    console.error('Failed to update status', e);
  }
}

export function recordLeadDepositPayment(
  leadId: string, 
  paymentInfo: {
    paymentMethod: EarlyAccessLead['paymentMethod'];
    transactionId: string;
    reservationCode: string;
    receiptNumber: string;
    depositAmount: number;
    emailDeliveryStatus?: EarlyAccessLead['emailDeliveryStatus'];
  }
): EarlyAccessLead | null {
  const currentLeads = getEarlyAccessLeads();
  let updatedLead: EarlyAccessLead | null = null;
  const now = new Date().toISOString();

  const updated = currentLeads.map(lead => {
    if (lead.id === leadId) {
      updatedLead = {
        ...lead,
        status: 'converted',
        paymentStatus: 'deposit_paid',
        depositAmount: paymentInfo.depositAmount,
        paymentMethod: paymentInfo.paymentMethod,
        transactionId: paymentInfo.transactionId,
        reservationCode: paymentInfo.reservationCode,
        receiptNumber: paymentInfo.receiptNumber,
        paidAt: now,
        emailSentAt: paymentInfo.emailDeliveryStatus === 'sent' ? now : undefined,
        emailDeliveryStatus: paymentInfo.emailDeliveryStatus || 'pending'
      };
      return updatedLead;
    }
    return lead;
  });

  try {
    localStorage.setItem(EARLY_ACCESS_KEY, JSON.stringify(updated));
    fetch(`/api/leads/${leadId}/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentInfo)
    }).catch(() => {});
  } catch (e) {
    console.error('Failed to record payment', e);
  }

  return updatedLead;
}

export function recordLeadEmailStatus(
  leadId: string,
  emailDeliveryStatus: NonNullable<EarlyAccessLead['emailDeliveryStatus']>
): EarlyAccessLead | null {
  const currentLeads = getEarlyAccessLeads();
  let updatedLead: EarlyAccessLead | null = null;
  const now = new Date().toISOString();

  const updated = currentLeads.map(lead => {
    if (lead.id !== leadId) return lead;
    updatedLead = {
      ...lead,
      emailDeliveryStatus,
      emailSentAt: emailDeliveryStatus === 'sent' ? now : undefined
    };
    return updatedLead;
  });

  try {
    localStorage.setItem(EARLY_ACCESS_KEY, JSON.stringify(updated));
    fetch(`/api/leads/${leadId}/email-status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailDeliveryStatus })
    }).catch(() => {});
  } catch (e) {
    console.error('Failed to update email status', e);
  }

  return updatedLead;
}

export function getPropertyLeads(): PropertyLead[] {
  try {
    const raw = localStorage.getItem(PROPERTY_LEADS_KEY);
    if (!raw) {
      localStorage.setItem(PROPERTY_LEADS_KEY, JSON.stringify(INITIAL_PROPERTY_LEADS));
      return INITIAL_PROPERTY_LEADS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROPERTY_LEADS;
  }
}

export function savePropertyLead(leadData: Omit<PropertyLead, 'id' | 'createdAt' | 'status'>): PropertyLead {
  const current = getPropertyLeads();
  const newLead: PropertyLead = {
    id: 'prop-' + Date.now(),
    ...leadData,
    createdAt: new Date().toISOString(),
    status: 'new'
  };
  const updated = [newLead, ...current];
  try {
    localStorage.setItem(PROPERTY_LEADS_KEY, JSON.stringify(updated));
    fetch('/api/partner-leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead)
    }).catch(() => {});
  } catch (e) {
    console.error(e);
  }
  return newLead;
}

export function getInvestorLeads(): InvestorLead[] {
  try {
    const raw = localStorage.getItem(INVESTOR_LEADS_KEY);
    if (!raw) {
      localStorage.setItem(INVESTOR_LEADS_KEY, JSON.stringify(INITIAL_INVESTOR_LEADS));
      return INITIAL_INVESTOR_LEADS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_INVESTOR_LEADS;
  }
}

export function saveInvestorLead(leadData: Omit<InvestorLead, 'id' | 'createdAt' | 'status'>): InvestorLead {
  const current = getInvestorLeads();
  const newLead: InvestorLead = {
    id: 'inv-' + Date.now(),
    ...leadData,
    createdAt: new Date().toISOString(),
    status: 'new'
  };
  const updated = [newLead, ...current];
  try {
    localStorage.setItem(INVESTOR_LEADS_KEY, JSON.stringify(updated));
    fetch('/api/investor-leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead)
    }).catch(() => {});
  } catch (e) {
    console.error(e);
  }
  return newLead;
}

export function resetDemoData(): void {
  try {
    localStorage.setItem(EARLY_ACCESS_KEY, JSON.stringify(INITIAL_LEADS));
    localStorage.setItem(PROPERTY_LEADS_KEY, JSON.stringify(INITIAL_PROPERTY_LEADS));
    localStorage.setItem(INVESTOR_LEADS_KEY, JSON.stringify(INITIAL_INVESTOR_LEADS));
  } catch (e) {
    console.error(e);
  }
}

export function exportLeadsToCSV(leads: EarlyAccessLead[]): void {
  const headers = ['Member #', 'First Name', 'Email', 'City', 'Use Case', 'Price Preference', 'Payment Status', 'Deposit (€)', 'Payment Method', 'Reservation Code', 'Receipt #', 'Status', 'Registered At'];
  const rows = leads.map(l => [
    `#${l.memberNumber}`,
    `"${l.firstName.replace(/"/g, '""')}"`,
    `"${l.email.replace(/"/g, '""')}"`,
    `"${l.city.replace(/"/g, '""')}"`,
    `"${l.useCase}"`,
    `"${l.pricePreference}"`,
    `"${l.paymentStatus || 'unpaid'}"`,
    `"${l.depositAmount ? '€' + l.depositAmount : '€0'}"`,
    `"${l.paymentMethod || '-'}"`,
    `"${l.reservationCode || '-'}"`,
    `"${l.receiptNumber || '-'}"`,
    `"${l.status}"`,
    `"${new Date(l.createdAt).toLocaleString('nl-NL')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `redzen_early_access_leads_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getLeadByReferralCode(code: string): EarlyAccessLead | undefined {
  const leads = getEarlyAccessLeads();
  const target = code.trim().toUpperCase();
  return leads.find(l => l.referralCode && l.referralCode.toUpperCase() === target);
}

export function getLeadByEmail(email: string): EarlyAccessLead | undefined {
  const leads = getEarlyAccessLeads();
  const target = email.trim().toLowerCase();
  return leads.find(l => l.email.toLowerCase() === target);
}

export function incrementMemberReferral(identifier: string): EarlyAccessLead | null {
  const leads = getEarlyAccessLeads();
  const target = identifier.trim().toUpperCase();
  const targetEmail = identifier.trim().toLowerCase();

  const index = leads.findIndex(l => 
    (l.referralCode && l.referralCode.toUpperCase() === target) ||
    l.email.toLowerCase() === targetEmail ||
    `#${l.memberNumber}` === target ||
    String(l.memberNumber) === target
  );

  if (index === -1) return null;

  leads[index].referralCount = (leads[index].referralCount || 0) + 1;
  try {
    localStorage.setItem(EARLY_ACCESS_KEY, JSON.stringify(leads));
  } catch (e) {
    console.error('Failed to update referral count', e);
  }
  return leads[index];
}

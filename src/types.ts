export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted';

export type PaymentMethod = 'iDEAL' | 'Creditcard' | 'Apple Pay' | 'Bancontact' | 'Bankoverschrijving';
export type PaymentStatus = 'unpaid' | 'deposit_paid' | 'fully_paid';

export interface DigitalReceipt {
  receiptNumber: string;
  reservationCode: string;
  transactionId: string;
  customerName: string;
  customerEmail: string;
  customerCity: string;
  issueDate: string;
  itemDescription: string;
  totalRetailValue: number;
  earlyAccessDiscount: number;
  depositAmountPaid: number;
  vatAmount: number; // 21% BTW
  netAmountExVat: number;
  remainingAmountDue: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'PAID' | 'COMPLETED';
  companyName: string;
  companyKvk: string;
  companyVat: string;
  companyAddress: string;
}

export interface EarlyAccessLead {
  id: string;
  firstName: string;
  email: string;
  city: string;
  useCase: 'Ontspanning' | 'Date night' | 'Special occasion' | 'Cadeau';
  pricePreference: '€200 (Standaard)' | '€200 + Rituals' | '€200 + VIP Linnen' | '€200 + Private Bar' | string;
  createdAt: string;
  status: LeadStatus;
  memberNumber: number;
  // Payment & Email Confirmation fields
  paymentStatus?: PaymentStatus;
  depositAmount?: number;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  reservationCode?: string;
  receiptNumber?: string;
  paidAt?: string;
  emailSentAt?: string;
  emailDeliveryStatus?: 'sent' | 'pending' | 'failed' | 'simulated';
  referralCode?: string;
  referralCount?: number;
  referredBy?: string;
}

export interface PropertyLead {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  propertyLocation: string;
  size: string;
  description: string;
  createdAt: string;
  status: LeadStatus;
}

export interface InvestorLead {
  id: string;
  name: string;
  companyOrType: string;
  email: string;
  phone: string;
  ticketRange: string;
  message: string;
  createdAt: string;
  status: LeadStatus;
}

export type PageRoute = 
  | '/'
  | '/concept'
  | '/suites'
  | '/arrangements'
  | '/sustainability'
  | '/early-access'
  | '/invest'
  | '/partners'
  | '/faq'
  | '/contact'
  | '/privacy'
  | '/cookies'
  | '/admin';

export type Language = 'nl' | 'en';

export interface DriveStayFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export interface DriveLedgerSummary {
  folderId?: string;
  filesCount: number;
  lastSyncedAt?: string;
  files: DriveStayFile[];
}

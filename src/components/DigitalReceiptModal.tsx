import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Mail, 
  Copy, 
  Check, 
  ShieldCheck, 
  Download, 
  FileText, 
  Sparkles, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { DigitalReceipt } from '../types';
import { buildReservationEmailHtml } from '../services/emailService';
import { exportReceiptToDrive } from '../googleDrive';

interface DigitalReceiptModalProps {
  receipt: DigitalReceipt;
  onClose: () => void;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({ receipt, onClose }) => {
  const [activeTab, setActiveTab] = useState<'receipt' | 'email_preview'>('receipt');
  const [copied, setCopied] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [customEmail, setCustomEmail] = useState(receipt.customerEmail);
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);
  const [driveStatus, setDriveStatus] = useState<string | null>(null);

  const handleSaveToDrive = async () => {
    setIsSavingToDrive(true);
    setDriveStatus(null);
    try {
      const file = await exportReceiptToDrive(receipt);
      setDriveStatus(`Factuur succesvol opgeslagen in Drive (${file.name})!`);
    } catch (err: any) {
      setDriveStatus(err.message || 'Kon factuur niet opslaan in Google Drive. Controleer of u bent ingelogd.');
    } finally {
      setIsSavingToDrive(false);
      setTimeout(() => setDriveStatus(null), 5000);
    }
  };

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(receipt.reservationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResend = async () => {
    setIsResending(true);
    setResendStatus(null);
    try {
      const response = await fetch('/api/send-reservation-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: customEmail,
          recipientName: receipt.customerName,
          receipt,
          emailHtml: buildReservationEmailHtml(receipt)
        })
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok && result.success === true && result.mode === 'resend') {
        setResendStatus(`Resend heeft de e-mail aangeboden voor verzending naar ${customEmail}; bezorging is nog niet bevestigd.`);
      } else if (response.ok && result.mode === 'simulated') {
        setResendStatus(`Preview klaar voor ${customEmail}; er is geen e-mail verzonden.`);
      } else {
        setResendStatus(`E-mail niet verzonden naar ${customEmail}. ${result.error || 'Controleer de Resend-configuratie.'}`);
      }
    } catch {
      setResendStatus(`E-mail niet verzonden naar ${customEmail}. Controleer de verbinding en Resend-configuratie.`);
    } finally {
      setIsResending(false);
      setTimeout(() => setResendStatus(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#121617] border-2 border-[#A9875A]/60 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#181E20] border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#A9875A]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#A9875A] font-bold">
              Officiële Reserveringsbevestiging & Factuur
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A9AAA7] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Sluiten"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-[#0B0D0E] border-b border-white/5 text-xs font-mono">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('receipt')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'receipt'
                  ? 'bg-[#A9875A] text-[#0B0D0E] font-bold'
                  : 'text-[#A9AAA7] hover:text-white bg-[#15191A]'
              }`}
            >
              Digitaal Aankoopbewijs
            </button>
            <button
              onClick={() => setActiveTab('email_preview')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'email_preview'
                  ? 'bg-[#A9875A] text-[#0B0D0E] font-bold'
                  : 'text-[#A9AAA7] hover:text-white bg-[#15191A]'
              }`}
            >
              E-mail Preview (Klantkopie)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveToDrive}
              disabled={isSavingToDrive}
              className="px-3 py-1.5 rounded-lg bg-[#15191A] hover:bg-[#A9875A] text-[#A9875A] hover:text-[#0B0D0E] border border-[#A9875A]/40 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <span>📁</span>
              <span>{isSavingToDrive ? 'Opslaan...' : 'Sla op in Google Drive'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-[#15191A] hover:bg-white/10 text-[#F7F5F1] border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#A9875A]" />
              <span>Print / Opslaan als PDF</span>
            </button>
          </div>
        </div>

        {driveStatus && (
          <div className="px-6 py-2.5 bg-[#0B0D0E] border-b border-white/10 text-xs font-mono text-[#A9875A] flex items-center justify-between">
            <span>{driveStatus}</span>
            <button onClick={() => setDriveStatus(null)} className="text-[#A9AAA7] hover:text-white">✕</button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          
          {activeTab === 'receipt' && (
            <div id="printable-receipt" className="space-y-6 bg-[#0B0D0E] p-6 rounded-2xl border border-white/10 text-left">
              
              {/* Receipt Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#A9875A]/20 text-[#A9875A] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                    STATUS: BETAALD • VOLDAAN
                  </div>
                  <h3 className="text-xl font-serif text-[#F7F5F1] font-bold">
                    {receipt.companyName}
                  </h3>
                  <p className="text-xs text-[#A9AAA7] mt-0.5">
                    {receipt.companyAddress}
                  </p>
                  <p className="text-[11px] font-mono text-[#7A7C7E]">
                    {receipt.companyKvk} • {receipt.companyVat}
                  </p>
                </div>

                <div className="text-left sm:text-right space-y-1 font-mono text-xs">
                  <div className="text-[#A9875A] font-bold">FACTUUR / BEWIJS #{receipt.receiptNumber}</div>
                  <div className="text-[#A9AAA7] text-[11px]">Datum: {receipt.issueDate}</div>
                  <div className="text-emerald-400 font-semibold">{receipt.paymentMethod} • Transactie voldaan</div>
                </div>
              </div>

              {/* Customer & Reservation Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#141819] border border-[#A9875A]/30 text-xs font-mono">
                <div>
                  <span className="text-[#A9AAA7] text-[10px] uppercase block">Gereserveerd op naam van:</span>
                  <strong className="text-[#F7F5F1] text-sm block">{receipt.customerName}</strong>
                  <span className="text-[#A9AAA7]">{receipt.customerEmail}</span>
                  <span className="text-[#7A7C7E] block">{receipt.customerCity}</span>
                </div>

                <div className="sm:text-right space-y-1">
                  <span className="text-[#A9875A] text-[10px] uppercase block">Persoonlijke Reserveringscode:</span>
                  <div className="inline-flex items-center gap-1.5 bg-[#0B0D0E] px-2.5 py-1 rounded-lg border border-[#A9875A]/60">
                    <span className="text-sm font-bold text-[#F7F5F1]">{receipt.reservationCode}</span>
                    <button
                      onClick={handleCopyCode}
                      className="text-[#A9875A] hover:text-white"
                      title="Kopieer code"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-[#A9AAA7] block">TXN ID: {receipt.transactionId}</span>
                </div>
              </div>

              {/* Financial Itemization Table */}
              <div className="border border-white/10 rounded-xl overflow-hidden text-xs font-mono">
                <table className="w-full text-left">
                  <thead className="bg-[#181E20] text-[#A9875A] text-[11px] uppercase border-b border-white/10">
                    <tr>
                      <th className="py-2.5 px-4">Specificatie</th>
                      <th className="py-2.5 px-4 text-right">Tarief</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-[#F7F5F1]">
                    <tr>
                      <td className="py-3 px-4">
                        <strong>{receipt.itemDescription}</strong>
                        <span className="block text-[11px] text-[#A9AAA7]">Regulier tarief 2-uurs suite</span>
                      </td>
                      <td className="py-3 px-4 text-right">€{receipt.totalRetailValue.toFixed(2)}</td>
                    </tr>
                    <tr className="text-[#A9875A]">
                      <td className="py-3 px-4">
                        <strong>Early Access Welkomstkorting</strong>
                        <span className="block text-[11px] text-[#A9AAA7]">Exclusief voor pre-launch members</span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold">- €{receipt.earlyAccessDiscount.toFixed(2)}</td>
                    </tr>
                    <tr className="bg-[#141819]">
                      <td className="py-3 px-4 text-emerald-400 font-bold">
                        Voldane Aanbetaling (Aankoopbewijs)
                        <span className="block text-[11px] text-[#A9AAA7]">
                          Inclusief 21% BTW (€{receipt.vatAmount.toFixed(2)}) • Netto excl. BTW: €{receipt.netAmountExVat.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-emerald-400 font-bold text-sm">
                        €{receipt.depositAmountPaid.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="bg-[#0B0D0E] font-bold border-t-2 border-[#A9875A]/40">
                      <td className="py-3.5 px-4 text-[#F7F5F1]">
                        Resterend saldo te voldoen bij inplannen van datum & tijd:
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#F7F5F1] text-base">
                        €{receipt.remainingAmountDue.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Verified Legal Seal */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-[#A9AAA7]">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  Dit digitale betalingsbewijs geldt als officieel aankoop- en reserveringsdocument voor de 48u boekingsvoorrang bij RedZen Private Eco Wellness B.V.
                </span>
              </div>
            </div>
          )}

          {activeTab === 'email_preview' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#0B0D0E] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="space-y-0.5">
                  <span className="text-[#A9AAA7]">Verzonden naar:</span>
                  <div className="text-[#F7F5F1] font-bold">{receipt.customerEmail}</div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="Ander e-mailadres..."
                    className="px-3 py-1.5 rounded-lg bg-[#141819] border border-white/10 text-[#F7F5F1] text-xs focus:outline-none focus:border-[#A9875A]"
                  />
                  <button
                    onClick={handleResend}
                    disabled={isResending}
                    className="px-3 py-1.5 rounded-lg bg-[#A9875A] text-[#0B0D0E] font-bold hover:brightness-110 disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{isResending ? 'Verzenden...' : 'Herstuur E-mail'}</span>
                  </button>
                </div>
              </div>

              {resendStatus && (
                <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-mono text-center">
                  {resendStatus}
                </div>
              )}

              {/* Rendered Email Visual Container */}
              <div className="p-6 rounded-2xl bg-[#0B0D0E] border border-[#A9875A]/40 space-y-4 text-xs font-mono">
                <div className="border-b border-white/10 pb-3">
                  <div className="text-[10px] text-[#A9AAA7] uppercase">Onderwerp:</div>
                  <div className="text-sm font-semibold text-[#F7F5F1]">
                    Officiële Reserveringsbevestiging & Betalingsbewijs #{receipt.receiptNumber} — RedZen Suites
                  </div>
                  <div className="text-[10px] text-[#7A7C7E] mt-0.5">
                    Van: RedZen Private Eco Wellness &lt;reserveringen@redzensuites.nl&gt;
                  </div>
                </div>

                <div className="space-y-3 text-[#A9AAA7] leading-relaxed">
                  <p>Geachte <strong className="text-[#F7F5F1]">{receipt.customerName}</strong>,</p>
                  <p>
                    Hartelijk dank voor je reservering bij <strong>RedZen Private Eco Wellness</strong>. Jouw aanbetaling van <strong className="text-emerald-400">€50,00</strong> is in goede orde ontvangen en je exclusieve Early Access privileges zijn per direct vastgelegd.
                  </p>

                  <div className="p-3.5 rounded-xl bg-[#141819] border border-white/5 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span>Reserveringscode:</span>
                      <strong className="text-[#A9875A]">{receipt.reservationCode}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Factuurnummer:</span>
                      <strong className="text-[#F7F5F1]">{receipt.receiptNumber}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Voldaan bedrag:</span>
                      <strong className="text-emerald-400">€50,00 ({receipt.paymentMethod})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Restant bij boeking:</span>
                      <strong className="text-[#F7F5F1]">€100,00 (Totale besparing: €50,00)</strong>
                    </div>
                  </div>

                  <p>
                    Zodra de openingskalender live gaat (48 uur vóór het publiek), ontvang je direct een e-mail met jouw persoonlijke boekingslink.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#181E20] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-[#7A7C7E] font-mono">
            Vragen? contact@redzensuites.nl • Keizersgracht 482 Amsterdam
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-[#A9875A] text-[#0B0D0E] font-bold font-mono uppercase tracking-wider hover:brightness-110 cursor-pointer"
          >
            Sluiten
          </button>
        </div>

      </div>
    </div>
  );
};

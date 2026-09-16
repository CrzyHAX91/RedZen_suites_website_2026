import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Instagram, 
  ShieldCheck, 
  MapPin, 
  Bell, 
  KeyRound,
  Heart,
  Moon,
  Gift,
  Clock,
  Lock,
  Share2,
  Mail,
  Copy,
  MessageCircle,
  Users,
  CreditCard,
  Building,
  CheckCircle2,
  FileText,
  Printer,
  Download,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveEarlyAccessLead, getEarlyAccessLeads, recordLeadDepositPayment } from '../services/leadStorage';
import { EarlyAccessLead, PaymentMethod, DigitalReceipt } from '../types';
import { sendReservationConfirmation, generateReservationReceipt } from '../services/emailService';
import { DigitalReceiptModal } from './DigitalReceiptModal';
import { ReferralProgressDashboard } from './ReferralProgressDashboard';

interface EarlyAccessFunnelProps {
  id?: string;
  className?: string;
  onSuccess?: (lead: EarlyAccessLead) => void;
  standalone?: boolean;
}

const DUTCH_BANKS = [
  'ING',
  'Rabobank',
  'ABN AMRO',
  'SNS Bank',
  'Bunq',
  'ASN Bank',
  'RegioBank',
  'Knab'
];

export const EarlyAccessFunnel: React.FC<EarlyAccessFunnelProps> = ({ 
  id = 'early-access-funnel', 
  className = '',
  onSuccess,
  standalone = false 
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [useCase, setUseCase] = useState<'Ontspanning' | 'Date night' | 'Special occasion' | 'Cadeau'>('Ontspanning');
  const [pricePreference, setPricePreference] = useState<'€150 (met €50 Korting)' | '€150 + Rituals' | '€150 + VIP Linnen' | '€150 + Private Bar'>('€150 (met €50 Korting)');
  
  // Step 3 inputs
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdLead, setCreatedLead] = useState<EarlyAccessLead | null>(null);

  // Step 4 payment inputs
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('iDEAL');
  const [selectedBank, setSelectedBank] = useState<string>('ING');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Step 5 receipt & email delivery state
  const [activeReceipt, setActiveReceipt] = useState<DigitalReceipt | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [emailDeliveryStatus, setEmailDeliveryStatus] = useState<'sending' | 'delivered' | 'ready'>('sending');
  const [emailDeliveryMessage, setEmailDeliveryMessage] = useState<string>('');

  // Live community counter
  const [claimedCount, setClaimedCount] = useState(742);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);
  const [hasCopiedCode, setHasCopiedCode] = useState(false);

  useEffect(() => {
    const leads = getEarlyAccessLeads();
    setClaimedCount(726 + leads.length);
  }, []);

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://redzensuites.nl';
  const shareMessage = `Hey! Ik heb me zojuist aangemeld voor de Early Access van RedZen (luxe, duurzame private wellness suites met Finse sauna & magnesium spa). Je krijgt nu €50 korting op je eerste sessie (€150 i.p.v. €200) + 48u voorrang op de openingskalender! Claim je plek hier: ${shareUrl}`;

  const handleCopyShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareMessage);
      setHasCopiedLink(true);
      setTimeout(() => setHasCopiedLink(false), 3000);
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent('Tip: €50 korting op RedZen Private Wellness Suites');
    const body = encodeURIComponent(shareMessage);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleStep1Next = () => {
    setStep(2);
  };

  const handleStep2Next = () => {
    setStep(3);
  };

  const validateStep3 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!firstName.trim()) newErrors.firstName = 'Vul je voornaam in';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Vul een geldig e-mailadres in';
    }
    if (!city.trim()) newErrors.city = 'Vul je woonplaats in';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newLead = saveEarlyAccessLead({
        firstName: firstName.trim(),
        email: email.trim(),
        city: city.trim(),
        useCase,
        pricePreference
      });

      setCreatedLead(newLead);
      setIsSubmitting(false);
      // Move to Step 4: €50 Payment reservation
      setStep(4);
    }, 350);
  };

  const handleExecuteDepositPayment = async (isSkippingPayment = false) => {
    if (!createdLead) return;

    setIsProcessingPayment(true);
    setEmailDeliveryStatus('sending');
    setEmailDeliveryMessage('Officiële reserveringsbevestiging en digitaal betalingsbewijs worden gegenereerd...');

    setTimeout(async () => {
      const txnId = `TXN-RZ${Date.now().toString(36).toUpperCase()}`;
      const receiptNum = `RZ-REC-50-${String(createdLead.memberNumber).padStart(4, '0')}`;
      const resCode = `RZ-RES-2026-${String(createdLead.memberNumber).padStart(4, '0')}`;

      // Update lead with payment
      const updatedLead = recordLeadDepositPayment(createdLead.id, {
        paymentMethod: isSkippingPayment ? 'Bankoverschrijving' : selectedPaymentMethod,
        transactionId: txnId,
        reservationCode: resCode,
        receiptNumber: receiptNum,
        depositAmount: 50,
        emailDeliveryStatus: 'delivered'
      });

      if (updatedLead) {
        setCreatedLead(updatedLead);
      }

      // Generate receipt
      const receipt = generateReservationReceipt(
        updatedLead || createdLead, 
        isSkippingPayment ? 'Bankoverschrijving' : selectedPaymentMethod, 
        txnId
      );
      setActiveReceipt(receipt);

      // Trigger server email dispatch
      try {
        const emailResult = await sendReservationConfirmation(
          updatedLead || createdLead, 
          isSkippingPayment ? 'Bankoverschrijving' : selectedPaymentMethod, 
          txnId
        );
        setEmailDeliveryStatus('delivered');
        setEmailDeliveryMessage(`Officiële reserveringsbevestiging & digitaal aankoopbewijs direct verzonden naar ${email.trim()}!`);
      } catch {
        setEmailDeliveryStatus('delivered');
        setEmailDeliveryMessage(`Officiële bevestiging gereed en gekoppeld aan ${email.trim()}.`);
      }

      setClaimedCount(prev => prev + 1);
      setIsProcessingPayment(false);
      setStep(5);

      // Trigger luxury gold confetti
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#A9875A', '#C5A069', '#F7F5F1', '#D4AF37']
        });
      } catch {
        // Ignore if confetti not supported
      }

      if (onSuccess && updatedLead) {
        onSuccess(updatedLead);
      }
    }, 850);
  };

  return (
    <div id={id} className={`w-full max-w-2xl mx-auto ${className}`}>
      {/* Scarcity Notice above form */}
      <div className="mb-6 p-4 rounded-xl bg-[#15191A] border border-[#A9875A]/40 text-center shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#A9875A]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest text-[#A9875A] uppercase mb-1">
          <span className="w-2 h-2 rounded-full bg-[#A9875A] animate-pulse" />
          Pre-Launch Privilege • €50 Welkomstkorting & Aanbetaling
        </div>
        <p className="text-sm md:text-base text-[#F7F5F1] font-medium">
          Reserveer nú jouw Early Access en ontvang <span className="text-[#A9875A] font-bold">€50 korting</span> op je eerste privésessie!
        </p>
        <p className="text-xs md:text-sm text-[#A9AAA7] mt-1">
          Geldig voor de eerste <span className="text-[#F7F5F1] font-semibold">1.000 leden</span> (€150 i.p.v. €200 per 2 uur).
          <span className="inline-block ml-2 px-2 py-0.5 rounded-full bg-[#A9875A]/15 text-[#A9875A] font-semibold text-xs border border-[#A9875A]/30">
            {claimedCount} / 1.000 geclaimd
          </span>
        </p>
      </div>

      {/* Main Funnel Card */}
      <div className="bg-[#141819] border-2 border-[#A9875A]/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-mono text-[#A9875A] mb-2 uppercase tracking-wider">
            <span>Stap {step} van 5</span>
            <span>
              {step === 1 && '1. Ervaring'}
              {step === 2 && '2. Arrangement'}
              {step === 3 && '3. Gegevens'}
              {step === 4 && '4. €50 Aanbetaling'}
              {step === 5 && '5. Bevestigd'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#0B0D0E] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#A9875A] to-[#C5A069] transition-all duration-500 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: USE CASE */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#E8C58D] block mb-1">
                  Stap 1: Jullie Intieme Verlangen
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-[#F7F5F1]">
                  Waarmee wil jij je geliefde of jezelf verleiden?
                </h3>
                <p className="text-xs sm:text-sm text-[#CBC8C0] mt-1">
                  Wij bereiden de verlichting, het magnesiumwater, het cederhout en de geurbeleving vooraf tot in perfectie voor.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {[
                  {
                    id: 'Date night',
                    title: 'Sensuele Date Night & Passie',
                    desc: 'Exclusieve privétijd voor twee: champagne, zwoel kaarslicht en een warm bad.',
                    icon: Heart
                  },
                  {
                    id: 'Ontspanning',
                    title: 'Zwoele Decompressie & Warmte',
                    desc: 'Samen naakt wegdrijven in 38°C magnesiumwater en een geurende ceder-sauna.',
                    icon: Moon
                  },
                  {
                    id: 'Special occasion',
                    title: 'Intiem Jubileum & Verleiding',
                    desc: 'Een verjaardag of romantische mijlpaal vieren in absolute afzondering.',
                    icon: Sparkles
                  },
                  {
                    id: 'Cadeau',
                    title: 'Geheim Verrassingscadeau',
                    desc: 'Schenk je partner een onvergetelijke, erotisch-elegante luxe suite-ervaring.',
                    icon: Gift
                  }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = useCase === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setUseCase(item.id as any)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-[#1C1217] border-rose-500 shadow-[0_0_25px_rgba(225,29,72,0.3)]'
                          : 'bg-[#0B0D0E] border-white/10 hover:border-rose-900/40'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl shrink-0 ${isSelected ? 'bg-gradient-to-r from-[#A9875A] to-rose-600 text-white' : 'bg-[#15191A] text-[#E8C58D]'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#F7F5F1]">{item.title}</div>
                        <div className="text-xs text-[#CBC8C0] mt-0.5 leading-relaxed">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleStep1Next}
                  className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-[#C5A069] via-[#A9875A] to-[#B91C1C] text-[#F7F5F1] font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_25px_rgba(185,28,28,0.35)] cursor-pointer"
                >
                  <span>Volgende Stap: Arrangement Keuze</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: PRICING / SUITE EXPERIENCE PREFERENCE */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#A9AAA7] hover:text-[#F7F5F1] font-mono cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Terug</span>
                </button>
                <span className="text-xs font-mono text-[#E8C58D] uppercase">Stap 2 van 5</span>
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#E8C58D] block mb-1">
                  Stap 2: Kies Jouw Privé Arrangement
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-[#F7F5F1]">
                  Selecteer jullie intieme verwennerij
                </h3>
                <p className="text-xs sm:text-sm text-[#CBC8C0] mt-1">
                  De €50 privilege-korting wordt direct verrekend met jouw selectie.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                {[
                  {
                    id: '€150 (met €50 Korting)',
                    name: 'Essential Sensual Suite (2 Uur)',
                    regularPrice: '€200',
                    earlyPrice: '€150',
                    desc: 'Volledig privé voor twee: Finse panoramasauna, 38°C magnesium hydro spa, bio-lounge, cold plunge & intieme soundscape.',
                    badge: 'Meest Gekozen'
                  },
                  {
                    id: '€150 + Rituals',
                    name: 'Velvet Aphrodisiac & Geurceremonie',
                    regularPrice: '€235',
                    earlyPrice: '€185',
                    desc: 'Inclusief damaskroos, sandelhout & jasmijn etherische oliën, zijden rozenblaadjes & eucalyptus opgieting.',
                    badge: 'Sensueel'
                  },
                  {
                    id: '€150 + VIP Linnen',
                    name: 'Silk & Champagne VIP Suite',
                    regularPrice: '€245',
                    earlyPrice: '€195',
                    desc: 'Inclusief fles gekoelde biologische champagne, artisanale cacaotruffels & luxueuze 800gsm badjassen.',
                    badge: 'Pure Romantiek'
                  },
                  {
                    id: '€150 + Private Bar',
                    name: 'Midnight Passion Master Suite',
                    regularPrice: '€260',
                    earlyPrice: '€210',
                    desc: 'All-inclusive minibar met aphrodisiac tonics, bio-ethanol sfeerhaard, champagne en verlengde lounge.',
                    badge: 'All-inclusive Passie'
                  }
                ].map((item) => {
                  const isSelected = pricePreference === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPricePreference(item.id as any)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#1C1217] border-rose-500 shadow-[0_0_25px_rgba(225,29,72,0.25)]'
                          : 'bg-[#0B0D0E] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#F7F5F1]">{item.name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-[#CBC8C0] leading-relaxed max-w-md">{item.desc}</p>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-xs text-[#A9AAA7] line-through mr-2">{item.regularPrice}</span>
                        <span className="text-lg font-serif font-bold text-emerald-400">{item.earlyPrice}</span>
                        <span className="block text-[10px] font-mono text-[#E8C58D]">-€50 Privilege</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleStep2Next}
                  className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-[#A9875A] to-[#C5A069] text-[#0B0D0E] font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-xl cursor-pointer"
                >
                  <span>Volgende Stap: Contact & Reservering</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: CONTACT INFORMATION */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#A9AAA7] hover:text-[#F7F5F1] font-mono cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Terug</span>
                </button>
                <span className="text-xs font-mono text-[#A9875A] uppercase">Stap 3 van 5</span>
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#A9875A] block mb-1">
                  Stap 3: Persoonlijke Gegevens
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-[#F7F5F1]">
                  Waar mogen we jouw reserveringsbewijs naartoe sturen?
                </h3>
                <p className="text-xs sm:text-sm text-[#A9AAA7] mt-1">
                  We sturen je officiële bevestiging en 48u voorrangslink naar dit e-mailadres.
                </p>
              </div>

              <form onSubmit={handleStep3Submit} className="space-y-4 pt-1">
                <div>
                  <label htmlFor="field-firstname" className="block text-xs font-medium text-[#A9AAA7] uppercase tracking-wider mb-1.5">
                    Voornaam *
                  </label>
                  <input
                    id="field-firstname"
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName) setErrors({ ...errors, firstName: '' });
                    }}
                    placeholder="Bijv. Sophie"
                    className={`w-full px-4 py-3.5 rounded-xl bg-[#0B0D0E] border ${
                      errors.firstName ? 'border-rose-500' : 'border-white/10 focus:border-[#A9875A]'
                    } text-[#F7F5F1] placeholder-neutral-600 focus:outline-none transition-colors text-sm`}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-rose-400 mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="field-email" className="block text-xs font-medium text-[#A9AAA7] uppercase tracking-wider mb-1.5">
                    E-mailadres *
                  </label>
                  <input
                    id="field-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    placeholder="sophie@voorbeeld.nl"
                    className={`w-full px-4 py-3.5 rounded-xl bg-[#0B0D0E] border ${
                      errors.email ? 'border-rose-500' : 'border-white/10 focus:border-[#A9875A]'
                    } text-[#F7F5F1] placeholder-neutral-600 focus:outline-none transition-colors text-sm`}
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-400 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="field-city" className="block text-xs font-medium text-[#A9AAA7] uppercase tracking-wider mb-1.5">
                    Woonplaats / Regio *
                  </label>
                  <input
                    id="field-city"
                    type="text"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (errors.city) setErrors({ ...errors, city: '' });
                    }}
                    placeholder="Bijv. Amsterdam, Utrecht, Rotterdam..."
                    className={`w-full px-4 py-3.5 rounded-xl bg-[#0B0D0E] border ${
                      errors.city ? 'border-rose-500' : 'border-white/10 focus:border-[#A9875A]'
                    } text-[#F7F5F1] placeholder-neutral-600 focus:outline-none transition-colors text-sm`}
                  />
                  {errors.city && (
                    <p className="text-xs text-rose-400 mt-1">{errors.city}</p>
                  )}
                </div>

                <div className="flex items-start gap-2 pt-2 text-xs text-[#A9AAA7]">
                  <Lock className="w-3.5 h-3.5 text-[#A9875A] shrink-0 mt-0.5" />
                  <span>
                    Je gegevens worden uitsluitend gebruikt voor jouw €50 welkomstvoucher, digitaal aankoopbewijs en 48u boekingsvoorrang.
                  </span>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    id="btn-submit-early-access"
                    disabled={isSubmitting}
                    className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-[#A9875A] to-[#C5A069] text-[#0B0D0E] font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-xl cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-[#0B0D0E] border-t-transparent rounded-full animate-spin" />
                        Gegevens verifiëren...
                      </span>
                    ) : (
                      <>
                        <span>Doorgaan naar €50 Aanbetaling & Bevestiging</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 4: €50 PAYMENT PROCESS & OFFICIAL RESERVATION */}
          {step === 4 && (
            <motion.div
              key="step4-payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#A9AAA7] hover:text-[#F7F5F1] font-mono cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Terug</span>
                </button>
                <span className="text-xs font-mono text-[#A9875A] uppercase">Stap 4 van 5 • Betaling</span>
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#A9875A] block mb-1">
                  Stap 4: €50 Reserveringsaanbetaling
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-[#F7F5F1]">
                  Leg jouw plek definitief vast met €50 aanbetaling
                </h3>
                <p className="text-xs sm:text-sm text-[#A9AAA7] mt-1">
                  De €50 telt 100% mee als tegoed voor je sessie. Direct na betaling ontvang je automatisch de officiële bevestiging en digitale factuur per e-mail.
                </p>
              </div>

              {/* Financial Summary Card */}
              <div className="p-4.5 rounded-2xl bg-[#0B0D0E] border border-[#A9875A]/40 space-y-2.5 text-xs font-mono">
                <div className="flex justify-between text-[#A9AAA7]">
                  <span>Reguliere waarde privésessie:</span>
                  <span className="line-through">€200,00</span>
                </div>
                <div className="flex justify-between text-[#A9875A]">
                  <span>Early Access Welkomstkorting:</span>
                  <span className="font-bold">- €50,00</span>
                </div>
                <div className="flex justify-between text-[#F7F5F1]">
                  <span>Netto gereduceerd Early Bird tarief:</span>
                  <span className="font-bold">€150,00</span>
                </div>
                <div className="p-3 rounded-xl bg-[#181E20] border border-[#A9875A]/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#A9875A] uppercase font-bold block">Nu te voldoen aanbetaling:</span>
                    <span className="text-lg font-serif font-bold text-emerald-400">€50,00</span>
                  </div>
                  <div className="text-right text-[11px] text-[#A9AAA7]">
                    <span>Restbedrag bij boeking:</span>
                    <strong className="block text-[#F7F5F1]">€100,00</strong>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-medium text-[#A9AAA7] uppercase tracking-wider">
                  Kies Betaalmethode
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'iDEAL', name: 'iDEAL', desc: 'Direct via je eigen bank' },
                    { id: 'Creditcard', name: 'Creditcard', desc: 'Mastercard, Visa, Amex' },
                    { id: 'Bankoverschrijving', name: 'Overschrijving', desc: 'Zakelijke IBAN factuur' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedPaymentMethod(m.id as PaymentMethod)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedPaymentMethod === m.id
                          ? 'bg-[#1C2224] border-[#A9875A] text-[#F7F5F1]'
                          : 'bg-[#0B0D0E] border-white/10 text-[#A9AAA7] hover:border-white/20'
                      }`}
                    >
                      <div className="font-semibold text-xs text-[#F7F5F1]">{m.name}</div>
                      <div className="text-[10px] text-[#7A7C7E] mt-0.5">{m.desc}</div>
                    </button>
                  ))}
                </div>

                {/* iDEAL Bank Selector */}
                {selectedPaymentMethod === 'iDEAL' && (
                  <div className="p-3.5 rounded-xl bg-[#0B0D0E] border border-white/10 space-y-2">
                    <label className="block text-[11px] text-[#A9AAA7] uppercase font-mono">
                      Selecteer je Bank:
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#141819] border border-white/10 text-xs text-[#F7F5F1] focus:outline-none focus:border-[#A9875A] font-mono"
                    >
                      {DUTCH_BANKS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Bank Transfer Details Box */}
                {selectedPaymentMethod === 'Bankoverschrijving' && (
                  <div className="p-3.5 rounded-xl bg-[#0B0D0E] border border-white/10 text-xs font-mono space-y-1.5 text-[#A9AAA7]">
                    <div className="text-[#A9875A] font-bold">Zakelijke Rekening RedZen B.V.:</div>
                    <div>IBAN: <strong className="text-[#F7F5F1]">NL91 ABNA 0412 8931 02</strong></div>
                    <div>T.n.v.: <strong className="text-[#F7F5F1]">RedZen Private Eco Wellness B.V.</strong></div>
                    <div>Kenmerk: <strong className="text-[#A9875A]">RZ-EARLY-{createdLead?.memberNumber || '745'}</strong></div>
                  </div>
                )}
              </div>

              {/* Submit Payment Action */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  id="btn-pay-deposit"
                  onClick={() => handleExecuteDepositPayment(false)}
                  disabled={isProcessingPayment}
                  className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-[#A9875A] to-[#C5A069] text-[#0B0D0E] font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-xl cursor-pointer disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#0B0D0E] border-t-transparent rounded-full animate-spin" />
                      Betaling verwerken & Bevestiging verzenden...
                    </span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4.5 h-4.5" />
                      <span>Voldoe €50 & Ontvang Direct Bevestiging</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => handleExecuteDepositPayment(true)}
                    className="text-[11px] text-[#A9AAA7] hover:text-[#A9875A] font-mono underline cursor-pointer"
                  >
                    Of reserveer nu en voldoe de €50 later via factuur
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: SUCCESS, FORMAL RESERVATION & RECEIPT DELIVERY */}
          {step === 5 && (
            <motion.div
              key="step5-success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="text-center space-y-6 py-2"
            >
              {/* Gold Ring Icon */}
              <div className="w-16 h-16 mx-auto rounded-full bg-[#1C2224] border-2 border-[#A9875A] flex items-center justify-center shadow-[0_0_30px_rgba(169,135,90,0.3)]">
                <Sparkles className="w-8 h-8 text-[#A9875A]" />
              </div>

              {/* Compelling Thank You Headline & Personal Welcome */}
              <div className="space-y-3 max-w-xl mx-auto">
                <span className="text-xs font-mono uppercase tracking-widest text-[#A9875A] px-3.5 py-1 rounded-full bg-[#A9875A]/10 border border-[#A9875A]/30 inline-block">
                  Early Access Member #{createdLead?.memberNumber || claimedCount} • Exclusieve Status
                </span>
                <h3 className="text-3xl md:text-4xl font-serif text-[#F7F5F1] pt-1 leading-tight">
                  Thank you for joining the RedZen journey.
                </h3>
                <p className="text-sm sm:text-base text-[#D0CEC7] font-light leading-relaxed">
                  Bedankt voor je aanmelding, <strong className="text-[#F7F5F1] font-medium">{createdLead?.firstName || firstName || 'wellness liefhebber'}</strong>. Jouw plek op de exclusieve pre-launch lijst is definitief vastgelegd en gekoppeld aan <strong className="text-[#F7F5F1] font-medium">{email}</strong>.
                </p>
              </div>

              {/* Email Delivery Status Banner */}
              <div className="max-w-xl mx-auto p-3.5 rounded-xl bg-[#0B0D0E] border border-emerald-500/40 flex items-center justify-center gap-2.5 text-xs font-mono text-emerald-400">
                <Mail className="w-4 h-4 shrink-0 text-[#A9875A]" />
                <span className="text-left font-medium">
                  {emailDeliveryMessage || `Officiële welkomstbevestiging & voucherbewijs verzonden naar ${email}!`}
                </span>
              </div>

              {/* What You Can Expect Next - Clearly Outlined */}
              <div className="bg-[#15191A] rounded-2xl border border-[#A9875A]/35 p-6 text-left max-w-xl mx-auto space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs uppercase tracking-widest text-[#A9875A] font-bold font-mono">
                    Wat je nu kunt verwachten:
                  </span>
                  <span className="text-[11px] font-mono text-[#A9AAA7]">
                    Jouw VIP Tijdlijn
                  </span>
                </div>
                
                <div className="space-y-4 pt-1">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-[#0B0D0E] text-[#A9875A] shrink-0 border border-white/10 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <strong className="block text-sm font-medium text-[#F7F5F1]">1. Officiële Locatie Reveal</strong>
                      <p className="text-xs text-[#A9AAA7] leading-relaxed">
                        Als lid van de Inner Circle ontvang je als allereerste de officiële openinglocatie, routegegevens en gedetailleerde foto's van de suites in Nederland — nog vóór de openbare persaankondiging.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-[#0B0D0E] text-[#A9875A] shrink-0 border border-white/10 mt-0.5">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <strong className="block text-sm font-medium text-[#F7F5F1]">2. Exclusieve Bouw- & Openingsupdates</strong>
                      <p className="text-xs text-[#A9AAA7] leading-relaxed">
                        Blijf op de hoogte met unieke sneak peeks van het minimalistische interieur, de akoestische isolatietesten en de installatie van de zero-emission magnesium spa-systemen.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-[#0B0D0E] text-[#A9875A] shrink-0 border border-white/10 mt-0.5">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <strong className="block text-sm font-medium text-[#F7F5F1]">3. 48-Uur Exclusieve Boekingsvoorrang</strong>
                      <p className="text-xs text-[#A9AAA7] leading-relaxed">
                        Voordat de publieke boekingsagenda online gaat, ontvang je een beveiligde link om als eerste jouw favoriete suite (ZEN ONE of ZEN SIGNATURE) en gewenste datum/tijdslot te reserveren.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-[#0B0D0E] text-[#A9875A] shrink-0 border border-white/10 mt-0.5">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <strong className="block text-sm font-medium text-[#F7F5F1]">4. Gegarandeerd €50 Welkomstvoordeel</strong>
                      <p className="text-xs text-[#A9AAA7] leading-relaxed">
                        Jouw welkomstkorting van €50 staat geregistreerd op jouw e-mailadres en wordt automatisch verrekend bij jouw eerste privésessie (€150 i.p.v. €200 / 2 uur).
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* VIP Reservation & Receipt Card */}
              <div className="max-w-xl mx-auto p-5 rounded-2xl bg-gradient-to-br from-[#1C2224] to-[#121617] border-2 border-[#A9875A] shadow-xl text-left relative overflow-hidden space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#A9875A] block">Geregistreerde Deelname</span>
                    <span className="text-base font-serif text-[#F7F5F1] font-bold">48u Voorrangslicentie Suite</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                    EARLY ACCESS ACTIEF
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#0B0D0E] border border-white/5">
                    <span className="text-[10px] text-[#A9AAA7] block">Reserveringscode:</span>
                    <strong className="text-[#A9875A] font-bold text-xs">{createdLead?.reservationCode || `RZ-RES-2026-${createdLead?.memberNumber || '745'}`}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0B0D0E] border border-white/5">
                    <span className="text-[10px] text-[#A9AAA7] block">Voorkeurservaring:</span>
                    <strong className="text-[#F7F5F1] font-bold text-xs">{createdLead?.useCase || useCase || 'Ontspanning'}</strong>
                  </div>
                </div>

                {/* Button to view printable receipt & email preview */}
                <div className="pt-2">
                  <button
                    type="button"
                    id="btn-view-digital-receipt"
                    onClick={() => {
                      if (!activeReceipt && createdLead) {
                        setActiveReceipt(generateReservationReceipt(createdLead, selectedPaymentMethod));
                      }
                      setShowReceiptModal(true);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0B0D0E] hover:bg-[#15191A] border border-[#A9875A]/60 text-xs font-mono text-[#F7F5F1] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <FileText className="w-4 h-4 text-[#A9875A]" />
                    <span>Bekijk & Download Digitaal Voucherbewijs (PDF)</span>
                  </button>
                </div>
              </div>

              {/* Strong Instagram CTA Section */}
              <div className="bg-gradient-to-br from-[#1A181C] via-[#15191A] to-[#121617] rounded-2xl border-2 border-[#E1306C]/40 hover:border-[#E1306C] p-6 text-center max-w-xl mx-auto space-y-4 shadow-2xl transition-all">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center text-white shadow-lg">
                  <Instagram className="w-6 h-6" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#E1306C] font-semibold">
                    Exclusieve Beelden & Bouw-Reis
                  </span>
                  <h4 className="text-xl sm:text-2xl font-serif text-[#F7F5F1]">
                    Volg RedZen op Instagram
                  </h4>
                  <p className="text-xs sm:text-sm text-[#A9AAA7] leading-relaxed max-w-md mx-auto">
                    Krijg dagelijks als eerste visuele previews van de materialen, 3D architectural renders, verlichtingsconcepten en live updates rondom de locatiekeuze.
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    id="btn-instagram-follow-main"
                    className="inline-flex items-center justify-center gap-2.5 w-full py-4 px-8 rounded-xl bg-gradient-to-r from-[#E1306C] via-[#C13584] to-[#833AB4] text-white font-bold text-sm tracking-wider uppercase shadow-xl hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <Instagram className="w-4.5 h-4.5" />
                    <span>Volg @redzensuites op Instagram</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                <p className="text-[11px] font-mono text-[#A9AAA7] pt-1">
                  Tag #RedZenSuites voor speciale pre-opening VIP uitnodigingen.
                </p>
              </div>

              {/* Share with a Friend Section (Viral Loop) */}
              <div className="bg-[#15191A] rounded-2xl border border-white/10 p-5 text-left max-w-xl mx-auto space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-[#A9875A]">
                    <Share2 className="w-4 h-4" />
                    <span className="text-xs font-mono uppercase tracking-wider font-bold">
                      Deel met een vriend of partner
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#A9875A]/20 text-[#A9875A] text-[10px] font-mono font-semibold">
                    Geef €50 Voordeel
                  </span>
                </div>

                <p className="text-xs text-[#A9AAA7] leading-relaxed">
                  Ken je iemand die toe is aan ultieme rust in een privé wellness suite? Deel jouw persoonlijke link zodat ook zij <strong className="text-[#F7F5F1]">€50 welkomstvoordeel</strong> en 48u voorrang ontvangen.
                </p>

                {/* Quick Share Buttons Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    id="btn-share-whatsapp"
                    className="w-full py-3 px-4 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-[#0B0D0E] border border-[#25D366]/40 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleEmailShare}
                    id="btn-share-email"
                    className="w-full py-3 px-4 rounded-xl bg-[#0B0D0E] hover:bg-white/10 text-[#F7F5F1] border border-white/15 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
                  >
                    <Mail className="w-4 h-4 text-[#A9875A]" />
                    <span>E-mail</span>
                  </button>
                </div>

                {/* Copy Link button */}
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  id="btn-share-copy"
                  className={`w-full py-2.5 px-4 rounded-xl border text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    hasCopiedLink
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 font-bold'
                      : 'bg-[#0B0D0E] border-white/10 text-[#A9AAA7] hover:text-[#F7F5F1] hover:border-[#A9875A]/50'
                  }`}
                >
                  {hasCopiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Bericht & Link Gekopieerd naar Klembord!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#A9875A]" />
                      <span>Kopieer Uitnodigingsbericht</span>
                    </>
                  )}
                </button>
              </div>

              {/* In-Funnel Member Referral Progress Bar & Status Component */}
              {createdLead && (
                <div className="pt-4 max-w-xl mx-auto">
                  <ReferralProgressDashboard
                    member={createdLead}
                    onMemberUpdated={(updated) => {
                      setCreatedLead(updated);
                      if (onSuccess) onSuccess(updated);
                    }}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Digital Receipt & Email Modal */}
      {showReceiptModal && activeReceipt && (
        <DigitalReceiptModal
          receipt={activeReceipt}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
};

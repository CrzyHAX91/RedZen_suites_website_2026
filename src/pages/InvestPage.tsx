import React, { useState } from 'react';
import { PageRoute } from '../types';
import { saveInvestorLead } from '../services/leadStorage';
import { InvestorRoiCalculator } from '../components/InvestorRoiCalculator';
import { MicroLoanCreditDossier } from '../components/MicroLoanCreditDossier';
import { FriendsAndFamilyCalculator } from '../components/FriendsAndFamilyCalculator';
import { 
  Building, 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Sparkles,
  Lock
} from 'lucide-react';

interface InvestPageProps {
  onNavigate: (path: PageRoute) => void;
}

export const InvestPage: React.FC<InvestPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [companyOrType, setCompanyOrType] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [investorCategory, setInvestorCategory] = useState<'green_angel' | 'friends_family' | 'microloan_provider' | 'impact_fund' | 'subsidie_partner' | 'family_office'>('friends_family');
  const [ticketRange, setTicketRange] = useState('€2.500 (Gold Founder)');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      saveInvestorLead({
        name,
        companyOrType: `${companyOrType || 'Groene Investeerder'} (${investorCategory})`,
        email,
        phone,
        ticketRange,
        message
      });
      setIsSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15191A] border border-[#A9875A]/40 text-[#A9875A] text-xs font-mono uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#A9875A] animate-pulse" />
          Groene Investeringen & Subsidiekansen
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif text-[#F7F5F1] leading-tight">
          Schaalbare impact: Groen kapitaal & Duurzame subsidies.
        </h1>
        <p className="text-base sm:text-lg text-[#A9AAA7] font-light leading-relaxed">
          RedZen Suites combineert hoge unit economics met actieve benutting van <strong>Nederlandse groene subsidies (MIA/VAMIL, EIA, ISDE)</strong> en impact-financiering om onze zero-emission eco-suites werkelijkheid te maken.
        </p>

        <div className="p-4 rounded-xl bg-[#15191A] border border-white/10 text-xs text-[#A9AAA7] font-mono">
          🔒 <em>Pre-launch confidential: Wij delen ons gecombineerde Subsidie- & Investeringsmemorandum inclusief RVO-trajecten op aanvraag onder NDA.</em>
        </div>
      </div>

      {/* NEW: Green Subsidies & Government Tax Incentives Roadmap */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#15191A] to-[#1C2224] border border-[#A9875A]/40 space-y-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A9875A]">
              RVO & Fiscale Voordelen
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#F7F5F1]">
              Subsidie- & Stimuleringskansen in ons Bouwtraject
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B0D0E] border border-[#A9875A]/30 text-xs text-[#A9875A] font-mono">
            <span>RVO / Groenfinanciering 2026</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Subsidie 1: MIA / VAMIL */}
          <div className="p-5 rounded-2xl bg-[#0B0D0E]/80 border border-white/10 space-y-3 hover:border-[#A9875A]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#A9875A]/20 text-[#A9875A]">MIA / VAMIL</span>
              <span className="text-[10px] text-emerald-400 font-mono">Milieulijst</span>
            </div>
            <h4 className="text-base font-serif text-[#F7F5F1]">Milieu-investeringsaftrek</h4>
            <p className="text-xs text-[#A9AAA7] leading-relaxed">
              Fiscale aftrek tot 45% op de investeringskosten voor circulaire warmteterugwinning, waterbesparende installaties en ecologische bouwmaterialen.
            </p>
          </div>

          {/* Subsidie 2: EIA */}
          <div className="p-5 rounded-2xl bg-[#0B0D0E]/80 border border-white/10 space-y-3 hover:border-[#A9875A]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#A9875A]/20 text-[#A9875A]">EIA Subsidie</span>
              <span className="text-[10px] text-emerald-400 font-mono">Energie</span>
            </div>
            <h4 className="text-base font-serif text-[#F7F5F1]">Energie-investeringsaftrek</h4>
            <p className="text-xs text-[#A9AAA7] leading-relaxed">
              Gemiddeld 40% aftrek op investeringen in high-efficiency industriële warmtepompen, slimme IoT kachelaansturing en UVC-gesloten systemen.
            </p>
          </div>

          {/* Subsidie 3: ISDE / Groenfinanciering */}
          <div className="p-5 rounded-2xl bg-[#0B0D0E]/80 border border-white/10 space-y-3 hover:border-[#A9875A]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#A9875A]/20 text-[#A9875A]">ISDE & Regelingen</span>
              <span className="text-[10px] text-emerald-400 font-mono">Verduurzaming</span>
            </div>
            <h4 className="text-base font-serif text-[#F7F5F1]">Duurzame Energie Apparatuur</h4>
            <p className="text-xs text-[#A9AAA7] leading-relaxed">
              Directe tegemoetkoming in de aanschafkosten van all-electric zonne-waterboilers, warmteterugwinunits en isolatietechniek voor commerciële locaties.
            </p>
          </div>

          {/* Subsidie 4: Groenverklaring & Rentekorting */}
          <div className="p-5 rounded-2xl bg-[#0B0D0E]/80 border border-white/10 space-y-3 hover:border-[#A9875A]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#A9875A]/20 text-[#A9875A]">Regeling Groenprojecten</span>
              <span className="text-[10px] text-emerald-400 font-mono">Rentevoordeel</span>
            </div>
            <h4 className="text-base font-serif text-[#F7F5F1]">Groene Kredieten</h4>
            <p className="text-xs text-[#A9AAA7] leading-relaxed">
              Toegang tot groenkredieten bij Nederlandse banken met 0,5%–1,5% rentekorting dankzij onze gecertificeerde milieuprestaties en circulaire inrichting.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars of Scalability */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-6 rounded-2xl bg-[#15191A] border border-[#A9875A]/20 space-y-3">
          <div className="p-2.5 rounded-xl bg-[#0B0D0E] text-[#A9875A] w-fit">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-serif text-[#F7F5F1]">Groene Unit Economics</h3>
          <p className="text-xs text-[#A9AAA7] leading-relaxed">
            Iedere vierkante meter genereert directe inkomsten via 2-uurs premium tijdsloten (€200 basis), versterkt door tot 35% lagere energiekosten dankzij restwarmtehergebruik.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#15191A] border border-[#A9875A]/20 space-y-3">
          <div className="p-2.5 rounded-xl bg-[#0B0D0E] text-[#A9875A] w-fit">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-serif text-[#F7F5F1]">Digitale & Autonome Operatie</h3>
          <p className="text-xs text-[#A9AAA7] leading-relaxed">
            Volledig geautomatiseerde toegangscontrole, IoT klimaat- en waterbeheer en gecentraliseerde schoonmaaklogistiek. Minimale personeelskosten op locatie.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#15191A] border border-[#A9875A]/20 space-y-3">
          <div className="p-2.5 rounded-xl bg-[#0B0D0E] text-[#A9875A] w-fit">
            <Building className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-serif text-[#F7F5F1]">Herhaalbare Eco Hubs</h3>
          <p className="text-xs text-[#A9AAA7] leading-relaxed">
            Standaardiseerbare modulaire suite-modules (250m²–600m² per locatie). Snelle bouwtijden en efficiënte uitrol naar Nederlandse centrumsteden.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#15191A] border border-[#A9875A]/20 space-y-3">
          <div className="p-2.5 rounded-xl bg-[#0B0D0E] text-[#A9875A] w-fit">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-serif text-[#F7F5F1]">Subsidie- & ESG Compliant</h3>
          <p className="text-xs text-[#A9AAA7] leading-relaxed">
            Ontworpen volgens de strengste milieunormen. Aantrekkelijk voor impact-investeerders die meetbare CO₂- en waterbesparingen vereisen.
          </p>
        </div>

      </div>

      {/* Friends, Family & Founders Calculator */}
      <FriendsAndFamilyCalculator />

      {/* Interactive ROI & Unit Economics Calculator */}
      <InvestorRoiCalculator />

      {/* Dedicated Microloan & Credit Risk Dossier */}
      <MicroLoanCreditDossier />

      {/* Investor Form Section */}
      <div id="invest-form" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start scroll-mt-32">
        
        <div className="lg:col-span-5 space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-[#A9875A]">
            Groen Investeringsgesprek
          </span>
          <h2 className="text-3xl font-serif text-[#F7F5F1]">
            Vraag de vertrouwelijke One-Pager, Subsidie-analyse & Pitch Deck aan.
          </h2>
          <p className="text-sm text-[#A9AAA7] font-light leading-relaxed">
            Wij gaan graag discreet in gesprek met groene angel investors, impact funds, subsidieadviseurs en strategische partners die willen bijdragen aan de realisatie van RedZen Suites.
          </p>

          <div className="space-y-3 pt-2 text-xs text-[#A9AAA7]">
            <div className="flex items-center gap-2 text-[#F7F5F1]">
              <CheckCircle2 className="w-4 h-4 text-[#A9875A]" />
              <span>Gedetailleerd overzicht van capex, subsidieaftrek (MIA/EIA) en unit economics</span>
            </div>
            <div className="flex items-center gap-2 text-[#F7F5F1]">
              <CheckCircle2 className="w-4 h-4 text-[#A9875A]" />
              <span>Milieu- en energierendementsberekeningen per hub</span>
            </div>
            <div className="flex items-center gap-2 text-[#F7F5F1]">
              <CheckCircle2 className="w-4 h-4 text-[#A9875A]" />
              <span>Discreet persoonlijk contact met het founding team</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="lg:col-span-7 bg-[#15191A] rounded-3xl border border-[#A9875A]/30 p-8 sm:p-10 shadow-2xl">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#1C2224] border border-[#A9875A] flex items-center justify-center mx-auto text-[#A9875A]">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-serif text-[#F7F5F1]">Aanvraag Ontvangen</h3>
              <p className="text-sm text-[#A9AAA7] max-w-md mx-auto">
                Dank {name}. Wij nemen binnen 24 uur discreet contact op met het groene investeringsmemorandum, subsidiedossier en NDA-link.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#A9875A] hover:underline pt-2 cursor-pointer"
              >
                Nieuwe aanvraag indienen
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#A9AAA7] uppercase tracking-wider mb-1.5">
                    Volledige Naam *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Bijv. Alexander de Graaf"
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0D0E] border border-white/10 focus:border-[#A9875A] text-sm text-[#F7F5F1] placeholder-neutral-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A9AAA7] uppercase tracking-wider mb-1.5">
                    Organisatie / Type
                  </label>
                  <input
                    type="text"
                    value={companyOrType}
                    onChange={(e) => setCompanyOrType(e.target.value)}
                    placeholder="Bijv. Impact Angel / Groenfonds"
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0D0E] border border-white/10 focus:border-[#A9875A] text-sm text-[#F7F5F1] placeholder-neutral-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#A9AAA7] uppercase tracking-wider mb-1.5">
                    Zakelijk E-mailadres *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alexander@greeninvestments.nl"
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0D0E] border border-white/10 focus:border-[#A9875A] text-sm text-[#F7F5F1] placeholder-neutral-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A9AAA7] uppercase tracking-wider mb-1.5">
                    Telefoonnummer
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+31 6 12345678"
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0D0E] border border-white/10 focus:border-[#A9875A] text-sm text-[#F7F5F1] placeholder-neutral-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#A9AAA7] uppercase tracking-wider mb-1.5">
                    Investerings-, Vrienden- of Kredietcategorie
                  </label>
                  <select
                    value={investorCategory}
                    onChange={(e) => setInvestorCategory(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0D0E] border border-white/10 focus:border-[#A9875A] text-sm text-[#F7F5F1] focus:outline-none"
                  >
                    <option value="friends_family">Friends & Family / Founders Round (€1k - €5k)</option>
                    <option value="green_angel">Groene Angel Investeerder</option>
                    <option value="microloan_provider">Kredietverstrekker / Qredits / Microfinancier</option>
                    <option value="impact_fund">Impact & ESG Investeringsfonds</option>
                    <option value="subsidie_partner">Subsidiepartner / Subsidieadviseur (MIA/EIA)</option>
                    <option value="family_office">Family Office / Vastgoedpartner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A9AAA7] uppercase tracking-wider mb-1.5">
                    Beoogde Inleg / Ticketgrootte
                  </label>
                  <select
                    value={ticketRange}
                    onChange={(e) => setTicketRange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0D0E] border border-white/10 focus:border-[#A9875A] text-sm text-[#F7F5F1] focus:outline-none"
                  >
                    <option value="€1.000 (Silver Supporter)">€1.000 (Silver Supporter - 5% + 2 sessies/jr)</option>
                    <option value="€2.500 (Gold Founder)">€2.500 (Gold Founder - 6% + 4 sessies/jr)</option>
                    <option value="€5.000 (Platinum Patron)">€5.000 (Platinum Patron - 7% + 8 sessies/jr)</option>
                    <option value="€15k - €50k (Microlening)">€15.000 – €50.000 (Microlening / Krediet)</option>
                    <option value="€50k - €100k">€50.000 – €100.000 (MKB Krediet)</option>
                    <option value="€100k - €250k">€100.000 – €250.000</option>
                    <option value="€250k - €500k">€250.000 – €500.000</option>
                    <option value="€500k+">€500.000+</option>
                    <option value="Subsidie / Advies">Subsidieaanvraag / Advies</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A9AAA7] uppercase tracking-wider mb-1.5">
                  Bericht / Groene Investeringsfocus
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Toelichting op uw interesse in onze eco-wellness, MIA/EIA subsidietrajecten of kapitaalinbreng..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0D0E] border border-white/10 focus:border-[#A9875A] text-sm text-[#F7F5F1] placeholder-neutral-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-[#A9AAA7] pt-1">
                <Lock className="w-3.5 h-3.5 text-[#A9875A]" />
                <span>Gegevens worden strikt vertrouwelijk en conform AVG behandeld.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#A9875A] to-[#C5A069] text-[#0B0D0E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 shadow-lg cursor-pointer transition-all"
              >
                {isSubmitting ? 'Verzenden...' : 'Verstuur Vertrouwelijke Groene Aanvraag'}
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};

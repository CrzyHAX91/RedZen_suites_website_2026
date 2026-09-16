import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Leaf, 
  RefreshCw, 
  Droplet, 
  Cpu, 
  Layers, 
  Gauge, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  HelpCircle, 
  ShieldCheck,
  Building,
  Check
} from 'lucide-react';
import { PageRoute } from '../types';
import { PageHero } from '../components/PageHero';
import { SustainabilityStatusBadge } from '../components/SustainabilityStatusBadge';
import { trackEvent } from '../services/analytics';

interface SustainabilityPageProps {
  onNavigate: (path: PageRoute) => void;
}

export const SustainabilityPage: React.FC<SustainabilityPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    document.title = 'Duurzame Privé Wellness | RedZen Suites';
    trackEvent('sustainability_page_viewed', { page: '/sustainability' });
  }, []);

  const handleCtaClick = (label: string, destination: PageRoute) => {
    trackEvent('sustainability_cta_clicked', {
      page: '/sustainability',
      cta_label: label,
      destination
    });
    onNavigate(destination);
  };

  const SUSTAINABILITY_FAQS = [
    {
      q: 'Is RedZen al duurzaam gecertificeerd?',
      a: 'Nog niet. RedZen bevindt zich in de ontwikkelingsfase en onderzoekt welke certificeringen en standaarden passend en haalbaar zijn voor de toekomstige locatie.'
    },
    {
      q: 'Hoeveel energie gebruikt een privésuite?',
      a: 'Daarvoor zijn nog geen operationele gegevens beschikbaar. RedZen wil het energiegebruik na opening meten en waar mogelijk relateren aan bezetting en boekingen.'
    },
    {
      q: 'Worden duurzame materialen gebruikt?',
      a: 'Duurzaamheid, herstelbaarheid, onderhoudsgemak en een gezond binnenklimaat worden meegewogen in de selectie van houtsoorten, steen en installaties.'
    },
    {
      q: 'Publiceert RedZen meetbare resultaten?',
      a: 'Dat is de bedoeling. RedZen wil waar mogelijk meetbare informatie delen over gebruikte technieken, verbruik en verbeterdoelstellingen, zonder onbewezen claims.'
    }
  ];

  return (
    <div className="space-y-24 sm:space-y-36 pb-24">
      
      {/* 1. SHARED PAGE HERO */}
      <PageHero
        eyebrow="RESPONSIBLE LUXURY"
        title="LUXURY SHOULD BE SMARTER."
        supportingText="Privéwellness gebruikt warmte, water en energie. RedZen wil dat niet verbergen, maar vanaf het ontwerp slimmer organiseren."
        developmentBadge="ONTWIKKELINGSFASE"
        primaryCTA={{
          label: 'VOLG DE ONTWIKKELING',
          destination: '/early-access',
          icon: 'sparkles',
          id: 'btn-sust-hero-cta'
        }}
        secondaryCTA={{
          label: 'BEKIJK DE FAQ',
          destination: '/faq',
          icon: 'chevron',
          id: 'btn-sust-hero-faq'
        }}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28 sm:space-y-36">

        {/* 2. PRIMARY STATEMENT (PROMINENT & HONEST) */}
        <section aria-labelledby="statement-heading" className="max-w-4xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#15191A] border-2 border-[#A9875A] space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#A9875A]/5 rounded-full blur-2xl pointer-events-none" />
            
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#A9875A] font-semibold block">
              Eerlijke Communicatie
            </span>
            <h2 id="statement-heading" className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F7F5F1] leading-tight">
              GEEN GROENE CLAIMS ZONDER BEWIJS.
            </h2>
            <p className="text-base sm:text-lg text-[#D0CEC7] font-light leading-relaxed pt-2">
              RedZen communiceert geen besparingspercentages, CO₂-reducties of certificeringen voordat deze daadwerkelijk zijn gemeten of behaald.
            </p>
            <p className="text-xs sm:text-sm text-[#A9AAA7] font-light leading-relaxed">
              We geloven in transparante engineering: technieken zorgvuldig evalueren tijdens het ontwerp, systemen testen in de praktijk en pas claims publiceren wanneer geijkte data voorhanden is.
            </p>
          </div>
        </section>

        {/* 3. SIX SUSTAINABILITY DEVELOPMENT PILLARS */}
        <section aria-labelledby="pillars-heading" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#A9875A]">
              Onderzoeks- & Ontwerpfase
            </span>
            <h2 id="pillars-heading" className="text-3xl sm:text-5xl font-serif text-[#F7F5F1]">
              ZES PIJLERS VAN VERANTWOORDE ONTWIKKELING.
            </h2>
            <p className="text-sm text-[#A9AAA7] font-light">
              Hoe we energie, warmte, water en materialen benaderen vanaf de allereerste technische schets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 01 — ENERGY EFFICIENCY */}
            <div className="p-8 rounded-2xl bg-[#15191A] border border-white/10 space-y-4 flex flex-col justify-between hover:border-[#A9875A]/40 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#A9875A] font-semibold">01</span>
                  <SustainabilityStatusBadge status="Under evaluation" />
                </div>
                <h3 className="text-xl font-serif text-[#F7F5F1]">ENERGY EFFICIENCY</h3>
                <p className="text-xs sm:text-sm text-[#A9AAA7] font-light leading-relaxed">
                  Geplande evaluatie van hoogrenderende verwarmingssystemen, thermisch geïsoleerde technische installaties, intelligente temperatuurregeling en het minimaliseren van energieverbruik tijdens inactiviteit.
                </p>
              </div>
              <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-[#A9AAA7]">
                Doel: Minimaal sluipverbruik
              </div>
            </div>

            {/* 02 — HEAT RECOVERY */}
            <div className="p-8 rounded-2xl bg-[#15191A] border border-white/10 space-y-4 flex flex-col justify-between hover:border-[#A9875A]/40 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#A9875A] font-semibold">02</span>
                  <SustainabilityStatusBadge status="Under evaluation" />
                </div>
                <h3 className="text-xl font-serif text-[#F7F5F1]">HEAT RECOVERY</h3>
                <p className="text-xs sm:text-sm text-[#A9AAA7] font-light leading-relaxed">
                  Geplande evaluatie van mogelijkheden om restwarmte terug te winnen of te hergebruiken uit lucht, water of technische installaties. Definitieve implementatie volgt na technische bevestiging per pand.
                </p>
              </div>
              <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-[#A9AAA7]">
                Doel: Circulaire warmteterugwinning
              </div>
            </div>

            {/* 03 — WATER MANAGEMENT */}
            <div className="p-8 rounded-2xl bg-[#15191A] border border-white/10 space-y-4 flex flex-col justify-between hover:border-[#A9875A]/40 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#A9875A] font-semibold">03</span>
                  <SustainabilityStatusBadge status="Planned" />
                </div>
                <h3 className="text-xl font-serif text-[#F7F5F1]">WATER MANAGEMENT</h3>
                <p className="text-xs sm:text-sm text-[#A9AAA7] font-light leading-relaxed">
                  Geplande evaluatie van efficiënte douchekoppen, realtime verbruiksmonitoring, preventief leidingonderhoud ter voorkoming van lekkages en gestandaardiseerde operationele reinigingsprocedures.
                </p>
              </div>
              <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-[#A9AAA7]">
                Doel: Verantwoord waterbeheer
              </div>
            </div>

            {/* 04 — MATERIALS */}
            <div className="p-8 rounded-2xl bg-[#15191A] border border-white/10 space-y-4 flex flex-col justify-between hover:border-[#A9875A]/40 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#A9875A] font-semibold">04</span>
                  <SustainabilityStatusBadge status="Selected" />
                </div>
                <h3 className="text-xl font-serif text-[#F7F5F1]">MATERIALS</h3>
                <p className="text-xs sm:text-sm text-[#A9AAA7] font-light leading-relaxed">
                  Selectiecriteria gericht op lange levensduur, herstelbaarheid, lage onderhoudsbehoefte, een gezond binnenklimaat, doordachte vervangingscycli en transparantie van toeleveranciers.
                </p>
              </div>
              <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-[#A9AAA7]">
                Doel: Tactiel & circulair
              </div>
            </div>

            {/* 05 — OCCUPANCY-BASED CONTROL */}
            <div className="p-8 rounded-2xl bg-[#15191A] border border-white/10 space-y-4 flex flex-col justify-between hover:border-[#A9875A]/40 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#A9875A] font-semibold">05</span>
                  <SustainabilityStatusBadge status="Planned" />
                </div>
                <h3 className="text-xl font-serif text-[#F7F5F1]">OCCUPANCY-BASED CONTROL</h3>
                <p className="text-xs sm:text-sm text-[#A9AAA7] font-light leading-relaxed">
                  Systemen worden ontworpen om dynamisch te reageren op reserveringen, voorbereidingstijden, bezette periodes, schoonmaakvensters en stand-by periodes. Geen 24/7 onnodig vol vermogen.
                </p>
              </div>
              <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-[#A9AAA7]">
                Doel: Slimme automatisering
              </div>
            </div>

            {/* 06 — MEASUREMENT */}
            <div className="p-8 rounded-2xl bg-[#15191A] border border-white/10 space-y-4 flex flex-col justify-between hover:border-[#A9875A]/40 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#A9875A] font-semibold">06</span>
                  <SustainabilityStatusBadge status="Planned" />
                </div>
                <h3 className="text-xl font-serif text-[#F7F5F1]">MEASUREMENT</h3>
                <p className="text-xs sm:text-sm text-[#A9AAA7] font-light leading-relaxed">
                  Ons fundament: <em>Meten voordat we claimen</em>. Potentiële toekomstige rapportages omvatten energieverbruik per boeking, waterverbruik per sessie, onderhoudsdata en operationele verbeterdoelstellingen.
                </p>
              </div>
              <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-[#A9AAA7]">
                Doel: Feitelijke data & audits
              </div>
            </div>

          </div>
        </section>

        {/* 4. CERTIFICATION SECTION */}
        <section aria-labelledby="cert-heading" className="p-8 sm:p-12 rounded-3xl bg-[#15191A] border border-white/10 space-y-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#A9875A]">
              Verantwoording
            </span>
            <h2 id="cert-heading" className="text-3xl sm:text-4xl font-serif text-[#F7F5F1]">
              FROM INTENTION TO VERIFICATION.
            </h2>
            <p className="text-sm sm:text-base text-[#D0CEC7] font-light leading-relaxed">
              RedZen onderzoekt welke duurzaamheidsstandaarden en certificeringen aansluiten bij de toekomstige locatie en bedrijfsvoering.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#0B0D0E] border border-white/5 space-y-2">
              <span className="text-xs font-mono text-[#A9875A]">Onderzoek 01</span>
              <h4 className="text-sm font-serif text-[#F7F5F1]">Hospitality Standaarden</h4>
              <p className="text-xs text-[#A9AAA7]">Verkenning van richtlijnen voor verantwoorde gastvrijheid en milieuzorg.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0D0E] border border-white/5 space-y-2">
              <span className="text-xs font-mono text-[#A9875A]">Onderzoek 02</span>
              <h4 className="text-sm font-serif text-[#F7F5F1]">Gebouwgebonden Energie</h4>
              <p className="text-xs text-[#A9AAA7]">Isolatieniveaus, warmtepompen en gebouwbeheersystemen.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0D0E] border border-white/5 space-y-2">
              <span className="text-xs font-mono text-[#A9875A]">Onderzoek 03</span>
              <h4 className="text-sm font-serif text-[#F7F5F1]">Milieu-investeringen</h4>
              <p className="text-xs text-[#A9AAA7]">Benutting van Nederlandse en Europese fiscale stimuleringsregelingen.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0D0E] border border-white/5 space-y-2">
              <span className="text-xs font-mono text-[#A9875A]">Onderzoek 04</span>
              <h4 className="text-sm font-serif text-[#F7F5F1]">Interne Doelstellingen</h4>
              <p className="text-xs text-[#A9AAA7]">Meetbare operationele KPI’s voor energie en water per sessie.</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
            <p className="text-xs text-[#A9AAA7] font-mono">
              Status: Pre-opening evaluatie. Geen onbevestigde keurmerken toegekend.
            </p>
            <button
              type="button"
              id="btn-sust-cert-follow"
              onClick={() => handleCtaClick('VOLG DE ONTWIKKELING (cert)', '/early-access')}
              className="py-3 px-6 rounded-xl bg-[#1C2224] hover:bg-[#A9875A] hover:text-[#0B0D0E] text-[#F7F5F1] text-xs font-mono uppercase tracking-wider transition-colors border border-white/10 cursor-pointer"
            >
              VOLG DE ONTWIKKELING &rarr;
            </button>
          </div>
        </section>

        {/* 5. SUSTAINABILITY FAQ PREVIEW (4 QUESTIONS) */}
        <section aria-labelledby="sust-faq-heading" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#A9875A]">
                Veelgestelde Vragen
              </span>
              <h2 id="sust-faq-heading" className="text-2xl sm:text-3xl font-serif text-[#F7F5F1]">
                Duurzaamheid in Vraag & Antwoord.
              </h2>
            </div>
            <button
              type="button"
              id="btn-sust-view-all-faq"
              onClick={() => onNavigate('/faq')}
              className="text-xs font-mono text-[#A9875A] hover:text-white uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <span>Bekijk alle veelgestelde vragen</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SUSTAINABILITY_FAQS.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#15191A] border border-white/5 space-y-2">
                <h4 className="text-base font-serif text-[#F7F5F1]">{faq.q}</h4>
                <p className="text-xs sm:text-sm text-[#A9AAA7] font-light leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. CLOSING CROSS-PAGE CTA */}
        <section className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-[#15191A] via-[#111415] to-[#0B0D0E] border border-[#A9875A]/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A9875A]">
              Transparante Voortgang
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#F7F5F1]">
              BLIJF OP DE HOOGTE.
            </h2>
            <p className="text-sm sm:text-base text-[#A9AAA7] font-light leading-relaxed">
              In onze Early Access community delen we openlijk de ontwikkelingen rondom onze bouw, engineering en installatiekeuzes.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              id="btn-sust-closing-early-access"
              onClick={() => handleCtaClick('VOLG DE ONTWIKKELING (closing)', '/early-access')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#A9875A] to-[#C5A069] text-[#0B0D0E] font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>VOLG DE ONTWIKKELING</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              id="btn-sust-closing-faq"
              onClick={() => onNavigate('/faq')}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#15191A] hover:bg-[#1C2224] text-[#F7F5F1] border border-white/10 hover:border-[#A9875A]/40 font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>BEKIJK DE FAQ</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#A9875A]" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

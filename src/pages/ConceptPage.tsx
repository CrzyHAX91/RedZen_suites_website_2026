import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Lock, 
  Smartphone, 
  Sparkles, 
  Leaf, 
  Layers, 
  ArrowRight, 
  ChevronRight,
  ShieldCheck,
  Compass,
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Volume2
} from 'lucide-react';
import { PageRoute } from '../types';
import { PageHero } from '../components/PageHero';
import { trackEvent } from '../services/analytics';

interface ConceptPageProps {
  onNavigate: (path: PageRoute) => void;
}

export const ConceptPage: React.FC<ConceptPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    document.title = 'Privé Wellness Concept | RedZen Suites';
    trackEvent('concept_page_viewed', { page: '/concept' });
  }, []);

  const handleEarlyAccessClick = (section: string) => {
    trackEvent('early_access_cta_clicked', {
      page: '/concept',
      section,
      cta_label: 'JOIN EARLY ACCESS',
      destination: '/early-access'
    });
    onNavigate('/early-access');
  };

  return (
    <div className="space-y-24 sm:space-y-36 pb-24">
      
      {/* 1. SHARED PAGE HERO */}
      <PageHero
        eyebrow="THE SULTRY WELLNESS PHILOSOPHY"
        title="ZWOELE VERLEIDING. GEEN VREEMDEN. ALLEEN JULLIE TWEE."
        supportingText="RedZen Suites herdefinieert wellness als een sensueel, intiem toevluchtsoord voor twee. Geen overvolle thermen of nieuwsgierige blikken, maar een discreet heiligdom van warmte, fluweel, kaarslicht en pure passie."
        developmentBadge="INTIEM SANCTUARIUM"
        backgroundImage="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80"
        primaryCTA={{
          label: 'CLAIM PRIVILEGE TOEGANG (€50 KORTING)',
          destination: '/early-access',
          icon: 'sparkles',
          id: 'btn-concept-hero-cta'
        }}
        secondaryCTA={{
          label: 'BEKIJK DE SENSUAL SUITES',
          destination: '/suites',
          icon: 'chevron',
          id: 'btn-concept-hero-suites'
        }}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28 sm:space-y-36">

        {/* 2. CONCEPT INTRODUCTION (EDITORIAL SPLIT) */}
        <section aria-labelledby="intro-heading" className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#E8C58D]">
              De Sensuele Ommekeer
            </span>
            <h2 id="intro-heading" className="text-3xl sm:text-5xl font-serif text-[#F7F5F1] leading-[1.08]">
              WAAROM ZOU INTIEME WELLNESS GEDEELD MOETEN WORDEN?
            </h2>
            <div className="space-y-4 text-[#CBC8C0] font-light leading-relaxed text-base sm:text-lg">
              <p>
                Klassieke openbare thermen dwingen je tussen tientallen onbekenden. Praten fluisterend, ogen die afdwalen, gedeelde douches en vaste routines.
              </p>
              <p className="text-[#F7F5F1] font-normal">
                RedZen breekt met deze traditie en bouwt aan het ultieme intieme toevluchtsoord.
              </p>
              <p>
                Tijdens jullie verblijf is de hele suite 100% exclusief van jullie twee. Naakt en onbevangen wegzakken in 38°C magnesiumwater, elkaars huid verwarmen in de ceder-panoramasauna en nagenieten op een fluwelen loungebed bij flakkerend schijnsel.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#171215] border-l-2 border-rose-500 space-y-2 shadow-xl">
              <span className="text-xs font-mono text-[#E8C58D] uppercase tracking-wider block">Onze Belofte</span>
              <p className="text-xl sm:text-2xl font-serif text-[#F7F5F1] italic">
                “Een zwoel heiligdom waar tijd oplost en verlangens ontwaken.”
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#15191A] group">
              <img
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
                alt="Architecturaal detail van een minimalistische privé wellness suite met donkere leisteen en indirect warm licht"
                className="w-full h-[420px] sm:h-[500px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D0E] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#0B0D0E]/85 backdrop-blur-md border border-white/10 text-xs font-mono text-[#A9AAA7] flex items-center justify-between">
                <span>Architecturale visualisatie</span>
                <span className="text-[#A9875A]">Volledig Privé</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. WHAT REDZEN IS NOT (RESTRAINED COMPARISON) */}
        <section aria-labelledby="comparison-heading" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#A9875A]">
              Conceptueel Verschil
            </span>
            <h2 id="comparison-heading" className="text-3xl sm:text-5xl font-serif text-[#F7F5F1]">
              NIET MEER VAN HETZELFDE.
            </h2>
            <p className="text-sm text-[#A9AAA7] font-light">
              Een bewuste herdefinitie van hoe privacy, akoestiek en technologische autonomie samenkomen in moderne wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Traditional Column */}
            <div className="p-8 sm:p-10 rounded-2xl bg-[#15191A]/40 border border-white/5 space-y-6">
              <div className="pb-4 border-b border-white/10">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#A9AAA7] block">Bestaande Markt</span>
                <h3 className="text-xl sm:text-2xl font-serif text-[#C5C4BE] mt-1">Traditionele wellness</h3>
              </div>
              <ul className="space-y-4 text-sm text-[#A9AAA7]">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 mt-2 shrink-0" />
                  <span>Gedeelde voorzieningen en circulerende groepen</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 mt-2 shrink-0" />
                  <span>Drukke omgevingen en publieke rustzones</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 mt-2 shrink-0" />
                  <span>Weinig controle over licht, muziek en sfeer</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 mt-2 shrink-0" />
                  <span>Vaste algemene ervaring zonder personalisatie</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 mt-2 shrink-0" />
                  <span>Beperkte privacy tijdens gebruik</span>
                </li>
              </ul>
            </div>

            {/* RedZen Column */}
            <div className="p-8 sm:p-10 rounded-2xl bg-[#15191A] border border-[#A9875A]/40 space-y-6 shadow-2xl relative">
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-[#A9875A] text-[#0B0D0E] text-[10px] font-mono font-bold uppercase tracking-wider">
                RedZen Standaard
              </div>
              <div className="pb-4 border-b border-white/10">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#A9875A] block">Nieuwe Generatie</span>
                <h3 className="text-xl sm:text-2xl font-serif text-[#F7F5F1] mt-1">RedZen Suites</h3>
              </div>
              <ul className="space-y-4 text-sm text-[#F7F5F1]">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A9875A] mt-2 shrink-0" />
                  <span>Volledig privé gebruik exclusief voor jouw gezelschap</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A9875A] mt-2 shrink-0" />
                  <span>Eigen geselecteerd tijdslot in alle sereniteit</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A9875A] mt-2 shrink-0" />
                  <span>Persoonlijke controle over verlichting, audio & warmte</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A9875A] mt-2 shrink-0" />
                  <span>Digitale gastreis met contactloze smartphone-toegang</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A9875A] mt-2 shrink-0" />
                  <span>Premium suite-ervaring zonder concessies</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. FIVE DESIGN PRINCIPLES */}
        <section aria-labelledby="principles-heading" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#A9875A]">
              Kernprincipes
            </span>
            <h2 id="principles-heading" className="text-3xl sm:text-5xl font-serif text-[#F7F5F1]">
              DESIGNED AROUND YOU.
            </h2>
            <p className="text-sm text-[#A9AAA7] font-light">
              Vijf fundamentele uitgangspunten die ten grondslag liggen aan elk detail van onze architectuur en operatie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Principle 01 */}
            <div className="p-8 rounded-2xl bg-[#15191A] border border-white/10 space-y-4 relative group hover:border-[#A9875A]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl text-[#A9875A] font-light">01</span>
                <Lock className="w-5 h-5 text-[#A9875A]" />
              </div>
              <h3 className="text-xl font-serif text-[#F7F5F1] tracking-wide">
                PRIVACY BY DESIGN
              </h3>
              <p className="text-sm text-[#A9AAA7] font-light leading-relaxed">
                Privacy is geen extra optie. Het is het uitgangspunt van de complete RedZen-ervaring.
              </p>
            </div>

            {/* Principle 02 */}
            <div className="p-8 rounded-2xl bg-[#15191A] border border-white/10 space-y-4 relative group hover:border-[#A9875A]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl text-[#A9875A] font-light">02</span>
                <Smartphone className="w-5 h-5 text-[#A9875A]" />
              </div>
              <h3 className="text-xl font-serif text-[#F7F5F1] tracking-wide">
                DIGITAL BY DEFAULT
              </h3>
              <p className="text-sm text-[#A9AAA7] font-light leading-relaxed">
                Van interesse en reservering tot toegang en communicatie wordt de gastreis zo eenvoudig en digitaal mogelijk ingericht.
              </p>
            </div>

            {/* Principle 03 */}
            <div className="p-8 rounded-2xl bg-[#15191A] border border-white/10 space-y-4 relative group hover:border-[#A9875A]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl text-[#A9875A] font-light">03</span>
                <Sparkles className="w-5 h-5 text-[#A9875A]" />
              </div>
              <h3 className="text-xl font-serif text-[#F7F5F1] tracking-wide">
                PREMIUM BY EXPERIENCE
              </h3>
              <p className="text-sm text-[#A9AAA7] font-light leading-relaxed">
                Materialen, licht, geluid, temperatuur en gebruiksgemak vormen samen één consistente ervaring.
              </p>
            </div>

            {/* Principle 04 */}
            <div className="p-8 rounded-2xl bg-[#15191A] border border-white/10 space-y-4 relative group hover:border-[#A9875A]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl text-[#A9875A] font-light">04</span>
                <Leaf className="w-5 h-5 text-[#A9875A]" />
              </div>
              <h3 className="text-xl font-serif text-[#F7F5F1] tracking-wide">
                RESPONSIBLE BY DESIGN
              </h3>
              <p className="text-sm text-[#A9AAA7] font-light leading-relaxed">
                Energie, water, installaties en materiaalkeuzes worden vanaf de ontwikkelfase meegenomen.
              </p>
            </div>

            {/* Principle 05 */}
            <div className="p-8 rounded-2xl bg-[#15191A] border border-white/10 space-y-4 relative group hover:border-[#A9875A]/40 transition-colors md:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl text-[#A9875A] font-light">05</span>
                <Layers className="w-5 h-5 text-[#A9875A]" />
              </div>
              <h3 className="text-xl font-serif text-[#F7F5F1] tracking-wide">
                SCALABLE BY SYSTEM
              </h3>
              <p className="text-sm text-[#A9AAA7] font-light leading-relaxed">
                RedZen wordt ontwikkeld als een herhaalbaar concept met gestandaardiseerde suites, processen en kwaliteitscontrole.
              </p>
            </div>

          </div>
        </section>

        {/* 5. GUEST JOURNEY */}
        <section aria-labelledby="journey-heading" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#A9875A]">
              De Toekomstige Gastreis
            </span>
            <h2 id="journey-heading" className="text-3xl sm:text-5xl font-serif text-[#F7F5F1]">
              FROM ARRIVAL TO DISCONNECT.
            </h2>
            <p className="text-sm text-[#A9AAA7] font-light">
              Zeven zorgvuldig ontworpen contactmomenten die rust en eenvoud waarborgen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {[
              { num: '01', title: 'Ontdek', desc: 'Verken suiteconcepten en sferen online' },
              { num: '02', title: 'Kies', desc: 'Selecteer gewenst tijdslot en arrangement' },
              { num: '03', title: 'Reserveer', desc: 'Veilige digitale boeking en bevestiging' },
              { num: '04', title: 'Personaliseer', desc: 'Kies je favoriete soundscape en drankjes' },
              { num: '05', title: 'Arriveer', desc: 'Contactloze digitale toegang via smartphone' },
              { num: '06', title: 'Ontspan', desc: '100% particuliere privacy en magnesiumrust' },
              { num: '07', title: 'Vertrek', desc: 'Zorgeloze checkout en geautomatiseerde reiniging' }
            ].map((step, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl bg-[#15191A] border border-white/5 space-y-2 hover:border-[#A9875A]/30 transition-colors"
              >
                <span className="text-xs font-mono text-[#A9875A] font-semibold block">{step.num}</span>
                <h4 className="text-base font-serif text-[#F7F5F1]">{step.title}</h4>
                <p className="text-xs text-[#A9AAA7] font-light leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Development note & booking clarity */}
          <div className="p-4 rounded-xl bg-[#15191A]/60 border border-white/10 text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs text-[#A9875A] font-mono block">Ontwikkelingsnotitie</span>
            <p className="text-xs text-[#A9AAA7] font-light">
              De definitieve gastreis wordt getest en verfijnd vóór de opening van de eerste locatie. Online boekingen zijn momenteel nog niet actief.
            </p>
          </div>
        </section>

        {/* 6. CLOSING CTA SECTION */}
        <section className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-[#15191A] via-[#111415] to-[#0B0D0E] border border-[#A9875A]/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-[#A9875A]/10 blur-3xl pointer-events-none" />
          
          <div className="space-y-3 max-w-xl mx-auto relative z-10">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A9875A]">
              Sluit je aan bij de pre-launch
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#F7F5F1]">
              BE AMONG THE FIRST.
            </h2>
            <p className="text-sm sm:text-base text-[#A9AAA7] font-light leading-relaxed">
              De eerste RedZen-locatie is in ontwikkeling. Early Access-leden ontvangen als eerste informatie over suites, locatie en opening.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <button
              type="button"
              id="btn-concept-closing-early-access"
              onClick={() => handleEarlyAccessClick('concept_closing_primary')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#A9875A] to-[#C5A069] text-[#0B0D0E] font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[0_0_25px_rgba(169,135,90,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>JOIN EARLY ACCESS</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              id="btn-concept-closing-suites"
              onClick={() => onNavigate('/suites')}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#15191A] hover:bg-[#1C2224] text-[#F7F5F1] border border-white/10 hover:border-[#A9875A]/40 font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ONTDEK DE SUITES</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#A9875A]" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

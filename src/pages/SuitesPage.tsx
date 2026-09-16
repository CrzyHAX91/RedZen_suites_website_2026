import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Users, 
  Clock, 
  Droplets, 
  Flame, 
  Volume2, 
  SunMedium,
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  Shield,
  Layers,
  Sparkle
} from 'lucide-react';
import { PageRoute } from '../types';
import { PageHero } from '../components/PageHero';
import { SUITES_DATA, Suite } from '../data/suites';
import { SuiteComparison } from '../components/SuiteComparison';
import { MoodLightingSwitcher } from '../components/MoodLightingSwitcher';
import { SuiteConfigurator } from '../components/SuiteConfigurator';
import { trackEvent } from '../services/analytics';

interface SuitesPageProps {
  onNavigate: (path: PageRoute) => void;
}

export const SuitesPage: React.FC<SuitesPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    document.title = 'Privé Sauna & Wellness Suites | RedZen Suites';
    trackEvent('suites_page_viewed', { page: '/suites' });
  }, []);

  const handleSuiteSelect = (suiteKey: string) => {
    trackEvent('suite_selected', {
      page: '/suites',
      suite_source: suiteKey,
      destination: '/early-access'
    });
    if (suiteKey === 'suite_zen_one') {
      trackEvent('zen_one_viewed', { page: '/suites' });
    } else if (suiteKey === 'suite_zen_signature') {
      trackEvent('zen_signature_viewed', { page: '/suites' });
    }
    onNavigate('/early-access');
  };

  const zenOne = SUITES_DATA.find(s => s.slug === 'zen-one') || SUITES_DATA[0];
  const zenSignature = SUITES_DATA.find(s => s.slug === 'zen-signature') || SUITES_DATA[1];

  return (
    <div className="space-y-24 sm:space-y-36 pb-24">
      
      {/* 1. SHARED PAGE HERO */}
      <PageHero
        eyebrow="SENSUAL PRIVATE SANCTUARIES"
        title="ZWOELE RUST. PURE PASSIE. ALLEEN VOOR TWEE."
        supportingText="Stap binnen in een zintuiglijk universum waar de buitenwereld direct vervaagt. Privésuites met geurende ceder-sauna's, 38°C magnesiumwater, fluwelen daybeds en hypnotiserende amber- en roodlichtscènes—volledig gewijd aan intieme verbinding en verleiding."
        developmentBadge="EXCLUSIEF VOOR TWEE"
        backgroundImage="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80"
        primaryCTA={{
          label: 'CLAIM PRIVILEGE TOEGANG (€50 KORTING)',
          destination: '/early-access',
          icon: 'sparkles',
          id: 'btn-suites-hero-cta'
        }}
        secondaryCTA={{
          label: 'ONTDEK HET ZWOELE CONCEPT',
          destination: '/concept',
          icon: 'chevron',
          id: 'btn-suites-hero-concept'
        }}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28 sm:space-y-36">

        {/* 2. SUITE DISCLAIMER (LEGIBLE & CREDIBLE) */}
        <section aria-label="Suite ontwikkeling toelichting" className="p-6 sm:p-8 rounded-2xl bg-[#15191A] border border-amber-500/25 max-w-4xl mx-auto shadow-xl">
          <div className="flex items-start gap-4">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1.5 shrink-0 animate-pulse" />
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-200/90 font-medium block">
                Ontwikkelingsstatus van de suites
              </span>
              <p className="text-xs sm:text-sm text-[#D0CEC7] font-light leading-relaxed">
                De suites en faciliteiten op deze pagina beschrijven de geplande RedZen-ervaring. Definitieve specificaties, capaciteit, prijzen en beschikbaarheid worden vastgesteld nadat de eerste locatie is bevestigd.
              </p>
            </div>
          </div>
        </section>

        {/* 3. SUITE 01: ZEN ONE */}
        <section 
          id="suite-zen-one" 
          aria-labelledby="zen-one-heading"
          className="rounded-3xl bg-[#15191A] border border-[#A9875A]/30 overflow-hidden shadow-2xl space-y-0"
        >
          {/* Suite Hero Visual Banner */}
          <div className="relative h-72 sm:h-96 w-full overflow-hidden">
            <img 
              src={zenOne.image} 
              alt={zenOne.imageAlt}
              className="w-full h-full object-cover brightness-90 contrast-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#15191A] via-[#15191A]/30 to-transparent" />
            <div className="absolute top-6 left-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#A9875A] px-3.5 py-1.5 rounded-full bg-[#0B0D0E]/80 backdrop-blur-md border border-[#A9875A]/40">
                Zen One • Intiem Sanctuarium
              </span>
            </div>
          </div>

          <div className="p-8 sm:p-12 space-y-8">
            
            {/* Header & Badges */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-white/10">
              <div className="max-w-3xl space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#A9875A] px-2.5 py-1 rounded bg-[#A9875A]/10 border border-[#A9875A]/30">
                    Concept 01
                  </span>
                  <span className="text-xs font-mono text-[#A9AAA7] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#A9875A]" /> {zenOne.capacityText}
                  </span>
                  <span className="text-xs font-mono text-[#A9AAA7] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#A9875A]" /> {zenOne.sessionDuration}
                  </span>
                  <span className="text-[11px] font-mono text-amber-200/90 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30">
                    {zenOne.statusLabel}
                  </span>
                </div>

                <h2 id="zen-one-heading" className="text-3xl sm:text-5xl font-serif text-[#F7F5F1]">
                  {zenOne.name}
                </h2>
                <span className="text-xs font-mono text-[#A9875A] tracking-widest uppercase block">
                  {zenOne.tagline}
                </span>

                <p className="text-sm sm:text-base text-[#D0CEC7] font-light leading-relaxed pt-1">
                  {zenOne.description}
                </p>
              </div>

              <div className="text-left lg:text-right shrink-0 space-y-1">
                <span className="text-xs text-[#A9AAA7] font-mono block">Indicatieve sessieprijs:</span>
                <span className="text-2xl sm:text-3xl font-serif text-[#F7F5F1] font-semibold">
                  €200 <span className="text-xs text-[#A9AAA7] font-sans font-normal">/ 2 uur (2 pers.)</span>
                </span>
                <span className="block text-xs text-emerald-400 font-mono">
                  (€150 na €50 Early Access voordeel)
                </span>
              </div>
            </div>

            {/* Planned Facilities Grid */}
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#A9875A] block">
                Geplande Faciliteiten
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {zenOne.plannedFacilities.map((fac, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#0B0D0E] border border-white/5 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#A9875A] shrink-0" />
                    <span className="text-xs sm:text-sm text-[#F7F5F1] capitalize">{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ideal For & Add-ons Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-6 rounded-2xl bg-[#0B0D0E]/60 border border-white/5 space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-[#A9AAA7] block">
                  Ideaal Voor
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-[#D0CEC7]">
                  {zenOne.idealFor.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A9875A]" />
                      <span className="capitalize">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-[#0B0D0E]/60 border border-white/5 space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-[#A9AAA7] block">
                  Mogelijke Toekomstige Add-ons
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-[#D0CEC7]">
                  {zenOne.possibleAddOns.map((addon, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                      <span className="capitalize">{addon}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Footer */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
              <span className="text-xs text-[#A9AAA7] font-mono">
                Inclusief: Biologisch linnen, luxe badjassen & verzorgingsproducten.
              </span>
              <button
                type="button"
                id="btn-zen-one-cta"
                onClick={() => handleSuiteSelect('suite_zen_one')}
                className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-[#A9875A] hover:bg-[#C5A069] text-[#0B0D0E] font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg"
              >
                ZEN ONE EARLY ACCESS
              </button>
            </div>

          </div>
        </section>

        {/* 4. SUITE 02: ZEN SIGNATURE */}
        <section 
          id="suite-zen-signature" 
          aria-labelledby="zen-sig-heading"
          className="rounded-3xl bg-[#15191A] border-2 border-[#A9875A]/60 overflow-hidden shadow-[0_0_50px_rgba(169,135,90,0.15)] space-y-0 relative"
        >
          {/* Suite Hero Visual Banner */}
          <div className="relative h-72 sm:h-96 w-full overflow-hidden">
            <img 
              src={zenSignature.image} 
              alt={zenSignature.imageAlt}
              className="w-full h-full object-cover brightness-90 contrast-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#15191A] via-[#15191A]/30 to-transparent" />
            <div className="absolute top-6 left-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#0B0D0E] font-bold px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#A9875A] to-[#C5A069] shadow-lg">
                Zen Signature • Master Suite
              </span>
            </div>
            <div className="absolute top-0 right-0 bg-[#A9875A] text-[#0B0D0E] text-[10px] font-mono font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl shadow">
              Master Suite Concept
            </div>
          </div>

          <div className="p-8 sm:p-12 space-y-8">
            
            {/* Header & Badges */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-white/10">
              <div className="max-w-3xl space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#A9875A] px-2.5 py-1 rounded bg-[#A9875A]/10 border border-[#A9875A]/30">
                    Concept 02
                  </span>
                  <span className="text-xs font-mono text-[#A9AAA7] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#A9875A]" /> {zenSignature.capacityText}
                  </span>
                  <span className="text-xs font-mono text-[#A9AAA7] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#A9875A]" /> {zenSignature.sessionDuration}
                  </span>
                  <span className="text-[11px] font-mono text-amber-200/90 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30">
                    {zenSignature.statusLabel}
                  </span>
                </div>

                <h2 id="zen-sig-heading" className="text-3xl sm:text-5xl font-serif text-[#F7F5F1]">
                  {zenSignature.name}
                </h2>
                <span className="text-xs font-mono text-[#A9875A] tracking-widest uppercase block">
                  {zenSignature.tagline}
                </span>

                <p className="text-sm sm:text-base text-[#D0CEC7] font-light leading-relaxed pt-1">
                  {zenSignature.description}
                </p>
              </div>

              <div className="text-left lg:text-right shrink-0 space-y-1">
                <span className="text-xs text-[#A9AAA7] font-mono block">Indicatieve sessieprijs:</span>
                <span className="text-2xl sm:text-3xl font-serif text-[#F7F5F1] font-semibold">
                  €200 <span className="text-xs text-[#A9AAA7] font-sans font-normal">/ 2 uur (optioneel +rituals)</span>
                </span>
                <span className="block text-xs text-emerald-400 font-mono">
                  (€150 na €50 Early Access voordeel)
                </span>
              </div>
            </div>

            {/* Planned Facilities Grid */}
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#A9875A] block">
                Geplande Faciliteiten
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {zenSignature.plannedFacilities.map((fac, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#0B0D0E] border border-white/5 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#A9875A] shrink-0" />
                    <span className="text-xs sm:text-sm text-[#F7F5F1] capitalize">{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ideal For & Add-ons Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-6 rounded-2xl bg-[#0B0D0E]/60 border border-white/5 space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-[#A9AAA7] block">
                  Ideaal Voor
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-[#D0CEC7]">
                  {zenSignature.idealFor.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A9875A]" />
                      <span className="capitalize">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-[#0B0D0E]/60 border border-white/5 space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-[#A9AAA7] block">
                  Mogelijke Toekomstige Add-ons
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-[#D0CEC7]">
                  {zenSignature.possibleAddOns.map((addon, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                      <span className="capitalize">{addon}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Footer */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
              <span className="text-xs text-[#A9AAA7] font-mono">
                Inclusief: Signature badjas service, luxe verzorgingsset, champagneglazen & minibar tegoed.
              </span>
              <button
                type="button"
                id="btn-zen-sig-cta"
                onClick={() => handleSuiteSelect('suite_zen_signature')}
                className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-gradient-to-r from-[#A9875A] to-[#C5A069] text-[#0B0D0E] font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg hover:brightness-110"
              >
                ZEN SIGNATURE EARLY ACCESS
              </button>
            </div>

          </div>
        </section>

        {/* 5. DIRECT SUITE COMPARISON (CLEAN & ACCESSIBLE) */}
        <SuiteComparison onSelectSuite={handleSuiteSelect} />

        {/* 6. SUITE EXPERIENCE SECTIONS (MATERIAL, LIGHT, SOUND) */}
        <section aria-labelledby="experience-heading" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#A9875A]">
              Sensoriële Architectuur
            </span>
            <h2 id="experience-heading" className="text-3xl sm:text-5xl font-serif text-[#F7F5F1]">
              DE ERVARING IN DETAIL.
            </h2>
            <p className="text-sm text-[#A9AAA7] font-light">
              Drie fundamentele pijlers die de sfeer in elke suite bepalen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* MATERIAL */}
            <div className="p-8 rounded-2xl bg-[#15191A] border border-white/10 space-y-4">
              <span className="text-xs font-mono text-[#A9875A] uppercase tracking-widest block">01 / MATERIAL</span>
              <h3 className="text-2xl font-serif text-[#F7F5F1]">DESIGNED TO FEEL QUIET.</h3>
              <p className="text-sm text-[#A9AAA7] font-light leading-relaxed">
                Materialen worden geselecteerd op uitstraling, duurzaamheid, onderhoud en hoe zij bijdragen aan rust. Warme natuurstenen, thermohout en tactiele oppervlakken zonder felle reflecties.
              </p>
            </div>

            {/* LIGHT */}
            <div className="p-8 rounded-2xl bg-[#15191A] border border-white/10 space-y-4">
              <span className="text-xs font-mono text-[#A9875A] uppercase tracking-widest block">02 / LIGHT</span>
              <h3 className="text-2xl font-serif text-[#F7F5F1]">LIGHT CHANGES THE SPACE.</h3>
              <p className="text-sm text-[#A9AAA7] font-light leading-relaxed">
                Indirecte en instelbare verlichting moet de suite kunnen aanpassen aan verschillende momenten en voorkeuren. Van zachte ochtendglans tot een intieme, gedimde avondsfeer.
              </p>
            </div>

            {/* SOUND */}
            <div className="p-8 rounded-2xl bg-[#15191A] border border-white/10 space-y-4">
              <span className="text-xs font-mono text-[#A9875A] uppercase tracking-widest block">03 / SOUND</span>
              <h3 className="text-2xl font-serif text-[#F7F5F1]">CONTROL THE ATMOSPHERE.</h3>
              <p className="text-sm text-[#A9AAA7] font-light leading-relaxed">
                Audio en akoestiek worden onderdeel van de ervaring, zonder de rust van aangrenzende suites te verstoren. Studio-grade isolatie en rustgevende soundscapes op maat.
              </p>
            </div>

          </div>
        </section>

        {/* 7. PRESERVED INTERACTIVE SUITE CONFIGURATOR & MOOD LIGHTING SWITCHER */}
        <div className="space-y-12">
          <MoodLightingSwitcher />
          <SuiteConfigurator onSelectAndNavigate={onNavigate} />
        </div>

        {/* 8. CLOSING CROSS-PAGE CTA */}
        <section className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-[#15191A] via-[#111415] to-[#0B0D0E] border border-[#A9875A]/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A9875A]">
              Klaar voor jouw moment?
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#F7F5F1]">
              JOIN THE EARLY ACCESS LIST.
            </h2>
            <p className="text-sm sm:text-base text-[#A9AAA7] font-light leading-relaxed">
              Verzeker je van 48 uur voorrang bij de boekingsopening en ontvang direct €50 introductievoordeel op jouw eerste 2-uurs suitesessie.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              id="btn-suites-closing-early-access"
              onClick={() => {
                trackEvent('early_access_cta_clicked', { page: '/suites', section: 'closing_cta', destination: '/early-access' });
                onNavigate('/early-access');
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#A9875A] to-[#C5A069] text-[#0B0D0E] font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>JOIN EARLY ACCESS</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              id="btn-suites-closing-concept"
              onClick={() => onNavigate('/concept')}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#15191A] hover:bg-[#1C2224] text-[#F7F5F1] border border-white/10 hover:border-[#A9875A]/40 font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ONTDEK HET CONCEPT</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#A9875A]" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

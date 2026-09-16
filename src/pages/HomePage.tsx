import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Droplets, 
  Sliders, 
  VolumeX, 
  Flame, 
  HeartHandshake, 
  Building2, 
  Compass, 
  CheckCircle2, 
  Clock,
  Sparkle
} from 'lucide-react';
import { PageRoute } from '../types';
import { EarlyAccessFunnel } from '../components/EarlyAccessFunnel';

interface HomePageProps {
  onNavigate: (path: PageRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const scrollToFunnel = () => {
    const el = document.getElementById('home-funnel-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-24 md:space-y-36 pb-16">
      
      {/* 1. HERO SECTION */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-subtle-grid"
      >
        {/* Ambient atmospheric gradients with slow breathing sensual entrance */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-br from-[#A9875A]/25 via-[#991B1B]/15 to-transparent rounded-full blur-[170px] pointer-events-none animate-sensual-pulse" 
        />
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.55 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.2 }}
          className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#4C0519]/35 rounded-full blur-[150px] pointer-events-none" 
        />
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.3 }}
          className="absolute top-20 left-10 w-[380px] h-[380px] bg-[#A9875A]/20 rounded-full blur-[140px] pointer-events-none" 
        />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          
          {/* Pre-launch pill with cinematic reveal */}
          <motion.div 
            initial={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181115]/90 border border-rose-500/40 text-[#E8C58D] text-xs font-mono tracking-widest uppercase shadow-[0_0_25px_rgba(225,29,72,0.2)] backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>100% DISCREET • INTIEM & PASSIEVOL VOOR TWEE • CLAIM €50 PRIVILEGE</span>
          </motion.div>

          {/* Main Hero Headline with cinematic mask & typography lift */}
          <motion.div
            initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif tracking-[0.04em] text-[#F7F5F1] uppercase leading-[0.95] font-normal drop-shadow-2xl">
              PASSIONELE RUST.
              <span className="block italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#E8C58D] to-[#E11D48] font-light mt-1">
                EEN ZWOEL HEILIGDOM VOOR TWEE.
              </span>
            </h1>
          </motion.div>

          {/* Subtext with smooth emergence */}
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl text-[#CBC8C0] font-light max-w-2xl mx-auto leading-relaxed"
          >
            Sluit de buitenwereld buiten en geef je over aan elkaar. Geurend warm cederhout, fluweelzachte schaduwen, een dampend magnesiumbad en hypnotiserend kaarslicht. 100% discreet, sensueel en ongehaast.
          </motion.p>

          {/* Secondary Brand Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs uppercase tracking-[0.35em] text-[#E8C58D] font-mono flex items-center justify-center gap-2"
          >
            <span className="text-rose-400">♥</span>
            <span>Sensueel • 100% Onbespied • Zero-Emission • Alleen Voor Geliefden</span>
            <span className="text-rose-400">♥</span>
          </motion.div>

          {/* Hero CTAs with coordinated entrance */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              type="button"
              id="hero-btn-join"
              onClick={scrollToFunnel}
              className="w-full sm:w-auto py-4 px-8 rounded-xl bg-gradient-to-r from-[#C5A069] via-[#A9875A] to-[#B91C1C] text-[#F7F5F1] font-bold text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_35px_rgba(185,28,28,0.4)] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-rose-200" />
              <span>RESERVEER JOUW DATE — CLAIM €50 PRIVILEGE</span>
            </button>

            <button
              type="button"
              id="hero-btn-concept"
              onClick={() => onNavigate('/concept')}
              className="w-full sm:w-auto py-4 px-8 rounded-xl bg-[#15191A]/80 border border-[#A9875A]/40 text-[#F7F5F1] font-medium text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#1F171A] hover:border-rose-400 transition-all cursor-pointer shadow-lg"
            >
              <span>BEKIJK DE SUITES</span>
              <ArrowRight className="w-4 h-4 text-[#E8C58D]" />
            </button>
          </motion.div>

          {/* Seductive metrics bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-[#A9875A]/15 text-left"
          >
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="p-3.5 rounded-xl bg-[#181115]/50 border border-rose-900/30"
            >
              <span className="block font-serif text-lg text-[#F7F5F1]">100% Onbespied</span>
              <span className="text-[11px] text-[#CBC8C0]">Exclusief voor twee, geen pottenkijkers</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.62 }}
              className="p-3.5 rounded-xl bg-[#181115]/50 border border-rose-900/30"
            >
              <span className="block font-serif text-lg text-[#F7F5F1]">Zwoele Sfeerhaard</span>
              <span className="text-[11px] text-[#CBC8C0]">Kaarslicht, fluweel & amber gloed</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.69 }}
              className="p-3.5 rounded-xl bg-[#181115]/50 border border-rose-900/30"
            >
              <span className="block font-serif text-lg text-[#F7F5F1]">Zijdezacht Magnesium</span>
              <span className="text-[11px] text-[#CBC8C0]">38°C water streelt vermoeide spieren</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.76 }}
              className="p-3.5 rounded-xl bg-[#181115]/60 border border-[#A9875A]/40 bg-[#A9875A]/10 shadow-[0_0_15px_rgba(169,135,90,0.15)]"
            >
              <span className="block font-serif text-lg text-[#E8C58D]">€150 Date Privilege</span>
              <span className="text-[11px] text-[#F7F5F1]">€50 korting op €200 / 2u</span>
            </motion.div>
          </motion.div>

        </div>
      </motion.section>

      {/* 2. PRIMARY CONVERSION FUNNEL SECTION (CRITICAL) */}
      <section id="home-funnel-section" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#E8C58D] inline-flex items-center gap-2">
            <span className="text-rose-400">♦</span>
            <span>EXCLUSIEVE PASSIE VOOR TWEE</span>
            <span className="text-rose-400">♦</span>
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F7F5F1]">
            Ontwaak Jouw Verlangen
          </h2>
          <p className="text-sm text-[#CBC8C0]">
            Kies het ritueel dat jullie connectie verdiept en claim direct jouw pre-launch voucher.
          </p>
        </div>

        {/* Funnel Component */}
        <EarlyAccessFunnel id="home-micro-funnel" />
      </section>

      {/* 3. THE REDZEN PHILOSOPHY / CORE PILLARS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E8C58D] block">
              Waarom RedZen Suites?
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F7F5F1] leading-tight">
              Echte passie vraagt om absolute afzondering.
            </h2>
            <p className="text-sm sm:text-base text-[#CBC8C0] font-light leading-relaxed">
              Traditionele wellnesscentra dwingen je om ontspanning te zoeken te midden van vreemden. RedZen is een zwoel, bedwelmend toevluchtsoord ontworpen voor pure verbinding, diepe aanraking en ongestoorde sensualiteit.
            </p>

            <div className="pt-2 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#1A1216] text-[#E8C58D] border border-rose-900/40 shrink-0 mt-0.5 shadow-[0_0_12px_rgba(225,29,72,0.15)]">
                  <VolumeX className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F7F5F1]">Akoestische Heiligdom</h4>
                  <p className="text-xs text-[#CBC8C0] mt-0.5">
                    Studio-grade geluidsisolatie. Geen stemmen van buren, geen onderbrekingen. Enkel jullie eigen ademhaling en zachte fluistertonen.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#1A1216] text-[#E8C58D] border border-rose-900/40 shrink-0 mt-0.5 shadow-[0_0_12px_rgba(225,29,72,0.15)]">
                  <Sliders className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F7F5F1]">Intieme Licht- & Sfeerregeling</h4>
                  <p className="text-xs text-[#CBC8C0] mt-0.5">
                    Van zacht flakkerend kaarslicht en zwoele roodlichtgloed tot verwarmende etherische oliën. Jij bepaalt de stemming.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#1A1216] text-[#E8C58D] border border-rose-900/40 shrink-0 mt-0.5 shadow-[0_0_12px_rgba(225,29,72,0.15)]">
                  <Lock className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F7F5F1]">100% Discrete Digitale Check-in</h4>
                  <p className="text-xs text-[#CBC8C0] mt-0.5">
                    Geen receptiebalies of nieuwsgierige blikken. Je ontgrendelt contactloos met je smartphone en stapt direct jullie privédomein binnen.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => onNavigate('/concept')}
                className="text-xs uppercase tracking-widest text-[#E8C58D] hover:text-[#F7F5F1] font-semibold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>Ontdek het volledige intieme concept</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Architectural Feature Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-6 rounded-2xl sensual-card space-y-4 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#0B0D0E] border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_18px_rgba(225,29,72,0.25)]">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-[#F7F5F1]">Sensuele Panoramasauna</h3>
              <p className="text-xs text-[#CBC8C0] leading-relaxed">
                Op maat vervaardigd uit geurend Ayous- en donker esphout. Zacht dimbare amber- en roodlichtgloed, aromatische damaskroos stoomopgietingen en temperaturen die de huid doen tintelen.
              </p>
            </div>

            <div className="p-6 rounded-2xl sensual-card space-y-4 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#0B0D0E] border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_18px_rgba(225,29,72,0.25)]">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-[#F7F5F1]">Intieme Magnesium Spa</h3>
              <p className="text-xs text-[#CBC8C0] leading-relaxed">
                Zijdezacht water op lichaamstemperatuur (38°C) verrijkt met pure magnesiummineralen. Schouder aan schouder wegdrijven terwijl massagestralen elke spanning doen oplossen.
              </p>
            </div>

            <div className="p-6 rounded-2xl sensual-card space-y-4 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#0B0D0E] border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_18px_rgba(225,29,72,0.25)]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-[#F7F5F1]">Klinische Zuiverheid</h3>
              <p className="text-xs text-[#CBC8C0] leading-relaxed">
                Elke suite ondergaat tussen elk bezoek een hermetische UVC- en ozon-desinfectie. Pure, geurloze hygiëne zodat jullie je volledig zorgeloos kunnen overgeven.
              </p>
            </div>

            <div className="p-6 rounded-2xl sensual-card space-y-4 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#0B0D0E] border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_18px_rgba(225,29,72,0.25)]">
                <Sparkle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-[#F7F5F1]">Sultry Velvet Daybed & Haard</h3>
              <p className="text-xs text-[#CBC8C0] leading-relaxed">
                Kingsize loungebed met natuurlijk linnen, zachte schaduwen bij de knisperende bio-ethanol haard, gekoelde champagne en binaurale pulsen.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* NEW: SENSORY SEDUCTION STRIP */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#1C1217] via-[#141819] to-[#0E1012] border border-rose-500/30 shadow-[0_0_40px_rgba(225,29,72,0.15)] space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#E8C58D]">
              Zintuiglijke Verfijning
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif text-[#F7F5F1]">
              De Vier Dimensies van Passie
            </h3>
            <p className="text-xs sm:text-sm text-[#CBC8C0]">
              Elk zintuig wordt uitgenodigd tot diepe overgave en sensuele rust.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#0B0D0E]/70 border border-white/5 space-y-2.5">
              <span className="text-xs font-mono text-[#E8C58D] uppercase block font-bold">01. Aanraken</span>
              <h4 className="text-lg font-serif text-[#F7F5F1]">Warmte & Zijde</h4>
              <p className="text-xs text-[#CBC8C0] leading-relaxed">
                38°C therapeutisch magnesiumwater, 90°C geurend saunahout en handgemaakt linnen om de huid te strelen.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0B0D0E]/70 border border-white/5 space-y-2.5">
              <span className="text-xs font-mono text-rose-400 uppercase block font-bold">02. Zien</span>
              <h4 className="text-lg font-serif text-[#F7F5F1]">Schaduw & Gloed</h4>
              <p className="text-xs text-[#CBC8C0] leading-relaxed">
                Intiem amberlicht (1800K), vlammen van de bio-ethanol haard en gefilterd roodlicht voor een flatterende ambiance.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0B0D0E]/70 border border-white/5 space-y-2.5">
              <span className="text-xs font-mono text-[#E8C58D] uppercase block font-bold">03. Ruiken</span>
              <h4 className="text-lg font-serif text-[#F7F5F1]">Geurige Opgieting</h4>
              <p className="text-xs text-[#CBC8C0] leading-relaxed">
                Zachte infusie van damaskroos, cederhout, bergamot en sandelhout die de hartslag vertragen en verlangen wekken.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0B0D0E]/70 border border-white/5 space-y-2.5">
              <span className="text-xs font-mono text-rose-400 uppercase block font-bold">04. Horen</span>
              <h4 className="text-lg font-serif text-[#F7F5F1]">Akoestische Stilte</h4>
              <p className="text-xs text-[#CBC8C0] leading-relaxed">
                Studio-grade stilte vermengd met fluweelzachte 528Hz harthonen of het rustgevende gekletter van watermist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE TWO SUITE ARCHETYPES (PREVIEW) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#A9875A]">
            Suite Archetypes
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F7F5F1]">
            Twee doordachte concepten
          </h2>
          <div className="inline-block px-3 py-1 rounded-full bg-[#15191A] border border-white/10 text-xs text-[#A9AAA7] font-mono">
            Planned experience — final details pending location confirmation
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Suite 1: ZEN ONE */}
          <div className="bg-[#15191A] rounded-2xl border border-[#A9875A]/25 overflow-hidden flex flex-col justify-between relative group hover:border-[#A9875A] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="relative h-64 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80" 
                alt="Zen One Suite interieur"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 contrast-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#15191A] via-[#15191A]/40 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#A9875A] px-3 py-1 rounded-full bg-[#0B0D0E]/80 backdrop-blur-md border border-[#A9875A]/40">
                  Concept 01 • Intiem voor 2
                </span>
              </div>
            </div>

            <div className="p-8 pt-4 space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#A9875A]">
                    2 Personen • 2-3 Uur Tijdsloten
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-200/90 border border-amber-500/30">
                    Planned Experience
                  </span>
                </div>

                <h3 className="text-3xl font-serif text-[#F7F5F1] group-hover:text-white transition-colors">
                  ZEN ONE
                </h3>

                <p className="text-sm text-[#CBC8C0] font-light leading-relaxed">
                  Een intiem, architecturaal heiligdom gecreëerd voor twee gasten die verlangen naar ongehaaste intimiteit en akoestische stilte. Omgeven door warm cederhout, fluweelzachte schaduwen, een geurende Finse sauna en een dampend magnesiumbad.
                </p>

                <div className="space-y-2 pt-2 text-xs text-[#F7F5F1]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#A9875A]" />
                    <span>Sensuele Finse Panoramasauna met bergkruiden infusie</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#A9875A]" />
                    <span>Intiem magnesium hydromassage spa bad voor twee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#A9875A]" />
                    <span>Sensorial regendouche met aromatische mist & stortdouche</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#A9875A]" />
                    <span>Kingsize velvet loungebed met kaarslichtsfeer & bio-haard</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex items-center justify-between border-t border-white/5 mt-6">
                <div className="text-xs text-[#A9AAA7]">
                  Pre-launch tarief: <span className="text-[#F7F5F1] font-semibold">€200 / 2u</span> <span className="text-emerald-400 font-mono">(€150 na voucher)</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('/suites')}
                  className="text-xs uppercase font-semibold text-[#A9875A] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Bekijk suite</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Suite 2: ZEN SIGNATURE */}
          <div className="bg-[#15191A] rounded-2xl border-2 border-[#A9875A]/60 overflow-hidden flex flex-col justify-between relative group hover:border-[#A9875A] transition-all shadow-[0_15px_40px_rgba(169,135,90,0.2)]">
            <div className="relative h-64 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80" 
                alt="Zen Signature Suite interieur"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 contrast-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#15191A] via-[#15191A]/40 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#0B0D0E] font-bold px-3 py-1 rounded-full bg-gradient-to-r from-[#A9875A] to-[#C5A069] shadow-lg">
                  Master Suite • Romance & Royale Ruimte
                </span>
              </div>
            </div>

            <div className="p-8 pt-4 space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#A9875A]">
                    2 - 4 Personen • 2.5 - 4 Uur Tijdsloten
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-200/90 border border-amber-500/30">
                    Grand Experience
                  </span>
                </div>

                <h3 className="text-3xl font-serif text-[#F7F5F1] group-hover:text-white transition-colors">
                  ZEN SIGNATURE
                </h3>

                <p className="text-sm text-[#CBC8C0] font-light leading-relaxed">
                  De ultieme expressie van luxe intimiteit. Een royale master layout met duaal-klimaat sauna, zacht doordringende bio-fotonische infraroodwand, oversized magnesium vitality bad en een knisperende sfeerhaard voor onvergetelijke date nights.
                </p>

                <div className="space-y-2 pt-2 text-xs text-[#F7F5F1]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#A9875A]" />
                    <span>Duaal-klimaat Bio-Sauna met sensuele eucalyptus stoom</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#A9875A]" />
                    <span>Riante dubbele magnesium spa met gerichte rug- en beenjets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#A9875A]" />
                    <span>Roodlicht infraroodwand voor diepe warmte en celherstel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#A9875A]" />
                    <span>Bio-ethanol sfeerhaard, private bar & optioneel champagne-arrangement</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex items-center justify-between border-t border-white/5 mt-6">
                <div className="text-xs text-[#A9AAA7]">
                  Pre-launch tarief: <span className="text-[#F7F5F1] font-semibold">€200 / 2u</span> <span className="text-emerald-400 font-mono">(Master Suite)</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('/suites')}
                  className="text-xs uppercase font-semibold text-[#A9875A] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Bekijk suite</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. PRE-LAUNCH INTEGRITY & SCARCITY CALLOUT */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#15191A] border border-[#A9875A]/30 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A9875A]">
              100% Eerlijkheid & Transparantie
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#F7F5F1]">
              Geen nepreviews. Geen gefabriceerde data.
            </h2>
            <p className="text-xs sm:text-sm text-[#A9AAA7] leading-relaxed">
              RedZen Suites bouwt aan de toekomst van private hospitality in Nederland. Wij geloven in radicale transparantie: onze eerste locatie is nu in ontwikkeling en onze community bepaalt mede de exacte invulling en openingsdatum.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#A9875A]">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B0D0E] border border-white/10">
              <ShieldCheck className="w-4 h-4" /> 1.000 Early Access Caps
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B0D0E] border border-white/10">
              <Clock className="w-4 h-4" /> 48u Boekingsvoorsprong
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B0D0E] border border-white/10">
              <Sparkles className="w-4 h-4" /> Pre-launch Tariefgarantie
            </span>
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={scrollToFunnel}
              className="py-3.5 px-8 rounded-xl bg-[#A9875A] hover:bg-[#C5A069] text-[#0B0D0E] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
            >
              Word Early Access Member
            </button>
          </div>
        </div>
      </section>

      {/* 6. PARTNERS & INVESTORS TEASER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-8 rounded-2xl bg-[#15191A]/60 border border-white/10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#A9875A] uppercase">
                <Building2 className="w-4 h-4" />
                <span>Vastgoed & Locaties</span>
              </div>
              <h3 className="text-2xl font-serif text-[#F7F5F1]">
                Beschik je over een geschikte high-end locatie?
              </h3>
              <p className="text-xs text-[#A9AAA7] leading-relaxed">
                Wij zoeken commerciële begane-grondpanden (250m²–600m²) in de Randstad en grote centrumsteden voor langjarige huur of samenwerking.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/partners')}
              className="w-fit text-xs font-semibold uppercase tracking-wider text-[#A9875A] hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>Vastgoedvoorstel indienen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-8 rounded-2xl bg-[#15191A]/60 border border-white/10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#A9875A] uppercase">
                <HeartHandshake className="w-4 h-4" />
                <span>Groene Investeringen & Kredieten</span>
              </div>
              <h3 className="text-2xl font-serif text-[#F7F5F1]">
                Zero-emission wellness met subsidies & kredietdossier
              </h3>
              <p className="text-xs text-[#A9AAA7] leading-relaxed">
                Bekijk onze cashflow-berekeningen, veilige DSCR-dekkingsgraad en subsidie-stacking (MIA/EIA & Qredits kredietmemorandum).
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/invest')}
              className="w-fit text-xs font-semibold uppercase tracking-wider text-[#A9875A] hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>Krediet- & Investeringsdossier</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};

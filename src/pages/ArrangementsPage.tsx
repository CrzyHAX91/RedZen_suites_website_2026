import React from 'react';
import { PageRoute } from '../types';
import { Sparkles, Moon, Heart, Flame, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

interface ArrangementsPageProps {
  onNavigate: (path: PageRoute) => void;
}

export const ArrangementsPage: React.FC<ArrangementsPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15191A] border border-[#A9875A]/40 text-[#A9875A] text-xs font-mono uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#A9875A] animate-pulse" />
          Rituelen & Tijdsloten
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif text-[#F7F5F1] leading-tight">
          Curated Private Tijdsloten.
        </h1>
        <p className="text-base sm:text-lg text-[#A9AAA7] font-light leading-relaxed">
          Geen standaard bezoek, maar een doelgericht ontspanningsritueel. Kies uit onze geplande signature arrangementen.
        </p>

        <div className="p-4 rounded-xl bg-[#15191A] border border-white/10 text-xs text-[#A9AAA7] font-mono">
          📌 <em>Let op: Arrangementen zijn conceptueel en worden definitief geactiveerd bij de opening van onze eerste locatie.</em>
        </div>
      </div>

      {/* 3 Signature Arrangements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Ritual 1 */}
        <div className="p-8 rounded-3xl bg-[#15191A] border border-[#A9875A]/25 flex flex-col justify-between space-y-6 hover:border-[#A9875A] transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-[#0B0D0E] text-[#A9875A] border border-white/5">
                <Moon className="w-5 h-5" />
              </span>
              <span className="text-xs font-mono text-[#A9875A] uppercase font-semibold">
                2 Uur • Decompressie
              </span>
            </div>

            <h3 className="text-2xl font-serif text-[#F7F5F1]">The Deep Reset</h3>
            <p className="text-xs text-[#A9AAA7] leading-relaxed">
              Ontworpen voor overprikkelde professionals en rustzoekers. Een minimalistische opeenvolging van sauna, koud afspoelen en magnesium bad.
            </p>

            <div className="space-y-2 pt-2 text-xs text-[#F7F5F1]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#A9875A]" />
                <span>Kalmerende cederhout & dennen infusie</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#A9875A]" />
                <span>Geactiveerde magnesiumzouten in spa</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#A9875A]" />
                <span>Bio-ontspanningskruidenthee in suite</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <button
              type="button"
              onClick={() => onNavigate('/early-access')}
              className="w-full py-3 rounded-xl bg-[#0B0D0E] hover:bg-[#A9875A] hover:text-[#0B0D0E] border border-white/10 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Kies via Early Access
            </button>
          </div>
        </div>

        {/* Ritual 2 */}
        <div className="p-8 rounded-3xl bg-[#1C2224] border-2 border-[#A9875A] flex flex-col justify-between space-y-6 shadow-[0_0_35px_rgba(169,135,90,0.25)] relative overflow-hidden group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-[#0B0D0E] text-[#A9875A] border border-[#A9875A]/40 shadow-[0_0_12px_rgba(169,135,90,0.3)]">
                <Heart className="w-5 h-5 text-rose-400" />
              </span>
              <span className="text-xs font-mono text-[#A9875A] uppercase font-bold tracking-wider">
                2.5 Uur • Sensual Date Night ⭐
              </span>
            </div>

            <h3 className="text-2xl font-serif text-[#F7F5F1]">The Sensual Retreat</h3>
            <p className="text-xs text-[#CBC8C0] leading-relaxed">
              Het meest geliefde arrangement voor geliefden. Zwoele zachte roodlicht- en kaarslichtambiance, gekoelde champagne of artisanale sparking thee, en pure ontspanning voor twee.
            </p>

            <div className="space-y-2 pt-2 text-xs text-[#F7F5F1]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Gekoelde champagne & biologische pure cacaotruffels</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Damaskroos, jasmijn & sandelhout aromatherapie</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Verlengde lounge tijd bij de sfeerhaard op fluwelen daybed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Zijdezacht magnesiumbad met rozenscrub</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => onNavigate('/early-access')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#A9875A] to-[#C5A069] text-[#0B0D0E] hover:brightness-110 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg"
            >
              Kies Sensual Retreat
            </button>
          </div>
        </div>

        {/* Ritual 3 */}
        <div className="p-8 rounded-3xl bg-[#15191A] border border-[#A9875A]/25 flex flex-col justify-between space-y-6 hover:border-[#A9875A] transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-[#0B0D0E] text-[#A9875A] border border-white/5">
                <Flame className="w-5 h-5" />
              </span>
              <span className="text-xs font-mono text-[#A9875A] uppercase font-semibold">
                3 Uur • Vitaliteit & Herstel
              </span>
            </div>

            <h3 className="text-2xl font-serif text-[#F7F5F1]">The Vitality Ritual</h3>
            <p className="text-xs text-[#A9AAA7] leading-relaxed">
              Diepe fysiologische boost. Wisselbaden, intense sauna warmte (90°C), ijsstortdouches en full-spectrum infrarood voor spierherstel.
            </p>

            <div className="space-y-2 pt-2 text-xs text-[#F7F5F1]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#A9875A]" />
                <span>Eucalyptus opgieting met scrubzout</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#A9875A]" />
                <span>Cold hydro shocktherapie</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#A9875A]" />
                <span>Koudgeperste gember- & kurkuma elixirs</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <button
              type="button"
              onClick={() => onNavigate('/early-access')}
              className="w-full py-3 rounded-xl bg-[#0B0D0E] hover:bg-[#A9875A] hover:text-[#0B0D0E] border border-white/10 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Kies via Early Access
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

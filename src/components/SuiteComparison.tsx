import React from 'react';
import { Check, Sparkles, Clock, Users, Shield } from 'lucide-react';
import { SUITE_COMPARISON_DATA } from '../data/suites';

interface SuiteComparisonProps {
  onSelectSuite?: (suiteKey: string) => void;
}

export const SuiteComparison: React.FC<SuiteComparisonProps> = ({ onSelectSuite }) => {
  return (
    <section aria-labelledby="suite-comparison-heading" className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#A9875A]">
          Directe Vergelijking
        </span>
        <h2 id="suite-comparison-heading" className="text-3xl sm:text-4xl font-serif text-[#F7F5F1]">
          Kies de suite die past bij jouw moment.
        </h2>
        <p className="text-sm text-[#A9AAA7] font-light">
          Iedere RedZen-suite is 100% autonoom en privé. Vergelijk de specificaties van het geplande ZEN ONE en ZEN SIGNATURE concept.
        </p>
      </div>

      {/* Desktop Table Presentation */}
      <div className="hidden md:block rounded-2xl bg-[#15191A] border border-white/10 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-3 bg-[#111415] border-b border-white/10 p-6 text-sm font-mono uppercase tracking-wider">
          <div className="text-[#A9AAA7] font-medium self-center">Specificaties</div>
          <div className="text-center px-4">
            <div className="font-serif text-xl normal-case tracking-normal text-[#F7F5F1] font-normal">ZEN ONE</div>
            <span className="text-[10px] text-[#A9875A] font-mono tracking-widest block mt-0.5">Intimate • 1-2 pers</span>
          </div>
          <div className="text-center px-4 border-l border-white/5">
            <div className="font-serif text-xl normal-case tracking-normal text-[#A9875A] font-normal">ZEN SIGNATURE</div>
            <span className="text-[10px] text-[#A9AAA7] font-mono tracking-widest block mt-0.5">Grand • 2-4 pers</span>
          </div>
        </div>

        <div className="divide-y divide-white/5 text-sm">
          {SUITE_COMPARISON_DATA.map((row, idx) => (
            <div key={idx} className="grid grid-cols-3 p-5 items-center hover:bg-white/[0.02] transition-colors">
              <div className="font-medium text-[#F7F5F1] text-xs font-mono uppercase tracking-wide flex items-center gap-2">
                <span>{row.feature}</span>
                {row.isPlanned && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-[#A9AAA7] font-mono font-normal tracking-normal">
                    planned
                  </span>
                )}
              </div>

              <div className="text-center px-4 text-[#C5C4BE] text-xs">
                {typeof row.zenOne === 'boolean' ? (
                  row.zenOne ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400">
                      <Check className="w-3.5 h-3.5" />
                      <span className="sr-only">Inbegrepen in Zen One</span>
                    </span>
                  ) : (
                    <span className="text-white/20">—</span>
                  )
                ) : (
                  <span>{row.zenOne}</span>
                )}
              </div>

              <div className="text-center px-4 text-[#F7F5F1] text-xs font-medium border-l border-white/5">
                {typeof row.zenSignature === 'boolean' ? (
                  row.zenSignature ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#A9875A]/20 text-[#A9875A]">
                      <Check className="w-3.5 h-3.5" />
                      <span className="sr-only">Inbegrepen in Zen Signature</span>
                    </span>
                  ) : (
                    <span className="text-white/20">—</span>
                  )
                ) : (
                  <span className="text-[#A9875A]">{row.zenSignature}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Row */}
        <div className="grid grid-cols-3 bg-[#0B0D0E]/60 p-6 border-t border-white/10 items-center">
          <div className="text-xs text-[#A9AAA7] font-mono">
            Vaste indicatieve pre-launch tarieven
          </div>
          <div className="text-center px-4">
            <button
              type="button"
              onClick={() => onSelectSuite && onSelectSuite('suite_zen_one')}
              className="py-2.5 px-5 rounded-xl bg-[#1C2224] hover:bg-[#A9875A] hover:text-[#0B0D0E] text-[#F7F5F1] text-xs font-mono uppercase tracking-wider transition-all border border-white/10 cursor-pointer"
            >
              Selecteer Zen One
            </button>
          </div>
          <div className="text-center px-4 border-l border-white/5">
            <button
              type="button"
              onClick={() => onSelectSuite && onSelectSuite('suite_zen_signature')}
              className="py-2.5 px-5 rounded-xl bg-[#A9875A] hover:bg-[#C5A069] text-[#0B0D0E] text-xs font-mono uppercase font-bold tracking-wider transition-all shadow-md cursor-pointer"
            >
              Selecteer Zen Signature
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Stacked Responsive Cards (Accessible, no horizontal scroll blowout) */}
      <div className="md:hidden space-y-6">
        
        {/* Card 1: Zen One */}
        <div className="p-6 rounded-2xl bg-[#15191A] border border-white/10 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A9875A] block">Concept 01</span>
              <h3 className="text-2xl font-serif text-[#F7F5F1]">ZEN ONE</h3>
            </div>
            <span className="text-xs font-mono text-[#A9AAA7]">1 – 2 pers</span>
          </div>

          <div className="space-y-3 divide-y divide-white/5 text-xs">
            {SUITE_COMPARISON_DATA.map((row, idx) => (
              <div key={idx} className="pt-2.5 flex items-start justify-between gap-3">
                <span className="text-[#A9AAA7] font-mono">{row.feature}:</span>
                <span className="text-right text-[#F7F5F1] font-medium">{String(row.zenOne)}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onSelectSuite && onSelectSuite('suite_zen_one')}
            className="w-full py-3.5 rounded-xl bg-[#1C2224] text-[#F7F5F1] text-xs font-mono uppercase tracking-wider border border-white/10 active:scale-[0.98] transition-all cursor-pointer"
          >
            Selecteer ZEN ONE
          </button>
        </div>

        {/* Card 2: Zen Signature */}
        <div className="p-6 rounded-2xl bg-[#15191A] border border-[#A9875A]/40 space-y-5 relative">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A9875A] block">Concept 02</span>
              <h3 className="text-2xl font-serif text-[#A9875A]">ZEN SIGNATURE</h3>
            </div>
            <span className="text-xs font-mono text-[#A9AAA7]">2 – 4 pers</span>
          </div>

          <div className="space-y-3 divide-y divide-white/5 text-xs">
            {SUITE_COMPARISON_DATA.map((row, idx) => (
              <div key={idx} className="pt-2.5 flex items-start justify-between gap-3">
                <span className="text-[#A9AAA7] font-mono">{row.feature}:</span>
                <span className="text-right text-[#F7F5F1] font-medium">{String(row.zenSignature)}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onSelectSuite && onSelectSuite('suite_zen_signature')}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#A9875A] to-[#C5A069] text-[#0B0D0E] text-xs font-mono uppercase font-bold tracking-wider shadow-lg active:scale-[0.98] transition-all cursor-pointer"
          >
            Selecteer ZEN SIGNATURE
          </button>
        </div>

      </div>
    </section>
  );
};

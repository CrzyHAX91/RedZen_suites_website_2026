import React, { useState } from 'react';
import { PRICE_LABEL, PRICE_NOTICE } from '../data/bookingStatus';
import { PageRoute } from '../types';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';

interface SuiteConfiguratorProps {
  onSelectAndNavigate?: (path: PageRoute) => void;
}

export const SuiteConfigurator: React.FC<SuiteConfiguratorProps> = ({ onSelectAndNavigate }) => {
  const [suiteType, setSuiteType] = useState<'one' | 'signature'>('one');
  const suites = [
    { id: 'one' as const, name: 'Zen One Suite', description: 'Concept voor een intieme privésuite met sauna, douche en lounge.' },
    { id: 'signature' as const, name: 'Zen Signature Master', description: 'Concept voor een ruimere privésuite met aanvullende wellnessvoorzieningen.' },
  ];

  return <section aria-labelledby="suite-configurator-title" className="bg-[#15191A] rounded-3xl border border-[#A9875A]/30 p-5 sm:p-10 space-y-8 shadow-2xl">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-[#A9875A] text-xs mb-2"><Sparkles className="w-4 h-4 shrink-0" />Suiteconcepten in ontwikkeling</p>
        <h3 id="suite-configurator-title" className="text-2xl sm:text-3xl font-serif">Ontdek jouw privésessie</h3>
        <p className="text-sm text-[#CBC8C0] mt-2">Bekijk de concepten. De definitieve locatie en voorzieningen zijn nog niet bevestigd.</p>
      </div>
      <div className="shrink-0 p-4 rounded-2xl bg-[#0B0D0E] border border-[#A9875A]/40">
        <p className="text-xs text-[#CBC8C0]">Standaardtarief</p>
        <p className="text-2xl font-serif text-[#F7F5F1]">{PRICE_LABEL}</p>
      </div>
    </div>
    <fieldset className="space-y-3">
      <legend className="text-sm text-[#A9875A] mb-3">Welk suiteconcept spreekt je aan?</legend>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suites.map(suite => <button key={suite.id} type="button" aria-pressed={suiteType === suite.id}
          onClick={() => setSuiteType(suite.id)}
          className={`min-h-12 p-5 rounded-2xl border text-left space-y-2 ${suiteType === suite.id ? 'bg-[#0B0D0E] border-[#A9875A] ring-1 ring-[#A9875A]' : 'border-white/20'}`}>
          <span className="block font-serif text-lg">{suite.name}</span>
          <span className="block text-sm text-[#CBC8C0]">{suite.description}</span>
          <span className="block text-sm text-[#E8C58D]">{PRICE_LABEL}</span>
        </button>)}
      </div>
    </fieldset>
    <div className="space-y-3 text-sm text-[#CBC8C0]">
      <p className="flex items-center gap-2"><Clock className="w-4 h-4 shrink-0" />Twee uur privéwellness</p>
      <p>{PRICE_NOTICE}</p>
      <p>Verlengingen, rituelen en het aantal inbegrepen gasten worden vóór de boekingsopening bevestigd. Er worden nu geen extra’s berekend.</p>
    </div>
    <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <p className="text-sm text-[#CBC8C0]">Je bekijkt een concept. Deze selectie wordt niet opgeslagen en is geen reservering of betaling.</p>
      <button type="button" onClick={() => onSelectAndNavigate?.('/early-access')}
        className="w-full sm:w-auto shrink-0 min-h-12 py-3 px-5 rounded-xl bg-[#C5A069] text-[#0B0D0E] font-bold text-sm flex items-center justify-center gap-2">
        Early Access aanvragen<ArrowRight className="w-4 h-4 shrink-0" />
      </button>
    </div>
  </section>;
};

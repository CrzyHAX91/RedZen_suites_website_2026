import React, { useState } from 'react';
import { PageRoute } from '../types';
import { Sparkles, Clock, Check, ArrowRight, Flame, Droplets, Wind, Heart, Coffee } from 'lucide-react';

interface SuiteConfiguratorProps {
  onSelectAndNavigate?: (path: PageRoute) => void;
}

export const SuiteConfigurator: React.FC<SuiteConfiguratorProps> = ({ onSelectAndNavigate }) => {
  const [suiteType, setSuiteType] = useState<'one' | 'signature'>('signature');
  const [duration, setDuration] = useState<2 | 3>(2);
  const [selectedRituals, setSelectedRituals] = useState<string[]>(['magnesium', 'aroma']);

  // Pricing Model - €200 per 2 hours base rate to ensure sustainable operations without subsidies
  const basePrices = {
    one: { 2: 200, 3: 275 },
    signature: { 2: 200, 3: 285 },
  };

  const rituals = [
    { id: 'magnesium', name: 'Magnesium Flakes Spa', price: 19, icon: Droplets, desc: '99% zuiver Zechstein magnesium voor spierherstel' },
    { id: 'aroma', name: 'Signature Cedarwood Aufguss', price: 15, icon: Wind, desc: 'Natuurlijke etherische oliën van ceder en eucalyptus' },
    { id: 'tea', name: 'Artisan Herbal Tea & Bites Pairing', price: 22, icon: Coffee, desc: 'Biologische kruidenthee en biologische rauwe chocolade' },
    { id: 'ice', name: 'Cold Plunge Ritual Pack', price: 18, icon: Flame, desc: 'Afkoelingsgids met biologische ijsbad mint sprays' },
    { id: 'romance', name: 'Sensual Velvet Romance Pack', price: 39, icon: Heart, desc: 'Gekoelde fles bio-champagne, pure cacao truffels & rozenblaadjes bij kaarslicht' },
  ];

  const toggleRitual = (id: string) => {
    setSelectedRituals(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const basePrice = basePrices[suiteType][duration];
  const ritualsTotal = selectedRituals.reduce((sum, rId) => {
    const item = rituals.find(r => r.id === rId);
    return sum + (item ? item.price : 0);
  }, 0);

  const totalPrice = basePrice + ritualsTotal;

  return (
    <div className="bg-[#15191A] rounded-3xl border border-[#A9875A]/30 p-6 sm:p-10 space-y-8 shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B0D0E] border border-[#A9875A]/40 text-[#A9875A] text-xs font-mono uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactieve Suite Configurator</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif text-[#F7F5F1]">Stel jouw privésessie samen</h3>
          <p className="text-xs sm:text-sm text-[#A9AAA7] font-light mt-1">
            Ontdek de mogelijkheden van onze suites en bereken direct jouw indicatieve pre-launch sessietarief.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B0D0E] border border-[#A9875A]/40 text-right sm:min-w-[170px]">
          <span className="text-[10px] font-mono uppercase text-[#A9AAA7] block">Indicatief Totaal</span>
          <div className="text-3xl font-serif text-[#F7F5F1] font-medium">
            €{totalPrice}
          </div>
          <span className="text-[10px] text-[#A9875A] font-mono">voor 2 personen incl. btw</span>
        </div>
      </div>

      {/* Step 1: Choose Suite */}
      <div className="space-y-3">
        <label className="block text-xs font-mono uppercase tracking-widest text-[#A9875A]">
          1. Kies jouw Suite Type
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={() => setSuiteType('one')}
            className={`p-5 rounded-2xl cursor-pointer transition-all border ${
              suiteType === 'one'
                ? 'bg-[#0B0D0E] border-[#A9875A] shadow-lg shadow-[#A9875A]/10 ring-1 ring-[#A9875A]'
                : 'bg-[#0B0D0E]/50 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif text-lg text-[#F7F5F1]">Zen One Suite</span>
              <span className="text-xs font-mono text-[#A9875A]">€200 / 2 uur</span>
            </div>
            <p className="text-xs text-[#A9AAA7] leading-relaxed">
              Minimalistische 2-persoons suite met Finse cederhouten sauna, stortdouche en discrete lounge.
            </p>
          </div>

          <div 
            onClick={() => setSuiteType('signature')}
            className={`p-5 rounded-2xl cursor-pointer transition-all border relative ${
              suiteType === 'signature'
                ? 'bg-[#0B0D0E] border-[#A9875A] shadow-lg shadow-[#A9875A]/10 ring-1 ring-[#A9875A]'
                : 'bg-[#0B0D0E]/50 border-white/5 hover:border-white/20'
            }`}
          >
            <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-[#A9875A] text-[#0B0D0E] font-bold">
              Meest Populair
            </span>
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif text-lg text-[#F7F5F1]">Zen Signature Master</span>
              <span className="text-xs font-mono text-[#A9875A]">€200 / 2 uur</span>
            </div>
            <p className="text-xs text-[#A9AAA7] leading-relaxed">
              Volledige private master wellness met Bio-Sauna, dubbele magnesium spa, infraroodwand & haard.
            </p>
          </div>
        </div>
      </div>

      {/* Step 2: Duration */}
      <div className="space-y-3">
        <label className="block text-xs font-mono uppercase tracking-widest text-[#A9875A]">
          2. Tijdsduur
        </label>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setDuration(2)}
            className={`py-3.5 px-4 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border ${
              duration === 2
                ? 'bg-[#0B0D0E] border-[#A9875A] text-[#F7F5F1] shadow'
                : 'bg-[#0B0D0E]/40 border-white/5 text-[#A9AAA7] hover:border-white/20'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#A9875A]" />
            <span>2 Uur Privé Sessie</span>
          </button>

          <button
            type="button"
            onClick={() => setDuration(3)}
            className={`py-3.5 px-4 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border ${
              duration === 3
                ? 'bg-[#0B0D0E] border-[#A9875A] text-[#F7F5F1] shadow'
                : 'bg-[#0B0D0E]/40 border-white/5 text-[#A9AAA7] hover:border-white/20'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#A9875A]" />
            <span>3 Uur Uitgebreide Rust (+€{suiteType === 'one' ? 50 : 60})</span>
          </button>
        </div>
      </div>

      {/* Step 3: Add-on Rituals */}
      <div className="space-y-3">
        <label className="block text-xs font-mono uppercase tracking-widest text-[#A9875A]">
          3. Optionele Zintuiglijke Rituelen
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rituals.map((r) => {
            const Icon = r.icon;
            const isChecked = selectedRituals.includes(r.id);
            return (
              <div
                key={r.id}
                onClick={() => toggleRitual(r.id)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border flex items-start justify-between gap-3 ${
                  isChecked
                    ? 'bg-[#0B0D0E] border-[#A9875A]/80 text-[#F7F5F1]'
                    : 'bg-[#0B0D0E]/40 border-white/5 text-[#A9AAA7] hover:border-white/15'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 ${isChecked ? 'bg-[#A9875A] text-[#0B0D0E]' : 'bg-[#15191A] text-neutral-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-medium font-serif block text-[#F7F5F1]">
                      {r.name}
                    </span>
                    <span className="text-[11px] text-[#A9AAA7] leading-tight block mt-0.5">
                      {r.desc}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono text-[#A9875A] font-bold block">
                    +€{r.price}
                  </span>
                  <div className={`w-4 h-4 rounded-md border mt-1.5 ml-auto flex items-center justify-center ${
                    isChecked ? 'bg-[#A9875A] border-[#A9875A] text-[#0B0D0E]' : 'border-white/20'
                  }`}>
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Action Bar */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-[#A9AAA7] text-center sm:text-left">
          <span>✨ Selectie opgeslagen voor jouw Early Access lidmaatschap.</span>
        </div>

        <button
          type="button"
          onClick={() => onSelectAndNavigate ? onSelectAndNavigate('/early-access') : undefined}
          className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-gradient-to-r from-[#A9875A] to-[#C5A069] text-[#0B0D0E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 shadow-lg cursor-pointer transition-all"
        >
          <span>Claim Jouw Plek Met Deze Voorkeuren</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

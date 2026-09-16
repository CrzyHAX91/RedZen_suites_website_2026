import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Coins, 
  Gift, 
  Check, 
  ArrowRight,
  Award,
  Lock,
  Layers,
  HelpCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface TierOption {
  id: string;
  name: string;
  badge: string;
  investment: number;
  interestRate: number; // e.g. 6%
  tenureYears: number; // e.g. 3 years
  freeSessionsPerYear: number; // 2 sessions per year
  perks: string[];
  isPopular?: boolean;
}

const TIERS: TierOption[] = [
  {
    id: 'supporter',
    name: 'Silver Supporter',
    badge: 'Ideale Vrienden-Instap',
    investment: 1000,
    interestRate: 5.0,
    tenureYears: 3,
    freeSessionsPerYear: 2,
    perks: [
      '5% Vaste Rente per jaar (€50/jr)',
      '2 gratis wellness-sessies p/jr (t.w.v. €400)',
      '10% vriendenkorting op alle extra sessies',
      'VIP voorrang bij opening'
    ]
  },
  {
    id: 'founder',
    name: 'Gold Founder',
    badge: '⭐ Meest Gekozen & Hoogste Waarde',
    investment: 2500,
    interestRate: 6.0,
    tenureYears: 3,
    freeSessionsPerYear: 4,
    isPopular: true,
    perks: [
      '6% Vaste Rente per jaar (€150/jr)',
      '4 gratis wellness-sessies p/jr (t.w.v. €800)',
      '15% levenslange Friends-korting',
      'Exclusieve Founders Member Keycard',
      'Uitnodiging voor VIP Pre-Opening Night'
    ]
  },
  {
    id: 'patron',
    name: 'Platinum Patron',
    badge: 'Maximale Privilege & Rendement',
    investment: 5000,
    interestRate: 7.0,
    tenureYears: 3,
    freeSessionsPerYear: 8,
    perks: [
      '7% Vaste Rente per jaar (€350/jr)',
      '8 gratis wellness-sessies p/jr (t.w.v. €1.600)',
      'Gepersonaliseerde messing Founders Plaquette in de suite',
      '20% levenslange Friends & Family korting',
      'Ongelimiteerde 72u boekingsvoorrang'
    ]
  }
];

export const FriendsAndFamilyCalculator: React.FC = () => {
  const [selectedTierId, setSelectedTierId] = useState<string>('founder');
  const [activeTab, setActiveTab] = useState<'calculator' | 'comparison' | 'legal'>('calculator');
  
  const selectedTier = TIERS.find(t => t.id === selectedTierId) || TIERS[1];

  // Calculations for friend (investor)
  const yearlyCashInterest = selectedTier.investment * (selectedTier.interestRate / 100);
  const totalCashInterest = yearlyCashInterest * selectedTier.tenureYears;
  const sessionValue = 200; // €200 retail value per 2-hour session
  const yearlySessionValue = selectedTier.freeSessionsPerYear * sessionValue;
  const totalSessionValue = yearlySessionValue * selectedTier.tenureYears;
  const totalFriendValue = selectedTier.investment + totalCashInterest + totalSessionValue;
  const annualTotalYieldPercent = ((yearlyCashInterest + yearlySessionValue) / selectedTier.investment) * 100;

  // Calculations for RedZen (Entrepreneur cost)
  const redzenDirectCostPerSession = 36; // bio-clean + electricity/water
  const yearlyRedzenSessionCost = selectedTier.freeSessionsPerYear * redzenDirectCostPerSession;
  const yearlyTotalRedzenCost = yearlyCashInterest + yearlyRedzenSessionCost;
  const totalRedzenCostOverTenure = yearlyTotalRedzenCost * selectedTier.tenureYears;
  const netFinancingRetained = selectedTier.investment - totalRedzenCostOverTenure;

  return (
    <section id="friends-founders" className="rounded-3xl bg-gradient-to-b from-[#141819] via-[#161B1D] to-[#0E1112] border-2 border-[#A9875A]/50 p-6 sm:p-10 shadow-2xl space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B0D0E] border border-[#A9875A]/60 text-xs font-mono text-[#A9875A] uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5 text-[#A9875A]" />
            <span>Friends, Family & Community Angel Round</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif text-[#F7F5F1] leading-tight">
            Vrienden & Founders Investeringsmodel
          </h2>
          <p className="text-xs sm:text-sm text-[#A9AAA7] font-light leading-relaxed">
            Investeer mee in de eerste RedZen suite vanaf €1.000. Combineer een gegarandeerde <strong>5% tot 7% vaste rente</strong> met <strong>jaarlijks gratis privésessies</strong> en exclusieve Founders privileges.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B0D0E] border border-[#A9875A]/30 text-right shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A9875A] block">Effectief Vrienden-Rendement</span>
          <span className="text-2xl sm:text-3xl font-serif text-emerald-400 font-bold">
            {annualTotalYieldPercent.toFixed(1)}% p.j.
          </span>
          <span className="text-[10px] font-mono text-[#A9AAA7] block">Rente + Wellness Tegoed gecombineerd</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'calculator'
              ? 'bg-[#A9875A]/20 text-[#A9875A] border border-[#A9875A]/50'
              : 'text-[#A9AAA7] hover:text-white bg-[#0B0D0E]/60 border border-transparent'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>1. Pakketkeuze & Rendement Calculator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'comparison'
              ? 'bg-[#A9875A]/20 text-[#A9875A] border border-[#A9875A]/50'
              : 'text-[#A9AAA7] hover:text-white bg-[#0B0D0E]/60 border border-transparent'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>2. Waarom verdient dit het best? (Winstanalyse)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('legal')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'legal'
              ? 'bg-[#A9875A]/20 text-[#A9875A] border border-[#A9875A]/50'
              : 'text-[#A9AAA7] hover:text-white bg-[#0B0D0E]/60 border border-transparent'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>3. Juridische Structuur & Zekerheid</span>
        </button>
      </div>

      {/* TAB 1: CALCULATOR & TIER SELECTION */}
      {activeTab === 'calculator' && (
        <div className="space-y-8">
          
          {/* Tier Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier) => {
              const isSelected = tier.id === selectedTierId;
              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTierId(tier.id)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-gradient-to-b from-[#1C2224] to-[#121617] border-2 border-[#A9875A] shadow-[0_0_30px_rgba(169,135,90,0.2)] scale-[1.02]' 
                      : 'bg-[#0B0D0E]/80 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {tier.isPopular && (
                    <div className="absolute top-0 right-0 bg-[#A9875A] text-[#0B0D0E] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl font-mono">
                      ⭐ POPULAIR
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#A9875A] block">
                        {tier.badge}
                      </span>
                      <h3 className="text-xl font-serif text-[#F7F5F1] font-bold">
                        {tier.name}
                      </h3>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#0B0D0E] border border-white/5 space-y-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-[#A9AAA7] font-mono">Inleg:</span>
                        <span className="text-2xl font-serif text-[#F7F5F1] font-bold">
                          €{tier.investment.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between text-xs font-mono text-[#A9875A]">
                        <span>Vaste rente:</span>
                        <span className="font-bold">{tier.interestRate}% p.j. ({tier.tenureYears} jr)</span>
                      </div>
                      <div className="flex items-baseline justify-between text-xs font-mono text-emerald-400">
                        <span>Gratis sessies:</span>
                        <span className="font-bold">{tier.freeSessionsPerYear}x p.j. (t.w.v. €{tier.freeSessionsPerYear * 200})</span>
                      </div>
                    </div>

                    <ul className="space-y-2 pt-2 text-xs text-[#A9AAA7]">
                      {tier.perks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#A9875A] shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                        isSelected 
                          ? 'bg-[#A9875A] text-[#0B0D0E]' 
                          : 'bg-[#15191A] text-[#A9AAA7] hover:text-white border border-white/5'
                      }`}
                    >
                      {isSelected ? 'Geselecteerd' : 'Selecteer Pakket'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Breakdown Scoreboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Friend Yield Card */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-gradient-to-br from-[#1B2123] to-[#121516] border border-[#A9875A]/60 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono uppercase text-[#A9875A] tracking-wider font-bold">
                  Wat levert dit op voor de Vriend / Investeerder?
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                  {annualTotalYieldPercent.toFixed(1)}% / Jaar
                </span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between text-[#A9AAA7]">
                  <span>Oorspronkelijke Inleg (Aflossing na {selectedTier.tenureYears} jr):</span>
                  <span className="text-[#F7F5F1] font-bold">€{selectedTier.investment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#A9AAA7]">
                  <span>Totale Rente ({selectedTier.tenureYears} jaar @ {selectedTier.interestRate}%):</span>
                  <span className="text-emerald-400 font-bold">+€{totalCashInterest.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#A9AAA7]">
                  <span>Totale Wellnesswaarde ({selectedTier.freeSessionsPerYear * selectedTier.tenureYears} sessies @ €200):</span>
                  <span className="text-[#A9875A] font-bold">+€{totalSessionValue.toLocaleString()}</span>
                </div>

                <div className="p-4 rounded-xl bg-[#0B0D0E] border border-white/5 flex items-center justify-between pt-3 mt-2">
                  <span className="text-xs text-[#F7F5F1] font-bold uppercase">Totale Waardeontvangst:</span>
                  <span className="text-xl font-serif text-[#F7F5F1] font-bold">
                    €{totalFriendValue.toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#A9AAA7] leading-relaxed">
                💡 <em>Een vriend die €{selectedTier.investment.toLocaleString()} inlegt, ontvangt jaarlijks <strong>€{yearlyCashInterest}</strong> aan cash rente én <strong>{selectedTier.freeSessionsPerYear} wellness-sessies</strong> t.w.v. €{yearlySessionValue}.</em>
              </p>
            </div>

            {/* RedZen Founder Advantage Card */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0B0D0E]/90 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono uppercase text-[#F7F5F1] tracking-wider font-bold">
                  Waarom is dit extreem winstgevend voor RedZen?
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#A9875A]/20 text-[#A9875A] text-xs font-mono font-bold">
                  Hoge Marge-Hefboom
                </span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between text-[#A9AAA7]">
                  <span>Opgehaalde Liquiditeit voor de verbouwing:</span>
                  <span className="text-emerald-400 font-bold">+€{selectedTier.investment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#A9AAA7]">
                  <span>Jaarlijkse cash renteverplichting:</span>
                  <span className="text-amber-400">-€{yearlyCashInterest}/jr</span>
                </div>
                <div className="flex justify-between text-[#A9AAA7]">
                  <span>Werkelijke kostprijs voor RedZen van de gratis sessies:</span>
                  <span className="text-blue-400">Slechts €{yearlyRedzenSessionCost}/jr (€36/sessie)</span>
                </div>

                <div className="p-4 rounded-xl bg-[#15191A] border border-white/5 space-y-1">
                  <div className="flex justify-between text-xs text-[#A9875A] font-bold">
                    <span>Totale Kosten RedZen over {selectedTier.tenureYears} jaar:</span>
                    <span>€{totalRedzenCostOverTenure}</span>
                  </div>
                  <div className="flex justify-between text-xs text-emerald-400 font-bold pt-1 border-t border-white/5">
                    <span>Directe Netto Liquiditeitshefboom:</span>
                    <span>€{netFinancingRetained} ({(netFinancingRetained / selectedTier.investment * 100).toFixed(0)}%)</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[#A9AAA7] leading-relaxed">
                🛡️ <em>Doordat een 2-uurs sessie slechts ~€36 kost aan bio-linnen en energie, 'betaal' je jouw vrienden voornamelijk in overtollige capaciteit en luxe hospitality, terwijl jij 100% harde liquiditeit binnenhaalt!</em>
              </p>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: COMPARISON MATRIX */}
      {activeTab === 'comparison' && (
        <div className="p-6 rounded-2xl bg-[#0B0D0E] border border-white/10 space-y-6">
          <div className="max-w-3xl space-y-2">
            <h3 className="text-lg font-serif text-[#F7F5F1]">
              Winst- en Kostenvergelijking: Vriendenlening vs. Bank vs. Aandelen
            </h3>
            <p className="text-xs text-[#A9AAA7] leading-relaxed">
              Waarom is het hybride vriendenmodel (Rente + Wellness) voor zowel de ondernemer als de investeerder verreweg de beste optie?
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-[#A9875A]">
                  <th className="py-3 px-4">Financieringsvorm</th>
                  <th className="py-3 px-4">Kosten voor RedZen</th>
                  <th className="py-3 px-4">Rendement voor Investeerder</th>
                  <th className="py-3 px-4">Aandelenverlies?</th>
                  <th className="py-3 px-4">Snelheid & Papierwerk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[#A9AAA7]">
                <tr className="bg-[#A9875A]/10 text-[#F7F5F1]">
                  <td className="py-3.5 px-4 font-bold text-[#A9875A]">Hybride Vriendenlening (Aanbevolen ⭐)</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">Laag (uitbetaling in wellness t.w.v. €36 kostprijs)</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">&gt; 14% tot 24% p.j. (Rente + Wellness)</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">0% (Behoud 100% eigendom)</td>
                  <td className="py-3.5 px-4 text-[#F7F5F1]">Binnen 24 uur (Standaard leningovereenkomst)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Commerciële Banklening</td>
                  <td className="py-3.5 px-4 text-red-400">Hoog (8% - 11% cash rente)</td>
                  <td className="py-3.5 px-4">Bank incasseert rente</td>
                  <td className="py-3.5 px-4">Nee</td>
                  <td className="py-3.5 px-4 text-amber-400">Traag (4-8 weken aanvraagtijd)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Aandelen / Venture Capital</td>
                  <td className="py-3.5 px-4 text-red-400">Zeer hoog (verlies toekomstige winst & zeggenschap)</td>
                  <td className="py-3.5 px-4">Onzeker (pas bij verkoop bedrijf)</td>
                  <td className="py-3.5 px-4 text-red-400">Ja (10% - 25% afstaan)</td>
                  <td className="py-3.5 px-4 text-red-400">Dure notaris & aandeelhoudersovereenkomst</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Spaarrekening van Vrienden</td>
                  <td className="py-3.5 px-4">-</td>
                  <td className="py-3.5 px-4 text-red-400">Slechts ~2.0% (verdampt door inflatie)</td>
                  <td className="py-3.5 px-4">-</td>
                  <td className="py-3.5 px-4">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LEGAL & SECURITY */}
      {activeTab === 'legal' && (
        <div className="p-6 rounded-2xl bg-[#0B0D0E] border border-white/10 space-y-6">
          <div className="max-w-3xl space-y-2">
            <h3 className="text-lg font-serif text-[#F7F5F1]">
              Juridische Borging & Bank-Voordeel
            </h3>
            <p className="text-xs text-[#A9AAA7] leading-relaxed">
              Hoe is dit juridisch en fiscaal geregeld in Nederland?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-[#A9AAA7]">
            <div className="p-4 rounded-xl bg-[#15191A] border border-white/5 space-y-2">
              <span className="text-[#A9875A] font-bold block">1. Achtergestelde Lening</span>
              <p>
                De lening is 'achtergesteld'. Dit betekent dat banken (zoals Qredits of Rabobank) dit geld als <strong>quasi-eigen vermogen</strong> beschouwen, wat de kans op grotere kredieten juist vergroot.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#15191A] border border-white/5 space-y-2">
              <span className="text-[#A9875A] font-bold block">2. Geen AFM-Vergunning Nodig</span>
              <p>
                Onder de Nederlandse wetgeving is een lening binnen de besloten kring (Friends & Family) tot €5.000.000 volledig vrijgesteld van AFM-prospectusplichten.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#15191A] border border-white/5 space-y-2">
              <span className="text-[#A9875A] font-bold block">3. Duidelijke Overeenkomst</span>
              <p>
                Iedere vriend ontvangt een gestandaardiseerde, waterdichte leningsovereenkomst met vastgelegde rentebetaaldag en digitale sessievouchers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1C2224] to-[#121617] border border-[#A9875A]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-mono uppercase tracking-wider text-[#A9875A] block">Direct Meedoen als Vriend / Founder?</span>
          <h4 className="text-lg font-serif text-[#F7F5F1]">Vraag de officiële Vrienden-Leningsovereenkomst aan</h4>
          <p className="text-xs text-[#A9AAA7]">Geen verplichting. We sturen je het voorbeeldcontract en de berekening per e-mail toe.</p>
        </div>

        <a
          href="#invest-form"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#A9875A] to-[#C5A069] text-[#0B0D0E] font-bold font-mono text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shrink-0"
        >
          <span>Vrienden-Inleg Aanmelden</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

    </section>
  );
};

import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Download, 
  Coins, 
  PieChart as PieChartIcon, 
  FileText, 
  BadgePercent, 
  AlertCircle, 
  Sparkles,
  ArrowUpRight,
  Calculator,
  ChevronDown,
  Layers,
  Leaf
} from 'lucide-react';
import { motion } from 'motion/react';

interface MicroLoanProfile {
  loanAmount: number; // e.g. 50000
  interestRate: number; // e.g. 7.5%
  tenureYears: number; // e.g. 5 years (60 months)
  monthlySessionsTarget: number; // sessions per suite per month (default: 45)
  suitesCount: number; // default: 1 suite (pilot hub)
}

export const MicroLoanCreditDossier: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(50000);
  const [interestRate, setInterestRate] = useState<number>(7.5);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [occupancyDailySessions, setOccupancyDailySessions] = useState<number>(2.5); // sessions per day
  const [activeTab, setActiveTab] = useState<'calculator' | 'risk_mitigation' | 'grant_stacking' | 'summary'>('calculator');
  const [showExportModal, setShowExportModal] = useState(false);

  // Financial calculations
  const monthlyInterestRate = interestRate / 100 / 12;
  const totalMonths = tenureYears * 12;
  
  // Annuity monthly repayment: P * (r*(1+r)^n) / ((1+r)^n - 1)
  const monthlyAnnuity = monthlyInterestRate > 0
    ? (loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths))) / 
      (Math.pow(1 + monthlyInterestRate, totalMonths) - 1)
    : loanAmount / totalMonths;

  const sessionPrice = 200; // Fixed €200 / 2hr
  const daysInMonth = 30;
  const monthlySessions = Math.round(occupancyDailySessions * daysInMonth);
  const monthlyGrossRevenue = monthlySessions * sessionPrice;

  // Operational cost breakdown per month (for 1 pilot eco-suite)
  const cleaningAndHygienePerSession = 22; // bio-cleaning + bio-linen wash
  const utilityAndWaterPerSession = 14; // eco heat recovery & zero-emission power
  const directOpex = monthlySessions * (cleaningAndHygienePerSession + utilityAndWaterPerSession);
  const fixedOverheads = 2200; // rent share, internet IoT, software booking fee, insurance
  const monthlyNetOperatingIncome = monthlyGrossRevenue - directOpex - fixedOverheads;

  // Debt Service Coverage Ratio (DSCR): Net Operating Income / Debt Service
  const dscr = monthlyAnnuity > 0 ? (monthlyNetOperatingIncome / monthlyAnnuity) : 0;
  
  // Sessions needed strictly to service debt
  const sessionContributionMargin = sessionPrice - (cleaningAndHygienePerSession + utilityAndWaterPerSession); // €164
  const sessionsNeededForDebt = Math.ceil(monthlyAnnuity / sessionContributionMargin);

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="microloan-dossier" className="rounded-3xl bg-gradient-to-b from-[#111416] via-[#15191A] to-[#0D1011] border-2 border-[#A9875A]/40 p-6 sm:p-10 shadow-2xl space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B0D0E] border border-[#A9875A]/50 text-xs font-mono text-[#A9875A] uppercase tracking-wider">
            <Coins className="w-3.5 h-3.5 text-[#A9875A]" />
            <span>Krediet- & Microlening Dossier (Qredits / Groenkrediet)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif text-[#F7F5F1] leading-tight">
            Kredietbeoordeling & Cashflow Dekking
          </h2>
          <p className="text-xs sm:text-sm text-[#A9AAA7] font-light leading-relaxed">
            Gestructureerde onderbouwing voor kredietverstrekkers (zoals Qredits, bancaire microfinanciers en regionale borgstellingsfondsen). Bewezen terugbetaalcapaciteit op basis van vaste unit economics (€200/2u) en vroege markttractie.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#A9875A] hover:bg-[#C5A069] text-[#0B0D0E] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Kredietdossier Export</span>
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
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
          <Calculator className="w-3.5 h-3.5" />
          <span>1. Cashflow & Afloscalculator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('risk_mitigation')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'risk_mitigation'
              ? 'bg-[#A9875A]/20 text-[#A9875A] border border-[#A9875A]/50'
              : 'text-[#A9AAA7] hover:text-white bg-[#0B0D0E]/60 border border-transparent'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>2. Risicomitigatie & Zekerheden</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('grant_stacking')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'grant_stacking'
              ? 'bg-[#A9875A]/20 text-[#A9875A] border border-[#A9875A]/50'
              : 'text-[#A9AAA7] hover:text-white bg-[#0B0D0E]/60 border border-transparent'
          }`}
        >
          <Leaf className="w-3.5 h-3.5" />
          <span>3. Subsidie-Stapeling (MIA/EIA)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'summary'
              ? 'bg-[#A9875A]/20 text-[#A9875A] border border-[#A9875A]/50'
              : 'text-[#A9AAA7] hover:text-white bg-[#0B0D0E]/60 border border-transparent'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>4. Executive Loan Summary</span>
        </button>
      </div>

      {/* TAB 1: CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Inputs Column */}
          <div className="lg:col-span-6 space-y-6 p-6 rounded-2xl bg-[#0B0D0E]/80 border border-white/10">
            <h3 className="text-base font-serif text-[#F7F5F1] flex items-center gap-2 border-b border-white/5 pb-3">
              <Coins className="w-4 h-4 text-[#A9875A]" />
              <span>Krediet- & Bezetting Parameters</span>
            </h3>

            {/* Slider 1: Loan Amount */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#A9AAA7]">Microlening / Kredietbedrag</span>
                <span className="text-[#F7F5F1] font-bold">€{loanAmount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={15000}
                max={100000}
                step={5000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#A9875A]"
              />
              <div className="flex justify-between text-[10px] text-[#A9AAA7] font-mono">
                <span>€15.000 (Startfase)</span>
                <span>€50.000 (Standaard Qredits)</span>
                <span>€100.000 (Groen MKB)</span>
              </div>
            </div>

            {/* Slider 2: Interest Rate */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#A9AAA7]">Rentepercentage (Jaarlijks)</span>
                <span className="text-[#F7F5F1] font-bold">{interestRate}%</span>
              </div>
              <input
                type="range"
                min={4.0}
                max={11.0}
                step={0.25}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#A9875A]"
              />
              <div className="flex justify-between text-[10px] text-[#A9AAA7] font-mono">
                <span>4.5% (Groenkrediet met subsidie)</span>
                <span>7.5% (Qredits standaard)</span>
                <span>10.0% (Commercieel)</span>
              </div>
            </div>

            {/* Slider 3: Tenure */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#A9AAA7]">Looptijd Lening</span>
                <span className="text-[#F7F5F1] font-bold">{tenureYears} Jaar ({tenureYears * 12} maanden)</span>
              </div>
              <input
                type="range"
                min={2}
                max={7}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#A9875A]"
              />
            </div>

            {/* Slider 4: Occupancy Daily Sessions */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#A9AAA7]">Conservatieve Bezetting (Sessies per dag)</span>
                <span className="text-[#A9875A] font-bold">{occupancyDailySessions} sessies/dag ({monthlySessions}/mnd)</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={4.5}
                step={0.5}
                value={occupancyDailySessions}
                onChange={(e) => setOccupancyDailySessions(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#A9875A]"
              />
              <div className="flex justify-between text-[10px] text-[#A9AAA7] font-mono">
                <span>1.0 (Break-even stresstest)</span>
                <span>2.5 (Conservatief realistisch)</span>
                <span>4.0 (Volle capaciteit)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#15191A] border border-white/5 text-[11px] text-[#A9AAA7] font-mono">
              💡 <em>Vaste eenheidsprijs: <strong>€200 per 2 uur</strong>. Directe marge per sessie na schoonmaak & eco-energie is <strong>€{sessionContributionMargin}</strong> (82%).</em>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Main Scorecard */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1C2224] to-[#131718] border border-[#A9875A]/60 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#A9875A] tracking-wider">
                  Kredietwaardigheid & Dekking
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                  dscr >= 2.0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {dscr >= 2.0 ? 'Zeer Hoog Kredietveilig' : 'Voldoende Dekking'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#0B0D0E]/80 border border-white/5">
                  <span className="text-[11px] text-[#A9AAA7] font-mono block">Maandelijkse Aflossing + Rente</span>
                  <span className="text-2xl font-serif text-[#F7F5F1] font-bold">€{Math.round(monthlyAnnuity).toLocaleString()}</span>
                  <span className="text-[10px] text-[#A9875A] font-mono block pt-1">Annuïteit per maand</span>
                </div>

                <div className="p-4 rounded-xl bg-[#0B0D0E]/80 border border-white/5">
                  <span className="text-[11px] text-[#A9AAA7] font-mono block">Debt Service Coverage (DSCR)</span>
                  <span className="text-2xl font-serif text-emerald-400 font-bold">{dscr.toFixed(2)}x</span>
                  <span className="text-[10px] text-[#A9AAA7] font-mono block pt-1">Min. norm bank = 1.30x</span>
                </div>
              </div>

              {/* Crucial Proof Metric: Sessions required for debt */}
              <div className="p-4 rounded-xl bg-[#0B0D0E] border border-[#A9875A]/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#A9875A] font-bold">Benodigd Aantal Sessies om Lening te Betalen:</span>
                  <span className="text-lg font-serif text-[#F7F5F1] font-bold">{sessionsNeededForDebt} sessies / maand</span>
                </div>
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (sessionsNeededForDebt / monthlySessions) * 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#A9AAA7] leading-relaxed">
                  Slechts <strong>{sessionsNeededForDebt} van de {monthlySessions} maandelijkse sessies</strong> (slechts {((sessionsNeededForDebt / monthlySessions) * 100).toFixed(0)}% van de verwachte bezetting) zijn nodig om de complete rente & aflossing van de microlening te dekken.
                </p>
              </div>
            </div>

            {/* Monthly Operating Cashflow Summary */}
            <div className="p-5 rounded-2xl bg-[#0B0D0E]/90 border border-white/10 space-y-3 font-mono text-xs">
              <div className="flex justify-between text-[#A9AAA7] pb-2 border-b border-white/5">
                <span>Maandelijkse Bruto Omzet ({monthlySessions} sessies @ €200):</span>
                <span className="text-[#F7F5F1] font-bold">+€{monthlyGrossRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#A9AAA7]">
                <span>Variabele Hygiëne & Eco-Energie (-€36/sessie):</span>
                <span className="text-red-400">-€{directOpex.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#A9AAA7]">
                <span>Vaste Locatie- & Softwarelasten:</span>
                <span className="text-red-400">-€{fixedOverheads.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold pt-2 border-t border-white/5">
                <span>Netto Operationele Cashflow (vóór financiering):</span>
                <span>+€{monthlyNetOperatingIncome.toLocaleString()} / mnd</span>
              </div>
              <div className="flex justify-between text-[#A9875A] font-bold">
                <span>Vrije Cashflow ná volledige leningaflossing:</span>
                <span>+€{Math.round(monthlyNetOperatingIncome - monthlyAnnuity).toLocaleString()} / mnd</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: RISK MITIGATION & SECURITIES */}
      {activeTab === 'risk_mitigation' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0B0D0E] border border-white/10 space-y-4">
            <div className="p-3 rounded-xl bg-[#15191A] text-[#A9875A] w-fit">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="text-base font-serif text-[#F7F5F1]">1. Vooraf Bewezen Marktvraag</h4>
            <p className="text-xs text-[#A9AAA7] leading-relaxed">
              Meer dan <strong>700+ geregistreerde Early Access leden</strong> in de wachtrij. Zodra de eerste suite operationeel is, zijn de eerste 3 maanden direct gegarandeerd volgeboekt via onze exclusieve 48-uurs voorrangskalender.
            </p>
            <div className="text-[11px] font-mono text-[#A9875A]">
              ✓ Geen leegstandsrisico bij opening
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B0D0E] border border-white/10 space-y-4">
            <div className="p-3 rounded-xl bg-[#15191A] text-[#A9875A] w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-serif text-[#F7F5F1]">2. Borgstelling & Harde Activa</h4>
            <p className="text-xs text-[#A9AAA7] leading-relaxed">
              De microlening wordt geactiveerd voor tastbare, hoogwaardige installaties (warmtepompen, magnesium hydrotherapiebad, IoT-toegangsmodules en high-end sauna). Deze behouden hoge restwaarde en kunnen als onderpand dienen.
            </p>
            <div className="text-[11px] font-mono text-[#A9875A]">
              ✓ Tastbare capex & pandrecht mogelijk
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B0D0E] border border-white/10 space-y-4">
            <div className="p-3 rounded-xl bg-[#15191A] text-[#A9875A] w-fit">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-serif text-[#F7F5F1]">3. Geen Personeelsrisico</h4>
            <p className="text-xs text-[#A9AAA7] leading-relaxed">
              Volledig autonoom IoT-beheer met digitale sleutels. Geen dure receptiemedewerkers op de loonlijst. Hierdoor blijven de vaste maandlasten extreem laag en voorspelbaar, zelfs in rustigere seizoenen.
            </p>
            <div className="text-[11px] font-mono text-[#A9875A]">
              ✓ Vaste lasten onder 25% van de omzet
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GRANT STACKING (SUBSIDIE STAPELING) */}
      {activeTab === 'grant_stacking' && (
        <div className="p-6 rounded-2xl bg-[#0B0D0E] border border-white/10 space-y-6">
          <div className="max-w-3xl space-y-2">
            <h4 className="text-lg font-serif text-[#F7F5F1]">
              Hefboomeffect: Microlening + Fiscale Subsidies (MIA/EIA)
            </h4>
            <p className="text-xs text-[#A9AAA7] leading-relaxed">
              Door een microlening van €50.000 te combineren met Nederlandse milieu- en energie-investeringsaftrekregelingen (RVO), wordt de effectieve rentelast gecompenseerd en het netto eigen vermogen versterkt.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#15191A] border border-white/5 space-y-2">
              <span className="text-xs font-mono text-[#A9875A] font-bold">MIA (Milieu)</span>
              <span className="block text-xl font-serif text-[#F7F5F1]">Tot 45% Aftrek</span>
              <p className="text-[11px] text-[#A9AAA7]">Op waterterugwinning en circulaire houtbouw van de saunacabines.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#15191A] border border-white/5 space-y-2">
              <span className="text-xs font-mono text-[#A9875A] font-bold">EIA (Energie)</span>
              <span className="block text-xl font-serif text-[#F7F5F1]">Tot 40% Aftrek</span>
              <p className="text-[11px] text-[#A9AAA7]">Op industriële warmtepompen en IoT klimaatregeling.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#15191A] border border-white/5 space-y-2">
              <span className="text-xs font-mono text-[#A9875A] font-bold">Borgstelling MKB</span>
              <span className="block text-xl font-serif text-[#F7F5F1]">BMKB-Groen</span>
              <p className="text-[11px] text-[#A9AAA7]">De overheid staat tot 75% garant voor de lening via BMKB-Groen.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#15191A] border border-white/5 space-y-2">
              <span className="text-xs font-mono text-[#A9875A] font-bold">Rentekorting</span>
              <span className="block text-xl font-serif text-[#F7F5F1]">-1.0% Rente</span>
              <p className="text-[11px] text-[#A9AAA7]">Via de Regeling Groenprojecten bij erkende groenkrediet verstrekkers.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SUMMARY */}
      {activeTab === 'summary' && (
        <div className="p-6 rounded-2xl bg-[#0B0D0E] border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-[#A9875A] uppercase tracking-wider">Kredietvoorstel Synthese</span>
              <h4 className="text-xl font-serif text-[#F7F5F1]">RedZen Eco-Wellness Pilot Suite 1</h4>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
              Kredietstatus: Direct Haalbaar
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#A9AAA7]">
            <div className="space-y-3">
              <h5 className="font-mono text-[#F7F5F1] uppercase tracking-wider text-xs">Doel van de Lening</h5>
              <ul className="space-y-2 list-disc list-inside">
                <li>Pre-openings Capex & installatie van de circulaire warmte- en UVC waterzuiveringssystemen.</li>
                <li>IoT smart access hardware & softwarematige betaalkoppeling.</li>
                <li>Werkkapitaal voor de eerste 30 dagen van exploitatie.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-mono text-[#F7F5F1] uppercase tracking-wider text-xs">Aflossingszekerheid</h5>
              <ul className="space-y-2 list-disc list-inside">
                <li>Directe cashflow per geboekt tijdslot (geen debiteurenrisico, gasten betalen 100% vooraf via iDeal/Creditcard).</li>
                <li>DSCR van <strong>{dscr.toFixed(2)}x</strong> overtreft ruimschoots de bancaire risicodrempel van 1.30x.</li>
                <li>Slechts <strong>{sessionsNeededForDebt} sessies per maand</strong> lossen de complete maandverplichting af.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal / Print Preview */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-[#111416] border border-[#A9875A] rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#A9875A]">Officieel Aanvraagdossier</span>
                <h3 className="text-xl font-serif text-[#F7F5F1]">RedZen Suites – Krediet- & Microlening Memorandum</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="text-neutral-400 hover:text-white text-sm font-mono cursor-pointer"
              >
                ✕ Sluiten
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono text-[#A9AAA7] leading-relaxed">
              <div className="p-4 rounded-xl bg-[#0B0D0E] space-y-2 border border-white/5">
                <div className="flex justify-between text-[#F7F5F1]">
                  <span>Aanvrager:</span>
                  <span>RedZen Suites B.V. (i.o.)</span>
                </div>
                <div className="flex justify-between text-[#F7F5F1]">
                  <span>Sector:</span>
                  <span>Duurzame Leisure & Eco-Wellness Hospitality</span>
                </div>
                <div className="flex justify-between text-[#F7F5F1]">
                  <span>Gevraagd Krediet:</span>
                  <span className="text-[#A9875A] font-bold">€{loanAmount.toLocaleString()} ({tenureYears} jr @ {interestRate}%)</span>
                </div>
                <div className="flex justify-between text-[#F7F5F1]">
                  <span>Berekende DSCR:</span>
                  <span className="text-emerald-400 font-bold">{dscr.toFixed(2)}x (Veilige dekking)</span>
                </div>
              </div>

              <p>
                <strong>Kernsamenvatting voor Kredietcommissie:</strong><br />
                RedZen exploiteert private eco-wellness suites op basis van een vast tarief van €200 per 2 uur. Met een vaste contributiemarge van €164 per sessie zijn slechts {sessionsNeededForDebt} sessies per maand benodigd voor de integrale schuldendienst. Met een bestaande wachtlijst van 700+ Early Access geregistreerden is het leegstandsrisico geminimaliseerd.
              </p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 py-3 rounded-xl bg-[#A9875A] text-[#0B0D0E] font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#C5A069] transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Print / Opslaan als PDF voor Kredietverstrekker</span>
              </button>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-6 py-3 rounded-xl bg-[#15191A] text-[#A9AAA7] hover:text-white font-mono text-xs uppercase cursor-pointer"
              >
                Annuleren
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </section>
  );
};

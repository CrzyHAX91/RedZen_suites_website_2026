import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Building, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  PieChart, 
  Download, 
  Zap, 
  Flame, 
  Droplets, 
  Sliders, 
  HelpCircle,
  BarChart3,
  Layers,
  ChevronRight
} from 'lucide-react';

interface ScenarioPreset {
  id: string;
  name: string;
  badge: string;
  numSuites: number;
  occupancyRate: number;
  avgTicketPrice: number;
  capexPerSuite: number;
  description: string;
}

const PRESETS: ScenarioPreset[] = [
  {
    id: 'conservative',
    name: 'Conservatief (Boutique)',
    badge: 'Safe Baseline',
    numSuites: 4,
    occupancyRate: 58,
    avgTicketPrice: 200,
    capexPerSuite: 130000,
    description: 'Voorzichtige aannames met beperkte initiële bezetting tegen het vaste ecologische basistarief van €200/slot versterkt met subsidievoordeel.'
  },
  {
    id: 'base',
    name: 'Base Case (Standard Hub)',
    badge: 'Most Likely',
    numSuites: 6,
    occupancyRate: 74,
    avgTicketPrice: 200,
    capexPerSuite: 140000,
    description: 'Onze gevalideerde benchmark voor een 6-suite hub in stedelijk gebied met €200/slot en autonome turnover.'
  },
  {
    id: 'aggressive',
    name: 'Aggressief (Flagship Prime)',
    badge: 'Peak Randstad',
    numSuites: 8,
    occupancyRate: 86,
    avgTicketPrice: 225,
    capexPerSuite: 155000,
    description: 'Hoge benuttingsgraad met €200 basis + premium VIP rituelen en drankarrangementen in toplocaties.'
  }
];

export const InvestorRoiCalculator: React.FC = () => {
  const [activePreset, setActivePreset] = useState<string>('base');
  const [numSuites, setNumSuites] = useState<number>(6); // 4 to 8
  const [occupancyRate, setOccupancyRate] = useState<number>(74); // 50% to 90%
  const [avgTicketPrice, setAvgTicketPrice] = useState<number>(200); // fixed €200 base for 2-hr booking
  const [capexPerSuite, setCapexPerSuite] = useState<number>(140000); // turnkey build + tech per suite
  const [activeTab, setActiveTab] = useState<'kpi' | 'pnl' | 'cashflow'>('kpi');
  const [selectedHorizonYears, setSelectedHorizonYears] = useState<number>(5);

  // Model Constants
  const SLOTS_PER_DAY_PER_SUITE = 5.5; // (open 10:00 - 23:00 = 5 to 6 2-hr slots + 25-min auto turnover)
  const DAYS_PER_YEAR = 365;

  // Revenue Engine
  const maxPossibleBookingsPerSuitePerYear = SLOTS_PER_DAY_PER_SUITE * DAYS_PER_YEAR; // ~2007.5 slots
  const actualBookingsPerSuitePerYear = maxPossibleBookingsPerSuitePerYear * (occupancyRate / 100);
  const totalAnnualBookings = Math.round(actualBookingsPerSuitePerYear * numSuites);
  
  // Ancillary Revenue (Curated Organic Minibar, Aromatherapy Blends, Bathrobes upgrade): ~8% extra
  const ancillaryRevenuePerBooking = 12.5; 
  const totalAncillaryRevenue = totalAnnualBookings * ancillaryRevenuePerBooking;

  const sessionGrossRevenue = actualBookingsPerSuitePerYear * avgTicketPrice * numSuites;
  const totalAnnualGrossRevenue = sessionGrossRevenue + totalAncillaryRevenue;

  // OPEX Breakdown (Detailed Cost Breakdown)
  // 1. Triple Net Rent: €15,000/year per suite (~65m² footprint incl. plant room & private access)
  const rentCost = numSuites * 15500;
  
  // 2. Energy & Water Recovery (Heat pumps + graywater heat exchangers): ~€4.20 per booking
  const energyWaterCost = totalAnnualBookings * 4.20;
  
  // 3. Autonomous Turnover & Linen Logistics (Contracted hospital-grade turnover): ~€11.50 per booking
  const cleaningLinenCost = totalAnnualBookings * 11.50;
  
  // 4. IoT Infrastructure, Cloud Platform & RedZen OS License: ~€450/suite/month
  const techPlatformCost = numSuites * 450 * 12;
  
  // 5. Payment Gateway Fees (Mollie/Stripe 1.6%):
  const paymentFees = totalAnnualGrossRevenue * 0.016;

  // 6. Local Performance Marketing & Retargeting (CAC amortized): ~€3.80 per booking
  const marketingCost = totalAnnualBookings * 3.80;

  // 7. General Insurance, Maintenance Reserves & Facility Sinking Fund:
  const maintenanceInsurance = numSuites * 3200;

  const totalOpex = rentCost + energyWaterCost + cleaningLinenCost + techPlatformCost + paymentFees + marketingCost + maintenanceInsurance;
  const netOperatingIncome = totalAnnualGrossRevenue - totalOpex; // EBITDA
  const ebitdaMargin = Math.round((netOperatingIncome / totalAnnualGrossRevenue) * 100);

  // Capex & Returns
  const totalCapex = numSuites * capexPerSuite;
  const paybackPeriodYears = (totalCapex / netOperatingIncome).toFixed(1);
  const annualizedRoi = Math.round((netOperatingIncome / totalCapex) * 100);
  const monthlyEbitda = Math.round(netOperatingIncome / 12);

  // Multi-year Cash Flow Projection (assuming 2.5% annual indexation on price & rent)
  const multiYearCashFlows = Array.from({ length: 5 }).map((_, idx) => {
    const year = idx + 1;
    const growthFactor = Math.pow(1.03, idx);
    const yrRevenue = totalAnnualGrossRevenue * growthFactor;
    const yrOpex = totalOpex * Math.pow(1.02, idx);
    const yrEbitda = yrRevenue - yrOpex;
    return {
      year,
      revenue: Math.round(yrRevenue),
      ebitda: Math.round(yrEbitda),
      cumulative: Math.round(yrEbitda * year) - totalCapex
    };
  });

  const handleApplyPreset = (preset: ScenarioPreset) => {
    setActivePreset(preset.id);
    setNumSuites(preset.numSuites);
    setOccupancyRate(preset.occupancyRate);
    setAvgTicketPrice(preset.avgTicketPrice);
    setCapexPerSuite(preset.capexPerSuite);
  };

  const handleDownloadSummary = () => {
    const summaryText = `REDZEN SUITES - INVESTOR FINANCIAL SUMMARY
==========================================
Scenario: ${PRESETS.find(p => p.id === activePreset)?.name || 'Custom'}
Hub Grootte: ${numSuites} Suites (ca. ${numSuites * 65} m²)
Bezettingsgraad: ${occupancyRate}%
Gemiddelde Sessieprijs: €${avgTicketPrice} (2 uur)
Capex per Suite: €${(capexPerSuite / 1000).toFixed(0)}k

FINANCIËLE OUTPUT (JAARLIJKS)
------------------------------------------
Totale Bruto Jaaromzet: €${Math.round(totalAnnualGrossRevenue).toLocaleString('nl-NL')}
- Sessie Omzet: €${Math.round(sessionGrossRevenue).toLocaleString('nl-NL')}
- Ancillary (Minibar & Blends): €${Math.round(totalAncillaryRevenue).toLocaleString('nl-NL')}
- Aantal boekingen: ${totalAnnualBookings.toLocaleString('nl-NL')} / jaar

OPERATIONELE KOSTEN (OPEX)
------------------------------------------
Huur (Triple Net): €${Math.round(rentCost).toLocaleString('nl-NL')}
Schoonmaak & Linnen: €${Math.round(cleaningLinenCost).toLocaleString('nl-NL')}
Energie & Water: €${Math.round(energyWaterCost).toLocaleString('nl-NL')}
Tech & RedZen OS: €${Math.round(techPlatformCost).toLocaleString('nl-NL')}
Marketing & CAC: €${Math.round(marketingCost).toLocaleString('nl-NL')}
Onderhoud & Verzekering: €${Math.round(maintenanceInsurance).toLocaleString('nl-NL')}
Transactiekosten: €${Math.round(paymentFees).toLocaleString('nl-NL')}
Totale Jaarlijkse Opex: €${Math.round(totalOpex).toLocaleString('nl-NL')}

RENDEMENT & WAARDERING
------------------------------------------
Net Operating Income (EBITDA): €${Math.round(netOperatingIncome).toLocaleString('nl-NL')} / jaar
EBITDA Marge: ${ebitdaMargin}%
Maandelijkse Netto Cashflow: €${monthlyEbitda.toLocaleString('nl-NL')}
Totale Capex Investering: €${Math.round(totalCapex).toLocaleString('nl-NL')}
Terugverdientijd: ${paybackPeriodYears} jaar
Unlevered ROI: ${annualizedRoi}% per jaar

Datum: ${new Date().toLocaleDateString('nl-NL')}
Vertrouwelijk investeringsmateriaal onder NDA.`;

    const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RedZen_Financial_Summary_${numSuites}Suites.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#15191A] rounded-3xl border border-[#A9875A]/40 p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
      
      {/* Ambient background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#A9875A]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B0D0E] border border-[#A9875A]/40 text-[#A9875A] text-xs font-mono uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Financial Model v2.4</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif text-[#F7F5F1]">
            Unit Economics & Multi-Scenario ROI
          </h3>
          <p className="text-xs sm:text-sm text-[#A9AAA7] font-light max-w-2xl">
            Valideer de cashflow, opex-structuur en unlevered return per micro-hub op basis van realtime parameters en geverifieerde benchmarks.
          </p>
        </div>

        {/* Projected Key Stat Card */}
        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-[#0B0D0E] border border-[#A9875A]/40 min-w-[200px] text-right">
            <span className="text-[10px] font-mono uppercase text-[#A9AAA7] block">Geprojecteerde EBITDA</span>
            <div className="text-3xl font-serif font-medium text-emerald-400">
              €{Math.round(netOperatingIncome).toLocaleString('nl-NL')}
            </div>
            <div className="flex items-center justify-end gap-2 text-[10px] font-mono text-[#A9875A]">
              <span>{ebitdaMargin}% marge</span>
              <span>•</span>
              <span>€{monthlyEbitda.toLocaleString('nl-NL')}/mnd</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadSummary}
            className="hidden sm:flex flex-col items-center justify-center p-4 rounded-2xl bg-[#0B0D0E] border border-white/10 hover:border-[#A9875A] text-[#A9AAA7] hover:text-[#F7F5F1] transition-all cursor-pointer group"
            title="Download financiële samenvatting"
          >
            <Download className="w-5 h-5 text-[#A9875A] group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[9px] font-mono uppercase tracking-wider">Export TXT</span>
          </button>
        </div>
      </div>

      {/* Scenario Presets Quick-Selector */}
      <div className="relative z-10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#A9AAA7] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#A9875A]" />
            Kies een Scenario Preset:
          </span>
          <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
            Direct aanpasbaar via onderstaande sliders
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESETS.map((p) => {
            const isSelected = activePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className={`p-4 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#0B0D0E] border-[#A9875A] shadow-lg ring-1 ring-[#A9875A]'
                    : 'bg-[#0B0D0E]/50 border-white/5 hover:border-white/20 text-[#A9AAA7]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif text-sm text-[#F7F5F1] font-medium">{p.name}</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#15191A] text-[#A9875A] border border-[#A9875A]/30">
                      {p.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A9AAA7] font-light leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#A9875A] pt-3 border-t border-white/5 mt-3">
                  <span>{p.numSuites} Suites • {p.occupancyRate}% Bezetting</span>
                  <span className="text-[#F7F5F1] font-bold">€{p.avgTicketPrice}/slot</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Sliders Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0B0D0E]/60 p-6 rounded-3xl border border-white/5">
        
        {/* Slider 1: Number of Suites */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#A9AAA7] uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#A9875A]" /> Aantal Suites in Hub
            </span>
            <span className="text-[#A9875A] font-bold text-sm bg-[#15191A] px-2.5 py-1 rounded-lg border border-white/10">
              {numSuites} Suites ({numSuites * 65} m² BVO)
            </span>
          </div>
          <input
            type="range"
            min={4}
            max={8}
            step={1}
            value={numSuites}
            onChange={(e) => {
              setNumSuites(parseInt(e.target.value));
              setActivePreset('custom');
            }}
            className="w-full h-1.5 bg-[#15191A] rounded-lg appearance-none cursor-pointer accent-[#A9875A]"
          />
          <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
            <span>4 suites (Boutique Hub)</span>
            <span>6 suites (Standard Urban)</span>
            <span>8 suites (Flagship Metropool)</span>
          </div>
        </div>

        {/* Slider 2: Occupancy Rate */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#A9AAA7] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#A9875A]" /> Bezettingsgraad (10:00 - 23:00)
            </span>
            <span className="text-[#A9875A] font-bold text-sm bg-[#15191A] px-2.5 py-1 rounded-lg border border-white/10">
              {occupancyRate}% ({Math.round(totalAnnualBookings / 365)} sessies / dag)
            </span>
          </div>
          <input
            type="range"
            min={50}
            max={90}
            step={2}
            value={occupancyRate}
            onChange={(e) => {
              setOccupancyRate(parseInt(e.target.value));
              setActivePreset('custom');
            }}
            className="w-full h-1.5 bg-[#15191A] rounded-lg appearance-none cursor-pointer accent-[#A9875A]"
          />
          <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
            <span>50% (Break-even focus)</span>
            <span>74% (Benchmark)</span>
            <span>90% (Peak Capacity)</span>
          </div>
        </div>

        {/* Slider 3: Avg Ticket */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#A9AAA7] uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#A9875A]" /> Sessietarief (Duurzaam Model)
            </span>
            <span className="text-[#A9875A] font-bold text-sm bg-[#15191A] px-2.5 py-1 rounded-lg border border-white/10">
              €{avgTicketPrice} per 2u slot
            </span>
          </div>
          <input
            type="range"
            min={180}
            max={260}
            step={5}
            value={avgTicketPrice}
            onChange={(e) => {
              setAvgTicketPrice(parseInt(e.target.value));
              setActivePreset('custom');
            }}
            className="w-full h-1.5 bg-[#15191A] rounded-lg appearance-none cursor-pointer accent-[#A9875A]"
          />
          <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
            <span>€180 (Subsidie drempel)</span>
            <span>€200 (Standaard Gevalideerd)</span>
            <span>€260 (VIP + Arrangementen)</span>
          </div>
        </div>

        {/* Slider 4: Capex per Suite */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#A9AAA7] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A9875A]" /> Turnkey Bouw Capex / Suite
            </span>
            <span className="text-[#A9875A] font-bold text-sm bg-[#15191A] px-2.5 py-1 rounded-lg border border-white/10">
              €{(capexPerSuite / 1000)}k (Totaal €{Math.round(totalCapex / 1000)}k)
            </span>
          </div>
          <input
            type="range"
            min={110000}
            max={180000}
            step={5000}
            value={capexPerSuite}
            onChange={(e) => {
              setCapexPerSuite(parseInt(e.target.value));
              setActivePreset('custom');
            }}
            className="w-full h-1.5 bg-[#15191A] rounded-lg appearance-none cursor-pointer accent-[#A9875A]"
          />
          <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
            <span>€110k (Modulair Shell)</span>
            <span>€140k (High Luxury Turnkey)</span>
            <span>€180k (Bespoke Flagship)</span>
          </div>
        </div>

      </div>

      {/* Analytical Tab Navigation */}
      <div className="relative z-10 border-b border-white/10 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('kpi')}
          className={`pb-3 text-xs font-mono uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'kpi'
              ? 'border-[#A9875A] text-[#F7F5F1] font-bold'
              : 'border-transparent text-[#A9AAA7] hover:text-[#F7F5F1]'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-[#A9875A]" />
          <span>Kernstatistieken & ROI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pnl')}
          className={`pb-3 text-xs font-mono uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'pnl'
              ? 'border-[#A9875A] text-[#F7F5F1] font-bold'
              : 'border-transparent text-[#A9AAA7] hover:text-[#F7F5F1]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#A9875A]" />
          <span>Gedetailleerde P&L Breakdown</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cashflow')}
          className={`pb-3 text-xs font-mono uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'cashflow'
              ? 'border-[#A9875A] text-[#F7F5F1] font-bold'
              : 'border-transparent text-[#A9AAA7] hover:text-[#F7F5F1]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-[#A9875A]" />
          <span>5-Jaars Cashflow Projectie</span>
        </button>
      </div>

      {/* Tab 1: KPI Matrix */}
      {activeTab === 'kpi' && (
        <div className="relative z-10 space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-[#0B0D0E] border border-white/10 space-y-1">
              <span className="text-[11px] font-mono text-[#A9AAA7] uppercase block">Totale Jaaromzet</span>
              <div className="text-2xl font-serif text-[#F7F5F1]">
                €{Math.round(totalAnnualGrossRevenue).toLocaleString('nl-NL')}
              </div>
              <div className="text-[10px] text-[#A9875A] font-mono">
                {totalAnnualBookings.toLocaleString('nl-NL')} sessies • €{Math.round(totalAncillaryRevenue).toLocaleString('nl-NL')} add-ons
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0B0D0E] border border-white/10 space-y-1">
              <span className="text-[11px] font-mono text-[#A9AAA7] uppercase block">Totale Capex Investering</span>
              <div className="text-2xl font-serif text-[#F7F5F1]">
                €{Math.round(totalCapex).toLocaleString('nl-NL')}
              </div>
              <span className="text-[10px] text-[#A9AAA7] font-mono">
                Volledig turn-key inclusief IoT & meubilair
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0B0D0E] border border-[#A9875A]/40 space-y-1">
              <span className="text-[11px] font-mono text-[#A9875A] uppercase block">Terugverdientijd (Payback)</span>
              <div className="text-2xl font-serif text-[#A9875A] font-bold">
                {paybackPeriodYears} Jaar
              </div>
              <span className="text-[10px] text-[#A9AAA7] font-mono">
                Gevalideerd op autonome exploitatie
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0B0D0E] border border-white/10 space-y-1">
              <span className="text-[11px] font-mono text-emerald-400 uppercase block">Annualized Unlevered ROI</span>
              <div className="text-2xl font-serif text-emerald-400 font-bold">
                {annualizedRoi}% / jaar
              </div>
              <span className="text-[10px] text-[#A9AAA7] font-mono">
                EBITDA / Totale Capex
              </span>
            </div>

          </div>

          {/* Core Insights Callout */}
          <div className="p-5 rounded-2xl bg-[#0B0D0E] border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#A9875A] mt-1.5 shrink-0" />
              <span className="text-[#A9AAA7]">
                <strong className="text-[#F7F5F1] block">Geen Keuken of Horecapersoneel:</strong>
                Zero derving, geen koks of bediening nodig. Directe margeverbetering van 18% t.o.v. traditionele spa's.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#A9875A] mt-1.5 shrink-0" />
              <span className="text-[#A9AAA7]">
                <strong className="text-[#F7F5F1] block">IoT-Gestuurde Schoonmaak:</strong>
                Schoonmaakteams worden alleen getriggerd na daadwerkelijke check-outs via de RedZen Partner App.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#A9875A] mt-1.5 shrink-0" />
              <span className="text-[#A9AAA7]">
                <strong className="text-[#F7F5F1] block">Snelle Rollout Cyclus:</strong>
                Prefab modulaire installatie binnen 10-14 weken per hub na verkrijgen van lichte omgevingsvergunning.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Detailed P&L Breakdown */}
      {activeTab === 'pnl' && (
        <div className="relative z-10 space-y-4 animate-in fade-in duration-200">
          <div className="p-6 rounded-2xl bg-[#0B0D0E] border border-white/10 space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono uppercase text-[#A9875A]">
              <span>Inkomsten- & Kostenpost</span>
              <span>Jaarbedrag (€) • % van Omzet</span>
            </div>

            {/* Revenue Rows */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#F7F5F1]">
                <span className="font-bold">+ Sessie-omzet (2u slots)</span>
                <span className="font-bold text-emerald-400">€{Math.round(sessionGrossRevenue).toLocaleString('nl-NL')} (93%)</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-[#A9AAA7]">
                <span>+ Ancillary Services (Minibar, Aromatherapie, Linnen upgrade)</span>
                <span className="text-emerald-400/90">€{Math.round(totalAncillaryRevenue).toLocaleString('nl-NL')} (7%)</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-[#F7F5F1] pt-2 border-t border-white/5 font-bold">
                <span>BRUTO JAAROMZET</span>
                <span className="text-emerald-400">€{Math.round(totalAnnualGrossRevenue).toLocaleString('nl-NL')} (100%)</span>
              </div>
            </div>

            {/* OPEX Rows */}
            <div className="space-y-2 pt-4 border-t border-white/10">
              <span className="text-[11px] font-mono uppercase text-[#A9875A] block">Operationele Kosten (OPEX)</span>
              
              <div className="flex items-center justify-between text-xs font-mono text-[#A9AAA7]">
                <span>- Triple-Net Locatiehuur ({numSuites * 65} m²)</span>
                <span>€{Math.round(rentCost).toLocaleString('nl-NL')} ({Math.round((rentCost / totalAnnualGrossRevenue) * 100)}%)</span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#A9AAA7]">
                <span>- Schoonmaaklogistiek & Linnenverwerking (€11.50 / sessie)</span>
                <span>€{Math.round(cleaningLinenCost).toLocaleString('nl-NL')} ({Math.round((cleaningLinenCost / totalAnnualGrossRevenue) * 100)}%)</span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#A9AAA7]">
                <span>- Energie & Water met Warmteterugwinning (€4.20 / sessie)</span>
                <span>€{Math.round(energyWaterCost).toLocaleString('nl-NL')} ({Math.round((energyWaterCost / totalAnnualGrossRevenue) * 100)}%)</span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#A9AAA7]">
                <span>- RedZen OS, IoT Cloud & 24/7 Remote Monitoring</span>
                <span>€{Math.round(techPlatformCost).toLocaleString('nl-NL')} ({Math.round((techPlatformCost / totalAnnualGrossRevenue) * 100)}%)</span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#A9AAA7]">
                <span>- Performance Marketing, Retargeting & CAC</span>
                <span>€{Math.round(marketingCost).toLocaleString('nl-NL')} ({Math.round((marketingCost / totalAnnualGrossRevenue) * 100)}%)</span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#A9AAA7]">
                <span>- Onderhoudsreserve, Verzekering & Betalingsverkeer</span>
                <span>€{Math.round(maintenanceInsurance + paymentFees).toLocaleString('nl-NL')} ({Math.round(((maintenanceInsurance + paymentFees) / totalAnnualGrossRevenue) * 100)}%)</span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#F7F5F1] pt-2 border-t border-white/5 font-bold">
                <span>TOTALE OPEX</span>
                <span className="text-red-400">€{Math.round(totalOpex).toLocaleString('nl-NL')} ({Math.round((totalOpex / totalAnnualGrossRevenue) * 100)}%)</span>
              </div>
            </div>

            {/* Bottom Result */}
            <div className="p-4 rounded-xl bg-[#15191A] border border-[#A9875A]/40 flex items-center justify-between text-sm font-mono font-bold">
              <span className="text-[#F7F5F1]">NET OPERATING INCOME (EBITDA)</span>
              <span className="text-emerald-400 text-lg">€{Math.round(netOperatingIncome).toLocaleString('nl-NL')} ({ebitdaMargin}%)</span>
            </div>

          </div>
        </div>
      )}

      {/* Tab 3: 5-Year Cash Flow Projection */}
      {activeTab === 'cashflow' && (
        <div className="relative z-10 space-y-4 animate-in fade-in duration-200">
          <div className="p-6 rounded-2xl bg-[#0B0D0E] border border-white/10 space-y-4 overflow-x-auto">
            
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-[#A9875A] uppercase">
                  <th className="pb-3">Jaar</th>
                  <th className="pb-3">Geprojecteerde Omzet</th>
                  <th className="pb-3">EBITDA Cashflow</th>
                  <th className="pb-3">Cumulatief (Na Capex)</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr className="text-neutral-500">
                  <td className="py-2.5">Jaar 0</td>
                  <td className="py-2.5">Opstart & Bouwfase</td>
                  <td className="py-2.5 text-red-400">-€{Math.round(totalCapex).toLocaleString('nl-NL')} (Capex)</td>
                  <td className="py-2.5 text-red-400">-€{Math.round(totalCapex).toLocaleString('nl-NL')}</td>
                  <td className="py-2.5 text-right font-bold text-neutral-400">Turnkey Bouw</td>
                </tr>
                {multiYearCashFlows.map((cf) => (
                  <tr key={cf.year} className="text-[#F7F5F1]">
                    <td className="py-3 font-bold text-[#A9875A]">Jaar {cf.year}</td>
                    <td className="py-3">€{cf.revenue.toLocaleString('nl-NL')}</td>
                    <td className="py-3 text-emerald-400 font-bold">€{cf.ebitda.toLocaleString('nl-NL')}</td>
                    <td className={`py-3 font-bold ${cf.cumulative >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {cf.cumulative >= 0 ? '+' : ''}€{cf.cumulative.toLocaleString('nl-NL')}
                    </td>
                    <td className="py-3 text-right">
                      {cf.cumulative >= 0 ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 text-[10px]">
                          Volledig Terugverdiend
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/30 text-[10px]">
                          In Terugverdiening
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-[11px] text-[#A9AAA7] font-mono pt-2">
              * Aanname: 3.0% jaarlijkse prijsindexatie en 2.0% inflatiecorrectie op operationele kosten vanaf Jaar 2.
            </p>

          </div>
        </div>
      )}

      {/* Micro Disclaimer & Action Footer */}
      <div className="relative z-10 p-4 rounded-2xl bg-[#0B0D0E]/80 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A9AAA7] font-mono">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#A9875A] shrink-0" />
          <span>Indicatieve simulatie. Volledig audited financieel model met gevoeligheidstabellen beschikbaar onder NDA.</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleDownloadSummary}
            className="text-[#A9AAA7] hover:text-[#F7F5F1] text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#A9875A]" />
            <span>Exporteer Data</span>
          </button>
          <span className="text-white/20">•</span>
          <a 
            href="#invest-form" 
            className="text-[#A9875A] hover:underline font-bold flex items-center gap-1"
          >
            <span>Vraag Pitch Deck Aan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { PageRoute, EarlyAccessLead, PropertyLead, InvestorLead, LeadStatus, DigitalReceipt } from '../types';
import { 
  getEarlyAccessLeads, 
  updateLeadStatus, 
  getPropertyLeads, 
  getInvestorLeads, 
  exportLeadsToCSV, 
  resetDemoData, 
  saveEarlyAccessLead 
} from '../services/leadStorage';
import { generateReservationReceipt } from '../services/emailService';
import { DigitalReceiptModal } from '../components/DigitalReceiptModal';
import { GoogleDriveStayLedger } from '../components/GoogleDriveStayLedger';
import { 
  Lock, 
  Unlock, 
  Download, 
  Filter, 
  Search, 
  Sparkles, 
  Users, 
  TrendingUp, 
  Building2, 
  Briefcase, 
  Check, 
  RefreshCw, 
  Eye, 
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  Copy,
  FileText,
  CreditCard,
  Mail
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (path: PageRoute) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  // Simple passcode auth for preview/production demo: 'redzen2025' or 'zen'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Data states
  const [leads, setLeads] = useState<EarlyAccessLead[]>([]);
  const [propertyLeads, setPropertyLeads] = useState<PropertyLead[]>([]);
  const [investorLeads, setInvestorLeads] = useState<InvestorLead[]>([]);
  
  // UI Tabs
  const [activeTab, setActiveTab] = useState<'early_access' | 'property' | 'investor' | 'analytics' | 'drive_ledger'>('early_access');

  // Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState<DigitalReceipt | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [useCaseFilter, setUseCaseFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId((current) => (current === id ? null : current));
      }, 2200);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const getEarlyAccessLeadCopyText = (lead: EarlyAccessLead) => {
    return `REDZEN SUITES - EARLY ACCESS LEAD #${lead.memberNumber}
----------------------------------------
Naam: ${lead.firstName}
E-mail: ${lead.email}
Stad: ${lead.city}
Ervaringswens: ${lead.useCase}
Prijsvoorkeur: ${lead.pricePreference}
Status: ${lead.status}
Aangemeld: ${new Date(lead.createdAt).toLocaleString('nl-NL')}`;
  };

  const getPropertyLeadCopyText = (prop: PropertyLead) => {
    return `REDZEN SUITES - VASTGOEDDOSSIER
----------------------------------------
Contactpersoon: ${prop.name}
Bedrijf / Eigenaar: ${prop.company || 'Particulier'}
E-mail: ${prop.email}
Telefoon: ${prop.phone}
Locatie: ${prop.propertyLocation}
Oppervlakte: ${prop.size}
Datum ingediend: ${new Date(prop.createdAt).toLocaleString('nl-NL')}

Omschrijving van het pand:
${prop.description}`;
  };

  const getInvestorLeadCopyText = (inv: InvestorLead) => {
    return `REDZEN SUITES - INVESTEERDERSDOSSIER
----------------------------------------
Naam: ${inv.name}
Organisatie / Type: ${inv.companyOrType}
E-mail: ${inv.email}
Telefoon: ${inv.phone || 'Niet opgegeven'}
Ticketgrootte: ${inv.ticketRange}
Datum ingediend: ${new Date(inv.createdAt).toLocaleString('nl-NL')}

Toelichting / Investeringsfocus:
${inv.message}`;
  };

  useEffect(() => {
    // Check if session admin is already authenticated
    const sessionAuth = sessionStorage.getItem('redzen_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  const loadAllData = () => {
    setLeads(getEarlyAccessLeads());
    setPropertyLeads(getPropertyLeads());
    setInvestorLeads(getInvestorLeads());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim().toLowerCase() === 'redzen2025' || passcode.trim().toLowerCase() === 'admin' || passcode.trim().toLowerCase() === 'zen') {
      setIsAuthenticated(true);
      sessionStorage.setItem('redzen_admin_auth', 'true');
      setAuthError('');
      loadAllData();
    } else {
      setAuthError('Onjuiste toegangscode. (Hint: gebruik "redzen2025" of "zen")');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('redzen_admin_auth');
  };

  const handleStatusChange = (id: string, newStatus: LeadStatus) => {
    updateLeadStatus(id, newStatus);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const handleResetDemo = () => {
    if (window.confirm('Weet je zeker dat je alle data wilt herstellen naar de initiële pre-launch demo status?')) {
      resetDemoData();
      loadAllData();
    }
  };

  const handleAddSampleLead = () => {
    const cities = ['Amsterdam', 'Rotterdam', 'Utrecht', 'Den Haag', 'Eindhoven', 'Haarlem', 'Breda', 'Groningen'];
    const names = ['Lotte', 'Tim', 'Anouk', 'Sander', 'Lieke', 'Jesse', 'Jasmijn', 'Niels'];
    const useCases: Array<'Ontspanning' | 'Date night' | 'Special occasion' | 'Cadeau'> = ['Ontspanning', 'Date night', 'Special occasion', 'Cadeau'];
    const prices: Array<'€100–€129' | '€130–€159' | '€160–€189' | '€190+'> = ['€100–€129', '€130–€159', '€160–€189', '€190+'];

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomUseCase = useCases[Math.floor(Math.random() * useCases.length)];
    const randomPrice = prices[Math.floor(Math.random() * prices.length)];

    saveEarlyAccessLead({
      firstName: randomName,
      email: `${randomName.toLowerCase()}.${Math.floor(Math.random() * 899 + 100)}@live.nl`,
      city: randomCity,
      useCase: randomUseCase,
      pricePreference: randomPrice
    });

    loadAllData();
  };

  // Filtered Early Access Leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesPrice = priceFilter === 'all' || lead.pricePreference === priceFilter;
    const matchesUseCase = useCaseFilter === 'all' || lead.useCase === useCaseFilter;

    return matchesSearch && matchesStatus && matchesPrice && matchesUseCase;
  });

  // Calculate Metrics
  const totalMembers = 726 + leads.length;
  const mostChosenPriceCount = leads.filter(l => l.pricePreference === '€130–€159').length;
  const mostChosenPricePercent = leads.length ? Math.round((mostChosenPriceCount / leads.length) * 100) : 62;
  
  const dateNightCount = leads.filter(l => l.useCase === 'Date night').length;
  const ontspanningCount = leads.filter(l => l.useCase === 'Ontspanning').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center pt-24 pb-16 px-4">
        <div className="w-full max-w-md bg-[#15191A] border border-[#A9875A]/30 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#0B0D0E] border border-[#A9875A]/40 flex items-center justify-center mx-auto text-[#A9875A]">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif text-[#F7F5F1]">RedZen Admin Portal</h2>
            <p className="text-xs text-[#A9AAA7]">
              Beveiligde toegang tot pre-launch leads en vastgoeddossiers.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A9AAA7] mb-1.5">
                Toegangscode (PIN)
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Voer pincode in (bijv. redzen2025)"
                className="w-full px-4 py-3 rounded-xl bg-[#0B0D0E] border border-white/10 focus:border-[#A9875A] text-sm text-[#F7F5F1] placeholder-neutral-600 focus:outline-none"
              />
              {authError && (
                <p className="text-xs text-rose-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#A9875A] hover:bg-[#C5A069] text-[#0B0D0E] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
            >
              Inloggen op Dashboard
            </button>
          </form>

          <div className="p-3.5 rounded-xl bg-[#0B0D0E] border border-white/5 text-[11px] text-[#A9AAA7] text-center">
            Demo Toegang: <span className="font-mono text-[#A9875A]">redzen2025</span> of <span className="font-mono text-[#A9875A]">zen</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A9875A] px-2.5 py-0.5 rounded bg-[#A9875A]/10 border border-[#A9875A]/30">
              Admin & Lead CRM
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Pre-Launch Data
            </span>
          </div>
          <h1 className="text-3xl font-serif text-[#F7F5F1] mt-1">Pre-Launch Dashboard</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleAddSampleLead}
            className="py-2.5 px-4 rounded-xl bg-[#15191A] border border-white/10 hover:border-[#A9875A] text-xs text-[#F7F5F1] transition-colors cursor-pointer"
          >
            + Test Lead Toevoegen
          </button>
          <button
            type="button"
            onClick={() => exportLeadsToCSV(leads)}
            className="py-2.5 px-4 rounded-xl bg-[#A9875A] hover:bg-[#C5A069] text-[#0B0D0E] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporteer CSV</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="py-2.5 px-3 rounded-xl bg-[#15191A] hover:bg-rose-950/40 text-rose-300 border border-white/5 text-xs transition-colors cursor-pointer"
          >
            Uitloggen
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-[#15191A] border border-[#A9875A]/25 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#A9AAA7] font-mono">
            <span>Early Access Leden</span>
            <Users className="w-4 h-4 text-[#A9875A]" />
          </div>
          <div className="text-3xl font-serif text-[#F7F5F1]">
            {totalMembers} <span className="text-xs text-[#A9AAA7] font-sans">/ 1.000 limit</span>
          </div>
          <div className="w-full bg-[#0B0D0E] h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-[#A9875A] h-full" 
              style={{ width: `${Math.min(100, (totalMembers / 1000) * 100)}%` }} 
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#15191A] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#A9AAA7] font-mono">
            <span>Most Chosen Prijsband</span>
            <TrendingUp className="w-4 h-4 text-[#A9875A]" />
          </div>
          <div className="text-2xl font-serif text-[#F7F5F1]">
            €130–€159
          </div>
          <p className="text-xs text-[#A9AAA7]">
            {mostChosenPricePercent}% van alle leads kiest de signature tier
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#15191A] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#A9AAA7] font-mono">
            <span>Vastgoeddossiers</span>
            <Building2 className="w-4 h-4 text-[#A9875A]" />
          </div>
          <div className="text-3xl font-serif text-[#F7F5F1]">
            {propertyLeads.length}
          </div>
          <p className="text-xs text-[#A9AAA7]">
            Panden aangeboden in o.a. Amsterdam & Utrecht
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#15191A] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#A9AAA7] font-mono">
            <span>Investeerders Leads</span>
            <Briefcase className="w-4 h-4 text-[#A9875A]" />
          </div>
          <div className="text-3xl font-serif text-[#F7F5F1]">
            {investorLeads.length}
          </div>
          <p className="text-xs text-[#A9AAA7]">
            Interesse in schaalbaar privaat model
          </p>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('early_access')}
          className={`py-2 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
            activeTab === 'early_access' ? 'bg-[#A9875A] text-[#0B0D0E]' : 'bg-[#15191A] text-[#A9AAA7] hover:text-[#F7F5F1]'
          }`}
        >
          Early Access Leads ({leads.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('property')}
          className={`py-2 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
            activeTab === 'property' ? 'bg-[#A9875A] text-[#0B0D0E]' : 'bg-[#15191A] text-[#A9875A] hover:text-[#F7F5F1]'
          }`}
        >
          Vastgoed & Locaties ({propertyLeads.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('investor')}
          className={`py-2 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
            activeTab === 'investor' ? 'bg-[#A9875A] text-[#0B0D0E]' : 'bg-[#15191A] text-[#A9AAA7] hover:text-[#F7F5F1]'
          }`}
        >
          Investeerders ({investorLeads.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`py-2 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
            activeTab === 'analytics' ? 'bg-[#A9875A] text-[#0B0D0E]' : 'bg-[#15191A] text-[#A9AAA7] hover:text-[#F7F5F1]'
          }`}
        >
          Prijs- & Locatiestatistieken
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('drive_ledger')}
          className={`py-2 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'drive_ledger' ? 'bg-[#A9875A] text-[#0B0D0E]' : 'bg-[#15191A] text-[#A9875A] hover:text-[#F7F5F1] border border-[#A9875A]/30'
          }`}
        >
          <span>📁</span>
          <span>Google Drive Ledger</span>
        </button>
      </div>

      {/* TAB 1: EARLY ACCESS LEADS TABLE */}
      {activeTab === 'early_access' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-[#15191A] p-4 rounded-2xl border border-white/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A9AAA7]" />
              <input
                type="text"
                placeholder="Zoek op naam, email of stad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B0D0E] border border-white/10 text-xs text-[#F7F5F1] placeholder-neutral-500 focus:outline-none focus:border-[#A9875A]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#0B0D0E] border border-white/10 text-xs text-[#F7F5F1] focus:outline-none"
            >
              <option value="all">Alle Statussen</option>
              <option value="new">Nieuw</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
            </select>

            <select
              value={useCaseFilter}
              onChange={(e) => setUseCaseFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#0B0D0E] border border-white/10 text-xs text-[#F7F5F1] focus:outline-none"
            >
              <option value="all">Alle Doelen / Ervaringen</option>
              <option value="Ontspanning">Ontspanning</option>
              <option value="Date night">Date night</option>
              <option value="Special occasion">Special occasion</option>
              <option value="Cadeau">Cadeau</option>
            </select>

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#0B0D0E] border border-white/10 text-xs text-[#F7F5F1] focus:outline-none"
            >
              <option value="all">Alle Prijscategorieën</option>
              <option value="€100–€129">€100–€129 (Basic)</option>
              <option value="€130–€159">€130–€159 (Most chosen)</option>
              <option value="€160–€189">€160–€189 (Premium)</option>
              <option value="€190+">€190+ (Ultra private)</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-[#15191A] rounded-2xl border border-[#A9875A]/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#A9AAA7]">
                <thead>
                  <tr className="border-b border-white/10 bg-[#0B0D0E]/50 text-white font-mono uppercase tracking-wider">
                    <th className="py-3.5 px-4">Member #</th>
                    <th className="py-3.5 px-4">Naam</th>
                    <th className="py-3.5 px-4">E-mail</th>
                    <th className="py-3.5 px-4">Stad</th>
                    <th className="py-3.5 px-4">Arrangement & Doel</th>
                    <th className="py-3.5 px-4">Aanbetaling (€50)</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Datum</th>
                    <th className="py-3.5 px-4 text-right">Factuur & Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLeads.map((lead) => {
                    const isPaid = lead.paymentStatus === 'deposit_paid' || lead.paymentStatus === 'fully_paid';
                    return (
                      <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#A9875A]">
                          #{lead.memberNumber}
                        </td>
                        <td className="py-3 px-4 font-medium text-[#F7F5F1]">
                          {lead.firstName}
                        </td>
                        <td className="py-3 px-4 text-[#F7F5F1]">
                          {lead.email}
                        </td>
                        <td className="py-3 px-4">
                          {lead.city}
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 rounded bg-[#0B0D0E] border border-white/10 text-white block w-fit text-[11px]">
                              {lead.useCase}
                            </span>
                            <span className="text-[10px] text-[#A9875A] font-mono block">
                              {lead.pricePreference}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {isPaid ? (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                                <Check className="w-2.5 h-2.5" />
                                €50 Voldaan ({lead.paymentMethod || 'iDEAL'})
                              </span>
                              <span className="block text-[9px] text-[#7A7C7E]">
                                {lead.receiptNumber || lead.transactionId || 'Geverifieerd'}
                              </span>
                            </div>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[10px]">
                              In behandeling
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                            className={`px-2 py-1 rounded text-[11px] border cursor-pointer focus:outline-none ${
                              lead.status === 'qualified' ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' :
                              lead.status === 'contacted' ? 'bg-blue-950/60 border-blue-500/50 text-blue-300' :
                              lead.status === 'converted' ? 'bg-purple-950/60 border-purple-500/50 text-purple-300' :
                              'bg-neutral-900 border-neutral-700 text-neutral-300'
                            }`}
                          >
                            <option value="new">new</option>
                            <option value="contacted">contacted</option>
                            <option value="qualified">qualified</option>
                            <option value="converted">converted</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-[11px] font-mono">
                          {new Date(lead.createdAt).toLocaleDateString('nl-NL')}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const receipt = generateReservationReceipt(lead, lead.paymentMethod || 'iDEAL', lead.transactionId);
                                setSelectedReceipt(receipt);
                              }}
                              title="Bekijk digitale factuur en reserveringsbewijs"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-[#A9875A]/40 bg-[#181E20] hover:bg-[#A9875A] text-[#A9875A] hover:text-[#0B0D0E] text-[11px] font-mono transition-all cursor-pointer"
                            >
                              <FileText className="w-3 h-3" />
                              <span>Factuur</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => copyToClipboard(getEarlyAccessLeadCopyText(lead), lead.id)}
                              title="Kopieer lead details"
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-mono transition-all cursor-pointer ${
                                copiedId === lead.id
                                  ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 shadow-sm'
                                  : 'bg-[#0B0D0E] border-white/10 hover:border-[#A9875A] text-[#A9AAA7] hover:text-[#F7F5F1]'
                              }`}
                            >
                              {copiedId === lead.id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3 text-[#A9875A]" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-neutral-500">
                        Geen leads gevonden die voldoen aan de filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: PROPERTY LEADS */}
      {activeTab === 'property' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#A9AAA7] font-mono">
              Overzicht van aangeboden locaties voor vastgoed- en partnermanagers.
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {propertyLeads.map((prop) => (
              <div key={prop.id} className="p-6 rounded-2xl bg-[#15191A] border border-[#A9875A]/25 space-y-4 shadow-lg hover:border-[#A9875A]/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#A9875A]" />
                      <h3 className="text-lg font-serif text-[#F7F5F1]">{prop.name}</h3>
                      {prop.company && <span className="text-xs text-[#A9AAA7]">({prop.company})</span>}
                    </div>
                    <span className="text-xs text-[#A9875A] font-mono">{prop.propertyLocation} • {prop.size}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-[#A9AAA7] font-mono hidden md:block">
                      Ingediend op {new Date(prop.createdAt).toLocaleDateString('nl-NL')}
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(getPropertyLeadCopyText(prop), prop.id)}
                      className={`py-1.5 px-3 rounded-xl border text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                        copiedId === prop.id
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md'
                          : 'bg-[#0B0D0E] border-[#A9875A]/40 hover:border-[#A9875A] hover:bg-[#A9875A]/10 text-[#A9875A]'
                      }`}
                    >
                      {copiedId === prop.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Dossier Gekopieerd!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy details</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#A9AAA7] leading-relaxed">
                  {prop.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 text-xs pt-2 border-t border-white/5">
                  <div className="flex flex-wrap items-center gap-4">
                    <a href={`mailto:${prop.email}`} className="text-[#A9875A] hover:underline flex items-center gap-1">
                      ✉️ {prop.email}
                    </a>
                    <a href={`tel:${prop.phone}`} className="text-[#F7F5F1] hover:underline flex items-center gap-1">
                      📞 {prop.phone}
                    </a>
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono sm:hidden">
                    {new Date(prop.createdAt).toLocaleDateString('nl-NL')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INVESTOR LEADS */}
      {activeTab === 'investor' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#A9AAA7] font-mono">
              Overzicht van gekwalificeerde investeerders en partnervragen.
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {investorLeads.map((inv) => (
              <div key={inv.id} className="p-6 rounded-2xl bg-[#15191A] border border-[#A9875A]/25 space-y-4 shadow-lg hover:border-[#A9875A]/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-lg font-serif text-[#F7F5F1]">{inv.name}</h3>
                    <span className="text-xs text-[#A9875A] font-mono">{inv.companyOrType} • Ticket: {inv.ticketRange}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-[#A9AAA7] font-mono hidden md:block">
                      {new Date(inv.createdAt).toLocaleDateString('nl-NL')}
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(getInvestorLeadCopyText(inv), inv.id)}
                      className={`py-1.5 px-3 rounded-xl border text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                        copiedId === inv.id
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md'
                          : 'bg-[#0B0D0E] border-[#A9875A]/40 hover:border-[#A9875A] hover:bg-[#A9875A]/10 text-[#A9875A]'
                      }`}
                    >
                      {copiedId === inv.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Details Gekopieerd!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy details</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#A9AAA7] leading-relaxed">
                  "{inv.message}"
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 text-xs pt-2 border-t border-white/5">
                  <div className="flex flex-wrap items-center gap-4">
                    <a href={`mailto:${inv.email}`} className="text-[#A9875A] hover:underline">
                      ✉️ {inv.email}
                    </a>
                    {inv.phone && (
                      <a href={`tel:${inv.phone}`} className="text-[#F7F5F1] hover:underline">
                        📞 {inv.phone}
                      </a>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono sm:hidden">
                    {new Date(inv.createdAt).toLocaleDateString('nl-NL')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-6 rounded-2xl bg-[#15191A] border border-white/10 space-y-4">
            <h3 className="text-xl font-serif text-[#F7F5F1]">Prijspsychologie Voorkeuren</h3>
            <p className="text-xs text-[#A9AAA7]">
              Respons van toekomstige gasten op de vraag: "Wat voelt voor jou als een logische prijs voor 2 uur privé wellness?"
            </p>
            
            <div className="space-y-3 pt-2">
              {[
                { tier: '€100–€129', label: 'Basic escape', count: leads.filter(l => l.pricePreference === '€100–€129').length },
                { tier: '€130–€159', label: 'Most chosen ⭐', count: leads.filter(l => l.pricePreference === '€130–€159').length },
                { tier: '€160–€189', label: 'Premium experience', count: leads.filter(l => l.pricePreference === '€160–€189').length },
                { tier: '€190+', label: 'Ultra private', count: leads.filter(l => l.pricePreference === '€190+').length },
              ].map(item => {
                const percent = leads.length ? Math.round((item.count / leads.length) * 100) : 25;
                return (
                  <div key={item.tier} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#F7F5F1] font-medium">{item.tier} ({item.label})</span>
                      <span className="text-[#A9875A] font-mono">{percent}% ({item.count})</span>
                    </div>
                    <div className="w-full bg-[#0B0D0E] h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.tier === '€130–€159' ? 'bg-[#A9875A]' : 'bg-white/20'}`} 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#15191A] border border-white/10 space-y-4">
            <h3 className="text-xl font-serif text-[#F7F5F1]">Ervaringsintentie (Use Case)</h3>
            <p className="text-xs text-[#A9AAA7]">
              Wat gasten het meest aanspreekt bij RedZen Suites:
            </p>

            <div className="space-y-3 pt-2">
              {[
                { label: 'Date night', count: dateNightCount },
                { label: 'Ontspanning', count: ontspanningCount },
                { label: 'Special occasion', count: leads.filter(l => l.useCase === 'Special occasion').length },
                { label: 'Cadeau', count: leads.filter(l => l.useCase === 'Cadeau').length },
              ].map(item => {
                const percent = leads.length ? Math.round((item.count / leads.length) * 100) : 25;
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#F7F5F1] font-medium">{item.label}</span>
                      <span className="text-[#A9875A] font-mono">{percent}% ({item.count})</span>
                    </div>
                    <div className="w-full bg-[#0B0D0E] h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#8A6B41] to-[#A9875A]" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: GOOGLE DRIVE STAY LEDGER */}
      {activeTab === 'drive_ledger' && (
        <GoogleDriveStayLedger 
          leads={leads} 
          onFileSynced={() => {
            // refresh or log
          }}
        />
      )}

      {/* Admin Safety & Demo Reset */}
      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A9AAA7]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#A9875A]" />
          <span>Lokale opslag & optionele cloud synchronisatie actief</span>
        </div>
        <button
          type="button"
          onClick={handleResetDemo}
          className="text-neutral-500 hover:text-neutral-300 underline cursor-pointer text-[11px]"
        >
          Reset testdata naar demo-fabrieksinstellingen
        </button>
      </div>

      {/* Digital Receipt Modal for Admin inspection */}
      {selectedReceipt && (
        <DigitalReceiptModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

    </div>
  );
};

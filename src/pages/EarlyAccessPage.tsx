import React, { useState, useEffect } from 'react';
import { PageRoute, EarlyAccessLead } from '../types';
import { EarlyAccessFunnel } from '../components/EarlyAccessFunnel';
import { LocationPoll } from '../components/LocationPoll';
import { ReferralProgressDashboard } from '../components/ReferralProgressDashboard';
import { getEarlyAccessLeads, getLeadByReferralCode, getLeadByEmail } from '../services/leadStorage';
import { Sparkles, ShieldCheck, MapPin, Bell, KeyRound, Award, Users, Search, ChevronRight } from 'lucide-react';

interface EarlyAccessPageProps {
  onNavigate: (path: PageRoute) => void;
}

export const EarlyAccessPage: React.FC<EarlyAccessPageProps> = ({ onNavigate }) => {
  const [activeMember, setActiveMember] = useState<EarlyAccessLead | null>(null);
  const [memberQuery, setMemberQuery] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [allLeads, setAllLeads] = useState<EarlyAccessLead[]>([]);

  useEffect(() => {
    const leads = getEarlyAccessLeads();
    setAllLeads(leads);

    // Auto-select latest or first lead if available for immediate dashboard preview
    if (leads.length > 0 && !activeMember) {
      // If URL contains ref query or lead param, or pick the first lead with referrals
      const leadWithReferrals = leads.find(l => (l.referralCount || 0) > 0) || leads[0];
      setActiveMember(leadWithReferrals);
    }
  }, []);

  const handleSearchMember = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    if (!memberQuery.trim()) return;

    const trimmed = memberQuery.trim();
    // Search by code, email or member #
    const byCode = getLeadByReferralCode(trimmed);
    const byEmail = getLeadByEmail(trimmed);
    const byNumber = allLeads.find(l => `#${l.memberNumber}` === trimmed || String(l.memberNumber) === trimmed);

    const found = byCode || byEmail || byNumber;
    if (found) {
      setActiveMember(found);
      setSearchError(null);
    } else {
      setSearchError('Geen lid gevonden met deze referralcode, e-mail of lidnummer.');
    }
  };

  const handleMemberUpdated = (updated: EarlyAccessLead) => {
    setActiveMember(updated);
    setAllLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15191A] border border-[#A9875A]/40 text-[#A9875A] text-xs font-mono uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#A9875A] animate-pulse" />
          Pre-Launch Privilege • €50 Korting
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-serif text-[#F7F5F1] leading-tight">
          Reserveer nú Early Access & ontvang <span className="text-[#A9875A] italic">€50 korting</span>.
        </h1>
        
        <p className="text-base sm:text-lg text-[#A9AAA7] font-light max-w-2xl mx-auto leading-relaxed">
          De eerste 1.000 leden ontvangen 48u exclusieve voorrang op de boekingskalender én een directe welkomstkorting van €50 (€150 i.p.v. €200 per 2 uur voor 2 personen).
        </p>
      </div>

      {/* Member Referral & Tier Status Dashboard */}
      {activeMember && (
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#A9875A]" />
              <h2 className="text-lg font-serif text-[#F7F5F1]">
                Early Access Member Dashboard
              </h2>
            </div>

            {/* Switch member lookup */}
            <form onSubmit={handleSearchMember} className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Zoek code, e-mail of #..."
                  value={memberQuery}
                  onChange={(e) => setMemberQuery(e.target.value)}
                  className="px-3 py-1.5 pl-8 rounded-lg bg-[#15191A] border border-white/10 text-xs font-mono text-[#F7F5F1] placeholder:text-[#A9AAA7]/60 focus:outline-none focus:border-[#A9875A]/60 w-52"
                />
                <Search className="w-3.5 h-3.5 text-[#A9AAA7] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-[#A9875A]/20 hover:bg-[#A9875A]/30 border border-[#A9875A]/40 text-[#A9875A] text-xs font-mono transition-colors cursor-pointer"
              >
                Bekijk
              </button>
            </form>
          </div>

          {searchError && (
            <p className="text-xs text-rose-400 font-mono px-1">{searchError}</p>
          )}

          {/* Quick Member Switcher Pills for Testing */}
          {allLeads.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono text-[#A9AAA7] px-1">
              <span className="shrink-0 text-[11px]">Demolid selecteren:</span>
              {allLeads.slice(0, 5).map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => { setActiveMember(l); setSearchError(null); }}
                  className={`px-2.5 py-1 rounded-md border text-[11px] shrink-0 transition-colors cursor-pointer ${
                    activeMember.id === l.id 
                      ? 'bg-[#A9875A] text-[#0B0D0E] font-bold border-[#A9875A]' 
                      : 'bg-[#15191A] text-[#A9AAA7] hover:text-[#F7F5F1] border-white/10'
                  }`}
                >
                  {l.firstName} ({l.referralCount || 0} refs)
                </button>
              ))}
            </div>
          )}

          <ReferralProgressDashboard
            member={activeMember}
            onMemberUpdated={handleMemberUpdated}
          />
        </div>
      )}

      {/* The 3-Step Funnel */}
      <EarlyAccessFunnel 
        id="standalone-early-access-funnel" 
        standalone 
        onSuccess={(newLead) => {
          setActiveMember(newLead);
          setAllLeads(prev => [newLead, ...prev]);
        }}
      />

      {/* Location Poll / Demand Heatmap */}
      <LocationPoll />

      {/* Trust & Guarantee points */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-center md:text-left">
        <div className="p-6 rounded-2xl bg-[#15191A] border border-[#A9875A]/20 space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#A9875A]">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">€50 Openingskorting</span>
          </div>
          <p className="text-xs text-[#A9AAA7]">
            Vaste pre-launch welkomstvoucher: €150 i.p.v. €200 voor 2 uur (2 personen) bij pre-reservering nú.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#15191A] border border-white/5 space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#A9875A]">
            <KeyRound className="w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">48u Voorrang</span>
          </div>
          <p className="text-xs text-[#A9AAA7]">
            Boek je gewenste tijdslot en datum 48 uur voordat de agenda voor het grote publiek opent.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#15191A] border border-white/5 space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#A9875A]">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Geen Verplichting</span>
          </div>
          <p className="text-xs text-[#A9AAA7]">
            Deelname aan Early Access is 100% gratis en vrijblijvend. Geen automatische kosten of abonnement.
          </p>
        </div>
      </div>

    </div>
  );
};

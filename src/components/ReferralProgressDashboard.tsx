import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  ChevronRight, 
  Gift, 
  Lock, 
  Unlock,
  Info,
  Flame
} from 'lucide-react';
import { EarlyAccessLead } from '../types';
import { REFERRAL_TIERS, getTierForReferralCount, ReferralTier } from '../data/referralTiers';
import { incrementMemberReferral } from '../services/leadStorage';

interface ReferralProgressDashboardProps {
  member: EarlyAccessLead;
  onMemberUpdated?: (updatedMember: EarlyAccessLead) => void;
  className?: string;
}

export const ReferralProgressDashboard: React.FC<ReferralProgressDashboardProps> = ({
  member,
  onMemberUpdated,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTierDetail, setActiveTierDetail] = useState<ReferralTier | null>(null);
  const [isSimulatingInvite, setIsSimulatingInvite] = useState(false);
  const [inviteSuccessNotice, setInviteSuccessNotice] = useState<string | null>(null);

  const referralCount = member.referralCount || 0;
  const referralCode = member.referralCode || `ZEN-${member.memberNumber}`;
  const shareUrl = `${window.location.origin}/#early-access?ref=${referralCode}`;

  const { currentTier, nextTier, progressPercent, referralsNeeded } = getTierForReferralCount(referralCount);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulateInvite = () => {
    setIsSimulatingInvite(true);
    setTimeout(() => {
      const updated = incrementMemberReferral(member.id);
      if (updated && onMemberUpdated) {
        onMemberUpdated(updated);
      }
      setIsSimulatingInvite(false);
      setInviteSuccessNotice(`Nieuwe referral geregistreerd! Totaal: ${(referralCount + 1)} uitnodigingen.`);
      setTimeout(() => setInviteSuccessNotice(null), 4000);
    }, 450);
  };

  return (
    <div className={`bg-[#15191A] border border-[#A9875A]/40 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Subtle Background Glow */}
      <div 
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #A9875A 0%, transparent 70%)' }}
      />

      {/* Header with Member Info & Current Tier Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{currentTier.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-serif text-[#F7F5F1] tracking-tight">
                  Referral & Tier Status
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#A9875A]/20 border border-[#A9875A]/50 text-[#A9875A] font-semibold">
                  Lid #{member.memberNumber}
                </span>
              </div>
              <p className="text-xs text-[#A9AAA7] mt-0.5">
                Verwelkomd als <strong className="text-[#F7F5F1] font-medium">{member.firstName}</strong> ({member.email})
              </p>
            </div>
          </div>
        </div>

        {/* Current Active Tier Pill */}
        <div className="flex items-center gap-3 bg-[#0B0D0E]/80 border border-white/10 rounded-xl p-3 sm:px-4 sm:py-3">
          <div className="w-10 h-10 rounded-lg bg-[#A9875A]/15 border border-[#A9875A]/30 flex items-center justify-center text-lg">
            {currentTier.icon}
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#A9AAA7]">Huidige Status</div>
            <div className="text-sm font-semibold text-[#F7F5F1] flex items-center gap-1.5">
              <span>{currentTier.name}</span>
            </div>
            <div className="text-[11px] text-[#A9875A] font-mono">
              Level {currentTier.level} van 4
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS NOTICE */}
      {inviteSuccessNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{inviteSuccessNotice}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setInviteSuccessNotice(null)}
            className="text-emerald-400 hover:text-white text-xs ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Progress Bar & Metric Section */}
      <div className="space-y-4 bg-[#0B0D0E]/60 border border-white/5 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs uppercase font-mono text-[#A9AAA7] tracking-wider">Voortgang naar volgende tier</div>
            <div className="text-lg sm:text-xl font-serif text-[#F7F5F1] mt-0.5">
              {nextTier ? (
                <>
                  <span className="text-[#A9875A] font-sans font-bold">{referralsNeeded}</span> {referralsNeeded === 1 ? 'uitnodiging' : 'uitnodigingen'} nodig voor <span className="underline decoration-[#A9875A]/60">{nextTier.name}</span>
                </>
              ) : (
                <span className="text-emerald-400">Hoogste Ere-Status Bereikt (Founding Patron)</span>
              )}
            </div>
          </div>
          <div className="text-right font-mono">
            <span className="text-2xl font-bold text-[#F7F5F1]">{referralCount}</span>
            <span className="text-xs text-[#A9AAA7]"> referrals geregistreerd</span>
          </div>
        </div>

        {/* The Animated Progress Bar */}
        <div className="relative pt-2">
          {/* Progress track */}
          <div className="w-full h-3.5 bg-[#181E20] rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
            <div 
              className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
              style={{ 
                width: `${nextTier ? Math.max(8, progressPercent) : 100}%`,
                background: 'linear-gradient(90deg, #A9875A 0%, #C5A069 50%, #E5C992 100%)'
              }}
            >
              {/* Shimmer sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full animate-pulse" />
            </div>
          </div>

          {/* Stepped Tier Milestones along the Bar */}
          <div className="grid grid-cols-4 gap-2 pt-3">
            {REFERRAL_TIERS.map((tier) => {
              const isUnlocked = referralCount >= tier.minReferrals;
              const isCurrent = currentTier.id === tier.id;

              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setActiveTierDetail(tier)}
                  className={`text-left p-2 rounded-lg border transition-all cursor-pointer ${
                    isCurrent 
                      ? 'bg-[#A9875A]/15 border-[#A9875A] shadow-sm'
                      : isUnlocked
                      ? 'bg-white/[0.03] border-white/20 hover:border-[#A9875A]/50'
                      : 'bg-[#0B0D0E]/40 border-white/5 opacity-60 hover:opacity-90'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#F7F5F1] font-semibold">{tier.minReferrals} refs</span>
                    {isUnlocked ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Lock className="w-3 h-3 text-[#A9AAA7]" />
                    )}
                  </div>
                  <div className="text-xs font-serif text-[#F7F5F1] truncate mt-0.5">
                    {tier.badge}
                  </div>
                  <div className="text-[10px] text-[#A9875A] truncate mt-0.5 hidden sm:block">
                    {tier.rewardTitle.split('&')[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Unique Referral Link & Share Tools */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider text-[#A9AAA7] flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-[#A9875A]" />
            <span>Uw Persoonlijke Uitnodigingslink</span>
          </label>
          <span className="text-[11px] text-[#A9875A] font-mono">
            Code: <strong className="text-[#F7F5F1] font-bold">{referralCode}</strong>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="flex-1 flex items-center bg-[#0B0D0E] border border-white/10 rounded-xl px-3.5 py-2.5 font-mono text-xs text-[#F7F5F1] overflow-hidden">
            <span className="text-[#A9AAA7] select-none mr-1">🔗</span>
            <input 
              type="text" 
              readOnly 
              value={shareUrl} 
              className="bg-transparent text-[#F7F5F1] w-full outline-none select-all"
            />
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="px-5 py-2.5 rounded-xl bg-[#A9875A] hover:bg-[#C5A069] text-[#0B0D0E] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#0B0D0E]" />
                <span>Gekopieerd!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#0B0D0E]" />
                <span>Kopieer Link</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSimulateInvite}
            disabled={isSimulatingInvite}
            title="Simuleer een vriend die zich inschrijft met uw referral link"
            className="px-4 py-2.5 rounded-xl bg-[#181E20] hover:bg-[#22292c] text-[#A9AAA7] hover:text-[#F7F5F1] border border-white/10 text-xs font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{isSimulatingInvite ? 'Verwerken...' : '+1 Test Invite'}</span>
          </button>
        </div>
        <p className="text-[11px] text-[#A9AAA7] leading-relaxed">
          Deel uw persoonlijke link via WhatsApp, LinkedIn of e-mail. Wanneer iemand via uw link reserveert of early access aanvraagt, wordt hun status direct bijgeschreven op uw dashboard.
        </p>
      </div>

      {/* Tier Perks & Rewards Cards Carousel/Grid */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase font-mono tracking-wider text-[#A9AAA7] flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5 text-[#A9875A]" />
            <span>Overzicht Beloningen per Tier</span>
          </h4>
          <span className="text-[11px] text-[#A9AAA7]">Klik op een tier voor details</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REFERRAL_TIERS.map((tier) => {
            const isUnlocked = referralCount >= tier.minReferrals;
            const isCurrent = currentTier.id === tier.id;

            return (
              <div 
                key={tier.id}
                onClick={() => setActiveTierDetail(tier)}
                className={`p-5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  isCurrent
                    ? 'bg-[#181E20] border-[#A9875A] ring-1 ring-[#A9875A]/30'
                    : isUnlocked
                    ? 'bg-[#0B0D0E]/90 border-emerald-500/30 hover:border-emerald-500/60'
                    : 'bg-[#0B0D0E]/50 border-white/5 opacity-70 hover:opacity-95'
                }`}
              >
                {/* Status Indicator */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{tier.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-[#F7F5F1]">{tier.name}</div>
                      <div className="text-[10px] font-mono text-[#A9AAA7]">
                        {tier.minReferrals === 0 ? 'Basis Early Access' : `${tier.minReferrals} referrals vereist`}
                      </div>
                    </div>
                  </div>

                  {isCurrent ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#A9875A] text-[#0B0D0E] font-bold">
                      Actief
                    </span>
                  ) : isUnlocked ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-medium flex items-center gap-1">
                      <Unlock className="w-2.5 h-2.5" /> Ontgrendeld
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/5 text-[#A9AAA7] flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Vergrendeld
                    </span>
                  )}
                </div>

                <div className="text-xs font-medium text-[#A9875A] mb-1">
                  {tier.rewardTitle}
                </div>
                <div className="text-[11px] text-[#A9AAA7] mb-3">
                  {tier.rewardSubtitle}
                </div>

                <ul className="space-y-1.5 border-t border-white/5 pt-2.5">
                  {tier.perks.slice(0, 2).map((perk, i) => (
                    <li key={i} className="text-xs text-[#F7F5F1]/80 flex items-start gap-1.5">
                      <span className="text-[#A9875A] text-xs mt-0.5">✦</span>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tier Details Modal Dialog */}
      {activeTierDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#15191A] border border-[#A9875A]/60 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6 relative">
            <button
              type="button"
              onClick={() => setActiveTierDetail(null)}
              className="absolute top-5 right-5 text-[#A9AAA7] hover:text-white text-lg p-1 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <span className="text-3xl">{activeTierDetail.icon}</span>
              <div>
                <div className="text-[11px] uppercase font-mono tracking-widest text-[#A9875A]">
                  Tier Level {activeTierDetail.level}
                </div>
                <h4 className="text-xl font-serif text-[#F7F5F1]">{activeTierDetail.name}</h4>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0D0E] border border-white/10 space-y-1">
              <div className="text-xs font-mono uppercase text-[#A9AAA7]">Hoofdbeloning</div>
              <div className="text-sm font-semibold text-[#A9875A]">{activeTierDetail.rewardTitle}</div>
              <div className="text-xs text-[#A9AAA7]">{activeTierDetail.rewardSubtitle}</div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono uppercase text-[#A9AAA7] tracking-wider">
                Inbegrepen Privileges & Perks:
              </div>
              <ul className="space-y-2.5">
                {activeTierDetail.perks.map((perk, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#F7F5F1] bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-[#A9AAA7]">
              <span>Vereist: <strong className="text-[#F7F5F1]">{activeTierDetail.minReferrals} referrals</strong></span>
              <button
                type="button"
                onClick={() => setActiveTierDetail(null)}
                className="px-4 py-2 rounded-xl bg-[#A9875A] hover:bg-[#C5A069] text-[#0B0D0E] font-semibold text-xs transition-colors cursor-pointer"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

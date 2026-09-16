export interface ReferralTier {
  id: string;
  level: number;
  name: string;
  minReferrals: number;
  badge: string;
  icon: string;
  color: string;
  rewardTitle: string;
  rewardSubtitle: string;
  perks: string[];
}

export const REFERRAL_TIERS: ReferralTier[] = [
  {
    id: 'tier-pioneer',
    level: 1,
    name: 'Pioneer Member',
    minReferrals: 0,
    badge: 'Pioneer (0)',
    icon: '🌱',
    color: '#A9875A',
    rewardTitle: '€50 Directe Welkomstkorting & 48u Voorrang',
    rewardSubtitle: 'Gegarandeerde openingsvoucher bij officiële lancering',
    perks: [
      '€50 openingsvoucher op eerste sessie van 2 uur',
      '48 uur exclusieve voorrang op de publieke reserveringskalender',
      'Toegang tot de private pre-launch mailinglist & updates'
    ]
  },
  {
    id: 'tier-ambassador',
    level: 2,
    name: 'Ambassador',
    minReferrals: 3,
    badge: 'Ambassador (3+)',
    icon: '✨',
    color: '#C5A069',
    rewardTitle: 'Gratis Rituals® Signature Wellness Pakket',
    rewardSubtitle: 'T.w.v. €45 inbegrepen bij uw eerste suite boeking',
    perks: [
      'Alle Pioneer privileges',
      'Gratis Rituals The Ritual of Jing / Sakura gift set in de suite',
      'Voorrang bij gewenste suite selectie (Akoya of Kuro)',
      '1x gratis welkomst mocktail & artisanale infusie voor 2 personen'
    ]
  },
  {
    id: 'tier-inner-circle',
    level: 3,
    name: 'Inner Circle',
    minReferrals: 5,
    badge: 'Inner Circle (5+)',
    icon: '💎',
    color: '#E5C992',
    rewardTitle: '+1 Uur Gratis Verlenging & Private Bar Tasting',
    rewardSubtitle: 'Totaal 3 uur ultiem ontspannen t.w.v. €95 voordeel',
    perks: [
      'Alle Ambassador privileges',
      'Gratis +1 uur suite verlenging (3 uur i.p.v. 2 uur verblijf)',
      'Inclusief Organic Herbal Tea bar en gekoelde cold-pressed juices',
      'Exclusieve uitnodiging voor de zachte pre-opening testweek'
    ]
  },
  {
    id: 'tier-black-orchid',
    level: 4,
    name: 'Black Orchid Founding Patron',
    minReferrals: 10,
    badge: 'Black Orchid (10+)',
    icon: '👑',
    color: '#F3E5AB',
    rewardTitle: 'Volledig Gratis 2-Uur Privé Suite Verblijf',
    rewardSubtitle: 'Ultieme ere-status t.w.v. €200 + permanente VIP perks',
    perks: [
      '1x Volledig kosteloos 2-uurs suite verblijf voor 2 personen',
      'Levenslang 15% VIP-tarief op alle toekomstige reserveringen',
      'Gepersonaliseerde gouden lidmaatschapspas & gegraveerde keycard',
      'Direct contact met de conciërge voor gegarandeerde reserveringen'
    ]
  }
];

export interface TierProgressCalculation {
  currentTier: ReferralTier;
  nextTier: ReferralTier | null;
  progressPercent: number;
  referralsNeeded: number;
  totalForNextTier: number;
}

export function getTierForReferralCount(referralCount: number): TierProgressCalculation {
  const count = Math.max(0, referralCount);

  let currentTier = REFERRAL_TIERS[0];
  for (let i = REFERRAL_TIERS.length - 1; i >= 0; i--) {
    if (count >= REFERRAL_TIERS[i].minReferrals) {
      currentTier = REFERRAL_TIERS[i];
      break;
    }
  }

  const currentTierIndex = REFERRAL_TIERS.findIndex(t => t.id === currentTier.id);
  const nextTier = currentTierIndex < REFERRAL_TIERS.length - 1 ? REFERRAL_TIERS[currentTierIndex + 1] : null;

  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      progressPercent: 100,
      referralsNeeded: 0,
      totalForNextTier: currentTier.minReferrals
    };
  }

  const rangeStart = currentTier.minReferrals;
  const rangeEnd = nextTier.minReferrals;
  const progressInRange = count - rangeStart;
  const totalRange = rangeEnd - rangeStart;

  const progressPercent = Math.min(100, Math.max(0, Math.round((progressInRange / totalRange) * 100)));
  const referralsNeeded = Math.max(0, rangeEnd - count);

  return {
    currentTier,
    nextTier,
    progressPercent,
    referralsNeeded,
    totalForNextTier: rangeEnd
  };
}

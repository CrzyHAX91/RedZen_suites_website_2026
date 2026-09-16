/**
 * RedZen Suites — Wellness Copy & Stay Ledger Content
 * Dual language (NL / EN) in sync.
 * Rest, breath, heat/cold language, sleep hygiene, tea, gentle mobility, privacy, booking.
 */

export interface WellnessRitual {
  id: string;
  category: 'heat_cold' | 'breath' | 'sleep' | 'tea' | 'mobility' | 'privacy';
  iconEmoji: string;
  nl: {
    title: string;
    subtitle: string;
    description: string;
    protocol: string[];
  };
  en: {
    title: string;
    subtitle: string;
    description: string;
    protocol: string[];
  };
}

export const WELLNESS_RITUALS: WellnessRitual[] = [
  {
    id: 'heat-cold',
    category: 'heat_cold',
    iconEmoji: '🔥❄️',
    nl: {
      title: 'Warmte- & Koudecyclus',
      subtitle: 'Circulatie, herstel en diepe spierontspanning',
      description: 'Stille Finse cederhouten sauna (85°C) gecombineerd met een gecontroleerd dompelbad en koude regendouche. Stimuleert de doorbloeding en brengt het zenuwstelsel tot rust.',
      protocol: [
        '10–15 minuten rustig ademen in de cederhouten sauna',
        '30–60 seconden koud dompelbad of stortdouche',
        '10 minuten rust in de lounge met een deken en warme infusie'
      ]
    },
    en: {
      title: 'Heat & Contrast Ritual',
      subtitle: 'Circulation, cellular recovery, and restorative calm',
      description: 'Silent cedar sauna (85°C) paired with a regulated cold plunge and rainfall rinse. Stimulates vascular tone and grounds the sympathetic nervous system.',
      protocol: [
        '10–15 minutes of slow nasal breathing in the sauna',
        '30–60 seconds controlled cold immersion or cool deluge',
        '10 minutes supine rest wrapped in organic linen with warm herbal infusion'
      ]
    }
  },
  {
    id: 'breath',
    category: 'breath',
    iconEmoji: '🌬️✨',
    nl: {
      title: 'Adem & Parasympathische Rust',
      subtitle: 'Van alertheid naar herstel in 8 minuten',
      description: 'Begeleide 4-7-8 en box-breathing resonantie met zachte akoestische resonantie. Verlaagt de hartslag en brengt de nervus vagus in kalmte.',
      protocol: [
        'Zittend of liggend op het linnen futonmatras',
        '4 tellen zachte inademing door de neus',
        '7 tellen ontspannen vasthouden, 8 tellen gelijkmatige uitademing'
      ]
    },
    en: {
      title: 'Breathwork & Vagal Down-regulation',
      subtitle: 'Shift from alert vigilance to parasympathetic calm',
      description: 'Guided 4-7-8 cadence and box breathing synchronized with low-frequency acoustic warmth. Calms heart-rate variability and resets autonomic tone.',
      protocol: [
        'Reclined on the organic linen daybed',
        '4-count gentle nasal inhale',
        '7-count relaxed retention, followed by an effortless 8-count audible exhale'
      ]
    }
  },
  {
    id: 'tea',
    category: 'tea',
    iconEmoji: '🍵🌿',
    nl: {
      title: 'Biologische Kruiden & Theeritueel',
      subtitle: 'Kamille, citroenmelisse, lavendel en lindebloesem',
      description: 'Zorgvuldig samengestelde avondmelanges zonder theïne of cafeïne. Ondersteunt de hydratatie na de warmtegang en stimuleert natuurlijke melatonine-aanmaak.',
      protocol: [
        'Warm mineraalwater geschonken in handgemaakt aardewerk',
        '7 minuten laten trekken onder houten deksel',
        'Langzaam nippen tussen de sauna- en rustcycli'
      ]
    },
    en: {
      title: 'Artisan Herbal Infusion',
      subtitle: 'Chamomile blossom, lemon balm, lavender, and linden',
      description: 'Curated zero-caffeine night botanicals. Restores intracellular hydration post-sauna and prepares the biological clock for restorative sleep.',
      protocol: [
        'Poured at 88°C into handcrafted stoneware bowls',
        'Steep for 7 minutes under a solid cedar lid',
        'Sip slowly between contrast rounds'
      ]
    }
  },
  {
    id: 'sleep',
    category: 'sleep',
    iconEmoji: '🌙🛏️',
    nl: {
      title: 'Slaaphygiëne & Akoestische Stilte',
      subtitle: 'Circadiaans licht, gewogen linnen en 18°C slaapklimaat',
      description: 'Elke suite is akoestisch ontkoppeld (NC-25) en vrij van blauw schermlicht. Slimme warmtepompen houden de slaapzone op een constante, frisse 18°C.',
      protocol: [
        'Amberkleurige schemering (< 2200K) geactiveerd 60 minuten voor rust',
        'Matras van 100% natuurlijk latex met ongebleekt linnen',
        'Volledige duisternis zonder led-stand-by lampjes in het zicht'
      ]
    },
    en: {
      title: 'Circadian Sleep Hygiene',
      subtitle: 'Amber twilight, acoustic isolation, and crisp 18°C climate',
      description: 'Suites are engineered to NC-25 acoustic silence and zero blue light emission. High-efficiency heat recovery keeps the sleep sanctuary at 18°C.',
      protocol: [
        'Warm amber twilight (< 2200K) initiated 60 minutes prior to sleep',
        'Natural talalay latex mattress clothed in unbleached Belgian linen',
        'Absolute blackout with zero standby LEDs'
      ]
    }
  },
  {
    id: 'mobility',
    category: 'mobility',
    iconEmoji: '🧘‍♂️🎋',
    nl: {
      title: 'Zachte Mobiliteit & Lichaamsspanning',
      subtitle: 'Verlicht druk op de onderrug, heupen en schouders',
      description: 'Natuurlijke kurken blokken, geweven yogamatten en zachte stretches om opgebouwde werkdruk en stijfheid los te laten.',
      protocol: [
        '5 minuten kindhouding (Balasana) met diepe buikademing',
        'Zachte heupopeners op kurkblokken',
        'Wervelkolomrotaties in een warm vertrek'
      ]
    },
    en: {
      title: 'Gentle Mobility & Somatic Release',
      subtitle: 'Decompress lower back, hip flexors, and cervical spine',
      description: 'Solid cork blocks, heavy-gauge organic cotton mats, and restorative postures to release accumulated work tension.',
      protocol: [
        '5 minutes supported child pose with deep diaphragmatic expansion',
        'Gentle hip releases using contoured cork blocks',
        'Passive spinal twists in ambient warmth'
      ]
    }
  },
  {
    id: 'privacy',
    category: 'privacy',
    iconEmoji: '🔒🗝️',
    nl: {
      title: '100% Discrete Privacy',
      subtitle: 'Geen gedeelde ruimtes, geen receptielijn, contactloze toegang',
      description: 'Uw verblijf is exclusief van u. Een discrete gecodeerde entree geeft toegang tot uw suite zonder personeel of mede-gasten.',
      protocol: [
        'Persoonlijke veilige pincode 2 uur voor aanvang verzonden',
        'Geen camera’s in leef- of wellnessruimtes',
        'Volledige privacygarantie voor rustzoekers en professionals'
      ]
    },
    en: {
      title: '100% Uncompromised Privacy',
      subtitle: 'Zero shared facilities, no front desk, contactless access',
      description: 'Your sanctuary is entirely yours. Encrypted digital access allows keyless check-in without encountering staff or other guests.',
      protocol: [
        'Unique single-use code issued 2 hours prior to arrival',
        'Zero cameras or monitoring inside private wellness areas',
        'Discreet soundproofing and private parking provisions'
      ]
    }
  }
];

export const REDZEN_LINKS = {
  canonicalApp: 'https://ai.studio/apps/1e004522-0347-4fea-ae85-921961b0fa72',
  githubRepo: 'https://github.com/CrzyHAX91/RedZen_Suites_Security_website',
  socialHub: 'https://redzen-suites-wellness-crzyhaxs.vercel.app'
};

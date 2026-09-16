export interface Suite {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: 'planned' | 'confirmed';
  statusLabel?: string;
  idealFor: string[];
  plannedFacilities: string[];
  possibleAddOns: string[];
  image: string;
  imageAlt: string;
  sourceKey: string;
  pricingNote: string;
  capacityText: string;
  sessionDuration: string;
}

export const SUITES_DATA: Suite[] = [
  {
    slug: 'zen-one',
    name: 'ZEN ONE',
    tagline: 'Intieme Verleiding. Warm Cederhout. Alleen Voor Twee.',
    status: 'planned',
    statusLabel: 'PLANNED EXPERIENCE',
    description: 'Zen One is een zwoel, intiem toevluchtsoord ontworpen voor geliefden die elkaar willen herontdekken in een wereld van zachte schaduwen, fluweel en hypnotiserende warmte. Een geurende Ayous-ceder panoramasauna, een dampend magnesiumbad en totale, onbespiedbare afzondering.',
    idealFor: [
      'Sultry date nights voor twee',
      'Sensuele warmte & decompressie',
      'Passievolle jubilea & verjaardagen',
      'Samen naakt wegdrijven in stilte'
    ],
    plannedFacilities: [
      'Privé panoramasauna met amber gloed & rozenstoom',
      'Therapeutisch 38°C magnesium hydrobad',
      'Velvet loungebed met Egyptisch linnen',
      'Sensuele regendouche & rozenscrub',
      'Intiem dimbaar kaars- & roodlicht (1800K)',
      '528Hz harthonen & akoestisch heiligdom',
      'Gekoelde biologische champagne & verse truffels',
      '100% discrete en contactloze toegang'
    ],
    possibleAddOns: [
      'Midnight Passion verlenging (+1 uur)',
      'Biologische champagne & cacaotruffels',
      'Damaskroos & sandelhout etherische oliën',
      'Zijdezachte 800gsm badjassen & slippers',
      'Romantische kaarslicht- en bloemenopstelling'
    ],
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=80',
    imageAlt: 'Architecturale weergave van een minimalistische privé saunasuite met natuurlijk hout en zacht indirect licht',
    sourceKey: 'suite_zen_one',
    pricingNote: 'Indicatief basistarief: €200 / 2 uur (€150 met €50 Early Access voordeel)',
    capacityText: 'Exclusief voor 2 personen',
    sessionDuration: '2 tot 3 uur tijdsloten'
  },
  {
    slug: 'zen-signature',
    name: 'ZEN SIGNATURE',
    tagline: 'De Ultieme Master Suite voor Passie & Grandeur.',
    status: 'planned',
    statusLabel: 'PLANNED EXPERIENCE',
    description: 'Zen Signature is het sensuele vlaggenschip van RedZen Suites. Riant, verleidelijk en voorzien van een flakkerende bio-ethanol sfeerhaard, een tweepersoons ligbad met gerichte hydromassagestralen, zwoele rode sfeergloed en een kingsize velvet loungebed. Hier smelten tijd, zintuigen en verlangens samen.',
    idealFor: [
      'Onvergetelijke huwelijksnachten & jubilea',
      'Sultry midnight dates in pure weelde',
      'Grootse sensuele verwennerij',
      'Intieme meer-uurs wellness retreats'
    ],
    plannedFacilities: [
      'Grote panoramasauna met duaal klimaat & rozenstoom',
      'Tweepersoons therapeutische magnesium hydro spa (38°C)',
      'Flakkerende bio-ethanol sfeerhaard',
      'Kingsize velvet daybed met zacht natuurlijk linnen',
      'Sensuele amber- en rozengloed scènes (1600K-2200K)',
      'Studio-grade akoestiek & binaurale soundscapes',
      'Private champagnebar met aphrodisiac tonics',
      '100% onbespiedbare digitale check-in'
    ],
    possibleAddOns: [
      'The Sensual Retreat arrangementspakket',
      'Kaviaar & biologische champagne service',
      'Sensuele massage-oliën & geurrituelen',
      'Verlengde nachtelijke sessies tot 4 uur',
      'Gepersonaliseerde rozenblaadjes-ambiance'
    ],
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1400&q=80',
    imageAlt: 'Architecturaal interieur van een royale wellness suite met spa bad, natuursteen en sfeerverlichting',
    sourceKey: 'suite_zen_signature',
    pricingNote: 'Indicatief basistarief: €200 / 2 uur (€150 met €50 Early Access voordeel)',
    capacityText: 'Exclusief voor 2 personen',
    sessionDuration: '2.5 tot 4 uur tijdsloten'
  }
];

export interface SuiteComparisonRow {
  feature: string;
  zenOne: string | boolean;
  zenSignature: string | boolean;
  isPlanned?: boolean;
}

export const SUITE_COMPARISON_DATA: SuiteComparisonRow[] = [
  {
    feature: 'Privacy',
    zenOne: '100% Volledig privé',
    zenSignature: '100% Volledig privé',
    isPlanned: true
  },
  {
    feature: 'Private sauna',
    zenOne: 'Finse Panoramasauna',
    zenSignature: 'Finse Sauna + Zachte Bio-Sauna',
    isPlanned: true
  },
  {
    feature: 'Shower',
    zenOne: 'Luxe regendouche',
    zenSignature: 'Dubbele sensorial regendouche',
    isPlanned: true
  },
  {
    feature: 'Lounge',
    zenOne: 'Intieme ontspanningslounge',
    zenSignature: 'Royale lounge met daybed & sfeerhaard',
    isPlanned: true
  },
  {
    feature: 'Spa/wellness bath',
    zenOne: 'Magnesium hydrotherapie bad',
    zenSignature: 'Grande magnesium spa met ligmassage',
    isPlanned: true
  },
  {
    feature: 'Digital access',
    zenOne: 'Contactloze digitale sleutel',
    zenSignature: 'Contactloze digitale sleutel',
    isPlanned: true
  },
  {
    feature: 'Atmosphere controls',
    zenOne: 'Slimme licht- & audioregeling',
    zenSignature: 'Uitgebreide sfeer-, audio- & lichtscènes',
    isPlanned: true
  },
  {
    feature: 'Intended guest profile',
    zenOne: '1 – 2 personen',
    zenSignature: '2 – 4 personen',
    isPlanned: true
  },
  {
    feature: 'Future arrangements',
    zenOne: 'Date night, Self-care, Relax',
    zenSignature: 'Romance, Celebrate, Extended stays',
    isPlanned: true
  }
];

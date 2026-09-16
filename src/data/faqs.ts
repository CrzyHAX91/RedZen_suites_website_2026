export type FAQCategory = 
  | 'Algemeen'
  | 'Suites'
  | 'Boeken en prijzen'
  | 'Hygiëne en veiligheid'
  | 'Duurzaamheid'
  | 'Investeren en samenwerken';

export interface FAQItem {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
  order: number;
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  'Algemeen',
  'Suites',
  'Boeken en prijzen',
  'Hygiëne en veiligheid',
  'Duurzaamheid',
  'Investeren en samenwerken'
];

export const FAQ_ITEMS_DATA: FAQItem[] = [
  // ALGEMEEN
  {
    id: 'faq-gen-1',
    category: 'Algemeen',
    order: 1,
    question: 'Is RedZen Suites al geopend?',
    answer: 'Nog niet. De eerste RedZen-locatie bevindt zich in de ontwikkelingsfase. Via Early Access ontvang je als eerste nieuws over de locatie, suites en toekomstige opening.'
  },
  {
    id: 'faq-gen-2',
    category: 'Algemeen',
    order: 2,
    question: 'Waar komt de eerste locatie?',
    answer: 'De definitieve locatie is nog niet bevestigd. Locatieonderzoek is actief. Early Access-data, bereikbaarheid, pandgeschiktheid en lokale marktvraag worden meegenomen in de besluitvorming.'
  },
  {
    id: 'faq-gen-3',
    category: 'Algemeen',
    order: 3,
    question: 'Wat is een privéwellnesssuite?',
    answer: 'Een privéwellnesssuite is gedurende jouw gereserveerde tijd uitsluitend beschikbaar voor jou en je gezelschap. De wellnessvoorzieningen worden niet gedeeld met andere bezoekers.'
  },
  {
    id: 'faq-gen-4',
    category: 'Algemeen',
    order: 4,
    question: 'Voor wie wordt RedZen ontwikkeld?',
    answer: 'RedZen wordt primair ontwikkeld voor kleine gezelschappen, couples en gasten die waarde hechten aan privacy, rust en een premium omgeving.'
  },

  // SUITES
  {
    id: 'faq-suite-1',
    category: 'Suites',
    order: 5,
    question: 'Welke faciliteiten krijgen de suites?',
    answer: 'De geplande ervaring omvat onder andere een privésauna, douche, lounge, sfeerregeling en digitale toegang. Zen Signature wordt onderzocht als uitgebreidere suite met aanvullende wellnessfaciliteiten. Definitieve specificaties volgen nadat de locatie en technische mogelijkheden zijn bevestigd.'
  },
  {
    id: 'faq-suite-2',
    category: 'Suites',
    order: 6,
    question: 'Hoeveel personen kunnen in een suite?',
    answer: 'De definitieve capaciteit wordt per suite vastgesteld. De eerste suiteconcepten worden primair ontworpen voor één of twee gasten en mogelijk kleine gezelschappen.'
  },
  {
    id: 'faq-suite-3',
    category: 'Suites',
    order: 7,
    question: 'Zijn de afbeeldingen op de website definitief?',
    answer: 'Afbeeldingen kunnen tijdens de ontwikkelingsfase sfeerbeelden, architecturale referenties of conceptvisualisaties zijn. Zij laten de beoogde uitstraling zien en vormen nog geen definitieve weergave van de eerste locatie.'
  },

  // BOEKEN EN PRIJZEN
  {
    id: 'faq-book-1',
    category: 'Boeken en prijzen',
    order: 8,
    question: 'Kan ik al reserveren?',
    answer: 'Nog niet. Reserveringen worden geopend nadat de eerste locatie, faciliteiten, opening en operationele planning zijn bevestigd.'
  },
  {
    id: 'faq-book-2',
    category: 'Boeken en prijzen',
    order: 9,
    question: 'Wat gaat een sessie kosten?',
    answer: 'De definitieve prijzen zijn nog niet vastgesteld. Via de Early Access-funnel verzamelen we informatie over gastvoorkeuren en prijsperceptie. Early Access-leden ontvangen de uiteindelijke prijzen als eerste.'
  },
  {
    id: 'faq-book-3',
    category: 'Boeken en prijzen',
    order: 10,
    question: 'Hoe lang duurt een sessie?',
    answer: 'Circa twee uur wordt momenteel onderzocht als belangrijk uitgangspunt. Mogelijk worden later verschillende tijdsloten en verlengingsopties aangeboden.'
  },
  {
    id: 'faq-book-4',
    category: 'Boeken en prijzen',
    order: 11,
    question: 'Komen er cadeaubonnen?',
    answer: 'Cadeaubonnen staan gepland als toekomstige uitbreiding. De voorwaarden en beschikbaarheid worden vóór lancering bekendgemaakt.'
  },
  {
    id: 'faq-book-5',
    category: 'Boeken en prijzen',
    order: 12,
    question: 'Komen er arrangementen?',
    answer: 'Ja, RedZen ontwikkelt concepten voor onder andere date nights, anniversaries, verjaardagen, ontspanning en late-evening experiences. Het definitieve aanbod volgt later.'
  },

  // HYGIËNE EN VEILIGHEID
  {
    id: 'faq-hyg-1',
    category: 'Hygiëne en veiligheid',
    order: 13,
    question: 'Hoe wordt de suite gereinigd?',
    answer: 'RedZen ontwikkelt vaste schoonmaak-, inspectie- en vrijgaveprocedures tussen reserveringen. De protocollen worden afgestemd op de uiteindelijke faciliteiten, leveranciersvoorschriften en geldende regels.'
  },
  {
    id: 'faq-hyg-2',
    category: 'Hygiëne en veiligheid',
    order: 14,
    question: 'Is er personeel aanwezig?',
    answer: 'Het toekomstige concept combineert digitale self-service met operationele controle en ondersteuning. De exacte personeelsbezetting wordt bepaald op basis van locatie, veiligheid, service en regelgeving.'
  },
  {
    id: 'faq-hyg-3',
    category: 'Hygiëne en veiligheid',
    order: 15,
    question: 'Hoe wordt veiligheid georganiseerd?',
    answer: 'Technische veiligheid, brandveiligheid, waterkwaliteit, ventilatie, noodprocedures en toegangscontrole worden onderdeel van het locatie- en operationele ontwerp. Definitieve maatregelen worden vóór opening vastgesteld en gecontroleerd.'
  },

  // DUURZAAMHEID
  {
    id: 'faq-sust-1',
    category: 'Duurzaamheid',
    order: 16,
    question: 'Is RedZen al duurzaam gecertificeerd?',
    answer: 'Nog niet. RedZen bevindt zich in de ontwikkelingsfase en onderzoekt welke certificeringen en standaarden passend en haalbaar zijn voor de toekomstige locatie.'
  },
  {
    id: 'faq-sust-2',
    category: 'Duurzaamheid',
    order: 17,
    question: 'Hoeveel energie gebruikt een privésuite?',
    answer: 'Daarvoor zijn nog geen operationele gegevens beschikbaar. RedZen wil het energiegebruik na opening meten en waar mogelijk relateren aan bezetting en boekingen.'
  },
  {
    id: 'faq-sust-3',
    category: 'Duurzaamheid',
    order: 18,
    question: 'Worden duurzame materialen gebruikt?',
    answer: 'Duurzaamheid, herstelbaarheid, onderhoudsgemak en een gezond binnenklimaat worden meegewogen in de selectie van houtsoorten, steen en installaties.'
  },
  {
    id: 'faq-sust-4',
    category: 'Duurzaamheid',
    order: 19,
    question: 'Publiceert RedZen later resultaten?',
    answer: 'Dat is de bedoeling. RedZen wil waar mogelijk meetbare informatie delen over gebruikte technieken, verbruik en verbeterdoelstellingen, zonder onbewezen claims.'
  },
  {
    id: 'faq-sust-5',
    category: 'Duurzaamheid',
    order: 20,
    question: 'Welke duurzame technieken worden overwogen?',
    answer: 'Onder andere energiezuinige verwarming, warmteterugwinning, slimme klimaatregeling, waterbesparende voorzieningen, duurzame materialen en verbruiksmonitoring worden onderzocht.'
  },

  // INVESTEREN EN SAMENWERKEN
  {
    id: 'faq-inv-1',
    category: 'Investeren en samenwerken',
    order: 21,
    question: 'Kan ik investeren in RedZen Suites?',
    answer: 'Serieuze investeerders en strategische partners kunnen via de investeerderspagina een Investor Pack aanvragen. Een aanvraag vormt geen aanbod van financiële instrumenten en wordt individueel beoordeeld.'
  },
  {
    id: 'faq-inv-2',
    category: 'Investeren en samenwerken',
    order: 22,
    question: 'Kan ik een pand aanbieden?',
    answer: 'Ja. Vastgoedeigenaren, verhuurders en ontwikkelaars kunnen via de partnerpagina informatie over een mogelijke locatie indienen.'
  },
  {
    id: 'faq-inv-3',
    category: 'Investeren en samenwerken',
    order: 23,
    question: 'Met welke partners wil RedZen samenwerken?',
    answer: 'RedZen staat open voor gesprekken met vastgoedpartijen, architecten, wellnessleveranciers, installatiebedrijven, interieurpartners, financiers en andere strategische partijen.'
  }
];

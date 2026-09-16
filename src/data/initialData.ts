import { EarlyAccessLead, PropertyLead, InvestorLead } from '../types';

export const INITIAL_LEADS: EarlyAccessLead[] = [
  {
    id: 'lead-001',
    firstName: 'Sophie',
    email: 'sophie.vdb@gmail.com',
    city: 'Amsterdam',
    useCase: 'Date night',
    pricePreference: '€130–€159',
    createdAt: '2026-08-10T14:20:00Z',
    status: 'qualified',
    memberNumber: 721,
    referralCode: 'ZEN-SOPHIE',
    referralCount: 7
  },
  {
    id: 'lead-002',
    firstName: 'Lars',
    email: 'lars.devries@outlook.com',
    city: 'Utrecht',
    useCase: 'Ontspanning',
    pricePreference: '€130–€159',
    createdAt: '2026-08-11T09:12:00Z',
    status: 'new',
    memberNumber: 722,
    referralCode: 'ZEN-LARS',
    referralCount: 2
  },
  {
    id: 'lead-003',
    firstName: 'Fleur',
    email: 'fleur.bakker@icloud.com',
    city: 'Rotterdam',
    useCase: 'Special occasion',
    pricePreference: '€160–€189',
    createdAt: '2026-08-11T19:45:00Z',
    status: 'contacted',
    memberNumber: 723,
    referralCode: 'ZEN-FLEUR',
    referralCount: 4
  },
  {
    id: 'lead-004',
    firstName: 'Bram',
    email: 'bram.jansen@gmail.com',
    city: 'Den Haag',
    useCase: 'Cadeau',
    pricePreference: '€190+',
    createdAt: '2026-08-12T11:05:00Z',
    status: 'new',
    memberNumber: 724,
    referralCode: 'ZEN-BRAM',
    referralCount: 0
  },
  {
    id: 'lead-005',
    firstName: 'Emma',
    email: 'emma.meijer@live.nl',
    city: 'Haarlem',
    useCase: 'Ontspanning',
    pricePreference: '€100–€129',
    createdAt: '2026-08-13T16:30:00Z',
    status: 'new',
    memberNumber: 725,
    referralCode: 'ZEN-EMMA',
    referralCount: 11
  },
  {
    id: 'lead-006',
    firstName: 'Daan',
    email: 'daan.kuipers@gmail.com',
    city: 'Eindhoven',
    useCase: 'Date night',
    pricePreference: '€130–€159',
    createdAt: '2026-08-14T08:15:00Z',
    status: 'new',
    memberNumber: 726,
    referralCode: 'ZEN-DAAN',
    referralCount: 1
  }
];

export const INITIAL_PROPERTY_LEADS: PropertyLead[] = [
  {
    id: 'prop-001',
    name: 'Robert van Dijk',
    company: 'Vastgoed Ontwikkeling Randstad B.V.',
    email: 'r.vandijk@randstadvastgoed.nl',
    phone: '+31 6 12345678',
    propertyLocation: 'Amsterdam-Zuid / Amstelveen',
    size: '420 m²',
    description: 'Vrijstaande commerciële begane grond met eigen parkeerplaatsen en hoge plafonds (3.8m). Uitstekende geluidsisolatie aanwezig.',
    createdAt: '2026-08-09T10:00:00Z',
    status: 'qualified'
  },
  {
    id: 'prop-002',
    name: 'Marcelle Hoving',
    company: 'Urban Asset Partners',
    email: 'm.hoving@urbanasset.nl',
    phone: '+31 6 87654321',
    propertyLocation: 'Utrecht Centrum / Leidsche Rijn',
    size: '350 m²',
    description: 'Herontwikkelingspand met ruime nuts-aansluitingen en transformatiemogelijkheid naar private leisure.',
    createdAt: '2026-08-12T14:40:00Z',
    status: 'contacted'
  }
];

export const INITIAL_INVESTOR_LEADS: InvestorLead[] = [
  {
    id: 'inv-001',
    name: 'Alexander de Graaf',
    companyOrType: 'Family Office / Private Angel',
    email: 'alexander@degraaf-holdings.nl',
    phone: '+31 6 55443322',
    ticketRange: '€100k - €250k',
    message: 'Interesse in de unit economics en schaalbaarheid van het private wellness model in Nederland. Graag vertrouwelijke one-pager ontvangen.',
    createdAt: '2026-08-08T15:00:00Z',
    status: 'qualified'
  }
];

export const FAQ_ITEMS = [
  {
    question: 'Wanneer opent de eerste RedZen Suites locatie?',
    answer: 'Onze eerste locatie bevindt zich momenteel in de actieve ontwikkelings- en ontwerpfase. We selecteren momenteel de ideale high-end locatie in de Randstad. Early Access leden ontvangen als allereerste de officiële locatiereveal en openingsdatum.'
  },
  {
    question: 'Wat is het verschil met een traditionele spa of sauna?',
    answer: 'Bij RedZen deel je nóóit ruimtes met vreemden. Geen overvolle sauna’s, geen rumoerige rustruimtes en geen ongemakkelijke blikken. Je boekt een volledig autonome, hermetisch afgesloten private suite met sauna, magnesiumbad, regendouche en lounge exclusively voor jou en je gezelschap.'
  },
  {
    question: 'Hoe waarborgen jullie 100% privacy?',
    answer: 'Ons hele concept is ontworpen rondom discrete rust: contactloze digitale sleuteltoegang via je smartphone, geluidsisolerende architectuur (studio-grade akoestiek) en een naadloze check-in zonder baliewachtrijen of direct personeelscontact in jouw suite.'
  },
  {
    question: 'Hoe zit het met hygiëne tussen gasten door?',
    answer: 'Hygiëne is onze absolute prioriteit. Na elk tijdslot wordt de suite automatisch afgesloten voor een intensief professioneel reinigingsprotocol. Ons waterbeheer maakt gebruik van geavanceerde UVC- en ozonfiltratie met constante verversing.'
  },
  {
    question: 'Wat maakt RedZen Suites een duurzame eco-privéwellness?',
    answer: 'RedZen Suites is vanaf de basis circulair ontworpen: we gebruiken slimme warmteterugwinning uit afvalwater (greywater heat exchangers), zero-emission warmtepompen, IoT-gestuurde energiebesparende stand-by sauna’s en chemievrije biologische waterdesinfectie (UVC & Ozon). We benutten actieve groene investeringen en overheidssubsidies (MIA/VAMIL & EIA) om deze innovatieve technieken op schaal te realiseren.'
  },
  {
    question: 'Waarom is het tarief vastgezet op €200 per 2 uur?',
    answer: 'Het tarief van €200 per 2 uur (voor 2 personen) vormt de gezonde, duurzame basiseenheidsprijs die onze intensieve waterterugwinning, zero-emission energie, biologische hygiëneprocedures en hoogwaardig bio-katoen linnen dekt. Subsidies en groene investeringen versterken hierbij onze capex-investeringen en versnellen de uitrol van nieuwe hubs.'
  },
  {
    question: 'Wat levert Early Access mij op?',
    answer: 'Als Early Access lid ontvang je direct €50 korting op jouw eerste 2-uurs sessie (€150 i.p.v. €200 voor 2 personen) wanneer je nú reserveert. Daarnaast krijg je 48 uur exclusieve voorrang op de officiële openingskalender en de allereerste primeur over de locatie.'
  },
  {
    question: 'Met hoeveel personen kan ik een suite betreden?',
    answer: 'Onze suites zijn ontworpen voor ultieme intimiteit en ontspanning: ZEN ONE is geoptimaliseerd voor 1 tot 2 personen. ZEN SIGNATURE is geschikt voor 2 tot 4 personen.'
  }
];

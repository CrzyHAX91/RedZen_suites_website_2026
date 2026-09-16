import React from 'react';
import { PageRoute } from '../types';
import { Shield, Lock } from 'lucide-react';

interface LegalPageProps {
  onNavigate: (path: PageRoute) => void;
}

export const PrivacyPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-[#A9875A]">
          AVG / GDPR Compliance
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif text-[#F7F5F1]">Privacyverklaring</h1>
        <p className="text-xs text-[#A9AAA7]">Laatst bijgewerkt: Augustus 2026</p>
      </div>

      <div className="space-y-8 text-sm text-[#A9AAA7] leading-relaxed border-t border-white/10 pt-8">
        <section className="space-y-3">
          <h2 className="text-xl font-serif text-[#F7F5F1]">1. Wie wij zijn</h2>
          <p>
            RedZen Suites is een private wellness hospitality concept in voorbereidende pre-launch fase in Nederland. Wij respecteren uw privacy en zorgen ervoor dat de persoonlijke informatie die u ons verschaft altijd vertrouwelijk en veilig wordt behandeld conform de Algemene Verordening Gegevensbescherming (AVG).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-serif text-[#F7F5F1]">2. Welke gegevens wij verzamelen via Early Access</h2>
          <p>
            Tijdens onze pre-launch verzamelen wij uitsluitend de minimaal noodzakelijke gegevens via ons 3-staps registratieformulier:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Voornaam (om u persoonlijk te adresseren in pre-launch updates)</li>
            <li>E-mailadres (om u de locatiereveal, openingsdata en 48u boekingsvoorrang te sturen)</li>
            <li>Woonplaats / Regio (om de geografische vraag voor toekomstige suite-locaties in kaart te brengen)</li>
            <li>Voorkeur voor ervaringscategorie en prijsbereidheid (voor statistische optimalisatie van de eerste suite)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-serif text-[#F7F5F1]">3. Geen verkoop aan derden</h2>
          <p>
            Wij verkopen of verhuren uw persoonlijke gegevens nooit aan derden. Uw gegevens worden uitsluitend gebruikt voor directe communicatie omtrent RedZen Suites.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-serif text-[#F7F5F1]">4. Uw rechten (Inzage, correctie en verwijdering)</h2>
          <p>
            U heeft te allen tijde het recht om uw geregistreerde gegevens in te zien, te corrigeren of volledig te laten verwijderen uit onze pre-launch database. Stuur hiervoor een bericht naar info@redzen-suites.nl.
          </p>
        </section>
      </div>
    </div>
  );
};

export const CookiesPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-[#A9875A]">
          Cookie Transparantie
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif text-[#F7F5F1]">Cookiebeleid</h1>
        <p className="text-xs text-[#A9AAA7]">Laatst bijgewerkt: Augustus 2026</p>
      </div>

      <div className="space-y-8 text-sm text-[#A9AAA7] leading-relaxed border-t border-white/10 pt-8">
        <section className="space-y-3">
          <h2 className="text-xl font-serif text-[#F7F5F1]">1. Wat zijn cookies?</h2>
          <p>
            Cookies zijn kleine tekstbestanden die op uw computer of mobiele apparaat worden opgeslagen wanneer u onze website bezoekt.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-serif text-[#F7F5F1]">2. Hoe wij cookies gebruiken</h2>
          <p>
            RedZen Suites hanteert een privacy-first beleid:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs">
            <li>
              <strong>Functionele cookies:</strong> Noodzakelijk voor het correct functioneren van de 3-staps Early Access funnel en het onthouden van uw cookievoorkeur in uw browser.
            </li>
            <li>
              <strong>Geaggregeerde analytische cookies:</strong> Privacyvriendelijke metingen om te begrijpen welke pagina's van onze pre-launch website het meest bezocht worden, zonder IP-adressen te herleiden naar individuen.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-serif text-[#F7F5F1]">3. Geen tracking of advertentiecookies</h2>
          <p>
            Wij plaatsen geen third-party advertentienetwerk-pixels of cross-site tracking cookies.
          </p>
        </section>
      </div>
    </div>
  );
};

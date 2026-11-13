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
          Uw persoonsgegevens
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif text-[#F7F5F1]">Privacyverklaring</h1>
        <p className="text-xs text-[#A9AAA7]">Laatst bijgewerkt: 13 november 2026</p>
      </div>

      <div className="space-y-8 text-sm text-[#A9AAA7] leading-relaxed border-t border-white/10 pt-8">
        <section className="space-y-3">
          <h2 className="text-xl font-serif text-[#F7F5F1]">1. Wie wij zijn</h2>
          <p>
            RedZen Suites is een private wellness hospitality concept in voorbereidende pre-launch fase in Nederland. Wij gebruiken uw aanvraaggegevens om u te informeren over uw aanvraag, de ontwikkeling en de opening van RedZen Suites. U geeft hiervoor toestemming via het formulier; u kunt die toestemming weer intrekken.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-serif text-[#F7F5F1]">2. Welke gegevens wij verzamelen via Early Access</h2>
          <p>
            Tijdens onze pre-launch verzamelen wij uitsluitend de minimaal noodzakelijke gegevens via ons aanvraagformulier:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Voornaam (om u persoonlijk te adresseren in pre-launch updates)</li>
            <li>E-mailadres (om te informeren over uw aanvraag, ontwikkeling en toekomstige opening; zonder gegarandeerde korting of boekingsvoorrang)</li>
            <li>Soort aanvraag, toestemming en ontvangstdatum</li>
            <li>Aanvraagreferentie (om dubbele aanvragen bij opnieuw proberen te voorkomen)</li>
            <li>Een met een geheime sleutel afgeleide code van uw IP-adres voor het begrenzen van aanvragen. Deze code is gepseudonimiseerd; het is geen garantie van anonimiteit.</li>
          </ul>
        </section>

        <p>Een aanvraag wordt alleen als ontvangen getoond na bevestigde opslag op de server. Zonder beschikbare serveropslag wordt geen ontvangst bevestigd. Het contactformulier maakt uitsluitend een e-mailconcept in uw eigen e-mailprogramma; u verstuurt dit zelf.</p>
        <section className="space-y-3">
          <h2 className="text-xl font-serif text-[#F7F5F1]">3. Geen verkoop aan derden</h2>
          <p>
            Wij verkopen of verhuren uw persoonlijke gegevens nooit aan derden. Uw gegevens worden gebruikt voor uw aanvraag en directe communicatie omtrent RedZen Suites. Geconfigureerde hosting- en databaseleveranciers verwerken gegevens om deze dienst aan te bieden; de gekozen leveranciers, locatie en bewaartermijnen worden vóór opening van de aanmeldingen vastgelegd.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-serif text-[#F7F5F1]">4. Uw rechten (Inzage, correctie en verwijdering)</h2>
          <p>
            U heeft te allen tijde het recht om uw geregistreerde gegevens in te zien, te corrigeren of te laten verwijderen uit onze pre-launch database. Verwijdering uit back-ups volgt de vastgelegde back-upcyclus; bij herstel moeten eerdere verwijderverzoeken opnieuw worden toegepast. Stuur hiervoor een bericht naar info@redzen-suites.nl.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-serif text-[#F7F5F1]">5. Bewaren en beveiliging</h2>
          <p>We beperken toegang tot aanvraaggegevens en bewaren ze niet langer dan nodig voor het beschreven doel. De bewaartermijnen voor aanvragen, misbruikbeperking en back-ups worden vóór het openen van de aanmeldingen vastgesteld. Een aanvraag is geen reservering of betaling.</p>
          <p>De aanmeldingen blijven gesloten zolang de inrichting voor opslag, gegevensbeheer en bewaartermijnen nog niet is afgerond.</p>
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
        <p className="text-xs text-[#A9AAA7]">Laatst bijgewerkt: 13 oktober 2026</p>
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

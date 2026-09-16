import React, { useState } from 'react';
import { PageRoute } from '../types';
import { savePropertyLead } from '../services/leadStorage';
import { 
  Building2, 
  MapPin, 
  Ruler, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';

interface PartnersPageProps {
  onNavigate: (path: PageRoute) => void;
}

export const PartnersPage: React.FC<PartnersPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [propertyLocation, setPropertyLocation] = useState('');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !propertyLocation || !size) return;

    setIsSubmitting(true);
    setTimeout(() => {
      savePropertyLead({
        name,
        company,
        email,
        phone,
        propertyLocation,
        size,
        description
      });
      setIsSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15191A] border border-[#A9875A]/40 text-[#A9875A] text-xs font-mono uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#A9875A] animate-pulse" />
          Vastgoed & Locatiepartners
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif text-[#F7F5F1] leading-tight">
          Locaties gezocht voor RedZen Suites.
        </h1>
        <p className="text-base sm:text-lg text-[#A9AAA7] font-light leading-relaxed">
          Ben je eigenaar of ontwikkelaar van een representatief pand in de Randstad of een grote centrumstad? Wij gaan graag langjarige huur- of ontwikkelpartnerschappen aan.
        </p>
      </div>

      {/* Property Search Profile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-2xl bg-[#15191A] border border-[#A9875A]/20 space-y-3">
          <div className="p-3 rounded-xl bg-[#0B0D0E] text-[#A9875A] w-fit">
            <Ruler className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-serif text-[#F7F5F1]">Oppervlakte: 250 – 600 m²</h3>
          <p className="text-xs text-[#A9AAA7] leading-relaxed">
            Geschikt voor 4 tot 8 autonome suites inclusief technische ruimtes, discrete entree en centrale facilitaire hub.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#15191A] border border-[#A9875A]/20 space-y-3">
          <div className="p-3 rounded-xl bg-[#0B0D0E] text-[#A9875A] w-fit">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-serif text-[#F7F5F1]">Locatieprofiel</h3>
          <p className="text-xs text-[#A9AAA7] leading-relaxed">
            Randstad (Amsterdam, Utrecht, Rotterdam, Den Haag, 't Gooi, Haarlem) of topsteden zoals Eindhoven. Goede bereikbaarheid & discretie.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#15191A] border border-[#A9875A]/20 space-y-3">
          <div className="p-3 rounded-xl bg-[#0B0D0E] text-[#A9875A] w-fit">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-serif text-[#F7F5F1]">Bouwkundige Eisen</h3>
          <p className="text-xs text-[#A9AAA7] leading-relaxed">
            Begane grond of souterrain met separate ingang, minimale vrije plafondhoogte van 3.0m en geschiktheid voor zware nutsvoorzieningen.
          </p>
        </div>

      </div>

      {/* Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <div className="lg:col-span-5 space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-[#A9875A]">
            Direct Aanbieden
          </span>
          <h2 className="text-3xl font-serif text-[#F7F5F1]">
            Dien een vastgoedlocatie in.
          </h2>
          <p className="text-sm text-[#A9AAA7] font-light leading-relaxed">
            Ons vastgoedteam beoordeelt binnengekomen objecten binnen 48 uur op haalbaarheid, bestemmingsplan en bouwkundige potentie.
          </p>

          <div className="p-5 rounded-2xl bg-[#15191A] border border-white/5 space-y-3 text-xs text-[#A9AAA7]">
            <h4 className="font-serif text-sm text-[#F7F5F1]">Wat wij bieden aan verhuurders:</h4>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#A9875A]" />
              <span>Langjarige triple-net huurovereenkomsten (10–15 jaar)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#A9875A]" />
              <span>Hoogwaardige transformatie en waardestijging van uw pand</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#A9875A]" />
              <span>Solide garanties en professioneel onderhoud</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7 bg-[#15191A] rounded-3xl border border-[#A9875A]/30 p-8 sm:p-10 shadow-2xl">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#1C2224] border border-[#A9875A] flex items-center justify-center mx-auto text-[#A9875A]">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-serif text-[#F7F5F1]">Vastgoeddossier Ontvangen</h3>
              <p className="text-sm text-[#A9AAA7] max-w-md mx-auto">
                Hartelijk dank {name}. Wij nemen binnen 48 uur contact op over de locatie in {propertyLocation}.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#A9875A] hover:underline pt-2 cursor-pointer"
              >
                Nog een pand aanmelden
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#A9AAA7] uppercase tracking-wider mb-1.5">
                    Contactpersoon Naam *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Bijv. Robert van Dijk"
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0D0E] border border-white/10 focus:border-[#A9875A] text-sm text-[#F7F5F1] placeholder-neutral-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A9AAA7] uppercase tracking-wider mb-1.5">
                    Bedrijf / Eigenaar
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Bijv. Vastgoedgroep Randstad B.V."
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0D0E] border border-white/10 focus:border-[#A9875A] text-sm text-[#F7F5F1] placeholder-neutral-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#A9AAA7] uppercase tracking-wider mb-1.5">
                    E-mailadres *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="r.vandijk@vastgoed.nl"
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0D0E] border border-white/10 focus:border-[#A9875A] text-sm text-[#F7F5F1] placeholder-neutral-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A9AAA7] uppercase tracking-wider mb-1.5">
                    Telefoonnummer *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+31 6 12345678"
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0D0E] border border-white/10 focus:border-[#A9875A] text-sm text-[#F7F5F1] placeholder-neutral-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#A9AAA7] uppercase tracking-wider mb-1.5">
                    Locatie / Plaats / Straat *
                  </label>
                  <input
                    type="text"
                    required
                    value={propertyLocation}
                    onChange={(e) => setPropertyLocation(e.target.value)}
                    placeholder="Bijv. Amsterdam-Zuid / Utrecht Centrum"
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0D0E] border border-white/10 focus:border-[#A9875A] text-sm text-[#F7F5F1] placeholder-neutral-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A9AAA7] uppercase tracking-wider mb-1.5">
                    Oppervlakte (m²) *
                  </label>
                  <input
                    type="text"
                    required
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="Bijv. 380 m²"
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0D0E] border border-white/10 focus:border-[#A9875A] text-sm text-[#F7F5F1] placeholder-neutral-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A9AAA7] uppercase tracking-wider mb-1.5">
                  Beschrijving van het Pand & Eigenschappen
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Bijzonderheden, plafondhoogte, parkeergelegenheid, huidige bestemming, beschikbaarheidsdatum..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0D0E] border border-white/10 focus:border-[#A9875A] text-sm text-[#F7F5F1] placeholder-neutral-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#A9875A] to-[#C5A069] text-[#0B0D0E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 shadow-lg cursor-pointer transition-all"
              >
                {isSubmitting ? 'Verwerken...' : 'Verstuur Vastgoedaanmelding'}
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};

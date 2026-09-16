import React, { useState } from 'react';
import { PageRoute } from '../types';
import { Mail, Instagram, Linkedin, MessageSquare, Send, CheckCircle2, Sparkles, MapPin } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (path: PageRoute) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Algemene Vraag');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15191A] border border-[#A9875A]/40 text-[#A9875A] text-xs font-mono uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#A9875A] animate-pulse" />
          Inlichtingen & Dialoog
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif text-[#F7F5F1] leading-tight">
          Neem contact op met het RedZen Team.
        </h1>
        <p className="text-base sm:text-lg text-[#A9AAA7] font-light leading-relaxed">
          Heb je vragen over ons concept, persverzoeken, suggesties voor locaties of wil je meebouwen aan onze community? We horen graag van je.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#15191A] border border-[#A9875A]/20 space-y-4">
            <h3 className="text-xl font-serif text-[#F7F5F1]">Directe Kanalen</h3>
            
            <div className="space-y-3 text-sm text-[#A9AAA7]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#0B0D0E] text-[#A9875A] border border-white/5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs block text-neutral-500">Algemene Inquiries:</span>
                  <a href="mailto:info@redzen-suites.nl" className="text-[#F7F5F1] hover:text-[#A9875A] transition-colors">
                    info@redzen-suites.nl
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#0B0D0E] text-[#A9875A] border border-white/5">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs block text-neutral-500">Volg onze reis:</span>
                  <span className="text-[#F7F5F1]">@redzensuites</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#0B0D0E] text-[#A9875A] border border-white/5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs block text-neutral-500">Eerste suite locatie:</span>
                  <span className="text-[#F7F5F1]">In actieve ontwikkeling (Randstad, NL)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B0D0E] border border-white/10 text-xs text-[#A9AAA7] space-y-2 font-mono">
            <span className="text-[#A9875A] block uppercase font-semibold">Pre-launch integriteit</span>
            <p>
              Omdat onze suites nog in ontwikkeling zijn, bezoeken wij uitsluitend locaties op afspraak met vastgoedeigenaren en gecertificeerde aannemers.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7 bg-[#15191A] rounded-3xl border border-[#A9875A]/30 p-8 sm:p-10 shadow-2xl">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#1C2224] border border-[#A9875A] flex items-center justify-center mx-auto text-[#A9875A]">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-serif text-[#F7F5F1]">Bericht Verzonden</h3>
              <p className="text-sm text-[#A9AAA7] max-w-md mx-auto">
                Dank je wel {name}. Ons team beantwoordt je bericht zo snel mogelijk.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#A9875A] hover:underline pt-2 cursor-pointer"
              >
                Nog een bericht sturen
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#A9AAA7] uppercase tracking-wider mb-1.5">
                    Naam *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jouw naam"
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0D0E] border border-white/10 focus:border-[#A9875A] text-sm text-[#F7F5F1] placeholder-neutral-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A9AAA7] uppercase tracking-wider mb-1.5">
                    E-mailadres *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="naam@voorbeeld.nl"
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0D0E] border border-white/10 focus:border-[#A9875A] text-sm text-[#F7F5F1] placeholder-neutral-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A9AAA7] uppercase tracking-wider mb-1.5">
                  Onderwerp
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0D0E] border border-white/10 focus:border-[#A9875A] text-sm text-[#F7F5F1] focus:outline-none"
                >
                  <option value="Algemene Vraag">Algemene Vraag over RedZen</option>
                  <option value="Vastgoed / Locatie">Vastgoed of Locatiesuggestie</option>
                  <option value="Investeren">Investeringsinteresse</option>
                  <option value="Pers & Media">Pers & Media</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A9AAA7] uppercase tracking-wider mb-1.5">
                  Bericht *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Typ hier jouw bericht of vraag..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0D0E] border border-white/10 focus:border-[#A9875A] text-sm text-[#F7F5F1] placeholder-neutral-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#A9875A] to-[#C5A069] text-[#0B0D0E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 shadow-lg cursor-pointer transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Verstuur Bericht</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};

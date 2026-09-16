import React from 'react';
import { PageRoute } from '../types';
import { Instagram, Linkedin, Shield, Lock, Sparkles, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (path: PageRoute) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B0D0E] border-t border-[#A9875A]/20 pt-16 pb-12 relative overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[#A9875A]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-[0.22em] text-[#F7F5F1]">
                REDZEN
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#A9875A]" />
              <span className="font-serif text-base tracking-[0.3em] text-[#A9875A] font-light">
                SUITES
              </span>
            </div>

            <p className="text-sm text-[#A9AAA7] font-light max-w-sm leading-relaxed">
              Sustainable Eco Private Wellness. <br />
              <span className="text-[#F7F5F1]">100% Zelfvoorzienend. Circulaire warmte & water. Zero-emission.</span>
            </p>

            <div className="p-3.5 rounded-xl bg-[#15191A] border border-[#A9875A]/20 text-xs text-[#A9AAA7] max-w-sm space-y-1">
              <div className="flex items-center gap-2 text-[#A9875A] font-mono font-medium">
                <span className="w-2 h-2 rounded-full bg-[#A9875A] animate-pulse" />
                PRE-LAUNCH MEDEDELING
              </div>
              <p className="leading-normal">
                RedZen Suites bevindt zich in de voorbereidende pre-launch fase. De eerste high-end locatie in Nederland is momenteel in actieve ontwikkeling.
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#15191A] border border-white/10 flex items-center justify-center text-[#A9AAA7] hover:text-[#A9875A] hover:border-[#A9875A]/40 transition-colors"
                aria-label="Instagram RedZen Suites"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#15191A] border border-white/10 flex items-center justify-center text-[#A9AAA7] hover:text-[#A9875A] hover:border-[#A9875A]/40 transition-colors"
                aria-label="LinkedIn RedZen Suites"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#A9875A] font-semibold">
              Ervaring & Suites
            </h4>
            <ul className="space-y-2 text-sm text-[#A9AAA7]">
              <li>
                <button type="button" onClick={() => handleNav('/concept')} className="hover:text-[#F7F5F1] transition-colors cursor-pointer">
                  Het Concept
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('/suites')} className="hover:text-[#F7F5F1] transition-colors cursor-pointer">
                  Zen One & Signature
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('/arrangements')} className="hover:text-[#F7F5F1] transition-colors cursor-pointer">
                  Arrangementen
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('/sustainability')} className="hover:text-[#F7F5F1] transition-colors cursor-pointer">
                  Duurzaamheid & Ethiek
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('/early-access')} className="text-[#A9875A] hover:underline flex items-center gap-1 cursor-pointer">
                  <span>Early Access</span>
                  <Sparkles className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Business & Partners */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#A9875A] font-semibold">
              Zakelijk & Vastgoed
            </h4>
            <ul className="space-y-2 text-sm text-[#A9AAA7]">
              <li>
                <button type="button" onClick={() => handleNav('/invest')} className="hover:text-[#F7F5F1] transition-colors cursor-pointer">
                  Investeerders
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('/partners')} className="hover:text-[#F7F5F1] transition-colors cursor-pointer">
                  Vastgoed & Locaties
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('/faq')} className="hover:text-[#F7F5F1] transition-colors cursor-pointer">
                  Veelgestelde Vragen
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('/contact')} className="hover:text-[#F7F5F1] transition-colors cursor-pointer">
                  Contact & Inlichtingen
                </button>
              </li>
            </ul>
          </div>

          {/* Early Access Direct Box */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#A9875A] font-semibold">
              1.000 Leden Limiet
            </h4>
            <p className="text-xs text-[#A9AAA7] leading-relaxed">
              Verzeker je van 48u exclusieve voorrang bij de boekingsopening van de allereerste suite.
            </p>
            <button
              type="button"
              id="footer-join-funnel"
              onClick={() => handleNav('/early-access')}
              className="w-full py-3 px-4 rounded-xl bg-[#15191A] border border-[#A9875A]/40 text-[#F7F5F1] text-xs font-semibold uppercase tracking-wider flex items-center justify-between hover:bg-[#A9875A] hover:text-[#0B0D0E] transition-all cursor-pointer group"
            >
              <span>Join Funnel</span>
              <ArrowUpRight className="w-4 h-4 text-[#A9875A] group-hover:text-[#0B0D0E]" />
            </button>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A9AAA7]">
          <div className="flex items-center gap-4">
            <p>© {new Date().getFullYear()} RedZen Suites. Alle rechten voorbehouden.</p>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="text-[11px] text-neutral-500">First location in development</span>
          </div>

          <div className="flex items-center space-x-5">
            <button type="button" onClick={() => handleNav('/privacy')} className="hover:text-[#F7F5F1] transition-colors cursor-pointer">
              Privacyverklaring
            </button>
            <button type="button" onClick={() => handleNav('/cookies')} className="hover:text-[#F7F5F1] transition-colors cursor-pointer">
              Cookiebeleid
            </button>
            <button 
              type="button" 
              id="footer-admin-btn"
              onClick={() => handleNav('/admin')} 
              className="hover:text-[#A9875A] transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <Lock className="w-3 h-3 text-[#A9875A]" />
              <span>Admin</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

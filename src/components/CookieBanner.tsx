import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X } from 'lucide-react';
import { PageRoute } from '../types';

interface CookieBannerProps {
  onNavigate: (path: PageRoute) => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onNavigate }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('redzen_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('redzen_cookie_consent', 'all');
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('redzen_cookie_consent', 'necessary');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#15191A]/95 backdrop-blur-md border border-[#A9875A]/30 p-5 rounded-2xl shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#0B0D0E] text-[#A9875A] border border-white/5">
              <Cookie className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-[#F7F5F1]">Privacy & Cookies</h4>
          </div>
          <button 
            type="button"
            onClick={handleAcceptNecessary}
            className="text-[#A9AAA7] hover:text-[#F7F5F1] transition-colors p-1"
            aria-label="Sluiten"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#A9AAA7] leading-relaxed">
          Wij gebruiken uitsluitend functionele en privacyvriendelijke analytische cookies om onze pre-launch website te optimaliseren. Geen tracking cookies van derden.
        </p>

        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={() => onNavigate('/cookies')}
            className="text-xs text-[#A9875A] hover:underline cursor-pointer"
          >
            Lees beleid
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAcceptNecessary}
              className="py-2 px-3 rounded-lg bg-[#0B0D0E] hover:bg-white/5 text-[#A9AAA7] hover:text-[#F7F5F1] text-xs font-medium border border-white/10 transition-colors cursor-pointer"
            >
              Alleen noodzakelijk
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="py-2 px-4 rounded-lg bg-[#A9875A] hover:bg-[#C5A069] text-[#0B0D0E] text-xs font-bold transition-all cursor-pointer shadow"
            >
              Akkoord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

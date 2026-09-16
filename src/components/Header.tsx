import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, Shield, Lock, ChevronRight } from 'lucide-react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  currentPath: PageRoute;
  onNavigate: (path: PageRoute) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; path: PageRoute }[] = [
    { label: 'Het Concept', path: '/concept' },
    { label: 'Sensuele Suites', path: '/suites' },
    { label: 'Arrangementen voor Twee', path: '/arrangements' },
    { label: 'Duurzaamheid', path: '/sustainability' },
    { label: 'Invest & Krediet', path: '/invest' },
    { label: 'Partners', path: '/partners' },
    { label: 'FAQ', path: '/faq' },
  ];

  const handleNavClick = (path: PageRoute) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0B0D0E]/92 backdrop-blur-md border-b border-[#A9875A]/30 py-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.8)]' 
            : 'bg-transparent py-5 border-b border-[#A9875A]/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo & Tagline */}
          <button 
            type="button"
            id="nav-logo"
            onClick={() => handleNavClick('/')}
            className="flex flex-col text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.22em] text-[#F7F5F1] group-hover:text-[#F3E8D6] transition-colors">
                REDZEN
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#A9875A] to-rose-500 animate-pulse" />
              <span className="font-serif text-sm sm:text-base tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-[#D9A066] to-[#E5989B] font-light">
                SUITES
              </span>
            </div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#C5A069]/90 font-medium mt-0.5 hidden sm:block">
              Sultry Sanctuary • Intieme Privé Wellness
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs uppercase tracking-widest font-medium">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  id={`nav-link-${link.path.replace('/', '') || 'home'}`}
                  type="button"
                  onClick={() => handleNavClick(link.path)}
                  className={`transition-colors py-1 relative cursor-pointer ${
                    isActive ? 'text-[#E8C58D] font-semibold' : 'text-[#CBC8C0] hover:text-[#F7F5F1]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#A9875A] to-rose-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action & Pre-Launch Pill */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              type="button"
              id="lang-toggle-btn"
              onClick={toggleLanguage}
              title={language === 'nl' ? 'Switch to English' : 'Schakel naar Nederlands'}
              className="px-2.5 py-1 rounded-lg bg-[#15191A] border border-[#A9875A]/30 text-[11px] font-mono text-[#A9875A] hover:text-[#F7F5F1] transition-colors cursor-pointer flex items-center gap-1"
            >
              <span className={language === 'nl' ? 'font-bold text-[#F7F5F1]' : 'opacity-60'}>NL</span>
              <span className="opacity-40">/</span>
              <span className={language === 'en' ? 'font-bold text-[#F7F5F1]' : 'opacity-60'}>EN</span>
            </button>

            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181115] border border-rose-500/30 text-[11px] text-[#E8C58D] font-mono shadow-[0_0_15px_rgba(225,29,72,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>100% DISCREET • INTIEM VOOR TWEE</span>
            </div>

            <button
              type="button"
              id="header-cta-early-access"
              onClick={() => handleNavClick('/early-access')}
              className="py-2.5 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-[#C5A069] via-[#A9875A] to-[#B91C1C] text-[#F7F5F1] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(185,28,28,0.3)] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-200" />
              <span>Reserveer Jouw Date • €50 Privilege</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              type="button"
              id="mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-[#15191A] border border-white/10 text-[#F7F5F1] hover:text-[#A9875A] transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-[#0B0D0E]/98 backdrop-blur-2xl pt-24 px-6 pb-10 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div className="pb-4 border-b border-white/10">
              <div className="text-xs font-mono uppercase tracking-widest text-[#A9875A] mb-1">
                Navigatie Menu
              </div>
              <p className="text-xs text-[#A9AAA7]">
                Ontdek het private wellness concept van RedZen Suites.
              </p>
            </div>

            <div className="flex flex-col space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleNavClick('/')}
                className={`flex items-center justify-between p-3.5 rounded-xl text-left font-serif text-lg ${
                  currentPath === '/' ? 'bg-[#1C2224] text-[#A9875A] border border-[#A9875A]/40' : 'text-[#F7F5F1]'
                }`}
              >
                <span>Home</span>
                <ChevronRight className="w-4 h-4 text-[#A9AAA7]" />
              </button>

              {navLinks.map((link) => (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => handleNavClick(link.path)}
                  className={`flex items-center justify-between p-3.5 rounded-xl text-left font-serif text-lg ${
                    currentPath === link.path ? 'bg-[#1C2224] text-[#A9875A] border border-[#A9875A]/40' : 'text-[#F7F5F1]'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#A9AAA7]" />
                </button>
              ))}

              <button
                type="button"
                onClick={() => handleNavClick('/contact')}
                className={`flex items-center justify-between p-3.5 rounded-xl text-left font-serif text-lg ${
                  currentPath === '/contact' ? 'bg-[#1C2224] text-[#A9875A] border border-[#A9875A]/40' : 'text-[#F7F5F1]'
                }`}
              >
                <span>Contact</span>
                <ChevronRight className="w-4 h-4 text-[#A9AAA7]" />
              </button>
            </div>
          </div>

          <div className="pt-8 space-y-3">
            <button
              type="button"
              onClick={() => handleNavClick('/early-access')}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#A9875A] to-[#C5A069] text-[#0B0D0E] font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Join Early Access (€50 Korting)</span>
            </button>

            <div className="flex items-center justify-between text-xs text-[#A9AAA7] px-2 pt-2">
              <span>Eerste locatie in ontwikkeling</span>
              <button 
                type="button"
                onClick={() => handleNavClick('/admin')} 
                className="text-[#A9875A] hover:underline flex items-center gap-1"
              >
                <Lock className="w-3 h-3" /> Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

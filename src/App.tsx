import React, { useState, useEffect } from 'react';
import { PageRoute } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { SoundscapePlayer } from './components/SoundscapePlayer';
import { LanguageProvider } from './context/LanguageContext';
import { startDriveCronWorker, stopDriveCronWorker } from './services/driveBackupCron';

// Pages
import { HomePage } from './pages/HomePage';
import { ConceptPage } from './pages/ConceptPage';
import { SuitesPage } from './pages/SuitesPage';
import { ArrangementsPage } from './pages/ArrangementsPage';
import { SustainabilityPage } from './pages/SustainabilityPage';
import { EarlyAccessPage } from './pages/EarlyAccessPage';
import { InvestPage } from './pages/InvestPage';
import { PartnersPage } from './pages/PartnersPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage, CookiesPage } from './pages/PrivacyPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  const resolvePath = (hashValue: string): PageRoute => {
    const clean = hashValue.replace(/^#/, '');
    if (clean.startsWith('faq-') || clean.includes('faq-')) {
      return '/faq';
    }
    const validPaths: PageRoute[] = [
      '/', '/concept', '/suites', '/arrangements', '/sustainability',
      '/early-access', '/invest', '/partners', '/faq', '/contact',
      '/privacy', '/cookies', '/admin'
    ];
    const pathPart = clean.split('?')[0].split('#')[0];
    const formatted = (pathPart.startsWith('/') ? pathPart : '/' + pathPart) as PageRoute;
    if (validPaths.includes(formatted)) {
      return formatted;
    }
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname as PageRoute;
      if (validPaths.includes(pathname)) {
        return pathname;
      }
    }
    return '/';
  };

  const [currentPath, setCurrentPath] = useState<PageRoute>(() => {
    return resolvePath(window.location.hash);
  });

  useEffect(() => {
    // Start periodic background Drive cron worker
    startDriveCronWorker();

    const handleHashChange = () => {
      const resolved = resolvePath(window.location.hash);
      setCurrentPath(resolved);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      stopDriveCronWorker();
    };
  }, []);

  const navigateTo = (path: PageRoute) => {
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPath) {
      case '/concept':
        return <ConceptPage onNavigate={navigateTo} />;
      case '/suites':
        return <SuitesPage onNavigate={navigateTo} />;
      case '/arrangements':
        return <ArrangementsPage onNavigate={navigateTo} />;
      case '/sustainability':
        return <SustainabilityPage onNavigate={navigateTo} />;
      case '/early-access':
        return <EarlyAccessPage onNavigate={navigateTo} />;
      case '/invest':
        return <InvestPage onNavigate={navigateTo} />;
      case '/partners':
        return <PartnersPage onNavigate={navigateTo} />;
      case '/faq':
        return <FaqPage onNavigate={navigateTo} />;
      case '/contact':
        return <ContactPage onNavigate={navigateTo} />;
      case '/privacy':
        return <PrivacyPage onNavigate={navigateTo} />;
      case '/cookies':
        return <CookiesPage onNavigate={navigateTo} />;
      case '/admin':
        return <AdminPage onNavigate={navigateTo} />;
      case '/':
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-[#0B0D0E] text-[#F7F5F1] selection:bg-[#A9875A]/30 selection:text-[#F7F5F1]">
        <Header currentPath={currentPath} onNavigate={navigateTo} />
        
        <main className="flex-grow">
          {renderPage()}
        </main>

        <Footer onNavigate={navigateTo} />
        <SoundscapePlayer />
        <CookieBanner onNavigate={navigateTo} />
      </div>
    </LanguageProvider>
  );
}

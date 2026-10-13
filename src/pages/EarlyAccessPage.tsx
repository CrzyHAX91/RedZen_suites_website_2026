import React from 'react';
import { PageRoute } from '../types';
import { EarlyAccessFunnel } from '../components/EarlyAccessFunnel';
import { BookingStatusPanel } from '../components/BookingStatusPanel';
export const EarlyAccessPage: React.FC<{ onNavigate: (path: PageRoute) => void }> = ({ onNavigate }) => <div className="pt-28 pb-24 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
  <h1 className="text-4xl sm:text-6xl font-serif">Jouw interesse. Onze volgende stap.</h1>
  <p className="text-[#CBC8C0]">Ontdek de actuele status voordat je belangstelling registreert of Early Access aanvraagt.</p>
  <BookingStatusPanel /><EarlyAccessFunnel />
  <button type="button" className="min-h-12 underline" onClick={() => onNavigate('/faq')}>Lees de veelgestelde vragen</button>
</div>;

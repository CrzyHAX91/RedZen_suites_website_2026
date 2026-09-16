import React, { useState } from 'react';
import { Sun, Moon, Flame, Palette, Sliders, Eye, Lightbulb } from 'lucide-react';

interface MoodSetting {
  id: string;
  name: string;
  temp: string;
  kelvin: number;
  description: string;
  bgGradient: string;
  glowColor: string;
  accentColor: string;
  roomTint: string;
  saunaGlow: string;
  icon: typeof Sun;
}

const MOODS: MoodSetting[] = [
  {
    id: 'dusk',
    name: 'Dusk Amber (2200K)',
    temp: '2200 Kelvin • Zacht Kaarslicht',
    kelvin: 2200,
    description: 'Subtiele, warme ambertonen die de melatonine-aanmaak stimuleren en de hartslag verlagen.',
    bgGradient: 'from-[#1A1208] via-[#120D08] to-[#0B0D0E]',
    glowColor: 'rgba(169, 135, 90, 0.35)',
    accentColor: '#A9875A',
    roomTint: 'rgba(169, 135, 90, 0.18)',
    saunaGlow: 'rgba(217, 119, 6, 0.45)',
    icon: Flame,
  },
  {
    id: 'infrared',
    name: 'Deep Infrared Glow',
    temp: '660nm / 850nm Bio-Photonic',
    kelvin: 1800,
    description: 'Roodlichtfrequenties ter ondersteuning van diep celherstel, collageen en spierontspanning.',
    bgGradient: 'from-[#210909] via-[#140606] to-[#0B0D0E]',
    glowColor: 'rgba(239, 68, 68, 0.32)',
    accentColor: '#EF4444',
    roomTint: 'rgba(220, 38, 38, 0.22)',
    saunaGlow: 'rgba(239, 68, 68, 0.55)',
    icon: Moon,
  },
  {
    id: 'golden',
    name: 'Golden Hour Serenity',
    temp: '2700 Kelvin • Namiddagzon',
    kelvin: 2700,
    description: 'Natuurlijk zacht zonlichteffect voor het ontwaken van zintuigen na een intensieve saunaronde.',
    bgGradient: 'from-[#1E170A] via-[#141006] to-[#0B0D0E]',
    glowColor: 'rgba(234, 179, 8, 0.3)',
    accentColor: '#EAB308',
    roomTint: 'rgba(234, 179, 8, 0.16)',
    saunaGlow: 'rgba(245, 158, 11, 0.45)',
    icon: Sun,
  },
  {
    id: 'velvet-rose',
    name: 'Velvet Rouge & Sensual Dusk',
    temp: '1600 Kelvin • Diep Robijn & Rozenkwarts',
    kelvin: 1600,
    description: 'Verleidelijke dieprode gloed gecombineerd met zacht roze accenten — ontworpen voor intieme dates, zachte schaduwwerking en ultieme romantiek.',
    bgGradient: 'from-[#22070D] via-[#150408] to-[#0B0D0E]',
    glowColor: 'rgba(225, 29, 72, 0.38)',
    accentColor: '#E11D48',
    roomTint: 'rgba(225, 29, 72, 0.24)',
    saunaGlow: 'rgba(244, 63, 94, 0.55)',
    icon: Flame,
  },
  {
    id: 'midnight-obsidian',
    name: 'Midnight Obsidian & Moonstone',
    temp: 'Nachtelijke Stilte • Candlelight Glow',
    kelvin: 1900,
    description: 'Minimale verlichting met diep donkere contrasten en gouden kaarslichtaccenten voor ongekende zintuiglijke intensiteit en privacy.',
    bgGradient: 'from-[#140E0A] via-[#0E0A08] to-[#070809]',
    glowColor: 'rgba(217, 119, 6, 0.35)',
    accentColor: '#D97706',
    roomTint: 'rgba(180, 83, 9, 0.18)',
    saunaGlow: 'rgba(245, 158, 11, 0.60)',
    icon: Moon,
  },
];

export const MoodLightingSwitcher: React.FC = () => {
  const [activeMood, setActiveMood] = useState<string>('dusk');
  const [brightness, setBrightness] = useState<number>(75);

  const current = MOODS.find(m => m.id === activeMood) || MOODS[0];

  return (
    <div className="rounded-3xl border border-[#A9875A]/30 overflow-hidden shadow-2xl transition-all duration-700 relative">
      
      {/* Background with dynamic mood glow */}
      <div className={`p-6 sm:p-10 bg-gradient-to-br ${current.bgGradient} transition-all duration-700 space-y-8 relative overflow-hidden`}>
        
        {/* Ambient Radial Lighting Glow */}
        <div 
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700"
          style={{ 
            backgroundColor: current.glowColor,
            opacity: brightness / 100 
          }}
        />

        {/* Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B0D0E]/80 border border-white/10 text-xs font-mono uppercase tracking-wider mb-2">
              <Palette className="w-3.5 h-3.5 text-[#A9875A]" />
              <span className="text-[#F7F5F1]">Spatial Lighting Studio & Room Simulator</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif text-[#F7F5F1]">
              Ervaar de Smart Lichtscènes
            </h3>
            <p className="text-xs sm:text-sm text-[#A9AAA7] font-light mt-1">
              In elke RedZen suite bepaal je met één aanraking op het centrale touchpanel de biologische lichtsfeer.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#0B0D0E]/90 border border-white/10 sm:text-right">
            <span className="text-[10px] font-mono text-[#A9AAA7] block">Actieve Modus</span>
            <span className="text-sm font-serif font-medium text-[#F7F5F1] block" style={{ color: current.accentColor }}>
              {current.name}
            </span>
            <span className="text-[10px] font-mono text-[#A9AAA7]">{current.temp} • Dimmer {brightness}%</span>
          </div>
        </div>

        {/* Scene Switcher Buttons */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOODS.map((mood) => {
            const Icon = mood.icon;
            const isSelected = activeMood === mood.id;

            return (
              <button
                key={mood.id}
                type="button"
                onClick={() => setActiveMood(mood.id)}
                className={`p-5 rounded-2xl text-left transition-all duration-300 border cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#0B0D0E]/90 shadow-xl ring-1'
                    : 'bg-[#0B0D0E]/40 border-white/5 hover:border-white/20 text-[#A9AAA7]'
                }`}
                style={{
                  borderColor: isSelected ? mood.accentColor : undefined,
                  boxShadow: isSelected ? `0 0 24px ${mood.glowColor}` : undefined,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="p-2 rounded-xl transition-colors" 
                    style={{ 
                      backgroundColor: isSelected ? `${mood.accentColor}20` : '#15191A',
                      color: isSelected ? mood.accentColor : '#A9AAA7'
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span 
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shadow"
                      style={{ backgroundColor: mood.accentColor, color: '#0B0D0E' }}
                    >
                      Actief
                    </span>
                  )}
                </div>

                <h4 className="font-serif text-base text-[#F7F5F1] font-medium">{mood.name}</h4>
                <span className="text-[10px] font-mono text-[#A9AAA7] block mt-0.5">{mood.temp}</span>
                <p className="text-xs text-[#A9AAA7] leading-relaxed mt-2 font-light">
                  {mood.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Interactive Spatial Suite Room Simulation Box */}
        <div className="relative z-10 p-6 rounded-3xl bg-[#0B0D0E]/90 border border-white/10 space-y-5 overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#A9875A]" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#F7F5F1]">
                Live Suite Room Rendering Simulator
              </span>
            </div>

            {/* Dimmer Control */}
            <div className="flex items-center gap-3 bg-[#15191A] px-3.5 py-1.5 rounded-xl border border-white/10">
              <Lightbulb className="w-3.5 h-3.5" style={{ color: current.accentColor }} />
              <span className="text-[11px] font-mono text-[#A9AAA7]">Dimmer:</span>
              <input
                type="range"
                min={20}
                max={100}
                step={5}
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-24 sm:w-32 h-1 bg-[#0B0D0E] rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: current.accentColor }}
              />
              <span className="text-[11px] font-mono font-bold w-8 text-right" style={{ color: current.accentColor }}>
                {brightness}%
              </span>
            </div>
          </div>

          {/* Isometric / Spatial Room Architecture Mockup */}
          <div 
            className="h-44 sm:h-52 rounded-2xl relative overflow-hidden border border-white/10 transition-all duration-700 flex items-center justify-center"
            style={{
              backgroundColor: '#07090A',
              boxShadow: `inset 0 0 60px ${current.roomTint}`,
            }}
          >
            {/* Ambient Wall Light Strip */}
            <div 
              className="absolute top-0 left-0 right-0 h-3 blur-md transition-all duration-700"
              style={{
                backgroundColor: current.accentColor,
                opacity: brightness / 100,
              }}
            />

            {/* Sauna Cube on the left */}
            <div 
              className="absolute bottom-4 left-6 sm:left-12 w-28 sm:w-40 h-32 rounded-xl border border-amber-900/40 p-3 flex flex-col justify-between transition-all duration-700"
              style={{
                background: 'linear-gradient(180deg, rgba(30, 20, 10, 0.9) 0%, rgba(15, 10, 5, 0.95) 100%)',
                boxShadow: `0 0 35px ${current.saunaGlow}`,
                borderColor: `${current.accentColor}40`,
              }}
            >
              <div className="flex items-center justify-between text-[10px] font-mono" style={{ color: current.accentColor }}>
                <span>Sauna 85°C</span>
                <Flame className="w-3 h-3 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="h-1 bg-amber-800/40 rounded-full w-full" />
                <div className="h-1 bg-amber-800/40 rounded-full w-3/4" />
                <div className="h-1 bg-amber-800/40 rounded-full w-1/2" />
              </div>
              <span className="text-[9px] font-mono text-neutral-400">Finse Ceder</span>
            </div>

            {/* Hydro Spa in the center */}
            <div 
              className="absolute bottom-4 right-6 sm:right-12 w-32 sm:w-44 h-24 rounded-2xl border border-cyan-900/40 p-3 flex flex-col justify-between transition-all duration-700"
              style={{
                background: 'linear-gradient(180deg, rgba(10, 25, 30, 0.85) 0%, rgba(5, 12, 18, 0.95) 100%)',
                boxShadow: `0 0 25px ${current.glowColor}`,
                borderColor: `${current.accentColor}40`,
              }}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#A9875A]">
                <span>Hydro Spa 38°C</span>
                <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: current.accentColor }} />
              </div>
              <span className="text-[9px] font-mono text-neutral-400">Magnesium Flakes Hydro</span>
            </div>

            {/* Daybed Lounge in middle */}
            <div className="relative z-10 text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#15191A]/90 border border-white/10 text-xs font-serif text-[#F7F5F1]">
                <span>Kingsize Relaxation Lounge</span>
              </div>
              <span className="text-[10px] font-mono text-[#A9AAA7] block">
                Indirecte Verlichting • 100% Privacy
              </span>
            </div>

            {/* Bottom Glow Reflection on Floor */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-10 blur-xl transition-all duration-700 pointer-events-none"
              style={{
                backgroundColor: current.accentColor,
                opacity: (brightness / 100) * 0.25,
              }}
            />
          </div>

          {/* Specs Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A9AAA7] font-mono pt-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-[#A9875A]" />
              <span>DALI-gestuurde 0.1% flicker-vrije drivers voor optimale oogrust</span>
            </div>
            <span className="text-[#A9875A]">
              Kleurtemperatuur: {current.kelvin}K
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};

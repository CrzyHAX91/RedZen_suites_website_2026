import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ChevronRight, ShieldAlert } from 'lucide-react';
import { PageRoute } from '../types';

export interface PageHeroCTA {
  label: string;
  onClick?: () => void;
  destination?: PageRoute;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: 'sparkles' | 'arrow' | 'chevron' | 'none';
  id?: string;
}

export interface PageHeroProps {
  eyebrow: string;
  title: string;
  supportingText: string;
  developmentBadge?: string;
  backgroundImage?: string;
  primaryCTA?: PageHeroCTA;
  secondaryCTA?: PageHeroCTA;
  onNavigate?: (path: PageRoute) => void;
  theme?: 'dark' | 'light';
  align?: 'left' | 'center';
  className?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  title,
  supportingText,
  developmentBadge,
  backgroundImage,
  primaryCTA,
  secondaryCTA,
  onNavigate,
  theme = 'dark',
  align = 'left',
  className = ''
}) => {
  const handleCTAClick = (cta: PageHeroCTA) => {
    if (cta.onClick) {
      cta.onClick();
    } else if (cta.destination && onNavigate) {
      onNavigate(cta.destination);
    }
  };

  const isCenter = align === 'center';

  return (
    <section 
      aria-label={title}
      className={`relative pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/[0.06] ${
        theme === 'light' ? 'bg-[#EEE8DF] text-[#0B0D0E]' : 'bg-[#0B0D0E] text-[#F7F5F1]'
      } ${className}`}
    >
      {/* Background image & gradient overlays */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={backgroundImage}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center opacity-25 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D0E] via-[#0B0D0E]/85 to-[#0B0D0E]/50" />
          <div className="absolute inset-0 bg-radial-vignette opacity-70" />
        </div>
      )}

      {/* Subtle ambient blur light */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#A9875A]/[0.06] rounded-full blur-[140px] pointer-events-none z-0" 
      />

      <div className={`relative z-10 max-w-5xl mx-auto ${isCenter ? 'text-center' : 'text-left'} space-y-6 sm:space-y-8`}>
        
        {/* Eyebrow & Badges */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`flex flex-wrap items-center gap-3 ${isCenter ? 'justify-center' : 'justify-start'}`}
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#15191A]/80 border border-[#A9875A]/30 text-[#A9875A] text-[11px] font-mono tracking-[0.2em] uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A9875A]" />
            {eyebrow}
          </span>

          {developmentBadge && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#15191A]/90 border border-amber-500/30 text-[11px] font-mono tracking-wider text-amber-200/90 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {developmentBadge}
            </span>
          )}
        </motion.div>

        {/* H1 Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif tracking-tight text-[#F7F5F1] uppercase leading-[0.98] font-normal">
            {title}
          </h1>
        </motion.div>

        {/* Supporting Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className={`text-base sm:text-lg md:text-xl text-[#A9AAA7] font-light leading-relaxed max-w-3xl ${
            isCenter ? 'mx-auto' : ''
          }`}
        >
          {supportingText}
        </motion.p>

        {/* CTAs */}
        {(primaryCTA || secondaryCTA) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`pt-2 flex flex-col sm:flex-row items-center gap-4 ${
              isCenter ? 'justify-center' : 'justify-start'
            }`}
          >
            {primaryCTA && (
              <button
                type="button"
                id={primaryCTA.id || 'hero-primary-cta'}
                onClick={() => handleCTAClick(primaryCTA)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#A9875A] to-[#C5A069] text-[#0B0D0E] font-bold text-xs tracking-widest uppercase hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(169,135,90,0.25)] flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <span>{primaryCTA.label}</span>
                {primaryCTA.icon === 'arrow' && (
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                )}
                {primaryCTA.icon === 'sparkles' && (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                {(!primaryCTA.icon || primaryCTA.icon === 'chevron') && (
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            )}

            {secondaryCTA && (
              <button
                type="button"
                id={secondaryCTA.id || 'hero-secondary-cta'}
                onClick={() => handleCTAClick(secondaryCTA)}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#15191A] hover:bg-[#1C2224] text-[#F7F5F1] border border-white/10 hover:border-[#A9875A]/40 font-medium text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{secondaryCTA.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#A9875A]" />
              </button>
            )}
          </motion.div>
        )}

      </div>
    </section>
  );
};

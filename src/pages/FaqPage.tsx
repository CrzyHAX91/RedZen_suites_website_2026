import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChevronDown, 
  Sparkles, 
  HelpCircle, 
  ChevronRight,
  MessageSquare,
  ExternalLink,
  Check,
  X
} from 'lucide-react';
import { PageRoute } from '../types';
import { PageHero } from '../components/PageHero';
import { FAQ_ITEMS_DATA, FAQ_CATEGORIES, FAQCategory, FAQItem } from '../data/faqs';
import { trackEvent } from '../services/analytics';

interface FaqPageProps {
  onNavigate: (path: PageRoute) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  // Helper to extract clean FAQ ID from hash (e.g. #faq-priv-1 or #/faq#faq-priv-1)
  const getHashFaqId = (): string | null => {
    if (typeof window === 'undefined') return null;
    const raw = window.location.hash.replace(/^#+/, '').split('?')[0];
    if (!raw) return null;
    if (FAQ_ITEMS_DATA.some(item => item.id === raw)) {
      return raw;
    }
    const parts = raw.split(/[#/]/);
    const lastPart = parts[parts.length - 1];
    if (lastPart && FAQ_ITEMS_DATA.some(item => item.id === lastPart)) {
      return lastPart;
    }
    return null;
  };

  const initialTargetId = getHashFaqId();

  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>(() => {
    if (initialTargetId) {
      return { [initialTargetId]: true };
    }
    return {
      'faq-gen-1': true
    };
  });
  const [highlightedId, setHighlightedId] = useState<string | null>(() => initialTargetId);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const activeToggleRef = useRef<string | null>(null);

  // Helper to scroll and highlight target element
  const scrollToFaqItem = useCallback((itemId: string) => {
    const el = document.getElementById(itemId);
    if (el) {
      if (typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (typeof window.scrollTo === 'function') {
        const headerOffset = 100;
        const elementPosition = el.getBoundingClientRect ? el.getBoundingClientRect().top : 0;
        const offsetPosition = elementPosition + (window.pageYOffset || window.scrollY || 0) - headerOffset;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      }
    }
  }, []);

  // Handle URL Hash detection & auto-expansion
  const handleHashChange = useCallback(() => {
    if (typeof window === 'undefined') return;
    const targetId = getHashFaqId();
    if (!targetId) return;

    const matchedItem = FAQ_ITEMS_DATA.find(item => item.id === targetId);
    if (matchedItem) {
      // Ensure category filter doesn't hide the item
      setSelectedCategory(prev => {
        if (prev !== 'Alle' && prev !== matchedItem.category) {
          return 'Alle';
        }
        return prev;
      });

      // Clear search query if it would hide the item
      setSearchQuery(prev => {
        if (!prev) return prev;
        const q = prev.toLowerCase().trim();
        const matches = matchedItem.question.toLowerCase().includes(q) || 
                        matchedItem.answer.toLowerCase().includes(q) ||
                        matchedItem.category.toLowerCase().includes(q);
        return matches ? prev : '';
      });

      // Expand the item
      setOpenIds(prev => ({
        ...prev,
        [matchedItem.id]: true
      }));

      // Highlight temporarily
      setHighlightedId(matchedItem.id);
      setTimeout(() => setHighlightedId(null), 3000);

      // Scroll smoothly to item if not triggered by manual click
      if (activeToggleRef.current === targetId) {
        activeToggleRef.current = null;
      } else {
        setTimeout(() => {
          scrollToFaqItem(matchedItem.id);
        }, 120);
      }
    }
  }, [scrollToFaqItem]);

  useEffect(() => {
    document.title = 'Veelgestelde vragen | RedZen Suites';
    trackEvent('faq_page_viewed', { page: '/faq' });

    // Initial check and scroll on page load if hash is present
    if (initialTargetId) {
      handleHashChange();
      const timer1 = setTimeout(() => {
        scrollToFaqItem(initialTargetId);
      }, 150);
      const timer2 = setTimeout(() => {
        scrollToFaqItem(initialTargetId);
      }, 400);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }

    // Listen for browser back/forward or hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [handleHashChange, initialTargetId, scrollToFaqItem]);

  // Keyboard shortcut: '/' focuses search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' && 
        document.activeElement !== searchInputRef.current && 
        !['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    trackEvent('faq_category_selected', {
      page: '/faq',
      category
    });
  };

  const toggleItem = (item: FAQItem) => {
    const isCurrentlyOpen = Boolean(openIds[item.id]);
    const nextState = !isCurrentlyOpen;

    setOpenIds(prev => ({
      ...prev,
      [item.id]: nextState
    }));

    if (typeof window !== 'undefined') {
      if (nextState) {
        // Mark as manual toggle to avoid redundant scrolling
        activeToggleRef.current = item.id;
        // Update URL hash when expanding an item
        window.location.hash = item.id;

        trackEvent('faq_item_opened', {
          page: '/faq',
          item_id: item.id,
          category: item.category,
          question: item.question
        });
      } else {
        // When collapsing: cleanly clear hash if it pointed to this item
        const currentHash = window.location.hash.replace(/^#+/, '').split('?')[0];
        if (currentHash === item.id) {
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          } else {
            window.location.hash = '';
          }
        }
      }
    }
  };

  const handleCopyDeepLink = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}${window.location.pathname}#${itemId}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopiedId(itemId);
        activeToggleRef.current = itemId;
        window.location.hash = itemId;
        setTimeout(() => setCopiedId(null), 2500);
      });
    }
  };

  const filteredItems = useMemo(() => {
    return FAQ_ITEMS_DATA.filter(item => {
      const matchesCategory = selectedCategory === 'Alle' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.question.toLowerCase().includes(q) || 
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    }).sort((a, b) => a.order - b.order);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-24 sm:space-y-36 pb-24">
      
      {/* 1. SHARED PAGE HERO */}
      <PageHero
        eyebrow="QUESTIONS, ANSWERED."
        title="WHAT WOULD YOU LIKE TO KNOW?"
        supportingText="RedZen bevindt zich in de ontwikkelingsfase. Hier vind je wat al bekend is en wat later wordt bevestigd."
        developmentBadge="ONTWIKKELINGSFASE"
        primaryCTA={{
          label: 'JOIN EARLY ACCESS',
          destination: '/early-access',
          icon: 'sparkles',
          id: 'btn-faq-hero-cta'
        }}
        secondaryCTA={{
          label: 'NEEM CONTACT OP',
          destination: '/contact',
          icon: 'chevron',
          id: 'btn-faq-hero-contact'
        }}
        onNavigate={onNavigate}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 2. SEARCH & FILTERING BAR */}
        <section aria-label="Zoeken en filteren van veelgestelde vragen" className="space-y-6">
          
          {/* Search Field */}
          <div className="relative">
            <Search className="w-5 h-5 text-[#A9875A] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <label htmlFor="faq-search-input" className="sr-only">
              Zoek in veelgestelde vragen
            </label>
            <input
              ref={searchInputRef}
              type="text"
              id="faq-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek in vragen en antwoorden (typ '/' om direct te zoeken)..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[#15191A] border border-white/10 text-sm text-[#F7F5F1] placeholder-[#A9AAA7]/60 focus:outline-none focus:border-[#A9875A] focus:ring-1 focus:ring-[#A9875A] transition-all shadow-inner"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  type="button"
                  aria-label="Wis zoekopdracht"
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full text-[#A9AAA7] hover:text-white cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#A9875A]"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-[#A9AAA7] border border-white/10">
                  /
                </span>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-[#A9875A] uppercase tracking-widest block">
              Filter per categorie
            </span>
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="FAQ Categorieën">
              <button
                type="button"
                id="tab-faq-all"
                role="tab"
                aria-selected={selectedCategory === 'Alle'}
                aria-controls="faq-results-region"
                onClick={() => handleCategorySelect('Alle')}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A9875A] ${
                  selectedCategory === 'Alle'
                    ? 'bg-[#A9875A] text-[#0B0D0E] font-bold shadow-md'
                    : 'bg-[#15191A] text-[#A9AAA7] hover:text-[#F7F5F1] border border-white/5 hover:border-white/20'
                }`}
              >
                Alle ({FAQ_ITEMS_DATA.length})
              </button>

              {FAQ_CATEGORIES.map(cat => {
                const count = FAQ_ITEMS_DATA.filter(i => i.category === cat).length;
                const isSelected = selectedCategory === cat;
                const tabId = `tab-faq-${cat.toLowerCase().replace(/\s+/g, '-')}`;
                return (
                  <button
                    key={cat}
                    id={tabId}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    aria-controls="faq-results-region"
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A9875A] ${
                      isSelected
                        ? 'bg-[#A9875A] text-[#0B0D0E] font-bold shadow-md'
                        : 'bg-[#15191A] text-[#A9AAA7] hover:text-[#F7F5F1] border border-white/5 hover:border-white/20'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

        </section>

        {/* 3. ACCORDION LIST WITH DEEP LINKING & ARIA SUPPORT */}
        <div 
          id="faq-results-region" 
          className="space-y-4" 
          role="region" 
          aria-live="polite"
          aria-label="Lijst met veelgestelde vragen"
        >
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#15191A] border border-white/5 space-y-3">
              <p className="text-[#F7F5F1] font-serif text-lg">Geen vragen gevonden voor “{searchQuery}”</p>
              <p className="text-xs text-[#A9AAA7]">Probeer een andere zoekterm of selecteer een categorie.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Alle');
                }}
                className="mt-2 text-xs font-mono text-[#A9875A] underline cursor-pointer"
              >
                Filters wissen
              </button>
            </div>
          ) : (
            filteredItems.map(item => {
              const isItemOpen = Boolean(openIds[item.id]);
              const btnId = `btn-${item.id}`;
              const contentId = `answer-${item.id}`;
              
              return (
                <div
                  key={item.id}
                  id={item.id}
                  className={`rounded-2xl transition-all duration-300 border overflow-hidden scroll-mt-28 ${
                    isItemOpen 
                      ? 'bg-[#15191A] border-[#A9875A]/50 shadow-xl' 
                      : 'bg-[#15191A]/60 border-white/5 hover:border-white/20'
                  } ${highlightedId === item.id ? 'ring-2 ring-[#A9875A] ring-offset-2 ring-offset-[#0B0D0E]' : ''}`}
                >
                  <h3 className="m-0 p-0 text-base font-normal">
                    <button
                      type="button"
                      id={btnId}
                      aria-expanded={isItemOpen}
                      aria-controls={contentId}
                      onClick={() => toggleItem(item)}
                      className="w-full p-6 sm:p-7 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A9875A] select-none group"
                    >
                      <div className="space-y-1.5 flex-1 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#A9875A] px-2 py-0.5 rounded bg-[#A9875A]/10 border border-[#A9875A]/25 inline-block">
                            {item.category}
                          </span>
                        </div>
                        <span className="text-base sm:text-lg font-serif text-[#F7F5F1] font-medium leading-snug block group-hover:text-[#A9875A] transition-colors">
                          {item.question}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                        <div className={`p-2 rounded-full bg-[#0B0D0E] text-[#A9875A] transition-transform duration-300 ${
                          isItemOpen ? 'rotate-180 bg-[#A9875A]/20' : ''
                        }`}>
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isItemOpen && (
                      <motion.div
                        id={contentId}
                        role="region"
                        aria-labelledby={btnId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-6 sm:px-7 pb-6 pt-2 text-xs sm:text-sm text-[#D0CEC7] font-light leading-relaxed border-t border-white/5 space-y-4">
                          <p className="leading-relaxed">{item.answer}</p>
                          
                          <div className="pt-3 flex items-center justify-between text-[11px] font-mono text-[#A9AAA7] border-t border-white/[0.04]">
                            <span className="text-white/40">Item #{item.id}</span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyDeepLink(e, item.id)}
                              className="inline-flex items-center gap-1.5 text-[#A9875A] hover:text-white transition-colors cursor-pointer px-2.5 py-1 rounded bg-white/5 hover:bg-white/10"
                              title="Kopieer directe URL link naar deze vraag"
                            >
                              {copiedId === item.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Directe link gekopieerd!</span>
                                </>
                              ) : (
                                <>
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Deel directe link</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* 4. STILL HAVE QUESTIONS BOX */}
        <section aria-labelledby="help-heading" className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#15191A] via-[#121617] to-[#0B0D0E] border border-[#A9875A]/30 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-[#A9875A]/10 text-[#A9875A] mx-auto flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 id="help-heading" className="text-xl sm:text-2xl font-serif text-[#F7F5F1]">
              Staat je vraag er niet tussen?
            </h3>
            <p className="text-xs text-[#A9AAA7] font-light leading-relaxed">
              Ons pre-launch team beantwoordt graag vragen over het concept, locatieselectie, mogelijke partnerships of investeringen.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              id="btn-faq-contact-direct"
              onClick={() => onNavigate('/contact')}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#15191A] hover:bg-[#1C2224] text-[#F7F5F1] text-xs font-mono uppercase tracking-wider transition-colors border border-white/10 cursor-pointer"
            >
              Neem direct contact op
            </button>
            <button
              type="button"
              id="btn-faq-join-early-access"
              onClick={() => {
                trackEvent('early_access_cta_clicked', { page: '/faq', section: 'contact_box', destination: '/early-access' });
                onNavigate('/early-access');
              }}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#A9875A] hover:bg-[#C5A069] text-[#0B0D0E] font-bold text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer shadow-md"
            >
              Join Early Access
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

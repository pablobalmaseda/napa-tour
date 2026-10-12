import React, { useState, useEffect } from 'react';
import type { WineSlide } from '../data/slides';
import { WineryLogo } from './WineryLogo';
import { 
  ChevronLeft, 
  ChevronRight, 
  Wine, 
  Mountain, 
  Layers, 
  Sparkles, 
  Play, 
  Pause, 
  ListOrdered, 
  MapPin,
  Utensils,
  ExternalLink,
  Smartphone,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  slides: WineSlide[];
  currentSlideIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  onSelectSlide: (index: number) => void;
  onOpenPairing?: () => void;
  clientsCount?: number;
  isConnected?: boolean;
}

// Helper to format text containing markdown links [label](url) or raw URLs into interactive links
const renderFormattedText = (text: string) => {
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)]+)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1] && match[2]) {
      // Markdown formatted link
      const label = match[1];
      const url = match[2];
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#d4af37] underline decoration-[#d4af37]/60 hover:text-[#fae8b4] hover:decoration-[#fae8b4] inline-flex items-center gap-1 font-semibold transition-colors mx-0.5"
        >
          <span>{label}</span>
          <ExternalLink className="w-3 h-3 inline shrink-0" />
        </a>
      );
    } else if (match[3]) {
      // Raw URL
      const url = match[3];
      let displayLabel = url;
      try {
        const u = new URL(url);
        const host = u.hostname.replace(/^www\./, '');
        const path = u.pathname.replace(/^\/recipes\//, '').replace(/\/$/, '');
        displayLabel = path ? `${host}/${path}` : host;
        if (displayLabel.length > 36) displayLabel = displayLabel.slice(0, 34) + '...';
      } catch {
        displayLabel = url;
      }

      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#d4af37] underline decoration-[#d4af37]/60 hover:text-[#fae8b4] hover:decoration-[#fae8b4] inline-flex items-center gap-1 font-semibold transition-colors mx-0.5"
        >
          <span>{displayLabel}</span>
          <ExternalLink className="w-3 h-3 inline shrink-0" />
        </a>
      );
    }

    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

export const Sidebar: React.FC<SidebarProps> = ({
  slides,
  currentSlideIndex,
  onNext,
  onPrevious,
  onSelectSlide,
  onOpenPairing,
  clientsCount = 1,
  isConnected = false
}) => {
  const currentSlide = slides[currentSlideIndex];
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFlightMenu, setShowFlightMenu] = useState(false);

  // Autoplay presentation timer (9 seconds per stop)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (currentSlideIndex < slides.length - 1) {
        onNext();
      } else {
        onSelectSlide(0); // Loop back to start
      }
    }, 9000);

    return () => clearInterval(interval);
  }, [isPlaying, currentSlideIndex, slides.length, onNext, onSelectSlide]);

  const wineSlides = slides.filter(s => !s.isOverview);
  const totalWines = wineSlides.length;

  return (
    <aside className="w-full lg:w-[35%] h-full flex flex-col justify-between bg-[#0e1015] border-r border-[#222733] text-gray-200 relative z-20 shadow-2xl overflow-hidden">
      {/* Background luxury watermarks and subtle glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-[#5a1827]/10 rounded-full blur-3xl pointer-events-none -ml-20" />

      {/* Top Header & Branding */}
      <header className="p-6 pb-4 border-b border-[#1c222e] flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#191d27] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-inner">
            <Wine className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-cinzel text-xs tracking-[0.25em] text-[#d4af37] uppercase font-bold">
              Napa Valley Terroir
            </h1>
            <p className="text-[11px] text-gray-400 font-sans-clean">
              Curated Sommelier Tasting Flight
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Companion Remote Modal Trigger */}
          <button
            onClick={onOpenPairing}
            className="p-2 rounded-lg text-xs flex items-center gap-1.5 transition-all border bg-[#151922] text-[#d4af37] border-[#d4af37]/40 hover:bg-[#1f2533] hover:border-[#d4af37] shadow-sm"
            title="Connect Phone Companion Remote / Notes"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline font-sans-clean font-medium text-xs">Remote</span>
            {clientsCount > 1 ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" title={`${clientsCount} devices synced`} />
            ) : isConnected ? (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 ml-0.5" />
            ) : null}
          </button>

          {/* Flight Drawer Toggle */}
          <button
            onClick={() => setShowFlightMenu(!showFlightMenu)}
            className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-all border ${
              showFlightMenu
                ? 'bg-[#d4af37] text-black border-[#fae8b4]'
                : 'bg-[#151922] text-gray-300 border-[#2b3342] hover:border-[#d4af37]/60'
            }`}
            title="View All Flight Stops"
          >
            <ListOrdered className="w-4 h-4" />
            <span className="hidden sm:inline font-sans-clean font-medium text-xs">Route</span>
          </button>

          {/* Autoplay Presentation Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-all border ${
              isPlaying
                ? 'bg-[#d4af37] text-[#0d0f12] border-[#d4af37] shadow-lg shadow-[#d4af37]/20 font-bold'
                : 'bg-[#151922] text-gray-400 border-[#2b3342] hover:text-white'
            }`}
            title={isPlaying ? 'Pause Auto Tour' : 'Start Auto Tour (9s per stop)'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>

        {/* Flight Route Menu Dropdown Drawer */}
        {showFlightMenu && (
          <div className="absolute top-full left-0 w-full bg-[#12161f] border-b border-[#2d3648] p-3 shadow-2xl z-30 animate-in slide-in-from-top-2 duration-200">
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-[10px] font-cinzel text-[#d4af37] uppercase tracking-wider">Jump to Flight Stop</span>
              <span className="text-[10px] text-gray-400 font-mono">{totalWines} Tasting Flights</span>
            </div>
            <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelectSlide(idx);
                    setShowFlightMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between text-xs transition-colors ${
                    idx === currentSlideIndex
                      ? 'bg-[#212837] text-[#fae8b4] border border-[#d4af37]/40'
                      : 'hover:bg-[#1a202d] text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 text-center font-mono text-[#d4af37]">
                      {s.isOverview ? '•' : s.wineNumber}
                    </span>
                    <span className="truncate font-serif-luxury">{s.title}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono ml-2 shrink-0">{s.region}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area (Scrollable with elegant styling) */}
      <main className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {/* Flight Progress Pill & Region Badge */}
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pb-1">
          <div className="flex items-center gap-2 shrink-0">
            {currentSlide.isOverview ? (
              <span className="text-[11px] font-cinzel font-semibold tracking-wider text-[#d4af37] uppercase">
                Tasting Flight • Overview
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-cinzel font-semibold tracking-wider text-[#d4af37] uppercase">
                  Flight Stop {String(currentSlide.wineNumber).padStart(2, '0')} of {String(totalWines).padStart(2, '0')}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#d4af37]" />
                <span className="px-1.5 py-0.5 rounded bg-[#161a24] border border-[#2d3546] text-[10px] text-gray-300 font-mono tracking-wider font-semibold">
                  {currentSlide.producerCode}
                </span>
              </div>
            )}
          </div>

          {/* Region Badge */}
          <div className="flex items-center gap-1.5 text-xs text-amber-200/90 bg-[#1e2430]/90 border border-[#3b4457] rounded-full px-2.5 py-0.5 shrink-0 max-w-full">
            <MapPin className="w-3 h-3 text-[#d4af37] shrink-0" />
            <span className="font-sans-clean truncate">{currentSlide.region}</span>
          </div>
        </div>

        {/* Wine Title & Vintage Subtitle */}
        <div className="space-y-2">
          <h2 className="font-serif-luxury text-2xl sm:text-3xl text-white font-normal leading-tight tracking-tight">
            {currentSlide.title}
          </h2>
          <div className="inline-block bg-[#1a1f2b] border border-[#d4af37]/40 rounded-md px-2.5 py-1 text-xs font-cinzel text-[#fae8b4] tracking-wide shadow-sm">
            {currentSlide.subtitle}
          </div>
        </div>

        {/* Winery Estate Logo Plaque */}
        <div className="relative rounded-xl overflow-hidden border border-[#d4af37]/30 shadow-2xl bg-gradient-to-b from-[#161a24] to-[#0e1117] py-6 px-4 flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-transparent to-transparent pointer-events-none" />
          <WineryLogo producerCode={currentSlide.producerCode} className="h-16 w-auto" />
        </div>

        {/* Story Narrative Box */}
        <div className="relative bg-[#13161e] border-l-2 border-[#d4af37] rounded-r-lg p-4 sm:p-5 shadow-lg">
          <p className="text-gray-300 text-sm sm:text-[15px] leading-relaxed font-sans-clean font-light tracking-wide">
            {currentSlide.story}
          </p>
        </div>

        {/* Winemaker & Cellar Master Card */}
        {currentSlide.winemaker && (
          <div className="bg-[#141822]/90 border border-[#d4af37]/30 rounded-xl p-3.5 shadow-md flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#191d27] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shrink-0 mt-0.5 shadow-inner">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-cinzel text-[#d4af37] tracking-wider font-semibold">
                Winemaker &amp; Cellar Master
              </p>
              <p className="text-sm text-white font-medium">{currentSlide.winemaker}</p>
              {currentSlide.winemakerBio && (
                <p className="text-xs text-gray-300 mt-1 font-light leading-relaxed">
                  {currentSlide.winemakerBio}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Terroir & Viticulture Attributes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {currentSlide.elevation && (
            <div className="bg-[#141822]/80 border border-[#222938] rounded-lg p-3 flex items-start gap-2.5">
              <Mountain className="w-4 h-4 text-[#d4af37] mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-cinzel text-gray-400">Elevation Profile</p>
                <p className="text-xs text-gray-200 font-medium">{currentSlide.elevation}</p>
              </div>
            </div>
          )}

          {currentSlide.soil && (
            <div className="bg-[#141822]/80 border border-[#222938] rounded-lg p-3 flex items-start gap-2.5">
              <Layers className="w-4 h-4 text-[#d4af37] mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-cinzel text-gray-400">Terroir & Soil</p>
                <p className="text-xs text-gray-200 font-medium leading-snug">{currentSlide.soil}</p>
              </div>
            </div>
          )}
        </div>

        {/* Topology & Elevation Wine Impact Card */}
        {currentSlide.terroirImpact && (
          <div className="bg-gradient-to-r from-amber-950/20 to-[#141822] border border-amber-600/30 rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Mountain className="w-3.5 h-3.5 text-[#d4af37]" />
              <p className="text-[10px] uppercase font-cinzel text-[#fae8b4] font-semibold tracking-wider">
                Elevation &amp; Topology Impact on Wine
              </p>
            </div>
            <p className="text-xs text-amber-100/90 font-sans-clean leading-relaxed font-light">
              {currentSlide.terroirImpact}
            </p>
          </div>
        )}

        {/* Sommelier Tasting Notes & Hints of */}
        {(currentSlide.hintsOf || (currentSlide.tastingNotes && currentSlide.tastingNotes.length > 0)) && (
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-cinzel tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Sommelier Palate Profile</span>
            </div>

            {currentSlide.hintsOf && (
              <div className="bg-[#141822]/85 border border-[#283244] rounded-lg p-3.5">
                <p className="text-[10px] uppercase font-cinzel text-[#d4af37] tracking-wider mb-1 font-semibold">
                  Hints Of
                </p>
                <p className="text-xs text-amber-100/95 font-serif italic leading-relaxed">
                  &ldquo;{currentSlide.hintsOf}&rdquo;
                </p>
              </div>
            )}

            {currentSlide.tastingNotes && currentSlide.tastingNotes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentSlide.tastingNotes.map((note, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full text-[11px] bg-[#1a202d] border border-[#2e3748] text-gray-300 font-sans-clean"
                  >
                    {note}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Food Pairings & Culinary Recommendations */}
        {(currentSlide.foodPairing || currentSlide.pairsWellWith) && (
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-cinzel tracking-wider uppercase">
              <Utensils className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Sommelier Food Pairings</span>
            </div>

            {currentSlide.foodPairing && (
              <div className="bg-gradient-to-r from-[#191e2b]/95 to-[#131722]/95 border border-[#d4af37]/35 rounded-lg p-3.5 shadow-md">
                <p className="text-[10px] uppercase font-cinzel text-[#fae8b4] font-semibold tracking-wider mb-1.5">
                  Curated Dish &amp; Recipes
                </p>
                <div className="text-xs text-gray-200 leading-relaxed font-sans-clean">
                  {renderFormattedText(currentSlide.foodPairing)}
                </div>
              </div>
            )}

            {currentSlide.pairsWellWith && (
              <div className="bg-[#141822]/70 border border-[#232b3a] rounded-lg p-3">
                <p className="text-[10px] uppercase font-cinzel text-gray-400 mb-1">
                  Pairs Well With
                </p>
                <p className="text-xs text-gray-300 font-sans-clean leading-snug">
                  {currentSlide.pairsWellWith}
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Sticky Navigation Footer */}
      <footer className="p-5 border-t border-[#1c222e] bg-[#0c0e13]/95 backdrop-blur-md space-y-3">
        {/* Step indicator bar */}
        <div className="w-full bg-[#1c222e] h-1.5 rounded-full overflow-hidden flex">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 h-full transition-all duration-500 border-r border-[#0c0e13] ${
                idx <= currentSlideIndex ? 'bg-[#d4af37]' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onPrevious}
            disabled={currentSlideIndex === 0}
            className={`flex-1 py-3 px-4 rounded-lg font-cinzel text-xs tracking-wider uppercase flex items-center justify-center gap-2 border transition-all duration-300 ${
              currentSlideIndex === 0
                ? 'opacity-30 border-gray-800 text-gray-600 cursor-not-allowed bg-transparent'
                : 'border-[#333c4d] bg-[#141822] text-gray-200 hover:border-[#d4af37] hover:text-[#d4af37] hover:bg-[#1b202d] shadow-md active:scale-[0.98]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={onNext}
            disabled={currentSlideIndex === slides.length - 1}
            className={`flex-1 py-3 px-4 rounded-lg font-cinzel text-xs tracking-wider uppercase flex items-center justify-center gap-2 border transition-all duration-300 ${
              currentSlideIndex === slides.length - 1
                ? 'opacity-30 border-gray-800 text-gray-600 cursor-not-allowed bg-transparent'
                : 'bg-gradient-gold text-[#0d0f12] font-bold border-[#fae8b4] shadow-lg shadow-[#d4af37]/20 hover:brightness-110 active:scale-[0.98]'
            }`}
          >
            <span>{currentSlideIndex === 0 ? 'Begin Tasting' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Keyboard navigation hint */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-mono pt-1">
          <span>Navigate with</span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#181d28] border border-[#2d3648] text-gray-300">←</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-[#181d28] border border-[#2d3648] text-gray-300">→</kbd>
          <span>or Spacebar</span>
        </div>
      </footer>
    </aside>
  );
};

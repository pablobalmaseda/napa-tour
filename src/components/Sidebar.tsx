import React, { useState, useEffect } from 'react';
import type { WineSlide } from '../data/slides';
import type { LayoutMode, PresentationTabId } from '../types/presentation';
import { WineryLogo } from './WineryLogo';
import { cleanFoodPairingText } from '../utils/textUtils';
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
  QrCode,
  Wifi,
  WifiOff,
  BookOpen,
  Monitor,
  LayoutGrid,
  Columns,
  Sun
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
  layoutMode?: LayoutMode;
  onLayoutChange?: (mode: LayoutMode) => void;
  activeTab?: PresentationTabId;
  onTabChange?: (tab: PresentationTabId) => void;
}

// Helper to format text containing markdown links [label](url) or raw URLs into interactive links for V1
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
  isConnected = false,
  layoutMode = 'v2-tabs',
  onLayoutChange,
  activeTab = 'story',
  onTabChange
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
    <aside className="w-full lg:w-[38%] xl:w-[35%] h-full flex flex-col justify-between bg-[#0e1015] border-r border-[#222733] text-gray-200 relative z-20 shadow-2xl overflow-hidden">
      {/* Background luxury watermarks and subtle glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-[#5a1827]/10 rounded-full blur-3xl pointer-events-none -ml-20" />

      {/* Top Header & Branding */}
      <header className="p-4 sm:p-5 pb-3 border-b border-[#1c222e] flex flex-wrap items-center justify-between gap-3 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#191d27] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-inner shrink-0">
            <Wine className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-cinzel text-xs tracking-[0.2em] text-[#d4af37] uppercase font-bold">
              Napa Valley Terroir
            </h1>
            <p className="text-[10px] text-gray-400 font-sans-clean">
              Curated Sommelier Flight
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* View Mode Switcher */}
          {onLayoutChange && (
            <div className="flex items-center gap-0.5 bg-[#141822] p-1 rounded-lg border border-[#273042]">
              <button
                onClick={() => onLayoutChange('v1-scroll')}
                className={`p-1.5 rounded-md text-xs transition-all flex items-center gap-1 ${
                  layoutMode === 'v1-scroll'
                    ? 'bg-[#2b3548] text-[#fae8b4] font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Classic Scrolling Sidebar (V1)"
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden xl:inline">Classic</span>
              </button>

              <button
                onClick={() => onLayoutChange('v2-tabs')}
                className={`p-1.5 rounded-md text-xs transition-all flex items-center gap-1 ${
                  layoutMode === 'v2-tabs'
                    ? 'bg-[#d4af37] text-[#0d0f12] font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Zero-Scroll TV Tabbed Sidebar (Mode A)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden xl:inline">TV Tabs</span>
              </button>

              <button
                onClick={() => onLayoutChange('v2-cinema')}
                className={`p-1.5 rounded-md text-xs transition-all flex items-center gap-1 ${
                  layoutMode === 'v2-cinema'
                    ? 'bg-[#d4af37] text-[#0d0f12] font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Cinematic Lower-Third Fullscreen (Mode B)"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden xl:inline">Cinema</span>
              </button>
            </div>
          )}

          {/* Remote Sync Button */}
          {onOpenPairing && (
            <button
              onClick={onOpenPairing}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all border ${
                isConnected
                  ? 'bg-[#18281d] text-emerald-300 border-emerald-500/40 hover:border-emerald-400'
                  : 'bg-[#151922] text-gray-400 border-[#2b3342] hover:text-white'
              }`}
              title={isConnected ? `Synced: ${clientsCount} connected` : 'Pair Mobile Remote'}
            >
              {isConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <QrCode className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Flight Drawer Toggle */}
          <button
            onClick={() => setShowFlightMenu(!showFlightMenu)}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all border ${
              showFlightMenu
                ? 'bg-[#d4af37] text-black border-[#fae8b4]'
                : 'bg-[#151922] text-gray-300 border-[#2b3342] hover:border-[#d4af37]/60'
            }`}
            title="View All Flight Stops"
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-sans-clean font-medium text-xs">Route</span>
          </button>

          {/* Autoplay Presentation Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all border ${
              isPlaying
                ? 'bg-[#d4af37] text-[#0d0f12] border-[#d4af37] font-bold'
                : 'bg-[#151922] text-gray-400 border-[#2b3342] hover:text-white'
            }`}
            title={isPlaying ? 'Pause Auto Tour' : 'Start Auto Tour (9s per stop)'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
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

      {/* ============================================================ */}
      {/* MODE A: TV TABBED PRESENTATION (Zero-Scroll Mode)              */}
      {/* ============================================================ */}
      {layoutMode === 'v2-tabs' ? (
        <div className="flex-1 flex flex-col justify-between overflow-hidden px-5 py-4 space-y-3.5">
          {/* Top Title & Progress Header */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
              <div className="flex items-center gap-2">
                {currentSlide.isOverview ? (
                  <span className="text-[11px] font-cinzel font-semibold tracking-wider text-[#d4af37] uppercase">
                    {currentSlide.producerCode === 'TASTE' ? "Sommelier Guide • The 5 S's" : 'Tasting Flight • Overview'}
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5 bg-[#161a24] border border-[#d4af37]/40 rounded-full px-2.5 py-0.5">
                    <span className="text-[11px] font-cinzel font-semibold tracking-wider text-[#fae8b4] uppercase">
                      Stop {String(currentSlide.wineNumber).padStart(2, '0')}&thinsp;/&thinsp;{String(totalWines).padStart(2, '0')}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#d4af37]" />
                    <span className="text-[10px] text-gray-300 font-mono font-bold">
                      {currentSlide.producerCode}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-amber-200/90 bg-[#1e2430]/90 border border-[#3b4457] rounded-full px-2.5 py-0.5 shrink-0">
                <MapPin className="w-3 h-3 text-[#d4af37] shrink-0" />
                <span className="font-sans-clean truncate max-w-[200px]">{currentSlide.region}</span>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="font-serif-luxury text-2xl sm:text-3xl text-white font-normal leading-tight tracking-tight">
                {currentSlide.title}
              </h2>
              <div className="inline-block bg-[#1a1f2b] border border-[#d4af37]/35 rounded-md px-2.5 py-0.5 text-xs font-cinzel text-[#fae8b4]">
                {currentSlide.subtitle}
              </div>
            </div>
          </div>

          {/* 3-Tab Selector Bar */}
          <div className="grid grid-cols-3 gap-1.5 bg-[#141822] p-1 rounded-xl border border-[#252c3c]">
            <button
              onClick={() => onTabChange?.('story')}
              className={`py-2 px-1 rounded-lg text-xs font-cinzel tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'story'
                  ? 'bg-[#d4af37] text-[#0d0f12] font-bold shadow-md shadow-[#d4af37]/20'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a202d]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{currentSlide.producerCode === 'TASTE' ? '1. See & Swirl' : '1. Terroir'}</span>
            </button>

            <button
              onClick={() => onTabChange?.('palate')}
              className={`py-2 px-1 rounded-lg text-xs font-cinzel tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'palate'
                  ? 'bg-[#d4af37] text-[#0d0f12] font-bold shadow-md shadow-[#d4af37]/20'
                : 'text-gray-400 hover:text-white hover:bg-[#1a202d]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{currentSlide.producerCode === 'TASTE' ? '2. Sniff' : '2. Palate'}</span>
            </button>

            <button
              onClick={() => onTabChange?.('food')}
              className={`py-2 px-1 rounded-lg text-xs font-cinzel tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'food'
                  ? 'bg-[#d4af37] text-[#0d0f12] font-bold shadow-md shadow-[#d4af37]/20'
                : 'text-gray-400 hover:text-white hover:bg-[#1a202d]'
              }`}
            >
              <Utensils className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{currentSlide.producerCode === 'TASTE' ? '3. Sip & Savor' : '3. Pairing'}</span>
            </button>
          </div>

          {/* Tab Content Display Area (Natural Fit with Smooth Scroll fallback) */}
          <div className="flex-1 overflow-y-auto pr-1">
            {/* Tab 1: Story & Terroir */}
            {activeTab === 'story' && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                <div className="bg-gradient-to-b from-[#161a24] to-[#0e1117] border border-[#d4af37]/30 rounded-xl p-3 flex items-center justify-center shadow-lg">
                  <WineryLogo producerCode={currentSlide.producerCode} className="h-12 w-auto" />
                </div>

                {/* Vintage Climate & Weather Card (or See & Swirl on TASTE slide) */}
                {currentSlide.vintageWeather && (
                  <div className="bg-[#141822]/95 border border-[#d4af37]/35 rounded-xl p-3.5 shadow-md">
                    <div className="flex items-center gap-1.5 text-xs text-[#fae8b4] font-cinzel font-semibold tracking-wider uppercase mb-1">
                      <Sun className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>
                        {currentSlide.producerCode === 'TASTE'
                          ? 'Steps 1 & 2 • Sight & Aeration'
                          : 'Vintage Climate & Growing Season'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-200 font-sans-clean leading-relaxed">
                      {currentSlide.vintageWeather}
                    </p>
                  </div>
                )}

                <div className="bg-[#13161e] border-l-2 border-[#d4af37] rounded-r-lg p-3.5 shadow-md">
                  <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans-clean font-light tracking-wide">
                    {currentSlide.story}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {currentSlide.elevation && (
                    <div className="bg-[#141822]/90 border border-[#232b3a] rounded-lg p-2.5">
                      <p className="text-[10px] uppercase font-cinzel text-gray-400 flex items-center gap-1">
                        <Mountain className="w-3 h-3 text-[#d4af37]" />
                        {currentSlide.producerCode === 'TASTE' ? 'Aroma Check' : 'Elevation'}
                      </p>
                      <p className="text-xs text-gray-200 font-medium truncate mt-0.5">{currentSlide.elevation}</p>
                    </div>
                  )}
                  {currentSlide.soil && (
                    <div className="bg-[#141822]/90 border border-[#232b3a] rounded-lg p-2.5">
                      <p className="text-[10px] uppercase font-cinzel text-gray-400 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-[#d4af37]" />
                        {currentSlide.producerCode === 'TASTE' ? 'Palate Check' : 'Soil Geology'}
                      </p>
                      <p className="text-xs text-gray-200 font-medium truncate mt-0.5">{currentSlide.soil}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Palate Profile */}
            {activeTab === 'palate' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {currentSlide.hintsOf && (
                  <div className="bg-[#141822]/95 border border-[#283244] rounded-xl p-4 shadow-inner">
                    <p className="text-[10px] uppercase font-cinzel text-[#d4af37] font-semibold tracking-widest mb-1.5">
                      {currentSlide.producerCode === 'TASTE' ? 'Step 3 • How to Sniff like a Sommelier' : 'Sommelier Aromatics & Hints'}
                    </p>
                    <p className="text-amber-100 font-serif italic text-base sm:text-lg leading-relaxed">
                      &ldquo;{currentSlide.hintsOf}&rdquo;
                    </p>
                  </div>
                )}

                {currentSlide.tastingNotes && currentSlide.tastingNotes.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase font-cinzel text-gray-400">
                      {currentSlide.producerCode === 'TASTE' ? "The 5 S's Checklist" : 'Palate Elements'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentSlide.tastingNotes.map((note, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-full text-xs sm:text-sm bg-[#1c2230] border border-[#374258] text-amber-200 font-sans-clean shadow-sm"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Food Pairing (Cleaned of recipe links for TV) */}
            {activeTab === 'food' && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                {currentSlide.foodPairing && (
                  <div className="bg-gradient-to-r from-[#191e2b]/95 to-[#131722]/95 border border-[#d4af37]/40 rounded-xl p-4 shadow-md">
                    <p className="text-[10px] uppercase font-cinzel text-[#fae8b4] font-semibold tracking-wider mb-1.5">
                      {currentSlide.producerCode === 'TASTE' ? 'Steps 4 & 5 • Sip & Savor' : "Chef's Curated Dish"}
                    </p>
                    <p className="text-white text-base sm:text-lg font-medium font-sans-clean leading-snug">
                      {cleanFoodPairingText(currentSlide.foodPairing)}
                    </p>
                  </div>
                )}

                {currentSlide.pairsWellWith && (
                  <div className="bg-[#141822]/80 border border-[#232b3a] rounded-xl p-3.5">
                    <p className="text-[10px] uppercase font-cinzel text-gray-400 mb-1">
                      {currentSlide.producerCode === 'TASTE' ? 'Food & Wine Chemistry' : 'Pairs Well With'}
                    </p>
                    <p className="text-gray-300 text-sm font-sans-clean leading-relaxed">
                      {currentSlide.pairsWellWith}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ============================================================ */
        /* MODE V1: CLASSIC CONTINUOUS SCROLL SIDEBAR (Preserved 100%)  */
        /* ============================================================ */
        <main className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Flight Progress Pill & Region Badge */}
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pb-1">
            <div className="flex items-center gap-2 shrink-0">
              {currentSlide.isOverview ? (
                <span className="text-[11px] font-cinzel font-semibold tracking-wider text-[#d4af37] uppercase">
                  {currentSlide.producerCode === 'TASTE' ? "Sommelier Guide • The 5 S's" : 'Tasting Flight • Overview'}
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

          {/* Vintage Growing Season & Climate Weather Card */}
          {currentSlide.vintageWeather && (
            <div className="bg-[#141822]/95 border border-[#d4af37]/35 rounded-lg p-4 shadow-md">
              <div className="flex items-center gap-1.5 text-xs text-[#fae8b4] font-cinzel font-semibold tracking-wider uppercase mb-1.5">
                <Sun className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>
                  {currentSlide.producerCode === 'TASTE'
                    ? 'Steps 1 & 2 • Sight & Aeration'
                    : 'Vintage Climate & Growing Season'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-200 font-sans-clean leading-relaxed">
                {currentSlide.vintageWeather}
              </p>
            </div>
          )}

          {/* Terroir & Viticulture Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {currentSlide.elevation && (
              <div className="bg-[#141822]/80 border border-[#222938] rounded-lg p-3 flex items-start gap-2.5">
                <Mountain className="w-4 h-4 text-[#d4af37] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-cinzel text-gray-400">
                    {currentSlide.producerCode === 'TASTE' ? 'Aroma Focus' : 'Elevation Profile'}
                  </p>
                  <p className="text-xs text-gray-200 font-medium">{currentSlide.elevation}</p>
                </div>
              </div>
            )}

            {currentSlide.soil && (
              <div className="bg-[#141822]/80 border border-[#222938] rounded-lg p-3 flex items-start gap-2.5">
                <Layers className="w-4 h-4 text-[#d4af37] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-cinzel text-gray-400">
                    {currentSlide.producerCode === 'TASTE' ? 'Palate Focus' : 'Terroir & Soil'}
                  </p>
                  <p className="text-xs text-gray-200 font-medium leading-snug">{currentSlide.soil}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sommelier Tasting Notes & Hints of */}
          {(currentSlide.hintsOf || (currentSlide.tastingNotes && currentSlide.tastingNotes.length > 0)) && (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-cinzel tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{currentSlide.producerCode === 'TASTE' ? 'Step 3 • Aromatic Tiers' : 'Sommelier Palate Profile'}</span>
              </div>

              {currentSlide.hintsOf && (
                <div className="bg-[#141822]/85 border border-[#283244] rounded-lg p-3.5">
                  <p className="text-[10px] uppercase font-cinzel text-[#d4af37] tracking-wider mb-1 font-semibold">
                    {currentSlide.producerCode === 'TASTE' ? 'Sniffing Technique' : 'Hints Of'}
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

          {/* Food Pairings & Culinary Recommendations with clickable recipe links */}
          {(currentSlide.foodPairing || currentSlide.pairsWellWith) && (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-cinzel tracking-wider uppercase">
                <Utensils className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{currentSlide.producerCode === 'TASTE' ? 'Steps 4 & 5 • Palate & Pairing' : 'Sommelier Food Pairings'}</span>
              </div>

              {currentSlide.foodPairing && (
                <div className="bg-gradient-to-r from-[#191e2b]/95 to-[#131722]/95 border border-[#d4af37]/35 rounded-lg p-3.5 shadow-md">
                  <p className="text-[10px] uppercase font-cinzel text-[#fae8b4] font-semibold tracking-wider mb-1.5">
                    {currentSlide.producerCode === 'TASTE' ? 'Sip & Savor Technique' : 'Curated Dish & Recipes'}
                  </p>
                  <div className="text-xs text-gray-200 leading-relaxed font-sans-clean">
                    {renderFormattedText(currentSlide.foodPairing)}
                  </div>
                </div>
              )}

              {currentSlide.pairsWellWith && (
                <div className="bg-[#141822]/70 border border-[#232b3a] rounded-lg p-3">
                  <p className="text-[10px] uppercase font-cinzel text-gray-400 mb-1">
                    {currentSlide.producerCode === 'TASTE' ? 'Food & Wine Chemistry' : 'Pairs Well With'}
                  </p>
                  <p className="text-xs text-gray-300 font-sans-clean leading-snug">
                    {currentSlide.pairsWellWith}
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* Bottom Sticky Navigation Footer */}
      <footer className="p-4 sm:p-5 border-t border-[#1c222e] bg-[#0c0e13]/95 backdrop-blur-md space-y-2.5">
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
            className={`flex-1 py-2.5 px-3 rounded-lg font-cinzel text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 border transition-all duration-300 ${
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
            className={`flex-1 py-2.5 px-4 rounded-lg font-cinzel text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 border transition-all duration-300 ${
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
        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-mono pt-0.5">
          <span>Clicker:</span>
          <kbd className="px-1 py-0.2 rounded bg-[#181d28] border border-[#2d3648] text-gray-300">←/→</kbd>
          <span>Stops</span>
          <span>•</span>
          <kbd className="px-1 py-0.2 rounded bg-[#181d28] border border-[#2d3648] text-gray-300">1,2,3</kbd>
          <span>Tabs</span>
          <span>•</span>
          <kbd className="px-1 py-0.2 rounded bg-[#181d28] border border-[#2d3648] text-gray-300">V</kbd>
          <span>View</span>
        </div>
      </footer>
    </aside>
  );
};

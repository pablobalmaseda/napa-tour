import React from 'react';
import type { WineSlide } from '../data/slides';
import type { LayoutMode, PresentationTabId } from '../types/presentation';
import { WineryLogo } from './WineryLogo';
import { WineryCarousel } from './WineryCarousel';
import { cleanFoodPairingText } from '../utils/textUtils';
import { 
  ChevronLeft, 
  ChevronRight, 
  Wine, 
  Mountain, 
  Layers, 
  Sparkles, 
  MapPin,
  Utensils,
  BookOpen,
  Sun,
  User,
  Landmark
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

export const Sidebar: React.FC<SidebarProps> = ({
  slides,
  currentSlideIndex,
  onNext,
  onPrevious,
  activeTab = 'story',
  onTabChange
}) => {
  const currentSlide = slides[currentSlideIndex];
  const wineSlides = slides.filter(s => !s.isOverview);
  const totalWines = wineSlides.length;

  const isTasteSlide = currentSlide.producerCode === 'TASTE';
  const showWineReveal = !currentSlide.isOverview && (activeTab === 'palate' || activeTab === 'food');

  return (
    <aside className="w-full lg:w-[38%] xl:w-[35%] h-full flex flex-col justify-between bg-[#0e1015] border-r border-[#222733] text-gray-200 relative z-20 shadow-2xl overflow-hidden">
      {/* Background luxury watermarks and subtle glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-[#5a1827]/10 rounded-full blur-3xl pointer-events-none -ml-20" />

      {/* ============================================================ */}
      {/* ZERO-SCROLL TV TABBED PRESENTATION                           */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden px-5 pt-5 pb-3 space-y-3">
        {/* Top Title, Winery/Wine Progressive Reveal & Winemaker Pill */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <div className="flex items-center gap-2">
              {currentSlide.isOverview ? (
                <span className="text-[11px] font-cinzel font-semibold tracking-wider text-[#d4af37] uppercase">
                  {isTasteSlide ? "Sommelier Guide • The 5 S's" : 'Tasting Flight • Overview'}
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

          {/* Winery Name (always shown) + Wine Name (revealed on Palate/Pairing) + Winemaker Pill */}
          <div className="space-y-1.5">
            <h2 className="font-serif-luxury text-2xl sm:text-3xl text-white font-normal leading-tight tracking-tight">
              {currentSlide.wineryName || currentSlide.title}
            </h2>

            {/* Revealed Wine Name when clicking 2. Palate or 3. Pairing */}
            {showWineReveal && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-[#d4af37]/20 to-[#1a1f2b] border border-[#d4af37]/50 rounded-lg px-3 py-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <Wine className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <span className="font-cinzel text-xs sm:text-sm font-bold text-[#fae8b4] tracking-wide truncate">
                  {currentSlide.wineName || currentSlide.title}
                </span>
              </div>
            )}

            {/* Overview subtitle or Winemaker Pill underneath the Winery Name */}
            <div className="flex flex-wrap items-center gap-2">
              {currentSlide.winemaker ? (
                <div className="bg-[#141822]/90 border border-[#232b3a] rounded-lg px-2.5 py-1.5 inline-flex items-center gap-2">
                  <span className="text-[10px] uppercase font-cinzel text-gray-400 flex items-center gap-1 shrink-0">
                    <User className="w-3 h-3 text-[#d4af37]" />
                    Winemaker
                  </span>
                  <span className="text-xs text-gray-200 font-medium truncate">
                    {currentSlide.winemaker}
                  </span>
                </div>
              ) : (
                <div className="inline-block bg-[#141822]/90 border border-[#232b3a] rounded-lg px-2.5 py-1 text-xs font-cinzel text-[#fae8b4]">
                  {currentSlide.wineName || currentSlide.subtitle}
                </div>
              )}
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
            <span className="truncate">{isTasteSlide ? '1. See & Swirl' : '1. Terroir'}</span>
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
            <span className="truncate">{isTasteSlide ? '2. Sniff' : '2. Palate'}</span>
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
            <span className="truncate">{isTasteSlide ? '3. Sip & Savor' : '3. Pairing'}</span>
          </button>
        </div>

        {/* Tab Content Display Area (Zero-Scroll Pill Layout) */}
        <div className="flex-1 flex flex-col justify-start overflow-y-auto pr-0.5">
          {/* Tab 1: Terroir (Photo Carousel + Compact Pill Grid) */}
          {activeTab === 'story' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {isTasteSlide ? (
                <div className="bg-gradient-to-b from-[#161a24] to-[#0e1117] border border-[#d4af37]/30 rounded-xl p-5 flex items-center justify-center shadow-lg">
                  <WineryLogo producerCode={currentSlide.producerCode} className="h-16 w-auto" />
                </div>
              ) : (
                <WineryCarousel
                  slide={currentSlide}
                  heightClass="h-48 sm:h-56"
                  logoHeightClass="h-7"
                />
              )}

              {/* Compact Terroir Pills (Zero Cutoff) */}
              <div className="grid grid-cols-2 gap-2.5">
                {currentSlide.elevation && (
                  <div className="bg-[#141822]/90 border border-[#232b3a] rounded-lg p-2.5">
                    <p className="text-[10px] uppercase font-cinzel text-gray-400 flex items-center gap-1">
                      <Mountain className="w-3 h-3 text-[#d4af37] shrink-0" />
                      <span>{isTasteSlide ? 'Aroma Check' : 'Elevation'}</span>
                    </p>
                    <p className="text-xs text-gray-200 font-medium leading-snug mt-0.5">
                      {currentSlide.elevation}
                    </p>
                  </div>
                )}

                {currentSlide.soil && (
                  <div className="bg-[#141822]/90 border border-[#232b3a] rounded-lg p-2.5">
                    <p className="text-[10px] uppercase font-cinzel text-gray-400 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-[#d4af37] shrink-0" />
                      <span>{isTasteSlide ? 'Palate Check' : 'Soil Geology'}</span>
                    </p>
                    <p className="text-xs text-gray-200 font-medium leading-snug mt-0.5">
                      {currentSlide.soil}
                    </p>
                  </div>
                )}

                {currentSlide.estatePill && (
                  <div className="col-span-2 bg-[#141822]/90 border border-[#232b3a] rounded-lg p-2.5">
                    <p className="text-[10px] uppercase font-cinzel text-gray-400 flex items-center gap-1">
                      <Landmark className="w-3 h-3 text-[#d4af37] shrink-0" />
                      <span>{isTasteSlide ? 'Sequence' : 'Estate Highlight'}</span>
                    </p>
                    <p className="text-xs text-gray-200 font-medium leading-snug mt-0.5">
                      {currentSlide.estatePill}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Palate Profile (Compact Pills, Zero Scroll) */}
          {activeTab === 'palate' && (
            <div className="space-y-2 animate-in fade-in duration-200">
              {/* Full-Width Varietal & Aging Pill */}
              {!currentSlide.isOverview && (
                <div className="bg-[#141822]/90 border border-[#232b3a] rounded-lg p-2.5">
                  <p className="text-[10px] uppercase font-cinzel text-gray-400 flex items-center gap-1">
                    <Wine className="w-3 h-3 text-[#d4af37] shrink-0" />
                    <span>Varietal & Aging</span>
                  </p>
                  <p className="text-xs text-gray-200 font-medium mt-0.5 leading-snug">
                    {currentSlide.varietal || currentSlide.subtitle}
                  </p>
                </div>
              )}

              {/* Full-Width Vintage Climate Pill (moved from Terroir for full readability) */}
              {currentSlide.weatherPill && (
                <div className="bg-[#141822]/90 border border-[#232b3a] rounded-lg p-2.5">
                  <p className="text-[10px] uppercase font-cinzel text-gray-400 flex items-center gap-1">
                    <Sun className="w-3 h-3 text-[#d4af37] shrink-0" />
                    <span>{isTasteSlide ? 'Sight & Swirl' : 'Vintage Climate'}</span>
                  </p>
                  <p className="text-xs text-gray-200 font-medium mt-0.5 leading-snug">
                    {currentSlide.weatherPill}
                  </p>
                </div>
              )}

              {/* Tasting Note Pills in a compact 3-column pill grid */}
              {currentSlide.tastingNotes && currentSlide.tastingNotes.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase font-cinzel text-gray-400">
                    {isTasteSlide ? "The 5 S's Tasting Framework" : 'Key Palate & Aroma Notes'}
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {currentSlide.tastingNotes.slice(0, 6).map((note, i) => (
                      <div
                        key={i}
                        className="bg-[#141822]/90 border border-[#232b3a] rounded-lg px-2.5 py-2 flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3 h-3 text-[#d4af37] shrink-0" />
                        <span className="text-xs text-amber-100 font-medium truncate">{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Sommelier Summary Pill (No line-clamp cutoff) */}
              {currentSlide.hintsOf && (
                <div className="bg-[#141822]/90 border border-[#232b3a] rounded-lg p-2.5">
                  <p className="text-[10px] uppercase font-cinzel text-[#d4af37] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#d4af37] shrink-0" />
                    <span>{isTasteSlide ? 'Sommelier Technique' : 'Bouquet & Finish'}</span>
                  </p>
                  <p className="text-xs text-gray-200 font-serif italic leading-snug mt-0.5">
                    &ldquo;{currentSlide.hintsOf}&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Food Pairing (Compact Pills, Zero Scroll) */}
          {activeTab === 'food' && (
            <div className="space-y-2.5 animate-in fade-in duration-200">
              {currentSlide.foodPairing && (
                <div className="bg-[#141822]/90 border border-[#d4af37]/40 rounded-lg p-3">
                  <p className="text-[10px] uppercase font-cinzel text-[#fae8b4] flex items-center gap-1">
                    <Utensils className="w-3 h-3 text-[#d4af37] shrink-0" />
                    <span>{isTasteSlide ? 'Steps 4 & 5 • Sip & Savor' : "Tonight's Curated Pairing"}</span>
                  </p>
                  <p className="text-sm text-white font-medium mt-1 leading-snug">
                    {cleanFoodPairingText(currentSlide.foodPairing)}
                  </p>
                </div>
              )}

              {currentSlide.pairsWellWith && (
                <div className="bg-[#141822]/90 border border-[#232b3a] rounded-lg p-2.5">
                  <p className="text-[10px] uppercase font-cinzel text-gray-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#d4af37] shrink-0" />
                    <span>{isTasteSlide ? 'Food & Wine Chemistry' : 'Also Pairs Well With'}</span>
                  </p>
                  <p className="text-xs text-gray-200 font-medium mt-0.5 leading-snug">
                    {currentSlide.pairsWellWith}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sticky Navigation Footer (No Progress Bar & No Shortcut Hint Row) */}
      <footer className="px-5 py-3 border-t border-[#1c222e] bg-[#0c0e13]/95 backdrop-blur-md">
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
      </footer>
    </aside>
  );
};


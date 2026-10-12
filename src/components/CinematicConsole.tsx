import React from 'react';
import type { WineSlide } from '../data/slides';
import type { LayoutMode, PresentationTabId } from '../types/presentation';
import { WineryLogo } from './WineryLogo';
import { cleanFoodPairingText } from '../utils/textUtils';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Utensils, 
  BookOpen, 
  Mountain, 
  Layers, 
  MapPin,
  Monitor,
  LayoutGrid,
  Columns
} from 'lucide-react';

interface CinematicConsoleProps {
  slides: WineSlide[];
  currentSlideIndex: number;
  activeTab: PresentationTabId;
  onTabChange: (tab: PresentationTabId) => void;
  onNext: () => void;
  onPrevious: () => void;
  layoutMode: LayoutMode;
  onLayoutChange: (mode: LayoutMode) => void;
}

export const CinematicConsole: React.FC<CinematicConsoleProps> = ({
  slides,
  currentSlideIndex,
  activeTab,
  onTabChange,
  onNext,
  onPrevious,
  layoutMode,
  onLayoutChange
}) => {
  const currentSlide = slides[currentSlideIndex];
  const wineSlides = slides.filter(s => !s.isOverview);
  const totalWines = wineSlides.length;

  return (
    <div className="fixed bottom-4 left-6 right-6 z-30 pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
      <div className="relative bg-[#0b0e14]/94 backdrop-blur-2xl border border-[#d4af37]/35 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-5 text-gray-200 overflow-hidden">
        {/* Subtle background ambient gold glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row gap-5 items-stretch min-h-[220px]">
          {/* Left Column (Winery, Title, Badges) */}
          <div className="w-full lg:w-[32%] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#222938]/80 pb-4 lg:pb-0 lg:pr-5">
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {currentSlide.isOverview ? (
                    <span className="text-xs font-cinzel font-semibold tracking-wider text-[#d4af37] uppercase">
                      Overview
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

                <div className="flex items-center gap-1.5 text-xs text-amber-200/90 bg-[#1e2430]/90 border border-[#3b4457] rounded-full px-2.5 py-0.5">
                  <MapPin className="w-3 h-3 text-[#d4af37] shrink-0" />
                  <span className="truncate max-w-[170px]">{currentSlide.region}</span>
                </div>
              </div>

              {/* Wine Title */}
              <h2 className="font-serif-luxury text-2xl lg:text-3xl text-white font-normal leading-tight tracking-tight mb-1">
                {currentSlide.title}
              </h2>
              <div className="inline-block bg-[#161a24] border border-[#d4af37]/30 rounded-md px-2.5 py-0.5 text-xs font-cinzel text-[#fae8b4]">
                {currentSlide.subtitle}
              </div>
            </div>

            {/* Winery Logo Plaque */}
            <div className="mt-3 bg-[#11141c]/90 border border-[#2b3345] rounded-xl p-2.5 flex items-center justify-center">
              <WineryLogo producerCode={currentSlide.producerCode} className="h-10 w-auto" />
            </div>
          </div>

          {/* Right Column (Tab Navigation + Large TV Content + Controls) */}
          <div className="w-full lg:w-[68%] flex flex-col justify-between pl-0 lg:pl-2">
            {/* Top Bar: Tabs & View Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1c222e]">
              {/* Tab Switcher Buttons */}
              <div className="flex items-center gap-1.5 bg-[#141822] p-1 rounded-xl border border-[#252c3c]">
                <button
                  onClick={() => onTabChange('story')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-cinzel tracking-wider flex items-center gap-1.5 transition-all ${
                    activeTab === 'story'
                      ? 'bg-[#d4af37] text-[#0d0f12] font-bold shadow-md shadow-[#d4af37]/20'
                      : 'text-gray-400 hover:text-white hover:bg-[#1a202d]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>1. Story &amp; Terroir</span>
                </button>

                <button
                  onClick={() => onTabChange('palate')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-cinzel tracking-wider flex items-center gap-1.5 transition-all ${
                    activeTab === 'palate'
                      ? 'bg-[#d4af37] text-[#0d0f12] font-bold shadow-md shadow-[#d4af37]/20'
                      : 'text-gray-400 hover:text-white hover:bg-[#1a202d]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>2. Palate Profile</span>
                </button>

                <button
                  onClick={() => onTabChange('food')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-cinzel tracking-wider flex items-center gap-1.5 transition-all ${
                    activeTab === 'food'
                      ? 'bg-[#d4af37] text-[#0d0f12] font-bold shadow-md shadow-[#d4af37]/20'
                      : 'text-gray-400 hover:text-white hover:bg-[#1a202d]'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>3. Food Pairing</span>
                </button>
              </div>

              {/* View Mode Switcher Pill */}
              <div className="flex items-center gap-1 bg-[#141822] p-1 rounded-xl border border-[#252c3c]">
                <span className="text-[10px] uppercase font-cinzel text-gray-500 px-1.5 hidden sm:inline">View:</span>
                <button
                  onClick={() => onLayoutChange('v1-scroll')}
                  className={`p-1.5 rounded-lg text-xs transition-all flex items-center gap-1 ${
                    layoutMode === 'v1-scroll'
                      ? 'bg-[#2b3548] text-[#fae8b4] font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Classic Scrolling Sidebar (V1)"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-sans-clean hidden md:inline">Classic V1</span>
                </button>

                <button
                  onClick={() => onLayoutChange('v2-tabs')}
                  className={`p-1.5 rounded-lg text-xs transition-all flex items-center gap-1 ${
                    layoutMode === 'v2-tabs'
                      ? 'bg-[#2b3548] text-[#fae8b4] font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Zero-Scroll Tabbed Sidebar (TV Mode A)"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-sans-clean hidden md:inline">TV Tabs</span>
                </button>

                <button
                  onClick={() => onLayoutChange('v2-cinema')}
                  className={`p-1.5 rounded-lg text-xs transition-all flex items-center gap-1 ${
                    layoutMode === 'v2-cinema'
                      ? 'bg-[#d4af37] text-[#0d0f12] font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Cinematic Lower-Third (TV Mode B)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-sans-clean hidden md:inline">Cinematic TV</span>
                </button>
              </div>
            </div>

            {/* Middle: Tab Content (Zero-Scroll Large TV Readability) */}
            <div className="py-3 flex-1 flex flex-col justify-center">
              {/* Tab 1: Story & Terroir */}
              {activeTab === 'story' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <p className="text-gray-200 text-base sm:text-lg leading-relaxed font-sans-clean font-light tracking-wide line-clamp-3 lg:line-clamp-4">
                    {currentSlide.story}
                  </p>

                  <div className="flex flex-wrap gap-3 pt-1">
                    {currentSlide.elevation && (
                      <div className="inline-flex items-center gap-2 bg-[#161a24] border border-[#273042] px-3 py-1 rounded-lg text-xs text-gray-300">
                        <Mountain className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span className="font-cinzel text-[#fae8b4] uppercase text-[10px]">Elevation:</span>
                        <span>{currentSlide.elevation}</span>
                      </div>
                    )}
                    {currentSlide.soil && (
                      <div className="inline-flex items-center gap-2 bg-[#161a24] border border-[#273042] px-3 py-1 rounded-lg text-xs text-gray-300">
                        <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span className="font-cinzel text-[#fae8b4] uppercase text-[10px]">Soil:</span>
                        <span>{currentSlide.soil}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Palate Profile */}
              {activeTab === 'palate' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  {currentSlide.hintsOf && (
                    <div className="bg-[#141822]/90 border border-[#2b3345] rounded-xl p-3.5 shadow-inner">
                      <p className="text-[10px] uppercase font-cinzel text-[#d4af37] font-semibold tracking-widest mb-1">
                        Hints Of
                      </p>
                      <p className="text-amber-100/95 font-serif italic text-base sm:text-lg leading-snug">
                        &ldquo;{currentSlide.hintsOf}&rdquo;
                      </p>
                    </div>
                  )}

                  {currentSlide.tastingNotes && currentSlide.tastingNotes.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {currentSlide.tastingNotes.map((note, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-full text-xs sm:text-sm bg-[#1c2230] border border-[#374258] text-amber-200 font-sans-clean shadow-sm"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Food Pairing */}
              {activeTab === 'food' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  {currentSlide.foodPairing && (
                    <div className="bg-gradient-to-r from-[#1b1722]/90 to-[#141822]/90 border border-[#d4af37]/40 rounded-xl p-3.5 shadow-md">
                      <p className="text-[10px] uppercase font-cinzel text-[#fae8b4] font-semibold tracking-wider mb-1">
                        Curated Dish Pairing
                      </p>
                      <p className="text-white text-base sm:text-lg font-medium font-sans-clean leading-snug">
                        {cleanFoodPairingText(currentSlide.foodPairing)}
                      </p>
                    </div>
                  )}

                  {currentSlide.pairsWellWith && (
                    <div className="bg-[#141822]/80 border border-[#252c3c] rounded-xl p-3">
                      <p className="text-[10px] uppercase font-cinzel text-gray-400 mb-0.5">
                        Pairs Well With
                      </p>
                      <p className="text-gray-300 text-sm font-sans-clean leading-snug">
                        {currentSlide.pairsWellWith}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom: Stop Timeline Bar & Clicker Nav */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-[#1c222e]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">
                  Hotkeys: [← / → Stops] • [1, 2, 3 Tabs] • [V View Mode]
                </span>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onPrevious}
                  disabled={currentSlideIndex === 0}
                  className={`py-1.5 px-3 rounded-lg font-cinzel text-xs tracking-wider uppercase flex items-center gap-1 border transition-all ${
                    currentSlideIndex === 0
                      ? 'opacity-30 border-gray-800 text-gray-600 cursor-not-allowed'
                      : 'border-[#333c4d] bg-[#141822] text-gray-200 hover:border-[#d4af37] hover:text-[#d4af37]'
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                <button
                  onClick={onNext}
                  disabled={currentSlideIndex === slides.length - 1}
                  className={`py-1.5 px-4 rounded-lg font-cinzel text-xs tracking-wider uppercase flex items-center gap-1 border transition-all ${
                    currentSlideIndex === slides.length - 1
                      ? 'opacity-30 border-gray-800 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-gold text-[#0d0f12] font-bold border-[#fae8b4] shadow-md shadow-[#d4af37]/20 hover:brightness-110'
                  }`}
                >
                  <span>{currentSlideIndex === 0 ? 'Begin Tasting' : 'Next'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

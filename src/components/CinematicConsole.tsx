import React, { useState } from 'react';
import type { WineSlide } from '../data/slides';
import type { LayoutMode, PresentationTabId } from '../types/presentation';
import { WineryLogo } from './WineryLogo';
import { WineryCarousel } from './WineryCarousel';
import { cleanFoodPairingText } from '../utils/textUtils';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin,
  Monitor,
  LayoutGrid,
  Columns,
  Sun,
  Sparkles,
  Utensils,
  BookOpen,
  X
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
  onNext,
  onPrevious,
  layoutMode,
  onLayoutChange
}) => {
  const currentSlide = slides[currentSlideIndex];
  const wineSlides = slides.filter(s => !s.isOverview);
  const totalWines = wineSlides.length;
  const [showFullStory, setShowFullStory] = useState(false);

  return (
    <>
      {/* Floating Glass Corner HUD (Only takes bottom-left ~480px, leaving 85%+ of screen for 3D map) */}
      <div className="fixed bottom-6 left-6 z-30 pointer-events-auto max-w-[500px] w-full animate-in slide-in-from-bottom-4 duration-300">
        <div className="relative bg-[#0b0e14]/94 backdrop-blur-2xl border border-[#d4af37]/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-4 text-gray-200 overflow-hidden">
          {/* Subtle gold ambient glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4af37]/8 rounded-full blur-2xl pointer-events-none" />

          {/* Top Row: Progress + Region + View Mode Switcher */}
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#1c222e]">
            <div className="flex items-center gap-2">
              {currentSlide.isOverview ? (
                <span className="text-xs font-cinzel font-semibold tracking-wider text-[#d4af37] uppercase">
                  {currentSlide.producerCode === 'TASTE' ? "The 5 S's Guide" : 'Overview'}
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

              <div className="flex items-center gap-1 text-[11px] text-amber-200/90 bg-[#1e2430]/90 border border-[#3b4457] rounded-full px-2 py-0.5">
                <MapPin className="w-3 h-3 text-[#d4af37] shrink-0" />
                <span className="truncate max-w-[130px]">{currentSlide.region}</span>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-0.5 bg-[#141822] p-0.5 rounded-lg border border-[#273042]">
              <button
                onClick={() => onLayoutChange('v1-scroll')}
                className={`p-1 rounded text-xs transition-all ${
                  layoutMode === 'v1-scroll' ? 'bg-[#2b3548] text-[#fae8b4]' : 'text-gray-400 hover:text-white'
                }`}
                title="Classic Scrolling Sidebar (V1)"
              >
                <Columns className="w-3 h-3" />
              </button>
              <button
                onClick={() => onLayoutChange('v2-tabs')}
                className={`p-1 rounded text-xs transition-all ${
                  layoutMode === 'v2-tabs' ? 'bg-[#d4af37] text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
                title="TV Tabbed Sidebar (Mode A)"
              >
                <LayoutGrid className="w-3 h-3" />
              </button>
              <button
                onClick={() => onLayoutChange('v2-cinema')}
                className={`p-1 rounded text-xs transition-all ${
                  layoutMode === 'v2-cinema' ? 'bg-[#d4af37] text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
                title="Cinematic Map HUD (Mode B)"
              >
                <Monitor className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Middle: Title, Winery Photo Thumbnail & Winery Logo */}
          <div className="py-2.5 flex items-center justify-between gap-3">
            {currentSlide.producerCode !== 'TASTE' && (
              <div
                onClick={() => setShowFullStory(true)}
                className="w-16 h-12 rounded-lg overflow-hidden border border-[#d4af37]/40 shrink-0 cursor-pointer group relative"
                title="Click to view estate photo & full story"
              >
                <img
                  src={currentSlide.imageUrl}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h2 className="font-serif-luxury text-xl sm:text-2xl text-white font-normal leading-tight tracking-tight truncate">
                {currentSlide.title}
              </h2>
              <p className="text-xs font-cinzel text-[#fae8b4] tracking-wide mt-0.5">
                {currentSlide.subtitle}
              </p>
            </div>
            <div className="bg-[#121620] border border-[#2b3345] rounded-lg px-2 py-1 shrink-0">
              <WineryLogo producerCode={currentSlide.producerCode} className="h-7 w-auto" />
            </div>
          </div>

          {/* Vintage Weather Highlight */}
          {currentSlide.vintageWeather && (
            <div className="bg-[#141822]/90 border border-[#d4af37]/30 rounded-lg p-2.5 mb-2.5">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-cinzel text-[#fae8b4] font-semibold tracking-wider mb-1">
                <Sun className="w-3 h-3 text-[#d4af37]" />
                <span>{currentSlide.producerCode === 'TASTE' ? 'Steps 1 & 2 • See & Swirl' : 'Vintage Growing Season'}</span>
              </div>
              <p className="text-xs text-gray-200 font-sans-clean leading-snug line-clamp-2">
                {currentSlide.vintageWeather}
              </p>
            </div>
          )}

          {/* Palate Notes & Curated Pairing */}
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            {/* Hints of */}
            <div className="bg-[#131722]/80 border border-[#232a3a] rounded-lg p-2 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-[10px] uppercase font-cinzel text-gray-400 mb-0.5">
                <Sparkles className="w-2.5 h-2.5 text-[#d4af37]" />
                <span>{currentSlide.producerCode === 'TASTE' ? "The 5 S's" : 'Tasting Notes'}</span>
              </div>
              <p className="text-gray-200 text-[11px] leading-tight font-sans-clean truncate">
                {currentSlide.tastingNotes ? currentSlide.tastingNotes.slice(0, 3).join(', ') : 'Estate Profile'}
              </p>
            </div>

            {/* Food Pairing */}
            <div className="bg-[#131722]/80 border border-[#232a3a] rounded-lg p-2 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-[10px] uppercase font-cinzel text-gray-400 mb-0.5">
                <Utensils className="w-2.5 h-2.5 text-[#d4af37]" />
                <span>{currentSlide.producerCode === 'TASTE' ? 'Sip & Savor' : 'Food Pairing'}</span>
              </div>
              <p className="text-[#fae8b4] text-[11px] font-medium leading-tight font-sans-clean truncate">
                {cleanFoodPairingText(currentSlide.foodPairing) || 'Sommelier Selection'}
              </p>
            </div>
          </div>

          {/* Bottom Bar: Read Full Story button + Prev/Next Controls */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#1c222e]">
            <button
              onClick={() => setShowFullStory(true)}
              className="text-[11px] font-cinzel text-[#d4af37] hover:text-[#fae8b4] flex items-center gap-1 transition-colors"
            >
              <BookOpen className="w-3 h-3" />
              <span>{currentSlide.producerCode === 'TASTE' ? 'Full 5 S Guide' : 'Estate Photo & Story'}</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onPrevious}
                disabled={currentSlideIndex === 0}
                className={`p-1.5 rounded-lg border transition-all ${
                  currentSlideIndex === 0
                    ? 'opacity-30 border-gray-800 text-gray-600 cursor-not-allowed'
                    : 'border-[#333c4d] bg-[#141822] text-gray-200 hover:border-[#d4af37] hover:text-[#d4af37]'
                }`}
                title="Previous Stop"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onNext}
                disabled={currentSlideIndex === slides.length - 1}
                className={`py-1 px-3 rounded-lg font-cinzel text-xs uppercase flex items-center gap-1 border transition-all ${
                  currentSlideIndex === slides.length - 1
                    ? 'opacity-30 border-gray-800 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-gold text-[#0d0f12] font-bold border-[#fae8b4] shadow-md shadow-[#d4af37]/20 hover:brightness-110'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Winemaker Story Modal (Fades in over map when requested) */}
      {showFullStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative bg-[#0e1119] border border-[#d4af37]/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl text-gray-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowFullStory(false)}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-lg bg-[#181d28] border border-[#2b3548] text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <WineryLogo producerCode={currentSlide.producerCode} className="h-10 w-auto" />
              <div>
                <h3 className="font-serif-luxury text-2xl text-white">{currentSlide.title}</h3>
                <p className="text-xs font-cinzel text-[#fae8b4]">{currentSlide.subtitle} • {currentSlide.region}</p>
              </div>
            </div>

            {currentSlide.producerCode !== 'TASTE' && (
              <WineryCarousel
                slide={currentSlide}
                heightClass="h-56"
                logoHeightClass="h-8"
              />
            )}

            {currentSlide.vintageWeather && (
              <div className="bg-[#141822] border border-[#d4af37]/30 rounded-xl p-3.5">
                <p className="text-[10px] uppercase font-cinzel text-[#fae8b4] font-semibold mb-1 flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-[#d4af37]" />
                  Vintage Climate &amp; Weather Report
                </p>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans-clean">
                  {currentSlide.vintageWeather}
                </p>
              </div>
            )}

            <div className="bg-[#12151e] border-l-2 border-[#d4af37] rounded-r-xl p-4">
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-sans-clean">
                {currentSlide.story}
              </p>
            </div>

            {currentSlide.hintsOf && (
              <div className="bg-[#141822]/90 border border-[#283244] rounded-xl p-3.5">
                <p className="text-[10px] uppercase font-cinzel text-[#d4af37] font-semibold mb-1">
                  Sommelier Hints Of
                </p>
                <p className="text-amber-100 font-serif italic text-sm leading-relaxed">
                  &ldquo;{currentSlide.hintsOf}&rdquo;
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowFullStory(false)}
                className="px-4 py-2 rounded-lg bg-[#181d28] border border-[#2b3548] text-xs font-cinzel text-gray-300 hover:text-white"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

import React, { useState, useEffect } from 'react';
import { slides } from './data/slides';
import { Sidebar } from './components/Sidebar';
import { WineMap } from './components/WineMap';
import { CinematicConsole } from './components/CinematicConsole';
import { PairingModal } from './components/PairingModal';
import { usePresentationSync } from './hooks/usePresentationSync';
import type { LayoutMode } from './types/presentation';
import { ListOrdered, QrCode } from 'lucide-react';

export const App: React.FC = () => {
  const {
    currentSlideIndex,
    goToSlide,
    nextSlide,
    prevSlide,
    activeTab,
    setActiveTab,
    isConnected,
    clientsCount
  } = usePresentationSync(0, slides.length);

  const [isPairingOpen, setIsPairingOpen] = useState(false);
  const [showCinemaRoute, setShowCinemaRoute] = useState(false);

  // Layout mode: locked to 'v2-tabs' (TV Tabbed Sidebar) per user preference
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('v2-tabs');

  const handleLayoutChange = (mode: LayoutMode) => {
    setLayoutMode(mode);
  };

  // Global Keyboard Navigation (Clickers, Space, Arrows, 1/2/3 Tabs, V for View mode)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key.toLowerCase();

      // Next stop
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      }
      // Previous stop
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      }
      // Switch to Tab 1 (Story & Terroir)
      else if (e.key === '1') {
        e.preventDefault();
        setActiveTab('story');
      }
      // Switch to Tab 2 (Palate Profile)
      else if (e.key === '2') {
        e.preventDefault();
        setActiveTab('palate');
      }
      // Switch to Tab 3 (Food Pairing)
      else if (e.key === '3') {
        e.preventDefault();
        setActiveTab('food');
      }
      // Up arrow: Previous sub-tab
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveTab((prev) => (prev === 'food' ? 'palate' : 'story'));
      }
      // Down arrow: Next sub-tab
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveTab((prev) => (prev === 'story' ? 'palate' : 'food'));
      }
      // 'V' key: Cycle through layout modes
      else if (key === 'v') {
        e.preventDefault();
        setLayoutMode((prev) => {
          const next: LayoutMode =
            prev === 'v1-scroll' ? 'v2-tabs' : prev === 'v2-tabs' ? 'v2-cinema' : 'v1-scroll';
          localStorage.setItem('napa_layout_mode', next);
          return next;
        });
      }
      // 'R' key: Remote pairing modal
      else if (key === 'r') {
        e.preventDefault();
        setIsPairingOpen((prev) => !prev);
      }
      // Escape
      else if (e.key === 'Escape') {
        setIsPairingOpen(false);
        setShowCinemaRoute(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, setActiveTab]);

  return (
    <div className="w-screen h-screen flex flex-col lg:flex-row bg-[#0a0c10] text-[#e8e6e3] overflow-hidden select-none relative">
      {/* ============================================================ */}
      {/* MODE 1 & 2: SIDEBAR PRESENTATION MODES (V1-SCROLL or V2-TABS) */}
      {/* ============================================================ */}
      {layoutMode !== 'v2-cinema' ? (
        <>
          {/* Left Panel: Sidebar (Classic Scroll or TV Tabbed) */}
          <Sidebar
            slides={slides}
            currentSlideIndex={currentSlideIndex}
            onNext={nextSlide}
            onPrevious={prevSlide}
            onSelectSlide={goToSlide}
            onOpenPairing={() => setIsPairingOpen(true)}
            clientsCount={clientsCount}
            isConnected={isConnected}
            layoutMode={layoutMode}
            onLayoutChange={handleLayoutChange}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Right Panel: Interactive 3D Map */}
          <div className="w-full lg:w-[62%] xl:w-[65%] h-[50vh] lg:h-full relative overflow-hidden">
            <WineMap
              slides={slides}
              currentSlideIndex={currentSlideIndex}
              onSelectSlide={goToSlide}
            />
          </div>
        </>
      ) : (
        /* ============================================================ */
        /* MODE 3: CINEMATIC LOWER-THIRD (100% FULLSCREEN 3D MAP)       */
        /* ============================================================ */
        <div className="w-full h-full relative overflow-hidden">
          {/* Full-bleed Map */}
          <WineMap
            slides={slides}
            currentSlideIndex={currentSlideIndex}
            onSelectSlide={goToSlide}
          />

          {/* Top-Right Floating Controls in Cinema Mode */}
          <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
            <button
              onClick={() => setIsPairingOpen(true)}
              className="p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all bg-[#0e1118]/90 backdrop-blur-md border border-[#2b3342] text-gray-300 hover:border-[#d4af37]/60 shadow-2xl"
              title="Pair Mobile Remote"
            >
              <QrCode className="w-3.5 h-3.5 text-[#d4af37]" />
            </button>

            <button
              onClick={() => setShowCinemaRoute(!showCinemaRoute)}
              className="px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all bg-[#0e1118]/90 backdrop-blur-md border border-[#2b3342] text-gray-300 hover:border-[#d4af37]/60 shadow-2xl"
              title="View Flight Route"
            >
              <ListOrdered className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="font-sans-clean font-medium">Route</span>
            </button>
          </div>

          {/* Cinema Route Drawer Dropdown */}
          {showCinemaRoute && (
            <div className="fixed top-16 right-4 w-80 bg-[#12161f]/95 backdrop-blur-xl border border-[#2d3648] p-3 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-[10px] font-cinzel text-[#d4af37] uppercase tracking-wider">Flight Stops</span>
                <span className="text-[10px] text-gray-400 font-mono">{slides.length - 1} Tasting Flights</span>
              </div>
              <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      goToSlide(idx);
                      setShowCinemaRoute(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                      idx === currentSlideIndex
                        ? 'bg-[#212837] text-[#fae8b4] border border-[#d4af37]/40 font-medium'
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

          {/* Floating Lower-Third Console */}
          <CinematicConsole
            slides={slides}
            currentSlideIndex={currentSlideIndex}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onNext={nextSlide}
            onPrevious={prevSlide}
            layoutMode={layoutMode}
            onLayoutChange={handleLayoutChange}
          />
        </div>
      )}

      {/* Pairing & QR Code Modal */}
      <PairingModal
        isOpen={isPairingOpen}
        onClose={() => setIsPairingOpen(false)}
        clientsCount={clientsCount}
        isConnected={isConnected}
      />
    </div>
  );
};

export default App;

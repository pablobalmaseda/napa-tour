import React, { useState, useEffect } from 'react';
import { slides } from './data/slides';
import { Sidebar } from './components/Sidebar';
import { WineMap } from './components/WineMap';
import { PairingModal } from './components/PairingModal';
import { usePresentationSync } from './hooks/usePresentationSync';

export const App: React.FC = () => {
  const {
    currentSlideIndex,
    goToSlide,
    nextSlide,
    prevSlide,
    isConnected,
    clientsCount
  } = usePresentationSync(0, slides.length);

  const [isPairingOpen, setIsPairingOpen] = useState(false);

  // Global Keyboard Navigation (ArrowLeft, ArrowRight, Space, 'r' for remote)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        setIsPairingOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsPairingOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <div className="w-screen h-screen flex flex-col lg:flex-row bg-[#0a0c10] text-[#e8e6e3] overflow-hidden select-none">
      {/* Left Panel: 35% Width (Responsive height/width on mobile) */}
      <Sidebar
        slides={slides}
        currentSlideIndex={currentSlideIndex}
        onNext={nextSlide}
        onPrevious={prevSlide}
        onSelectSlide={goToSlide}
        onOpenPairing={() => setIsPairingOpen(true)}
        clientsCount={clientsCount}
        isConnected={isConnected}
      />

      {/* Right Panel: 65% Width */}
      <div className="w-full lg:w-[65%] h-[50vh] lg:h-full relative overflow-hidden">
        <WineMap
          slides={slides}
          currentSlideIndex={currentSlideIndex}
          onSelectSlide={goToSlide}
        />
      </div>

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

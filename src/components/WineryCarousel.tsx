import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { WineSlide } from '../data/slides';
import { WineryLogo } from './WineryLogo';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

interface WineryCarouselProps {
  slide: WineSlide;
  heightClass?: string;
  logoHeightClass?: string;
}

export const WineryCarousel: React.FC<WineryCarouselProps> = ({
  slide,
  heightClass = 'h-32 sm:h-36',
  logoHeightClass = 'h-7'
}) => {
  const photos =
    slide.gallery && slide.gallery.length > 0
      ? slide.gallery
      : [{ url: slide.imageUrl, caption: slide.imageCaption }];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Reset carousel to first photo when slide changes
  useEffect(() => {
    setActiveIndex(0);
    setIsLightboxOpen(false);
  }, [slide.id]);

  // Gentle auto-advance every 5.5 seconds unless hovered or in lightbox
  useEffect(() => {
    if (photos.length <= 1 || isHovered || isLightboxOpen) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photos.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [photos.length, isHovered, isLightboxOpen, slide.id]);

  const notifyRemotePhotoState = (nextIdx: number, nextLightbox: boolean) => {
    window.dispatchEvent(
      new CustomEvent('wine-photo-local-change', {
        detail: { photoIndex: nextIdx, isLightboxOpen: nextLightbox }
      })
    );
  };

  // Listen for remote photo commands coming from the mobile phone companion
  useEffect(() => {
    const handleRemotePhotoSync = (e: Event) => {
      const detail = (e as CustomEvent<{ photoIndex: number; isLightboxOpen: boolean }>).detail;
      if (!detail) return;
      if (typeof detail.photoIndex === 'number') {
        setActiveIndex(((detail.photoIndex % photos.length) + photos.length) % photos.length);
      }
      if (typeof detail.isLightboxOpen === 'boolean') {
        setIsLightboxOpen(detail.isLightboxOpen);
      }
    };

    window.addEventListener('wine-photo-sync', handleRemotePhotoSync);
    return () => window.removeEventListener('wine-photo-sync', handleRemotePhotoSync);
  }, [photos.length]);

  // Keyboard navigation when full-screen lightbox is open (intercepts before App slide navigation)
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleLightboxKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        e.stopImmediatePropagation();
        setActiveIndex((prev) => {
          const next = (prev + 1) % photos.length;
          notifyRemotePhotoState(next, true);
          return next;
        });
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        e.stopImmediatePropagation();
        setActiveIndex((prev) => {
          const next = (prev - 1 + photos.length) % photos.length;
          notifyRemotePhotoState(next, true);
          return next;
        });
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        setIsLightboxOpen(false);
        notifyRemotePhotoState(activeIndex, false);
      } else if (['1', '2', '3'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < photos.length) {
          e.preventDefault();
          e.stopImmediatePropagation();
          setActiveIndex(idx);
          notifyRemotePhotoState(idx, true);
        }
      }
    };

    window.addEventListener('keydown', handleLightboxKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleLightboxKeyDown, { capture: true });
  }, [isLightboxOpen, photos.length, activeIndex]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => {
      const next = (prev - 1 + photos.length) % photos.length;
      notifyRemotePhotoState(next, isLightboxOpen);
      return next;
    });
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => {
      const next = (prev + 1) % photos.length;
      notifyRemotePhotoState(next, isLightboxOpen);
      return next;
    });
  };

  const currentPhoto = photos[activeIndex] || photos[0];

  return (
    <>
      <div
        onClick={() => setIsLightboxOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative ${heightClass} w-full rounded-xl overflow-hidden border border-[#d4af37]/40 shadow-lg cursor-pointer bg-[#121620] select-none`}
        title="Click to enlarge winery photo gallery"
      >
        {/* Crossfading / Zooming Slides */}
        {photos.map((photo, idx) => (
          <img
            key={photo.url}
            src={photo.url}
            alt={`${slide.title} - ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ${
              idx === activeIndex
                ? 'opacity-100 scale-100 group-hover:scale-105'
                : 'opacity-0 scale-105 pointer-events-none'
            }`}
          />
        ))}

        {/* Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/25 to-transparent pointer-events-none" />

        {/* Top-Left Winery Crest Badge */}
        <div className="absolute top-2 left-2 z-10 bg-[#0e1118]/85 backdrop-blur-md border border-[#d4af37]/40 rounded-lg px-2.5 py-1 shadow-md pointer-events-none">
          <WineryLogo producerCode={slide.producerCode} className={`${logoHeightClass} w-auto`} />
        </div>

        {/* Top-Right Photo Counter + Expand Button */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5">
          {photos.length > 1 && (
            <span className="px-2 py-0.5 rounded-md bg-[#0e1118]/85 backdrop-blur-md border border-white/15 text-[10px] font-mono text-[#fae8b4]">
              {activeIndex + 1}/{photos.length}
            </span>
          )}
          <div className="p-1.5 rounded-lg bg-[#0e1118]/85 backdrop-blur-md border border-white/15 text-gray-200 group-hover:text-[#d4af37] group-hover:border-[#d4af37]/50 transition-colors">
            <Maximize2 className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Left / Right Carousel Arrows */}
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-[#0e1118]/80 backdrop-blur-md border border-[#d4af37]/40 text-[#fae8b4] hover:bg-[#d4af37] hover:text-black transition-all opacity-85 group-hover:opacity-100 shadow-lg"
              title="Previous photo"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-[#0e1118]/80 backdrop-blur-md border border-[#d4af37]/40 text-[#fae8b4] hover:bg-[#d4af37] hover:text-black transition-all opacity-85 group-hover:opacity-100 shadow-lg"
              title="Next photo"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {/* Bottom Caption & Dot Indicators */}
        <div className="absolute bottom-2 left-2.5 right-2.5 z-10 flex items-center justify-between gap-2">
          <p className="text-[11px] text-[#fae8b4] font-sans-clean font-medium truncate drop-shadow">
            {currentPhoto.caption}
          </p>

          {photos.length > 1 && (
            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
              {photos.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeIndex
                      ? 'w-4 bg-[#d4af37]'
                      : 'w-1.5 bg-white/40 hover:bg-white/75'
                  }`}
                  title={`Photo ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen TV Lightbox Carousel (Rendered in Portal over entire screen) */}
      {isLightboxOpen &&
        createPortal(
          <div
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-200 select-none"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-[#0e1118] border border-[#d4af37]/50 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/75 border border-white/20 text-gray-200 hover:text-[#d4af37] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Main Full-Resolution Image Stage */}
              <div className="relative h-[68vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={currentPhoto.url}
                  alt={currentPhoto.caption}
                  className="w-full h-full object-contain"
                />

                {photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#0e1118]/85 border border-[#d4af37]/50 text-[#fae8b4] hover:bg-[#d4af37] hover:text-black transition-all shadow-2xl"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#0e1118]/85 border border-[#d4af37]/50 text-[#fae8b4] hover:bg-[#d4af37] hover:text-black transition-all shadow-2xl"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Bottom Caption & Thumbnail Strip */}
              <div className="p-4 bg-[#0e1118] border-t border-[#222836] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <WineryLogo producerCode={slide.producerCode} className="h-9 w-auto shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-serif-luxury text-lg text-white truncate">
                      {slide.title} <span className="text-xs font-mono text-[#d4af37] ml-1">({activeIndex + 1}/{photos.length})</span>
                    </h3>
                    <p className="text-xs text-[#fae8b4] font-sans-clean truncate">
                      {currentPhoto.caption}
                    </p>
                  </div>
                </div>

                {/* Clickable Thumbnail Strip */}
                {photos.length > 1 && (
                  <div className="flex items-center gap-2">
                    {photos.map((photo, idx) => (
                      <button
                        key={photo.url}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className={`w-16 h-11 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === activeIndex
                            ? 'border-[#d4af37] scale-105 shadow-md'
                            : 'border-transparent opacity-50 hover:opacity-90'
                        }`}
                      >
                        <img src={photo.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

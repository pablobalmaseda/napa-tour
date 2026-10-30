import React, { useState, useEffect, useRef } from 'react';
import { slides } from '../data/slides';
import { usePresentationSync } from '../hooks/usePresentationSync';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Wine, 
  Sparkles, 
  Clock, 
  RotateCcw, 
  Play, 
  Pause, 
  ListOrdered, 
  X,
  Utensils,
  Mountain,
  UserCheck,
  Maximize2,
  Monitor
} from 'lucide-react';

export const CompanionRemote: React.FC = () => {
  const { 
    currentSlideIndex, 
    goToSlide, 
    nextSlide, 
    prevSlide, 
    activeTab: tvTab,
    setActiveTab: setTvTab,
    photoIndex,
    isLightboxOpen,
    setPhotoState,
    nextPhoto,
    prevPhoto,
    toggleLightbox,
    isConnected, 
    clientsCount 
  } = usePresentationSync(0, slides.length);

  const [activeTab, setActiveTab] = useState<'points' | 'background'>('points');
  const [checkedPoints, setCheckedPoints] = useState<Record<string, boolean>>({});
  const [showDrawer, setShowDrawer] = useState(false);
  const [showTimerControls, setShowTimerControls] = useState(false);
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);

  // Presentation stopwatch timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Swipe detection refs
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Main scroll container ref
  const mainScrollRef = useRef<HTMLDivElement>(null);

  // Scroll to top and reset to talking points when slide changes
  useEffect(() => {
    mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveTab('points');
  }, [currentSlideIndex]);

  // WakeLock reference
  const wakeLockRef = useRef<any>(null);

  // Keep phone screen awake
  useEffect(() => {
    let released = false;

    async function requestWakeLock() {
      if ('wakeLock' in navigator) {
        try {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
          if (!released) {
            setIsWakeLockActive(true);
            wakeLockRef.current.addEventListener('release', () => {
              if (!released) setIsWakeLockActive(false);
            });
          }
        } catch {
          setIsWakeLockActive(false);
        }
      }
    }

    requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      released = true;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
      }
    };
  }, []);

  // Timer interval
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle checklist items (and auto-advance the 5 S's on the TV when on the TASTE slide)
  const toggleCheckPoint = (key: string, idx?: number) => {
    const slide = slides[currentSlideIndex];
    const willBeChecked = !checkedPoints[key];
    const nextChecked = {
      ...checkedPoints,
      [key]: willBeChecked
    };
    setCheckedPoints(nextChecked);

    if (slide?.producerCode === 'TASTE' && typeof idx === 'number') {
      const totalSteps = 5;
      let targetStep = idx;

      if (willBeChecked) {
        let foundNext = -1;
        for (let i = idx + 1; i < totalSteps; i++) {
          if (!nextChecked[`${slide.id}-tp-${i}`]) {
            foundNext = i;
            break;
          }
        }
        if (foundNext === -1) {
          for (let i = 0; i < totalSteps; i++) {
            if (!nextChecked[`${slide.id}-tp-${i}`]) {
              foundNext = i;
              break;
            }
          }
        }
        targetStep = foundNext !== -1 ? foundNext : Math.min(idx + 1, totalSteps - 1);
      } else {
        targetStep = idx;
      }

      setPhotoState(targetStep, false);
      const nextTvTab = targetStep <= 1 ? 'story' : targetStep === 2 ? 'palate' : 'food';
      if (tvTab !== nextTvTab) {
        setTvTab(nextTvTab);
      }
    }
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    if (isLightboxOpen) {
      // When full-screen photos are open, swiping left/right on the phone swipes photos on TV!
      if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
        if (diffX > 0) {
          nextPhoto();
        } else {
          prevPhoto();
        }
      }
    } else {
      // Otherwise, intentional horizontal swipe changes the wine stop
      if (Math.abs(diffX) > 80 && Math.abs(diffX) > Math.abs(diffY) * 2.5) {
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const currentSlide = slides[currentSlideIndex];
  const currentPhotos =
    currentSlide.gallery && currentSlide.gallery.length > 0
      ? currentSlide.gallery
      : [{ url: currentSlide.imageUrl, caption: currentSlide.imageCaption }];
  const activePhoto = currentPhotos[photoIndex] || currentPhotos[0];
  const nextSlideData = currentSlideIndex < slides.length - 1 ? slides[currentSlideIndex + 1] : null;
  const notes = currentSlide.speakerNotes;

  return (
    <div 
      className="w-full h-screen h-[100dvh] bg-[#0a0c10] text-[#e8e6e3] flex flex-col overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar: Connection, Timer, Navigation Tools */}
      <header className="shrink-0 bg-[#10131b]/95 backdrop-blur-md border-b border-[#222736] px-4 py-2.5 shadow-md z-20">
        <div className="flex items-center justify-between">
          {/* Status & Connection */}
          <div className="flex items-center gap-2">
            <div 
              className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-amber-400'}`}
              title={isConnected ? `Synced (${isWakeLockActive ? 'Screen Awake' : 'Normal'})` : 'Reconnecting...'}
            />
            <span className="text-xs font-mono text-gray-400">
              {isConnected ? `${clientsCount} Sync` : 'Offline'}
            </span>
          </div>

          {/* Tasting Stopwatch (Tap to expand pause/reset) */}
          <div className="flex items-center gap-1.5 bg-[#171b26] border border-white/10 px-2.5 py-1 rounded-full text-xs font-mono">
            <button
              onClick={() => setShowTimerControls(!showTimerControls)}
              className="flex items-center gap-1.5 text-gray-200 hover:text-[#d4af37] transition-colors"
              title="Tap to toggle timer controls"
            >
              <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="font-semibold">{formatTimer(timerSeconds)}</span>
            </button>
            {showTimerControls && (
              <div className="flex items-center gap-1.5 ml-1 pl-1.5 border-l border-white/15 animate-in fade-in">
                <button 
                  onClick={() => setIsTimerRunning(!isTimerRunning)} 
                  className="text-gray-400 hover:text-white"
                  title={isTimerRunning ? 'Pause' : 'Play'}
                >
                  {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-400" />}
                </button>
                <button 
                  onClick={() => { setTimerSeconds(0); setIsTimerRunning(true); }}
                  className="text-gray-400 hover:text-white"
                  title="Reset"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Flight Drawer Toggle */}
          <button
            onClick={() => setShowDrawer(true)}
            className="flex items-center gap-1.5 bg-[#1c2230] hover:bg-[#252c3f] border border-[#d4af37]/30 text-[#d4af37] px-3 py-1 rounded-lg text-xs font-medium"
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Flight</span>
          </button>
        </div>

        {/* Current Stop Subtitle */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[11px] text-gray-400 uppercase tracking-wider">
          <span>Stop {currentSlideIndex + 1} of {slides.length}</span>
          <span className="text-[#d4af37] font-semibold">
            {currentSlide.isOverview ? 'Flight Overview' : `Wine #${currentSlide.wineNumber || currentSlideIndex}`}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main 
        ref={mainScrollRef}
        className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 max-w-lg mx-auto w-full pb-8 touch-pan-y"
      >
        {/* Active Wine Title Card */}
        <div className="bg-[#141824] border border-[#262c3e] rounded-2xl p-4 shadow-lg mb-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-start justify-between gap-2 mb-1">
            <h1 className="font-cinzel text-lg font-bold text-[#f5eedc] leading-tight">
              {currentSlide.title}
            </h1>
            <span className="text-xs bg-[#d4af37]/20 text-[#d4af37] font-bold px-2 py-0.5 rounded-full shrink-0 font-mono">
              {currentSlide.producerCode}
            </span>
          </div>

          <p className="text-xs text-[#d4af37] font-medium mb-1.5">
            {currentSlide.subtitle}
          </p>

          {currentSlide.winemaker && (
            <div className="flex items-center gap-1.5 text-xs text-amber-200/90 font-medium mb-2">
              <UserCheck className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
              <span className="text-gray-400 text-[11px]">Winemaker:</span>
              <span className="text-gray-100 font-semibold">{currentSlide.winemaker}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-400 pt-2 border-t border-white/5">
            <span>📍 {currentSlide.region}</span>
            {currentSlide.elevation && <span>⛰️ {currentSlide.elevation}</span>}
          </div>
        </div>

        {/* Tab Navigation for Notes (2 Focused Categories) */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#12151e] rounded-xl border border-white/5 mb-3 text-xs font-medium text-center">
          <button
            onClick={() => setActiveTab('points')}
            className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'points' 
                ? 'bg-[#d4af37] text-black font-bold shadow' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Presenter Guide</span>
          </button>
          <button
            onClick={() => setActiveTab('background')}
            className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'background' 
                ? 'bg-[#d4af37] text-black font-bold shadow' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>Winery &amp; Terroir</span>
          </button>
        </div>

        {/* Tab Content Cards */}
        <div className="bg-[#141824] border border-[#262c3e] rounded-2xl p-4 shadow-lg min-h-[240px] space-y-4">
          {/* TAB 1: PRESENTER GUIDE (TALKING POINTS + SOMMELIER CUES) */}
          {activeTab === 'points' && (
            <div className="space-y-4">
              {/* Talking Points Checklist */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                  <span className="text-xs font-cinzel uppercase tracking-wider text-[#d4af37] font-semibold">
                    Key Talking Points
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {currentSlide.producerCode === 'TASTE'
                      ? 'Check off to advance 5 S’s on TV'
                      : 'Tap to check off'}
                  </span>
                </div>
                {notes?.talkingPoints?.map((point, idx) => {
                  const key = `${currentSlide.id}-tp-${idx}`;
                  const isChecked = !!checkedPoints[key];
                  const isActiveOnTv =
                    currentSlide.producerCode === 'TASTE' && photoIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCheckPoint(key, idx)}
                      className={`flex items-start gap-3 p-2.5 rounded-xl transition-all cursor-pointer ${
                        isChecked 
                          ? 'bg-emerald-950/20 border border-emerald-800/30 text-gray-400 line-through' 
                          : isActiveOnTv
                          ? 'bg-[#1f2538] border border-[#d4af37] text-white shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                          : 'bg-[#181c2b] border border-white/5 hover:border-white/10 text-gray-200'
                      }`}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        {isActiveOnTv && !isChecked && (
                          <span className="inline-block text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#d4af37] text-black mb-1">
                            Showing on TV
                          </span>
                        )}
                        <span className="text-xs leading-relaxed block">{point}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sommelier Tasting Cues */}
              {notes?.tastingCues && notes.tastingCues.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-xs font-cinzel uppercase tracking-wider text-[#fae8b4] font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Sommelier Tasting Cues</span>
                  </div>
                  <div className="space-y-2">
                    {notes.tastingCues.map((cue, idx) => (
                      <div 
                        key={idx} 
                        className="bg-[#181c2b] border border-white/5 p-2.5 rounded-xl text-xs leading-relaxed text-gray-200"
                      >
                        <p className="font-medium text-amber-200/90 text-[11px] mb-0.5">
                          Cue #{idx + 1}:
                        </p>
                        <p>{cue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pouring Guidance */}
              {notes?.pourNotes && (
                <div className="bg-amber-950/20 border border-amber-800/30 p-3 rounded-xl text-xs">
                  <span className="text-amber-300 font-semibold block mb-0.5">
                    Sommelier Pouring Note:
                  </span>
                  <p className="text-amber-100/90 leading-relaxed">{notes.pourNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WINERY & TERROIR (MAKER, TERROIR, PAIRING & LORE) */}
          {activeTab === 'background' && (
            <div className="space-y-3.5">
              {/* Winemaker Section */}
              <div className="bg-[#181c2b] border border-[#d4af37]/30 p-3.5 rounded-xl">
                <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold block mb-0.5">
                  {notes?.winemakerNotes?.role || 'Winemaker'}
                </span>
                <h3 className="font-serif-luxury text-base font-bold text-white mb-1.5">
                  {currentSlide.winemaker || notes?.winemakerNotes?.name}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed font-light">
                  {currentSlide.winemakerBio || notes?.winemakerNotes?.bio}
                </p>
                {notes?.winemakerNotes?.philosophy && (
                  <p className="text-xs text-[#fae8b4]/90 italic mt-2 pt-2 border-t border-white/5">
                    &ldquo;{notes.winemakerNotes.philosophy}&rdquo;
                  </p>
                )}
              </div>

              {/* Terroir & Elevation */}
              <div className="bg-[#181c2b] border border-white/5 p-3 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-cinzel uppercase tracking-wider text-[#d4af37] font-semibold">
                    Terroir &amp; Microclimate
                  </span>
                  <Mountain className="w-3.5 h-3.5 text-[#d4af37]" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#12151f] p-2 rounded-lg">
                    <span className="text-[10px] text-gray-400 block">Elevation</span>
                    <p className="text-[#fae8b4] font-medium">{currentSlide.elevation || notes?.terroirBreakdown?.elevation || 'Napa Valley'}</p>
                  </div>
                  <div className="bg-[#12151f] p-2 rounded-lg">
                    <span className="text-[10px] text-gray-400 block">Soil</span>
                    <p className="text-gray-200 font-medium truncate">{currentSlide.soil || 'Volcanic alluvium'}</p>
                  </div>
                </div>
                {notes?.terroirBreakdown?.topology && (
                  <p className="text-xs text-gray-300 leading-relaxed pt-1">
                    {notes.terroirBreakdown.topology}
                  </p>
                )}
                {(notes?.terroirBreakdown?.wineImpact || currentSlide.terroirImpact) && (
                  <div className="bg-gradient-to-r from-amber-950/25 to-[#191c28] border border-amber-600/30 p-2.5 rounded-lg">
                    <span className="text-[10px] font-cinzel uppercase tracking-wider text-[#fae8b4] font-bold block mb-1">
                      What This Does to the Wine:
                    </span>
                    <p className="text-xs text-amber-100/90 leading-relaxed">
                      {notes?.terroirBreakdown?.wineImpact || currentSlide.terroirImpact}
                    </p>
                  </div>
                )}
              </div>

              {/* Food Pairing */}
              {currentSlide.foodPairing && (
                <div className="bg-[#181c2b] border border-white/5 p-3 rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-[#d4af37] font-semibold mb-1">
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Tonight's Pairing:</span>
                  </div>
                  <p className="text-gray-200 leading-relaxed font-medium">{currentSlide.foodPairing}</p>
                  {currentSlide.pairsWellWith && (
                    <p className="text-[11px] text-gray-400 pt-1 border-t border-white/5">
                      Also pairs with: {currentSlide.pairsWellWith}
                    </p>
                  )}
                </div>
              )}

              {/* Winery Lore */}
              {notes?.funFacts && notes.funFacts.length > 0 && (
                <div className="bg-[#181c2b] border border-white/5 p-3 rounded-xl text-xs space-y-1.5">
                  <span className="text-[10px] font-cinzel uppercase tracking-wider text-[#d4af37] font-semibold block">
                    Did You Know?
                  </span>
                  {notes.funFacts.map((fact, idx) => (
                    <p key={idx} className="text-gray-300 leading-relaxed">
                      {fact}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Up Next Card (Informational) */}
        {nextSlideData && (
          <div className="mt-4 bg-[#11141d] border border-white/10 rounded-xl p-3 flex items-center justify-between">
            <div className="truncate mr-3">
              <span className="text-[10px] uppercase tracking-wider text-[#d4af37]/80 font-semibold block mb-0.5">
                Up Next in Flight
              </span>
              <p className="text-xs text-gray-200 font-medium truncate">
                {nextSlideData.title}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-mono text-gray-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">
                Stop #{currentSlideIndex + 2}
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Streamlined Single-Row Footer Navigation */}
      <footer className="shrink-0 bg-[#0e1118]/95 backdrop-blur-lg border-t border-[#232938] px-4 py-3 z-30 shadow-2xl">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-2.5">
          {/* Previous Button */}
          <button
            onClick={() => {
              setActiveTab('points');
              prevSlide();
            }}
            disabled={currentSlideIndex === 0}
            className="flex-1 py-3 px-3 bg-[#1a202d] hover:bg-[#232b3d] disabled:opacity-30 disabled:pointer-events-none border border-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-md"
          >
            <ChevronLeft className="w-5 h-5 text-[#d4af37]" />
            <span className="text-xs sm:text-sm">Previous</span>
          </button>

          {/* Center Column: Slide Counter + 1-Tap TV Tab Cycle Pill */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* TV Tab Cycle Pill (Tap to cycle: Terroir -> Palate -> Pairing) */}
            <button
              onClick={() => {
                const nextTab = tvTab === 'story' ? 'palate' : tvTab === 'palate' ? 'food' : 'story';
                setTvTab(nextTab);
              }}
              className="px-2.5 py-2.5 bg-[#141824] border border-[#d4af37]/40 rounded-xl text-center active:scale-95 transition-all flex flex-col items-center justify-center min-w-[72px]"
              title="Tap to cycle TV screen tab"
            >
              <div className="flex items-center gap-1">
                <Monitor className="w-3 h-3 text-[#d4af37]" />
                <span className="text-[10px] font-cinzel font-bold text-[#fae8b4] uppercase">
                  {tvTab === 'story' ? 'Terroir' : tvTab === 'palate' ? 'Palate' : 'Pairing'}
                </span>
              </div>
              <span className="text-[8px] text-gray-400 uppercase tracking-tighter">
                Tap for TV
              </span>
            </button>

            {/* Photo Lightbox Toggle on TV */}
            {currentSlide.producerCode !== 'TASTE' && (
              <button
                onClick={toggleLightbox}
                className={`p-2.5 rounded-xl border transition-all active:scale-95 flex items-center justify-center ${
                  isLightboxOpen 
                    ? 'bg-[#d4af37] text-black border-[#fae8b4]' 
                    : 'bg-[#141824] text-[#fae8b4] border-white/10'
                }`}
                title="Toggle Photo on TV"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => {
              setActiveTab('points');
              nextSlide();
            }}
            disabled={currentSlideIndex === slides.length - 1}
            className="flex-1 py-3 px-3 bg-gradient-to-r from-[#d4af37] to-[#b39129] hover:brightness-110 disabled:opacity-30 disabled:pointer-events-none text-black rounded-xl font-bold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-md"
          >
            <span className="text-xs sm:text-sm">Next Wine</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </footer>

      {/* Slide Flight Drawer Modal */}
      {showDrawer && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end p-2 animate-in fade-in"
          onClick={() => setShowDrawer(false)}
        >
          <div 
            className="bg-[#131722] border border-[#262c3e] rounded-2xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Wine className="w-4 h-4 text-[#d4af37]" />
                <h3 className="font-cinzel text-sm font-bold text-[#d4af37] uppercase tracking-wider">
                  Jump to Tasting Stop
                </h3>
              </div>
              <button 
                onClick={() => setShowDrawer(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 overflow-y-auto space-y-2">
              {slides.map((s, idx) => {
                const isSelected = idx === currentSlideIndex;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      goToSlide(idx);
                      setShowDrawer(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#d4af37]/15 border-[#d4af37] text-white shadow'
                        : 'bg-[#181c2a] border-white/5 hover:border-white/15 text-gray-300'
                    }`}
                  >
                    <div className="truncate mr-3">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-mono font-bold text-[#d4af37]">
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-semibold truncate text-[#f5eedc]">
                          {s.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 truncate">
                        {s.region}
                      </p>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] bg-[#d4af37] text-black font-bold px-2 py-0.5 rounded-full uppercase">
                        Current
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Photo Swipe Controller Modal (Opens on Phone & TV simultaneously) */}
      {isLightboxOpen && currentSlide.producerCode !== 'TASTE' && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 animate-in fade-in duration-150 select-none"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
                <span className="text-[10px] font-cinzel uppercase tracking-widest text-[#d4af37] font-bold">
                  Live on TV Screen • Photo {photoIndex + 1} of {currentPhotos.length}
                </span>
              </div>
              <h3 className="font-serif-luxury text-base text-white truncate mt-0.5">
                {currentSlide.title}
              </h3>
            </div>

            <button
              onClick={() => setPhotoState(photoIndex, false)}
              className="px-3 py-1.5 rounded-xl bg-[#1c2230] border border-[#d4af37]/50 text-[#fae8b4] text-xs font-bold flex items-center gap-1.5 active:scale-95 shrink-0"
            >
              <X className="w-4 h-4" />
              <span>Close TV Pic</span>
            </button>
          </div>

          {/* Center Swipeable Photo Preview & Caption */}
          <div className="flex-1 flex flex-col items-center justify-center my-3 overflow-hidden">
            <div className="relative w-full max-h-[48vh] rounded-2xl overflow-hidden border border-[#d4af37]/40 bg-[#0b0e14] shadow-2xl flex items-center justify-center">
              <img
                src={activePhoto.url}
                alt={activePhoto.caption}
                className="w-full h-full max-h-[48vh] object-contain"
                draggable={false}
              />
            </div>

            <p className="text-xs sm:text-sm text-[#fae8b4] font-sans-clean text-center mt-3 px-2 leading-snug">
              {activePhoto.caption}
            </p>

            {(activePhoto as any).phoneNotes && (
              <div className="mt-2.5 mx-2 p-2.5 rounded-xl bg-[#1c2232] border border-[#d4af37]/40 text-left shadow-lg">
                <span className="text-[10px] font-cinzel uppercase tracking-wider text-[#d4af37] font-bold block mb-1">
                  💡 Sommelier Talking Cue:
                </span>
                <p className="text-xs text-gray-200 leading-relaxed">
                  {(activePhoto as any).phoneNotes}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Thumbnails & Prev/Next Photo Controls */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            {/* 3 Thumbnails */}
            <div className="grid grid-cols-3 gap-2">
              {currentPhotos.map((photo, idx) => (
                <button
                  key={photo.url}
                  onClick={() => setPhotoState(idx, true)}
                  className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    idx === photoIndex
                      ? 'border-[#d4af37] scale-[1.02] shadow-lg'
                      : 'border-white/10 opacity-50'
                  }`}
                >
                  <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/75 text-[10px] font-mono text-[#fae8b4]">
                    #{idx + 1}
                  </span>
                </button>
              ))}
            </div>

            {/* Prev / Next Photo Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={prevPhoto}
                className="flex-1 py-3 px-4 rounded-xl bg-[#1a202d] border border-white/15 text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 text-[#d4af37]" />
                <span>Prev Pic</span>
              </button>
              <button
                onClick={nextPhoto}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b39129] text-black font-bold text-sm flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Next Pic</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

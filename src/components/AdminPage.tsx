import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Smartphone, Copy, Check, Wifi, ExternalLink, Tv, Wine, ArrowLeft } from 'lucide-react';
import { usePresentationSync } from '../hooks/usePresentationSync';
import { slides } from '../data/slides';

export const AdminPage: React.FC = () => {
  const {
    currentSlideIndex,
    goToSlide,
    activeTab,
    setActiveTab,
    isConnected,
    clientsCount
  } = usePresentationSync(0, slides.length);

  const [remoteUrl, setRemoteUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [detectedIp, setDetectedIp] = useState<string>('');

  useEffect(() => {
    const host = window.location.hostname;
    const isLocalHost = host === 'localhost' || host === '127.0.0.1';

    if (isLocalHost) {
      fetch('/api/remote-info')
        .then((res) => res.json())
        .then((data) => {
          if (data.remoteUrl) {
            setRemoteUrl(data.remoteUrl);
            setDetectedIp(data.ip);
          }
        })
        .catch(() => {
          setRemoteUrl(`${window.location.origin}/?view=remote`);
        });
    } else {
      setRemoteUrl(`${window.location.origin}/?view=remote`);
    }
  }, []);

  const displayUrl = remoteUrl || `${window.location.origin}/?view=remote`;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e8e6e3] font-sans-clean p-6 md:p-10 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#232b3a]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#d4af37]/30 to-[#8a1c1c]/40 border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] shadow-lg">
              <Wine className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-cinzel text-lg md:text-xl tracking-widest text-[#d4af37] uppercase font-bold">
                Napa Valley Tasting • Admin & QR Setup
              </h1>
              <p className="text-xs text-gray-400">
                Pair your phone remote & monitor live presentation sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="px-4 py-2 rounded-xl bg-[#161b26] hover:bg-[#1f2637] border border-[#2d3648] text-gray-200 text-xs font-medium flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#d4af37]" />
              <span>Back to TV Presentation</span>
            </a>
            <a
              href="/?view=remote"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e5c247] text-[#0a0c10] text-xs font-semibold flex items-center gap-2 transition-colors shadow-lg"
            >
              <Smartphone className="w-4 h-4" />
              <span>Open Speaker Remote</span>
            </a>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Card: QR Code Pairing */}
          <div className="bg-[#11141c] border border-[#d4af37]/30 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#1c2230] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-cinzel text-sm tracking-wider text-[#d4af37] uppercase font-bold">
                    Phone Remote QR Code
                  </h2>
                  <p className="text-xs text-gray-400">
                    Scan with your phone camera to control the TV
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-lg border border-gray-300 mx-auto w-fit mb-5">
                <QRCodeSVG
                  value={displayUrl}
                  size={220}
                  level="M"
                  marginSize={2}
                />
                <span className="text-xs font-mono text-gray-700 mt-2 font-semibold">
                  Scan to Launch Speaker Companion
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {/* Direct Link & Copy */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block mb-1.5">
                  Direct Remote URL:
                </label>
                <div className="flex items-center gap-2 bg-[#171b26] border border-white/10 rounded-lg p-2.5 font-mono text-xs">
                  <span className="truncate flex-1 text-[#d4af37]">
                    {displayUrl}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded transition-colors shrink-0 flex items-center gap-1"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Copy</span>
                      </>
                    )}
                  </button>
                  <a
                    href={displayUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors shrink-0"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {detectedIp && (
                <div className="text-[11px] text-gray-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                  Detected Local Wi-Fi IP: <code className="text-amber-300 font-mono">{detectedIp}</code> (Ensure phone is on the same Wi-Fi network)
                </div>
              )}
            </div>
          </div>

          {/* Right Card: Live TV State & Quick Controls */}
          <div className="bg-[#11141c] border border-[#232b3a] rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <Tv className="w-5 h-5 text-[#d4af37]" />
                  <h2 className="font-cinzel text-sm tracking-wider text-gray-200 uppercase font-bold">
                    Live Presentation Status
                  </h2>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#171b26] border border-white/10 text-xs">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <Wifi className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span className="font-mono text-gray-300">{clientsCount} connected</span>
                </div>
              </div>

              {/* Active Slide Box */}
              <div className="bg-[#161b26] border border-[#2b3344] rounded-xl p-4 mb-5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] block mb-1">
                  Currently Showing on TV (Stop {currentSlideIndex + 1} of {slides.length})
                </span>
                <div className="text-lg font-serif-luxury font-bold text-white">
                  {currentSlide.wineryName || currentSlide.title}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {currentSlide.wineName || currentSlide.subtitle}
                </div>

                {/* Active Tab Switcher */}
                {!currentSlide.isOverview && (
                  <div className="grid grid-cols-3 gap-1.5 mt-3 pt-3 border-t border-white/10">
                    {(['story', 'palate', 'food'] as const).map((tab, i) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                          activeTab === tab
                            ? 'bg-[#d4af37] text-[#0a0c10] font-bold'
                            : 'bg-[#0f131b] text-gray-400 hover:text-white'
                        }`}
                      >
                        {i + 1}. {tab === 'story' ? 'Terroir' : tab === 'palate' ? 'Palate' : 'Pairing'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Stop Selector */}
              <div>
                <span className="text-[11px] font-cinzel uppercase tracking-wider text-gray-400 block mb-2">
                  Jump to Tasting Stop:
                </span>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => goToSlide(idx)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                        idx === currentSlideIndex
                          ? 'bg-[#212837] text-[#fae8b4] border border-[#d4af37]/40 font-semibold'
                          : 'bg-[#151924] hover:bg-[#1a202d] text-gray-300'
                      }`}
                    >
                      <span className="truncate">
                        {s.isOverview ? '• ' : `Wine #${s.wineNumber}: `}
                        {s.wineryName || s.title}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono ml-2 shrink-0">{s.region}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

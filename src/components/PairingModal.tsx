import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, Copy, Check, Wifi, ExternalLink } from 'lucide-react';

interface PairingModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientsCount: number;
  isConnected: boolean;
}

export const PairingModal: React.FC<PairingModalProps> = ({
  isOpen,
  onClose,
  clientsCount,
  isConnected
}) => {
  const [remoteUrl, setRemoteUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [detectedIp, setDetectedIp] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    const host = window.location.hostname;
    const isLocalHost = host === 'localhost' || host === '127.0.0.1';

    if (isLocalHost) {
      // Fetch local network IP from Vite dev server so phone on Wi-Fi can reach laptop
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
      // On live hosted deployment (Vercel / GitHub / LAN IP), use origin with ?view=remote
      setRemoteUrl(`${window.location.origin}/?view=remote`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const displayUrl = remoteUrl || `${window.location.origin}/?view=remote`;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#11141c] border border-[#d4af37]/30 rounded-2xl shadow-2xl p-6 text-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#1c2230] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-inner">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-cinzel text-base tracking-wider text-[#d4af37] uppercase font-bold">
              Speaker Companion Remote
            </h2>
            <p className="text-xs text-gray-400">
              Control slides & view tasting notes from your phone
            </p>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center bg-white p-5 rounded-xl shadow-lg border border-gray-300 mx-auto w-fit mb-5">
          <QRCodeSVG
            value={displayUrl}
            size={200}
            level="M"
            marginSize={2}
          />
          <span className="text-[11px] font-mono text-gray-600 mt-2 font-medium">
            Scan with phone camera
          </span>
        </div>

        {/* Connection status bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#171b26] rounded-lg border border-white/5 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-gray-300">
              {isConnected ? 'Sync Engine Ready' : 'Connecting to Sync...'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 font-mono">
            <Wifi className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{clientsCount} {clientsCount === 1 ? 'client' : 'clients'} connected</span>
          </div>
        </div>

        {/* Direct Link & Copy */}
        <div className="space-y-2 mb-5">
          <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
            Or open on your mobile browser:
          </label>
          <div className="flex items-center gap-2 bg-[#171b26] border border-white/10 rounded-lg p-2 font-mono text-xs">
            <span className="truncate flex-1 text-[#d4af37]">
              {displayUrl}
            </span>
            <button
              onClick={handleCopy}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors shrink-0 flex items-center gap-1"
              title="Copy URL"
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
              title="Open in new window"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Notice / Instruction */}
        <div className="text-[11px] text-gray-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
          <p className="leading-relaxed">
            <strong className="text-amber-300">Tip:</strong> Make sure your phone is connected to the same Wi-Fi network as this laptop. If you are presenting on dual monitors on this machine, you can also open this link in a new tab!
          </p>
          {detectedIp && (
            <p className="text-[10px] text-gray-400 mt-1">
              Detected Laptop LAN IP: <code className="text-gray-300 font-mono">{detectedIp}</code>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Eye, Wind, Sparkles, Wine, Clock } from 'lucide-react';

interface TastingStep {
  number: string;
  id: 'see' | 'swirl' | 'sniff' | 'sip' | 'savor';
  title: string;
  subtitle: string;
  tagline: string;
  detail: string;
  proTip: string;
  highlights: { label: string; value: string; color: string }[];
}

const FIVE_S_STEPS: TastingStep[] = [
  {
    number: '01',
    id: 'see',
    title: 'SEE',
    subtitle: 'Color, Clarity & Legs',
    tagline: 'Tilt glass 45° over a bright background',
    detail:
      'Hold the glass by the stem so your hand does not warm the wine. Inspect the core and rim: white wines deepen from pale lemon to gold with oak and age, while red wines fade from electric purple-ruby (2023) to a brick-garnet rim (our 2016 AXR).',
    proTip: 'Slower, thicker "legs" (tears) signal higher alcohol or glycerol—not quality.',
    highlights: [
      { label: 'Young White', value: 'Pale Straw / Platinum', color: '#fef08a' },
      { label: 'Young Cab (2023)', value: 'Opaque Ruby-Purple', color: '#9f1239' },
      { label: 'Aged Cab (2016)', value: 'Garnet & Brick Rim', color: '#9a3412' }
    ]
  },
  {
    number: '02',
    id: 'swirl',
    title: 'SWIRL',
    subtitle: 'Oxygenate & Volatilize',
    tagline: 'Keep the base flat on the table & circle 5 sec',
    detail:
      'Swirling draws oxygen deep into the wine, breaking up tight phenolic bonds and gently evaporating ethanol so hundreds of volatile aromatic esters float up to the rim of the glass.',
    proTip: 'The "tabletop swirl" (index & thumb on the stem base) prevents spills and aerates evenly.',
    highlights: [
      { label: 'Sparkling', value: 'Gentle swirl preserves bubbles', color: '#fde68a' },
      { label: 'Young Reds', value: 'Generous swirl softens tannins', color: '#eab308' },
      { label: 'Aged 2016', value: 'Gentle swirl awakens earth', color: '#d97706' }
    ]
  },
  {
    number: '03',
    id: 'sniff',
    title: 'SNIFF',
    subtitle: 'The 3 Aromatic Tiers',
    tagline: 'Nose at the rim • Two quick, short inhales',
    detail:
      '80% of what we perceive as taste is actually smell. Take two quick sniffs instead of one long inhale so your nose stays sharp, then hunt for three distinct layers of aroma:',
    proTip: 'Also checks for cork taint (TCA), which smells like wet cardboard and mutes fruit.',
    highlights: [
      { label: '1. Primary (Grape)', value: 'Lemon, Peach, Blackberry, Herbs', color: '#4ade80' },
      { label: '2. Secondary (Cellar)', value: 'Brioche (Lees), Vanilla & Spice (Oak)', color: '#fbbf24' },
      { label: '3. Tertiary (Bottle Age)', value: 'Cedar, Black Tea, Truffle, Earth', color: '#f87171' }
    ]
  },
  {
    number: '04',
    id: 'sip',
    title: 'SIP',
    subtitle: 'Acid, Tannin & Body',
    tagline: 'Coat your whole palate & draw in a whisper of air',
    detail:
      'Roll the wine over your entire tongue and gently draw in a tiny breath of air ("the sommelier slurp") to send warm aromas up the back of your throat. Separate Acidity from Tannin:',
    proTip: 'Acid makes your mouth water; Tannin makes your gums feel dry and gripped.',
    highlights: [
      { label: 'Acidity (Sides of Tongue)', value: 'Mouthwatering salivation • Cuts fat', color: '#38bdf8' },
      { label: 'Tannin (Gums & Cheeks)', value: 'Velvety grip • Binds to beef protein', color: '#e11d48' },
      { label: 'Body (Mouthfeel)', value: 'Skim milk (Light) → Heavy cream (Full)', color: '#c084fc' }
    ]
  },
  {
    number: '05',
    id: 'savor',
    title: 'SAVOR',
    subtitle: 'Length, Balance & Finish',
    tagline: 'Count how many seconds the flavors linger',
    detail:
      'After swallowing, notice how the wine evolves. Do new notes of cocoa, espresso, or minerality emerge? When acid, fruit, oak, and tannin sit in harmony and persist for 45–60+ seconds, you are tasting benchmark Napa terroir.',
    proTip: 'Try a sip before food, then another sip right after a bite—watch how salt and fat transform the finish!',
    highlights: [
      { label: 'Everyday Wine', value: '5 – 10 sec finish', color: '#94a3b8' },
      { label: 'Premier Estate', value: '25 – 40 sec layered evolution', color: '#facc15' },
      { label: 'Napa Benchmark', value: '60+ sec seamless persistence', color: '#d4af37' }
    ]
  }
];

export const TastingSkyVisual: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const activeStep = FIVE_S_STEPS[selectedIdx];

  const renderStepIllustration = (stepId: TastingStep['id'], isLarge = false) => {
    const sizeClass = isLarge ? 'w-24 h-24' : 'w-12 h-12';
    switch (stepId) {
      case 'see':
        // Tilted wine glass at 45 degrees with color rim gradient
        return (
          <svg viewBox="0 0 100 100" className={sizeClass} fill="none">
            <defs>
              <linearGradient id="wineSeeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="45%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>
            </defs>
            {/* 45 deg angle reference arc */}
            <path d="M20 82 L80 82" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <path d="M68 82 A22 22 0 0 0 60 66" stroke="#fae8b4" strokeWidth="1.2" opacity="0.7" />
            <text x="73" y="75" fill="#fae8b4" fontSize="8" fontFamily="monospace">45°</text>
            {/* Tilted Glass Group */}
            <g transform="rotate(-32 50 52)">
              <path d="M34 18 H66 L62 46 C60 58 40 58 38 46 Z" stroke="#d4af37" strokeWidth="2" fill="rgba(212,175,55,0.05)" />
              <path d="M36 33 Q50 38 63 30 L62 46 C60 56 40 56 38 46 Z" fill="url(#wineSeeGrad)" opacity="0.9" />
              <line x1="50" y1="56" x2="50" y2="82" stroke="#d4af37" strokeWidth="2" />
              <line x1="36" y1="82" x2="64" y2="82" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" />
            </g>
          </svg>
        );

      case 'swirl':
        // Glass with orbital swirl rings and wine legs
        return (
          <svg viewBox="0 0 100 100" className={sizeClass} fill="none">
            {/* Orbital motion rings */}
            <ellipse cx="50" cy="40" rx="34" ry="11" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="4 3" className="animate-pulse" />
            <ellipse cx="50" cy="84" rx="22" ry="6" stroke="#fae8b4" strokeWidth="1.2" opacity="0.7" />
            {/* Glass */}
            <path d="M33 20 H67 L63 48 C61 60 39 60 37 48 Z" stroke="#d4af37" strokeWidth="2" />
            {/* Swirling vortex liquid */}
            <path d="M36 38 Q50 28 64 40 L63 48 C61 59 39 59 37 48 Z" fill="#9f1239" opacity="0.85" />
            {/* Wine legs/tears */}
            <path d="M43 32 V40 M50 30 V39 M57 32 V41" stroke="#fda4af" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="50" y1="58" x2="50" y2="84" stroke="#d4af37" strokeWidth="2" />
            <line x1="36" y1="84" x2="64" y2="84" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'sniff':
        // Glass with 3 rising aromatic wave tiers
        return (
          <svg viewBox="0 0 100 100" className={sizeClass} fill="none">
            {/* 3 Aroma Wave Tiers */}
            <path d="M38 32 Q44 24 38 16" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
            <path d="M50 30 Q56 20 50 10" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M62 32 Q68 24 62 16" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
            <circle cx="38" cy="12" r="2" fill="#4ade80" />
            <circle cx="50" cy="6" r="2.5" fill="#fbbf24" />
            <circle cx="62" cy="12" r="2" fill="#f87171" />
            {/* Glass Bowl */}
            <path d="M33 34 H67 L63 58 C61 69 39 69 37 58 Z" stroke="#d4af37" strokeWidth="2" />
            <path d="M36 48 H64 L63 58 C61 68 39 68 37 58 Z" fill="#b91c1c" opacity="0.85" />
            <line x1="50" y1="67" x2="50" y2="88" stroke="#d4af37" strokeWidth="2" />
            <line x1="36" y1="88" x2="64" y2="88" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'sip':
        // Palate map: Acid on sides vs Tannin on gums/center
        return (
          <svg viewBox="0 0 100 100" className={sizeClass} fill="none">
            {/* Outer Palate / Tongue Silhouette */}
            <path
              d="M30 28 C30 18 70 18 70 28 L72 58 C72 76 58 86 50 86 C42 86 28 76 28 58 Z"
              stroke="#d4af37"
              strokeWidth="2"
              fill="rgba(212,175,55,0.06)"
            />
            {/* Acid Zones (Sides - Blue/Cyan) */}
            <path d="M32 36 C30 46 31 58 35 66" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
            <path d="M68 36 C70 46 69 58 65 66" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
            {/* Tannin Zone (Upper Arch - Crimson) */}
            <path d="M36 27 Q50 20 64 27" stroke="#e11d48" strokeWidth="4" strokeLinecap="round" />
            {/* Sweetness/Fruit Tip (Gold) */}
            <circle cx="50" cy="74" r="6" fill="#facc15" opacity="0.85" />
            {/* Center Body */}
            <circle cx="50" cy="48" r="7" stroke="#c084fc" strokeWidth="2" strokeDasharray="2 2" />
          </svg>
        );

      case 'savor':
        // Stopwatch / Expanding Resonance Rings for Length & Finish
        return (
          <svg viewBox="0 0 100 100" className={sizeClass} fill="none">
            <circle cx="50" cy="52" r="34" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <circle cx="50" cy="52" r="26" stroke="#d4af37" strokeWidth="1.5" opacity="0.7" />
            <circle cx="50" cy="52" r="18" stroke="#fae8b4" strokeWidth="2" fill="rgba(212,175,55,0.12)" />
            {/* Clock hand & 60s badge */}
            <line x1="50" y1="52" x2="50" y2="38" stroke="#fae8b4" strokeWidth="2" strokeLinecap="round" />
            <line x1="50" y1="52" x2="61" y2="52" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" />
            <circle cx="50" cy="52" r="2.5" fill="#d4af37" />
            <text x="50" y="14" textAnchor="middle" fill="#fae8b4" fontSize="9" fontFamily="monospace" fontWeight="bold">
              60s+ FINISH
            </text>
          </svg>
        );
    }
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-4 sm:p-5 lg:p-6 pointer-events-auto overflow-y-auto animate-in fade-in duration-700">
      {/* Celestial Napa Sky Gradient Overlay (Dark starry zenith at top, transparent at bottom so tilted Napa mountains glow underneath) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06080f] via-[#090d18]/92 to-[#0a0c12]/40 pointer-events-none" />

      {/* Subtle Golden Constellation Stars & Warm Horizon Glow */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-8 right-1/4 w-96 h-64 bg-[#881337]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Banner in the Sky */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#d4af37]/25 pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-cinzel font-bold uppercase tracking-widest bg-[#d4af37]/20 text-[#fae8b4] border border-[#d4af37]/40">
              Wine Enthusiast Method
            </span>
            <span className="text-xs text-gray-400 font-sans-clean hidden sm:inline">
              • Interactive Sommelier Visual
            </span>
          </div>
          <h2 className="font-serif-luxury text-xl sm:text-2xl lg:text-3xl text-white tracking-tight mt-0.5">
            The 5 S&apos;s of Wine Tasting
          </h2>
        </div>

        <div className="text-right hidden md:block">
          <p className="text-[11px] font-cinzel uppercase tracking-widest text-[#d4af37]">
            Click Any Step to Inspect
          </p>
          <p className="text-xs text-gray-400 font-sans-clean">
            See • Swirl • Sniff • Sip • Savor
          </p>
        </div>
      </div>

      {/* Main Sky Constellation: 5 Step Cards Row */}
      <div className="relative z-10 grid grid-cols-5 gap-2.5 sm:gap-3 my-auto py-1.5">
        {FIVE_S_STEPS.map((step, idx) => {
          const isSelected = idx === selectedIdx;
          return (
            <button
              key={step.id}
              onClick={() => setSelectedIdx(idx)}
              className={`group text-left rounded-2xl p-2.5 sm:p-3 transition-all duration-300 flex flex-col justify-between border backdrop-blur-xl ${
                isSelected
                  ? 'bg-gradient-to-b from-[#1d2333]/95 to-[#121622]/95 border-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.25)] -translate-y-1'
                  : 'bg-[#10141f]/80 border-[#262f42] hover:border-[#d4af37]/50 hover:bg-[#151a28]/90'
              }`}
            >
              {/* Top Step Number & Icon */}
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-[#d4af37] text-[#0a0c10]'
                      : 'bg-[#1a2030] text-[#d4af37]'
                  }`}
                >
                  {step.number}
                </span>
                {step.id === 'see' && <Eye className="w-4 h-4 text-[#d4af37]/80" />}
                {step.id === 'swirl' && <Wind className="w-4 h-4 text-[#d4af37]/80" />}
                {step.id === 'sniff' && <Sparkles className="w-4 h-4 text-[#d4af37]/80" />}
                {step.id === 'sip' && <Wine className="w-4 h-4 text-[#d4af37]/80" />}
                {step.id === 'savor' && <Clock className="w-4 h-4 text-[#d4af37]/80" />}
              </div>

              {/* Custom SVG Diagram */}
              <div className="my-1 flex items-center justify-center">
                {renderStepIllustration(step.id, false)}
              </div>

              {/* Title & Tagline */}
              <div>
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-white tracking-wider">
                  {step.title}
                </h3>
                <p className="text-[11px] text-[#fae8b4] font-medium leading-tight mt-0.5">
                  {step.subtitle}
                </p>
                <p className="text-[11px] text-gray-400 font-sans-clean leading-snug mt-1 line-clamp-2 hidden xl:block">
                  {step.tagline}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Spotlight Stage (Floating above the Napa Mountain Horizon) */}
      <div className="relative z-10 bg-[#0e121c]/95 backdrop-blur-2xl border border-[#d4af37]/45 rounded-2xl p-3.5 sm:p-4 shadow-2xl">
        <div className="flex flex-col xl:flex-row items-center gap-4">
          {/* Left: Large Animated SVG Diagram */}
          <div className="shrink-0 bg-[#141927] border border-[#d4af37]/30 rounded-2xl p-2.5 flex flex-col items-center justify-center w-28 h-28 shadow-inner">
            {renderStepIllustration(activeStep.id, true)}
          </div>

          {/* Center: Detailed Explanation & Pro Tip */}
          <div className="flex-1 min-w-0 space-y-2 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#d4af37] text-black">
                Step {activeStep.number} of 05
              </span>
              <h4 className="font-serif-luxury text-lg sm:text-xl text-white">
                {activeStep.title} — <span className="text-[#fae8b4]">{activeStep.subtitle}</span>
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-gray-200 font-sans-clean leading-snug">
              {activeStep.detail}
            </p>

            <div className="flex items-start gap-2 bg-[#171d2c] border border-[#d4af37]/30 rounded-lg px-3 py-2 text-xs text-[#fae8b4] leading-snug">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
              <span>
                <strong>Sommelier Cue:</strong> {activeStep.proTip}
              </span>
            </div>
          </div>

          {/* Right: 3 Visual Reference Pills for this Step */}
          <div className="w-full xl:w-64 shrink-0 grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-1.5">
            {activeStep.highlights.map((item, i) => (
              <div
                key={i}
                className="bg-[#141926] border border-[#263044] rounded-xl px-3 py-1.5 flex items-center gap-2.5"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-cinzel uppercase text-gray-400 leading-tight">
                    {item.label}
                  </p>
                  <p className="text-xs text-white font-medium leading-tight mt-0.5">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

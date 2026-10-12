import React from 'react';

interface WineryLogoProps {
  producerCode: string;
  className?: string;
}

export const WineryLogo: React.FC<WineryLogoProps> = ({ producerCode, className = "h-20" }) => {
  switch (producerCode) {
    case 'NAPA':
      // The World-Famous Napa Valley Highway Sign / Official Emblem
      return (
        <div className={`flex flex-col items-center justify-center text-center ${className}`}>
          <svg viewBox="0 0 280 80" className="h-full w-auto max-w-[280px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Wooden Arched Sign Frame Outline */}
            <path d="M20 70V30C20 18 100 8 140 8s120 10 120 22v40" stroke="#d4af37" strokeWidth="1.2" opacity="0.6"/>
            <path d="M26 68V32C26 22 102 13 140 13s114 9 114 19v36" stroke="#d4af37" strokeWidth="0.6" opacity="0.3"/>
            
            {/* Top Curved Text / Region Welcome */}
            <text x="140" y="24" textAnchor="middle" fill="#fae8b4" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="6" letterSpacing="1.8" fontWeight="600" opacity="0.9">
              WELCOME TO THIS WORLD FAMOUS WINE GROWING REGION
            </text>

            {/* Central Grand NAPA VALLEY */}
            <text x="140" y="46" textAnchor="middle" fill="#ffffff" fontFamily="'Playfair Display', Georgia, serif" fontSize="21" letterSpacing="4.5" fontWeight="700">
              NAPA VALLEY
            </text>

            <line x1="60" y1="52" x2="220" y2="52" stroke="#d4af37" strokeWidth="0.8" opacity="0.7"/>

            {/* Robert Louis Stevenson Quote */}
            <text x="140" y="62" textAnchor="middle" fill="#fae8b4" fontFamily="'Playfair Display', Georgia, serif" fontStyle="italic" fontSize="7.5" letterSpacing="0.8">
              &ldquo;...and the wine is bottled poetry&rdquo;
            </text>

            <text x="140" y="72" textAnchor="middle" fill="#9ca3af" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="5" letterSpacing="2.5">
              NAPA COUNTY, CALIFORNIA
            </text>
          </svg>
        </div>
      );

    case 'AXR':
      // The Authentic AXR Napa Valley Modern Minimalist Architectural Logo
      return (
        <div className={`flex flex-col items-center justify-center text-center ${className}`}>
          <svg viewBox="0 0 240 70" className="h-full w-auto max-w-[240px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Bold, Clean, Minimalist Architectural Sans-Serif AXR */}
            <text x="120" y="40" textAnchor="middle" fill="#fae8b4" fontFamily="'Plus Jakarta Sans', -apple-system, system-ui, sans-serif" fontSize="34" letterSpacing="8" fontWeight="800">
              AXR
            </text>
            <line x1="50" y1="48" x2="190" y2="48" stroke="#d4af37" strokeWidth="0.8" opacity="0.6"/>
            {/* NAPA VALLEY Subtitle */}
            <text x="120" y="58" textAnchor="middle" fill="#d4af37" fontFamily="'Plus Jakarta Sans', -apple-system, sans-serif" fontSize="7" letterSpacing="6" fontWeight="600">
              NAPA VALLEY
            </text>
            <text x="120" y="66" textAnchor="middle" fill="#8892b0" fontFamily="'Plus Jakarta Sans', -apple-system, sans-serif" fontSize="4.5" letterSpacing="3" fontWeight="500">
              ST. HELENA, CALIFORNIA
            </text>
          </svg>
        </div>
      );

    case 'SLWC':
      // Stag's Leap Wine Cellars — Wide ViewBox to Prevent Any Clipping
      return (
        <div className={`flex flex-col items-center justify-center text-center ${className}`}>
          <svg viewBox="0 0 260 75" className="h-full w-auto max-w-[260px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* The Iconic Leaping Golden Stag */}
            <g transform="translate(115, 6) scale(0.7)">
              <path 
                d="M10 24C12 21 16 16 19 14C17 12 15 9 14 6C17 6 21 9 23 11C25 8 27 5 30 2C31 6 29 10 27 13C31 13 36 15 39 18C37 19 33 19 30 20C34 23 37 26 38 30C34 29 31 28 28 28C27 32 25 36 21 39C19 34 19 30 18 27C15 29 12 30 10 32C11 29 11 26 10 24Z" 
                fill="#d4af37" 
                opacity="0.95"
              />
            </g>

            {/* STAG'S LEAP on Line 1 */}
            <text x="130" y="44" textAnchor="middle" fill="#ffffff" fontFamily="'Cinzel', serif" fontSize="13" letterSpacing="3.5" fontWeight="700">
              STAG&apos;S LEAP
            </text>

            {/* WINE CELLARS on Line 2 */}
            <text x="130" y="56" textAnchor="middle" fill="#fae8b4" fontFamily="'Cinzel', serif" fontSize="8.5" letterSpacing="4.5" fontWeight="600">
              WINE CELLARS
            </text>

            <line x1="50" y1="61" x2="210" y2="61" stroke="#d4af37" strokeWidth="0.6" opacity="0.5"/>

            {/* NAPA VALLEY on Line 3 */}
            <text x="130" y="69" textAnchor="middle" fill="#d4af37" fontFamily="'Playfair Display', serif" fontStyle="italic" fontSize="7" letterSpacing="3">
              Napa Valley
            </text>
          </svg>
        </div>
      );

    case 'SCHR':
      return (
        <div className={`flex flex-col items-center justify-center text-center ${className}`}>
          <svg viewBox="0 0 240 65" className="h-full w-auto max-w-[240px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Historic Crown & Crest */}
            <path d="M105 16l5-5 5 5 7-7 7 7 5-5 5 5v3h-34v-3z" fill="#d4af37" opacity="0.9"/>
            <rect x="104" y="20" width="34" height="1.5" fill="#d4af37"/>
            {/* Brand Title */}
            <text x="120" y="39" textAnchor="middle" fill="#fae8b4" fontFamily="'Playfair Display', serif" fontSize="18" letterSpacing="2" fontWeight="700">
              SCHRAMSBERG
            </text>
            <text x="120" y="49" textAnchor="middle" fill="#d4af37" fontFamily="'Cinzel', serif" fontSize="6.5" letterSpacing="4">
              HISTORIC CAVES • EST. 1862
            </text>
            <text x="120" y="58" textAnchor="middle" fill="#8892b0" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="5" letterSpacing="2">
              CALISTOGA • DIAMOND MOUNTAIN
            </text>
          </svg>
        </div>
      );

    case 'TURL':
      return (
        <div className={`flex flex-col items-center justify-center text-center ${className}`}>
          <svg viewBox="0 0 220 60" className="h-full w-auto max-w-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="25" y1="18" x2="195" y2="18" stroke="#d4af37" strokeWidth="0.75" opacity="0.7"/>
            <text x="110" y="36" textAnchor="middle" fill="#ffffff" fontFamily="'Playfair Display', serif" fontSize="22" letterSpacing="6" fontWeight="600">
              TURLEY
            </text>
            <line x1="25" y1="42" x2="195" y2="42" stroke="#d4af37" strokeWidth="0.75" opacity="0.7"/>
            <text x="110" y="53" textAnchor="middle" fill="#d4af37" fontFamily="'Cinzel', serif" fontSize="6.5" letterSpacing="4">
              WINE CELLARS • ST. HELENA
            </text>
          </svg>
        </div>
      );

    case 'DOMN':
      return (
        <div className={`flex flex-col items-center justify-center text-center ${className}`}>
          <svg viewBox="0 0 220 60" className="h-full w-auto max-w-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="110" y="32" textAnchor="middle" fill="#fae8b4" fontFamily="'Cinzel', serif" fontSize="21" letterSpacing="6" fontWeight="700">
              DOMINUS
            </text>
            <text x="110" y="44" textAnchor="middle" fill="#d4af37" fontFamily="'Playfair Display', italic" fontSize="8" letterSpacing="2">
              Christian Moueix
            </text>
            <text x="110" y="54" textAnchor="middle" fill="#9ca3af" fontFamily="'Cinzel', serif" fontSize="5.5" letterSpacing="3">
              NAPANOOK • YOUNTVILLE
            </text>
          </svg>
        </div>
      );

    case 'SHAF':
      return (
        <div className={`flex flex-col items-center justify-center text-center ${className}`}>
          <svg viewBox="0 0 220 60" className="h-full w-auto max-w-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="110" y="34" textAnchor="middle" fill="#ffffff" fontFamily="'Playfair Display', serif" fontSize="24" letterSpacing="3" fontWeight="600" fontStyle="italic">
              Shafer
            </text>
            <line x1="30" y1="41" x2="190" y2="41" stroke="#d4af37" strokeWidth="0.75" opacity="0.6"/>
            <text x="110" y="52" textAnchor="middle" fill="#d4af37" fontFamily="'Cinzel', serif" fontSize="6.5" letterSpacing="4">
              NAPA VALLEY • STAGS LEAP DISTRICT
            </text>
          </svg>
        </div>
      );

    case 'GRAC':
      return (
        <div className={`flex flex-col items-center justify-center text-center ${className}`}>
          <svg viewBox="0 0 240 70" className="h-full w-auto max-w-[240px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Medallion Coin Outline */}
            <circle cx="120" cy="14" r="8" stroke="#d4af37" strokeWidth="0.8" opacity="0.8"/>
            <text x="120" y="17" textAnchor="middle" fill="#fae8b4" fontFamily="'Cinzel', serif" fontSize="7" fontWeight="700">G</text>
            <text x="120" y="42" textAnchor="middle" fill="#ffffff" fontFamily="'Playfair Display', Georgia, serif" fontSize="23" letterSpacing="4" fontStyle="italic" fontWeight="600">
              Gracianna
            </text>
            <line x1="35" y1="48" x2="205" y2="48" stroke="#d4af37" strokeWidth="0.6" opacity="0.6"/>
            <text x="120" y="58" textAnchor="middle" fill="#d4af37" fontFamily="'Cinzel', serif" fontSize="6.5" letterSpacing="3.5">
              RUSSIAN RIVER VALLEY
            </text>
            <text x="120" y="66" textAnchor="middle" fill="#8892b0" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="5" letterSpacing="2">
              HEALDSBURG, CALIFORNIA
            </text>
          </svg>
        </div>
      );

    default:
      return (
        <div className={`flex items-center justify-center font-cinzel text-lg text-[#d4af37] ${className}`}>
          {producerCode}
        </div>
      );
  }
};

// Helper to generate SVG Data URI for Map Marker tooltips (ensuring NO text gets clipped)
export const getWineryLogoDataUri = (producerCode: string): string => {
  const svgs: Record<string, string> = {
    NAPA: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 50" fill="none"><text x="90" y="24" text-anchor="middle" fill="%23ffffff" font-family="Playfair Display, serif" font-size="14" letter-spacing="3" font-weight="700">NAPA VALLEY</text><text x="90" y="38" text-anchor="middle" fill="%23fae8b4" font-family="serif" font-style="italic" font-size="7">bottled poetry</text></svg>`,
    
    SCHR: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 50" fill="none"><text x="90" y="24" text-anchor="middle" fill="%23fae8b4" font-family="Playfair Display, serif" font-size="13" letter-spacing="2" font-weight="700">SCHRAMSBERG</text><text x="90" y="38" text-anchor="middle" fill="%23d4af37" font-family="Cinzel, serif" font-size="6" letter-spacing="2">EST. 1862 • SPARKLING</text></svg>`,
    
    TURL: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 50" fill="none"><text x="90" y="26" text-anchor="middle" fill="%23ffffff" font-family="Playfair Display, serif" font-size="16" letter-spacing="4" font-weight="700">TURLEY</text><text x="90" y="39" text-anchor="middle" fill="%23d4af37" font-family="Cinzel, serif" font-size="6" letter-spacing="2">WINE CELLARS • ST. HELENA</text></svg>`,
    
    DOMN: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 50" fill="none"><text x="90" y="25" text-anchor="middle" fill="%23fae8b4" font-family="Cinzel, serif" font-size="15" letter-spacing="4" font-weight="700">DOMINUS</text><text x="90" y="39" text-anchor="middle" fill="%23d4af37" font-family="sans-serif" font-size="6" letter-spacing="2">NAPANOOK • YOUNTVILLE</text></svg>`,
    
    SLWC: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 50" fill="none"><text x="90" y="20" text-anchor="middle" fill="%23ffffff" font-family="Cinzel, serif" font-size="9.5" letter-spacing="2" font-weight="700">STAG&apos;S LEAP</text><text x="90" y="32" text-anchor="middle" fill="%23fae8b4" font-family="Cinzel, serif" font-size="7.5" letter-spacing="2.5" font-weight="600">WINE CELLARS</text><text x="90" y="42" text-anchor="middle" fill="%23d4af37" font-family="serif" font-style="italic" font-size="6" letter-spacing="2">Napa Valley</text></svg>`,
    
    SHAF: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 50" fill="none"><text x="90" y="27" text-anchor="middle" fill="%23ffffff" font-family="Playfair Display, serif" font-size="18" letter-spacing="2" font-style="italic" font-weight="700">Shafer</text><text x="90" y="40" text-anchor="middle" fill="%23d4af37" font-family="Cinzel, serif" font-size="6" letter-spacing="2">STAGS LEAP DISTRICT</text></svg>`,
    
    GRAC: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 50" fill="none"><text x="90" y="27" text-anchor="middle" fill="%23ffffff" font-family="Playfair Display, serif" font-size="18" letter-spacing="2" font-style="italic" font-weight="700">Gracianna</text><text x="90" y="40" text-anchor="middle" fill="%23d4af37" font-family="Cinzel, serif" font-size="6" letter-spacing="2">RUSSIAN RIVER VALLEY</text></svg>`,
    
    AXR: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 50" fill="none"><text x="90" y="26" text-anchor="middle" fill="%23fae8b4" font-family="Plus Jakarta Sans, sans-serif" font-size="20" letter-spacing="5" font-weight="800">AXR</text><text x="90" y="39" text-anchor="middle" fill="%23d4af37" font-family="Plus Jakarta Sans, sans-serif" font-size="6" letter-spacing="3" font-weight="600">NAPA VALLEY</text></svg>`
  };

  const svg = svgs[producerCode] || svgs.NAPA;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

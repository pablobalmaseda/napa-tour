import React, { useEffect, useRef, useState } from 'react';
import { Map, Marker, NavigationControl, ScaleControl } from 'maplibre-gl';
import type { WineSlide } from '../data/slides';
import { napaAvasGeoJSON } from '../data/napaAvas';
import type { AvaFeatureProperties, AvaFeature } from '../data/napaAvas';
import { getWineryLogoDataUri } from './WineryLogo';
import { TastingSkyVisual } from './TastingSkyVisual';
import { Layers, Maximize2, Compass, MapPin, Mountain, Thermometer } from 'lucide-react';

interface WineMapProps {
  slides: WineSlide[];
  currentSlideIndex: number;
  onSelectSlide: (index: number) => void;
  customMapboxToken?: string;
}

export type MapStyleType = 'satellite' | 'ava' | 'dark' | 'topo';

export const WineMap: React.FC<WineMapProps> = ({
  slides,
  currentSlideIndex,
  onSelectSlide,
  customMapboxToken
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [mapStyle, setMapStyle] = useState<MapStyleType>('satellite');
  const [isLoaded, setIsLoaded] = useState(false);
  const [pitchValue, setPitchValue] = useState(0);
  const [bearingValue, setBearingValue] = useState(0);
  const [selectedAva, setSelectedAva] = useState<AvaFeatureProperties | null>(null);
  const [compareAva, setCompareAva] = useState<AvaFeatureProperties | null>(null);

  // Helper to construct style JSON
  const getStyleDefinition = (type: MapStyleType): any => {
    const token = (customMapboxToken || import.meta.env.VITE_MAPBOX_TOKEN)?.trim();

    // 1. AVA COMPARISON STYLE
    if (type === 'ava') {
      const baseTilesSource = token
        ? {
            type: 'raster',
            tiles: [
              `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/512/{z}/{x}/{y}@2x?access_token=${token}`
            ],
            tileSize: 512,
            attribution: '&copy; Mapbox &copy; OpenStreetMap'
          }
        : {
            type: 'raster',
            tiles: [
              'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256,
            attribution: '&copy; Esri, HERE, Garmin'
          };

      return {
        version: 8,
        sources: {
          'dark-base': baseTilesSource,
          'napa-avas-source': {
            type: 'geojson',
            data: napaAvasGeoJSON
          },
          'labels-source': {
            type: 'raster',
            tiles: [
              'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256
          }
        },
        layers: [
          {
            id: 'dark-base-layer',
            type: 'raster',
            source: 'dark-base',
            minzoom: 0,
            maxzoom: 20
          },
          {
            id: 'ava-fill-layer',
            type: 'fill',
            source: 'napa-avas-source',
            paint: {
              'fill-color': ['get', 'color'],
              'fill-opacity': 0.38
            }
          },
          {
            id: 'ava-border-layer',
            type: 'line',
            source: 'napa-avas-source',
            paint: {
              'line-color': ['get', 'color'],
              'line-width': 2.5,
              'line-opacity': 0.95
            }
          },
          {
            id: 'labels-layer',
            type: 'raster',
            source: 'labels-source',
            minzoom: 0,
            maxzoom: 20,
            paint: {
              'raster-opacity': 0.8
            }
          }
        ]
      };
    }

    // 2. MAPBOX RASTER TILES IF TOKEN AVAILABLE
    if (token) {
      const mapboxStyleId =
        type === 'satellite'
          ? 'mapbox/satellite-streets-v12'
          : type === 'dark'
          ? 'mapbox/dark-v11'
          : 'mapbox/outdoors-v12';

      return {
        version: 8,
        sources: {
          'mapbox-source': {
            type: 'raster',
            tiles: [
              `https://api.mapbox.com/styles/v1/${mapboxStyleId}/tiles/512/{z}/{x}/{y}@2x?access_token=${token}`
            ],
            tileSize: 512,
            attribution: '&copy; Mapbox &copy; OpenStreetMap'
          }
        },
        layers: [
          {
            id: 'mapbox-layer',
            type: 'raster',
            source: 'mapbox-source',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      };
    }

    // 3. FREE FALLBACKS (NO TOKEN REQUIRED)
    switch (type) {
      case 'satellite':
        return {
          version: 8,
          sources: {
            'satellite-source': {
              type: 'raster',
              tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              ],
              tileSize: 256,
              attribution: 'Esri, Maxar, Earthstar Geographics'
            },
            'labels-source': {
              type: 'raster',
              tiles: [
                'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
              ],
              tileSize: 256
            }
          },
          layers: [
            {
              id: 'satellite-layer',
              type: 'raster',
              source: 'satellite-source',
              minzoom: 0,
              maxzoom: 20
            },
            {
              id: 'labels-layer',
              type: 'raster',
              source: 'labels-source',
              minzoom: 0,
              maxzoom: 20,
              paint: {
                'raster-opacity': 0.85
              }
            }
          ]
        };

      case 'dark':
        return {
          version: 8,
          sources: {
            'dark-base': {
              type: 'raster',
              tiles: [
                'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
              ],
              tileSize: 256,
              attribution: '&copy; Esri, HERE, Garmin'
            },
            'dark-labels': {
              type: 'raster',
              tiles: [
                'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}'
              ],
              tileSize: 256
            }
          },
          layers: [
            {
              id: 'dark-base-layer',
              type: 'raster',
              source: 'dark-base',
              minzoom: 0,
              maxzoom: 16
            },
            {
              id: 'dark-labels-layer',
              type: 'raster',
              source: 'dark-labels',
              minzoom: 0,
              maxzoom: 16
            }
          ]
        };

      case 'topo':
        return {
          version: 8,
          sources: {
            'topo-tiles': {
              type: 'raster',
              tiles: [
                'https://tile.opentopomap.org/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              attribution: '&copy; OpenTopoMap &copy; OpenStreetMap'
            }
          },
          layers: [
            {
              id: 'topo-layer',
              type: 'raster',
              source: 'topo-tiles',
              minzoom: 0,
              maxzoom: 17
            }
          ]
        };
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current) return;

    const initialSlide = slides[0];

    const map = new Map({
      container: mapContainer.current,
      style: getStyleDefinition('satellite'),
      center: initialSlide.coordinates,
      zoom: initialSlide.zoom,
      pitch: initialSlide.pitch,
      bearing: initialSlide.bearing ?? 0,
      maxPitch: 85,
      attributionControl: false
    });

    // Add navigation controls
    map.addControl(new NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new ScaleControl({ unit: 'imperial' }), 'bottom-right');

    map.on('load', () => {
      setIsLoaded(true);
    });

    map.on('rotate', () => {
      setBearingValue(Math.round(map.getBearing()));
      setPitchValue(Math.round(map.getPitch()));
    });

    map.on('pitch', () => {
      setPitchValue(Math.round(map.getPitch()));
    });

    // Interactive clicks on AVA polygons
    map.on('click', 'ava-fill-layer', (e) => {
      if (e.features && e.features[0]) {
        const featureProps = e.features[0].properties as any;
        const matchingAva = napaAvasGeoJSON.features.find(
          (f: AvaFeature) => f.properties.id === featureProps.id
        );
        if (matchingAva) {
          setSelectedAva(matchingAva.properties);
        }
      }
    });

    map.on('mouseenter', 'ava-fill-layer', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'ava-fill-layer', () => {
      map.getCanvas().style.cursor = '';
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Update map style when mapStyle changes
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(getStyleDefinition(mapStyle));

    // When switching to AVA tab, pre-select the current wine's AVA if matching
    if (mapStyle === 'ava') {
      const currentSlideId = slides[currentSlideIndex].id;
      const matched = napaAvasGeoJSON.features.find((f: AvaFeature) =>
        f.properties.activeForSlideIds.includes(currentSlideId)
      );
      if (matched) {
        setSelectedAva(matched.properties);
      }
    }
  }, [mapStyle, customMapboxToken]);

  // Update selected AVA when slide changes while in AVA view
  useEffect(() => {
    if (mapStyle === 'ava') {
      const currentSlideId = slides[currentSlideIndex].id;
      const matched = napaAvasGeoJSON.features.find((f: AvaFeature) =>
        f.properties.activeForSlideIds.includes(currentSlideId)
      );
      if (matched) {
        setSelectedAva(matched.properties);
      }
    }
  }, [currentSlideIndex, mapStyle]);

  // Create & Manage Vineyard Markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear previous markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    slides.forEach((slide, index) => {
      // Do not render a map pin for the introductory overview placeholder
      if (slide.isOverview) return;

      const isCurrent = index === currentSlideIndex;
      const displayNumber = slide.wineNumber ?? slide.id;
      const el = document.createElement('div');
      el.className = 'wine-marker-container cursor-pointer transition-all duration-300 transform';
      
      const pinInner = `
        <div class="relative group flex items-center justify-center">
          <!-- Pulse ring for active winery -->
          <div class="${isCurrent ? 'marker-pulse-active' : ''} absolute w-10 h-10 rounded-full ${isCurrent ? 'bg-[#d4af37]/40 ring-2 ring-[#d4af37]' : 'bg-transparent'}"></div>
          
          <!-- Outer Badge -->
          <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 ${
            isCurrent
              ? 'bg-[#d4af37] text-[#0d0f12] ring-2 ring-[#fae8b4] scale-125 z-30 font-bold'
              : 'bg-[#181c24] text-[#d4af37] ring-1 ring-[#d4af37]/60 hover:scale-110 hover:ring-[#d4af37] z-10'
          }">
            <span class="text-[11px] font-cinzel tracking-wider">${displayNumber}</span>
          </div>

          <!-- Hover Tooltip with Winery Logo Badge -->
          <div class="absolute bottom-10 left-1/2 -translate-x-1/2 p-2.5 rounded-xl bg-[#0e1118]/95 backdrop-blur-md border border-[#d4af37]/50 text-xs text-white shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-40 w-44">
            <div class="w-full h-12 rounded-lg overflow-hidden mb-1.5 border border-[#d4af37]/30 bg-[#141822] flex items-center justify-center p-1.5">
              <img src="${getWineryLogoDataUri(slide.producerCode)}" alt="${slide.title}" class="w-auto h-full object-contain" />
            </div>
            <p class="font-cinzel text-[#d4af37] font-semibold text-[11px] truncate">${slide.title}</p>
            <p class="text-[10px] text-gray-400 truncate">${slide.region}</p>
          </div>
        </div>
      `;

      el.innerHTML = pinInner;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectSlide(index);
      });

      const marker = new Marker({ element: el })
        .setLngLat(slide.coordinates)
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
  }, [slides, currentSlideIndex, onSelectSlide, isLoaded]);

  // Smooth flyTo on slide change
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    const currentSlide = slides[currentSlideIndex];
    if (!currentSlide) return;

    mapRef.current.flyTo({
      center: currentSlide.coordinates,
      zoom: currentSlide.zoom,
      pitch: currentSlide.pitch,
      bearing: currentSlide.bearing ?? 0,
      duration: 2500,
      essential: true,
      curve: 1.3
    });
  }, [currentSlideIndex, isLoaded, slides]);

  const handleResetOrientation = () => {
    if (!mapRef.current) return;
    const currentSlide = slides[currentSlideIndex];
    mapRef.current.flyTo({
      center: currentSlide.coordinates,
      zoom: currentSlide.zoom,
      pitch: currentSlide.pitch,
      bearing: currentSlide.bearing ?? 0,
      duration: 1000
    });
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainer.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const isTastingSkyMode = slides[currentSlideIndex]?.producerCode === 'TASTE';

  return (
    <div className="relative w-full h-full bg-[#06080f] overflow-hidden">
      {/* Map Container — smoothly pans down so camera looks up into the sky on the 5 S's slide */}
      <div
        ref={mapContainer}
        className={`w-full h-full transition-transform duration-[2200ms] ease-out ${
          isTastingSkyMode ? 'translate-y-[44%] scale-110' : 'translate-y-0 scale-100'
        }`}
      />

      {/* The 5 S's of Wine Tasting Sky Visual (Rendered in the sky above the tilted Napa horizon) */}
      {isTastingSkyMode && <TastingSkyVisual />}

      {/* Floating Style & Control Badges (Hidden when looking up at the 5 S's sky visual) */}
      <div
        className={`absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 max-w-[calc(100%-80px)] transition-opacity duration-500 ${
          isTastingSkyMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Style Selector */}
        <div className="flex bg-[#12151d]/90 backdrop-blur-md rounded-lg p-1 border border-[#2a303c] shadow-2xl">
          <button
            onClick={() => setMapStyle('satellite')}
            className={`px-3 py-1.5 text-xs rounded-md transition-all font-sans-clean flex items-center gap-1.5 ${
              mapStyle === 'satellite'
                ? 'bg-gradient-gold text-[#0f1115] font-semibold shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-[#1f2430]'
            }`}
            title="High-Resolution Satellite & Aerial Hybrid"
          >
            <Layers className="w-3.5 h-3.5" />
            Satellite
          </button>

          <button
            onClick={() => setMapStyle('ava')}
            className={`px-3 py-1.5 text-xs rounded-md transition-all font-sans-clean flex items-center gap-1.5 ${
              mapStyle === 'ava'
                ? 'bg-gradient-gold text-[#0f1115] font-semibold shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-[#1f2430]'
            }`}
            title="Compare Napa Valley American Viticultural Areas (AVAs)"
          >
            <MapPin className="w-3.5 h-3.5" />
            AVA Boundaries
          </button>

          <button
            onClick={() => setMapStyle('dark')}
            className={`px-3 py-1.5 text-xs rounded-md transition-all font-sans-clean flex items-center gap-1.5 ${
              mapStyle === 'dark'
                ? 'bg-gradient-gold text-[#0f1115] font-semibold shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-[#1f2430]'
            }`}
            title="Night Terroir Noir"
          >
            Dark Terroir
          </button>

          <button
            onClick={() => setMapStyle('topo')}
            className={`px-3 py-1.5 text-xs rounded-md transition-all font-sans-clean flex items-center gap-1.5 ${
              mapStyle === 'topo'
                ? 'bg-gradient-gold text-[#0f1115] font-semibold shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-[#1f2430]'
            }`}
            title="Topographical Elevation Contours"
          >
            Contours
          </button>
        </div>

        {/* Orientation Telemetry Display */}
        <div className="hidden xl:flex items-center gap-3 bg-[#12151d]/80 backdrop-blur-md border border-[#2a303c]/80 rounded-lg px-3 py-1.5 text-[11px] text-gray-300">
          <div className="flex items-center gap-1">
            <span className="text-[#d4af37]">Pitch:</span>
            <span className="font-mono text-white">{pitchValue}°</span>
          </div>
          <div className="w-[1px] h-3 bg-[#2a303c]" />
          <div className="flex items-center gap-1">
            <span className="text-[#d4af37]">Bearing:</span>
            <span className="font-mono text-white">{bearingValue}°</span>
          </div>
          <button
            onClick={handleResetOrientation}
            className="text-gray-400 hover:text-[#d4af37] transition-colors ml-1"
            title="Reset to Slide Orientation"
          >
            <Compass className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Right Quick Actions */}
      <div className="absolute top-4 right-14 z-20">
        <button
          onClick={handleToggleFullscreen}
          className="p-2 rounded-lg bg-[#12151d]/90 backdrop-blur-md border border-[#2a303c] text-gray-300 hover:text-[#d4af37] hover:border-[#d4af37]/50 transition-all shadow-xl"
          title="Fullscreen Map"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* AVA Comparison Inspector Panel (visible when on 'ava' tab) */}
      {mapStyle === 'ava' && (
        <div className="absolute top-16 right-4 w-80 max-h-[calc(100%-80px)] bg-[#10131b]/95 backdrop-blur-md border border-[#d4af37]/40 rounded-xl p-4 shadow-2xl z-20 flex flex-col gap-3 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-[#242b3a] pb-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#d4af37]" />
              <h3 className="font-cinzel text-xs font-bold text-[#fae8b4] uppercase tracking-wider">
                Napa AVA Comparison
              </h3>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">12 Key AVAs</span>
          </div>

          {/* Quick Select Buttons */}
          <div className="space-y-1">
            <label className="text-[10px] font-cinzel uppercase text-gray-400 tracking-wider">
              Primary AVA Focus
            </label>
            <select
              value={selectedAva?.id || ''}
              onChange={(e) => {
                const ava = napaAvasGeoJSON.features.find((f: AvaFeature) => f.properties.id === e.target.value);
                if (ava) setSelectedAva(ava.properties);
              }}
              className="w-full bg-[#171b26] border border-[#2e374a] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            >
              {napaAvasGeoJSON.features.map((f: AvaFeature) => (
                <option key={f.properties.id} value={f.properties.id}>
                  {f.properties.name} (Est. {f.properties.established})
                </option>
              ))}
            </select>
          </div>

          {/* Compare Against Secondary AVA */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-cinzel uppercase text-gray-400 tracking-wider">
                Compare Against (Secondary)
              </label>
              {compareAva && (
                <button
                  onClick={() => setCompareAva(null)}
                  className="text-[10px] text-gray-400 hover:text-red-400"
                >
                  Clear
                </button>
              )}
            </div>
            <select
              value={compareAva?.id || ''}
              onChange={(e) => {
                const ava = napaAvasGeoJSON.features.find((f: AvaFeature) => f.properties.id === e.target.value);
                setCompareAva(ava ? ava.properties : null);
              }}
              className="w-full bg-[#171b26] border border-[#2e374a] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            >
              <option value="">Select an AVA to compare...</option>
              {napaAvasGeoJSON.features
                .filter((f: AvaFeature) => f.properties.id !== selectedAva?.id)
                .map((f: AvaFeature) => (
                  <option key={f.properties.id} value={f.properties.id}>
                    {f.properties.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Comparison Cards Grid */}
          {selectedAva && (
            <div className="space-y-2 mt-1">
              {/* Primary Selected AVA Details */}
              <div className="bg-[#181d2a] border border-[#384358] rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-cinzel text-xs font-semibold text-[#fae8b4]">
                    {selectedAva.name}
                  </span>
                  <span
                    className="w-3 h-3 rounded-full border border-black/40"
                    style={{ backgroundColor: selectedAva.color }}
                  />
                </div>

                <div className="space-y-1.5 text-[11px] text-gray-300">
                  <div className="flex items-start gap-1.5">
                    <Mountain className="w-3.5 h-3.5 text-[#d4af37] mt-0.5 shrink-0" />
                    <span><strong className="text-gray-200">Elevation:</strong> {selectedAva.elevation}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-[#d4af37] mt-0.5 shrink-0" />
                    <span><strong className="text-gray-200">Climate:</strong> {selectedAva.climate}</span>
                  </div>
                </div>

                <div className="pt-1 flex flex-wrap gap-1">
                  {selectedAva.keyGrapes.map((grape, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] bg-[#11141c] text-[#e5c378] border border-[#d4af37]/30"
                    >
                      {grape}
                    </span>
                  ))}
                </div>
              </div>

              {/* Side-by-Side Comparison if Secondary Selected */}
              {compareAva && (
                <div className="bg-[#1e1724] border border-[#5a2e58] rounded-lg p-3 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel text-xs font-semibold text-[#e8b4e5]">
                      {compareAva.name}
                    </span>
                    <span
                      className="w-3 h-3 rounded-full border border-black/40"
                      style={{ backgroundColor: compareAva.color }}
                    />
                  </div>

                  <div className="space-y-1.5 text-[11px] text-gray-300">
                    <div className="flex items-start gap-1.5">
                      <Mountain className="w-3.5 h-3.5 text-[#c084fc] mt-0.5 shrink-0" />
                      <span><strong className="text-gray-200">Elevation:</strong> {compareAva.elevation}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-[#c084fc] mt-0.5 shrink-0" />
                      <span><strong className="text-gray-200">Climate:</strong> {compareAva.climate}</span>
                    </div>
                  </div>

                  <div className="pt-1 flex flex-wrap gap-1">
                    {compareAva.keyGrapes.map((grape, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] bg-[#130f18] text-[#e8b4e5] border border-[#a855f7]/30"
                      >
                        {grape}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <p className="text-[10px] text-gray-400 italic text-center pt-1">
            Click any colored region on the map to inspect its terroir.
          </p>
        </div>
      )}

      {/* Floating Coordinates Tag in bottom left of map */}
      <div
        className={`absolute bottom-4 left-4 z-20 pointer-events-none transition-opacity duration-500 ${
          isTastingSkyMode ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="bg-[#0e1118]/85 backdrop-blur-md border border-[#d4af37]/30 rounded-lg px-3 py-2 text-xs shadow-2xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-cinzel">Current GPS Focus</p>
            <p className="font-mono text-white text-[12px] font-medium">
              {slides[currentSlideIndex].coordinates[1].toFixed(4)}° N, {Math.abs(slides[currentSlideIndex].coordinates[0]).toFixed(4)}° W
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

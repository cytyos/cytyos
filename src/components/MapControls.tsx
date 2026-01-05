import React, { useState, useEffect, useRef } from 'react';
import { Search, Layers, Box, PenTool, Map as MapIcon, Loader2, X, Trash2, Check } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { useMapStore } from '../stores/mapStore';
import { useProjectStore } from '../stores/useProjectStore';

// MAPBOX TOKEN (Reads from .env or falls back to empty string)
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

interface SearchResult {
  id: string;
  place_name: string;
  center: [number, number];
}

export const MapControls = () => {
  // Global Stores
  const { measurementSystem, setMeasurementSystem } = useSettingsStore();
  const { mapStyle, setMapStyle, drawMode, setDrawMode, setFlyToCoords, is3D, setIs3D } = useMapStore();
  const { land, clearProject } = useProjectStore();
  
  // Search State
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // UX State: Confirmation Popover
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Check if a drawing exists (to show/hide the trash button)
  const hasDrawing = !!land.geometry;

  // Handle Clear Action
  const handleConfirmClear = () => {
      clearProject();
      setDrawMode('simple_select'); // Reset tool state
      setShowClearConfirm(false);   // Close popover
  };

  // --- AUTOCOMPLETE LOGIC ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      // Only search if input has 3 or more characters
      if (searchValue.length < 3) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        // Fetch addresses and POIs
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchValue)}.json?access_token=${MAPBOX_TOKEN}&types=address,poi&limit=5`
        );
        const data = await response.json();
        
        if (data.features) {
          setSearchResults(data.features.map((f: any) => ({
            id: f.id,
            place_name: f.place_name,
            center: f.center
          })));
          setShowResults(true);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500); // Wait 500ms after typing stops

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  // Select location from list
  const handleSelectLocation = (result: SearchResult) => {
    setFlyToCoords(result.center); // Fly to coords
    setSearchValue(result.place_name); // Fill input
    setShowResults(false); // Hide list
  };

  // Clear search input
  const clearSearch = () => {
    setSearchValue('');
    setSearchResults([]);
    setShowResults(false);
  };

  // Close list when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-3 w-[90vw] max-w-md mx-auto pointer-events-auto relative">
      
      {/* --- 1. SEARCH BAR + UNIT TOGGLE --- */}
      <div className="flex gap-2 w-full relative z-50" ref={searchContainerRef}>
        
        {/* Search Input Container */}
        <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {isSearching ? (
                  <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                )}
            </div>
            
            <input
                type="text"
                value={searchValue}
                onChange={(e) => {
                    setSearchValue(e.target.value);
                    if(e.target.value.length === 0) setShowResults(false);
                }}
                onFocus={() => { if(searchResults.length > 0) setShowResults(true); }}
                className="block w-full pl-10 pr-8 py-2.5 bg-[#0f111a]/90 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-xs md:text-sm shadow-xl"
                placeholder="Search location (City, Address)..."
            />

            {/* Clear Button */}
            {searchValue && (
                <button 
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
                >
                    <X className="h-3 w-3" />
                </button>
            )}

            {/* --- DROPDOWN LIST (AUTOCOMPLETE) --- */}
            {showResults && searchResults.length > 0 && (
                <div className="absolute bottom-full mb-2 w-full bg-[#0f111a] border border-gray-700 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar z-50">
                    <ul>
                        {searchResults.map((result) => (
                            <li 
                                key={result.id}
                                onClick={() => handleSelectLocation(result)}
                                className="px-4 py-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-0 transition-colors"
                            >
                                <div className="text-xs font-bold text-white truncate">
                                    {result.place_name.split(',')[0]}
                                </div>
                                <div className="text-[10px] text-gray-400 truncate">
                                    {result.place_name}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="px-2 py-1 bg-black/20 text-[9px] text-right text-gray-600">
                        Search via Mapbox
                    </div>
                </div>
            )}
        </div>

        {/* Unit Toggle (M / FT) */}
        <div className="bg-[#0f111a]/90 backdrop-blur-md border border-white/10 rounded-xl p-1 flex items-center shadow-xl h-full">
            <button
                onClick={() => setMeasurementSystem('metric')}
                className={`px-3 py-1.5 h-full rounded-lg text-[10px] font-bold transition-all flex items-center ${
                    measurementSystem === 'metric' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white'
                }`}
            >
                M
            </button>
            <div className="w-px h-3 bg-white/10 mx-1"></div>
            <button
                onClick={() => setMeasurementSystem('imperial')}
                className={`px-3 py-1.5 h-full rounded-lg text-[10px] font-bold transition-all flex items-center ${
                    measurementSystem === 'imperial' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white'
                }`}
            >
                FT
            </button>
        </div>
      </div>

      {/* --- 2. BOTTOM TOOLBAR --- */}
      <div className="bg-[#0f111a]/90 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 flex justify-between items-center shadow-2xl relative z-40">
        
        {/* Map Styles */}
        <ControlButton 
            active={mapStyle === 'satellite'} 
            onClick={() => setMapStyle('satellite')} 
            icon={<MapIcon className="w-4 h-4" />} 
            label="Sat" 
        />
        <ControlButton 
            active={mapStyle === 'streets'} 
            onClick={() => setMapStyle('streets')} 
            icon={<Layers className="w-4 h-4" />} 
            label="Map" 
        />

        <div className="w-px h-6 bg-white/10 mx-1"></div>

        {/* 3D Toggle */}
        <ControlButton 
            active={is3D} 
            onClick={() => setIs3D(!is3D)} 
            icon={<Box className="w-4 h-4" />} 
            label="3D" 
        />

        {/* Draw Button */}
        <button
            onClick={() => setDrawMode(drawMode === 'draw_polygon' ? 'simple_select' : 'draw_polygon')}
            className={`flex flex-col items-center justify-center w-14 py-1.5 rounded-xl transition-all duration-200 group relative ${
                drawMode === 'draw_polygon'
                ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-105' 
                : 'hover:bg-white/5 text-gray-400 hover:text-white'
            }`}
        >
            <PenTool className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] font-bold">Draw</span>
            {/* Pulsing indicator when active */}
            {drawMode === 'draw_polygon' && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
            )}
        </button>

        {/* NEW: DELETE BUTTON WITH LEFT-SIDE POPOVER */}
        {hasDrawing && (
            <div className="relative">
                 {/* Confirmation Popover (Moved to the LEFT) */}
                 {showClearConfirm && (
                    <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-[#0f111a] border border-red-500/50 rounded-xl p-2 shadow-2xl flex items-center gap-2 z-50 min-w-[140px] animate-in fade-in slide-in-from-right-2">
                        <span className="text-[10px] text-white font-bold whitespace-nowrap pl-1">Delete design?</span>
                        <div className="flex gap-1">
                            <button 
                                onClick={handleConfirmClear}
                                className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white p-1 rounded-lg transition-colors"
                                title="Confirm Delete"
                            >
                                <Check className="w-3 h-3" />
                            </button>
                            <button 
                                onClick={() => setShowClearConfirm(false)}
                                className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
                                title="Cancel"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                        {/* Little arrow pointing right (towards the button) */}
                        <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-[#0f111a] border-t border-r border-red-500/50 rotate-45"></div>
                    </div>
                 )}

                 <button
                    onClick={() => setShowClearConfirm(!showClearConfirm)}
                    className={`flex flex-col items-center justify-center w-14 py-1.5 rounded-xl transition-all duration-200 ml-1 border-l border-white/10 ${
                        showClearConfirm 
                        ? 'bg-red-500/10 text-red-400' 
                        : 'hover:bg-red-500/20 text-gray-400 hover:text-red-400'
                    }`}
                    title="Clear Design"
                >
                    <Trash2 className="w-4 h-4 mb-0.5" />
                    <span className="text-[9px] font-bold">Clear</span>
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

// Reusable Control Button Component
const ControlButton = ({ active, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-14 py-1.5 rounded-xl transition-all duration-200 group ${
            active 
            ? 'bg-white/10 text-white border border-white/5' 
            : 'hover:bg-white/5 text-gray-400 hover:text-white'
        }`}
    >
        <div className={`mb-0.5 transition-transform group-hover:scale-110 ${active ? 'scale-110 text-indigo-400' : ''}`}>
            {icon}
        </div>
        <span className={`text-[9px] font-medium tracking-wide ${active ? 'text-white' : ''}`}>{label}</span>
    </button>
);
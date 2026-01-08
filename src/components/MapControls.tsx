import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Layers, Box, PenTool, Map as MapIcon, Loader2, X, Trash2, Check, Menu } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { useMapStore } from '../stores/mapStore';
import { useProjectStore } from '../stores/useProjectStore';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

interface SearchResult { id: string; place_name: string; center: [number, number]; }

export const MapControls = () => {
  const { t } = useTranslation();
  const { measurementSystem, setMeasurementSystem } = useSettingsStore();
  const { mapStyle, setMapStyle, drawMode, setDrawMode, setFlyToCoords, is3D, setIs3D } = useMapStore();
  const { land, clearProject } = useProjectStore();
  
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Menu lateral
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const hasDrawing = !!land.geometry;

  const handleConfirmClear = () => { clearProject(); setDrawMode('simple_select'); setShowClearConfirm(false); };
  const handleDrawToggle = () => {
      if (drawMode === 'draw_polygon') { setDrawMode('simple_select'); } else { setDrawMode('draw_polygon'); if (is3D) setIs3D(false); }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchValue.length < 3) { setSearchResults([]); setShowResults(false); return; }
      setIsSearching(true);
      try {
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchValue)}.json?access_token=${MAPBOX_TOKEN}&types=address,poi&limit=5`);
        const data = await response.json();
        if (data.features) { setSearchResults(data.features.map((f: any) => ({ id: f.id, place_name: f.place_name, center: f.center }))); setShowResults(true); }
      } catch (error) { console.error("Search error:", error); } finally { setIsSearching(false); }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  const handleSelectLocation = (result: SearchResult) => { setFlyToCoords(result.center); setSearchValue(result.place_name); setShowResults(false); };
  const clearSearch = () => { setSearchValue(''); setSearchResults([]); setShowResults(false); };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => { if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) { setShowResults(false); } };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full h-full pointer-events-none flex flex-col justify-between">
      
      {/* 1. TOPO: BARRA DE BUSCA (Centralizada) */}
      <div className="pointer-events-auto w-full max-w-md mx-auto relative z-50 p-2" ref={searchContainerRef}>
        <div className="relative group shadow-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {isSearching ? <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" /> : <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />}
            </div>
            <input 
                type="text" value={searchValue} 
                onChange={(e) => { setSearchValue(e.target.value); if(e.target.value.length === 0) setShowResults(false); }} 
                onFocus={() => { if(searchResults.length > 0) setShowResults(true); }} 
                className="block w-full pl-10 pr-10 py-3 bg-[#0f111a]/95 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm shadow-black/50" 
                placeholder={t('map.search_placeholder')} 
            />
            {searchValue && <button onClick={clearSearch} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"><X className="h-4 w-4" /></button>}
            
            {showResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-[#0f111a] border border-gray-700 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar z-[100]">
                    <ul>{searchResults.map((result) => ( <li key={result.id} onMouseDown={(e) => { e.preventDefault(); handleSelectLocation(result); }} className="px-4 py-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-0 transition-colors group"><div className="text-xs font-bold text-white truncate group-hover:text-indigo-400">{result.place_name.split(',')[0]}</div><div className="text-[10px] text-gray-400 truncate">{result.place_name}</div></li> ))}</ul>
                </div>
            )}
        </div>
      </div>

      {/* 2. LATERAL DIREITA: BOTÕES (Vertical Stack) */}
      <div className="pointer-events-auto absolute right-2 top-20 flex flex-col gap-2 z-40">
          <ControlButton active={mapStyle === 'satellite'} onClick={() => setMapStyle(mapStyle === 'satellite' ? 'streets' : 'satellite')} icon={<MapIcon className="w-5 h-5" />} />
          <ControlButton active={is3D} onClick={() => setIs3D(!is3D)} icon={<Box className="w-5 h-5" />} />
          
          <button onClick={handleDrawToggle} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg backdrop-blur-md border ${drawMode === 'draw_polygon' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-black/60 border-white/10 text-gray-300 hover:bg-black/80'}`}>
              <PenTool className="w-5 h-5" />
          </button>

          {hasDrawing && (
             <div className="relative group">
                 {showClearConfirm && (
                    <div className="absolute right-full top-0 mr-2 bg-red-900/90 text-white text-[10px] p-2 rounded-lg whitespace-nowrap font-bold flex gap-2 items-center">
                        Confirmar? 
                        <button onClick={handleConfirmClear} className="bg-white/20 p-1 rounded hover:bg-white/40"><Check className="w-3 h-3"/></button>
                    </div>
                 )}
                 <button onClick={() => setShowClearConfirm(!showClearConfirm)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/60 border border-white/10 text-red-400 hover:bg-red-500/20 hover:text-red-200 transition-all shadow-lg backdrop-blur-md">
                    <Trash2 className="w-5 h-5" />
                </button>
             </div>
          )}
      </div>

    </div>
  );
};

const ControlButton = ({ active, onClick, icon }: any) => (
    <button onClick={onClick} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg backdrop-blur-md border ${active ? 'bg-white/20 border-white/30 text-white' : 'bg-black/60 border-white/10 text-gray-300 hover:bg-black/80'}`}>
        {icon}
    </button>
);
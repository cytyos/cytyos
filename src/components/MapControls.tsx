import React, { useState } from 'react';
import { Search, Layers, Box, PenTool, Map as MapIcon, Loader2 } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { useMapStore } from '../stores/mapStore';

// TOKEN DO MAPBOX (Tenta ler do .env ou usa string vazia para evitar crash se não configurado)
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

export const MapControls = () => {
  // Estados Globais (Conectados às Stores)
  const { measurementSystem, setMeasurementSystem } = useSettingsStore();
  const { mapStyle, setMapStyle, drawMode, setDrawMode, setFlyToCoords, is3D, setIs3D } = useMapStore();
  
  // Estado Local da Busca
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Função de Busca Real (Geocoding)
  const handleSearch = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchValue.length > 3) {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchValue)}.json?access_token=${MAPBOX_TOKEN}`
        );
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          setFlyToCoords([lng, lat]); // Manda o mapa voar para o local
        }
      } catch (error) {
        console.error("Erro na busca:", error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 w-[90vw] max-w-md mx-auto pointer-events-auto">
      
      {/* --- 1. BARRA DE BUSCA + SELETOR DE UNIDADES --- */}
      <div className="flex gap-2 w-full">
        
        {/* Caixa de Busca Funcional */}
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
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearch}
                className="block w-full pl-10 pr-3 py-2.5 bg-[#0f111a]/90 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm shadow-xl"
                placeholder="Search location (City, Address)..."
            />
        </div>

        {/* Toggle M / FT */}
        <div className="bg-[#0f111a]/90 backdrop-blur-md border border-white/10 rounded-xl p-1 flex items-center shadow-xl">
            <button
                onClick={() => setMeasurementSystem('metric')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
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
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    measurementSystem === 'imperial' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white'
                }`}
            >
                FT
            </button>
        </div>
      </div>

      {/* --- 2. BARRA DE FERRAMENTAS INFERIOR --- */}
      <div className="bg-[#0f111a]/90 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 flex justify-between items-center shadow-2xl">
        
        {/* Estilos de Mapa */}
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

        {/* 3D Toggle (AGORA FUNCIONAL) */}
        <ControlButton 
            active={is3D} 
            onClick={() => setIs3D(!is3D)} 
            icon={<Box className="w-4 h-4" />} 
            label="3D" 
        />

        {/* Botão Draw (Desenhar) */}
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
            {/* Indicador pulsante quando ativo */}
            {drawMode === 'draw_polygon' && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
            )}
        </button>

      </div>
    </div>
  );
};

// Componente Visual para Botões Padrão
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
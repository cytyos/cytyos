import { create } from 'zustand';

interface MapStore {
  mapStyle: 'satellite' | 'streets' | 'dark';
  setMapStyle: (style: 'satellite' | 'streets' | 'dark') => void;
  
  drawMode: 'simple_select' | 'draw_polygon' | 'static';
  setDrawMode: (mode: 'simple_select' | 'draw_polygon' | 'static') => void;
  
  flyToCoords: [number, number] | null;
  setFlyToCoords: (coords: [number, number] | null) => void;

  is3D: boolean;
  setIs3D: (is3D: boolean) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  // MUDANÇA AQUI: O padrão agora é 'streets' (Mapa Claro)
  mapStyle: 'streets', 
  setMapStyle: (style) => set({ mapStyle: style }),
  
  drawMode: 'simple_select',
  setDrawMode: (mode) => set({ drawMode: mode }),
  
  flyToCoords: null,
  setFlyToCoords: (coords) => set({ flyToCoords: coords }),

  is3D: false,
  setIs3D: (val) => set({ is3D: val }),
}));
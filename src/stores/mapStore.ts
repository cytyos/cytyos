import { create } from 'zustand';

interface MapStore {
  mapInstance: any;
  setMapInstance: (map: any) => void;
  
  mapStyle: string;
  setMapStyle: (style: string) => void;
  drawMode: string;
  setDrawMode: (mode: string) => void;
  flyToCoords: [number, number] | null;
  setFlyToCoords: (coords: [number, number] | null) => void;
  is3D: boolean;
  setIs3D: (is3D: boolean) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  mapInstance: null,
  setMapInstance: (map) => set({ mapInstance: map }),
  
  mapStyle: 'satellite',
  setMapStyle: (style) => set({ mapStyle: style }),
  drawMode: 'simple_select',
  setDrawMode: (mode) => set({ drawMode: mode }),
  flyToCoords: null,
  setFlyToCoords: (coords) => set({ flyToCoords: coords }),
  is3D: false,
  setIs3D: (is3D) => set({ is3D }),
}));
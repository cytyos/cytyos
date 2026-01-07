import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import * as turf from '@turf/turf';
import { useTranslation } from 'react-i18next'; 

import { useSettingsStore } from '../../stores/settingsStore';
import { useProjectStore } from '../../stores/useProjectStore';
import { useMapStore } from '../../stores/mapStore';
import { useAIStore } from '../../stores/aiStore';
import { scoutLocation } from '../../services/aiService';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || ''; 
const DEFAULT_CENTER: [number, number] = [-80.1918, 25.7617]; 

export const MapboxMap = () => {
  const { i18n } = useTranslation();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  const [pulseState, setPulseState] = useState<'high' | 'low'>('low');

  const { blocks, updateLand, addBlock } = useProjectStore();
  const { mapStyle, drawMode, setDrawMode, flyToCoords, is3D } = useMapStore();
  const { setThinking, setMessage } = useAIStore();

  useEffect(() => {
    const interval = setInterval(() => {
        setPulseState(prev => prev === 'low' ? 'high' : 'low');
    }, 2000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!map.current || !map.current.getLayer('project-body')) return;
    if (pulseState === 'high') {
        map.current.setPaintProperty('project-body', 'fill-extrusion-opacity', 0.8);
        map.current.setPaintProperty('project-glow', 'line-width', 15);
    } else {
        map.current.setPaintProperty('project-body', 'fill-extrusion-opacity', 0.35);
        map.current.setPaintProperty('project-glow', 'line-width', 4);
    }
  }, [pulseState]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle === 'satellite' ? 'mapbox://styles/mapbox/satellite-streets-v12' : 'mapbox://styles/mapbox/dark-v11',
      center: DEFAULT_CENTER,
      zoom: 15.5,
      pitch: 60, 
      bearing: -20,
      antialias: true,
      attributionControl: false 
    });
    map.current = m;

    m.addControl(new mapboxgl.NavigationControl(), 'top-right');

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: false, trash: false },
      defaultMode: 'simple_select'
    });
    drawRef.current = draw;
    m.addControl(draw);

    m.on('load', () => {
        // Setup layers (simplificado para o exemplo)
        if (!m.getSource('project-source')) {
            m.addSource('project-source', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
            m.addLayer({ id: 'project-body', type: 'fill-extrusion', source: 'project-source', paint: { 'fill-extrusion-color': '#00f3ff', 'fill-extrusion-height': 12, 'fill-extrusion-opacity': 0.4 } });
            m.addLayer({ id: 'project-glow', type: 'line', source: 'project-source', paint: { 'line-color': '#00f3ff', 'line-width': 4 } });
        }
        // Load existing blocks logic here if needed
    });

    // Tooltip logic
    m.on('mousemove', (e) => {
       // ... (Mantenha lógica de tooltip existente)
    });

    // --- CRITICAL EVENT: DRAW COMPLETE ---
    m.on('draw.create', async (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        draw.deleteAll();
        useMapStore.getState().setDrawMode('simple_select');
        
        const area = Math.round(turf.area(feature));
        let centerCoords = [0, 0];
        try {
            const centroid = turf.centroid(feature);
            centerCoords = centroid.geometry.coordinates;
        } catch (err) {
            centerCoords = feature.geometry.coordinates[0][0];
        }

        updateLand({ area: area, geometry: feature.geometry });
        addBlock({
            name: 'Podium Base', type: 'podium', usage: 'residential', isCustom: true,
            coordinates: feature.geometry.coordinates, setback: 0, baseArea: area, height: 12, color: '#00f3ff' 
        });
        useMapStore.getState().setIs3D(true); 

        // --- CALL AI ---
        setThinking(true);
        try {
            const aiResponse = await scoutLocation(centerCoords, area, i18n.language);
            setMessage(aiResponse);
        } catch (err) {
            setMessage("Unable to analyze location.");
        }
    });
  }, []);

  // ... (Mantenha os useEffects de reação a mudanças de estilo/3D/flyTo)

  return (
    <>
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
        <div ref={tooltipRef} className="absolute pointer-events-none bg-black/80 text-white text-[10px] px-2 py-1 rounded border border-white/20 font-mono z-50 hidden shadow-xl backdrop-blur-sm" style={{ transform: 'translate(-50%, -100%)' }}>0 m</div>
    </>
  );
};
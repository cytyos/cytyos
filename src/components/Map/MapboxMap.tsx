import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import * as turf from '@turf/turf';

import { useSettingsStore } from '../../stores/settingsStore';
import { useProjectStore } from '../../stores/useProjectStore';
import { useMapStore } from '../../stores/mapStore';

// Get Token
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || ''; 

// Miami Brickell Center
const DEFAULT_CENTER = [-80.1918, 25.7617];

export const MapboxMap = () => {
  const { t } = useTranslation();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  const { blocks, updateLand, addBlock } = useProjectStore();
  const { mapStyle, drawMode, setDrawMode, flyToCoords, is3D } = useMapStore();

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || MAPBOX_TOKEN;

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle === 'satellite' ? 'mapbox://styles/mapbox/satellite-streets-v12' : 'mapbox://styles/mapbox/dark-v11',
      center: DEFAULT_CENTER as [number, number],
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
      loadAllLayers(m);
    });

    // --- RULER ---
    m.on('mousemove', (e) => {
        if (!drawRef.current || !tooltipRef.current) return;
        const mode = drawRef.current.getMode();
        if (mode === 'draw_polygon') {
            const data = drawRef.current.getAll();
            const currentFeature = data.features[data.features.length - 1];
            if (currentFeature && currentFeature.geometry.type === 'Polygon') {
                const coords = currentFeature.geometry.coordinates[0];
                if (coords.length > 0) {
                    const lastPoint = coords[coords.length - 2]; 
                    if (lastPoint) {
                        const from = turf.point(lastPoint);
                        const to = turf.point([e.lngLat.lng, e.lngLat.lat]);
                        const distance = turf.distance(from, to, { units: 'meters' });
                        
                        let text = '';
                        const isImp = useSettingsStore.getState().measurementSystem === 'imperial';
                        text = isImp 
                            ? `${(distance * 3.28084).toFixed(0)} ft` 
                            : `${distance.toFixed(0)} m`;

                        tooltipRef.current.style.display = 'block';
                        tooltipRef.current.style.left = `${e.point.x + 15}px`;
                        tooltipRef.current.style.top = `${e.point.y + 15}px`;
                        tooltipRef.current.innerText = text;
                        return;
                    }
                }
            }
        }
        tooltipRef.current.style.display = 'none';
    });
    
    m.on('mouseout', () => {
        if (tooltipRef.current) tooltipRef.current.style.display = 'none';
    });

    // --- DRAW CREATE ---
    m.on('draw.create', (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        draw.deleteAll();
        setDrawMode('simple_select');
        if (tooltipRef.current) tooltipRef.current.style.display = 'none';

        const area = turf.area(feature);
        
        updateLand({ area: Math.round(area), geometry: feature.geometry });
        
        // CORRECTION: Force the Cyan/Indigo look immediately upon creation
        // We use 'residential' as default which maps to Cyan in our store
        addBlock({
            name: 'Podium Base',
            type: 'podium',
            usage: 'residential', 
            isCustom: true,
            coordinates: feature.geometry.coordinates,
            setback: 0,
            baseArea: area,
            height: 12,
            color: '#00f3ff' // Force Cyan Neon
        });

        useMapStore.getState().setIs3D(true); 
    });

  }, []);

  // --- REACTIONS ---
  useEffect(() => {
      if (!map.current) return;
      map.current.easeTo({ pitch: is3D ? 60 : 0, bearing: is3D ? -20 : 0, duration: 1500 });
  }, [is3D]);

  useEffect(() => {
      if (!map.current) return;
      const styleUrl = mapStyle === 'satellite' ? 'mapbox://styles/mapbox/satellite-streets-v12' : 'mapbox://styles/mapbox/dark-v11';
      map.current.setStyle(styleUrl);
      map.current.once('style.load', () => loadAllLayers(map.current!));
  }, [mapStyle]);

  useEffect(() => {
      if (!drawRef.current) return;
      if (drawMode === 'draw_polygon') {
          drawRef.current.changeMode('draw_polygon');
          map.current?.getCanvas().style.setProperty('cursor', 'crosshair');
      } else {
          drawRef.current.changeMode('simple_select');
          map.current?.getCanvas().style.removeProperty('cursor');
          if (tooltipRef.current) tooltipRef.current.style.display = 'none';
      }
  }, [drawMode]);

  useEffect(() => {
      if (flyToCoords && map.current) {
          map.current.flyTo({ center: flyToCoords, zoom: 17, pitch: 45, duration: 2000 });
          if (!is3D) useMapStore.getState().setIs3D(true);
      }
  }, [flyToCoords]);

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    redrawBlocks(map.current, blocks);
  }, [blocks]);


  // --- VISUAL LAYERS CONFIGURATION ---
  const loadAllLayers = (m: mapboxgl.Map) => {
      safeSetupLayers(m);
      safeAddCityLayer(m); // Add the "Ghost City"
      redrawBlocks(m, useProjectStore.getState().blocks);
  };

  const safeSetupLayers = (m: mapboxgl.Map) => {
      if (m.getSource('project-source')) return;
      
      m.addSource('project-source', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      
      // 1. MAIN BODY (Darker Indigo base to simulate gradient bottom)
      m.addLayer({
          id: 'project-body',
          type: 'fill-extrusion',
          source: 'project-source',
          paint: {
              'fill-extrusion-color': ['get', 'color'], // Dynamic color
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'base'],
              'fill-extrusion-opacity': 0.8,
              // Vertical gradient creates shading
              'fill-extrusion-vertical-gradient': true 
          }
      });

      // 2. NEON RIM (The "Glow" at the top/bottom)
      // Simulates wireframe edges at the footprint
      m.addLayer({
        id: 'project-glow',
        type: 'line',
        source: 'project-source',
        paint: {
            'line-color': '#00f3ff', // Cyan Glow
            'line-width': 3,
            'line-blur': 2,
            'line-opacity': 1
        }
      });
  };

  const redrawBlocks = (m: mapboxgl.Map, currentBlocks: any[]) => {
      const source = m.getSource('project-source') as mapboxgl.GeoJSONSource;
      if (!source) return;
      
      // Calculate Base/Heights
      const podium = currentBlocks.find(b => b.type === 'podium');
      const features = currentBlocks.map(block => {
          if (!block.coordinates) return null;
          let h = block.height;
          let b = 0;
          
          // Stack logic
          if (block.type === 'tower' && podium) { 
              b = podium.height; 
              h = podium.height + block.height; 
          }
          
          return {
              type: 'Feature',
              geometry: { type: 'Polygon', coordinates: block.coordinates },
              properties: { 
                  // If color is undefined, default to Cyan
                  color: block.color || '#00f3ff', 
                  height: h, 
                  base: b 
              }
          };
      }).filter(Boolean);
      
      source.setData({ type: 'FeatureCollection', features: features as any });
  };

  // 3. GHOST CITY (WIRE-LIKE)
  // To simulate "vazado", we use very low opacity.
  // It allows seeing the project THROUGH the buildings.
  const safeAddCityLayer = (m: mapboxgl.Map) => {
    if (m.getLayer('3d-buildings')) return;
    try {
        const labelLayerId = m.getStyle().layers?.find((l) => l.type === 'symbol' && l.layout?.['text-field'])?.id;
        
        m.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 14,
            'paint': { 
                // Dark Gray context
                'fill-extrusion-color': '#333333', 
                'fill-extrusion-height': ['get', 'height'], 
                'fill-extrusion-base': ['get', 'min_height'], 
                
                // CRUCIAL: 5% Opacity makes them "Ghost/Wireframe-like"
                // You can see through them, solving the occlusion issue.
                'fill-extrusion-opacity': 0.05 
            }
        }, labelLayerId);
    } catch (e) {}
  };

  return (
    <>
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
        
        {/* RULER TOOLTIP */}
        <div 
            ref={tooltipRef}
            className="absolute pointer-events-none bg-black/80 text-white text-[10px] px-2 py-1 rounded border border-white/20 font-mono z-50 hidden shadow-xl backdrop-blur-sm"
            style={{ transform: 'translate(-50%, -100%)' }}
        >
            0 m
        </div>
    </>
  );
};
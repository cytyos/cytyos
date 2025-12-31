import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import * as turf from '@turf/turf';

import { useSettingsStore } from '../../stores/settingsStore';
import { useProjectStore } from '../../stores/useProjectStore';
import { useMapStore } from '../../stores/mapStore';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9obmRvZSIsImEiOiJjbHR5eXJ6YnkwMDRoMmtyMHZ6eXJ6YnkwIn0.BxJ7...'; 
const DEFAULT_CENTER = [-46.6333, -23.5505];

export const MapboxMap = () => {
  const { t } = useTranslation();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null); // Referência para o Tooltip da Régua
  
  const { blocks, updateLand, addBlock } = useProjectStore();
  const { measurementSystem } = useSettingsStore();
  const { mapStyle, drawMode, setDrawMode, flyToCoords, is3D } = useMapStore();

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const token = import.meta.env.VITE_MAPBOX_TOKEN || MAPBOX_TOKEN;
    mapboxgl.accessToken = token;

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle === 'satellite' ? 'mapbox://styles/mapbox/satellite-streets-v12' : 'mapbox://styles/mapbox/light-v11',
      center: DEFAULT_CENTER as [number, number],
      zoom: 12,
      pitch: is3D ? 60 : 0, // Inicia respeitando a configuração
      bearing: is3D ? -20 : 0,
      antialias: true,
      attributionControl: false 
    });
    map.current = m;

    m.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: false, trash: false },
      defaultMode: 'simple_select'
    });
    drawRef.current = draw;
    m.addControl(draw);

    m.on('load', () => {
      loadAllLayers(m);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => m.flyTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 16.5 }),
          (err) => console.warn(err)
        );
      }
    });

    // --- LÓGICA DA RÉGUA (MEDIDA EM TEMPO REAL) ---
    m.on('mousemove', (e) => {
        if (!drawRef.current || !tooltipRef.current) return;

        const mode = drawRef.current.getMode();
        
        // Só calcula se estiver desenhando
        if (mode === 'draw_polygon') {
            const data = drawRef.current.getAll();
            // Pega o polígono que está sendo desenhado (o último feature)
            const currentFeature = data.features[data.features.length - 1];

            if (currentFeature && currentFeature.geometry.type === 'Polygon') {
                const coords = currentFeature.geometry.coordinates[0];
                
                // Precisa ter pelo menos 1 ponto clicado + a posição atual do mouse
                if (coords.length > 0) {
                    // O último ponto válido clicado (o penúltimo do array, pois o último é o mouse provisório)
                    // Mapbox Draw as vezes adiciona pontos provisórios, mas vamos pegar o último fixo
                    // Uma forma segura: Pegar a coordenada do mouse 'e.lngLat'
                    const lastPoint = coords[coords.length - 2]; // O último ponto fixado

                    if (lastPoint) {
                        const from = turf.point(lastPoint);
                        const to = turf.point([e.lngLat.lng, e.lngLat.lat]);
                        const distanceKm = turf.distance(from, to); // em km
                        
                        let text = '';
                        
                        // Formatação Métrica vs Imperial
                        // ATENÇÃO: Lendo diretamente do store.getState() seria o ideal, mas aqui vamos assumir métrico por padrão ou tentar pegar da prop
                        // Como 'measurementSystem' está no escopo do componente, vai funcionar, mas cuidado com closures antigas.
                        // Para garantir, vamos fazer o cálculo nas duas unidades ou usar a prop atual.
                        
                        const isImp = useSettingsStore.getState().measurementSystem === 'imperial';

                        if (isImp) {
                            const feet = distanceKm * 3280.84;
                            text = `${feet.toFixed(0)} ft`;
                        } else {
                            const meters = distanceKm * 1000;
                            text = `${meters.toFixed(0)} m`;
                        }

                        // Atualiza o Tooltip
                        tooltipRef.current.style.display = 'block';
                        tooltipRef.current.style.left = `${e.point.x + 15}px`;
                        tooltipRef.current.style.top = `${e.point.y + 15}px`;
                        tooltipRef.current.innerText = text;
                        return;
                    }
                }
            }
        }
        
        // Se não estiver desenhando, esconde
        tooltipRef.current.style.display = 'none';
    });
    
    // Esconde ao sair do mapa
    m.on('mouseout', () => {
        if (tooltipRef.current) tooltipRef.current.style.display = 'none';
    });


    // --- QUANDO FINALIZAR O DESENHO ---
    m.on('draw.create', (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        draw.deleteAll();
        setDrawMode('simple_select');
        if (tooltipRef.current) tooltipRef.current.style.display = 'none'; // Esconde régua

        const area = turf.area(feature);
        const geometry = feature.geometry;

        updateLand({ area: Math.round(area), geometry: geometry });
        
        addBlock({
            name: 'Podium Base',
            type: 'podium',
            usage: 'retail',
            isCustom: true,
            coordinates: geometry.coordinates,
            setback: 0,
            baseArea: area,
            height: 9,
            color: '#f59e0b'
        });

        // Força modo 3D ao criar
        useMapStore.getState().setIs3D(true); 
    });

  }, []);

  // --- REAÇÕES AOS ESTADOS ---

  // 1. Toggling 3D (Pitch/Bearing)
  useEffect(() => {
      if (!map.current) return;
      if (is3D) {
          map.current.easeTo({ pitch: 60, bearing: -20, duration: 1500 });
      } else {
          map.current.easeTo({ pitch: 0, bearing: 0, duration: 1500 });
      }
  }, [is3D]);

  // 2. Toggling Style
  useEffect(() => {
      if (!map.current) return;
      const styleUrl = mapStyle === 'satellite' ? 'mapbox://styles/mapbox/satellite-streets-v12' : 'mapbox://styles/mapbox/light-v11';
      map.current.setStyle(styleUrl);
      map.current.once('style.load', () => loadAllLayers(map.current!));
  }, [mapStyle]);

  // 3. Toggling Draw Mode
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

  // 4. Fly To
  useEffect(() => {
      if (flyToCoords && map.current) {
          map.current.flyTo({ center: flyToCoords, zoom: 17, pitch: 45, duration: 2000 });
          // Ao buscar, liga o 3D automaticamente
          if (!is3D) useMapStore.getState().setIs3D(true);
      }
  }, [flyToCoords]);

  // 5. Update Blocks
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    redrawBlocks(map.current, blocks);
  }, [blocks]);


  // --- HELPERS ---
  const loadAllLayers = (m: mapboxgl.Map) => {
      safeSetupLayers(m);
      safeAddCityLayer(m);
      redrawBlocks(m, useProjectStore.getState().blocks);
  };

  const safeSetupLayers = (m: mapboxgl.Map) => {
      if (m.getSource('project-source')) return;
      m.addSource('project-source', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      m.addLayer({
          id: 'project-layer',
          type: 'fill-extrusion',
          source: 'project-source',
          paint: {
              'fill-extrusion-color': ['get', 'color'],
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'base'],
              'fill-extrusion-opacity': 0.95
          }
      });
  };

  const redrawBlocks = (m: mapboxgl.Map, currentBlocks: any[]) => {
      const source = m.getSource('project-source') as mapboxgl.GeoJSONSource;
      if (!source) return;
      const podium = currentBlocks.find(b => b.type === 'podium');
      const features = currentBlocks.map(block => {
          if (!block.coordinates) return null;
          let h = block.height;
          let b = 0;
          if (block.type === 'tower' && podium) { b = podium.height; h = podium.height + block.height; }
          return {
              type: 'Feature',
              geometry: { type: 'Polygon', coordinates: block.coordinates },
              properties: { color: block.color, height: h, base: b }
          };
      }).filter(Boolean);
      source.setData({ type: 'FeatureCollection', features: features as any });
  };

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
            'paint': { 'fill-extrusion-color': '#aaa', 'fill-extrusion-height': ['get', 'height'], 'fill-extrusion-base': ['get', 'min_height'], 'fill-extrusion-opacity': 0.3 }
        }, labelLayerId);
    } catch (e) {}
  };

  return (
    <>
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
        
        {/* TOOLTIP DA RÉGUA (FLUTUANTE) */}
        <div 
            ref={tooltipRef}
            className="absolute pointer-events-none bg-black/80 text-white text-[10px] px-2 py-1 rounded border border-white/20 font-mono z-50 hidden shadow-xl backdrop-blur-sm"
            style={{ transform: 'translate(-50%, -100%)' }}
        >
            0 m
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-7 bg-[#0f111a]/90 backdrop-blur-md border-t border-white/10 z-40 flex justify-center items-center px-4 shadow-lg pointer-events-none">
            <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest text-center">
                {t('footer.disclaimer') || "AI RESULTS MAY VARY. ALWAYS CONSULT A TECHNICAL PROFESSIONAL."}
            </span>
        </div>
    </>
  );
};
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import { useMapStore } from '../../stores/mapStore'; // Adjusted path (../../)
import { useProjectStore } from '../../stores/useProjectStore'; // Adjusted path (../../)
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

// Token handling (Ensure VITE_MAPBOX_TOKEN is in your .env)
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

export const MapboxMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);

  // Global State
  const { mapStyle, drawMode, flyToCoords } = useMapStore();
  const { updateLand, blocks } = useProjectStore();

  const [mapLoaded, setMapLoaded] = useState(false);

  // --- 1. INITIALIZE MAP ---
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-80.1918, 25.7617], // Miami
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      antialias: true
    });

    // Initialize Draw Tools (Neon Style)
    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      defaultMode: 'simple_select',
      styles: [
        // Active Polygon Stroke
        {
          'id': 'gl-draw-polygon-stroke-active',
          'type': 'line',
          'filter': ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          'layout': { 'line-cap': 'round', 'line-join': 'round' },
          'paint': { 'line-color': '#00f3ff', 'line-width': 2 }
        },
        // Active Polygon Fill
        {
          'id': 'gl-draw-polygon-fill-active',
          'type': 'fill',
          'filter': ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          'paint': { 'fill-color': '#00f3ff', 'fill-opacity': 0.1 }
        },
        // Vertex Points
        {
          'id': 'gl-draw-polygon-and-line-vertex-active',
          'type': 'circle',
          'filter': ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
          'paint': { 'circle-radius': 5, 'circle-color': '#fff' }
        }
      ]
    });

    map.current.addControl(draw.current);

    // Load Event
    map.current.on('load', () => {
      setMapLoaded(true);
      if (map.current) add3DBuildings(map.current);
    });

    // Draw Events -> Sync with Store
    const updateArea = (e: any) => {
      const data = draw.current?.getAll();
      if (data && data.features.length > 0) {
        const geometry = data.features[0].geometry;
        const area = turf.area(data);
        updateLand({ area: Math.round(area), geometry });
      }
    };

    map.current.on('draw.create', updateArea);
    map.current.on('draw.delete', () => updateLand({ area: 0, geometry: null }));
    map.current.on('draw.update', updateArea);

  }, []);

  // --- 2. HANDLE MAP STYLE ---
  useEffect(() => {
    if (!map.current) return;
    const styleUrl = mapStyle === 'satellite' 
      ? 'mapbox://styles/mapbox/satellite-streets-v12' 
      : 'mapbox://styles/mapbox/dark-v11';
    
    map.current.setStyle(styleUrl);
    
    map.current.once('style.load', () => {
      if (map.current) add3DBuildings(map.current);
    });
  }, [mapStyle]);

  // --- 3. HANDLE DRAW MODE ---
  useEffect(() => {
    if (!draw.current) return;
    if (drawMode === 'draw_polygon') {
      draw.current.changeMode('draw_polygon');
    } else {
      draw.current.changeMode('simple_select');
    }
  }, [drawMode]);

  // --- 4. HANDLE FLY TO ---
  useEffect(() => {
    if (map.current && flyToCoords) {
      map.current.flyTo({
        center: flyToCoords,
        zoom: 17,
        pitch: 45,
        essential: true
      });
    }
  }, [flyToCoords]);

  // --- 5. RENDER 3D BLOCKS (VOLUMETRY) ---
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const sourceId = 'blocks-source';
    const layerId = 'blocks-layer';

    // Clean up
    if (map.current.getLayer(layerId)) map.current.removeLayer(layerId);
    if (map.current.getSource(sourceId)) map.current.removeSource(sourceId);

    if (blocks.length === 0) return;

    // Generate GeoJSON
    const features = blocks.map(block => {
        if (!block.coordinates) return null;
        return {
            type: 'Feature',
            properties: {
                height: block.height,
                base_height: 0, 
                color: block.color
            },
            geometry: {
                type: 'Polygon',
                coordinates: block.coordinates
            }
        };
    }).filter(Boolean);

    map.current.addSource(sourceId, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: features as any }
    });

    map.current.addLayer({
        'id': layerId,
        'type': 'fill-extrusion',
        'source': sourceId,
        'paint': {
            'fill-extrusion-color': ['get', 'color'],
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'base_height'],
            'fill-extrusion-opacity': 0.8
        }
    });

  }, [blocks, mapLoaded]);

  return <div ref={mapContainer} className="absolute inset-0 w-full h-full" />;
};

// Helper: Add 3D Buildings Layer
const add3DBuildings = (map: mapboxgl.Map) => {
  if (map.getLayer('3d-buildings')) return;
  
  const layers = map.getStyle().layers;
  let labelLayerId;
  for (const layer of layers || []) {
    if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
      labelLayerId = layer.id;
      break;
    }
  }

  map.addLayer(
    {
      'id': '3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 15,
      'paint': {
        'fill-extrusion-color': '#2a2d3d',
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'height']
        ],
        'fill-extrusion-base': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'min_height']
        ],
        'fill-extrusion-opacity': 0.4
      }
    },
    labelLayerId
  );
};
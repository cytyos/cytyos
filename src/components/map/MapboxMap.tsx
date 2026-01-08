// ... imports ...
// (Mantenha os imports iguais aos que já estavam)

export const MapboxMap = () => {
  // ... (refs e states iguais) ...

  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle === 'satellite' ? 'mapbox://styles/mapbox/satellite-streets-v12' : 'mapbox://styles/mapbox/dark-v11',
      center: DEFAULT_CENTER,
      zoom: 15.5,
      pitch: 0,
      bearing: 0,
      antialias: true,
      attributionControl: false 
    });
    map.current = m;

    // --- CORREÇÃO: Zoom no canto Inferior Direito ---
    m.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: false, trash: false },
      defaultMode: 'simple_select'
    });
    drawRef.current = draw;
    m.addControl(draw);

    m.on('load', () => loadAllLayers(m));

    // ... (restante dos listeners de mousemove, draw.create etc. iguais) ...
  }, []); // Dependência vazia, roda uma vez

  // ... (restante dos useEffects e funções auxiliares iguais) ...

  return (
    <>
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
        <div ref={tooltipRef} className="absolute pointer-events-none bg-black/80 text-white text-[10px] px-2 py-1 rounded border border-white/20 font-mono z-50 hidden shadow-xl backdrop-blur-sm" style={{ transform: 'translate(-50%, -100%)' }}>0 m</div>
    </>
  );
};
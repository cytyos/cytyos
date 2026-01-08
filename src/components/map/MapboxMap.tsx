// --- TRIGGER: WHEN POLYGON IS CLOSED ---
    m.on('draw.create', async (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        // 1. UI FEEDBACK IMMEDIATELY
        draw.deleteAll();
        useMapStore.getState().setDrawMode('simple_select');
        if (tooltipRef.current) tooltipRef.current.style.display = 'none';

        // 2. OPEN AI CHAT IMMEDIATELY (Set Thinking triggers the popup)
        setThinking(true); 
        setMessage(""); // Clear previous messages

        // 3. Process Geography
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

        // 4. Call AI Service (Async)
        try {
            const aiResponse = await scoutLocation(centerCoords, area, i18n.language);
            setMessage(aiResponse);
        } catch (err) {
            setMessage("AI Service Unavailable.");
        } finally {
            setThinking(false); // Stop spinner, show content
        }
    });
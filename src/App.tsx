import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- IMPORTAÇÕES CORRETAS ---
// Certifique-se que o arquivo está na pasta src/pages/
import { LandingPage } from './pages/LandingPage'; 

// Certifique-se que o arquivo está na pasta src/components/map/ com M maiúsculo
import { MapboxMap } from './components/map/MapboxMap'; 

import { MapControls } from './components/MapControls';
import { SmartPanel } from './components/SmartPanel';
import { PaywallModal } from './components/PaywallModal';
import { useSettingsStore } from './stores/settingsStore';

function App() {
  return (
    <BrowserRouter>
      <PaywallGlobal />
      <Routes>
        {/* ROTA 1: Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* ROTA 2: Plataforma (App) */}
        <Route path="/app" element={
          <div className="h-screen w-screen overflow-hidden bg-black relative">
            <MapboxMap />
            
            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4">
              <div className="w-full flex justify-center pt-2">
                 <MapControls />
              </div>
              <SmartPanel />
            </div>
          </div>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

const PaywallGlobal = () => {
  const isPaywallOpen = useSettingsStore((state) => state.isPaywallOpen);
  return isPaywallOpen ? <PaywallModal /> : null;
};

export default App;
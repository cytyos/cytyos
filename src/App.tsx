import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { Map } from './components/Map';
import { MapControls } from './components/MapControls';
import { SmartPanel } from './components/SmartPanel';
import { PaywallModal } from './components/PaywallModal';
import { useSettingsStore } from './stores/settingsStore';

function App() {
  return (
    <BrowserRouter>
      {/* Componente para renderizar o Paywall globalmente se o estado estiver true */}
      <PaywallGlobal />

      <Routes>
        {/* Home: Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* App: Plataforma Principal */}
        <Route path="/app" element={
          <div className="h-screen w-screen overflow-hidden bg-black relative">
            <Map />
            
            {/* UI Overlay */}
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

// Pequeno helper para conectar o Store com o Router sem complicar o App principal
const PaywallGlobal = () => {
  const isPaywallOpen = useSettingsStore((state) => state.isPaywallOpen);
  return isPaywallOpen ? <PaywallModal /> : null;
};

export default App;
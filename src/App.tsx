import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CityMap } from './components/map/CityMap'; // <--- IMPORTANDO O NOVO ARQUIVO
import { MapControls } from './components/MapControls';
import { SmartPanel } from './components/SmartPanel';
import { PaywallModal } from './components/PaywallModal';
import { useSettingsStore } from './stores/settingsStore';

function App() {
  return (
    <BrowserRouter>
      {/* Global Paywall Listener */}
      <PaywallGlobal />

      <Routes>
        {/* Route 1: Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Route 2: App Principal */}
        <Route path="/app" element={
          <div className="h-screen w-screen overflow-hidden bg-black relative">
            {/* NOVO MAPA AQUI */}
            <CityMap />
            
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

const PaywallGlobal = () => {
  const isPaywallOpen = useSettingsStore((state) => state.isPaywallOpen);
  return isPaywallOpen ? <PaywallModal /> : null;
};

export default App;
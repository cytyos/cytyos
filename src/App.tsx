import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { MapboxMap } from './components/map/MapboxMap'; // Caminho verificado
import { MapControls } from './components/MapControls';
import { SmartPanel } from './components/SmartPanel';
import { PaywallModal } from './components/PaywallModal';
import { useSettingsStore } from './stores/settingsStore';

function App() {
  return (
    <BrowserRouter>
      {/* Global Paywall (Overlay) */}
      <PaywallGlobal />

      <Routes>
        {/* Rota 1: Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Rota 2: App Principal */}
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

        {/* Rota 3: Redirecionamento Padrão */}
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
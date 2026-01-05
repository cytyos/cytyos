import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { MapboxMap } from './components/map/mapboxmap'; // CORRECT IMPORT PATH
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
        {/* LANDING PAGE */}
        <Route path="/" element={<LandingPage />} />
        
        {/* PLATFORM APP */}
        <Route path="/app" element={
          <div className="h-screen w-screen overflow-hidden bg-black relative">
            {/* Map Component */}
            <MapboxMap />
            
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

// Helper for Global Paywall Logic
const PaywallGlobal = () => {
  const isPaywallOpen = useSettingsStore((state) => state.isPaywallOpen);
  return isPaywallOpen ? <PaywallModal /> : null;
};

export default App;
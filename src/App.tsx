import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { MapboxMap } from './components/map/mapboxmap'; // <--- PATH CORRECTED
import { MapControls } from './components/MapControls';
import { SmartPanel } from './components/SmartPanel';
import { PaywallModal } from './components/PaywallModal';
import { useSettingsStore } from './stores/settingsStore';

function App() {
  return (
    <BrowserRouter>
      {/* Global Paywall Overlay (if triggered) */}
      <PaywallGlobal />

      <Routes>
        {/* Route: Landing Page (Home) */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Route: Main App Platform */}
        <Route path="/app" element={
          <div className="h-screen w-screen overflow-hidden bg-black relative">
            {/* 1. Map Layer */}
            <MapboxMap />
            
            {/* 2. UI Overlay */}
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

// Helper to render Paywall outside the Routes if needed
const PaywallGlobal = () => {
  const isPaywallOpen = useSettingsStore((state) => state.isPaywallOpen);
  return isPaywallOpen ? <PaywallModal /> : null;
};

export default App;
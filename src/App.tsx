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
      {/* Global Paywall Listener (Overlay) */}
      <PaywallGlobal />

      <Routes>
        {/* Route: Landing Page (Home) */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Route: Main App Platform */}
        <Route path="/app" element={
          <div className="h-screen w-screen overflow-hidden bg-black relative">
            {/* Map Layer */}
            <Map />
            
            {/* UI Overlay Controls */}
            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4">
              <div className="w-full flex justify-center pt-2">
                 <MapControls />
              </div>
              <SmartPanel />
            </div>
          </div>
        } />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Helper Component to render the Paywall Modal globally if state is true
const PaywallGlobal = () => {
  const isPaywallOpen = useSettingsStore((state) => state.isPaywallOpen);
  return isPaywallOpen ? <PaywallModal /> : null;
};

export default App;
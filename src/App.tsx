import React from 'react';
import { Map } from './components/Map';
import { SmartPanel } from './components/SmartPanel';
import { MapControls } from './components/MapControls';
import { PaywallModal } from './components/PaywallModal';
import { LandingPage } from './components/LandingPage';
import { useSettingsStore } from './stores/settingsStore';

function App() {
  const isPaywallOpen = useSettingsStore((state) => state.isPaywallOpen);
  const isLandingPageOpen = useSettingsStore((state) => state.isLandingPageOpen);

  // If Landing Page is open, show ONLY Landing Page + Paywall (if triggered)
  if (isLandingPageOpen) {
    return (
      <>
        <LandingPage />
        {isPaywallOpen && <PaywallModal />}
      </>
    );
  }

  // Otherwise, show the Main App
  return (
    <div className="h-screen w-screen overflow-hidden bg-black relative">
      <Map />
      
      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4">
        {/* Top Controls */}
        <div className="w-full flex justify-center pt-2">
           <MapControls />
        </div>

        {/* The Smart Panel handles its own positioning */}
        <SmartPanel />
      </div>

      {isPaywallOpen && <PaywallModal />}
    </div>
  );
}

export default App;
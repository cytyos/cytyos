import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { MapboxMap } from './components/map/MapboxMap'; 
import { MapControls } from './components/MapControls';
import { SmartPanel } from './components/SmartPanel';

// CORREÇÃO: Importando o PricingModal que você tem no projeto
import { PricingModal } from './components/PricingModal'; 

import { useSettingsStore } from './stores/settingsStore';

function App() {
  return (
    <BrowserRouter>
      {/* Componente Global de Paywall */}
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Helper atualizado para usar o PricingModal
const PaywallGlobal = () => {
  const { isPaywallOpen, setPaywallOpen } = useSettingsStore();
  
  // Passamos as props isOpen e onClose para o PricingModal
  return (
    <PricingModal 
      isOpen={isPaywallOpen} 
      onClose={() => setPaywallOpen(false)} 
    />
  );
};

export default App;
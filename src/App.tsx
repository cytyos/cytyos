import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importação das Páginas
import { LandingPage } from './pages/LandingPage';

// Importação dos Componentes
import { MapboxMap } from './components/map/MapboxMap'; 
import { SmartPanel } from './components/SmartPanel';
import { MapControls } from './components/MapControls';
import { PricingModal } from './components/PricingModal';
import { AIAssistant } from './components/AIAssistant'; 
import { Footer } from './components/Footer'; 

// Stores e Configs
import { useSettingsStore } from './stores/settingsStore';
import './i18n';

// --- COMPONENTE DE LAYOUT INTERNO ---
// Definimos o layout do App aqui dentro para evitar erros de importação
const AppLayout = () => {
  const { isPaywallOpen, setPaywallOpen } = useSettingsStore();

  useEffect(() => {
    setPaywallOpen(false);

    const checkAccess = () => {
        const licenseType = localStorage.getItem('cytyos_license_type'); 
        const trialStart = localStorage.getItem('cytyos_trial_start');
        
        if (licenseType === 'VIP') return;

        if (trialStart) {
            const now = Date.now();
            const timePassed = now - parseInt(trialStart);
            const oneHour = 1000 * 60 * 60;
            if (timePassed < oneHour) return; 
        }

        const timer = setTimeout(() => {
            setPaywallOpen(true); 
        }, 60000); 

        return () => clearTimeout(timer);
    };

    const clearTimer = checkAccess();
    return () => {
        if (clearTimer) clearTimer();
    };
  }, [setPaywallOpen]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      
      {/* 1. Modais e IA (Z-Index Máximo) */}
      <PricingModal isOpen={isPaywallOpen} onClose={() => setPaywallOpen(false)} />
      <AIAssistant />

      {/* 2. Mapa (Fundo) */}
      <MapboxMap />

      {/* 3. Interface Flutuante */}
      <SmartPanel />
      
      {/* 4. Controles do Mapa */}
      {/* 'bottom-12' (48px) garante que fique ACIMA do rodapé (32px) */}
      <div className="absolute bottom-12 left-0 w-full flex justify-center z-50 pointer-events-none">
        <MapControls />
      </div>

      {/* 5. Rodapé Global */}
      <Footer />
      
    </div>
  );
};

// --- COMPONENTE PRINCIPAL (ROTEADOR) ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota 1: Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Rota 2: App Principal (Usa o Layout definido acima) */}
        <Route path="/app" element={<AppLayout />} />

        {/* Rota Coringa (Redireciona erros para Home) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
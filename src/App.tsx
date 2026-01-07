import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- IMPORTAÇÕES ---
// Tente importar a LandingPage. Se der erro, verifique se no arquivo LandingPage.tsx está 'export default' ou 'export const'
import { LandingPage } from './pages/LandingPage'; 

import { MapboxMap } from './components/map/MapboxMap'; 
import { MapControls } from './components/MapControls';
import { SmartPanel } from './components/SmartPanel';
import { PricingModal } from './components/PricingModal';
import { AIAssistant } from './components/AIAssistant'; 
import { Footer } from './components/Footer'; // <--- O Novo Rodapé
import { useSettingsStore } from './stores/settingsStore';
import './i18n';

// Helper para o Paywall (Como estava no seu código original)
const PaywallGlobal = () => {
  const { isPaywallOpen, setPaywallOpen } = useSettingsStore();
  return (
    <PricingModal 
      isOpen={isPaywallOpen} 
      onClose={() => setPaywallOpen(false)} 
    />
  );
};

function App() {
  return (
    <BrowserRouter>
      {/* Componentes Globais que flutuam sobre tudo */}
      <PaywallGlobal />
      <AIAssistant />

      <Routes>
        {/* Rota 1: Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Rota 2: App Principal */}
        <Route path="/app" element={
          <div className="h-screen w-screen overflow-hidden bg-gray-900 relative">
            
            {/* 1. Mapa (Fundo) */}
            <MapboxMap />
            
            {/* 2. Container da Interface (Fica por cima do mapa) */}
            {/* pointer-events-none deixa clicar no mapa através do container */}
            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between">
                
                {/* Topo: Vazio ou Header se tiver */}
                <div className="w-full p-4"></div>

                {/* Centro/Baixo: Controles */}
                <div className="w-full flex justify-center pb-16 z-50">
                   {/* pointer-events-auto reativa o clique nos botões */}
                   <div className="pointer-events-auto">
                      <MapControls />
                   </div>
                </div>
            </div>

            {/* 3. Painel Lateral (Já tem posição absoluta própria) */}
            <SmartPanel />

            {/* 4. Rodapé Global (Fixo) */}
            <Footer />
          </div>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
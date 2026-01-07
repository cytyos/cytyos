import React, { useEffect } from 'react';
import { MapboxMap } from '../components/map/MapboxMap'; 
import { SmartPanel } from '../components/SmartPanel';
import { MapControls } from '../components/MapControls';
import { PricingModal } from '../components/PricingModal';
import { AIAssistant } from '../components/AIAssistant'; 
import { Footer } from '../components/Footer'; 
import { useSettingsStore } from '../stores/settingsStore';

export const Platform = () => {
  const { isPaywallOpen, setPaywallOpen } = useSettingsStore();

  useEffect(() => {
    // 1. Segurança: Garante modal fechado ao iniciar
    setPaywallOpen(false);

    const checkAccess = () => {
        const licenseType = localStorage.getItem('cytyos_license_type'); 
        const trialStart = localStorage.getItem('cytyos_trial_start');
        
        // VIPs não têm bloqueio
        if (licenseType === 'VIP') return;

        // Lógica de Trial (1 hora)
        if (trialStart) {
            const now = Date.now();
            const timePassed = now - parseInt(trialStart);
            const oneHour = 1000 * 60 * 60;
            if (timePassed < oneHour) return; 
        }

        // Timer de 60 segundos para bloquear novos usuários
        console.log("⏳ Timer started: Locking in 60 seconds...");
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
      
      {/* --- CAMADA 1: MODAIS (Z-Index Máximo) --- */}
      <PricingModal isOpen={isPaywallOpen} onClose={() => setPaywallOpen(false)} />
      <AIAssistant />

      {/* --- CAMADA 2: MAPA (Fundo, Z-Index 0) --- */}
      <MapboxMap />

      {/* --- CAMADA 3: INTERFACE FLUTUANTE --- */}
      
      {/* Painel Lateral (Já tem posicionamento absoluto interno) */}
      <SmartPanel />
      
      {/* Controles do Mapa */}
      {/* Container invisível (pointer-events-none) para posicionar no centro inferior */}
      {/* 'bottom-12' garante que fique ACIMA do rodapé */}
      <div className="absolute bottom-12 left-0 w-full flex justify-center z-50 pointer-events-none">
        {/* O componente MapControls tem pointer-events-auto internamente */}
        <MapControls />
      </div>

      {/* --- CAMADA 4: RODAPÉ FIXO --- */}
      <Footer />
      
    </div>
  );
}
import React, { useEffect } from 'react';
import { MapboxMap } from '../components/map/MapboxMap'; 
import { SmartPanel } from '../components/SmartPanel';
import { MapControls } from '../components/MapControls';
import { PricingModal } from '../components/PricingModal';
import { AIAssistant } from '../components/AIAssistant'; 
import { Footer } from '../components/Footer'; // <--- VERIFIQUE SE ESTE ARQUIVO EXISTE
import { useSettingsStore } from '../stores/settingsStore';

export const Platform = () => {
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
      
      {/* Modais (Z-Index Máximo) */}
      <PricingModal isOpen={isPaywallOpen} onClose={() => setPaywallOpen(false)} />
      
      {/* Camada de IA */}
      <AIAssistant />

      {/* Mapa (Fundo) */}
      <MapboxMap />

      {/* Painel Lateral */}
      <SmartPanel />
      
      {/* Controles do Mapa */}
      {/* 'bottom-12' (48px) garante que fique ACIMA do Footer (32px) */}
      <div className="absolute bottom-12 left-0 w-full flex justify-center z-50 pointer-events-none">
        <MapControls />
      </div>

      {/* Rodapé Global */}
      <Footer />
      
    </div>
  );
}
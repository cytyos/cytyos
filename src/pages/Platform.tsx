import React, { useEffect } from 'react';
import { MapboxMap } from '../components/map/MapboxMap'; 
import { SmartPanel } from '../components/SmartPanel';
import { MapControls } from '../components/MapControls';
import { PricingModal } from '../components/PricingModal';
import { AIAssistant } from '../components/AIAssistant'; 
import { Footer } from '../components/Footer'; // <--- IMPORTANTE
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
      
      {/* 1. Modais e Overlays */}
      <PricingModal isOpen={isPaywallOpen} onClose={() => setPaywallOpen(false)} />
      <AIAssistant />

      {/* 2. Mapa (Fundo) */}
      <MapboxMap />

      {/* 3. Interface Flutuante */}
      <SmartPanel />
      
      {/* 4. Controles do Mapa */}
      {/* Posicionado bottom-12 (48px) para ficar ACIMA do footer de 32px */}
      <div className="absolute bottom-12 left-0 w-full flex justify-center z-50 pointer-events-none">
        <MapControls />
      </div>

      {/* 5. Rodapé Global (Substituindo o antigo span flutuante) */}
      <Footer />
      
    </div>
  );
}
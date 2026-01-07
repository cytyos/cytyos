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
    // Garante que o modal comece fechado
    setPaywallOpen(false);

    const checkAccess = () => {
        const licenseType = localStorage.getItem('cytyos_license_type'); 
        const trialStart = localStorage.getItem('cytyos_trial_start');
        
        // VIPs (Founders) nunca são bloqueados
        if (licenseType === 'VIP') return;

        // Lógica de Trial (1 hora grátis)
        if (trialStart) {
            const now = Date.now();
            const timePassed = now - parseInt(trialStart);
            const oneHour = 1000 * 60 * 60;
            if (timePassed < oneHour) return; 
        }

        // Timer de 60 segundos para novos usuários
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
      
      {/* 1. Camada de Modais (Z-Index Máximo) */}
      <PricingModal isOpen={isPaywallOpen} onClose={() => setPaywallOpen(false)} />
      <AIAssistant />

      {/* 2. Camada do Mapa (Fundo) */}
      <MapboxMap />

      {/* 3. Interface Flutuante (SmartPanel) */}
      <SmartPanel />
      
      {/* 4. Controles do Mapa */}
      {/* Posicionado bottom-12 para respeitar o rodapé */}
      <div className="absolute bottom-12 left-0 w-full flex justify-center z-50 pointer-events-none">
        <MapControls />
      </div>

      {/* 5. Rodapé Global (Agora vai aparecer!) */}
      <Footer />
      
    </div>
  );
}
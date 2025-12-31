import React, { useEffect } from 'react';
import { MapboxMap } from '../components/Map/MapboxMap';
import { SmartPanel } from '../components/SmartPanel';
import { MapControls } from '../components/MapControls';
import { PricingModal } from '../components/PricingModal';
import { useSettingsStore } from '../stores/settingsStore';

export const Platform = () => {
  const { isPaywallOpen, setPaywallOpen } = useSettingsStore();

  useEffect(() => {
    // 1. SEGURANÇA: Garante que o modal comece FECHADO ao carregar
    setPaywallOpen(false);

    const checkAccess = () => {
        // Verifica memória do navegador
        const licenseType = localStorage.getItem('cytyos_license_type'); 
        const trialStart = localStorage.getItem('cytyos_trial_start');
        
        // Se for VIP (Founder), nunca bloqueia
        if (licenseType === 'VIP') return;

        // Se tiver Trial ativo (< 1 hora), não bloqueia agora
        if (trialStart) {
            const now = Date.now();
            const timePassed = now - parseInt(trialStart);
            const oneHour = 1000 * 60 * 60;
            
            // Se ainda não passou 1 hora desde que validou uma chave, deixa usar
            if (timePassed < oneHour) return; 
        }

        // 3. SE NÃO TIVER ACESSO (Novo Usuário), INICIA O TIMER DE 1 MINUTO
        // Isso dá o "gostinho" (Aha Moment) antes de bloquear
        console.log("⏳ Timer started: Locking in 60 seconds...");
        const timer = setTimeout(() => {
            setPaywallOpen(true); 
        }, 60000); // 60 segundos

        return () => clearTimeout(timer);
    };

    const clearTimer = checkAccess();
    return () => {
        if (clearTimer) clearTimer();
    };
  }, [setPaywallOpen]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      
      {/* PAYWALL (Aparece sozinho após 60s ou se o trial expirou) */}
      <PricingModal isOpen={isPaywallOpen} onClose={() => setPaywallOpen(false)} />

      <MapboxMap />
      <SmartPanel />
      
      <div className="absolute bottom-44 md:bottom-10 left-1/2 -translate-x-1/2 z-30">
        <MapControls />
      </div>

      <div className="absolute bottom-[35px] right-3 z-30 pointer-events-none">
        <span className="bg-black/60 text-white/50 text-[9px] px-2 py-1 rounded-md backdrop-blur-sm border border-white/10 font-mono">
          Cytyos Beta v0.9
        </span>
      </div>
    </div>
  );
}
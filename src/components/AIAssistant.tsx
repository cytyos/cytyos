import React, { useEffect } from 'react';
import { MapboxMap } from '../components/map/MapboxMap'; // Ensure path is correct (Map vs map)
import { SmartPanel } from '../components/SmartPanel';
import { MapControls } from '../components/MapControls';
import { PricingModal } from '../components/PricingModal';
import { AIAssistant } from '../components/AIAssistant'; // <--- NEW COMPONENT
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
      
      <PricingModal isOpen={isPaywallOpen} onClose={() => setPaywallOpen(false)} />
      
      {/* AI LAYER */}
      <AIAssistant />

      <MapboxMap />
      <SmartPanel />
      
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-full flex justify-center">
        <MapControls />
      </div>

      <div className="absolute bottom-[35px] right-3 z-30 pointer-events-auto">
        <span className="bg-black/60 text-white/50 text-[9px] px-2 py-1 rounded-md backdrop-blur-sm border border-white/10 font-mono">
          Cytyos Beta v0.9
        </span>
      </div>
    </div>
  );
}
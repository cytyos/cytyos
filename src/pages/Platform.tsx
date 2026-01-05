import React, { useEffect } from 'react';
import { MapboxMap } from '../components/Map/MapboxMap';
import { SmartPanel } from '../components/SmartPanel';
import { MapControls } from '../components/MapControls';
import { PricingModal } from '../components/PricingModal';
import { useSettingsStore } from '../stores/settingsStore';

export const Platform = () => {
  const { isPaywallOpen, setPaywallOpen } = useSettingsStore();

  useEffect(() => {
    // 1. SECURITY: Ensure modal starts CLOSED
    setPaywallOpen(false);

    const checkAccess = () => {
        // Check browser memory
        const licenseType = localStorage.getItem('cytyos_license_type'); 
        const trialStart = localStorage.getItem('cytyos_trial_start');
        
        // If VIP (Founder), never lock
        if (licenseType === 'VIP') return;

        // If active Trial (< 1 hour), don't lock yet
        if (trialStart) {
            const now = Date.now();
            const timePassed = now - parseInt(trialStart);
            const oneHour = 1000 * 60 * 60;
            
            // If less than 1 hour passed since validation, allow usage
            if (timePassed < oneHour) return; 
        }

        // 3. IF NO ACCESS (New User), START 1 MINUTE TIMER
        // This gives the "Aha Moment" before locking
        console.log("⏳ Timer started: Locking in 60 seconds...");
        const timer = setTimeout(() => {
            setPaywallOpen(true); 
        }, 60000); // 60 seconds

        return () => clearTimeout(timer);
    };

    const clearTimer = checkAccess();
    return () => {
        if (clearTimer) clearTimer();
    };
  }, [setPaywallOpen]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      
      {/* PAYWALL (Appears after 60s or if trial expired) */}
      <PricingModal isOpen={isPaywallOpen} onClose={() => setPaywallOpen(false)} />

      <MapboxMap />
      <SmartPanel />
      
      {/* FIX: Adjusted 'bottom' to avoid overlap with new Footer.
         - 'bottom-20' ensures it floats well above the footer.
         - 'md:bottom-16' gives a bit less space on desktop but still safe.
         - 'pointer-events-none' on wrapper allows clicks to pass through to map, 
           but MapControls inside has 'pointer-events-auto'.
      */}
      <div className="absolute bottom-24 md:bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-full flex justify-center">
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
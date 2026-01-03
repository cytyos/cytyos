import React from 'react';
import { SmartPanel } from './SmartPanel';
import { PaywallModal } from './PaywallModal';
import { MapControls } from './MapControls';
import { useSettingsStore } from '../stores/settingsStore';

export const Layout: React.FC = ({ children }: { children?: React.ReactNode }) => {
  const { isPaywallOpen } = useSettingsStore();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      
      {/* 1. MAP LAYER */}
      <div className="absolute inset-0 z-0">
        {children}
      </div>

      {/* 2. UI LAYER */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        
        {/* Panel Container */}
        <div className="w-full h-full relative">
            <div className="pointer-events-auto">
                <SmartPanel />
            </div>

            {/* Map Controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
                <MapControls />
            </div>

            {/* Credits */}
            <div className="absolute bottom-4 right-4 opacity-60 pointer-events-auto">
                <p className="text-[10px] text-gray-500 bg-white/80 px-2 py-1 rounded backdrop-blur-md border border-gray-200 shadow-sm">
                Cytyos Pro • v2.1 (AI Inside)
                </p>
            </div>
        </div>
      </div>

      {/* 3. MODAL LAYER */}
      {isPaywallOpen && (
        <div className="absolute inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
          <PaywallModal />
        </div>
      )}
    </div>
  );
};
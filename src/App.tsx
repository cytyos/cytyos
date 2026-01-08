import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- IMPORTS ---
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';

// CRITICAL: Ensure MapboxMap is exported as 'export const MapboxMap' in its file
import { MapboxMap } from './components/map/MapboxMap'; 
import { MapControls } from './components/MapControls';
import { SmartPanel } from './components/SmartPanel';
import { PricingModal } from './components/PricingModal';
import { Footer } from './components/Footer'; 

// REMOVED: AIAssistant import is gone

import { useSettingsStore } from './stores/settingsStore';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './i18n';

const AdminPage = () => <div className="p-10 text-white">Admin Dashboard (Under Construction)</div>;

// --- PAYWALL HELPER WITH TIMER ---
const PaywallGlobal = () => {
  const { isPaywallOpen, setPaywallOpen } = useSettingsStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPaywallOpen(true);
    }, 60000); 

    return () => clearTimeout(timer);
  }, [setPaywallOpen]);

  return (
    <PricingModal 
      isOpen={isPaywallOpen} 
      onClose={() => setPaywallOpen(false)} 
    />
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  if (loading) {
      return (
        <div className="h-screen w-screen bg-[#0f111a] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
  }
  
  if (!session) {
      return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
        <PaywallGlobal />
        
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={
                <ProtectedRoute>
                    <AdminPage />
                </ProtectedRoute>
            } />
            
            {/* APP ROUTE (MAIN PLATFORM) */}
            <Route path="/app" element={
                <ProtectedRoute>
                    <div className="h-screen w-screen overflow-hidden bg-gray-900 relative">
                        {/* 1. The Map */}
                        <MapboxMap />
                        
                        {/* 2. UI Layers */}
                        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between">
                            <div className="w-full p-4"></div>

                            <div className="w-full flex justify-center pb-16 z-50">
                                <div className="pointer-events-auto">
                                    <MapControls />
                                </div>
                            </div>
                        </div>

                        {/* 3. Panels & Modals */}
                        <SmartPanel />
                        
                        {/* REMOVED: Floating AI Assistant */}

                        <Footer />
                    </div>
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
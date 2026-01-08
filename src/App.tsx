import React, { useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- EAGER IMPORTS (Load immediately for Landing Page) ---
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { Footer } from './components/Footer'; 
import { useSettingsStore } from './stores/settingsStore';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './i18n';

// --- LAZY IMPORTS (Load only when needed) ---
// This drastically reduces the initial bundle size
const MapboxMap = React.lazy(() => import('./components/map/MapboxMap').then(module => ({ default: module.MapboxMap })));
const SmartPanel = React.lazy(() => import('./components/SmartPanel').then(module => ({ default: module.SmartPanel })));
const MapControls = React.lazy(() => import('./components/MapControls').then(module => ({ default: module.MapControls })));
const PricingModal = React.lazy(() => import('./components/PricingModal').then(module => ({ default: module.PricingModal })));

const AdminPage = () => <div className="p-10 text-white">Admin Dashboard (Under Construction)</div>;

// --- LOADING COMPONENT ---
const LoadingScreen = () => (
  <div className="h-screen w-screen bg-[#0f111a] flex flex-col items-center justify-center space-y-4">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
    </div>
    <span className="text-indigo-400 font-mono text-sm animate-pulse">LOADING ENVIRONMENT...</span>
  </div>
);

// --- PAYWALL HELPER ---
const PaywallGlobal = () => {
  const { isPaywallOpen, setPaywallOpen } = useSettingsStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPaywallOpen(true);
    }, 60000); 

    return () => clearTimeout(timer);
  }, [setPaywallOpen]);

  return (
    <Suspense fallback={null}>
      <PricingModal 
        isOpen={isPaywallOpen} 
        onClose={() => setPaywallOpen(false)} 
      />
    </Suspense>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  if (loading) {
      return <LoadingScreen />;
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
                        {/* Wrap heavy components in Suspense */}
                        <Suspense fallback={<LoadingScreen />}>
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

                            {/* 3. Panels */}
                            <SmartPanel />
                        </Suspense>

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
import React, { useEffect, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'; 
import { X, Monitor } from 'lucide-react'; 

// --- NOVO: Speed Insights (Versão Correta para React) ---
import { SpeedInsights } from "@vercel/speed-insights/react"

// --- EAGER IMPORTS ---
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { Footer } from './components/Footer'; 
import { useSettingsStore } from './stores/settingsStore';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './i18n';

// --- LAZY IMPORTS ---
const MapboxMap = React.lazy(() => import('./components/map/MapboxMap').then(module => ({ default: module.MapboxMap })));
const SmartPanel = React.lazy(() => import('./components/SmartPanel').then(module => ({ default: module.SmartPanel })));
const MapControls = React.lazy(() => import('./components/MapControls').then(module => ({ default: module.MapControls })));
const PricingModal = React.lazy(() => import('./components/PricingModal').then(module => ({ default: module.PricingModal })));
const AdminPage = React.lazy(() => import('./pages/AdminPage').then(module => ({ default: module.AdminPage })));
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage').then(module => ({ default: module.PrivacyPage })));

const FREE_USAGE_MS = 3 * 60 * 1000; 

// --- LOADING SCREEN ---
const LoadingScreen = () => (
  <div className="h-screen w-screen bg-[#0f111a] flex flex-col items-center justify-center space-y-4">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
    </div>
    <span className="text-indigo-400 font-mono text-sm animate-pulse">INITIALIZING SYSTEM...</span>
  </div>
);

// --- MOBILE WARNING ---
const MobileOptimizationWarning = () => {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return null;
  return (
    <div className="md:hidden fixed inset-0 z-[99999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-[#1a1d26] border border-white/10 rounded-2xl p-6 max-w-sm w-full text-center relative shadow-2xl">
        <button onClick={() => setIsVisible(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
        <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><Monitor className="w-6 h-6 text-indigo-400" /></div>
        <h3 className="text-white font-bold text-lg mb-2">Desktop Recommended</h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">Cytyos is a professional 3D analysis tool optimized for large screens. For the best experience, please access via a desktop computer.</p>
        <button onClick={() => setIsVisible(false)} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-colors border border-white/5">Continue on Mobile</button>
      </div>
    </div>
  );
};

// --- PAYWALL CONTROL ---
const PaywallGlobal = () => {
  const { isPaywallOpen, setPaywallOpen } = useSettingsStore();
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    if (!sessionStorage.getItem('cytyos_first_visit')) {
        sessionStorage.setItem('cytyos_first_visit', Date.now().toString());
    }

    const checkAccess = () => {
        if (!location.pathname.startsWith('/app')) return;

        if (localStorage.getItem('cytyos_license_type') === 'VIP') return;
        const trialEnd = localStorage.getItem('cytyos_trial_end');
        if (trialEnd && Date.now() < Number(trialEnd)) return;
        
        const firstVisit = sessionStorage.getItem('cytyos_first_visit');
        if (firstVisit) {
            const elapsed = Date.now() - Number(firstVisit);
            if (elapsed < FREE_USAGE_MS) return; 
        }

        if (!isPaywallOpen) {
            setPaywallOpen(true);
        }
    };

    const interval = setInterval(checkAccess, 2000); 
    checkAccess(); 
    return () => clearInterval(interval);
  }, [setPaywallOpen, isPaywallOpen, location.pathname]); 

  const handleCloseAttempt = () => {
      const isVip = localStorage.getItem('cytyos_license_type') === 'VIP';
      const trialEnd = localStorage.getItem('cytyos_trial_end');
      const hasActiveCoupon = trialEnd && Date.now() < Number(trialEnd);
      
      const firstVisit = sessionStorage.getItem('cytyos_first_visit');
      const timeUsed = firstVisit ? Date.now() - Number(firstVisit) : 99999999;
      const stillInFreeTier = timeUsed < FREE_USAGE_MS;

      if (!isVip && !hasActiveCoupon && !stillInFreeTier) {
          setPaywallOpen(false); 
          navigate('/');          
      } else {
          setPaywallOpen(false); 
      }
  };

  return (
    <Suspense fallback={null}>
      <PricingModal 
        isOpen={isPaywallOpen} 
        onClose={handleCloseAttempt} 
      />
    </Suspense>
  );
};

// --- GUARDS ---
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminGuard = ({ children, allowedEmail }: { children: React.ReactNode, allowedEmail: string }) => {
    const { user } = useAuth();
    if (user?.email !== allowedEmail) return <Navigate to="/app" replace />;
    return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
        {/* --- NOVO: Componente de Métricas de Velocidade --- */}
        <SpeedInsights />

        <BrowserRouter>
        <PaywallGlobal />
        
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/privacy" element={
                <Suspense fallback={<LoadingScreen />}>
                    <PrivacyPage />
                </Suspense>
            } />
            
            <Route path="/admin" element={
                <ProtectedRoute>
                    <Suspense fallback={<LoadingScreen />}>
                        <AdminGuard allowedEmail="cytyosapp@gmail.com">
                            <AdminPage />
                        </AdminGuard>
                    </Suspense>
                </ProtectedRoute>
            } />
            
            <Route path="/app" element={
                <ProtectedRoute>
                    <div className="h-[100dvh] w-full overflow-hidden bg-gray-900 relative">
                        <MobileOptimizationWarning />
                        <Suspense fallback={<LoadingScreen />}>
                            <MapboxMap />
                            
                            {/* --- CAMADA DE UI --- */}
                            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between">
                                
                                {/* CONTROLES DE MAPA */}
                                <div className="w-full p-4 flex justify-center items-start pt-16 md:pt-4"> 
                                    <div className="pointer-events-auto w-full max-w-md">
                                        <MapControls />
                                    </div>
                                </div>

                                {/* Espaço vazio */}
                                <div className="flex-1"></div>
                            </div>
                            
                            {/* SMART PANEL */}
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
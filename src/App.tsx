import React, { useEffect, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { X, Monitor, Zap } from 'lucide-react';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"

// --- EAGER IMPORTS ---
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { Footer } from './components/Footer';
import { useSettingsStore } from './stores/settingsStore';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { subscriptionService } from './services/subscriptionService';
import './i18n';

// --- NOVAS PÁGINAS (OPERACAO BRASIL) ---
import { BrazilOfferPage } from './pages/BrazilOfferPage';
import { ThankYouPage } from './pages/ThankYouPage';

// --- COMPONENTES ---
import { PromoBar } from './components/PromoBar';

// --- LAZY IMPORTS ---
const MapboxMap = React.lazy(() => import('./components/map/MapboxMap').then(module => ({ default: module.MapboxMap })));
const SmartPanel = React.lazy(() => import('./components/SmartPanel').then(module => ({ default: module.SmartPanel })));
const MapControls = React.lazy(() => import('./components/MapControls').then(module => ({ default: module.MapControls })));
const PricingModal = React.lazy(() => import('./components/PricingModal').then(module => ({ default: module.PricingModal })));
const AdminPage = React.lazy(() => import('./pages/AdminPage').then(module => ({ default: module.AdminPage })));
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage').then(module => ({ default: module.PrivacyPage })));

const FREE_USAGE_MS = 15 * 60 * 1000;

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
  const navigate = useNavigate();

  if (!isVisible) return null;
  return (
    <div className="md:hidden fixed inset-0 z-[99999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-[#1a1d26] border border-white/10 rounded-2xl p-6 max-w-sm w-full text-center relative shadow-2xl">
        <button onClick={() => setIsVisible(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><Zap className="w-6 h-6 text-green-400" /></div>
        <h3 className="text-white font-bold text-lg mb-2">Oferta Exclusiva Brasil</h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Bem-vindo! A modelagem 3D é otimizada para Desktop. Mas aproveite que está aqui para garantir o preço especial do Brasil (12x R$ 97).
        </p>
        <button onClick={() => { setIsVisible(false); navigate('/oferta-brasil'); }} className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-green-900/20 mb-3">
            Ver Oferta R$ 97,10
        </button>
        <button onClick={() => setIsVisible(false)} className="text-xs text-gray-500 hover:text-white underline">
            Continuar para o App (Modo Limitado)
        </button>
      </div>
    </div>
  );
};

const PaywallGlobal = () => {
  const { isPaywallOpen, setPaywallOpen } = useSettingsStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { session, user } = useAuth(); 

  useEffect(() => {
    if (!user || !location.pathname.startsWith('/app')) return;

    const storageKey = `cytyos_trial_start_${user.id}`;
    if (!localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, Date.now().toString());
    }

    const verifySubscription = async () => {
        const hasPremiumAccess = await subscriptionService.checkAccess();
        if (hasPremiumAccess) {
            localStorage.setItem('cytyos_license_type', 'VIP'); 
            setPaywallOpen(false);
            return; 
        }

        const startStr = localStorage.getItem(storageKey);
        const startTime = startStr ? parseInt(startStr) : Date.now();
        const timeUsed = Date.now() - startTime;
        
        const trialEnd = localStorage.getItem('cytyos_trial_end');
        const hasActiveCoupon = trialEnd && Date.now() < Number(trialEnd);

        if (!hasActiveCoupon && timeUsed > FREE_USAGE_MS) {
            if (!isPaywallOpen) {
                setPaywallOpen(true);
            }
        }
    };

    const interval = setInterval(verifySubscription, 1000); 
    verifySubscription(); 

    return () => clearInterval(interval);
  }, [setPaywallOpen, isPaywallOpen, location.pathname, session, user]); 

  const handleCloseAttempt = () => {
      if (location.pathname === '/') {
          setPaywallOpen(false);
          return;
      }
      const isVip = localStorage.getItem('cytyos_license_type') === 'VIP';
      const trialEnd = localStorage.getItem('cytyos_trial_end');
      const storageKey = user ? `cytyos_trial_start_${user.id}` : 'cytyos_anon';
      const startStr = localStorage.getItem(storageKey);
      const startTime = startStr ? parseInt(startStr) : 0;
      const timeUsed = Date.now() - startTime;
      const hasTimeLeft = timeUsed < FREE_USAGE_MS;
      const hasCoupon = trialEnd && Date.now() < Number(trialEnd);

      if (isVip || hasCoupon || hasTimeLeft) {
          setPaywallOpen(false);
      } else {
          alert("Sua sessão de diagnóstico gratuita expirou. Para continuar editando, libere o acesso Founder.");
      }
  };

  return (
    <Suspense fallback={null}>
        <div className={isPaywallOpen && location.pathname.startsWith('/app') ? "fixed inset-0 z-[9999] backdrop-blur-sm" : ""}>
            <PricingModal isOpen={isPaywallOpen} onClose={handleCloseAttempt} />
        </div>
    </Suspense>
  );
};

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
  
  // --- INICIALIZAÇÃO DO CLARITY (MANUAL) ---
  useEffect(() => {
    // @ts-ignore
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "v7h3wruqnl"); // SEU ID AQUI
  }, []);
  // ----------------------------------------

  return (
    <AuthProvider>
        <SpeedInsights /> <Analytics />
        <BrowserRouter>
        <PaywallGlobal />
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/oferta-brasil" element={<BrazilOfferPage />} />
            <Route path="/obrigado" element={<ThankYouPage />} />
            
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
                    {/* LAYOUT: Flex-Col (Mais seguro para renderização do Mapa) */}
                    <div className="h-[100dvh] w-full overflow-hidden bg-gray-900 relative overscroll-none touch-none flex flex-col">
                        
                        {/* PromoBar no fluxo normal */}
                        <PromoBar />

                        <div className="relative flex-1 w-full h-full overflow-hidden">
                            <MobileOptimizationWarning />
                            <Suspense fallback={<LoadingScreen />}>
                                <MapboxMap />
                                <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between">
                                    <div className="w-full p-4 flex justify-center items-start pt-16 md:pt-4"> 
                                        <div className="pointer-events-auto w-full max-w-md"><MapControls /></div>
                                    </div>
                                    <div className="flex-1"></div>
                                </div>
                                <SmartPanel />
                            </Suspense>
                            <Footer />
                        </div>
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
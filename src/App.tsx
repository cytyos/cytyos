import React, { useEffect, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { X, Monitor } from 'lucide-react';
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

// --- LAZY IMPORTS (SAFE MODE) ---
const MapboxMap = React.lazy(() => import('./components/map/MapboxMap').then(module => ({ default: module.MapboxMap })));
const SmartPanel = React.lazy(() => import('./components/SmartPanel').then(module => ({ default: module.SmartPanel })));
const MapControls = React.lazy(() => import('./components/MapControls').then(module => ({ default: module.MapControls })));
const PricingModal = React.lazy(() => import('./components/PricingModal').then(module => ({ default: module.PricingModal })));
const AdminPage = React.lazy(() => import('./pages/AdminPage').then(module => ({ default: module.AdminPage })));
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage').then(module => ({ default: module.PrivacyPage })));

// ⏱️ CONFIGURAÇÃO DE TEMPO: 15 MINUTOS
const FREE_USAGE_MS = 15 * 60 * 1000;

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
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">Cytyos is a professional 3D analysis tool optimized for large screens.</p>
        <button onClick={() => setIsVisible(false)} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-colors border border-white/5">Continue on Mobile</button>
      </div>
    </div>
  );
};

// --- PAYWALL CONTROL (SISTEMA BLINDADO) ---
const PaywallGlobal = () => {
  const { isPaywallOpen, setPaywallOpen } = useSettingsStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { session, user } = useAuth(); // Pegamos o USER para travar pelo ID

  useEffect(() => {
    // Se não estiver logado ou não estiver no app, não faz nada
    if (!user || !location.pathname.startsWith('/app')) return;

    // Chave única por usuário para impedir que ele limpe cache de sessão
    // Se ele trocar de navegador, ele ganha +15min (inevitável sem backend), 
    // mas no mesmo navegador está travado para sempre.
    const storageKey = `cytyos_trial_start_${user.id}`;

    // Inicializa o timer se não existir
    if (!localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, Date.now().toString());
    }

    // Função de verificação
    const verifySubscription = async () => {
        // 1. Verifica Assinatura Real (VIP)
        // O checkAccess verifica no banco se ele pagou
        const hasPremiumAccess = await subscriptionService.checkAccess();
        if (hasPremiumAccess) {
            localStorage.setItem('cytyos_license_type', 'VIP'); // Cache local para evitar request
            setPaywallOpen(false);
            return; 
        }

        // 2. Verifica Tempo Restante (Lógica Freemium)
        const startStr = localStorage.getItem(storageKey);
        const startTime = startStr ? parseInt(startStr) : Date.now();
        const timeUsed = Date.now() - startTime;
        
        // Verifica se tem cupom de trial estendido
        const trialEnd = localStorage.getItem('cytyos_trial_end');
        const hasActiveCoupon = trialEnd && Date.now() < Number(trialEnd);

        // A Lógica Final:
        // Se NÃO é VIP E NÃO tem cupom E o tempo de uso passou de 15min... BLOQUEIA.
        if (!hasActiveCoupon && timeUsed > FREE_USAGE_MS) {
            if (!isPaywallOpen) {
                console.log("Tempo de diagnóstico expirado. Bloqueando...");
                setPaywallOpen(true);
            }
        }
    };

    // Verifica a cada 1 segundo para ser preciso no cronômetro
    const interval = setInterval(verifySubscription, 1000); 
    verifySubscription(); // Roda imediatamente também

    return () => clearInterval(interval);
  }, [setPaywallOpen, isPaywallOpen, location.pathname, session, user]); 

  // --- TENTATIVA DE FECHAMENTO ---
  const handleCloseAttempt = () => {
      // 1. Na Landing Page é livre
      if (location.pathname === '/') {
          setPaywallOpen(false);
          return;
      }

      // 2. No App, recalculamos tudo para garantir que ele não burlou o HTML
      const isVip = localStorage.getItem('cytyos_license_type') === 'VIP';
      const trialEnd = localStorage.getItem('cytyos_trial_end');
      
      // Recalcula o tempo baseado no ID do usuário
      const storageKey = user ? `cytyos_trial_start_${user.id}` : 'cytyos_anon';
      const startStr = localStorage.getItem(storageKey);
      const startTime = startStr ? parseInt(startStr) : 0;
      const timeUsed = Date.now() - startTime;
      
      const hasTimeLeft = timeUsed < FREE_USAGE_MS;
      const hasCoupon = trialEnd && Date.now() < Number(trialEnd);

      if (isVip || hasCoupon || hasTimeLeft) {
          // Se tem direito, fecha o modal
          setPaywallOpen(false);
      } else {
          // Se NÃO tem direito e tentou fechar:
          // Não deixamos fechar e forçamos o usuário a ficar olhando pro modal
          // Opcional: Redirecionar para Home se quiser ser agressivo
          // navigate('/'); 
          alert("Sua sessão de diagnóstico gratuita expirou. Para continuar editando, libere o acesso Founder.");
      }
  };

  return (
    <Suspense fallback={null}>
        {/* Adicionei backdrop-blur-sm aqui para dar o efeito de bloqueio visual do conteúdo atrás */}
        <div className={isPaywallOpen && location.pathname.startsWith('/app') ? "fixed inset-0 z-[9999] backdrop-blur-sm" : ""}>
            <PricingModal isOpen={isPaywallOpen} onClose={handleCloseAttempt} />
        </div>
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
        <SpeedInsights /> <Analytics />
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
                    <div className="h-[100dvh] w-full overflow-hidden bg-gray-900 relative overscroll-none touch-none">
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
                </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
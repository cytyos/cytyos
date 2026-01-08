import React, { useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- EAGER IMPORTS (Carregamento Imediato para a Home) ---
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { Footer } from './components/Footer'; 
import { useSettingsStore } from './stores/settingsStore';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './i18n';

// --- LAZY IMPORTS (Carregamento sob demanda para o App) ---
// Isso resolve a lentidão inicial e evita tela branca por excesso de peso
const MapboxMap = React.lazy(() => import('./components/map/MapboxMap').then(module => ({ default: module.MapboxMap })));
const SmartPanel = React.lazy(() => import('./components/SmartPanel').then(module => ({ default: module.SmartPanel })));
const MapControls = React.lazy(() => import('./components/MapControls').then(module => ({ default: module.MapControls })));
const PricingModal = React.lazy(() => import('./components/PricingModal').then(module => ({ default: module.PricingModal })));

// Componente simples para a página de Admin
const AdminPage = React.lazy(() => import('./pages/AdminPage').then(module => ({ default: module.AdminPage })));

// --- TELA DE CARREGAMENTO (Loading Spinner) ---
const LoadingScreen = () => (
  <div className="h-screen w-screen bg-[#0f111a] flex flex-col items-center justify-center space-y-4">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
    </div>
    <span className="text-indigo-400 font-mono text-sm animate-pulse">INITIALIZING SYSTEM...</span>
  </div>
);

// --- PAYWALL CONTROL ---
const PaywallGlobal = () => {
  const { isPaywallOpen, setPaywallOpen } = useSettingsStore();

  useEffect(() => {
    const checkTrial = () => {
        // 1. Verifica se é VIP
        if (localStorage.getItem('cytyos_license_type') === 'VIP') return;

        // 2. Verifica se tem Trial ativo
        const trialEnd = localStorage.getItem('cytyos_trial_end');
        if (trialEnd && Date.now() < Number(trialEnd)) {
            return; 
        }
        
        // 3. Se não for VIP nem Trial, abre o Paywall
        setPaywallOpen(true);
    };

    const timer = setTimeout(checkTrial, 60000); // 60 segundos
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

// --- ROTA PROTEGIDA ---
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

// --- ADMIN GUARD (Segurança Extra) ---
const AdminGuard = ({ children, allowedEmail }: { children: React.ReactNode, allowedEmail: string }) => {
    const { user } = useAuth();
    if (user?.email !== allowedEmail) {
      return <Navigate to="/app" replace />;
    }
    return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
        <PaywallGlobal />
        
        <Routes>
            {/* Páginas Públicas carregam rápido */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Rota Admin (Protegida) */}
            <Route path="/admin" element={
                <ProtectedRoute>
                    <Suspense fallback={<LoadingScreen />}>
                        {/* COLOQUE SEU EMAIL AQUI PARA PROTEGER O ADMIN */}
                        <AdminGuard allowedEmail="seu.email@exemplo.com">
                            <AdminPage />
                        </AdminGuard>
                    </Suspense>
                </ProtectedRoute>
            } />
            
            {/* APP PRINCIPAL (Carregamento Lazy) */}
            <Route path="/app" element={
                <ProtectedRoute>
                    <div className="h-screen w-screen overflow-hidden bg-gray-900 relative">
                        <Suspense fallback={<LoadingScreen />}>
                            {/* O Suspense protege contra erros de carregamento do Mapbox */}
                            <MapboxMap />
                            
                            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between">
                                <div className="w-full p-4"></div>
                                <div className="w-full flex justify-center pb-16 z-50">
                                    <div className="pointer-events-auto">
                                        <MapControls />
                                    </div>
                                </div>
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

// AQUI ESTÁ A CORREÇÃO CRÍTICA:
export default App;
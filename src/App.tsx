import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- IMPORTAÇÕES ---
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage'; // <--- NOVO
import { AdminPage } from './pages/AdminPage'; // <--- NOVO

import { MapboxMap } from './components/map/MapboxMap'; 
import { MapControls } from './components/MapControls';
import { SmartPanel } from './components/SmartPanel';
import { PricingModal } from './components/PricingModal';
import { AIAssistant } from './components/AIAssistant'; 
import { Footer } from './components/Footer'; 
import { useSettingsStore } from './stores/settingsStore';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // <--- NOVO
import './i18n';

// Helper para o Paywall
const PaywallGlobal = () => {
  const { isPaywallOpen, setPaywallOpen } = useSettingsStore();
  return (
    <PricingModal 
      isOpen={isPaywallOpen} 
      onClose={() => setPaywallOpen(false)} 
    />
  );
};

// Componente para Proteger Rotas (Se não logar, vai pro login)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  if (loading) return null; // Espera carregar
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider> {/* Envolvemos tudo no AuthProvider */}
        <BrowserRouter>
        {/* Componentes Globais */}
        <PaywallGlobal />
        <AIAssistant />

        <Routes>
            {/* Rota 1: Landing Page (Pública) */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Rota 2: Login (Pública) */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rota 3: Admin (Protegida) */}
            <Route path="/admin" element={
                <ProtectedRoute>
                    <AdminPage />
                </ProtectedRoute>
            } />
            
            {/* Rota 4: App Principal (Protegida) */}
            <Route path="/app" element={
                <ProtectedRoute>
                    {/* AQUI ESTÁ O SEU CÓDIGO ORIGINAL QUE FUNCIONA */}
                    <div className="h-screen w-screen overflow-hidden bg-gray-900 relative">
                        
                        {/* 1. Mapa (Fundo) */}
                        <MapboxMap />
                        
                        {/* 2. Container da Interface */}
                        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between">
                            
                            {/* Topo: Vazio */}
                            <div className="w-full p-4"></div>

                            {/* Centro/Baixo: Controles */}
                            <div className="w-full flex justify-center pb-16 z-50">
                                <div className="pointer-events-auto">
                                    <MapControls />
                                </div>
                            </div>
                        </div>

                        {/* 3. Painel Lateral */}
                        <SmartPanel />

                        {/* 4. Rodapé Global */}
                        <Footer />
                    </div>
                    {/* FIM DO CÓDIGO ORIGINAL */}
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- IMPORTAÇÕES ---
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
// import { AdminPage } from './pages/AdminPage'; // Deixe comentado se o arquivo não existir ainda

import { MapboxMap } from './components/map/MapboxMap'; 
import { MapControls } from './components/MapControls';
import { SmartPanel } from './components/SmartPanel';
import { PricingModal } from './components/PricingModal';
import { AIAssistant } from './components/AIAssistant'; 
import { Footer } from './components/Footer'; 
import { useSettingsStore } from './stores/settingsStore';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Usa o arquivo que você já tem!
import './i18n';

// --- Placeholder para evitar erros se a AdminPage não existir ---
const AdminPage = () => <div className="p-10 text-white">Painel Admin (Em construção)</div>;

// --- Helper para o Paywall ---
const PaywallGlobal = () => {
  const { isPaywallOpen, setPaywallOpen } = useSettingsStore();
  return (
    <PricingModal 
      isOpen={isPaywallOpen} 
      onClose={() => setPaywallOpen(false)} 
    />
  );
};

// --- COMPONENTE DE PROTEÇÃO DE ROTA ---
// É aqui que a mágica acontece: ele espera o carregamento antes de chutar o usuário
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  // 1. Enquanto carrega (verifica o Google), mostra tela preta ou loading
  if (loading) {
      return (
        <div className="h-screen w-screen bg-[#0f111a] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
  }
  
  // 2. Se terminou de carregar e NÃO tem sessão, manda pro Login
  if (!session) {
      return <Navigate to="/login" replace />;
  }
  
  // 3. Se tem sessão, libera o acesso
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider> {/* O AuthProvider envolve tudo para gerenciar o estado global */}
        <BrowserRouter>
        {/* Componentes Globais que aparecem em cima de tudo */}
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
            
            {/* Rota 4: App Principal (Protegida) - Onde o mapa fica */}
            <Route path="/app" element={
                <ProtectedRoute>
                    <div className="h-screen w-screen overflow-hidden bg-gray-900 relative">
                        
                        {/* 1. Mapa (Fundo) */}
                        <MapboxMap />
                        
                        {/* 2. Interface sobre o mapa */}
                        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between">
                            <div className="w-full p-4"></div> {/* Espaço Topo */}

                            <div className="w-full flex justify-center pb-16 z-50">
                                <div className="pointer-events-auto">
                                    <MapControls />
                                </div>
                            </div>
                        </div>

                        {/* 3. Painel Lateral e Rodapé */}
                        <SmartPanel />
                        <Footer />
                    </div>
                </ProtectedRoute>
            } />

            {/* Qualquer rota desconhecida redireciona para a Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
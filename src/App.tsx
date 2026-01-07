import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Platform } from './pages/Platform';
import { LoginPage } from './pages/LoginPage'; // <--- Nova
import { AdminPage } from './pages/AdminPage'; // <--- Nova
import { AuthProvider, useAuth } from './contexts/AuthContext'; // <--- Novo Contexto
import './i18n';

// Componente para Proteger Rotas (Guarda-Costas)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  if (loading) return <div className="h-screen w-screen bg-gray-900 flex items-center justify-center text-indigo-500">Loading...</div>;
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Rota Protegida: App Principal */}
            <Route path="/app" element={
                <ProtectedRoute>
                    <Platform />
                </ProtectedRoute>
            } />

            {/* Rota Protegida: Admin */}
            <Route path="/admin" element={
                <ProtectedRoute>
                    <AdminPage />
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
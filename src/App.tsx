import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Platform } from './pages/Platform'; // <--- O segredo está aqui
import './i18n';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Rota do Aplicativo (Carrega o Platform.tsx completo) */}
        <Route path="/app" element={<Platform />} />

        {/* Redirecionamento de segurança */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
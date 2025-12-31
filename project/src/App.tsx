import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Platform } from './pages/Platform';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Raiz: Mostra a Landing Page (Capa) */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Rota do App: Mostra a Plataforma (Mapa + Ferramentas) */}
        <Route path="/app" element={<Platform />} />
        
        {/* Qualquer outra rota desconhecida redireciona para a Capa */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
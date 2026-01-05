import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Platform } from './pages/Platform';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Raiz: Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Rota App: Plataforma */}
        <Route path="/app" element={<Platform />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
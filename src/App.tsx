import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Platform } from './pages/Platform';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { Footer } from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page (Home) */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Legal Pages (Fullscreen, no Platform layout) */}
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        
        {/* App Platform (Main Tool) */}
        <Route path="/app" element={
          <div className="flex flex-col h-screen w-full bg-gray-900 text-white overflow-hidden">
             {/* Main Content Area */}
             <div className="flex-1 relative overflow-hidden">
                <Platform />
             </div>
             
             {/* Fixed Footer inside the App */}
             <Footer />
          </div>
        } />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
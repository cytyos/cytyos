import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Platform } from './pages/Platform';
import { Footer } from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root Route: Shows Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* App Route: Shows Platform with Footer layout */}
        <Route path="/app" element={
          <div className="flex flex-col h-screen w-full bg-gray-900 text-white overflow-hidden">
             {/* Main Content Area (Sidebar + Map) */}
             <div className="flex-1 relative overflow-hidden">
                <Platform />
             </div>
             
             {/* Fixed Footer */}
             <Footer />
          </div>
        } />
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
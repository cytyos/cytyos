import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- IMPORTS ---
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
// import { AdminPage } from './pages/AdminPage'; // Commented out to prevent errors if file doesn't exist yet

import { MapboxMap } from './components/map/MapboxMap'; 
import { MapControls } from './components/MapControls';
import { SmartPanel } from './components/SmartPanel';
import { PricingModal } from './components/PricingModal';
import { AIAssistant } from './components/AIAssistant'; 
import { Footer } from './components/Footer'; 
import { useSettingsStore } from './stores/settingsStore';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './i18n';

// --- Placeholder for Admin Page (Prevents import errors) ---
const AdminPage = () => <div className="p-10 text-white">Admin Dashboard (Under Construction)</div>;

// --- Paywall Helper ---
const PaywallGlobal = () => {
  const { isPaywallOpen, setPaywallOpen } = useSettingsStore();
  return (
    <PricingModal 
      isOpen={isPaywallOpen} 
      onClose={() => setPaywallOpen(false)} 
    />
  );
};

// --- PROTECTED ROUTE COMPONENT ---
// This is the key logic: it waits for loading to finish before redirecting
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  // 1. While loading (checking Google auth), show a spinner instead of a white screen
  if (loading) {
      return (
        <div className="h-screen w-screen bg-[#0f111a] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
  }
  
  // 2. If finished loading and NO session exists, redirect to Login
  if (!session) {
      return <Navigate to="/login" replace />;
  }
  
  // 3. If session exists, render the protected content
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider> {/* AuthProvider wraps everything to manage global state */}
        <BrowserRouter>
        {/* Global Components */}
        <PaywallGlobal />
        <AIAssistant />

        <Routes>
            {/* Route 1: Landing Page (Public) */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Route 2: Login (Public) */}
            <Route path="/login" element={<LoginPage />} />

            {/* Route 3: Admin (Protected) */}
            <Route path="/admin" element={
                <ProtectedRoute>
                    <AdminPage />
                </ProtectedRoute>
            } />
            
            {/* Route 4: Main App (Protected) - Map Interface */}
            <Route path="/app" element={
                <ProtectedRoute>
                    <div className="h-screen w-screen overflow-hidden bg-gray-900 relative">
                        
                        {/* 1. Map (Background) */}
                        <MapboxMap />
                        
                        {/* 2. UI Container (Overlay) */}
                        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between">
                            
                            {/* Top Spacer */}
                            <div className="w-full p-4"></div>

                            {/* Center/Bottom: Controls */}
                            <div className="w-full flex justify-center pb-16 z-50">
                                <div className="pointer-events-auto">
                                    <MapControls />
                                </div>
                            </div>
                        </div>

                        {/* 3. Side Panel */}
                        <SmartPanel />

                        {/* 4. Global Footer */}
                        <Footer />
                    </div>
                </ProtectedRoute>
            } />

            {/* Catch-all: Redirect unknown routes to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
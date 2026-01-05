import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Globe, Building2, TrendingUp, CheckCircle2 } from 'lucide-react';
// --- MUDANÇA 1: Importando o logo completo (Ícone + Texto) ---
import logoFull from '../assets/logo-full.png';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f111a] text-white font-sans flex flex-col selection:bg-indigo-500/30">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#0f111a]/90 backdrop-blur-md h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              {/* --- MUDANÇA 2: Logo Full, sem texto duplicado ao lado --- */}
              <img 
                src={logoFull} 
                alt="Cytyos" 
                className="h-9 w-auto object-contain" 
              />
              {/* Mantemos apenas o Badge Beta, alinhado */}
              <div className="flex flex-col justify-center h-full">
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 ml-2">Beta</span>
              </div>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/app')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-full text-xs font-bold transition-all shadow-lg hover:shadow-indigo-500/50">
                Launch App
             </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center relative pt-32 pb-16 px-4 md:px-6 text-center w-full overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-indigo-600/15 rounded-full blur-[80px] md:blur-[120px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-5xl space-y-6 md:space-y-8 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] md:text-[11px] font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Real Estate Engine
          </div>
          
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] w-full">
            <span className="block">Urban Intelligence</span>
            <span className="magic-text pb-2">Reimagined.</span>
          </h1>
          
          <p className="text-base md:text-lg text-gray-400 max-w-xl md:max-w-2xl mx-auto leading-relaxed px-2">
            Cytyos combines <strong>Generative AI</strong> with global <strong>Geospatial Data</strong> to analyze zoning laws and calculate financial viability instantly.
          </p>
          
          <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-4 justify-center items-center pt-6">
            <button onClick={() => navigate('/app')} className="w-full sm:w-auto h-12 px-8 bg-white text-black hover:bg-gray-100 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-xl">
                Start Analyzing Free <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-black/40 px-4 py-2 rounded-full border border-white/5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> <span>No credit card required</span>
            </div>
          </div>
        </div>
      </main>

      {/* FEATURES */}
      <section className="border-t border-white/5 bg-black/20 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FeatureCard icon={<Globe className="text-blue-400" />} title="Global Context" desc="Analyze coordinates anywhere. Currencies and metrics adapt automatically." />
                <FeatureCard icon={<Building2 className="text-indigo-400" />} title="Instant Massing" desc="Visualize volumetric studies and occupancy rates in real-time 3D." />
                <FeatureCard icon={<TrendingUp className="text-violet-400" />} title="Financial AI" desc="Get automatic VGV, Margin, and Construction Cost estimates powered by GPT-4." />
            </div>
            
            <div className="mt-12 md:mt-16 pt-8 border-t border-white/5 text-center">
                <p className="text-gray-600 text-xs">&copy; 2025 Cytyos Inc. All rights reserved. • <span className="text-gray-500">Beta v0.9</span></p>
            </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all duration-300 group cursor-default text-center md:text-left flex flex-col items-center md:items-start">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">{icon}</div>
        <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
);
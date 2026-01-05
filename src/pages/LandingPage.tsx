import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Rocket, CheckCircle2, Sparkles, ArrowRight, 
  Layers, Map as MapIcon, ShieldCheck, Play 
} from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import logoFull from '../assets/logo-full.png'; 

export const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const { setPaywallOpen } = useSettingsStore();

  // Helper to change language from LP
  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-[#050608] text-white overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-[#050608]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <img src={logoFull} alt="Cytyos" className="h-8 w-auto opacity-90 hover:opacity-100 transition-opacity" />
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider transition-colors"
            >
              {i18n.language === 'pt' ? 'EN' : 'PT'}
            </button>
            <button 
              onClick={() => setPaywallOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all"
            >
              Login
            </button>
            <button 
              onClick={() => setPaywallOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-105"
            >
              {t('roadmap.cta')}
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Beta Live Now
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-500 max-w-4xl leading-[1.1]">
          {t('roadmap.subtitle')}
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          O Cytyos transforma dados de zoneamento complexos em decisões de investimento imobiliário em segundos. Pare de desenhar, comece a analisar.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button 
            onClick={() => window.location.reload()} // Just reloads to enter app for now (or remove Landing logic if merged)
            className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all transform hover:-translate-y-1 shadow-xl shadow-white/10"
          >
            <Play className="w-4 h-4 fill-current" />
            Try Beta Free
          </button>
          <button 
            onClick={() => setPaywallOpen(true)}
            className="flex items-center justify-center gap-3 bg-[#1a1d26] text-white border border-gray-700 px-8 py-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all hover:border-gray-500"
          >
            View Early Bird Plans
          </button>
        </div>
      </section>

      {/* --- ROADMAP SECTION (THE NEW ITEM) --- */}
      <section className="py-24 bg-[#0a0c10] border-t border-white/5 relative overflow-hidden">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Rocket className="w-8 h-8 text-indigo-500" />
              {t('roadmap.title')}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Estamos construindo o sistema operacional do desenvolvimento imobiliário. Garanta sua posição agora para ter acesso vitalício às ferramentas futuras.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* CARD 1: BETA (HOJE) */}
            <div className="bg-[#0f111a] rounded-3xl p-8 border border-green-500/20 relative group hover:border-green-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <CheckCircle2 className="w-32 h-32 text-green-500" />
              </div>
              <div className="inline-block px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-green-500/20">
                Live Now
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{t('roadmap.col1.title')}</h3>
              <div className="h-1 w-12 bg-green-500 rounded-full mb-6"></div>
              
              <ul className="space-y-4 relative z-10">
                {[1,2,3,4].map(n => (
                  <li key={n} className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="mt-0.5 min-w-[16px]"><CheckCircle2 className="w-4 h-4 text-green-500" /></div>
                    <span>{t(`roadmap.col1.f${n}`)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CARD 2: V1.0 (EARLY BIRD) */}
            <div className="bg-gradient-to-b from-indigo-900/20 to-[#0f111a] rounded-3xl p-8 border border-indigo-500/60 relative transform md:-translate-y-4 shadow-2xl shadow-indigo-900/20 ring-1 ring-indigo-500/50">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide shadow-lg border border-indigo-400 whitespace-nowrap">
                Most Popular Strategy
              </div>
              <div className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-indigo-500/20">
                Coming March
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{t('roadmap.col2.title')}</h3>
              <div className="h-1 w-12 bg-indigo-500 rounded-full mb-6"></div>

              <ul className="space-y-4 relative z-10">
                {[1,2,3,4].map(n => (
                  <li key={n} className="flex items-start gap-3 text-sm text-white font-medium">
                    <div className="mt-0.5 min-w-[16px]"><Rocket className="w-4 h-4 text-indigo-400" /></div>
                    <span>{t(`roadmap.col2.f${n}`)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-white/10">
                <button 
                  onClick={() => setPaywallOpen(true)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group"
                >
                  {t('roadmap.cta')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-center text-[10px] text-gray-500 mt-3">Limited spots for Founder pricing.</p>
              </div>
            </div>

            {/* CARD 3: V2.0 (VISION) */}
            <div className="bg-[#0f111a] rounded-3xl p-8 border border-purple-500/20 relative group hover:border-purple-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="w-32 h-32 text-purple-500" />
              </div>
              <div className="inline-block px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-purple-500/20">
                The Vision 2026
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{t('roadmap.col3.title')}</h3>
              <div className="h-1 w-12 bg-purple-500 rounded-full mb-6"></div>

              <ul className="space-y-4 relative z-10">
                {[1,2,3,4].map(n => (
                  <li key={n} className="flex items-start gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    <div className="mt-0.5 min-w-[16px]"><Sparkles className="w-4 h-4 text-purple-500" /></div>
                    <span>{t(`roadmap.col3.f${n}`)}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* --- FEATURE HIGHLIGHTS (Mini Section) --- */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="space-y-4">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800 mx-auto md:mx-0">
                    <MapIcon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Global & Local</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                    Mapbox integration allows analysis anywhere in the world, with specific metric systems (Imperial/Metric) adapted instantly.
                </p>
            </div>
            <div className="space-y-4">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800 mx-auto md:mx-0">
                    <Layers className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Smart Zoning</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                    Our AI reads zoning text and automatically applies constraints like FAR, Occupancy, and Setbacks to your 3D model.
                </p>
            </div>
            <div className="space-y-4">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800 mx-auto md:mx-0">
                    <ShieldCheck className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Secure Data</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                    Your projects are private. We do not sell your data. Cytyos is built for professional developers and architects.
                </p>
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-[#020305] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                <img src={logoFull} alt="Cytyos" className="h-6 w-auto opacity-50" />
                <span className="text-xs text-gray-600">© 2026 Cytyos Inc.</span>
            </div>
            <div className="text-center md:text-right">
                <p className="text-[10px] text-gray-600 max-w-md">
                    {t('footer.disclaimer')}
                </p>
            </div>
        </div>
      </footer>

    </div>
  );
};
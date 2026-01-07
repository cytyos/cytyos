import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; // Importante para navegação
import { Building2, Globe2, BrainCircuit, ShieldCheck, ArrowRight, LayoutGrid, Zap } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';

export const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate(); // Hook de navegação
  const { setPaywallOpen } = useSettingsStore();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-white overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* --- HEADER --- */}
      <nav className="fixed top-0 w-full z-50 bg-[#0f111a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <LayoutGrid className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="font-bold text-lg tracking-tight">Cytyos <span className="text-[10px] uppercase bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded ml-1">Beta</span></span>
          </div>

          <div className="flex items-center gap-4">
            {/* Seletor de Idioma Simples */}
            <div className="hidden md:flex gap-2">
                <button onClick={() => changeLanguage('en')} className={`text-xs font-bold px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>EN</button>
                <button onClick={() => changeLanguage('pt')} className={`text-xs font-bold px-2 py-1 rounded ${i18n.language === 'pt' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>PT</button>
            </div>

            <div className="h-4 w-px bg-white/10 hidden md:block"></div>

            {/* BOTÃO LOGIN - Agora vai para /login */}
            <button 
                onClick={() => navigate('/login')} 
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
                {t('landing.login')}
            </button>

            {/* BOTÃO ACESSO - Vai para o App */}
            <button 
                onClick={() => navigate('/app')} 
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]"
            >
                {t('landing.hero.btn_try')}
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            {t('landing.hero.badge')}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            <span className="text-gray-400 block text-2xl md:text-3xl font-medium mb-2">{t('landing.hero.title_prefix')}</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
              {t('landing.hero.title_main')}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('landing.hero.subtitle')}
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {/* Botão Principal: Tentar Grátis -> Vai para /app */}
            <button 
                onClick={() => navigate('/app')} 
                className="w-full md:w-auto px-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
            >
                <Zap className="w-5 h-5 fill-black" />
                {t('landing.hero.btn_try')}
            </button>

            {/* Botão Secundário: Planos -> Abre o Modal de Preços */}
            <button 
                onClick={() => setPaywallOpen(true)} 
                className="w-full md:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-lg transition-all"
            >
                {t('landing.hero.btn_plans')}
            </button>
          </div>
        </div>
      </div>

      {/* --- FEATURES GRID --- */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-6">
        <FeatureCard 
            icon={<Globe2 className="w-6 h-6 text-blue-400" />}
            title={t('landing.features.global.title')}
            desc={t('landing.features.global.desc')}
        />
        <FeatureCard 
            icon={<BrainCircuit className="w-6 h-6 text-purple-400" />}
            title={t('landing.features.zoning.title')}
            desc={t('landing.features.zoning.desc')}
        />
        <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-emerald-400" />}
            title={t('landing.features.secure.title')}
            desc={t('landing.features.secure.desc')}
        />
      </div>

      {/* --- ROADMAP PREVIEW --- */}
      <div className="border-t border-white/5 bg-black/20 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
             <h2 className="text-3xl font-bold mb-4">{t('roadmap_intro')}</h2>
             <button onClick={() => setPaywallOpen(true)} className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center justify-center gap-2">
                {t('roadmap.cta')} <ArrowRight className="w-4 h-4" />
             </button>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 py-8 text-center text-gray-500 text-sm">
        <p>{t('landing.footer_rights')}</p>
      </footer>
    </div>
  );
};

// Componente auxiliar para os cards
const FeatureCard = ({ icon, title, desc }: any) => (
    <div className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
        <div className="mb-4 p-3 bg-black/40 rounded-xl w-fit">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
);
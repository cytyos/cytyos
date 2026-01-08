import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, CheckCircle2, Sparkles, ArrowRight, 
  Play, Globe, ChevronDown, Zap, LayoutGrid 
} from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import logoFull from '../assets/logo-full.png'; 

export const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate(); 
  const { setPaywallOpen } = useSettingsStore();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
  };

  const scrollToRoadmap = () => {
    const el = document.getElementById('roadmap-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Navegação para o App (protegido)
  const handleEnterApp = () => {
      navigate('/app'); 
  };

  // Navegação para o Login
  const handleLogin = () => {
      navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#050608] text-white overflow-x-hidden selection:bg-indigo-500 selection:text-white font-sans">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#050608]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <img src={logoFull} alt="Cytyos" className="h-6 md:h-8 w-auto opacity-90 hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {/* Seletor de Idioma */}
            <div className="relative">
                <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider transition-colors py-2">
                    <Globe className="w-3 h-3" />
                    <span className="hidden md:inline">{i18n.language ? i18n.language.substring(0,2) : 'EN'}</span>
                    <span className="md:hidden">{i18n.language ? i18n.language.substring(0,2).toUpperCase() : 'EN'}</span>
                    <ChevronDown className="w-3 h-3" />
                </button>
                {isLangMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-32 bg-[#0f111a] border border-gray-700 rounded-lg shadow-xl z-[100]">
                        {['en','pt','es','fr','zh'].map(lang => (
                            <button key={lang} onClick={() => changeLanguage(lang)} className="block w-full text-left px-4 py-3 text-xs text-gray-300 hover:bg-gray-800 hover:text-white border-b border-gray-800 last:border-0 uppercase font-medium">
                                {lang === 'zh' ? '中文' : lang}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="h-4 w-px bg-white/10 mx-1"></div>

            {/* BOTÃO LOGIN */}
            <button onClick={handleLogin} className="text-gray-300 hover:text-white text-xs font-bold transition-colors">
              {t('landing.login')}
            </button>
            
            {/* CTA NAVBAR - Oculto em telas muito pequenas para dar espaço */}
            <button onClick={() => setPaywallOpen(true)} className="hidden sm:block bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-105">
              {t('roadmap.cta')}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      {/* Padding ajustado para mobile: pt-28 em vez de pt-36 */}
      <section className="relative pt-28 md:pt-36 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-8 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          {t('landing.hero.badge')}
        </div>

        {/* AJUSTE DE FONTE: text-4xl no mobile, text-7xl no desktop */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-white max-w-5xl leading-[1.1]">
          {t('landing.hero.title_prefix')} <br className="hidden md:block" />
          {t('landing.hero.title_main')} <br />
          <span className="group relative inline-block cursor-pointer">
            <span className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"></span>
            <span className="relative bg-clip-text text-transparent bg-gradient-to-b from-gray-200 to-gray-500 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-indigo-400 group-hover:to-purple-400 transition-all duration-500">
              {t('landing.hero.title_anim')}
            </span>
          </span>
        </h1>
        
        <p className="text-base md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed px-2">
          {t('landing.hero.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          {/* BOTÃO PRINCIPAL: Vai para o App */}
          <button 
            onClick={handleEnterApp} 
            className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all transform hover:-translate-y-1 shadow-xl shadow-white/10 z-10 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            {t('landing.hero.btn_try')}
          </button>

          {/* BOTÃO SECUNDÁRIO: Vai para o Roadmap ou Paywall */}
          <button 
            onClick={() => setPaywallOpen(true)} 
            className="flex items-center justify-center gap-3 bg-[#1a1d26] text-white border border-gray-700 px-8 py-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all hover:border-gray-500 z-10 cursor-pointer"
          >
            {t('landing.hero.btn_plans')}
          </button>
        </div>
      </section>

      {/* ROADMAP SECTION */}
      <section id="roadmap-section" className="py-24 bg-[#0a0c10] border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Rocket className="w-8 h-8 text-indigo-500" />
              {t('roadmap.title')}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('landing.roadmap_intro')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-stretch">
            
            {/* BOX 1 */}
            <div className="bg-[#0f111a] rounded-3xl p-8 border border-green-500/20 relative group hover:border-green-500/40 transition-all duration-300 flex flex-col h-full hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><CheckCircle2 className="w-24 h-24 text-green-500" /></div>
              <div className="inline-block px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-green-500/20 w-fit">{t('roadmap.col1.tag')}</div>
              <h3 className="text-xl font-bold text-white mb-2">{t('roadmap.col1.title')}</h3>
              <div className="h-1 w-12 bg-green-500 rounded-full mb-6"></div>
              <ul className="space-y-4 relative z-10 flex-1">
                {[1,2,3,4].map(n => (<li key={n} className="flex items-start gap-3 text-sm text-gray-300"><div className="mt-0.5 min-w-[16px]"><CheckCircle2 className="w-4 h-4 text-green-500" /></div><span>{t(`roadmap.col1.f${n}`)}</span></li>))}
              </ul>
            </div>

            {/* BOX 2 */}
            <div className="bg-gradient-to-b from-indigo-900/10 to-[#0f111a] rounded-3xl p-8 border border-indigo-500/40 relative transform md:-translate-y-0 shadow-2xl shadow-indigo-900/10 group hover:border-indigo-400 transition-all duration-300 flex flex-col h-full hover:shadow-[0_0_40px_rgba(99,102,241,0.2)]">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><Rocket className="w-24 h-24 text-indigo-500" /></div>
              <div className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-indigo-500/20 w-fit">{t('roadmap.col2.subtag')}</div>
              <h3 className="text-xl font-bold text-white mb-2">{t('roadmap.col2.title')}</h3>
              <div className="h-1 w-12 bg-indigo-500 rounded-full mb-6"></div>
              <ul className="space-y-4 relative z-10 flex-1">
                {[1,2,3,4].map(n => (<li key={n} className="flex items-start gap-3 text-sm text-white font-medium"><div className="mt-0.5 min-w-[16px]"><Rocket className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" /></div><span>{t(`roadmap.col2.f${n}`)}</span></li>))}
              </ul>
            </div>

            {/* BOX 3 */}
            <div className="bg-[#0f111a] rounded-3xl p-8 border border-purple-500/20 relative group hover:border-purple-500/40 transition-all duration-300 flex flex-col h-full hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><Sparkles className="w-24 h-24 text-purple-500" /></div>
              <div className="inline-block px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-purple-500/20 w-fit">{t('roadmap.col3.tag')}</div>
              <h3 className="text-xl font-bold text-white mb-2">{t('roadmap.col3.title')}</h3>
              <div className="h-1 w-12 bg-purple-500 rounded-full mb-6"></div>
              <ul className="space-y-4 relative z-10 flex-1">
                {[1,2,3,4].map(n => (<li key={n} className="flex items-start gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors"><div className="mt-0.5 min-w-[16px]"><Sparkles className="w-4 h-4 text-purple-500" /></div><span>{t(`roadmap.col3.f${n}`)}</span></li>))}
              </ul>
            </div>

          </div>

          {/* CTA */}
          <div className="relative rounded-2xl p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x shadow-2xl">
            <div className="bg-[#0f111a] rounded-xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Get Founder Access to Everything</h3>
                    <p className="text-gray-400 text-sm max-w-lg">
                        One subscription secures your access to Beta, Version 1.0, and the future 2.0 Intelligence Core. Price locks in forever.
                    </p>
                </div>
                <button 
                  onClick={() => setPaywallOpen(true)}
                  className="whitespace-nowrap px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-bold text-sm transition-all transform hover:scale-105 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer"
                >
                  {t('roadmap.cta')} <ArrowRight className="w-4 h-4" />
                </button>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#020305] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                <img src={logoFull} alt="Cytyos" className="h-6 w-auto opacity-50" />
                <span className="text-xs text-gray-600">{t('landing.footer_rights')}</span>
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
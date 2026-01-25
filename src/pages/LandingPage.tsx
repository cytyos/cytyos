// ... (imports iguais)
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Rocket, CheckCircle2, Sparkles, ArrowRight, Play, Globe, ChevronDown, Zap, LayoutGrid } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import logoFull from '../assets/logo-full.png'; 

// ... (resto dos componentes)

export const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate(); 
  const { setPaywallOpen } = useSettingsStore();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
  };

  // --- ALTERADO: Agora força a aba 'signup' ---
  const handleEnterApp = () => {
      navigate('/login', { state: { tab: 'signup' } }); 
  };
  // ------------------------------------------

  const handleLogin = () => {
      navigate('/login');
  };

  // ... (o restante do JSX permanece igual, pois o click chama handleEnterApp)
  // Certifique-se apenas de que o botão principal (Começar Agora/Try Free) chama {handleEnterApp}
  
  return (
    // ... (mesmo código de UI anterior)
    <button 
        onClick={handleEnterApp} 
        className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all transform hover:-translate-y-1 shadow-xl shadow-white/10 z-10 cursor-pointer"
    >
        <Play className="w-4 h-4 fill-current" />
        {t('landing.hero.btn_try')}
    </button>
    // ...
  );
};
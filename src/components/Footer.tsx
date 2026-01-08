import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'; // <--- NEW IMPORT

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="fixed bottom-0 left-0 w-full h-8 bg-[#0f111a] border-t border-gray-800 flex justify-between items-center px-4 z-[9999] pointer-events-auto shadow-2xl">
      
      {/* Left: Copyright & Privacy Link */}
      <div className="text-[10px] text-gray-500 font-mono hidden md:flex items-center gap-4">
        <span>{t('landing.footer_rights') || "© 2026 Cytyos Inc."}</span>
        
        {/* PRIVACY LINK ADDED HERE */}
        <Link 
            to="/privacy" 
            className="hover:text-indigo-400 transition-colors cursor-pointer border-l border-gray-700 pl-4"
            title="View Privacy Policy & Terms"
        >
            Privacy & Terms
        </Link>
      </div>

      {/* Center: Disclaimer */}
      <div className="text-[9px] md:text-[10px] text-gray-400 text-center mx-auto w-full md:w-auto truncate px-2">
        {t('footer.disclaimer') || "AI results may vary. Consult a professional."}
      </div>

      {/* Right: Version */}
      <div className="text-[9px] text-indigo-500 font-mono whitespace-nowrap font-bold flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
        v0.9 Beta
      </div>
    </footer>
  );
};
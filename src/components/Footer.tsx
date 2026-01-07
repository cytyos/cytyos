import React from 'react';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-0 left-0 w-full h-8 bg-[#0f111a] border-t border-gray-700 flex justify-between items-center px-4 z-[9999] pointer-events-auto shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
      
      {/* Esquerda: Copyright */}
      <div className="text-[10px] text-gray-500 font-mono hidden md:block">
        {t('landing.footer_rights')}
      </div>

      {/* Centro: Disclaimer */}
      <div className="text-[9px] md:text-[10px] text-gray-400 text-center mx-auto w-full md:w-auto truncate px-2">
        {t('footer.disclaimer')}
      </div>

      {/* Direita: Versão */}
      <div className="text-[9px] text-indigo-500 font-mono whitespace-nowrap font-bold flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
        v0.9 Beta
      </div>
    </div>
  );
};
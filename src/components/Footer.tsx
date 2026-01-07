import React from 'react';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-0 left-0 w-full h-8 bg-[#0f111a] border-t border-gray-800 flex justify-between items-center px-4 z-[9999] pointer-events-auto shadow-2xl">
      
      {/* Esquerda */}
      <div className="text-[10px] text-gray-500 font-mono hidden md:block">
        {t('landing.footer_rights')}
      </div>

      {/* Centro */}
      <div className="text-[9px] md:text-[10px] text-gray-400 text-center mx-auto w-full md:w-auto truncate px-2">
        {t('footer.disclaimer')}
      </div>

      {/* Direita */}
      <div className="text-[9px] text-indigo-500/80 font-mono whitespace-nowrap font-bold">
        v0.9 Beta
      </div>
    </div>
  );
};
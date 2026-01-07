import React from 'react';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className="absolute bottom-0 left-0 w-full h-8 bg-[#0f111a]/95 backdrop-blur-md border-t border-white/10 flex justify-between items-center px-4 z-40 pointer-events-auto">
      
      {/* Esquerda: Copyright (Escondido em mobile para economizar espaço) */}
      <div className="text-[10px] text-gray-500 font-mono hidden md:block">
        {t('landing.footer_rights')}
      </div>

      {/* Centro: Disclaimer (Importante para IA) */}
      <div className="text-[9px] md:text-[10px] text-gray-400 text-center mx-auto w-full md:w-auto truncate md:overflow-visible px-2">
        {t('footer.disclaimer')}
      </div>

      {/* Direita: Versão */}
      <div className="text-[9px] text-indigo-400/60 font-mono whitespace-nowrap">
        Beta v0.9
      </div>
    </div>
  );
};
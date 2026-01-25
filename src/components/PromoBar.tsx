import React, { useState, useEffect } from 'react';
import { X, Zap } from 'lucide-react';

export const PromoBar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isBrazil = 
      navigator.language.includes('pt') || 
      Intl.DateTimeFormat().resolvedOptions().timeZone.includes('Sao_Paulo') ||
      Intl.DateTimeFormat().resolvedOptions().timeZone.includes('Brazil');

    const isVip = localStorage.getItem('cytyos_license_type') === 'VIP';

    if (isBrazil && !isVip) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="relative z-[60] w-full bg-gradient-to-r from-indigo-900 via-indigo-600 to-green-600 text-white shadow-xl animate-in slide-in-from-top duration-500">
      
      {/* Container: Padding reduzido no mobile (py-1.5) e layout ajustado */}
      <div className="max-w-7xl mx-auto px-3 py-1.5 md:py-2.5 flex flex-wrap md:flex-row items-center justify-center gap-x-3 gap-y-1 text-center md:gap-6">
        
        {/* Texto: Versão Curta (Mobile) e Longa (Desktop) */}
        <div className="flex items-center gap-1.5 text-[10px] md:text-sm font-medium tracking-wide">
          <span className="text-sm md:text-lg">🇧🇷</span>
          
          {/* Texto Mobile (Curto para tentar ficar na mesma linha ou ocupar menos espaço) */}
          <span className="md:hidden leading-tight">
            Oferta Brasil: <strong>12x R$ 97,10</strong>
          </span>

          {/* Texto Desktop (Completo) */}
          <span className="hidden md:inline">
            <strong>Oferta Exclusiva Brasil:</strong> Tenha acesso anual completo por apenas <span className="underline decoration-green-300 underline-offset-4 font-bold">12x R$ 97,10</span>.
          </span>
        </div>

        {/* Botão de Ação: Mais compacto no mobile (py-0.5) */}
        <a 
          href="https://buy.stripe.com/14A4gy75b8ey0ZE1C2gMw07" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white text-indigo-700 hover:bg-gray-100 px-3 py-1 md:px-5 md:py-1.5 rounded-full text-[9px] md:text-xs font-extrabold uppercase tracking-wider transition-all transform hover:scale-105 shadow-md flex items-center gap-1 whitespace-nowrap"
        >
          <Zap className="w-3 h-3 fill-current" />
          Garantir
        </a>

        {/* Botão Fechar: Ajustado para não sobrepor */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-white/70 hover:text-white hover:bg-black/10 rounded-full transition-colors"
          title="Fechar oferta"
        >
          <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>

      </div>
    </div>
  );
};
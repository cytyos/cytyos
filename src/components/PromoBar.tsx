import React, { useState, useEffect } from 'react';
import { X, Zap } from 'lucide-react';

export const PromoBar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Lógica de Detecção de Localização (Brasil)
    const isBrazil = 
      navigator.language.includes('pt') || 
      Intl.DateTimeFormat().resolvedOptions().timeZone.includes('Sao_Paulo') ||
      Intl.DateTimeFormat().resolvedOptions().timeZone.includes('Brazil');

    // 2. Lógica de Verificação de Plano (Baseado no localStorage que já usamos)
    const isVip = localStorage.getItem('cytyos_license_type') === 'VIP';

    // 3. Regra de Exibição: É Brasil E NÃO é VIP?
    if (isBrazil && !isVip) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    // Barra com z-index alto para ficar acima do mapa
    // Gradiente alterado: Indigo (Marca) -> Verde (Dinheiro/Sucesso)
    <div className="relative z-[60] w-full bg-gradient-to-r from-indigo-900 via-indigo-600 to-green-600 text-white shadow-xl animate-in slide-in-from-top duration-500">
      <div className="max-w-7xl mx-auto px-4 py-2 md:py-2.5 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-center">
        
        {/* Texto da Oferta */}
        <div className="flex items-center gap-2 text-xs md:text-sm font-medium tracking-wide">
          <span className="text-lg">🇧🇷</span>
          <span>
            <strong>Oferta Exclusiva Brasil:</strong> Tenha acesso anual completo por apenas <span className="underline decoration-green-300 underline-offset-4 font-bold">12x R$ 97,10</span>.
          </span>
        </div>

        {/* Botão de Ação */}
        <a 
          href="https://buy.stripe.com/14A4gy75b8ey0ZE1C2gMw07" 
          target="_blank" 
          rel="noopener noreferrer"
          // Texto do botão agora é Indigo para combinar com o tema
          className="bg-white text-indigo-700 hover:bg-gray-100 px-5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all transform hover:scale-105 shadow-md flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          Garantir Oferta
        </a>

        {/* Botão Fechar */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/70 hover:text-white hover:bg-black/10 rounded-full transition-colors"
          title="Fechar oferta"
        >
          <X className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
import React from 'react';
import { CheckCircle2, Zap, ShieldCheck, Clock } from 'lucide-react';
import logoFull from '../assets/logo-full.png';

export const BrazilOfferPage = () => {
  return (
    <div className="min-h-screen bg-[#050608] text-white font-sans selection:bg-indigo-500 selection:text-white">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center text-center">
        
        <img src={logoFull} alt="Cytyos" className="h-8 mb-10 opacity-90" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-6 animate-pulse">
          <Zap className="w-3 h-3" /> Condição Exclusiva Brasil
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
          Acesso Anual Founder:<br />
          <span className="text-indigo-400">Lote Especial Brasil</span>
        </h1>

        <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-6 mb-8 w-full max-w-lg">
            <p className="text-gray-400 text-xs uppercase font-bold tracking-widest mb-4">Comparativo de Valor</p>
            
            <div className="flex flex-col gap-2 mb-6">
                <div className="flex justify-between items-center text-gray-500 line-through decoration-red-500/50">
                    <span>Preço Global (USD)</span>
                    <span>$ 296,00</span>
                </div>
                <div className="flex justify-between items-center text-gray-400 line-through decoration-red-500/50">
                    <span>Equivalente em Reais</span>
                    <span>R$ 1.760,00</span>
                </div>
            </div>

            <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-end">
                    <span className="text-white font-bold text-sm mb-1">Preço Lote Brasil:</span>
                    <div className="text-right">
                        <span className="text-3xl font-extrabold text-white block">12x R$ 97,10</span>
                        <span className="text-[10px] text-gray-400">(ou R$ 997 à vista)</span>
                    </div>
                </div>
            </div>
        </div>

        {/* ALERTA IMPORTANTE */}
        <div className="bg-yellow-500/5 border border-yellow-500/20 p-4 rounded-xl text-left mb-8 w-full max-w-lg">
            <h4 className="text-yellow-400 font-bold text-xs uppercase flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4" /> Importante: Ativação Manual
            </h4>
            <p className="text-gray-400 text-xs leading-relaxed">
                Esta é uma oferta "offline". Ao entrar na plataforma, você verá os preços em Dólar. 
                <strong className="text-white"> Ignore.</strong> Seu status será atualizado para PREMIUM (Plano Anual) manualmente pela nossa equipe em até 2 horas após a confirmação.
            </p>
        </div>

        <a 
            href="https://buy.stripe.com/14A4gy75b8ey0ZE1C2gMw07" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-900/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
        >
            Quero meu Acesso Agora
        </a>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 text-left w-full max-w-md">
            <div className="flex items-center gap-2 text-xs text-gray-400"><CheckCircle2 className="w-4 h-4 text-indigo-500"/> Volumetria 3D Ilimitada</div>
            <div className="flex items-center gap-2 text-xs text-gray-400"><CheckCircle2 className="w-4 h-4 text-indigo-500"/> Exportação PDF</div>
            <div className="flex items-center gap-2 text-xs text-gray-400"><Clock className="w-4 h-4 text-indigo-500"/> Acesso por 12 Meses</div>
            <div className="flex items-center gap-2 text-xs text-gray-400"><CheckCircle2 className="w-4 h-4 text-indigo-500"/> Atualizações v1.0 e v2.0</div>
        </div>

      </div>
    </div>
  );
};
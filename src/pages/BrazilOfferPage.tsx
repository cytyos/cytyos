import React from 'react';
import { CheckCircle2, Zap, ShieldCheck } from 'lucide-react';
import logoFull from '../assets/logo-full.png';

export const BrazilOfferPage = () => {
  return (
    <div className="min-h-screen bg-[#050608] text-white font-sans selection:bg-green-500 selection:text-black">
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center text-center">
        
        <img src={logoFull} alt="Cytyos" className="h-8 mb-8 opacity-80" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest mb-6 animate-pulse">
          <Zap className="w-3 h-3" /> Condição Exclusiva Brasil
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
          IA de Viabilidade:<br />
          <span className="text-green-400">Acesso Vitalício (Lote Brasil)</span>
        </h1>

        <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed max-w-lg">
          Garanta acesso anual à IA que gera estudos de viabilidade e volumetria em segundos.
          <br /><br />
          Preço Global: <span className="line-through text-gray-600">US$ 296</span>
          <br />
          <span className="text-white font-bold text-xl">Preço por este link: 12x R$ 97,10</span>
        </p>

        {/* ALERTA IMPORTANTE */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-left mb-8 w-full">
            <h4 className="text-yellow-400 font-bold text-xs uppercase flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4" /> Atenção: Ativação Manual
            </h4>
            <p className="text-gray-400 text-xs leading-relaxed">
                Esta é uma oferta exclusiva offline. Ao entrar na plataforma, você poderá ver preços em Dólar. 
                <strong className="text-white"> Ignore.</strong> Seu status será atualizado para PREMIUM manualmente em até 2 horas após o pagamento.
            </p>
        </div>

        <a 
            href="https://buy.stripe.com/14A4gy75b8ey0ZE1C2gMw07" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full md:w-auto bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-green-900/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
        >
            Quero meu Acesso (R$ 97,10)
        </a>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 text-left w-full max-w-md">
            <div className="flex items-center gap-2 text-xs text-gray-400"><CheckCircle2 className="w-4 h-4 text-green-500"/> Volumetria 3D Ilimitada</div>
            <div className="flex items-center gap-2 text-xs text-gray-400"><CheckCircle2 className="w-4 h-4 text-green-500"/> Exportação PDF</div>
            <div className="flex items-center gap-2 text-xs text-gray-400"><CheckCircle2 className="w-4 h-4 text-green-500"/> Dados de Zoneamento</div>
            <div className="flex items-center gap-2 text-xs text-gray-400"><CheckCircle2 className="w-4 h-4 text-green-500"/> Garantia de 7 Dias</div>
        </div>

      </div>
    </div>
  );
};
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import logoFull from '../assets/logo-full.png';

export const ThankYouPage = () => {
  const navigate = useNavigate();

  // --- FACEBOOK PIXEL TRACKING ---
  useEffect(() => {
    // Verifica se o objeto fbq existe (se o Pixel carregou no App.tsx)
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        currency: "BRL",
        value: 97.00, // Valor enviado para otimização do Ads
        content_name: "Assinatura Cytios - Oferta Brasil"
      });
      
      // Opcional: Log para você ver no console se disparou
      console.log("✅ Pixel Purchase Event Fired: R$ 97.00");
    }
  }, []);
  // -------------------------------

  return (
    <div className="min-h-screen bg-[#050608] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#0f111a] border border-gray-800 rounded-3xl p-8 text-center shadow-2xl">
        
        <img src={logoFull} alt="Cytyos" className="h-8 mx-auto mb-8 opacity-80" />
        
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">Pagamento Confirmado!</h1>
        
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Obrigado por se tornar um Membro Fundador.
            <br/><br/>
            Se você ainda não tem conta, crie agora com o <strong className="text-white">MESMO E-MAIL</strong> da compra para agilizar a liberação.
        </p>

        <button 
            onClick={() => navigate('/login', { state: { tab: 'signup' } })}
            className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
        >
            Criar Minha Conta Agora <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
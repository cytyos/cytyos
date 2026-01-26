import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, Zap, ShieldCheck, Clock, Layers, TrendingUp, 
  Star, FileText, ArrowRight, Play, LogIn, ChevronDown 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // Importando contexto de Auth
import logoFull from '../assets/logo-full.png';

export const BrazilOfferPage = () => {
  const navigate = useNavigate();
  const { session } = useAuth(); // Verifica se já está logado

  // AÇÃO PRINCIPAL: CAPTURA DE LEAD (SOFT SELL)
  const handleTestDrive = () => {
      // 1. Marca que o usuário tem direito à oferta (para a PromoBar aparecer no app depois)
      localStorage.setItem('cytyos_brazil_offer_active', 'true');
      
      // 2. Roteamento Inteligente
      if (session) {
          // Se já está logado, vai direto pro app trabalhar
          navigate('/app');
      } else {
          // Se não, vai para o cadastro (SignUp)
          navigate('/login', { state: { tab: 'signup' } });
      }
  };

  // AÇÃO SECUNDÁRIA: LOGIN
  const handleLogin = () => {
      localStorage.setItem('cytyos_brazil_offer_active', 'true');
      navigate('/login', { state: { tab: 'signin' } });
  };

  const scrollToPricing = () => {
    document.getElementById('offer-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050608] text-white font-sans selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* NAVBAR MINIMALISTA */}
      <nav className="fixed top-0 w-full z-50 bg-[#050608]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <img src={logoFull} alt="Cytyos" className="h-6 md:h-7 opacity-90" />
            <div className="flex items-center gap-4">
                <button onClick={scrollToPricing} className="hidden md:block text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider">
                    Ver Oferta Brasil
                </button>
                <div className="h-4 w-px bg-white/10 hidden md:block"></div>
                <button onClick={handleLogin} className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                    ENTRAR <LogIn className="w-3 h-3" />
                </button>
            </div>
        </div>
      </nav>

      {/* --- HERO SECTION (NOVA: FOCO EM CADASTRO/TESTE) --- */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
            
            {/* ALTERAÇÃO AQUI: 
               Transformado de div para button.
               Adicionado onClick={handleTestDrive}.
               Adicionado classes de hover e cursor pointer.
            */}
            <button 
                onClick={handleTestDrive}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-6 animate-fade-in hover:bg-indigo-500/20 transition-colors cursor-pointer"
            >
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                Inteligência Artificial para Arquitetura & Real Estate
            </button>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                Estudos de Viabilidade e <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
                    Volumetria em Segundos.
                </span>
            </h1>

            <p className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto">
                Não perca dias calculando áreas e desenhando massas manualmente. 
                Teste a ferramenta que automatiza o zoneamento e o VGV do seu terreno.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
                <button 
                    onClick={handleTestDrive}
                    className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-xl font-bold text-base shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                    <Play className="w-4 h-4 fill-current" />
                    Testar Plataforma Gratuitamente
                </button>
                <p className="text-xs text-gray-500 sm:hidden mt-2">Não requer cartão de crédito para testar.</p>
            </div>
            
            <div className="mt-6 flex justify-center items-center gap-6 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Sem cartão para começar</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Resultados imediatos</span>
            </div>
        </div>
      </section>

      {/* --- GRID DE BENEFÍCIOS (A PONTE) --- */}
      <section className="py-12 border-y border-white/5 bg-[#0a0c10]">
        <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#15171e] p-6 rounded-2xl border border-white/5">
                    <div className="bg-indigo-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4"><Layers className="w-5 h-5 text-indigo-400" /></div>
                    <h3 className="text-white font-bold mb-2">Volumetria 3D</h3>
                    <p className="text-sm text-gray-400">Desenhe o perímetro e a IA gera a massa com recuos e alturas automaticamente.</p>
                </div>
                <div className="bg-[#15171e] p-6 rounded-2xl border border-white/5">
                    <div className="bg-green-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4"><TrendingUp className="w-5 h-5 text-green-400" /></div>
                    <h3 className="text-white font-bold mb-2">Quadro de Áreas & VGV</h3>
                    <p className="text-sm text-gray-400">Cálculo instantâneo de área privativa, potencial construtivo e receita estimada.</p>
                </div>
                <div className="bg-[#15171e] p-6 rounded-2xl border border-white/5">
                    <div className="bg-blue-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4"><FileText className="w-5 h-5 text-blue-400" /></div>
                    <h3 className="text-white font-bold mb-2">Exportação PDF</h3>
                    <p className="text-sm text-gray-400">Gere relatórios profissionais para apresentar a investidores e clientes.</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- OFERTA (HARD SELL NO FUNDO) --- */}
      <section id="offer-section" className="pt-20 px-6 max-w-4xl mx-auto flex flex-col items-center text-center">
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Gostou do que viu? <span className="text-indigo-400">Torne-se um Fundador.</span>
        </h2>
        <p className="text-gray-400 text-sm md:text-base mb-10 max-w-xl">
            Aproveite a condição exclusiva para o Brasil e garanta acesso vitalício às atualizações de 2026 (v1.0 e v2.0) pelo preço de early bird.
        </p>

        {/* PRICING CARD */}
        <div className="bg-[#0f111a] border border-indigo-500/30 rounded-3xl p-8 w-full max-w-lg shadow-[0_0_50px_rgba(79,70,229,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Lote Brasil
            </div>

            <div className="flex flex-col gap-1 mb-6 border-b border-white/5 pb-6">
                <div className="flex justify-between items-center text-gray-500 line-through decoration-red-500/50 text-xs">
                    <span>Preço Global</span>
                    <span>US$ 296/ano</span>
                </div>
                <div className="flex justify-between items-end mt-2">
                    <span className="text-white font-bold text-sm">Oferta Especial:</span>
                    <div className="text-right">
                        <span className="text-4xl font-extrabold text-white block">12x R$ 97,10</span>
                        <span className="text-[10px] text-gray-400">(Total R$ 1.165,20 /ano)</span>
                    </div>
                </div>
            </div>

            <ul className="space-y-3 text-left mb-8">
                <li className="flex items-center gap-2 text-xs text-gray-300"><CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0"/> <span>Acesso Ilimitado à Plataforma</span></li>
                <li className="flex items-center gap-2 text-xs text-gray-300"><CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0"/> <span>Atualização Garantida v1.0 (Março)</span></li>
                <li className="flex items-center gap-2 text-xs text-gray-300"><CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0"/> <span>Preço travado para v2.0 (IA Preditiva)</span></li>
            </ul>

            {/* BOTÃO DE COMPRA */}
            <a 
                href="https://buy.stripe.com/14A4gy75b8ey0ZE1C2gMw07" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full block bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold text-sm shadow-lg transition-all transform hover:scale-[1.02]"
            >
                Quero Garantir a Oferta Brasil
            </a>
            
            <p className="text-[10px] text-gray-500 mt-4 leading-tight">
                *Ativação manual em até 2h. Você receberá um e-mail de confirmação.
            </p>
        </div>

      </section>

      <div className="mt-16 text-center">
        <p className="text-[10px] text-gray-600">© 2026 Cytyos Inc.</p>
      </div>

    </div>
  );
};
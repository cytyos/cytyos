import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Zap, ShieldCheck, Clock, Layers, TrendingUp, Star, FileText, ArrowRight, LogIn } from 'lucide-react';
import logoFull from '../assets/logo-full.png';

export const BrazilOfferPage = () => {
  const navigate = useNavigate();

  // Função Inteligente:
  // Marca o navegador do usuário com a oferta e manda ele para o cadastro.
  // Assim, quando ele entrar no App, o botão de "Resgatar Oferta" vai aparecer lá dentro.
  const handleTestDrive = () => {
      localStorage.setItem('cytyos_brazil_offer_active', 'true');
      navigate('/login', { state: { tab: 'signup' } });
  };

  const handleLogin = () => {
      localStorage.setItem('cytyos_brazil_offer_active', 'true'); // Marca também, caso ele queira comprar depois
      navigate('/login', { state: { tab: 'signin' } });
  };

  return (
    <div className="min-h-screen bg-[#050608] text-white font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Navbar Minimalista */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center max-w-4xl left-1/2 -translate-x-1/2">
        <img src={logoFull} alt="Cytyos" className="h-6 opacity-70" />
        <button onClick={handleLogin} className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
            JÁ TENHO CONTA <LogIn className="w-3 h-3" />
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-6 animate-pulse">
          <Zap className="w-3 h-3" /> Condição Exclusiva Brasil
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
          Plano Founder Early Bird:<br />
          <span className="text-indigo-400">Acesso Anual Completo</span>
        </h1>

        <p className="text-gray-400 text-base md:text-lg mb-10 leading-relaxed max-w-2xl">
          Garanta sua posição de membro fundador. Você recebe acesso imediato às ferramentas atuais e 
          <strong> garante todas as atualizações de 2026</strong> (incluindo a v1.0 em Março e a v2.0 IA) sem aumento de preço.
        </p>

        {/* PRICING CARD */}
        <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-6 mb-8 w-full max-w-lg shadow-2xl shadow-indigo-900/10">
            <div className="flex flex-col gap-2 mb-6 border-b border-white/5 pb-6">
                <div className="flex justify-between items-center text-gray-500 line-through decoration-red-500/50 text-sm">
                    <span>Preço Global (USD)</span>
                    <span>$ 296,00 /ano</span>
                </div>
                <div className="flex justify-between items-center text-gray-400 line-through decoration-red-500/50 text-sm">
                    <span>Equivalente em Reais</span>
                    <span>R$ 1.760,00 /ano</span>
                </div>
            </div>

            <div className="text-center">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">Oferta Especial (Lote Brasil)</span>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-5xl font-extrabold text-white">12x R$ 97,10</span>
                </div>
                <span className="text-xs text-gray-500 mt-2 block">(Total de R$ 1.165,20 anual)</span>
            </div>
        </div>

        {/* BOTOES DE AÇÃO (O DUPLO FLUXO) */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-10 max-w-lg">
            {/* Botão 1: Compra Direta */}
            <a 
                href="https://buy.stripe.com/14A4gy75b8ey0ZE1C2gMw07" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 rounded-xl font-bold text-sm shadow-xl shadow-indigo-900/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 text-center"
            >
                Quero Garantir Agora
            </a>
            
            {/* Botão 2: Teste Grátis (Leva para o App) */}
            <button 
                onClick={handleTestDrive}
                className="flex-1 bg-[#1a1d26] hover:bg-[#252a36] text-white border border-gray-700 hover:border-gray-500 px-6 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 text-center group"
            >
                Testar a Plataforma <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

        {/* ALERTA DE ATIVAÇÃO */}
        <div className="bg-yellow-500/5 border border-yellow-500/20 p-4 rounded-xl text-left mb-10 w-full max-w-lg flex gap-3">
            <ShieldCheck className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
                <h4 className="text-yellow-400 font-bold text-xs uppercase mb-1">
                    Importante: Ativação Manual
                </h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                    Esta oferta é "offline". Ao entrar na plataforma, você verá os preços em Dólar. 
                    <strong className="text-white"> Ignore.</strong> Seu status será atualizado para PREMIUM (Plano Anual) manualmente pela nossa equipe em até 2 horas após a confirmação.
                </p>
            </div>
        </div>

        {/* LISTA DE BENEFÍCIOS */}
        <div className="w-full text-left max-w-4xl border-t border-white/5 pt-12">
            <h3 className="text-xl font-bold text-white mb-8 text-center">O que está incluso no Early Bird?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-[#1a1d26] p-4 rounded-xl border border-white/5 flex gap-3">
                    <div className="bg-indigo-500/20 p-2 rounded-lg h-fit"><Layers className="w-5 h-5 text-indigo-400" /></div>
                    <div>
                        <h4 className="font-bold text-white text-sm">Volumetria 3D Instantânea</h4>
                        <p className="text-xs text-gray-400 mt-1">Desenhe o terreno e gere a massa 3D com recuos e alturas automáticas.</p>
                    </div>
                </div>

                <div className="bg-[#1a1d26] p-4 rounded-xl border border-white/5 flex gap-3">
                    <div className="bg-green-500/20 p-2 rounded-lg h-fit"><TrendingUp className="w-5 h-5 text-green-400" /></div>
                    <div>
                        <h4 className="font-bold text-white text-sm">Viabilidade Financeira (VGV)</h4>
                        <p className="text-xs text-gray-400 mt-1">Cálculo automático de Área Privativa, Potencial Construtivo e Receita estimada.</p>
                    </div>
                </div>

                <div className="bg-[#1a1d26] p-4 rounded-xl border border-white/5 flex gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg h-fit"><FileText className="w-5 h-5 text-blue-400" /></div>
                    <div>
                        <h4 className="font-bold text-white text-sm">Exportação de Relatórios PDF</h4>
                        <p className="text-xs text-gray-400 mt-1">Gere apresentações profissionais ilimitadas para seus clientes e investidores.</p>
                    </div>
                </div>

                <div className="bg-[#1a1d26] p-4 rounded-xl border border-white/5 flex gap-3">
                    <div className="bg-purple-500/20 p-2 rounded-lg h-fit"><Zap className="w-5 h-5 text-purple-400" /></div>
                    <div>
                        <h4 className="font-bold text-white text-sm">Atualização v1.0 (Março/26)</h4>
                        <p className="text-xs text-gray-400 mt-1">Garante acesso aos dados de zoneamento automáticos e comparador de terrenos.</p>
                    </div>
                </div>

                <div className="bg-[#1a1d26] p-4 rounded-xl border border-white/5 flex gap-3">
                    <div className="bg-yellow-500/20 p-2 rounded-lg h-fit"><Star className="w-5 h-5 text-yellow-400" /></div>
                    <div>
                        <h4 className="font-bold text-white text-sm">Projetos Ilimitados</h4>
                        <p className="text-xs text-gray-400 mt-1">Crie, edite e salve quantos estudos de viabilidade você precisar.</p>
                    </div>
                </div>

                <div className="bg-[#1a1d26] p-4 rounded-xl border border-white/5 flex gap-3">
                    <div className="bg-gray-700/50 p-2 rounded-lg h-fit"><Clock className="w-5 h-5 text-gray-300" /></div>
                    <div>
                        <h4 className="font-bold text-white text-sm">Preço Travado (v2.0)</h4>
                        <p className="text-xs text-gray-400 mt-1">Seu preço não sobe quando lançarmos as ferramentas de IA Preditiva no final do ano.</p>
                    </div>
                </div>

            </div>
        </div>

        <div className="mt-16 text-[10px] text-gray-600 pb-10">
            © 2026 Cytyos Inc. Oferta válida por tempo limitado.
        </div>

      </div>
    </div>
  );
};
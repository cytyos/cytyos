import React, { useEffect, useState } from 'react';
import { Trash2, Plus, Tag, Clock, ArrowLeft, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { couponService } from '../services/couponService';

export const AdminPage = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<any[]>([]);
  
  // Inputs de Criação
  const [newCode, setNewCode] = useState('');
  const [duration, setDuration] = useState(60); // Padrão 60 min
  const [loading, setLoading] = useState(false);

  // Controle de Visualização de Leads
  const [expandedCoupon, setExpandedCoupon] = useState<string | null>(null);
  const [leadsMap, setLeadsMap] = useState<Record<string, any[]>>({});

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const data = await couponService.getAll();
      setCoupons(data || []);
    } catch (error) {
      console.error("Erro ao carregar", error);
    }
  };

  const handleCreate = async () => {
    if (!newCode) return;
    setLoading(true);
    try {
      await couponService.create(newCode, duration); 
      setNewCode('');
      setDuration(60); 
      await loadCoupons();
    } catch (error) {
      alert("Erro: Código já existe?");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deletar este cupom?")) return;
    await couponService.delete(id);
    await loadCoupons();
  };

  const toggleLeads = async (code: string) => {
    if (expandedCoupon === code) {
        setExpandedCoupon(null);
        return;
    }
    
    if (!leadsMap[code]) {
        const leads = await couponService.getLeads(code);
        setLeadsMap(prev => ({ ...prev, [code]: leads }));
    }
    setExpandedCoupon(code);
  };

  const formatDuration = (mins: number) => {
    if (mins >= 1440) return `${(mins / 1440).toFixed(1)} dias`;
    if (mins >= 60) return `${(mins / 60).toFixed(1)} horas`;
    return `${mins} min`;
  };

  return (
    <div className="min-h-screen bg-[#0f111a] p-8 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Influencer Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">Gerencie campanhas e leads.</p>
          </div>
          <button onClick={() => navigate('/app')} className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition flex items-center gap-2 text-sm">
            <ArrowLeft size={16} /> Voltar ao App
          </button>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-400">
            <Plus size={20} /> Nova Campanha
          </h2>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:flex-1">
                <label className="text-xs text-gray-500 font-bold ml-1 mb-1 block">CÓDIGO (ex: JULIA2026)</label>
                <input 
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="NOME DO INFLUENCER" 
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition font-mono uppercase"
                />
            </div>
            
            <div className="w-full md:w-48">
                <label className="text-xs text-gray-500 font-bold ml-1 mb-1 block">DURAÇÃO TRIAL</label>
                <select 
                    value={duration} 
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition appearance-none"
                >
                    <option value={60}>1 Hora (Padrão)</option>
                    <option value={120}>2 Horas</option>
                    <option value={1440}>24 Horas (1 Dia)</option>
                    <option value={4320}>3 Dias</option>
                    <option value={10080}>7 Dias (VIP/Gravação)</option>
                    <option value={43200}>30 Dias</option>
                </select>
            </div>

            <button 
              onClick={handleCreate}
              disabled={loading || !newCode}
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-8 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
            >
              {loading ? '...' : 'Criar'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Campanhas Ativas</h2>
          
          <div className="grid gap-3">
            {coupons.map(coupon => (
              <div key={coupon.id} className="bg-gray-800/40 border border-gray-700/50 rounded-xl overflow-hidden transition hover:border-indigo-500/30">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">
                        <Tag size={18} />
                    </div>
                    <div>
                      <div className="font-mono text-lg font-bold text-white tracking-wide">{coupon.code}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="flex items-center gap-1"><Clock size={12} /> {formatDuration(coupon.duration_minutes)}</span>
                        <span>•</span>
                        <span className="text-indigo-300">Criado em {new Date(coupon.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                      <button 
                        onClick={() => toggleLeads(coupon.code)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition flex items-center gap-2 ${expandedCoupon === coupon.code ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'}`}
                      >
                         <Users size={14} /> 
                         Ver Leads
                         {expandedCoupon === coupon.code ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                      </button>
                      <button onClick={() => handleDelete(coupon.id)} className="p-2 text-gray-600 hover:text-red-400 transition"><Trash2 size={18} /></button>
                  </div>
                </div>

                {expandedCoupon === coupon.code && (
                    <div className="bg-black/20 border-t border-gray-700/50 p-4 animate-in slide-in-from-top-2">
                        {leadsMap[coupon.code]?.length > 0 ? (
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold mb-2 border-b border-gray-700 pb-1">
                                    <span>Email do Usuário (Lead)</span>
                                    <span>Data de Ativação</span>
                                </div>
                                {leadsMap[coupon.code]?.map((lead: any) => (
                                    <div key={lead.id} className="flex justify-between text-xs text-gray-300 py-1 hover:bg-white/5 rounded px-2 -mx-2">
                                        <span className="font-mono">{lead.user_email}</span>
                                        <span className="text-gray-500">{new Date(lead.used_at).toLocaleString()}</span>
                                    </div>
                                ))}
                                <div className="pt-2 text-[10px] text-right text-indigo-400 font-bold">
                                    Total de Conversões: {leadsMap[coupon.code]?.length}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-sm text-gray-500 italic py-2">Nenhum uso registrado ainda.</div>
                        )}
                    </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
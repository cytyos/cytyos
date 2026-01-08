import React, { useEffect, useState } from 'react';
import { Trash2, Plus, Tag, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { couponService } from '../services/couponService';

export const AdminPage = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [newCode, setNewCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const data = await couponService.getAll();
      setCoupons(data || []);
    } catch (error) {
      console.error("Erro ao carregar cupons", error);
    }
  };

  const handleCreate = async () => {
    if (!newCode) return;
    setLoading(true);
    try {
      await couponService.create(newCode, 60); // Padrão 60 minutos
      setNewCode('');
      await loadCoupons();
    } catch (error) {
      alert("Erro ao criar cupom. O código já existe?");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja apagar este cupom?")) return;
    try {
      await couponService.delete(id);
      await loadCoupons();
    } catch (error) {
      alert("Erro ao deletar");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f111a] p-8 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Influencer Manager
            </h1>
            <p className="text-gray-400 text-sm mt-1">Gerencie cupons de acesso Trial para parceiros.</p>
          </div>
          <button onClick={() => navigate('/app')} className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition flex items-center gap-2 text-sm">
            <ArrowLeft size={16} /> Voltar ao App
          </button>
        </div>

        {/* Creator Card */}
        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus className="text-indigo-400" size={20} /> Criar Novo Cupom
          </h2>
          <div className="flex gap-4">
            <input 
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              placeholder="Ex: ARQUITETO10 (Código do Influencer)" 
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition"
            />
            <button 
              onClick={handleCreate}
              disabled={loading || !newCode}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
            >
              {loading ? 'Criando...' : 'Gerar Cupom'}
            </button>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-400 uppercase text-xs tracking-wider">Cupons Ativos</h2>
          {coupons.length === 0 && (
            <div className="text-center py-10 text-gray-600 italic">Nenhum cupom criado ainda.</div>
          )}
          
          <div className="grid gap-3">
            {coupons.map(coupon => (
              <div key={coupon.id} className="bg-gray-800/40 border border-gray-700/50 p-4 rounded-xl flex items-center justify-between group hover:border-indigo-500/30 transition">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Tag size={18} />
                  </div>
                  <div>
                    <div className="font-mono text-xl font-bold text-white tracking-wide">{coupon.code}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} /> {coupon.duration_minutes} min de Trial
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(coupon.id)}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
                  title="Revogar Cupom"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
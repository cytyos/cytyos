import React, { useEffect, useState } from 'react';
import { Trash2, Plus, Tag, Clock, ArrowLeft, Users, ChevronDown, ChevronUp, Activity, Ticket, MapPin, Search, FileText, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { couponService } from '../services/couponService';
import { supabase } from '../lib/supabase';

export const AdminPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'coupons' | 'radar'>('coupons');
  
  // --- COUPON STATE ---
  const [coupons, setCoupons] = useState<any[]>([]);
  const [newCode, setNewCode] = useState('');
  const [duration, setDuration] = useState(60); 
  const [loading, setLoading] = useState(false);
  const [expandedCoupon, setExpandedCoupon] = useState<string | null>(null);
  const [leadsMap, setLeadsMap] = useState<Record<string, any[]>>({});

  // --- RADAR STATE ---
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    if (activeTab === 'coupons') loadCoupons();
    if (activeTab === 'radar') loadEvents();
  }, [activeTab]);

  // --- COUPON LOGIC ---
  const loadCoupons = async () => {
    try {
      const data = await couponService.getAll();
      setCoupons(data || []);
    } catch (error) {
      console.error("Error loading coupons", error);
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
      alert("Error: Code might already exist.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
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
    if (mins >= 1440) return `${(mins / 1440).toFixed(1)} days`;
    if (mins >= 60) return `${(mins / 60).toFixed(1)} hours`;
    return `${mins} min`;
  };

  // --- RADAR LOGIC ---
  const loadEvents = async () => {
    setLoadingEvents(true);
    const { data } = await supabase
        .from('app_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
    
    if (data) setEvents(data);
    setLoadingEvents(false);
  };

  // Icon helper for Radar
  const getEventIcon = (name: string) => {
    if (name.includes('search')) return <Search className="w-4 h-4 text-blue-400" />;
    if (name.includes('ai')) return <Activity className="w-4 h-4 text-purple-400" />;
    if (name.includes('pdf')) return <FileText className="w-4 h-4 text-green-400" />;
    return <MapPin className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-[#0f111a] p-8 text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Mission Control
            </h1>
            <p className="text-gray-400 text-sm mt-1">Huul Admin Dashboard</p>
          </div>
          <button onClick={() => navigate('/app')} className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition flex items-center gap-2 text-sm">
            <ArrowLeft size={16} /> Back to App
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-4 border-b border-gray-800 pb-1">
            <button 
                onClick={() => setActiveTab('coupons')}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${activeTab === 'coupons' ? 'bg-indigo-600/20 text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-white'}`}
            >
                <Ticket size={18} /> Influencer Coupons
            </button>
            <button 
                onClick={() => setActiveTab('radar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${activeTab === 'radar' ? 'bg-purple-600/20 text-purple-400 border-b-2 border-purple-500' : 'text-gray-500 hover:text-white'}`}
            >
                <Activity size={18} /> User Radar (Live)
            </button>
        </div>

        {/* === TAB 1: COUPONS === */}
        {activeTab === 'coupons' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
                {/* --- CRIAÇÃO DE CUPOM --- */}
                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl shadow-xl">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-400">
                        <Plus size={20} /> New Campaign
                    </h2>
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:flex-1">
                            <label className="text-xs text-gray-500 font-bold ml-1 mb-1 block">CODE (e.g. JULIA2026)</label>
                            <input 
                                value={newCode}
                                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                                placeholder="INFLUENCER NAME" 
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition font-mono uppercase"
                            />
                        </div>
                        
                        <div className="w-full md:w-48">
                            <label className="text-xs text-gray-500 font-bold ml-1 mb-1 block">TRIAL DURATION</label>
                            <select 
                                value={duration} 
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition appearance-none"
                            >
                                <option value={60}>1 Hour (Standard)</option>
                                <option value={120}>2 Hours</option>
                                <option value={1440}>24 Hours (1 Day)</option>
                                <option value={4320}>3 Days</option>
                                <option value={10080}>7 Days (VIP)</option>
                                <option value={43200}>30 Days</option>
                            </select>
                        </div>

                        <button 
                            onClick={handleCreate}
                            disabled={loading || !newCode}
                            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-8 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
                        >
                            {loading ? '...' : 'Create'}
                        </button>
                    </div>
                </div>

                {/* --- LISTA DE CAMPANHAS --- */}
                <div className="space-y-4">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Active Campaigns</h2>
                    
                    <div className="grid gap-3">
                        {coupons.map(coupon => (
                            <div key={coupon.id} className="bg-gray-800/40 border border-gray-700/50 rounded-xl overflow-hidden transition hover:border-indigo-500/30">
                                {/* Linha Principal */}
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
                                                <span className="text-indigo-300">Created {new Date(coupon.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                         <button 
                                            onClick={() => toggleLeads(coupon.code)}
                                            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition flex items-center gap-2 ${expandedCoupon === coupon.code ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'}`}
                                         >
                                            <Users size={14} /> 
                                            View Leads
                                            {expandedCoupon === coupon.code ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                                         </button>
                                         <button onClick={() => handleDelete(coupon.id)} className="p-2 text-gray-600 hover:text-red-400 transition"><Trash2 size={18} /></button>
                                    </div>
                                </div>

                                {/* Área Expansível (Lista de Leads) */}
                                {expandedCoupon === coupon.code && (
                                    <div className="bg-black/20 border-t border-gray-700/50 p-4 animate-in slide-in-from-top-2">
                                        {leadsMap[coupon.code]?.length > 0 ? (
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold mb-2 border-b border-gray-700 pb-1">
                                                    <span>User Email</span>
                                                    <span>Activation Date</span>
                                                </div>
                                                {leadsMap[coupon.code]?.map((lead: any) => (
                                                    <div key={lead.id} className="flex justify-between text-xs text-gray-300 py-1 hover:bg-white/5 rounded px-2 -mx-2">
                                                        <span className="font-mono">{lead.user_email}</span>
                                                        <span className="text-gray-500">{new Date(lead.used_at).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                                <div className="pt-2 text-[10px] text-right text-indigo-400 font-bold">
                                                    Total Conversions: {leadsMap[coupon.code]?.length}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center text-sm text-gray-500 italic py-2">No leads yet.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* === TAB 2: RADAR (USER ACTIVITY) === */}
        {activeTab === 'radar' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Last 50 Actions</h2>
                    <button onClick={loadEvents} className="text-xs flex items-center gap-1 text-gray-400 hover:text-white bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
                        <RefreshCw size={12} className={loadingEvents ? 'animate-spin' : ''} /> Refresh
                    </button>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-800/50 text-xs text-gray-400 border-b border-gray-700">
                                <th className="p-4 font-bold uppercase w-12">Type</th>
                                <th className="p-4 font-bold uppercase">User</th>
                                <th className="p-4 font-bold uppercase">Action</th>
                                <th className="p-4 font-bold uppercase">Details (Metadata)</th>
                                <th className="p-4 font-bold uppercase text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {events.map((ev) => (
                                <tr key={ev.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="p-2 bg-gray-800 rounded-lg inline-flex">
                                            {getEventIcon(ev.event_name)}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm font-bold text-white">{ev.user_email}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-xs font-mono text-purple-300 bg-purple-900/20 px-2 py-1 rounded w-fit">
                                            {ev.event_name}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <pre className="text-[10px] text-gray-400 font-mono bg-black/30 p-2 rounded max-w-[300px] overflow-x-auto custom-scrollbar">
                                            {JSON.stringify(ev.metadata, null, 2)}
                                        </pre>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="text-xs text-gray-500">
                                            {new Date(ev.created_at).toLocaleTimeString()}
                                        </div>
                                        <div className="text-[10px] text-gray-600">
                                            {new Date(ev.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {events.length === 0 && !loadingEvents && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500 italic">
                                        No activity recorded yet. Go use the app!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};
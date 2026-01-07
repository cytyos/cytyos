import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Plus, Trash, Key, LogOut } from 'lucide-react';

// In a real scenario, these would come from a database (Supabase table 'access_keys')
// For this step, we are visualizing the UI. 
// To make it fully functional, you need to create a table in Supabase.

export const AdminPage = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Mock data representing keys stored in DB
  const [keys, setKeys] = useState([
    { code: 'FOUNDER-2026', type: 'UNLIMITED', usage: 2 },
    { code: 'BETA-TESTER', type: 'TRIAL', usage: 45 },
  ]);
  const [newKey, setNewKey] = useState('');

  useEffect(() => {
    if (!isAdmin) {
        // navigate('/app'); // Uncomment to enforce security
    }
  }, [isAdmin, navigate]);

  const handleAddKey = () => {
    if(!newKey) return;
    setKeys([...keys, { code: newKey.toUpperCase(), type: 'TRIAL', usage: 0 }]);
    setNewKey('');
  };

  return (
    <div className="min-h-screen bg-[#0f111a] p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-gray-800 pb-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Shield className="text-indigo-500" /> Admin Console
                </h1>
                <p className="text-gray-500 text-sm mt-1">Logged as: {user?.email || 'Owner'}</p>
            </div>
            <button onClick={() => { signOut(); navigate('/login'); }} className="text-xs text-red-400 hover:text-white flex items-center gap-1">
                <LogOut className="w-3 h-3" /> Logout
            </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Create Coupon Section */}
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                <h2 className="font-bold mb-4 flex items-center gap-2"><Key className="w-4 h-4 text-emerald-400"/> Generate Access Key</h2>
                <div className="flex gap-2">
                    <input 
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        placeholder="Ex: EVENT-SP-2026"
                        className="flex-1 bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm uppercase"
                    />
                    <button onClick={handleAddKey} className="bg-indigo-600 hover:bg-indigo-500 px-4 rounded-lg font-bold text-sm">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-2">
                    * This adds a key to the internal database allowing users to bypass the paywall.
                    For monetary coupons, use the <a href="https://dashboard.stripe.com/coupons" target="_blank" className="text-indigo-400 underline">Stripe Dashboard</a>.
                </p>
            </div>

            {/* Active Keys List */}
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                <h2 className="font-bold mb-4">Active Internal Keys</h2>
                <div className="space-y-2">
                    {keys.map((k, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-gray-800">
                            <div>
                                <div className="font-mono text-sm text-yellow-400 font-bold">{k.code}</div>
                                <div className="text-[10px] text-gray-500">{k.type} • Used {k.usage} times</div>
                            </div>
                            <button className="text-gray-600 hover:text-red-400"><Trash className="w-4 h-4" /></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
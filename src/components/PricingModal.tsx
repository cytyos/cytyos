import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, Lock, Shield, FileText, Zap, Star, AlertTriangle, 
  Loader2, Map, Layers, Sun, FileCheck, X, Globe, Sparkles 
} from 'lucide-react';
import { couponService } from '../services/couponService';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuth } from '../contexts/AuthContext';

// ==============================================================================
// 1. STRIPE PAYMENT LINKS
// ==============================================================================
const STRIPE_LINKS = {
  monthly: "https://buy.stripe.com/test_eVqcN4gDh3Z9fCUe5pdjO04", // $29.60
  yearly: "https://buy.stripe.com/test_4gMeVc3QveDN3Ucf9tdjO05", // $296.00
  pdfOnly: "https://buy.stripe.com/test_cNicN4aeTanx8as2mHdjO06"  // $17.00
};

// 2. HARDCODED KEYS CONFIGURATION
const OFFLINE_KEYS: Record<string, { type: 'UNLIMITED' | 'TRIAL'; durationHours?: number; label?: string }> = {
  'CYTYOS-MASTER-2025': { type: 'UNLIMITED', label: 'Founder Access' },
};

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal = ({ isOpen, onClose }: PricingModalProps) => {
  const navigate = useNavigate();
  const { setPaywallOpen } = useSettingsStore();
  const { user } = useAuth();
  
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  if (!isOpen) return null;

  // Function to handle global closing via X button
  const handleClose = () => {
    setPaywallOpen(false);
    onClose();
  };

  const handleCheckout = (type: 'subscription' | 'pdf') => {
    let url = '';
    if (type === 'pdf') {
      url = STRIPE_LINKS.pdfOnly;
    } else {
      url = billingCycle === 'monthly' ? STRIPE_LINKS.monthly : STRIPE_LINKS.yearly;
    }

    if (url && url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      alert("Payment link error. Please contact support.");
    }
  };

  const handleValidateKey = async () => {
    setError('');
    setSuccessMsg('');
    if (!accessKey) return;
    
    setIsValidating(true);
    const code = accessKey.toUpperCase().trim();

    try {
        // 1. Check Offline Keys
        if (OFFLINE_KEYS[code]) {
            const keyData = OFFLINE_KEYS[code];
            if (keyData.type === 'UNLIMITED') {
                localStorage.setItem('cytyos_license_type', 'VIP');
                localStorage.removeItem('cytyos_trial_end');
                setSuccessMsg(`Welcome Founder! Unlocked forever.`);
                setTimeout(() => { 
                    handleClose();
                }, 1500);
                return;
            }
        }

        // 2. Check Database Coupons
        try {
            const coupon = await couponService.validateAndTrack(code, user?.email);
            const trialEndsAt = Date.now() + (coupon.duration_minutes * 60 * 1000);
            localStorage.setItem('cytyos_trial_end', trialEndsAt.toString());
            setSuccessMsg(`Trial Activated! ${coupon.duration_minutes}min access granted.`);
            setTimeout(() => { 
                handleClose();
            }, 1500);
        } catch (dbError: any) {
            setError(dbError.message || 'Invalid or Expired Coupon');
        }

    } catch (err) {
        setError('Validation Error');
    } finally {
        setIsValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity animate-fade-in" onClick={handleClose} />

      <div className="relative w-full max-w-5xl bg-[#0f111a] rounded-3xl border border-indigo-500/30 flex flex-col md:flex-row overflow-hidden shadow-2xl animate-scale-up max-h-[95vh] overflow-y-auto custom-scrollbar z-50">
        
        {/* CLOSE BUTTON (X) */}
        <button 
            onClick={handleClose}
            className="absolute top-4 right-4 z-[60] p-2 bg-black/40 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
            <X size={20} />
        </button>

        {/* Left Side: Features & Value Proposition */}
        <div className="w-full md:w-5/12 bg-gradient-to-b from-indigo-950/50 to-black p-8 flex flex-col border-r border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                <Star className="w-3 h-3 text-indigo-400 fill-indigo-400" />
                <span className="text-[10px] font-bold text-indigo-300 tracking-wider uppercase">Founder Opportunity</span>
            </div>
            
            <h3 className="text-3xl font-extrabold text-white mb-2 leading-tight">
              Unlock the <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Full Platform</span>
            </h3>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 my-4">
                <p className="text-yellow-200/90 text-xs flex items-start gap-2 leading-relaxed">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      Warning: Price increases when v1.0 launches. Secure your Early Bird rate for the entire year.
                    </span>
                </p>
            </div>

            {/* EXPANDED FEATURE LIST WITH COLORS */}
            <div className="space-y-5 mt-6">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">What's Included:</h4>
              
              <Feature 
                text="Unlimited AI Feasibility Studies" 
                icon={<Sparkles className="w-4 h-4 text-purple-400" />} 
                highlighted 
              />
              <Feature 
                text="Global 3D City Visualization" 
                icon={<Globe className="w-4 h-4 text-blue-400" />} 
              />
              <Feature 
                text="Automated Zoning Analysis" 
                icon={<Layers className="w-4 h-4 text-cyan-400" />} 
              />
              <Feature 
                text="Shadow & Solar Analysis" 
                icon={<Sun className="w-4 h-4 text-orange-400" />} 
              />
              <Feature 
                text="Professional PDF Exports" 
                icon={<FileCheck className="w-4 h-4 text-emerald-400" />} 
              />
              <Feature 
                text="1-Year Access to v1.0 & v2.0" 
                icon={<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />} 
                highlighted 
              />
              <Feature 
                text="Priority Founder Support" 
                icon={<Shield className="w-4 h-4 text-gray-300" />} 
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
            <div className="flex items-center gap-3 mb-3">
                 <div className="bg-blue-500/20 p-2 rounded-lg">
                    <FileText className="w-4 h-4 text-blue-400"/>
                 </div>
                 <div>
                    <h4 className="text-white text-xs font-bold">Small project?</h4>
                    <p className="text-gray-500 text-[10px]">Generate a single PDF report.</p>
                 </div>
            </div>
            <button onClick={() => handleCheckout('pdf')} className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-300 transition-colors font-medium cursor-pointer">
              Buy One Report ($17)
            </button>
          </div>
        </div>

        {/* Right Side: Pricing Selection */}
        <div className="w-full md:w-7/12 p-8 flex flex-col bg-[#0f111a] relative">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Select your Plan</h2>
            
            {/* TOGGLE SWITCH */}
            <div className="inline-flex bg-black p-1 rounded-full border border-white/10 relative">
                <button 
                    onClick={() => setBillingCycle('monthly')} 
                    className={`relative px-6 py-2 rounded-full text-xs font-bold transition-all z-10 ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Monthly
                </button>
                <button 
                    onClick={() => setBillingCycle('yearly')} 
                    className={`relative px-6 py-2 rounded-full text-xs font-bold transition-all z-10 flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Yearly <span className="bg-green-500 text-black text-[9px] px-1.5 py-0.5 rounded font-extrabold shadow-[0_0_10px_rgba(34,197,94,0.5)]">SAVE 77%</span>
                </button>
                
                {/* Sliding Background */}
                <div className={`absolute top-1 bottom-1 w-[50%] bg-indigo-600 rounded-full transition-all duration-300 ease-out shadow-lg shadow-indigo-500/30 ${billingCycle === 'monthly' ? 'left-1' : 'left-[49%]'}`}></div>
            </div>
          </div>

          {/* PRICING CARD */}
          <div 
            className={`group border-2 rounded-2xl p-6 transition-all mb-8 relative overflow-hidden ${billingCycle === 'yearly' ? 'border-indigo-500 bg-indigo-900/10 shadow-[0_0_40px_rgba(79,70,229,0.15)]' : 'border-white/10 hover:border-white/20'}`}
          >
            {billingCycle === 'yearly' && (
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1 shadow-lg">
                    <Star className="w-3 h-3 fill-current" /> Founder Offer
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
              <div className="text-center md:text-left">
                <h4 className="font-bold text-white text-xl mb-1">
                    {billingCycle === 'monthly' ? 'Standard Access' : 'Founder Annual'}
                </h4>
                <p className="text-gray-400 text-xs">
                    {billingCycle === 'monthly' ? 'Cancel anytime.' : 'Secure v1.0 & v2.0 access.'}
                </p>
                
                {/* SAVE BADGE */}
                {billingCycle === 'yearly' && (
                    <div className="mt-3 inline-block bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/20">
                        SAVE $999 vs Future Price
                    </div>
                )}
              </div>

              <div className="text-center md:text-right">
                {/* FUTURE PRICE STRIKETHROUGH */}
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Future Price</span>
                    <div className="text-gray-500 text-lg line-through font-medium decoration-red-500/50 mb-0">
                        {billingCycle === 'yearly' ? '$1,295' : '$59.30'}
                    </div>
                </div>

                {/* CURRENT PRICE */}
                <div className="flex items-baseline gap-1 justify-center md:justify-end mt-1">
                    <span className="text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
                        ${billingCycle === 'monthly' ? '29.60' : '296'}
                    </span>
                    <span className="text-gray-400 text-sm font-medium">
                        {billingCycle === 'monthly' ? '/mo' : '/year'}
                    </span>
                </div>
              </div>
            </div>

            {/* CHECKOUT BUTTON */}
            <button 
                onClick={() => handleCheckout('subscription')}
                className={`mt-8 w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] cursor-pointer ${
                    billingCycle === 'yearly' 
                    ? 'bg-white text-indigo-950 hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
            >
                {billingCycle === 'yearly' ? 'Lock in Founder Price ($296)' : 'Subscribe Monthly'}
                <Zap className={`w-4 h-4 ${billingCycle === 'yearly' ? 'fill-indigo-950' : 'fill-white'}`} />
            </button>
          </div>

          {/* --- COUPON SECTION --- */}
          <div className="mt-auto bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col gap-3">
             <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400 font-medium flex items-center gap-2"><Lock className="w-3 h-3 text-emerald-500"/> Have an access key?</p>
                <span className="text-[9px] text-gray-600 uppercase tracking-widest">Enterprise / Beta</span>
             </div>
             <div className="flex gap-2">
                <input 
                    value={accessKey} 
                    onChange={(e) => setAccessKey(e.target.value)} 
                    placeholder="ENTER COUPON CODE" 
                    className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 uppercase transition-all placeholder:text-gray-700" 
                    onKeyDown={(e) => e.key === 'Enter' && handleValidateKey()}
                />
                <button 
                    onClick={handleValidateKey} 
                    disabled={isValidating || !accessKey}
                    className="px-4 py-2 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white font-bold rounded-lg text-xs transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                    {isValidating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Validate'}
                </button>
             </div>
             {error && <p className="text-red-400 text-[10px] flex items-center gap-1 animate-in fade-in slide-in-from-top-1"><Shield className="w-3 h-3"/> {error}</p>}
             {successMsg && <p className="text-emerald-400 text-[10px] flex items-center gap-1 animate-in fade-in slide-in-from-top-1"><Check className="w-3 h-3"/> {successMsg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

// Feature Helper Component Updated for Colors
const Feature = ({ text, highlighted = false, icon }: { text: string, highlighted?: boolean, icon?: React.ReactNode }) => (
  <div className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${highlighted ? 'bg-white/5' : ''}`}>
    <div className="shrink-0">
        {icon || <Check className="w-4 h-4 text-gray-400" />}
    </div>
    <span className={`text-sm ${highlighted ? 'text-white font-medium' : 'text-gray-400'}`}>{text}</span>
  </div>
);
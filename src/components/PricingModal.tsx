import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, Lock, Shield, FileText, Zap, Star, AlertTriangle, Loader2, X, Rocket, Sparkles, CheckCircle2 } from 'lucide-react';
import { couponService } from '../services/couponService';
import { useAuth } from '../contexts/AuthContext';

// 1. SEUS LINKS DO STRIPE (ORIGINAIS)
const STRIPE_LINKS = {
  monthly: "https://buy.stripe.com/test_eVqcN4gDh3Z9fCUe5pdjO04",
  yearly: "https://buy.stripe.com/test_4gMeVc3QveDN3Ucf9tdjO05",
  pdfOnly: "https://buy.stripe.com/test_cNicN4aeTanx8as2mHdjO06"
};

const OFFLINE_KEYS: Record<string, { type: 'UNLIMITED' | 'TRIAL'; durationHours?: number; label?: string }> = {
  'CYTYOS-MASTER-2025': { type: 'UNLIMITED', label: 'Founder Access' },
};

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal = ({ isOpen, onClose }: PricingModalProps) => {
  const { t } = useTranslation();
  const { user } = useAuth(); // <--- IMPORTANTE: Pegamos o usuário logado

  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  if (!isOpen) return null;

  // --- LÓGICA DE CHECKOUT AUTOMATIZADO ---
  const handleCheckout = (type: 'subscription' | 'pdf') => {
    let baseUrl = '';
    
    if (type === 'pdf') {
        baseUrl = STRIPE_LINKS.pdfOnly;
    } else {
        baseUrl = billingCycle === 'monthly' ? STRIPE_LINKS.monthly : STRIPE_LINKS.yearly;
    }

    if (baseUrl) {
        // TRUQUE: Adiciona o ID do usuário ao link para o Webhook identificar depois
        const checkoutUrl = user?.id 
            ? `${baseUrl}?client_reference_id=${user.id}` 
            : baseUrl;
            
        window.open(checkoutUrl, '_blank');
    } else {
        alert("Payment link error.");
    }
  };

  const handleValidateKey = async () => {
    setError('');
    setSuccessMsg('');
    if (!accessKey) return;

    setIsValidating(true);
    const code = accessKey.toUpperCase().trim();
    try {
      if (OFFLINE_KEYS[code]) {
        if (OFFLINE_KEYS[code].type === 'UNLIMITED') {
          localStorage.setItem('cytyos_license_type', 'VIP');
          localStorage.removeItem('cytyos_trial_end');
          setSuccessMsg(`Welcome Founder! Unlocked.`);
          setTimeout(() => onClose(), 1000);
          return;
        }
      }
      try {
        const coupon = await couponService.validateAndTrack(code, user?.email);
        const trialEndsAt = Date.now() + (coupon.duration_minutes * 60 * 1000);
        localStorage.setItem('cytyos_trial_end', trialEndsAt.toString());
        setSuccessMsg(`Trial Activated!`);
        setTimeout(() => onClose(), 1000);
      } catch (dbError: any) {
        setError(dbError.message || 'Invalid Coupon');
      }
    } catch (err) {
      setError('Validation Error');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-6xl bg-[#0f111a] md:rounded-3xl border border-indigo-500/30 flex flex-col md:flex-row overflow-hidden shadow-2xl animate-scale-up h-[100dvh] md:h-auto md:max-h-[95vh] overflow-y-auto custom-scrollbar z-50">
        
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="fixed top-4 right-4 z-[100] p-2 bg-black/60 hover:bg-white/10 backdrop-blur-md rounded-full text-white border border-white/10 transition-colors shadow-lg cursor-pointer">
          <X size={24} />
        </button>

        {/* Lado Esquerdo (Features) */}
        <div className="w-full md:w-5/12 bg-gradient-to-b from-[#0a0c10] to-black p-6 md:p-8 flex flex-col border-b md:border-b-0 md:border-r border-white/5 relative shrink-0">
          <div className="mb-6 relative z-10 pt-8 md:pt-0">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
              <Star className="w-3 h-3 text-indigo-400 fill-indigo-400" />
              <span className="text-[10px] font-bold text-indigo-300 tracking-wider uppercase">{t('pricing.badge')}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">{t('pricing.title')}</h3>
            <p className="text-xs text-gray-400 mt-3 border-l-2 border-yellow-500/50 pl-3 leading-relaxed">{t('pricing.warning')}</p>
          </div>
          
          <div className="space-y-3 flex-1">
             {/* Blocos de Features (Simplificado para o código caber, mantenha o seu conteúdo visual aqui se quiser, ou use este padrão limpo) */}
             <div className="rounded-xl bg-gradient-to-br from-indigo-900/10 to-[#0f111a] border border-indigo-500/30 p-4 relative overflow-hidden">
                <h4 className="text-sm font-bold text-white mb-3">{t('pricing.v1_title')}</h4>
                <ul className="space-y-2">
                    {[1,2,3,4].map(n => (
                        <li key={n} className="flex items-start gap-2 text-[10px] text-gray-300">
                            <Rocket className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" /> <span>{t(`pricing.v1_f${n}`)}</span>
                        </li>
                    ))}
                </ul>
             </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] text-gray-400">
                <strong className="text-white block">{t('pricing.small_title')}</strong>
                {t('pricing.small_desc')}
              </div>
              <button onClick={() => handleCheckout('pdf')} className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] text-gray-300 transition-colors font-medium whitespace-nowrap">
                {t('pricing.btn_pdf')}
              </button>
            </div>
          </div>
        </div>

        {/* Lado Direito (Selector & Payment) */}
        <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col bg-[#0f111a] relative justify-center shrink-0">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">{t('pricing.select_plan')}</h2>
            <div className="grid grid-cols-2 bg-black p-1 rounded-full border border-white/10 relative w-full max-w-[350px] mx-auto">
              <button onClick={() => setBillingCycle('monthly')} className={`relative z-10 py-3 rounded-full text-xs font-bold transition-all ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>{t('pricing.monthly')}</button>
              <button onClick={() => setBillingCycle('yearly')} className={`relative z-10 py-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'}`}>
                {t('pricing.yearly')} <span className="bg-green-500 text-black text-[9px] px-1.5 py-0.5 rounded font-extrabold">{t('pricing.save_pct')}</span>
              </button>
              <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-indigo-600 rounded-full transition-all duration-300 ease-out ${billingCycle === 'monthly' ? 'left-1' : 'left-[calc(50%+2px)]'}`}></div>
            </div>
          </div>

          <div className={`group border-2 rounded-2xl p-6 transition-all mb-8 relative overflow-hidden ${billingCycle === 'yearly' ? 'border-indigo-500 bg-indigo-900/10' : 'border-white/10'}`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
              <div className="text-center md:text-left">
                <h4 className="font-bold text-white text-xl mb-1">{billingCycle === 'monthly' ? t('pricing.plan_monthly') : t('pricing.plan_annual')}</h4>
                <p className="text-gray-400 text-xs">{billingCycle === 'monthly' ? t('pricing.sub_monthly') : t('pricing.sub_annual')}</p>
              </div>
              <div className="text-center md:text-right">
                <div className="flex flex-col items-end w-full md:w-auto items-center md:items-end">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{t('pricing.future_price')}</span>
                    <div className="text-gray-500 text-lg line-through font-medium decoration-red-500/50 mb-0">{billingCycle === 'yearly' ? '$1,295' : '$59.30'}</div>
                </div>
                <div className="flex items-baseline gap-1 justify-center md:justify-end mt-1">
                  <span className="text-5xl font-extrabold text-white tracking-tight">${billingCycle === 'monthly' ? '29.60' : '296'}</span>
                  <span className="text-gray-400 text-sm font-medium">{billingCycle === 'monthly' ? '/mo' : '/year'}</span>
                </div>
              </div>
            </div>
            
            <button onClick={() => handleCheckout('subscription')} className={`mt-8 w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] cursor-pointer ${billingCycle === 'yearly' ? 'bg-white text-indigo-950 hover:bg-gray-100' : 'bg-white/10 text-white hover:bg-white/20'}`}>
              {billingCycle === 'yearly' ? t('pricing.btn_annual') : t('pricing.btn_monthly')} <Zap className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-auto bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col gap-3 pb-8 md:pb-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400 font-medium flex items-center gap-2"><Lock className="w-3 h-3 text-emerald-500"/> {t('pricing.coupon_label')}</p>
            </div>
            <div className="flex gap-2">
              <input value={accessKey} onChange={(e) => setAccessKey(e.target.value)} placeholder={t('pricing.coupon_placeholder')} className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-3 md:py-2 text-sm text-white outline-none focus:border-indigo-500 uppercase transition-all" />
              <button onClick={handleValidateKey} disabled={isValidating || !accessKey} className="px-4 py-2 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white font-bold rounded-lg text-xs transition-colors disabled:opacity-50 flex items-center gap-2">
                {isValidating ? <Loader2 className="w-3 h-3 animate-spin" /> : t('pricing.validate')}
              </button>
            </div>
            {error && <p className="text-red-400 text-[10px] flex items-center gap-1"><Shield className="w-3 h-3"/> {error}</p>}
            {successMsg && <p className="text-emerald-400 text-[10px] flex items-center gap-1"><Check className="w-3 h-3"/> {successMsg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // <--- IMPORTANTE
import { supabase } from '../lib/supabase';
import logoFull from '../assets/logo-full.png';
import { Loader2, AlertCircle, X, Mail, Lock, ArrowRight, CheckCircle2, KeyRound, ArrowLeft } from 'lucide-react';

type AuthMode = 'signin' | 'signup' | 'forgot';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // <--- IMPORTANTE
  
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleClose = () => navigate('/');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ 
          email, password, options: { emailRedirectTo: `${window.location.origin}/app` } 
        });
        if (error) throw error;
        if (data.user && !data.session) {
          setSuccessMsg(t('auth.success_signup'));
          setMode('signin');
        } else {
          navigate('/app');
        }
      } else if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/app');
      }
    } catch (err: any) {
      if (err.message.includes('Invalid login')) setError(t('auth.error_invalid'));
      else if (err.message.includes('already registered')) setError(t('auth.error_exists'));
      else setError(err.message || t('auth.error_generic'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/update-password` });
      if (error) throw error;
      setSuccessMsg(t('auth.success_reset'));
    } catch (err: any) {
      setError(t('auth.error_generic'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/app` } });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl relative z-10 animate-scale-up">
        <button onClick={handleClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700 rounded-full transition-colors"><X className="w-5 h-5" /></button>

        <div className="flex justify-center mb-6"><img src={logoFull} alt="Cytyos" className="h-10 object-contain" /></div>

        {mode === 'forgot' ? (
           <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2"><KeyRound className="w-5 h-5 text-indigo-400"/> {t('auth.forgot_title')}</h2>
                <p className="text-xs text-gray-400 mt-2">{t('auth.forgot_desc')}</p>
              </div>
              {successMsg && <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> {successMsg}</div>}
              {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2"><AlertCircle className="w-4 h-4"/> {error}</div>}
              <div>
                <label className="text-xs text-gray-400 font-bold ml-1 uppercase">{t('auth.email_label')}</label>
                <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/40 border border-gray-600 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors text-sm" placeholder="seu@email.com" required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('auth.btn_send')}
              </button>
              <button type="button" onClick={() => { setMode('signin'); setError(''); setSuccessMsg(''); }} className="w-full text-gray-500 hover:text-white text-xs font-medium flex items-center justify-center gap-1 mt-4 transition-colors">
                <ArrowLeft className="w-3 h-3" /> {t('auth.btn_back')}
              </button>
           </form>
        ) : (
          <>
            <div className="flex bg-black/40 p-1 rounded-xl mb-6 border border-gray-700/50">
                <button onClick={() => { setMode('signin'); setError(''); setSuccessMsg(''); }} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'signin' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}>{t('auth.tab_signin')}</button>
                <button onClick={() => { setMode('signup'); setError(''); setSuccessMsg(''); }} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'signup' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}>{t('auth.tab_signup')}</button>
            </div>
            {successMsg && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0"/> {successMsg}</div>}
            {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-start gap-2"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0"/> {error}</div>}
            <form onSubmit={handleAuth} className="space-y-4">
                <div>
                    <label className="text-xs text-gray-400 font-bold ml-1 uppercase">{t('auth.email_label')}</label>
                    <div className="relative mt-1">
                        <Mail className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/40 border border-gray-600 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors text-sm" placeholder="seu@email.com" required />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-xs text-gray-400 font-bold ml-1 uppercase">{t('auth.password_label')}</label>
                        {mode === 'signin' && (
                            <button type="button" onClick={() => setMode('forgot')} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium">{t('auth.forgot_link')}</button>
                        )}
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/40 border border-gray-600 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors text-sm" placeholder="••••••••" required />
                    </div>
                </div>
                <button type="submit" disabled={loading} className={`w-full font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg text-sm ${mode === 'signup' ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-white hover:bg-gray-200 text-black'}`}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === 'signup' ? t('auth.btn_signup') : t('auth.btn_signin'))}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
            </form>
            <div className="my-6 flex items-center gap-3">
                <div className="h-px bg-gray-800 flex-1"></div>
                <span className="text-[10px] text-gray-500 font-bold uppercase">{t('auth.divider')}</span>
                <div className="h-px bg-gray-800 flex-1"></div>
            </div>
            <button type="button" onClick={handleGoogleLogin} disabled={loading} className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-3 border border-white/10 text-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                {t('auth.google')}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
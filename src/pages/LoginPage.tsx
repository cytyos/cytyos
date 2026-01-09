import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, AlertCircle, X } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Function to close/return to landing page
  const handleClose = () => {
    navigate('/');
  };

  // Login with Email/Password
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        // Using Supabase v2 method
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/app');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Login with Google
  // --- FIXED: Uses dynamic URL instead of hardcoded Bolt URL ---
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Dynamically gets the current origin (e.g., https://cytyos.com or localhost)
      const origin = window.location.origin;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Redirects correctly to the current domain + /app
          redirectTo: `${origin}/app`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Close Button */}
        <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors"
        >
            <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mb-8 mt-2">
            {/* TODO: Add your logo here later.
                <img src="/logo-cytyos.png" alt="Cytyos" className="h-16 mb-4 object-contain" /> 
            */}
            <h1 className="text-3xl font-bold text-white tracking-tight">Cytyos Beta</h1>
            <p className="text-gray-400 text-sm mt-2">Territorial Intelligence OS</p>
        </div>

        {/* Email Form */}
        <form onSubmit={handleAuth} className="space-y-4">
            <div>
                <label className="text-xs text-gray-400 font-medium ml-1">Email</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors mt-1"
                    placeholder="name@company.com"
                    required
                />
            </div>
            <div>
                <label className="text-xs text-gray-400 font-medium ml-1">Password</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors mt-1"
                    placeholder="••••••••"
                    required
                />
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20"
            >
                {loading && !isSignUp ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
            <div className="h-px bg-gray-800 flex-1"></div>
            <span className="text-xs text-gray-500 font-medium">OR CONTINUE WITH</span>
            <div className="h-px bg-gray-800 flex-1"></div>
        </div>

        {/* Google Button */}
        <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-70"
        >
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-gray-900" /> : (
                <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
                </>
            )}
        </button>

        <div className="mt-6 text-center">
            <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-gray-500 hover:text-white transition-colors"
            >
                {isSignUp ? 'Already have an account? Login' : 'No account? Join the Beta waitlist'}
            </button>
        </div>
      </div>
    </div>
  );
};
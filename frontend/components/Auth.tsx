
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_URL}/auth/${isLogin ? 'login' : 'register'}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, ...(isLogin ? {} : { name }) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      // Store JWT in localStorage
      localStorage.setItem('token', data.token);
      // You may want to decode the user from the token or backend can return user info
      onLogin({
        id: data.user?.id || email,
        email,
        name: data.user?.name || name || email.split('@')[0],
        tokensUsed: data.user?.tokensUsed || 0,
        repairsCompleted: data.user?.repairsCompleted || 0
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] p-6 font-sans">
      <div className="absolute top-8 left-8">
        <button onClick={onBack} className="text-zinc-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Hub
        </button>
      </div>

      <div className="w-full max-w-[420px] bg-[#0d0d0e] border border-white/[0.05] p-10 rounded-[32px] shadow-3xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-900/20">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">{isLogin ? "Welcome back" : "Create account"}</h1>
          <p className="text-zinc-500 text-sm mt-1">{isLogin ? "Sign in to continue diagnostics" : "Register to start using verified repair AI"}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase px-1 tracking-widest">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-[#161617] border border-white/5 rounded-xl py-3.5 px-5 text-white placeholder-zinc-700 focus:ring-2 focus:ring-orange-600/30 transition-all outline-none" 
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase px-1 tracking-widest">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tech@repairmaster.ai"
              className="w-full bg-[#161617] border border-white/5 rounded-xl py-3.5 px-5 text-white placeholder-zinc-700 focus:ring-2 focus:ring-orange-600/30 transition-all outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase px-1 tracking-widest">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#161617] border border-white/5 rounded-xl py-3.5 px-5 text-white placeholder-zinc-700 focus:ring-2 focus:ring-orange-600/30 transition-all outline-none" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-900/20 transition-all active:scale-[0.98] mt-2"
          >
            {loading ? "Authenticating..." : (isLogin ? "Sign In" : "Register")}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-bold text-zinc-500 hover:text-orange-500 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

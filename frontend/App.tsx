
import React, { useState, useRef, useEffect } from 'react';
import { Message, RepairSession, User } from './types';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
// import { RepairAgent } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'auth' | 'app'>('landing');
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fix_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [sessions, setSessions] = useState<RepairSession[]>(() => {
    const saved = localStorage.getItem('fix_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);


  // Routing and Init Logic
  useEffect(() => {
    if (user && view !== 'app') setView('app');
    if (user && !activeSessionId && sessions.length > 0) setActiveSessionId(sessions[0].id);
  }, [user]);

  useEffect(() => {
    if (user) localStorage.setItem('fix_user', JSON.stringify(user));
    localStorage.setItem('fix_sessions', JSON.stringify(sessions));
  }, [user, sessions]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading, status]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !user) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      setStatus('Contacting backend...');
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Chat failed');

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.message || 'No response from backend.',
        timestamp: new Date(),
        metadata: {
          // Optionally fill with backend data if available
        }
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: err.message || 'Error contacting backend.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      setStatus(null);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fix_user');
    setView('landing');
  };

  if (view === 'landing' && !user) return <LandingPage onStart={() => setView('auth')} />;
  if (view === 'auth' || (!user && view === 'app')) return <Auth onLogin={setUser} onBack={() => setView('landing')} />;

  return (
    <div className="flex h-screen w-full bg-[#050505] text-zinc-200 overflow-hidden font-sans">
      <Sidebar 
        sessions={sessions} 
        activeSessionId={activeSessionId} 
        onSelectSession={setActiveSessionId}
        onNewRepair={() => {
          const id = Date.now().toString();
          setSessions([{ id, title: 'Diagnostic Session', category: 'General', status: 'active', createdAt: new Date() }, ...sessions]);
          setActiveSessionId(id);
          setMessages([]);
        }}
        user={user!}
        onLogout={logout}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-[#0a0a0b]">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0a0b]/60 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500">
              {sessions.find(s => s.id === activeSessionId)?.title || "Active Console"}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-zinc-600 uppercase">API Tokens</span>
                <span className="text-xs font-mono text-orange-500 font-bold tracking-tighter">{user?.tokensUsed.toLocaleString()} <span className="text-zinc-800">/ 500k</span></span>
             </div>
             <button className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                 <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
               </svg>
             </button>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8 md:px-12 lg:px-24">
          <div className="max-w-3xl mx-auto">
            {messages.length === 0 && (
               <div className="py-32 text-center opacity-50">
                 <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-3">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                   </svg>
                 </div>
                 <h3 className="text-xl font-black italic uppercase tracking-tighter text-white mb-2">Manual Priority Layer Active.</h3>
                 <p className="text-sm font-medium">Specify device make and model for a verified guide.</p>
               </div>
            )}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex gap-6 mb-12">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                   <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="flex-1 space-y-4 pt-2">
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{status || "Analyzing intent..."}</span>
                  <div className="h-4 bg-zinc-900/50 rounded-lg w-full animate-pulse"></div>
                  <div className="h-4 bg-zinc-900/50 rounded-lg w-2/3 animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 bg-gradient-to-t from-[#050505] to-transparent">
          <div className="max-w-3xl mx-auto relative">
            <div className="relative bg-[#111112] border border-white/5 rounded-2xl p-2.5 shadow-3xl focus-within:border-orange-500/30 transition-all">
              <div className="flex items-end gap-3 px-3">
                <textarea 
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                  placeholder="Identify your device (e.g. PlayStation 5 DualSense Controller)"
                  className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium py-3 px-2 resize-none text-white placeholder-zinc-700"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="mb-1 p-3 bg-orange-600 text-white rounded-xl hover:bg-orange-500 disabled:bg-zinc-900 disabled:text-zinc-700 transition-all shadow-xl shadow-orange-900/20 active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

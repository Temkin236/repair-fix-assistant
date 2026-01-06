
import React from 'react';

interface LandingProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500/30">
      <nav className="h-20 flex items-center justify-between px-8 md:px-16 border-b border-white/5 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center font-black italic">F</div>
           <span className="text-xl font-black tracking-tighter uppercase italic">FixMaster <span className="text-orange-500">Pro</span></span>
        </div>
        <button onClick={onStart} className="px-6 py-2 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all">Launch Console</button>
      </nav>

      <section className="pt-32 pb-24 px-8 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8">
             <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
             <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Verified Manuals Only</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] uppercase italic">Precision <br/> <span className="text-orange-600">Diagnostics.</span></h1>
          <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12">The world's first AI repair assistant that strictly prioritizes iFixit documentation over machine speculation.</p>
          <button onClick={onStart} className="px-12 py-5 bg-orange-600 rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl shadow-orange-900/40 hover:bg-orange-500 transition-all active:scale-95">Initialize Repair Session</button>
        </div>
      </section>

      <section className="py-24 px-8 border-y border-white/5">
         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 bg-zinc-900/30 rounded-3xl border border-white/5 group hover:border-orange-500/20 transition-all">
               <div className="w-12 h-12 bg-orange-600/10 rounded-xl flex items-center justify-center mb-6 text-orange-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
               </div>
               <h3 className="text-xl font-black mb-3 italic">iFixit Sync</h3>
               <p className="text-zinc-500 text-sm leading-relaxed">Direct integration with the iFixit database ensures you get instructions written by experts, not guessed by tokens.</p>
            </div>
            <div className="p-8 bg-zinc-900/30 rounded-3xl border border-white/5 group hover:border-blue-500/20 transition-all">
               <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center mb-6 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
               </div>
               <h3 className="text-xl font-black mb-3 italic">Safety First</h3>
               <p className="text-zinc-500 text-sm leading-relaxed">Automatic detection of high-risk repairs with mandatory safety protocols before any instructions are delivered.</p>
            </div>
            <div className="p-8 bg-zinc-900/30 rounded-3xl border border-white/5 group hover:border-emerald-500/20 transition-all">
               <div className="w-12 h-12 bg-emerald-600/10 rounded-xl flex items-center justify-center mb-6 text-emerald-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
               </div>
               <h3 className="text-xl font-black mb-3 italic">Agentic Fallback</h3>
               <p className="text-zinc-500 text-sm leading-relaxed">If the official manual is missing, our agentically routes to community forums to find the most relevant crowd-sourced fix.</p>
            </div>
         </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">FixMaster AI Framework © 2024</footer>
    </div>
  );
};

export default LandingPage;

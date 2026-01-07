
import React from 'react';
import { RepairSession, User } from '../types';

interface SidebarProps {
  sessions: RepairSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewRepair: () => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sessions, activeSessionId, onSelectSession, onNewRepair, user, onLogout }) => {
  return (
    <div className="w-80 bg-[#0d0d0e] border-r border-zinc-800 flex flex-col h-full shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.7a1.3 1.3 0 00-1.2 0L5 11l-3-1 4-1 4-3 1 3 3 1-3 1 1.7 3.7zM16.5 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M7.5 13.5L5 16l2.5 2.5m5-5L15 11l2.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white leading-none">FixMaster <span className="text-orange-500">PRO</span></h1>
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Enterprise Edition</span>
          </div>
        </div>

        <button 
          onClick={onNewRepair}
          className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-100 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-zinc-800 mb-8 font-semibold text-sm shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Launch New Assistant
        </button>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4 px-2">
               <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Recent Diagnostics</h3>
               <span className="text-[10px] text-zinc-700 font-mono">{sessions.length}</span>
            </div>
            <div className="space-y-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
              {sessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className={`w-full text-left px-3 py-3 rounded-xl transition-all flex items-center gap-3 border ${
                    activeSessionId === session.id 
                    ? 'bg-zinc-800/50 border-zinc-700 text-white shadow-sm' 
                    : 'border-transparent text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${activeSessionId === session.id ? 'bg-orange-500' : 'bg-zinc-800'}`}></div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-xs font-bold leading-tight mb-0.5">{session.title}</p>
                    <p className="text-[10px] opacity-50 font-mono">{new Date(session.createdAt).toLocaleDateString()}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-auto p-6 space-y-4">
        <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
           <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Global Analytics</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
           </div>
           <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                 <span className="text-[10px] text-zinc-600 font-bold">Verified</span>
                 <span className="text-sm font-mono text-white">{user.repairsCompleted}</span>
              </div>
              <div className="flex flex-col items-end">
                 <span className="text-[10px] text-zinc-600 font-bold">Accuracy</span>
                 <span className="text-sm font-mono text-emerald-500">98.4%</span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-3 p-2 group cursor-pointer" onClick={onLogout}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-xs font-bold text-white shadow-inner">
            {user.name.substring(0,2).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-white truncate leading-tight">{user.name}</p>
            <p className="text-[10px] text-zinc-600 truncate uppercase font-bold tracking-tighter hover:text-red-500 transition-colors">Sign Out</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

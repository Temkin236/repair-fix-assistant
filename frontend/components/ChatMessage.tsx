
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  const renderContent = (content: string) => {
    // Detect image URLs inside the text [Image: url]
    const parts = content.split(/(\[Image: https?:\/\/[^\]]+\])/g);
    
    return parts.map((part, i) => {
      const imgMatch = part.match(/\[Image: (https?:\/\/[^\]]+)\]/);
      if (imgMatch) {
        return (
          <div key={i} className="my-8 group relative">
             <div className="absolute -inset-2 bg-orange-600/5 rounded-[24px] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
             <div className="relative rounded-[20px] overflow-hidden border border-white/[0.05] bg-black p-1 shadow-2xl">
                <img src={imgMatch[1]} alt="Repair documentation" className="w-full h-auto rounded-[16px]" loading="lazy" />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                   <span className="text-[8px] font-black text-white uppercase tracking-widest">Verified Manual Frame</span>
                </div>
             </div>
          </div>
        );
      }
      
      const formatted = part
        .replace(/\*\*(.*?)\*\*/g, '<b class="text-white font-black">$1</b>')
        .replace(/^Step (\d+): (.*)$/gm, (match, num, text) => {
           return `
             <div class="flex gap-4 mb-6 group/step">
                <div class="w-8 h-8 rounded-lg bg-orange-600/10 border border-orange-500/20 flex items-center justify-center shrink-0 font-black text-orange-500 text-xs">
                   ${num}
                </div>
                <div class="pt-1 text-zinc-300 font-medium leading-relaxed">${text}</div>
             </div>
           `;
        })
        .replace(/\n/g, '<br/>');

      return <span key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  return (
    <div className={`flex w-full mb-12 ${isAssistant ? 'justify-start' : 'justify-end animate-in fade-in slide-in-from-right-4 duration-500'}`}>
      <div className={`flex max-w-[95%] md:max-w-[85%] gap-6 ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center mt-1 shadow-2xl ${
          isAssistant 
          ? 'bg-[#111] border border-white/5 text-orange-500 italic font-black' 
          : 'bg-orange-600 border border-orange-400 text-white shadow-orange-900/20'
        }`}>
          {isAssistant ? 'F' : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          )}
        </div>

        <div className={`flex flex-col gap-3 ${!isAssistant && 'items-end'}`}>
          <div className={`px-6 py-5 rounded-[24px] text-[15px] leading-[1.8] shadow-sm transition-all ${
            isAssistant 
            ? 'bg-[#111112] border border-white/[0.04] text-zinc-400 font-medium' 
            : 'bg-zinc-800 border border-white/5 text-white'
          }`}>
            <div className="whitespace-pre-wrap">
              {renderContent(message.content)}
            </div>
          </div>

          {isAssistant && message.metadata && (
            <div className="flex flex-wrap gap-3 px-1">
              {message.metadata.verifiedSource && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{message.metadata.verifiedSource}</span>
                </div>
              )}
              {message.metadata.safetyLevel === 'warning' && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest">High-Risk Alert</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

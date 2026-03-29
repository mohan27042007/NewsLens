import React, { useState, useRef, useEffect } from 'react';
import { Send, UserCircle, Bot, Loader2 } from 'lucide-react';
import { useBriefingStore } from '../store/useBriefingStore';

interface Citation {
  article_id: string;
  exact_quote: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  citations?: Citation[];
  isLoading?: boolean;
}

export const QAPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: "init",
    role: "assistant",
    text: "I have read all articles in this story arc. Ask me anything."
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedFollowUps, setSuggestedFollowUps] = useState<string[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const { meta } = useBriefingStore();

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    
    const textToSend = overrideText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: textToSend };
    const loadingMsgId = (Date.now() + 1).toString();
    const loadingMsg: Message = { id: loadingMsgId, role: 'assistant', text: '', isLoading: true };

    // Optimistically update UI
    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setInputValue('');
    setIsLoading(true);
    setSuggestedFollowUps([]); // clear pills while searching

    try {
      // Build conversational memory history (last 6 actual messages, excluding init/loading)
      const historyPayload = messages
        .filter(m => m.id !== 'init' && !m.isLoading && m.text.trim().length > 0)
        .slice(-6)
        .map(m => ({ role: m.role, content: m.text }));

      const response = await fetch('http://localhost:8000/api/qa/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_id: meta?.topic_id || "rbi-rates-2026",
          user_query: textToSend,
          chat_history: historyPayload
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Remove loading bubble, add real response
        setMessages(prev => prev.map(m => {
          if (m.id === loadingMsgId) {
            return {
              ...m,
              text: data.answer || "I found no direct answer in the sources.",
              citations: data.citations || [],
              isLoading: false
            };
          }
          return m;
        }));

        if (data.suggested_follow_ups) {
           setSuggestedFollowUps(data.suggested_follow_ups);
        }

      } else {
        throw new Error('API Error');
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.map(m => m.id === loadingMsgId ? { ...m, text: "Failed to connect to AI engine.", isLoading: false } : m));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border border-[#222] rounded-xl bg-[#111] overflow-hidden">
      
      {/* Scrollable Message History */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex space-x-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 
                 ${msg.role === 'user' ? 'bg-[#333]' : 'bg-primary/20 text-primary'}`}>
                {msg.role === 'user' ? <UserCircle className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              
              {/* Bubble Body */}
              <div className="flex flex-col space-y-2">
                 <div className={`p-4 rounded-2xl text-sm leading-relaxed
                   ${msg.role === 'user' ? 'bg-[#2A2A2A] text-white rounded-tr-sm' : 'bg-[#1A1A1A] border border-[#222] text-[#E0E0E0] rounded-tl-sm shadow-lg'}`}>
                   
                   {msg.isLoading ? (
                     <span className="flex items-center space-x-2 text-[#777]">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Searching story arc...</span>
                     </span>
                   ) : (
                     <p>{msg.text}</p>
                   )}
                 </div>

                 {/* Citations Footer */}
                 {msg.citations && msg.citations.length > 0 && (
                   <div className="space-y-2 mt-2 ml-1">
                      {msg.citations.map((cite, idx) => (
                        <div key={idx} className="bg-[#0A0A0A] border border-[#333] border-l-2 border-l-primary p-2 flex flex-col rounded-r-md">
                           <span className="text-[10px] font-bold text-primary uppercase mb-1">{cite.article_id}</span>
                           <span className="text-xs text-[#888] italic">"{cite.exact_quote}"</span>
                        </div>
                      ))}
                   </div>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Follow-ups Pill Bar */}
      {suggestedFollowUps.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
           {suggestedFollowUps.map((suggestion, idx) => (
             <button 
               key={idx}
               onClick={() => handleSubmit(undefined, suggestion)}
               className="text-[11px] bg-[#222] border border-[#444] hover:bg-primary/20 hover:border-primary text-[#CCC] px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap"
             >
               {suggestion}
             </button>
           ))}
        </div>
      )}

      {/* Chat Input Box */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-[#222] bg-[#0A0A0A] flex space-x-3 items-end relative">
        <textarea 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          disabled={isLoading}
          placeholder="Ask any question about this story arc..." 
          className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors resize-none disabled:opacity-50"
          rows={1}
        />
        <button 
          type="submit" 
          disabled={!inputValue.trim() || isLoading}
          className="absolute right-6 bottom-6 text-[#777] hover:text-primary transition-colors disabled:opacity-30 disabled:hover:text-[#777]"
        >
           <Send className="w-5 h-5" />
        </button>
      </form>

    </div>
  );
};

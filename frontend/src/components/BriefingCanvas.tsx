import React from 'react';
import { useBriefingStore } from '../store/useBriefingStore';
import { useBriefingStream } from '../hooks/useBriefingStream';
import { BriefingCard } from './BriefingCard';
import { StoryScrubber } from './StoryScrubber';
import { DisagreementPanel } from './DisagreementPanel';
import { QAPanel } from './QAPanel';
import { SidebarMenu } from './SidebarMenu';
import { Activity, MessageSquare, Menu, UserCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export const BriefingCanvas: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();

  // Connect and listen to the WebSocket for dynamic topic
  const { isConnected, error } = useBriefingStream(topicId || 'rbi-rates-2026');
  
  // Pull from Zustand Global Store
  const { meta, cards, disagreements, setCards } = useBriefingStore();
  
  // Persona & UI State
  const [activePersona, setActivePersona] = useState<'student'|'investor'>('student');
  const [isToggling, setIsToggling] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleTogglePersona = async (persona: 'student'|'investor') => {
    if (persona === activePersona) return;
    setIsToggling(true);
    setActivePersona(persona);

    try {
      const response = await fetch('http://localhost:8000/api/persona/toggle', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            topic_id: meta?.topic_id || "rbi-rates-2026",
            target_persona: persona,
            user_watchlist: ["HDFCBANK", "TATAMOTORS"]
         })
      });
      if (response.ok) {
         const data = await response.json();
         if (data.updated_cards) {
            setCards(data.updated_cards);
         }
      }
    } catch(e) {
      console.error('Failed to toggle persona', e);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="min-h-screen text-textPrimary flex flex-col font-sans">
      
      <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Top Navbar */}
      <header className="border-b border-[#222] px-6 py-4 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-30">
        <div className="flex items-center space-x-3">
          <button onClick={() => setIsSidebarOpen(true)} className="hover:text-white transition-colors">
            <Menu className="w-5 h-5 text-textSecondary" />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-white border-l border-[#333] pl-3">NewsLens</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-textSecondary hidden sm:block">
            {meta ? (
              <>Processed {meta.total_articles_found} articles</>
            ) : (
              'Waiting for stream...'
            )}
          </span>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              {isConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </span>
            <span className="text-sm font-medium">{isConnected ? 'LIVE' : 'DISCONNECTED'}</span>
          </div>
          <div className="flex items-center space-x-6 border-l pl-6 border-[#333]">
            <div className="flex items-center space-x-2">
              <UserCircle2 className="w-5 h-5 text-gray-500" />
              <div className="bg-[#111] border border-[#333] rounded-full flex text-sm font-bold p-1 relative overflow-hidden">
                {isToggling && <div className="absolute inset-0 bg-white/5 animate-pulse rounded-full pointer-events-none" />}
                <button 
                  onClick={() => handleTogglePersona('student')}
                  className={`px-4 py-1.5 rounded-full transition-all z-10 ${activePersona === 'student' ? 'bg-primary text-white shadow-lg' : 'text-[#777] hover:text-white'}`}>
                    Student
                </button>
                <button 
                  onClick={() => handleTogglePersona('investor')}
                  className={`px-4 py-1.5 rounded-full transition-all z-10 ${activePersona === 'investor' ? 'bg-primary text-white shadow-lg' : 'text-[#777] hover:text-white'}`}>
                    Investor
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main 3-Column Canvas */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-6 grid grid-cols-10 gap-8">
        
        {/* LEFT COLUMN: Timeline (20%) */}
        <aside className="col-span-10 md:col-span-2 space-y-4 relative">
            <div className="sticky top-24 pt-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#666] mb-6 flex items-center">
                 <Activity className="w-4 h-4 mr-2" />
                 Story Arc Tracker
              </h2>
              
              <div className="pt-4 border-t border-[#222]">
                 <StoryScrubber />
              </div>
            </div>
        </aside>

        {/* CENTER COLUMN: Briefing Canvas Cards (50%) */}
        <main className="col-span-10 md:col-span-5 relative py-8 px-2">
            
            {meta && (
              <div className="mb-10 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{meta.display_title}</h1>
                <p className="text-xl text-textSecondary tracking-wide">AI Synthesized Briefing</p>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-900 text-red-400 p-4 rounded mb-6">
                <strong>Connection Error:</strong> {error}
              </div>
            )}

            <div className="space-y-4">
              {cards.map((card) => (
                <BriefingCard key={card.card_index} card={card} />
              ))}
              
              {isConnected && cards.length < 5 && (
                 <div className="flex items-center justify-center py-10 opacity-70">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 text-sm text-textSecondary uppercase tracking-widest animate-pulse">
                      Synthesizing intelligence...
                    </span>
                 </div>
              )}
            </div>
        </main>

        {/* RIGHT COLUMN: Q&A / Context (30%) */}
        <aside className="col-span-10 md:col-span-3 pb-20">
           <div className="sticky top-24 pt-4">
              
              {disagreements && disagreements.length > 0 && <DisagreementPanel />}

              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xs font-bold uppercase tracking-widest text-[#666] flex items-center">
                   <MessageSquare className="w-4 h-4 mr-2" />
                   Context Q&A
                 </h2>
              </div>
              
              <QAPanel />
           </div>
        </aside>

      </div>
    </div>
  );
};

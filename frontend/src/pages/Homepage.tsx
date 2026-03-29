import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';

const TRENDING_TOPICS = [
  {
    id: 'rbi-rates-2026',
    title: 'RBI Rate Decision',
    category: 'Markets',
    sentiment: 'negative',
  },
  {
    id: 'budget-2026',
    title: 'Union Budget 2026',
    category: 'Policy',
    sentiment: 'positive',
  },
  {
    id: 'reliance-jio-5g',
    title: 'Reliance Jio 5G',
    category: 'Technology',
    sentiment: 'positive',
  }
];

export const Homepage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check if it's one of the exact mocked topics
    const normalizedQuery = searchQuery.toLowerCase();
    const isMocked = TRENDING_TOPICS.some(
      t => t.id.includes(normalizedQuery) || t.title.toLowerCase().includes(normalizedQuery)
    );

    if (isMocked) {
      const target = TRENDING_TOPICS.find(t => t.title.toLowerCase().includes(normalizedQuery) || t.id.includes(normalizedQuery))?.id;
      if (target) {
        navigate(`/briefing/${target}`);
      }
    } else {
      // Per Hackathon Phase 5 Prompt: Prevent generic backend crashes from unmocked topics
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center pt-32 px-6">
      
      {/* Brand Header */}
      <div className="flex items-center space-x-3 mb-16">
        <TrendingUp className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-extrabold tracking-tight">NewsLens</h1>
      </div>

      <div className="max-w-3xl w-full text-center space-y-6">
        <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight">
          Stop reading news.<br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#666]"> Start exploring it.</span>
        </h2>
        <p className="text-lg text-[#888] pb-8">
          AI-powered intelligence briefings for every story that matters to you.
        </p>

        {/* Global Search Interface */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto w-full group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="w-6 h-6 text-[#555] group-focus-within:text-primary transition-colors" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowAlert(false);
            }}
            placeholder="Try: RBI rates, Budget 2026, Reliance Jio..."
            className="w-full bg-[#111] border-2 border-[#222] rounded-full py-5 pl-16 pr-6 text-xl text-white placeholder:text-[#444] shadow-2xl focus:outline-none focus:border-primary/50 focus:bg-[#1A1A1A] transition-all"
          />
          <button type="submit" className="absolute right-3 top-3 bottom-3 bg-primary hover:bg-primary/80 transition-colors text-white px-6 rounded-full font-bold flex items-center space-x-2">
            <span>Analyze</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Fallback Demo Alert Modal */}
          {showAlert && (
            <div className="absolute -bottom-16 left-0 right-0 mx-auto w-fit bg-[#222] border border-primary/50 text-white text-sm px-6 py-3 rounded-full flex items-center shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
               <AlertCircle className="w-4 h-4 text-primary mr-3" />
               Live web scraping is disabled in the demo environment. Please select a Trending Topic.
            </div>
          )}
        </form>

        {/* Trending Dashboard */}
        <div className="pt-24 w-full text-left">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#555] mb-6 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Live Trending Arcs
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRENDING_TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => navigate(`/briefing/${topic.id}`)}
                className="group bg-[#111] border border-[#222] hover:border-[#444] rounded-2xl p-6 text-left transition-all hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-black/50 overflow-hidden relative"
              >
                {/* Accent Ribbon */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#222] to-[#111] group-hover:from-primary/50 group-hover:to-transparent transition-colors" />
                
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                    topic.category === 'Markets' ? 'bg-primary/10 text-primary' : 
                    topic.category === 'Policy' ? 'bg-blue-500/10 text-blue-400' : 
                    'bg-green-500/10 text-green-400'
                  }`}>
                    {topic.category}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-medium text-[#777] uppercase">Sentiment</span>
                    <span className={`w-2 h-2 rounded-full ${topic.sentiment === 'negative' ? 'bg-primary animate-pulse' : 'bg-green-500'}`} />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{topic.title}</h4>
                <div className="flex items-center text-xs text-[#666] group-hover:text-[#888] transition-colors mt-auto pt-2">
                  <span>Explore 30-day arc</span>
                  <ArrowRight className="w-3 h-3 ml-2" />
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOPICS = [
  {
    id: 'rbi-rates-2026',
    title: 'RBI Rate Decision',
    badge: 'Markets',
    sentiment: 'negative',
  },
  {
    id: 'budget-2026',
    title: 'Union Budget 2026',
    badge: 'Policy',
    sentiment: 'positive',
  },
  {
    id: 'reliance-jio-5g',
    title: 'Reliance Jio 5G',
    badge: 'Technology',
    sentiment: 'positive',
  }
];

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleSelect = (topicId: string) => {
    onClose();
    navigate(`/briefing/${topicId}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Overlay Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[320px] bg-[#0A0A0A] border-r border-[#222] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#222]">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#777] flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                Trending Stories
              </h2>
              <button onClick={onClose} className="text-[#555] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Topic List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleSelect(topic.id)}
                  className="w-full text-left bg-[#111] hover:bg-[#1A1A1A] border border-[#222] hover:border-[#444] rounded-xl p-4 transition-all group flex flex-col relative overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      topic.badge === 'Markets' ? 'bg-primary/20 text-primary border border-primary/30' : 
                      'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {topic.badge}
                    </span>
                    <div className="flex items-center space-x-2">
                       <span className={`w-2 h-2 rounded-full ${topic.sentiment === 'negative' ? 'bg-primary animate-pulse' : 'bg-green-500'}`} />
                    </div>
                  </div>
                  
                  <h3 className="text-[15px] font-bold text-white mb-1 group-hover:text-primary transition-colors">{topic.title}</h3>
                  <div className="flex items-center text-xs text-[#666] mt-2 group-hover:text-[#AAA]">
                     Read latest intelligence <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                </button>
              ))}
            </div>
            
            <div className="p-6 border-t border-[#222] bg-[#0A0A0A]">
               <button 
                 onClick={() => { onClose(); navigate('/'); }}
                 className="w-full text-center text-xs font-bold uppercase tracking-widest text-[#555] hover:text-white transition-colors"
               >
                 Back to Homepage
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

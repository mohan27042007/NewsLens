import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBriefingStore } from '../store/useBriefingStore';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const DisagreementPanel: React.FC = () => {
  const { disagreements } = useBriefingStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!disagreements || disagreements.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 rounded-xl border-2 border-orange-500/50 overflow-hidden bg-[#1A0F0A] shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-orange-500/10 hover:bg-orange-500/20 transition-colors"
      >
        <div className="flex items-center space-x-3 text-orange-400">
           <AlertCircle className="w-5 h-5" />
           <span className="font-bold tracking-wide uppercase text-sm">
             {disagreements.length} Critical Take{disagreements.length > 1 ? 's' : ''} Found
           </span>
        </div>
        <div className="text-orange-400">
           {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-orange-500/20"
          >
            <div className="p-4 space-y-4">
               {disagreements.map((take, idx) => (
                 <div key={idx} className="bg-[#111] border border-orange-500/30 p-4 rounded-lg">
                    <p className="font-semibold text-textPrimary mb-3">{take.summary_claim}</p>
                    <div className="pl-3 border-l-2 border-orange-500/50 mb-2">
                      <p className="text-sm text-[#AAA] italic mb-1">Contrarian View:</p>
                      <p className="text-sm text-textSecondary">{take.contrarian_quote}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-[#333]">
                      <span className="text-orange-400/80 hover:text-orange-400 cursor-pointer transition-colors">Inspect Minority Source</span>
                      <span className="text-[#666]">{take.contrarian_article_id}</span>
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

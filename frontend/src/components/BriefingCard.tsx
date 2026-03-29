import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBriefingStore } from '../store/useBriefingStore';
import type { BriefingCardData } from '../store/useBriefingStore';

interface BriefingCardProps {
  card: BriefingCardData;
}

export const BriefingCard: React.FC<BriefingCardProps> = ({ card }) => {
  const { activeArticleId } = useBriefingStore();
  
  const isActive = useMemo(() => {
    if (!activeArticleId || !card.citations) return false;
    return card.citations.some(c => c.article_id === activeArticleId);
  }, [activeArticleId, card.citations]);
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={card.card_index + card.content.substring(0, 10)}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ 
           opacity: 1, 
           y: 0, 
           scale: isActive ? 1.02 : 1,
           borderColor: isActive ? '#E8372A' : '#333',
           boxShadow: isActive ? '0 0 20px rgba(232, 55, 42, 0.2)' : '0 4px 6px rgba(0,0,0,0.1)'
        }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-surface border-2 rounded-xl p-6 mb-6 overflow-hidden transition-all"
      >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-primary tracking-wide uppercase">
          {card.card_type.replace('_', ' ')}
        </span>
        <span className="text-xs text-textSecondary bg-[#222] px-2 py-1 rounded-full">
          Card {card.card_index}
        </span>
      </div>
      
      <h3 className="text-2xl font-bold text-textPrimary mb-3">{titleCase(card.title)}</h3>
      
      {/* We are rendering the text natively first before we handle citations */}
      <p className="text-textSecondary leading-relaxed text-lg">
        {card.content}
      </p>
      
      {card.citations && card.citations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#333]">
           <p className="text-xs text-[#777]">
             {card.citations.length} Source{card.citations.length > 1 ? 's' : ''} cited. Inspect mode stub.
           </p>
        </div>
      )}
      </motion.div>
    </AnimatePresence>
  );
};

function titleCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

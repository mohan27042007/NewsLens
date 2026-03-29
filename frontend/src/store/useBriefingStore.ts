import { create } from 'zustand';

export type BriefingMeta = {
  topic_id: string;
  display_title: string;
  total_articles_found: number;
} | null;

export type TimelineEvent = {
  date: string;
  headline: string;
  sentiment_score: number;
  primary_article_id: string;
};

export type Citation = {
  article_id: string;
  exact_quote: string;
};

export type BriefingCardData = {
  card_index: number;
  card_type: string;
  title: string;
  content: string;
  citations: Citation[];
};

export type Disagreement = {
  summary_claim: string;
  majority_view_article_id: string;
  contrarian_article_id: string;
  contrarian_quote: string;
};

interface BriefingStoreState {
  meta: BriefingMeta;
  timeline: TimelineEvent[];
  cards: BriefingCardData[];
  disagreements: Disagreement[];
  activeArticleId: string | null;
  
  // Actions
  setMeta: (meta: BriefingMeta) => void;
  setTimeline: (events: TimelineEvent[]) => void;
  addCard: (card: BriefingCardData) => void;
  setDisagreements: (takes: Disagreement[]) => void;
  setActiveArticleId: (id: string | null) => void;
  setCards: (cards: BriefingCardData[]) => void;
  clearData: () => void;
  reset: () => void;
}

export const useBriefingStore = create<BriefingStoreState>((set) => ({
  meta: null,
  timeline: [],
  cards: [],
  disagreements: [],
  activeArticleId: null,

  setMeta: (meta) => set({ meta }),
  setTimeline: (events) => set({ timeline: events }),
  addCard: (card) => set((state) => {
    // Prevent duplicates by index
    if (state.cards.some((c) => c.card_index === card.card_index)) {
        return state;
    }
    // Add and sort by index
    const newCards = [...state.cards, card].sort((a, b) => a.card_index - b.card_index);
    return { cards: newCards };
  }),
  setDisagreements: (takes) => set({ disagreements: takes }),
  setActiveArticleId: (id) => set({ activeArticleId: id }),
  setCards: (incomingCards) => set((state) => {
    const merged = [...state.cards];
    incomingCards.forEach(incomingCard => {
      const idx = merged.findIndex(c => c.card_index === incomingCard.card_index);
      if (idx >= 0) {
        merged[idx] = incomingCard; 
      } else {
        merged.push(incomingCard);
      }
    });
    return { cards: merged.sort((a, b) => a.card_index - b.card_index) };
  }),
  clearData: () => set({ 
    cards: [], 
    timeline: [], 
    disagreements: [], 
    meta: null, 
    activeArticleId: null 
  }),
  reset: () => set({ meta: null, timeline: [], cards: [], disagreements: [], activeArticleId: null })
}));

/**
 * 报价单状态管理
 */
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface PriceData {
  templateType: string;
  regions?: any[];
  provinceOverrides?: Record<string, any>;
  [key: string]: any;
}

interface QuoteState {
  currentQuote: any | null;
  priceHistory: PriceData[];
  historyIndex: number;
  
  // Actions
  setCurrentQuote: (quote: any) => void;
  updatePriceData: (priceData: PriceData) => void;
  saveSnapshot: (priceData: PriceData) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  resetHistory: () => void;
}

export const useQuoteStore = create<QuoteState>()(
  immer((set, get) => ({
    currentQuote: null,
    priceHistory: [],
    historyIndex: -1,

    setCurrentQuote: (quote: any) => {
      set((state) => {
        state.currentQuote = quote;
        if (quote?.price_data) {
          state.priceHistory = [quote.price_data];
          state.historyIndex = 0;
        }
      });
    },

    updatePriceData: (priceData: PriceData) => {
      set((state) => {
        if (state.currentQuote) {
          state.currentQuote.price_data = priceData;
        }
      });
    },

    saveSnapshot: (priceData: PriceData) => {
      set((state) => {
        // 删除当前位置之后的历史
        state.priceHistory = state.priceHistory.slice(0, state.historyIndex + 1);
        // 添加新快照
        state.priceHistory.push(priceData);
        state.historyIndex = state.priceHistory.length - 1;
        // 更新当前报价单
        if (state.currentQuote) {
          state.currentQuote.price_data = priceData;
        }
      });
    },

    undo: () => {
      const state = get();
      if (state.canUndo()) {
        set((draft) => {
          draft.historyIndex -= 1;
          if (draft.currentQuote) {
            draft.currentQuote.price_data = draft.priceHistory[draft.historyIndex];
          }
        });
      }
    },

    redo: () => {
      const state = get();
      if (state.canRedo()) {
        set((draft) => {
          draft.historyIndex += 1;
          if (draft.currentQuote) {
            draft.currentQuote.price_data = draft.priceHistory[draft.historyIndex];
          }
        });
      }
    },

    canUndo: () => {
      const state = get();
      return state.historyIndex > 0;
    },

    canRedo: () => {
      const state = get();
      return state.historyIndex < state.priceHistory.length - 1;
    },

    resetHistory: () => {
      set((state) => {
        state.priceHistory = [];
        state.historyIndex = -1;
      });
    },
  }))
);
